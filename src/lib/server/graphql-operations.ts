/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from './graphql-schema';

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: unknown;
  /** Equal to the specified value. */
  equalTo?: unknown;
  /** Greater than the specified value. */
  greaterThan?: unknown;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: unknown;
  /** Included in the specified list. */
  in?: Array<unknown> | null | undefined;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: boolean | null | undefined;
  /** Less than the specified value. */
  lessThan?: unknown;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: unknown;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: unknown;
  /** Not equal to the specified value. */
  notEqualTo?: unknown;
  /** Not included in the specified list. */
  notIn?: Array<unknown> | null | undefined;
};

export type OneFeedQueryVariables = Exact<{
  timeBetween?: Types.DatetimeFilter | null | undefined;
  offset?: number | null | undefined;
}>;


export type OneFeedQuery = { allFeeds: { nodes: Array<{ id: string } | null> } | null };

export type FeedsCountByTimeQueryVariables = Exact<{
  timeBetween?: Types.DatetimeFilter | null | undefined;
}>;


export type FeedsCountByTimeQuery = { allFeeds: { totalCount: number } | null };
