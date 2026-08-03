/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from './graphql-schema';

export type FeedSampleQueryVariables = Exact<{
  start?: unknown;
  end?: unknown;
  count?: number | null | undefined;
}>;


export type FeedSampleQuery = { sampledFeedsByRange: { nodes: Array<{ rowId: number, content: string, username: string, userId: number, userColor: string, time: unknown } | null> } | null };

export type FeedByRowIdQueryVariables = Exact<{
  rowId: number;
}>;


export type FeedByRowIdQuery = { feedByRowId: { rowId: number, content: string, username: string, userId: number, userColor: string, time: unknown } | null };
