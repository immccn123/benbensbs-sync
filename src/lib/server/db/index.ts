import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { lt } from "drizzle-orm";
import { ccbScoreExpr } from "$lib/server/ccb-score";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

const cleanupRevokedSessions = () =>
	db
		.delete(schema.revokedSession)
		.where(lt(schema.revokedSession.exp, new Date()))
		.catch(() => {});

const cleanupExpiredCcbPuzzles = () =>
	db
		.delete(schema.ccbPuzzle)
		.where(lt(schema.ccbPuzzle.expiresAt, new Date()))
		.catch(() => {});

export const refreshCcbScores = () =>
	db
		.update(schema.ccbUserStat)
		.set({ score: ccbScoreExpr })
		.catch(() => {});

const runCleanup = () => {
	cleanupRevokedSessions();
	cleanupExpiredCcbPuzzles();
	refreshCcbScores();
};

runCleanup();
setInterval(runCleanup, 3_600_000);
