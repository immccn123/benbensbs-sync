<script lang="ts">
	import type { PageData } from "./$types";
	import katex from "katex";
	import "katex/dist/katex.min.css";
	import "../../panel.css";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import CcbHeader from "$lib/components/ccb/CcbHeader.svelte";
	import CcbTitle from "$lib/components/ccb/CcbTitle.svelte";

	let { data }: { data: PageData } = $props();

	const GRID = "grid grid-cols-[2.5rem_1fr_4.5rem_4rem_4rem_3.5rem] gap-2 items-center";

	const formulaHtml = katex.renderToString(
		String.raw`\text{score} = K \cdot \dfrac{1}{1 + e^{-0.5\,(x - 20)}} \cdot e^{-0.3\,\bar{d}} \cdot acc`,
		{ throwOnError: false },
	);

	const scoreOf = (score: number | null): string => (score === null ? "—" : score.toFixed(1));
	const accuracyOf = (e: { total: number; correctSum: number }): string =>
		e.total === 0 ? "—" : `${Math.round((e.correctSum / e.total) * 100)}%`;
	const avgOffsetOf = (e: { total: number; offsetSum: number }): string =>
		e.total === 0 ? "—" : (e.offsetSum / e.total).toFixed(2);

	const meInTop = $derived(
		data.me != null && data.entries.some((e) => e.userId === data.me!.userId),
	);
</script>

<svelte:head><title>Benben.sbs OLSI — CCB ██ 排行榜</title></svelte:head>

<div class="min-h-screen bg-base-100 font-body text-base-content relative">
	<DotGrid />

	<div class="max-w-3xl mx-auto px-6 py-10">
		<CcbHeader>
			<a
				href="/ccb"
				class="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
				>← 返回</a
			>
			<span class="text-xs opacity-30">|</span>
			<span class="text-xs font-bold uppercase tracking-[0.2em]">██████ LEADERBOARD</span>
		</CcbHeader>

		<div class="mt-10 mb-6">
			<CcbTitle size="text-3xl md:text-4xl" />
		</div>

		<div class="mb-6 border border-base-content/25 bg-base-200/50 px-4 py-3 text-xs leading-relaxed">
			<p class="font-bold">每小时更新一次</p>
			<p class="mt-1 opacity-70">未显示用户名请注销后登录重试</p>
		</div>

		{#if data.entries.length === 0}
			<div class="border border-base-content/20 bg-base-200/50 p-8 text-center">
				<p class="font-mono text-xs uppercase tracking-[0.3em] opacity-50">暂无入榜记录</p>
			</div>
		{:else}
			<div class="border border-base-content/20 bg-base-200/50">
				<div
					class="{GRID} px-4 py-2.5 border-b border-base-content/20 font-mono text-[10px] uppercase tracking-[0.2em]"
				>
					<span class="opacity-50">排名</span>
					<span class="opacity-50">用户</span>
					<span class="flex items-center justify-end gap-1">
						<span class="opacity-50">分数</span>
						<span class="group relative inline-flex">
							<button
								type="button"
								aria-label="评分公式"
								class="w-3.5 h-3.5 rounded-full border border-current text-[8px] leading-none opacity-50 cursor-help transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
							>
								?
							</button>
							<span
								role="tooltip"
								class="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-max max-w-[22rem] border border-base-content/30 bg-base-100 px-3.5 py-2.5 text-left leading-relaxed tracking-normal normal-case opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
							>
								<span class="block text-sm">{@html formulaHtml}</span>
								<span class="mt-1.5 block font-mono text-[10px] opacity-60">
									x = 累计次数 | d̄ = 平均偏移 | acc = 正确率 | K = 1000
								</span>
							</span>
						</span>
					</span>
					<span class="text-right opacity-50">正确率</span>
					<span class="text-right opacity-50">平均偏移</span>
					<span class="text-right opacity-50">次数</span>
				</div>

				{#each data.entries as e (e.userId)}
					{@const isMe = data.me?.userId === e.userId}
					<div
						class="{GRID} px-4 py-3 border-b border-base-content/10 last:border-b-0 {isMe
							? 'bg-primary/10 border-l-2 border-l-primary'
							: ''}"
					>
						<span
							class="font-display font-bold tabular-nums {e.rank <= 3
								? 'text-primary'
								: 'opacity-50'}"
						>
							{e.rank}
						</span>
						<span class="flex items-center gap-2.5 min-w-0">
							{#if e.avatarUrl}
								<img
									src={e.avatarUrl}
									alt=""
									class="w-7 h-7 shrink-0 border border-base-content/20 object-cover"
								/>
							{:else}
								<span
									class="w-7 h-7 shrink-0 bg-base-content/10 border border-base-content/20 flex items-center justify-center text-xs"
								>
									{e.name.charAt(0) || "?"}
								</span>
							{/if}
							<span class="truncate text-sm font-bold">{e.name}</span>
							{#if isMe}
								<span
									class="font-mono text-[9px] uppercase tracking-[0.2em] text-primary shrink-0"
									>You</span
								>
							{/if}
						</span>
						<span class="text-right font-mono text-sm font-bold tabular-nums"
							>{scoreOf(e.score)}</span
						>
						<span class="text-right font-mono text-sm tabular-nums opacity-70"
							>{accuracyOf(e)}</span
						>
						<span class="text-right font-mono text-sm tabular-nums opacity-70"
							>{avgOffsetOf(e)}</span
						>
						<span class="text-right font-mono text-sm tabular-nums opacity-70"
							>{e.total}</span
						>
					</div>
				{/each}
			</div>
		{/if}

		{#if data.me && !meInTop}
			<div class="mt-4 border border-base-content/20 bg-base-200/50">
				<div
					class="{GRID} px-4 py-3 {data.me.score === null
						? 'opacity-60'
						: 'bg-primary/10 border-l-2 border-l-primary'}"
				>
					<span class="font-display font-bold tabular-nums opacity-50">
						{data.me.rank ?? "—"}
					</span>
					<span class="flex items-center gap-2.5 min-w-0">
						{#if data.me.avatarUrl}
							<img
								src={data.me.avatarUrl}
								alt=""
								class="w-7 h-7 shrink-0 border border-base-content/20 object-cover"
							/>
						{:else}
							<span
								class="w-7 h-7 shrink-0 bg-base-content/10 border border-base-content/20 flex items-center justify-center text-xs"
							>
								{data.me.name.charAt(0) || "?"}
							</span>
						{/if}
						<span class="truncate text-sm font-bold">{data.me.name}</span>
						<span
							class="font-mono text-[9px] uppercase tracking-[0.2em] text-primary shrink-0"
							>You</span
						>
					</span>
					<span class="text-right font-mono text-sm font-bold tabular-nums"
						>{scoreOf(data.me.score)}</span
					>
					<span class="text-right font-mono text-sm tabular-nums opacity-70"
						>{accuracyOf(data.me)}</span
					>
					<span class="text-right font-mono text-sm tabular-nums opacity-70"
						>{avgOffsetOf(data.me)}</span
					>
					<span class="text-right font-mono text-sm tabular-nums opacity-70"
						>{data.me.total}</span
					>
				</div>
				{#if data.me.score === null}
					<p class="px-4 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
						分数将在下次更新后计算
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
