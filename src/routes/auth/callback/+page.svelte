<script lang="ts">
	let { data } = $props();

	const continueOperation = (e: MouseEvent) => {
		if (window.parent !== window) {
			e.preventDefault();
			window.parent.postMessage({ type: "auth:success" }, "*");
		} else {
			// Fallback for direct access, simply navigate to home
		}
	};
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-base-200">
	<div
		class="max-w-md w-full border-l-4 border-success bg-base-100 p-8 relative overflow-hidden ring-1 ring-base-content/10"
	>
		<header class="mb-10">
			<h1 class="text-4xl font-bold tracking-tighter uppercase mb-2">Verified</h1>
			<div class="flex items-center gap-2">
				<span class="bg-success text-success-content text-[10px] px-1 font-bold"
					>SUCCESS</span
				>
				<p class="text-xs opacity-60 font-mono uppercase tracking-widest">
					Identity Confirmed
				</p>
			</div>
		</header>

		<main class="space-y-6">
			<div class="p-6 border border-base-content/5 bg-base-200/50 relative group">
				<div class="flex items-center gap-4">
					{#if data.user.avatarUrl}
						<img
							src={data.user.avatarUrl}
							alt="Avatar"
							class="w-16 h-16 grayscale group-hover:grayscale-0 transition-all border border-base-content/20"
						/>
					{:else}
						<div
							class="w-16 h-16 bg-base-content/10 flex items-center justify-center font-mono text-xl"
						>
							{data.user.displayName?.charAt(0) || "?"}
						</div>
					{/if}

					<div class="overflow-hidden">
						<p class="text-[10px] opacity-40 font-mono uppercase">User Identified</p>
						<h2 class="text-xl font-bold truncate tracking-tight">
							{data.user.displayName ?? "Authenticated User"}
						</h2>
						<p class="text-xs font-mono opacity-60 italic">
							id: {"0x" + data.user.id.toString(16).padStart(8, "0")}
							({data.user.sub})
						</p>
					</div>
				</div>
			</div>

			<div class="space-y-3">
				<p class="text-sm leading-relaxed opacity-80 border-l-2 border-success/30 pl-3">
					鉴权协议已完成。您的身份已通过 <span class="text-success font-bold"
						>SSO</span
					> 验证。
				</p>

				<div class="flex flex-col gap-3 pt-4">
					<a
						class="btn btn-neutral btn-block rounded-none font-bold tracking-widest group relative"
						href="/"
						onclick={continueOperation}
					>
						<span class="relative z-10">继续操作 / CONTINUE OPERATION</span>
						<div
							class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
						></div>
					</a>
				</div>
			</div>
		</main>

		<footer class="mt-12 pt-4 border-t border-base-content/5 flex justify-between items-end">
			<div class="text-[10px] font-mono opacity-40">
				PROTOCOL: SSO / JWT<br />
				STATUS: SESSION_ACTIVE
			</div>
			<div class="flex gap-1">
				<div class="w-8 h-1 bg-success"></div>
				<div class="w-2 h-1 bg-success/40"></div>
				<div class="w-2 h-1 bg-success/20"></div>
			</div>
		</footer>
	</div>
</div>
