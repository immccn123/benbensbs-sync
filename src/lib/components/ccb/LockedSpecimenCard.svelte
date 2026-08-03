<script lang="ts">
	import { avatarUrl, maskAvatarCells, type CcbColor } from "$lib/ccb";

	let {
		masked,
		contentHtml,
		tmpId = "",
		usernameMask = "",
		date = "",
		timeOfDay = "",
		reveal = null,
		actualColor,
	}: {
		masked: boolean;
		contentHtml: string;
		tmpId?: string;
		usernameMask?: string;
		date?: string;
		timeOfDay?: string;
		reveal?: {
			username: string;
			userId: number;
			userColor: string;
		} | null;
		actualColor?: CcbColor;
	} = $props();

	const cells = $derived(masked ? maskAvatarCells(tmpId || "ccb") : []);
</script>

<div class="border border-base-content/20 bg-base-200/50">
	<div class="flex items-center gap-4 px-5 py-4 border-b border-base-content/15">
		{#if masked}
			<div
				class="w-14 h-14 shrink-0 border border-base-content/25 bg-base-300/60 overflow-hidden select-none"
				aria-hidden="true"
			>
				<div
					class="grid grid-cols-3 w-full h-full"
					style="filter: blur(2px); transform: scale(1.15);"
				>
					{#each cells as cell}
						<div style="background: {cell};"></div>
					{/each}
				</div>
			</div>
			<div class="min-w-0">
				<span
					class="block font-bold text-lg break-all text-black select-none"
					aria-hidden="true"
				>
					{usernameMask}
				</span>
				<span class="block font-mono text-[11px] opacity-40 mt-0.5"
					>{date} {timeOfDay}</span
				>
			</div>
		{:else if reveal}
			<div
				class="w-14 h-14 overflow-hidden shrink-0 border border-base-content/25 bg-base-300/60 select-none"
				aria-hidden="true"
			>
				<img
					src={avatarUrl(reveal.userId)}
					alt=""
					draggable="false"
					class="w-full h-full object-cover pointer-events-none"
				/>
			</div>
			<div class="min-w-0">
				<span
					class="block font-bold text-lg break-all"
					style="color: {actualColor?.hex ?? '#000'};"
				>
					{reveal.username}
				</span>
				<span class="block font-mono text-[11px] opacity-40 mt-0.5"
					>{date} {timeOfDay}</span
				>
			</div>
		{/if}
	</div>
	<div class="px-5 py-4 prose prose-sm max-w-none wrap-break-word text-base-content/90">
		{@html contentHtml}
	</div>
</div>
