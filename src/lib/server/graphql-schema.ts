export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: unknown; output: unknown; }
  Datetime: { input: unknown; output: unknown; }
  RegClass: { input: string; output: string; }
};

export type CircleMention = Node & {
  __typename?: 'CircleMention';
  /** Reads a single `Feed` that is related to this `CircleMention`. */
  feedByFeedId?: Maybe<Feed>;
  feedId: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  mentioned: Scalars['Int']['output'];
  sender: Scalars['Int']['output'];
  time: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `CircleMention` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CircleMentionCondition = {
  /** Checks for equality with the object’s `feedId` field. */
  feedId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `mentioned` field. */
  mentioned?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `sender` field. */
  sender?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `time` field. */
  time?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `CircleMention` values. */
export type CircleMentionConnection = {
  __typename?: 'CircleMentionConnection';
  /** A list of edges which contains the `CircleMention` and cursor to aid in pagination. */
  edges: Array<Maybe<CircleMentionEdge>>;
  /** A list of `CircleMention` objects. */
  nodes: Array<Maybe<CircleMention>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CircleMention` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CircleMention` edge in the connection. */
export type CircleMentionEdge = {
  __typename?: 'CircleMentionEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CircleMention` at the end of the edge. */
  node?: Maybe<CircleMention>;
};

/** A filter to be used against `CircleMention` object types. All fields are combined with a logical ‘and.’ */
export type CircleMentionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CircleMentionFilter>>;
  /** Filter by the object’s `feedByFeedId` relation. */
  feedByFeedId?: InputMaybe<FeedFilter>;
  /** Filter by the object’s `feedId` field. */
  feedId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `mentioned` field. */
  mentioned?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CircleMentionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CircleMentionFilter>>;
  /** Filter by the object’s `sender` field. */
  sender?: InputMaybe<IntFilter>;
  /** Filter by the object’s `time` field. */
  time?: InputMaybe<DatetimeFilter>;
};

/** Methods to use when ordering `CircleMention`. */
export enum CircleMentionOrderBy {
  FeedIdAsc = 'FEED_ID_ASC',
  FeedIdDesc = 'FEED_ID_DESC',
  MentionedAsc = 'MENTIONED_ASC',
  MentionedDesc = 'MENTIONED_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SenderAsc = 'SENDER_ASC',
  SenderDesc = 'SENDER_DESC',
  TimeAsc = 'TIME_ASC',
  TimeDesc = 'TIME_DESC'
}

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

/** All input for the `dieselManageUpdatedAt` mutation. */
export type DieselManageUpdatedAtInput = {
  _tbl?: InputMaybe<Scalars['RegClass']['input']>;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our `dieselManageUpdatedAt` mutation. */
export type DieselManageUpdatedAtPayload = {
  __typename?: 'DieselManageUpdatedAtPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type Feed = Node & {
  __typename?: 'Feed';
  /** Reads and enables pagination through a set of `CircleMention`. */
  circleMentionsByFeedId: CircleMentionConnection;
  content: Scalars['String']['output'];
  /** Reads a single `FeedTakedown` that is related to this `Feed`. */
  feedTakedownByFeedId?: Maybe<FeedTakedown>;
  grubTime: Scalars['Datetime']['output'];
  hash: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['Int']['output'];
  time: Scalars['Datetime']['output'];
  userColor: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};


export type FeedCircleMentionsByFeedIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CircleMentionCondition>;
  filter?: InputMaybe<CircleMentionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CircleMentionOrderBy>>;
};

/** A condition to be used against `Feed` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type FeedCondition = {
  /** Checks for equality with the object’s `hash` field. */
  hash?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `time` field. */
  time?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Feed` values. */
export type FeedConnection = {
  __typename?: 'FeedConnection';
  /** A list of edges which contains the `Feed` and cursor to aid in pagination. */
  edges: Array<Maybe<FeedEdge>>;
  /** A list of `Feed` objects. */
  nodes: Array<Maybe<Feed>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Feed` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Feed` edge in the connection. */
export type FeedEdge = {
  __typename?: 'FeedEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Feed` at the end of the edge. */
  node?: Maybe<Feed>;
};

/** A filter to be used against `Feed` object types. All fields are combined with a logical ‘and.’ */
export type FeedFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FeedFilter>>;
  /** Filter by the object’s `circleMentionsByFeedId` relation. */
  circleMentionsByFeedId?: InputMaybe<FeedToManyCircleMentionFilter>;
  /** Some related `circleMentionsByFeedId` exist. */
  circleMentionsByFeedIdExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `feedTakedownByFeedId` relation. */
  feedTakedownByFeedId?: InputMaybe<FeedTakedownFilter>;
  /** A related `feedTakedownByFeedId` exists. */
  feedTakedownByFeedIdExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `hash` field. */
  hash?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FeedFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FeedFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `time` field. */
  time?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `username` field. */
  username?: InputMaybe<StringFilter>;
};

/** Methods to use when ordering `Feed`. */
export enum FeedOrderBy {
  HashAsc = 'HASH_ASC',
  HashDesc = 'HASH_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TimeAsc = 'TIME_ASC',
  TimeDesc = 'TIME_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type FeedTakedown = Node & {
  __typename?: 'FeedTakedown';
  batchId: Scalars['Int']['output'];
  /** Reads a single `Feed` that is related to this `FeedTakedown`. */
  feedByFeedId?: Maybe<Feed>;
  feedId: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['Int']['output'];
  /** Reads a single `TakedownBatch` that is related to this `FeedTakedown`. */
  takedownBatchByBatchId?: Maybe<TakedownBatch>;
};

/**
 * A condition to be used against `FeedTakedown` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type FeedTakedownCondition = {
  /** Checks for equality with the object’s `feedId` field. */
  feedId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['Int']['input']>;
};

/** A connection to a list of `FeedTakedown` values. */
export type FeedTakedownConnection = {
  __typename?: 'FeedTakedownConnection';
  /** A list of edges which contains the `FeedTakedown` and cursor to aid in pagination. */
  edges: Array<Maybe<FeedTakedownEdge>>;
  /** A list of `FeedTakedown` objects. */
  nodes: Array<Maybe<FeedTakedown>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FeedTakedown` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `FeedTakedown` edge in the connection. */
export type FeedTakedownEdge = {
  __typename?: 'FeedTakedownEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `FeedTakedown` at the end of the edge. */
  node?: Maybe<FeedTakedown>;
};

/** A filter to be used against `FeedTakedown` object types. All fields are combined with a logical ‘and.’ */
export type FeedTakedownFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FeedTakedownFilter>>;
  /** Filter by the object’s `feedByFeedId` relation. */
  feedByFeedId?: InputMaybe<FeedFilter>;
  /** Filter by the object’s `feedId` field. */
  feedId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FeedTakedownFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FeedTakedownFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `takedownBatchByBatchId` relation. */
  takedownBatchByBatchId?: InputMaybe<TakedownBatchFilter>;
};

/** Methods to use when ordering `FeedTakedown`. */
export enum FeedTakedownOrderBy {
  FeedIdAsc = 'FEED_ID_ASC',
  FeedIdDesc = 'FEED_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** A filter to be used against many `CircleMention` object types. All fields are combined with a logical ‘and.’ */
export type FeedToManyCircleMentionFilter = {
  /** Every related `CircleMention` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CircleMentionFilter>;
  /** No related `CircleMention` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CircleMentionFilter>;
  /** Some related `CircleMention` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CircleMentionFilter>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  dieselManageUpdatedAt?: Maybe<DieselManageUpdatedAtPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDieselManageUpdatedAtArgs = {
  input: DieselManageUpdatedAtInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads and enables pagination through a set of `CircleMention`. */
  allCircleMentions?: Maybe<CircleMentionConnection>;
  /** Reads and enables pagination through a set of `FeedTakedown`. */
  allFeedTakedowns?: Maybe<FeedTakedownConnection>;
  /** Reads and enables pagination through a set of `Feed`. */
  allFeeds?: Maybe<FeedConnection>;
  /** Reads and enables pagination through a set of `TakedownBatch`. */
  allTakedownBatches?: Maybe<TakedownBatchConnection>;
  /** Reads a single `CircleMention` using its globally unique `ID`. */
  circleMention?: Maybe<CircleMention>;
  /** Get a single `CircleMention`. */
  circleMentionBySenderAndMentionedAndFeedId?: Maybe<CircleMention>;
  /** Reads a single `Feed` using its globally unique `ID`. */
  feed?: Maybe<Feed>;
  /** Get a single `Feed`. */
  feedByRowId?: Maybe<Feed>;
  /** Reads a single `FeedTakedown` using its globally unique `ID`. */
  feedTakedown?: Maybe<FeedTakedown>;
  /** Get a single `FeedTakedown`. */
  feedTakedownByFeedId?: Maybe<FeedTakedown>;
  /** Get a single `FeedTakedown`. */
  feedTakedownByRowId?: Maybe<FeedTakedown>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `TakedownBatch` using its globally unique `ID`. */
  takedownBatch?: Maybe<TakedownBatch>;
  /** Get a single `TakedownBatch`. */
  takedownBatchByBatchId?: Maybe<TakedownBatch>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllCircleMentionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CircleMentionCondition>;
  filter?: InputMaybe<CircleMentionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CircleMentionOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllFeedTakedownsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FeedTakedownCondition>;
  filter?: InputMaybe<FeedTakedownFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeedTakedownOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllFeedsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FeedCondition>;
  filter?: InputMaybe<FeedFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FeedOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTakedownBatchesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TakedownBatchCondition>;
  filter?: InputMaybe<TakedownBatchFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TakedownBatchOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCircleMentionArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCircleMentionBySenderAndMentionedAndFeedIdArgs = {
  feedId: Scalars['Int']['input'];
  mentioned: Scalars['Int']['input'];
  sender: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedByRowIdArgs = {
  rowId: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedTakedownArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedTakedownByFeedIdArgs = {
  feedId: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedTakedownByRowIdArgs = {
  rowId: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTakedownBatchArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTakedownBatchByBatchIdArgs = {
  batchId: Scalars['Int']['input'];
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type TakedownBatch = Node & {
  __typename?: 'TakedownBatch';
  batchId: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  takedownTime: Scalars['Datetime']['output'];
  takedownUserId: Scalars['Int']['output'];
};

/**
 * A condition to be used against `TakedownBatch` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TakedownBatchCondition = {
  /** Checks for equality with the object’s `batchId` field. */
  batchId?: InputMaybe<Scalars['Int']['input']>;
};

/** A connection to a list of `TakedownBatch` values. */
export type TakedownBatchConnection = {
  __typename?: 'TakedownBatchConnection';
  /** A list of edges which contains the `TakedownBatch` and cursor to aid in pagination. */
  edges: Array<Maybe<TakedownBatchEdge>>;
  /** A list of `TakedownBatch` objects. */
  nodes: Array<Maybe<TakedownBatch>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TakedownBatch` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TakedownBatch` edge in the connection. */
export type TakedownBatchEdge = {
  __typename?: 'TakedownBatchEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TakedownBatch` at the end of the edge. */
  node?: Maybe<TakedownBatch>;
};

/** A filter to be used against `TakedownBatch` object types. All fields are combined with a logical ‘and.’ */
export type TakedownBatchFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TakedownBatchFilter>>;
  /** Filter by the object’s `batchId` field. */
  batchId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TakedownBatchFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TakedownBatchFilter>>;
};

/** Methods to use when ordering `TakedownBatch`. */
export enum TakedownBatchOrderBy {
  BatchIdAsc = 'BATCH_ID_ASC',
  BatchIdDesc = 'BATCH_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}
