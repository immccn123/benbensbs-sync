<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex items-center gap-3 mb-2 opacity-70 font-mono">
	{@render children()}
	<div class="h-px grow bg-base-content opacity-20"></div>
	<span class="text-xs">{__VERSION__} ({__LASTMOD__})</span>
</div>
