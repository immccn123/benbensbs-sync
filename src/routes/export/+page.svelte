<script lang="ts">
	import { onMount } from "svelte";
	import "../ccb/panel.css";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import { type ExportActionResult, type ExportStatusResponse } from "$lib/export";

	let data = $state<ExportStatusResponse | null>(null);
	let loading = $state(true);
	let busy = $state(false);
	let actionError = $state<string | null>(null);
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	const task = $derived(data?.task ?? null);
	const isActive = $derived(task?.status === "pending" || task?.status === "processing");
	const canDownload = $derived(task?.status === "completed");
	const quotaFull = $derived(
		(data?.quota.used ?? 0) >= (data?.quota.limit ?? 0) && !canDownload && task === null,
	);

	const fmtTime = (iso: string | null): string =>
		iso ? new Date(iso).toLocaleString("zh-CN", { hour12: false }) : "—";

	const refresh = async () => {
		try {
			const res = await fetch("/endpoint/export/status");
			if (!res.ok) throw new Error();
			data = await res.json();
		} catch {
			// keep previous state on transient failure
		} finally {
			loading = false;
		}
	};

	const syncPolling = () => {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
		if (isActive) {
			pollTimer = setInterval(refresh, 1500);
		}
	};

	const requestExport = async () => {
		if (busy) return;
		busy = true;
		actionError = null;
		try {
			const res = await fetch("/endpoint/export", { method: "POST" });
			const result = (await res.json()) as ExportActionResult;
			if (result.ok && result.task) {
				await refresh();
			} else {
				actionError = result.message ?? "导出请求失败";
			}
		} catch {
			actionError = "导出请求失败";
		} finally {
			busy = false;
		}
	};

	onMount(async () => {
		await refresh();
		syncPolling();
	});

	$effect(() => {
		syncPolling();
	});
</script>

<svelte:head><title>Benben.sbs OLSI — Data Export</title></svelte:head>

<div class="min-h-screen bg-base-100 font-body text-base-content relative">
	<DotGrid />

	<div class="max-w-3xl mx-auto px-6 py-10">
		<div class="flex items-center gap-3 mb-2 opacity-70 font-mono">
			<a
				href="/"
				class="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
				>← 首页</a
			>
			<span class="text-xs opacity-30">|</span>
			<span class="text-xs font-bold uppercase tracking-[0.2em]">User Data Export</span>
			<div class="h-px grow bg-base-content opacity-20"></div>
			<span class="text-xs">{__VERSION__} ({__LASTMOD__})</span>
		</div>

		<h1 class="font-display text-4xl md:text-5xl tracking-tight leading-tight mt-10 mb-4">
			用户数据导出
		</h1>

		<p class="text-sm leading-relaxed opacity-80 max-w-xl mb-10">
			在这里导出你在犇站的全部犇犇记录。每次导出结果为 JSON 格式。每位用户最多生成
			{data?.quota.limit ?? 3} 次，已生成的结果在 48h 内可下载且不会重复计数。若有特殊情况需要重置次数，请加入犇站群聊
			313404608 联系站长。
		</p>

		<div class="border-t border-base-content/20 pt-8">
			{#if loading}
				<div class="py-24 text-center">
					<span class="loading loading-spinner loading-md text-primary"></span>
					<p class="font-mono text-[11px] uppercase tracking-[0.3em] opacity-50 mt-5">
						Loading
					</p>
				</div>
			{:else if !data?.authenticated}
				<div class="border border-base-content/20 bg-base-200/50 p-6">
					<div class="font-mono text-xs opacity-50 mb-2">// AUTH REQUIRED</div>
					<h2 class="font-display text-xl font-bold uppercase mb-3">请先登录</h2>
					<p class="text-sm opacity-70 mb-5">
						需要核验用户在洛谷的身份才可进行导出。使用 CPOAuth 第三方服务鉴权。
					</p>
					<a
						href="/endpoint/login?return_to=/export"
						class="btn btn-neutral rounded-none font-bold tracking-widest"
					>
						前往登录 / LOGIN
					</a>
				</div>
			{:else if !data.luogu}
				<div class="border-l-4 border-warning bg-base-200/50 p-6">
					<div class="font-mono text-xs opacity-50 mb-2">// BINDING REQUIRED</div>
					<h2 class="font-display text-xl font-bold uppercase mb-3">未绑定洛谷</h2>
					<p class="text-sm leading-relaxed opacity-80 border-l-2 border-warning/50 pl-3">
						需要在 CPOAuth 绑定洛谷，若已经绑定则登出后请重新认证；若有特殊情况加群
						313404608 联系站长
					</p>
				</div>
			{:else}
				<div class="space-y-5">
					<div class="border border-base-content/20 bg-base-200/50 p-5 font-mono">
						<div class="flex items-center justify-between flex-wrap gap-3">
							<div>
								<div class="text-xs opacity-50 mb-1">// LINKED ACCOUNT</div>
								<div class="text-sm font-bold">
									luogu / {data.luogu.platformUsername}
									<span class="opacity-50 ml-2">#{data.luogu.platformUid}</span>
								</div>
							</div>
							<div class="text-xs text-right">
								<div class="opacity-50 mb-1">// QUOTA</div>
								<div class="font-bold">
									已生成 {data.quota.used} / {data.quota.limit}
								</div>
							</div>
						</div>
					</div>

					{#if task && task.status === "failed"}
						<div class="border-l-4 border-error bg-base-200/50 p-5">
							<div class="font-mono text-xs opacity-50 mb-2">// FAILED</div>
							<p class="text-sm opacity-80 mb-4">
								上次导出失败：{task.error ?? "未知错误"}
							</p>
							<button
								onclick={requestExport}
								disabled={busy}
								class="btn btn-neutral rounded-none font-bold tracking-widest"
							>
								{busy ? "提交中…" : "重新生成 / RETRY"}
							</button>
						</div>
					{:else if isActive}
						<div class="border border-primary/40 bg-base-200/50 p-5">
							<div class="font-mono text-xs opacity-50 mb-2">
								// {task?.status === "processing" ? "PROCESSING" : "QUEUED"}
							</div>
							<div class="flex items-center gap-3">
								<span class="loading loading-spinner loading-sm text-primary"
								></span>
								<p class="text-sm opacity-80">
									{task?.status === "processing"
										? "正在生成导出，请稍候…"
										: "已加入队列，等待处理…"}
								</p>
							</div>
							<p class="font-mono text-[11px] opacity-40 mt-3">
								提交时间 {fmtTime(task?.createdAt ?? null)}
							</p>
						</div>
					{:else if canDownload}
						<div class="border-l-4 border-success bg-base-200/50 p-5">
							<p class="text-sm opacity-80 mb-5">
								导出完成于 {fmtTime(task?.completedAt ?? null)}
							</p>
							<a
								href="/endpoint/export/download"
								class="btn btn-success rounded-none font-bold tracking-widest"
							>
								下载导出 / DOWNLOAD
							</a>
						</div>
					{:else if quotaFull}
						<div class="border-l-4 border-error bg-base-200/50 p-5">
							<div class="font-mono text-xs opacity-50 mb-2">// QUOTA EXCEEDED</div>
							<p
								class="text-sm leading-relaxed opacity-80 border-l-2 border-error/40 pl-3"
							>
								如有特殊情况加群联系站长
							</p>
						</div>
					{:else}
						<div class="border border-base-content/20 bg-base-200/50 p-5">
							<button
								onclick={requestExport}
								disabled={busy}
								class="btn btn-neutral rounded-none font-bold tracking-widest"
							>
								{busy ? "提交中…" : "生成导出 / GENERATE"}
							</button>
						</div>
					{/if}

					{#if actionError}
						<div class="border-l-4 border-error bg-base-200/50 p-4">
							<p
								class="text-sm leading-relaxed opacity-80 border-l-2 border-error/40 pl-3"
							>
								{actionError}
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
