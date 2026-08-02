import type { CodegenConfig } from "@graphql-codegen/cli";
import importTypesPreset from "@graphql-codegen/import-types-preset";
// @ts-ignore
import { readFileSync } from "node:fs";

const env: Record<string, string> = {};
for (const line of readFileSync(".env", "utf8").split("\n")) {
	const m = line.match(/^([A-Z_]+)="(.*)"\s*$/);
	if (m) env[m[1]] = m[2];
}

if (!env.GRAPHQL_URL) throw new Error("GRAPHQL_URL is not set in .env");
if (!env.API_KEY) throw new Error("API_KEY is not set in .env");

const config: CodegenConfig = {
	schema: {
		[env.GRAPHQL_URL]: {
			headers: { Authorization: `Bearer ${env.API_KEY}` },
		},
	},
	documents: ["src/routes/**/*.ts"],
	generates: {
		"./schema.graphql": {
			plugins: ["schema-ast"],
		},
		"src/lib/server/graphql-schema.ts": {
			plugins: ["typescript"],
			config: {
				scalars: {
					RegClass: "string",
				},
			},
		},
		"src/lib/server/graphql-operations.ts": {
			preset: importTypesPreset,
			presetConfig: {
				typesPath: "./graphql-schema",
			},
			plugins: ["typescript-operations"],
		},
	},
};

export default config;
