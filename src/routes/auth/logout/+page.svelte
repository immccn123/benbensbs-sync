<script lang="ts">
	import StatusPanel from "$lib/components/StatusPanel.svelte";

	let { data } = $props();

	const isLoggedOutSession = $derived(!!data.user);
</script>

<svelte:head><title>Benben.sbs OLSI — Logout</title></svelte:head>

<StatusPanel
	accent={isLoggedOutSession ? "success" : "warning"}
	badge={isLoggedOutSession ? "SUCCESS" : "NOTICE"}
	subtitle={isLoggedOutSession ? "Session Ended" : "No Active Session"}
	footTop="PROTOCOL: SSO / JWT"
	footBottom="STATUS: {isLoggedOutSession ? 'SESSION_TERMINATED' : 'NOT_AUTHENTICATED'}"
>
	{#snippet title()}{isLoggedOutSession ? "Logged Out" : "Unauthorized"}{/snippet}

	<div class="p-6 border border-base-content/5 bg-base-200/50 relative group">
		<div class="flex items-center gap-4">
			{#if data.user?.avatarUrl}
				<img
					src={data.user.avatarUrl}
					alt="Avatar"
					class="w-16 h-16 grayscale group-hover:grayscale-0 transition-all border border-base-content/20"
				/>
			{:else}
				<div
					class="w-16 h-16 bg-base-content/10 flex items-center justify-center font-mono text-xl text-base-content/30"
				>
					{data.user?.displayName?.charAt(0) || "?"}
				</div>
			{/if}

			<div class="overflow-hidden">
				<p class="text-[10px] opacity-40 font-mono uppercase">Identity Status</p>
				<h2 class="text-xl font-bold truncate tracking-tight">
					{data.user?.displayName ?? "Guest / 访客"}
				</h2>
				{#if data.user}
					<p class="text-xs font-mono opacity-60 italic">
						id: {"0x" + data.user.id.toString(16).padStart(8, "0")}
						<span class="block opacity-40 text-[9px] uppercase">sub: {data.user.sub}</span>
					</p>
				{:else}
					<p class="text-xs font-mono opacity-40 italic">请先进行身份验证</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="space-y-3">
		<p
			class="text-sm leading-relaxed opacity-80 border-l-2 {isLoggedOutSession
				? 'border-success/30'
				: 'border-warning/30'} pl-3"
		>
			{#if isLoggedOutSession}
				您已安全退出当前会话。如需继续使用，请重新登录。
			{:else}
				您尚未登录或身份信息已过期。
			{/if}
		</p>

		<div class="flex flex-col gap-3 pt-4">
			<a
				class="btn btn-neutral btn-block rounded-none font-bold tracking-widest group relative"
				href="/"
			>
				<span class="relative z-10">回首页 / RETURN TO HOME</span>
				<div
					class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
				></div>
			</a>
		</div>
	</div>
</StatusPanel>
