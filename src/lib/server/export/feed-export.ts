import { getGraphqlClient, gql } from "$lib/server/graphql";

const MAX_PAGES = 2000;
const MAX_FEEDS = 200_000;

const ExportFeeds = gql`
	query ExportFeeds($uid: Int!, $after: Cursor) {
		allFeeds(
			first: 500
			after: $after
			filter: { userId: { equalTo: $uid } }
			orderBy: [ROW_ID_ASC]
		) {
			nodes {
				rowId
				content
				username
				userId
				userColor
				time
				grubTime
			}
			pageInfo {
				hasNextPage
				endCursor
			}
			totalCount
		}
	}
`;

interface ExportFeedNode {
	rowId: number;
	content: string;
	username: string;
	userId: number;
	userColor: string;
	time: string;
	grubTime: string;
}

interface ExportFeedsResult {
	allFeeds: {
		nodes: Array<ExportFeedNode | null>;
		pageInfo: { hasNextPage: boolean; endCursor: string | null };
		totalCount: number;
	} | null;
}

export interface ExportedFeed {
	rowId: number;
	time: string;
	grubTime: string;
	content: string;
	userColor: string;
	username: string;
	userId: number;
}

export const fetchAllFeeds = async (uid: number): Promise<ExportedFeed[]> => {
	const client = getGraphqlClient();
	const feeds: ExportedFeed[] = [];
	let after: string | null = null;
	let pages = 0;

	while (pages < MAX_PAGES && feeds.length < MAX_FEEDS) {
		pages++;
		const result = (await client.request(ExportFeeds, { uid, after })) as ExportFeedsResult;
		const conn = result.allFeeds;
		if (!conn) break;

		for (const node of conn.nodes) {
			if (!node) continue;
			feeds.push({
				rowId: node.rowId,
				time: node.time,
				grubTime: node.grubTime,
				content: node.content,
				userColor: node.userColor,
				username: node.username,
				userId: node.userId,
			});
		}

		if (!conn.pageInfo.hasNextPage) break;
		after = conn.pageInfo.endCursor ?? null;
		if (!after) break;
	}

	return feeds;
};

export const buildExportJson = (
	luoguUid: string,
	luoguUsername: string,
	feeds: ExportedFeed[],
): string =>
	JSON.stringify(
		{
			schema: "benben.sbs/feed-export",
			version: 1,
			exported_at: new Date().toISOString(),
			platform: "luogu",
			platform_uid: luoguUid,
			platform_username: luoguUsername,
			total: feeds.length,
			feeds,
		},
		null,
		2,
	);
