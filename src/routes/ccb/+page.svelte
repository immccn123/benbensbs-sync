<script lang="ts">
	import { onMount } from "svelte";
	import "./panel.css";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import StatusPanel from "$lib/components/StatusPanel.svelte";
	import CcbHeader from "$lib/components/ccb/CcbHeader.svelte";
	import CcbTitle from "$lib/components/ccb/CcbTitle.svelte";

	let sessionUser = $state<{
		id: number;
		sub: string;
		displayName: string | null;
		avatarUrl: string | null;
	} | null>(null);
	let showLoginModal = $state(false);

	onMount(async () => {
		try {
			const res = await fetch("/endpoint/session");
			if (res.ok) sessionUser = await res.json();
		} catch {}
	});

	const onLockedMode = () => {
		if (!sessionUser) {
			showLoginModal = true;
		}
	};
</script>

<svelte:head><title>Benben.sbs OLSI — CCB</title></svelte:head>

<div class="min-h-screen bg-base-100 font-body text-base-content relative">
	<DotGrid />

	<div class="max-w-3xl mx-auto px-6 py-10">
		<CcbHeader>
			<a
				href="/"
				class="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
				>← 首页</a
			>
			<span class="text-xs opacity-30">|</span>
			<span class="text-xs font-bold uppercase tracking-[0.2em]">CCB / Mode Selection</span>
		</CcbHeader>

		<div class="mt-10 mb-6">
			<CcbTitle size="text-4xl md:text-5xl" />
		</div>

		<p class="text-sm leading-relaxed opacity-80 max-w-xl mb-10">
			根据犇犇猜测作者名字颜色（在发送时）。灵感来源：<a
				href="https://codeforces.com/blog/entry/137983"
				target="_blank"
				rel="noopener noreferrer"
				class="underline decoration-base-content/30 underline-offset-2 hover:text-primary hover:decoration-primary transition-colors"
				>Guess the true rating of these users!</a
			>。<br />
			访客模式没有进行后端限制所以你要开 F12 看网络请求还是抓包什么的都没人拦着你（x）保证发送时与记录用户颜色间隔不超过
			24h。你看到的犇犇可能已经被删除。登录用户可以尝试 ██ 模式。<br />
			基于 (<a
				href="https://github.com/EarthMessenger/cai-cai-ben"
				target="_blank"
				rel="noopener noreferrer"
				class="underline decoration-base-content/30 underline-offset-2 hover:text-primary hover:decoration-primary transition-colors"
				>EarthMessenger/cai-cai-ben</a
			>) 修改（已获得授权）
		</p>

		<div class="border-t border-base-content/20 pt-8 flex flex-col gap-4">
			<a
				href="/ccb/guest"
				class="group relative border border-base-content/20 p-4 hover:border-primary transition-colors cursor-pointer bg-base-200/50"
			>
				<div class="flex justify-between items-start">
					<div>
						<div class="font-mono text-xs opacity-50 mb-1">// GUEST MODE</div>
						<div class="font-display text-lg uppercase">访客模式</div>
					</div>
					<span
						class="text-xl text-primary transition-transform duration-200 group-hover:translate-x-1"
						>→</span
					>
				</div>
				<div
					class="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"
				></div>
			</a>

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<svelte:element
				this={sessionUser ? "a" : "button"}
				href={sessionUser ? "/ccb/locked" : undefined}
				onclick={sessionUser ? undefined : onLockedMode}
				class="group relative border border-base-content/20 p-4 hover:border-primary transition-colors cursor-pointer bg-base-200/50 w-full text-left"
			>
				<div class="flex justify-between items-start">
					<div>
						<div class="font-mono text-xs opacity-50 mb-1">// ██████ MODE</div>
						<div
							class="font-display text-lg uppercase {sessionUser
								? ''
								: 'opacity-30 select-none'}"
						>
							██ 模式
						</div>
					</div>
					<span
						class="text-xl {sessionUser
							? 'text-primary transition-transform duration-200 group-hover:translate-x-1'
							: 'opacity-25'}">→</span
					>
				</div>
				<div
					class="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"
				></div>
			</svelte:element>

			<a
				href="/ccb/locked/leaderboard"
				class="group relative border border-base-content/20 p-4 hover:border-primary transition-colors cursor-pointer bg-base-200/50"
			>
				<div class="flex justify-between items-start">
					<div>
						<div class="font-mono text-xs opacity-50 mb-1">// ██████ LEADERBOARD</div>
						<div class="font-display text-lg uppercase">██ 排行榜</div>
					</div>
					<span
						class="text-xl text-primary transition-transform duration-200 group-hover:translate-x-1"
						>→</span
					>
				</div>
				<div
					class="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"
				></div>
			</a>
		</div>
	</div>

	{#if showLoginModal}
		<div
			class="fixed inset-0 z-50 overflow-y-auto"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			onkeydown={(e) => e.key === "Escape" && (showLoginModal = false)}
		>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button class="absolute inset-0" onclick={() => (showLoginModal = false)}></button>

			<div class="relative">
				<StatusPanel
					accent="warning"
					badge="PENDING"
					subtitle="IDENTITY UNKNOWN"
					footTop="PROTOCOL: SSO / JWT"
					footBottom="STATUS: PERMISSION_DENIED"
				>
					{#snippet title()}UNVERIFIED{/snippet}

					<p class="text-sm leading-relaxed opacity-80 border-l-2 border-error/30 pl-3">
						██ 模式 仅对登录用户开放。请先登录。
					</p>

					<div class="flex flex-col gap-3">
						<a
							href="/endpoint/login?return_to=/ccb"
							class="btn btn-neutral btn-block rounded-none font-bold tracking-widest group relative"
						>
							<span class="relative z-10">前往登录 / LOGIN</span>
							<div
								class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
							></div>
						</a>
						<button
							class="btn btn-neutral btn-outline btn-block rounded-none font-bold tracking-widest group relative"
							onclick={() => (showLoginModal = false)}
						>
							<span class="relative z-10">先逛逛 / LATER</span>
							<div
								class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
							></div>
						</button>
					</div>
				</StatusPanel>
			</div>
		</div>
	{/if}
</div>
