import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getGraphqlClient, gql } from "$lib/server/graphql";
import type { FeedSampleQuery, FeedSampleQueryVariables } from "$lib/server/graphql-operations";
import _chance from "chance";
import type { Feed } from "$lib/server/graphql-schema";

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

export const GET: RequestHandler = async ({ url }) => {
	const year = url.searchParams.get("year");
	let latestTime: Date;

	if (year === null) {
		throw error(400, "Bad request body");
	}

	if (year === "latest") {
		latestTime = new Date();
	} else if (2024 <= +year && +year < new Date().getFullYear()) {
		// Notice: 11 here means December, because in JavaScript Date, months are 0-indexed (0 = January, 11 = December)
		latestTime = new Date(+year, 11, 31, 23, 59, 59);
	} else {
		throw error(400, "Bad request param: year");
	}

	let earliestTime: Date = new Date(
		latestTime.getFullYear() - 1,
		latestTime.getMonth(),
		latestTime.getDate(),
		latestTime.getHours(),
		latestTime.getMinutes(),
		latestTime.getSeconds(),
	);

	const sampleResult = await getGraphqlClient().request<
		FeedSampleQuery,
		FeedSampleQueryVariables
	>(FeedSample, {
		start: earliestTime.toISOString(),
		end: latestTime.toISOString(),
		count: 20,
	});

	const data: Omit<Feed, "__typename" | "circleMentionsByFeedId" | "grubTime" | "hash" | "id">[] =
		sampleResult.sampledFeedsByRange?.nodes
			?.filter((node): node is NonNullable<typeof node> => node !== null)
			.map((node) => ({
				rowId: node.rowId,
				content: node.content,
				time: node.time,
				username: node.username,
				userId: node.userId,
				userColor: node.userColor,
			})) ?? [];

	return json(data);
};
