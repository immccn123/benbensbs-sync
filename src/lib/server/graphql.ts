import { GraphQLClient, gql, ClientError } from "graphql-request";
import { env } from "$env/dynamic/private";

import { Agent, ProxyAgent, fetch as undiciFetch } from "undici";

const keepAlive = {
	keepAliveTimeout: 600_000,
	keepAliveMaxTimeout: 600_000,
	connections: 64,
	pipelining: 1,
};

const dispatcher = import.meta.env.HTTPS_PROXY
	? new ProxyAgent({ uri: import.meta.env.HTTPS_PROXY, ...keepAlive })
	: new Agent(keepAlive);

let client: GraphQLClient | null = null;

export const getGraphqlClient = (): GraphQLClient => {
	if (!client) {
		if (!env.GRAPHQL_URL) throw new Error("GRAPHQL_URL is not set");
		if (!env.API_KEY) throw new Error("API_KEY is not set");
		client = new GraphQLClient(env.GRAPHQL_URL, {
			headers: {
				Authorization: `Bearer ${env.API_KEY}`,
			},
			fetch: (input, init) =>
				undiciFetch(input as Parameters<typeof undiciFetch>[0], {
					...init,
					dispatcher,
				} as Parameters<typeof undiciFetch>[1]) as unknown as Promise<Response>,
		});
	}
	return client;
};

export { gql, ClientError };
export type { GraphQLClient } from "graphql-request";
