<script lang="ts">
	import { onMount } from "svelte";
	import { marked } from "marked";
	import DOMPurify from "dompurify";
	import "../panel.css";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import CcbHeader from "$lib/components/ccb/CcbHeader.svelte";
	import CcbTitle from "$lib/components/ccb/CcbTitle.svelte";
	import ColorOption from "$lib/components/ccb/ColorOption.svelte";
	import LockedSpecimenCard from "$lib/components/ccb/LockedSpecimenCard.svelte";
	import { CCB_COLORS, colorOf, colorIndex, type TimeOfDay } from "$lib/ccb";

	marked.setOptions({ breaks: true, gfm: true });

	interface LockedFeed {
		tmpId: string;
		content: string;
		date: string;
		timeOfDay: TimeOfDay;
		usernameMask: string;
	}

	interface Reveal {
		username: string;
		userId: number;
		userColor: string;
	}

	interface VerifyResponse {
		status: "ok" | "duplicate" | "notfound";
		correct?: boolean;
		actualKey?: string;
		reveal?: Reveal;
		distribution?: { key: string; count: number }[];
	}

	const renderMarkdown = (md: string): string => {
		try {
			const html = marked.parse(md ?? "", { async: false }) as string;
			return DOMPurify.sanitize(html);
		} catch {
			return DOMPurify.sanitize(md ?? "");
		}
	};

	let feeds = $state<LockedFeed[]>([]);
	let status = $state<"loading" | "ready" | "error">("loading");
	let index = $state(0);
	let selected = $state<string | null>(null);
	let guessedKey = $state<string | null>(null);
	let verifying = $state(false);
	let result = $state<VerifyResponse | null>(null);
	let stat = $state({ total: 0, offsetSum: 0, correctSum: 0 });
	let loadingMore = false;

	const currentYear = new Date().getFullYear();
	const YEARS: number[] = [];
	for (let y = 2024; y < currentYear; y++) YEARS.push(y);
	let year = $state(YEARS[YEARS.length - 1] ?? 2024);
	let loadId = 0;

	const current = $derived(feeds[index] as LockedFeed | undefined);
	const contentHtml = $derived(current ? renderMarkdown(current.content) : "");
	const actualColor = $derived(result?.actualKey ? colorOf(result.actualKey) : undefined);
	const maxCount = $derived(
		result?.distribution ? Math.max(...result.distribution.map((d) => d.count), 0) : 0,
	);
	const countOf = (key: string): number =>
		result?.distribution?.find((d) => d.key === key)?.count ?? 0;

	const accuracyPct = $derived(
		stat.total === 0 ? null : Math.round((stat.correctSum / stat.total) * 100),
	);
	const avgOffset = $derived(stat.total === 0 ? null : (stat.offsetSum / stat.total).toFixed(2));

	const fetchFeeds = async (y: number): Promise<LockedFeed[]> => {
		const res = await fetch(`/endpoint/ccb/locked/sample?year=${y}`);
		if (res.status === 429) throw new Error("banned");
		if (!res.ok) throw new Error();
		const data = (await res.json()) as LockedFeed[];
		if (!Array.isArray(data)) throw new Error();
		return data;
	};

	const loadFeeds = async (y: number) => {
		const id = ++loadId;
		status = "loading";
		try {
			const data = await fetchFeeds(y);
			if (id !== loadId) return;
			if (data.length === 0) throw new Error();
			feeds = data;
			index = 0;
			status = "ready";
		} catch {
			if (id !== loadId) return;
			status = "error";
		}
	};

	const setYear = (y: number) => {
		if (y === year || status === "loading" || verifying) return;
		year = y;
		selected = null;
		guessedKey = null;
		result = null;
		void loadFeeds(y);
	};

	const fetchStats = async () => {
		try {
			const res = await fetch("/endpoint/ccb/locked/stats");
			if (res.ok) stat = await res.json();
		} catch {}
	};

	onMount(async () => {
		void fetchStats();
		void loadFeeds(year);
	});

	const refill = async () => {
		if (loadingMore) return;
		if (feeds.length - index > 5) return;
		loadingMore = true;
		const y = year;
		const id = loadId;
		try {
			const more = await fetchFeeds(y);
			if (id === loadId && y === year) feeds = [...feeds, ...more];
		} catch {
			// 下一次推进时重试
		} finally {
			loadingMore = false;
		}
	};

	const selectColor = (key: string) => {
		if (result !== null || verifying) return;
		selected = key;
	};

	const commitGuess = async () => {
		if (result !== null || verifying || selected === null || !current) return;
		verifying = true;
		const chosen = selected;
		guessedKey = chosen;
		try {
			const res = await fetch("/endpoint/ccb/locked/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tmpId: current.tmpId, chosen }),
			});
			if (!res.ok) throw new Error();
			const data = (await res.json()) as VerifyResponse;
			result = data;
			if (data.status === "ok" && data.actualKey) {
				const offset = Math.abs(colorIndex(chosen) - colorIndex(data.actualKey));
				stat = {
					total: stat.total + 1,
					offsetSum: stat.offsetSum + offset,
					correctSum: stat.correctSum + (data.correct ? 1 : 0),
				};
			}
		} catch {
			result = { status: "notfound" };
		} finally {
			verifying = false;
		}
	};

	const next = () => {
		index++;
		selected = null;
		guessedKey = null;
		result = null;
		void refill();
	};

	const revealed = $derived(result !== null && result.status !== "notfound");
</script>

<svelte:head><title>Benben.sbs OLSI — CCB ██ 模式</title></svelte:head>

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
			<span class="text-xs font-bold uppercase tracking-[0.2em]">██████ MODE</span>
		</CcbHeader>

		<div class="flex items-end justify-between gap-4 mt-10 mb-6">
			<CcbTitle size="text-3xl md:text-4xl" />
			<div class="text-right font-mono text-xs shrink-0 mb-1 leading-relaxed">
				{#if stat.total === 0}
					<span class="opacity-50">暂无记录</span>
				{:else}
					<div>累计正确率, 平均偏移量, 累计次数</div>
					<div>{accuracyPct}%, {avgOffset}, {stat.total}</div>
				{/if}
			</div>
		</div>

		<div class="flex items-center gap-2 flex-wrap mb-8">
			<span class="font-mono text-[11px] uppercase tracking-[0.2em] opacity-40 mr-1"
				>Year</span
			>
			{#each YEARS as y}
				<button
					onclick={() => setYear(y)}
					disabled={status === "loading" || verifying}
					class="font-mono text-xs px-3 py-1 border transition-colors {year === y
						? 'border-primary text-primary font-bold'
						: 'border-base-content/20 opacity-50 hover:border-primary hover:text-primary hover:opacity-100'} {status ===
						'loading' || verifying
						? 'cursor-not-allowed'
						: ''}"
				>
					{y}
				</button>
			{/each}
		</div>

		{#if status === "loading"}
			<div class="py-24 text-center">
				<span class="loading loading-spinner loading-md text-primary"></span>
				<p class="font-mono text-[11px] uppercase tracking-[0.3em] opacity-50 mt-5">
					正在抽取档案
				</p>
			</div>
		{:else if status === "error"}
			<div class="border border-error/40 bg-base-200/50 p-8">
				<h2 class="font-display text-2xl font-bold tracking-tight mb-2">抽取失败</h2>
				<p class="text-sm opacity-70 mb-5">无法获取帖子档案，请稍后重试。</p>
				<button
					class="border border-base-content/40 px-5 py-2 text-sm font-bold hover:border-primary hover:text-primary transition-colors"
					onclick={() => location.reload()}
				>
					重试
				</button>
			</div>
		{:else if current}
			<LockedSpecimenCard
				masked={!revealed}
				{contentHtml}
				tmpId={current.tmpId}
				usernameMask={current.usernameMask}
				date={current.date}
				timeOfDay={current.timeOfDay}
				reveal={result?.reveal ?? null}
				{actualColor}
			/>

			<div class="mt-7">
				{#each CCB_COLORS as c}
					{@const isActual = result?.actualKey === c.key}
					{@const isPicked = guessedKey === c.key}
					<ColorOption
						color={c}
						fraction={revealed
							? maxCount > 0
								? countOf(c.key) / maxCount
								: 0
							: undefined}
						count={revealed ? countOf(c.key) : undefined}
						selected={result === null && selected === c.key}
						picked={isPicked}
						correct={revealed && isActual}
						wrong={revealed && isPicked && !isActual}
						interactive={result === null && !verifying}
						onclick={() => selectColor(c.key)}
					/>
				{/each}
			</div>

			{#if result === null}
				<button
					onclick={commitGuess}
					disabled={selected === null || verifying}
					class="w-full mt-7 bg-primary text-primary-content py-3 font-display font-bold tracking-[0.25em] transition-opacity {selected ===
						null || verifying
						? 'opacity-30 cursor-not-allowed'
						: 'hover:opacity-90'}"
				>
					{verifying ? "校验中…" : "确认"}
				</button>
			{:else if result.status === "notfound"}
				<div class="mt-7 border border-base-content/20 bg-base-200/50 px-5 py-4">
					<p class="text-sm opacity-70">该挑战已失效，无法校验。</p>
				</div>
				<button
					onclick={next}
					class="w-full mt-4 bg-primary text-primary-content py-3 font-display font-bold tracking-[0.25em] hover:opacity-90 transition-opacity"
				>
					下一个
				</button>
			{:else}
				<button
					onclick={next}
					class="w-full mt-7 bg-primary text-primary-content py-3 font-display font-bold tracking-[0.25em] hover:opacity-90 transition-opacity"
				>
					下一个
				</button>
			{/if}
		{:else}
			<div class="py-24 text-center">
				<span class="loading loading-spinner loading-md text-primary"></span>
				<p class="font-mono text-[11px] uppercase tracking-[0.3em] opacity-50 mt-5">
					正在加载更多
				</p>
			</div>
		{/if}
	</div>
</div>
