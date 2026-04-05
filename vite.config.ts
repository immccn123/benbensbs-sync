import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import UnpluginTypia from "@typia/unplugin/vite";
import { defineConfig } from "vite";

import { exec } from "child_process";
import { promisify } from "util";

const pexec = promisify(exec);
const [version, lastmod] = (
	await Promise.allSettled([
		pexec("git describe --tags || git rev-parse --short HEAD"),
		pexec('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"'),
	])
).map((x) => (x.status === "fulfilled" ? x.value?.stdout.trim() : undefined));

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), UnpluginTypia()],
	define: {
		__VERSION__: `"${version}"`,
		__LASTMOD__: `"${lastmod}"`,
	},
});
