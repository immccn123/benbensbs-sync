import { GraphQLClient, gql, ClientError } from "graphql-request";
import { env } from "$env/dynamic/private";

let client: GraphQLClient | null = null;

export const getGraphqlClient = (): GraphQLClient => {
	if (!client) {
		if (!env.GRAPHQL_URL) throw new Error("GRAPHQL_URL is not set");
		if (!env.API_KEY) throw new Error("API_KEY is not set");
		client = new GraphQLClient(env.GRAPHQL_URL, {
			headers: {
				Authorization: `Bearer ${env.API_KEY}`,
			},
		});
	}
	return client;
};

export { gql, ClientError };
export type { GraphQLClient } from "graphql-request";
