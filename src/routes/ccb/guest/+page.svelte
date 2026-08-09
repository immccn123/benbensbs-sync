<script lang="ts">
	import { onMount } from "svelte";
	import { marked } from "marked";
	import DOMPurify from "dompurify";
	import "../panel.css";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import StatusPanel from "$lib/components/StatusPanel.svelte";
	import CcbHeader from "$lib/components/ccb/CcbHeader.svelte";
	import CcbTitle from "$lib/components/ccb/CcbTitle.svelte";
	import ColorOption from "$lib/components/ccb/ColorOption.svelte";
	import SpecimenCard from "$lib/components/ccb/SpecimenCard.svelte";
	import {
		CCB_COLORS,
		normalizeColorKey,
		colorOf,
		dateOf,
		timeOfDayOf,
		type GuestFeed,
	} from "$lib/ccb";

	marked.setOptions({ breaks: true, gfm: true });

	const renderMarkdown = (md: string): string => {
		try {
			const html = marked.parse(md ?? "", { async: false }) as string;
			return DOMPurify.sanitize(html);
		} catch {
			return DOMPurify.sanitize(md ?? "");
		}
	};

	let feeds = $state<GuestFeed[]>([]);
	let status = $state<"loading" | "ready" | "error">("loading");
	let index = $state(0);
	let selected = $state<string | null>(null);
	let guessed = $state<string | null>(null);
	let score = $state(0);
	let answered = $state(0);
	let loadingMore = false;

	const GUEST_WARN_KEY = "ccb-guest-warned";
	let showWarning = $state(false);
	let dontShowAgain = $state(false);

	const confirmWarning = () => {
		if (dontShowAgain) {
			try {
				localStorage.setItem(GUEST_WARN_KEY, "1");
			} catch {}
		}
		showWarning = false;
	};

	const current = $derived(feeds[index] as GuestFeed | undefined);
	const actualKey = $derived(current ? normalizeColorKey(current.userColor) : "gray");
	const actualColor = $derived(colorOf(actualKey));
	const contentHtml = $derived(current ? renderMarkdown(current.content) : "");
	const timeStr = $derived(
		current
			? `${dateOf(current.time as string)} ${timeOfDayOf(current.time as string)}`
			: "",
	);
	const accuracy = $derived(
		answered === 0
			? "0/0=—"
			: `${score}/${answered}=${Math.round((score / answered) * 100)}%`,
	);

	const fetchFeeds = async (): Promise<GuestFeed[]> => {
		const res = await fetch("/endpoint/ccb/guest?year=latest");
		if (!res.ok) throw new Error();
		const data = (await res.json()) as GuestFeed[];
		if (!Array.isArray(data)) throw new Error();
		return data;
	};

	onMount(async () => {
		try {
			if (localStorage.getItem(GUEST_WARN_KEY) !== "1") showWarning = true;
		} catch {}
		try {
			feeds = await fetchFeeds();
			if (feeds.length === 0) throw new Error();
			status = "ready";
		} catch {
			status = "error";
		}
	});

	const refill = async () => {
		if (loadingMore) return;
		if (feeds.length - index > 5) return;
		loadingMore = true;
		try {
			const more = await fetchFeeds();
			feeds = [...feeds, ...more];
		} catch {
			// 下一次推进时重试
		} finally {
			loadingMore = false;
		}
	};

	const selectColor = (key: string) => {
		if (guessed !== null) return;
		selected = key;
	};

	const commitGuess = () => {
		if (guessed !== null || selected === null || !current) return;
		guessed = selected;
		answered++;
		if (selected === actualKey) score++;
	};

	const next = () => {
		index++;
		selected = null;
		guessed = null;
		void refill();
	};
</script>

<svelte:head><title>Benben.sbs OLSI — CCB 访客模式</title></svelte:head>

<div class="min-h-screen bg-base-100 font-body text-base-content relative">
	<DotGrid />

	<div class="max-w-3xl mx-auto px-6 py-10">
		<CcbHeader>
			<a
				href="/ccb"
				class="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
				>← 返回</a
			>
		</CcbHeader>

		<div class="flex items-end justify-between gap-4 mt-10 mb-8">
			<CcbTitle size="text-3xl md:text-4xl" />
			<span class="font-mono text-xs shrink-0 mb-1">正确率 {accuracy}</span>
		</div>

		{#if status === "loading"}
			<div class="py-24 text-center">
				<span class="loading loading-spinner loading-md text-primary"></span>
				<p class="font-mono text-[11px] uppercase tracking-[0.3em] opacity-50 mt-5">正在抽取档案</p>
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
			<SpecimenCard
				feed={current}
				guessed={guessed}
				actualColor={actualColor}
				contentHtml={contentHtml}
				timeStr={timeStr}
			/>

			<div class="mt-7">
				{#each CCB_COLORS as c}
					{@const isActual = c.key === actualKey}
					{@const isPicked = c.key === guessed}
					<ColorOption
						color={c}
						selected={guessed === null && selected === c.key}
						correct={guessed !== null && isActual}
						wrong={guessed !== null && isPicked && !isActual}
						dimmed={guessed !== null && !isActual && !isPicked}
						interactive={guessed === null}
						onclick={() => selectColor(c.key)}
					/>
				{/each}
			</div>

			{#if guessed === null}
				<button
					onclick={commitGuess}
					disabled={selected === null}
					class="w-full mt-7 bg-primary text-primary-content py-3 font-display font-bold tracking-[0.25em] transition-opacity {selected ===
					null
						? 'opacity-30 cursor-not-allowed'
						: 'hover:opacity-90'}"
				>
					确认
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
				<p class="font-mono text-[11px] uppercase tracking-[0.3em] opacity-50 mt-5">正在加载更多</p>
			</div>
		{/if}
	</div>

	{#if showWarning}
		<div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
			<div class="relative">
				<StatusPanel
					accent="warning"
					badge="WARN"
					subtitle="SCORES WILL NOT BE RECORDED"
					footTop="MODE: GUEST"
					footBottom="LEADERBOARD: N/A"
				>
					{#snippet title()}NO LEADERBOARD{/snippet}

					<p class="text-sm leading-relaxed opacity-80 border-l-2 border-warning/50 pl-3">
						访客模式的猜测不计入排行榜。登录用户可参与 ██ 模式排行榜。
					</p>

					<label class="flex items-center gap-2.5 cursor-pointer select-none">
						<input
							type="checkbox"
							bind:checked={dontShowAgain}
							class="checkbox checkbox-sm rounded-none"
						/>
						<span class="text-sm opacity-80">下次不再提醒</span>
					</label>

					<button
						class="btn btn-neutral btn-block rounded-none font-bold tracking-widest group relative"
						onclick={confirmWarning}
					>
						<span class="relative z-10">知道了 / OK</span>
						<div
							class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
						></div>
					</button>
				</StatusPanel>
			</div>
		</div>
	{/if}
</div>
