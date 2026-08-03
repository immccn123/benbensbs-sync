<script lang="ts">
	import { avatarUrl, type CcbColor, type GuestFeed } from "$lib/ccb";

	let {
		feed,
		guessed,
		actualColor,
		contentHtml,
		timeStr,
	}: {
		feed: GuestFeed;
		guessed: string | null;
		actualColor: CcbColor;
		contentHtml: string;
		timeStr: string;
	} = $props();

	const revealed = $derived(guessed !== null);
</script>

<div class="border border-base-content/20 bg-base-200/50">
	<div class="flex items-center gap-4 px-5 py-4 border-b border-base-content/15">
		<div
			class="w-14 h-14 overflow-hidden relative shrink-0 border border-base-content/25 bg-base-300/60 select-none"
			aria-hidden="true"
		>
			<img
				src={avatarUrl(feed.userId)}
				alt=""
				draggable="false"
				class="absolute top-0 left-0 pointer-events-none"
				style="width: 12px; height: 12px; transform: scale(4.7); transform-origin: top left; filter: blur(2px); image-rendering: pixelated;"
			/>
		</div>
		<div class="min-w-0">
			<span
				class="block font-bold text-lg break-all transition-all duration-500 {revealed
					? ''
					: 'select-none pointer-events-none'}"
				style="filter: blur({revealed ? '0px' : '7px'}); color: {revealed
					? actualColor.hex
					: '#000'};"
				aria-hidden={revealed ? undefined : "true"}
			>
				{feed.username}
			</span>
			<span class="block font-mono text-[11px] opacity-40 mt-0.5">{timeStr}</span>
		</div>
	</div>
	<div class="px-5 py-4 prose prose-sm max-w-none wrap-break-word text-base-content/90">
		{@html contentHtml}
	</div>
</div>
