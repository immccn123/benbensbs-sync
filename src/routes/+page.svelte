<script lang="ts">
	import { onMount } from "svelte";

	let sessionUser = $state<{
		id: number;
		sub: string;
		displayName: string | null;
		avatarUrl: string | null;
	} | null>(null);
	let loaded = $state(false);
	let revoking = $state<"none" | "single" | "all">("none");
	let confirming = $state<"none" | "single" | "all">("none");
	let revoked = $state(false);

	onMount(async () => {
		try {
			const res = await fetch("/endpoint/session");
			if (res.ok) sessionUser = await res.json();
		} catch {}
		loaded = true;
	});

	const requestLogout = (mode: "single" | "all") => {
		confirming = mode;
	};

	const logout = async (mode: "single" | "all") => {
		confirming = "none";
		revoking = mode;
		try {
			const res = await fetch(mode === "all" ? "/endpoint/logout/all" : "/endpoint/logout", {
				method: "POST",
			});
			if (res.ok) {
				revoked = true;
				sessionUser = null;
			}
		} catch {}
		revoking = "none";
	};
</script>

<div class="min-h-screen bg-base-100 p-8 font-mono tracking-tight text-base-content">
	<div
		class="fixed inset-0 opacity-[0.03] pointer-events-none"
		style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
	></div>

	<div class="container mx-auto relative border-l-2 border-primary pl-6 py-4">
		<div class="flex items-center gap-4 mb-2 opacity-70">
			<span class="text-xs font-bold uppercase tracking-[0.2em]">System / Initialization</span
			>
			<div class="h-px grow bg-base-content opacity-20"></div>
			<span class="text-xs">{__VERSION__} ({__LASTMOD__})</span>
		</div>

		<h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
			benben.sbs <br />
			<span class="text-primary">AIO Online</span>
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-base-content/20 pt-8">
			<div class="md:col-span-7">
				<p class="max-w-md text-sm leading-relaxed opacity-80 mb-6">
					[ 核心数据同步协议 ] <br />
					这里是犇站的配置同步中心服务。这里同时会提供认证、授权、工作量验证和合订本的接口服务。
				</p>

				<div class="flex gap-2">
					<div
						class="badge badge-outline rounded-none px-4 py-3 text-xs font-bold border-primary text-primary"
					>
						ECC Based Authentication
					</div>
					<div class="badge badge-outline rounded-none px-4 py-3 text-xs font-bold">
						SHA256-POW
					</div>
				</div>

				{#if loaded && sessionUser}
					<div
						class="mt-8 border border-base-content/20 bg-base-200/50 p-4 max-w-md"
					>
						<div class="flex items-center gap-3 mb-4">
							{#if sessionUser.avatarUrl}
								<img
									src={sessionUser.avatarUrl}
									alt=""
									class="w-10 h-10 grayscale border border-base-content/20"
								/>
							{:else}
								<div
									class="w-10 h-10 bg-base-content/10 flex items-center justify-center text-sm"
								>
									{sessionUser.displayName?.charAt(0) || "?"}
								</div>
							{/if}
							<div class="min-w-0">
								<div class="text-sm font-bold truncate">
									{sessionUser.displayName ?? sessionUser.sub}
								</div>
								<div class="text-[10px] opacity-40 uppercase">
									SESSION ACTIVE / {sessionUser.sub}
								</div>
							</div>
						</div>

					{#if revoked}
						<div class="text-xs text-success font-bold uppercase tracking-widest py-2">
							Session Terminated
						</div>
					{:else if confirming !== "none"}
						<div class="space-y-2">
							<div class="text-xs font-bold uppercase tracking-wider text-error">
								{confirming === "all"
									? "确认注销所有会话？此操作将使所有设备上的登录失效。"
									: "确认注销当前会话？"}
							</div>
							<div class="flex gap-2">
								<button
									class="btn btn-error btn-xs rounded-none font-bold uppercase tracking-wider flex-1"
									disabled={revoking !== "none"}
									onclick={() => logout(confirming as "single" | "all")}
								>
									{revoking !== "none" ? "..." : "确认 / CONFIRM"}
								</button>
								<button
									class="btn btn-ghost btn-xs rounded-none font-bold uppercase tracking-wider flex-1"
									disabled={revoking !== "none"}
									onclick={() => (confirming = "none")}
								>
									取消 / CANCEL
								</button>
							</div>
						</div>
					{:else}
						<div class="flex gap-2">
							<button
								class="btn btn-outline btn-xs rounded-none font-bold uppercase tracking-wider flex-1"
								onclick={() => requestLogout("single")}
							>
								注销当前会话
							</button>
							<button
								class="btn btn-error btn-outline btn-xs rounded-none font-bold uppercase tracking-wider flex-1"
								onclick={() => requestLogout("all")}
							>
								注销所有会话
							</button>
						</div>
					{/if}
					</div>
				{/if}
			</div>

			<div class="md:col-span-5 flex flex-col gap-4">
				<a
					class="group relative border border-base-content/20 p-4 hover:border-primary transition-colors cursor-pointer bg-base-200/50"
					href="/endpoint/login"
				>
					<div class="flex justify-between items-start">
						<div>
							<div class="text-xs opacity-50 mb-1">// ACTION_01</div>
							<div class="text-lg font-bold uppercase">Authentication</div>
						</div>
						<span class="text-xl">_</span>
					</div>
					<div
						class="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"
					></div>
				</a>

				<a
					class="group relative border border-base-content/20 p-4 hover:border-primary transition-colors cursor-pointer"
					href="https://benben.sbs"
				>
					<div class="flex justify-between items-start">
						<div>
							<div class="text-xs opacity-50 mb-1">// ACTION_02</div>
							<div class="text-lg font-bold uppercase">MAIN SITE</div>
						</div>
						<span class="text-xl">↗</span>
					</div>
				</a>
			</div>
		</div>

		<div
			class="mt-20 flex flex-wrap gap-x-12 gap-y-4 opacity-40 text-[10px] uppercase font-bold tracking-widest border-t border-dashed border-base-content/20 pt-4"
		>
			<div>Engine: SvelteKit / SM3</div>
			<div>Auth: JOSE / ECC25519</div>
			<div>Storage: PostgreSQL / Drizzle</div>
			<div class="ml-auto text-primary">Authorized Access Only</div>
		</div>
	</div>
</div>
