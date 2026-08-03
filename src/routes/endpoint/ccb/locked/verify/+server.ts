import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getGraphqlClient, gql } from "$lib/server/graphql";
import type { FeedByRowIdQuery, FeedByRowIdQueryVariables } from "$lib/server/graphql-operations";
import { db } from "$lib/server/db";
import { ccbPuzzle, ccbOptionStat, ccbUserStat } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { CCB_COLORS, colorIndex, normalizeColorKey } from "$lib/ccb";

const FeedByRowId = gql`
	query FeedByRowId($rowId: Int!) {
		feedByRowId(rowId: $rowId) {
			rowId
			content
			username
			userId
			userColor
			time
		}
	}
`;

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	const currentUser = locals.user;

	let body: { tmpId?: unknown; chosen?: unknown };
	try {
		body = await request.json();
	} catch {
		throw error(400, "Bad request body");
	}

	const tmpId = typeof body.tmpId === "string" ? body.tmpId : "";
	const chosenRaw = typeof body.chosen === "string" ? body.chosen : "";
	if (!tmpId || !CCB_COLORS.some((c) => c.key === chosenRaw)) {
		throw error(400, "Bad request body");
	}

	const puzzle = await db
		.select()
		.from(ccbPuzzle)
		.where(eq(ccbPuzzle.tmpId, tmpId))
		.limit(1)
		.then(([x]) => x);

	if (!puzzle || puzzle.userId !== currentUser.id || puzzle.expiresAt < new Date()) {
		return json({ status: "notfound" });
	}

	const feedResult = await getGraphqlClient().request<
		FeedByRowIdQuery,
		FeedByRowIdQueryVariables
	>(FeedByRowId, { rowId: puzzle.rowId });

	const feed = feedResult.feedByRowId;
	if (!feed) return json({ status: "notfound" });

	const actualKey = normalizeColorKey(feed.userColor);
	const chosenKey = normalizeColorKey(chosenRaw);
	const correct = chosenKey === actualKey;
	const offset = Math.abs(colorIndex(chosenKey) - colorIndex(actualKey));
	const isDuplicate = puzzle.status === "completed";

	if (!isDuplicate) {
		await db
			.update(ccbPuzzle)
			.set({ status: "completed" })
			.where(eq(ccbPuzzle.tmpId, tmpId));

		await db
			.insert(ccbOptionStat)
			.values({ rowId: puzzle.rowId, option: chosenKey, count: 1 })
			.onConflictDoUpdate({
				target: [ccbOptionStat.rowId, ccbOptionStat.option],
				set: { count: sql`${ccbOptionStat.count} + 1` },
			});

		await db
			.insert(ccbUserStat)
			.values({
				userId: currentUser.id,
				total: 1,
				offsetSum: offset,
				correctSum: correct ? 1 : 0,
			})
			.onConflictDoUpdate({
				target: ccbUserStat.userId,
				set: {
					total: sql`${ccbUserStat.total} + 1`,
					offsetSum: sql`${ccbUserStat.offsetSum} + ${offset}`,
					correctSum: sql`${ccbUserStat.correctSum} + ${correct ? 1 : 0}`,
				},
			});
	}

	const statRows = await db
		.select()
		.from(ccbOptionStat)
		.where(eq(ccbOptionStat.rowId, puzzle.rowId));
	const countByKey = new Map(statRows.map((r) => [r.option, r.count]));
	const distribution = CCB_COLORS.map((c) => ({
		key: c.key,
		count: countByKey.get(c.key) ?? 0,
	}));

	return json({
		status: isDuplicate ? "duplicate" : "ok",
		correct,
		actualKey,
		reveal: {
			username: feed.username,
			userId: feed.userId,
			userColor: feed.userColor,
		},
		distribution,
	});
};
