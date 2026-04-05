<script lang="ts">
	let { data } = $props();

	const isLoggedOutSession = $derived(!!data.user);
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-base-200">
	<div
		class="max-w-md w-full border-l-4 {isLoggedOutSession
			? 'border-success'
			: 'border-warning'} bg-base-100 p-8 relative overflow-hidden ring-1 ring-base-content/10"
	>
		<header class="mb-10">
			<h1 class="text-4xl font-black tracking-tighter uppercase mb-2">
				{isLoggedOutSession ? "Logged Out" : "Unauthorized"}
			</h1>
			<div class="flex items-center gap-2">
				<span
					class="{isLoggedOutSession
						? 'bg-success'
						: 'bg-warning'} text-success-content text-[10px] px-1 font-bold"
				>
					{isLoggedOutSession ? "SUCCESS" : "NOTICE"}
				</span>
				<p class="text-xs opacity-60 font-mono uppercase tracking-widest">
					{isLoggedOutSession ? "Session Ended" : "No Active Session"}
				</p>
			</div>
		</header>

		<main class="space-y-6">
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
								<span class="block opacity-40 text-[9px] uppercase"
									>sub: {data.user.sub}</span
								>
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
		</main>

		<footer class="mt-12 pt-4 border-t border-base-content/5 flex justify-between items-end">
			<div class="text-[10px] font-mono opacity-40">
				PROTOCOL: OAUTH 2.0<br />
				STATUS: {isLoggedOutSession ? "SESSION_TERMINATED" : "NOT_AUTHENTICATED"}
			</div>
			<div class="flex gap-1">
				<div class="w-8 h-1 {isLoggedOutSession ? 'bg-success' : 'bg-warning'}"></div>
				<div class="w-2 h-1 {isLoggedOutSession ? 'bg-success/40' : 'bg-warning/40'}"></div>
				<div class="w-2 h-1 {isLoggedOutSession ? 'bg-success/20' : 'bg-warning/20'}"></div>
			</div>
		</footer>
	</div>
</div>
