import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { lt } from "drizzle-orm";

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

const runCleanup = () => {
	cleanupRevokedSessions();
	cleanupExpiredCcbPuzzles();
};

runCleanup();
setInterval(runCleanup, 3_600_000);
