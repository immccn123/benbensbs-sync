<script lang="ts">
	import { page } from "$app/state";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import SignalBars from "$lib/components/SignalBars.svelte";
	import StatusPanel from "$lib/components/StatusPanel.svelte";

	const isSessionInvalid = $derived(page.status === 401);

	let clearing = $state<"idle" | "working" | "done">("idle");

	const clearSession = async () => {
		if (clearing !== "idle") return;
		clearing = "working";
		try {
			const res = await fetch("/endpoint/logout", { method: "POST" });
			clearing = res.ok ? "done" : "idle";
		} catch {
			clearing = "idle";
		}
	};
</script>

{#if isSessionInvalid}
	<div
		class="min-h-screen flex items-center justify-center p-4 bg-base-200 relative overflow-hidden"
	>
		<DotGrid />

		<div
			class="max-w-md w-full border-l-4 border-warning bg-base-100 p-8 relative ring-1 ring-base-content/10"
		>
			<div class="absolute top-0 right-0 p-2 opacity-5 font-mono text-xs select-none">
				ERR_401_SESSION
			</div>

			<header class="mb-8">
				<div class="flex items-center gap-2 mb-3">
					<span
						class="bg-warning text-warning-content text-[10px] px-1.5 py-0.5 font-bold animate-pulse"
						>EXPIRED</span
					>
					<p class="text-[10px] opacity-50 font-mono uppercase tracking-[0.2em]">
						JWT Claim Validation Failed
					</p>
				</div>
				<h1 class="text-5xl font-black tracking-tighter uppercase leading-[0.95]">
					Session<br />
					<span class="text-warning">Invalid</span>
				</h1>
			</header>

			<main class="space-y-5">
				<p class="text-sm leading-relaxed opacity-80 border-l-2 border-warning/40 pl-3">
					您的会话已失效（令牌过期或声明校验未通过）。无效的凭证可能仍保留在浏览器中，建议先将其清除，再重新登录。
				</p>

				<div class="border border-base-content/15 bg-base-200/40">
					<div
						class="px-4 py-2 border-b border-base-content/10 flex items-center justify-between"
					>
						<span class="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40"
							>Session Control</span
						>
						<span
							class="w-1.5 h-1.5 transition-colors duration-300 {clearing === 'done'
								? 'bg-success'
								: 'bg-warning animate-pulse'}"
						></span>
					</div>
					<div class="p-4">
						{#if clearing === "done"}
							<div class="flex items-center gap-3 py-1">
								<span class="text-success text-lg leading-none">✓</span>
								<div>
									<div class="text-sm font-bold text-success uppercase tracking-wider">
										会话已清除
									</div>
									<div class="text-[10px] font-mono opacity-50 uppercase">
										Credential removed
									</div>
								</div>
							</div>
						{:else}
							<button
								onclick={clearSession}
								disabled={clearing === "working"}
								class="btn btn-warning btn-outline btn-block rounded-none font-bold tracking-widest uppercase"
							>
								{#if clearing === "working"}
									<span class="loading loading-spinner loading-xs"></span>
									清除中 / Clearing
								{:else}
									删除会话 / Terminate Session
								{/if}
							</button>
							<p class="text-[10px] font-mono opacity-40 mt-2 uppercase">
								吊销当前凭证 (jti) 并移除 Cookie
							</p>
						{/if}
					</div>
				</div>

				<div class="flex flex-col gap-2.5 pt-1">
					<a
						class="btn btn-primary btn-block rounded-none font-bold tracking-widest group relative overflow-hidden"
						href="/endpoint/login"
					>
						<span class="relative z-10">重新登录 / Re-Authenticate</span>
						<div
							class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
						></div>
					</a>
					<a
						class="btn btn-ghost btn-block rounded-none font-normal opacity-60 hover:opacity-100"
						href="/"
					>
						回首页 / Home
					</a>
				</div>
			</main>

			<footer class="mt-10 pt-4 border-t border-base-content/5 flex justify-between items-end">
				<div class="text-[10px] font-mono opacity-40 leading-relaxed">
					MODULE: SESSION_GUARD<br />
					STATUS: {clearing === "done" ? "SESSION_TERMINATED" : "CLAIM_VALIDATION_FAILED"}
				</div>
				<SignalBars accent={clearing === "done" ? "success" : "warning"} />
			</footer>
		</div>
	</div>
{:else}
	<StatusPanel accent="error" badge="FAILURE" subtitle="Unexpected Condition">
		{#snippet title()}Error {page.status}{/snippet}

		<div class="p-4 border-l-2 border-base-content/10 bg-base-200/30 font-mono">
			<p class="text-sm leading-relaxed text-error/90 font-bold uppercase">
				{page.error?.message || "Internal System Collision"}
			</p>
		</div>

		<a class="btn btn-outline btn-block rounded-none font-bold tracking-widest" href="/">
			回首页 / RETURN TO HOME
		</a>
	</StatusPanel>
{/if}
