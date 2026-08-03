import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getGraphqlClient, gql } from "$lib/server/graphql";
import type { FeedSampleQuery, FeedSampleQueryVariables } from "$lib/server/graphql-operations";
import { db } from "$lib/server/db";
import { ccbPuzzle, user } from "$lib/server/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { dateOf, maskUsername, timeOfDayOf } from "$lib/ccb";

const FeedSample = gql`
	query FeedSample($start: Datetime, $end: Datetime, $count: Int = 20) {
		sampledFeedsByRange(startTime: $start, endTime: $end, sampleLimit: $count) {
			nodes {
				rowId
				content
				username
				userId
				userColor
				time
			}
		}
	}
`;

const HOURLY_LIMIT = 3600;
const SAMPLE_COUNT = 20;
const TTL_MS = 60 * 60 * 1000;

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	const currentUser = locals.user;

	const year = url.searchParams.get("year");
	let latestTime: Date;

	if (year === null) {
		throw error(400, "Bad request body");
	}

	if (2024 <= +year && +year < new Date().getFullYear()) {
		latestTime = new Date(+year, 11, 31, 23, 59, 59);
	} else {
		throw error(400, "Bad request param: year");
	}

	const earliestTime: Date = new Date(
		latestTime.getFullYear() - 1,
		latestTime.getMonth(),
		latestTime.getDate(),
		latestTime.getHours(),
		latestTime.getMinutes(),
		latestTime.getSeconds(),
	);

	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
	const [{ value: recentCount }] = await db
		.select({ value: sql<number>`count(*)::int` })
		.from(ccbPuzzle)
		.where(and(eq(ccbPuzzle.userId, currentUser.id), gte(ccbPuzzle.createdAt, oneHourAgo)));

	if (recentCount + SAMPLE_COUNT > HOURLY_LIMIT) {
		await db
			.update(user)
			.set({
				permission: currentUser.permission & ~1,
				restrictionReason: "猜猜犇请求频率过高",
			})
			.where(eq(user.id, currentUser.id));
		throw error(429, "猜猜犇请求频率过高");
	}

	const sampleResult = await getGraphqlClient().request<
		FeedSampleQuery,
		FeedSampleQueryVariables
	>(FeedSample, {
		start: earliestTime.toISOString(),
		end: latestTime.toISOString(),
		count: SAMPLE_COUNT,
	});

	const nodes =
		sampleResult.sampledFeedsByRange?.nodes?.filter(
			(node): node is NonNullable<typeof node> => node !== null,
		) ?? [];

	if (nodes.length === 0) return json([]);

	const now = new Date();
	const expiresAt = new Date(now.getTime() + TTL_MS);
	const rows = nodes.map((node) => ({
		tmpId: nanoid(21),
		rowId: node.rowId,
		userId: currentUser.id,
		status: "pending",
		expiresAt,
	}));

	await db.insert(ccbPuzzle).values(rows);

	const masked = nodes.map((node, i) => ({
		tmpId: rows[i].tmpId,
		content: node.content,
		date: dateOf(node.time as string),
		timeOfDay: timeOfDayOf(node.time as string),
		usernameMask: maskUsername(node.username),
	}));

	return json(masked);
};
