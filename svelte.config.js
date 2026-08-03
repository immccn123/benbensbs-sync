import adapter from "@deno/svelte-adapter";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$hook: "src/hooks",
		},
	},
};

export default config;
