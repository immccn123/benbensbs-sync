import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { ccbUserStat, user } from "$lib/server/db/schema";
import { desc, eq, gte, sql } from "drizzle-orm";

const TOP_N = 50;

export interface LeaderboardEntry {
	rank: number;
	userId: number;
	name: string;
	avatarUrl: string | null;
	total: number;
	offsetSum: number;
	correctSum: number;
	score: number;
}

export interface LeaderboardMe {
	rank: number | null;
	userId: number;
	name: string;
	avatarUrl: string | null;
	total: number;
	offsetSum: number;
	correctSum: number;
	score: number | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const rows = await db
		.select({
			userId: ccbUserStat.userId,
			total: ccbUserStat.total,
			offsetSum: ccbUserStat.offsetSum,
			correctSum: ccbUserStat.correctSum,
			score: ccbUserStat.score,
			displayName: user.displayName,
			sub: user.sub,
			avatarUrl: user.avatarUrl,
		})
		.from(ccbUserStat)
		.innerJoin(user, eq(ccbUserStat.userId, user.id))
		.where(gte(ccbUserStat.score, 0))
		.orderBy(desc(ccbUserStat.score), desc(ccbUserStat.total))
		.limit(TOP_N);

	const entries: LeaderboardEntry[] = rows.map((r, i) => ({
		rank: i + 1,
		userId: r.userId,
		name: r.displayName ?? r.sub,
		avatarUrl: r.avatarUrl,
		total: r.total,
		offsetSum: r.offsetSum,
		correctSum: r.correctSum,
		score: r.score,
	}));

	let me: LeaderboardMe | null = null;
	if (locals.user) {
		const stat = await db
			.select()
			.from(ccbUserStat)
			.where(eq(ccbUserStat.userId, locals.user.id))
			.limit(1)
			.then(([x]) => x);

		if (stat && stat.total > 0) {
			let rank: number | null = null;
			if (stat.score >= 0) {
				const [{ value: better }] = await db
					.select({ value: sql<number>`count(*)::int` })
					.from(ccbUserStat)
					.where(sql`${ccbUserStat.score} > ${stat.score}`);
				rank = better + 1;
			}

			me = {
				rank,
				userId: stat.userId,
				name: locals.user.displayName ?? locals.user.sub,
				avatarUrl: locals.user.avatarUrl,
				total: stat.total,
				offsetSum: stat.offsetSum,
				correctSum: stat.correctSum,
				score: stat.score >= 0 ? stat.score : null,
			};
		}
	}

	return { entries, me };
};
