<script lang="ts">
	import { onMount } from "svelte";
	import DotGrid from "$lib/components/DotGrid.svelte";
	import ActionCard from "$lib/components/ActionCard.svelte";

	import Logo from "$lib/assets/favicon.svg?raw";

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

<svelte:head><title>Benben.sbs OLSI</title></svelte:head>

<div class="min-h-screen bg-base-100 p-8 tracking-tight text-base-content">
	<DotGrid />

	<div class="container mx-auto relative border-l-2 border-primary pl-6 py-4">
		<div class="flex items-center gap-4 mb-2 opacity-70 font-mono">
			<span class="text-xs font-bold uppercase tracking-[0.2em]">System / Initialization</span
			>
			<div class="h-px grow bg-base-content opacity-20"></div>
			<span class="text-xs">{__VERSION__} ({__LASTMOD__})</span>
		</div>

		<h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 font-mono">
			benben.sbs <br />
			<span class="text-primary">OLSI Platform</span>
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-base-content/20 pt-8">
			<div class="md:col-span-7">
				<div class="flex items-start gap-3">
					<div class="shrink-0 [&>svg]:w-full [&>svg]:h-full w-24 h-24">
						{@html Logo}
					</div>
					<p class="leading-relaxed text-sm max-w-md">
						Benben.sbs OLSI 是犇站的非只读业务的合集。其前身为 Benben
						Hub，但是与原先不同的是，OLSI
						加入了更多的东西，并实现了以前规划中一直未实现的东西。<br />
						关于左边的 Logo：由站长这一设计半吊子进行设计。图形斜切的部分在中央留出十字负空间，像是一个汇聚四方的路口。
					</p>
				</div>
				{#if loaded && sessionUser}
					<div class="mt-8 border border-base-content/20 bg-base-200/50 p-4 max-w-md font-mono">
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
							<div
								class="text-xs text-success font-bold uppercase tracking-widest py-2"
							>
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

			<div class="md:col-span-5 flex flex-col gap-4 font-mono">
				<ActionCard
					href="/endpoint/login"
					label="// ACTION_01"
					title="Authentication"
					icon="→"
					filled
					underline
				/>

				<ActionCard
					href="https://benben.sbs"
					label="// ACTION_02"
					title="MAIN SITE"
					icon="↗"
				/>

				<ActionCard
					href="/ccb"
					label="// ACTION_03"
					title="洛谷笑传之猜猜犇"
					icon="→"
					highlight
					underline
				/>
			</div>
		</div>

		<div
			class="mt-20 flex flex-wrap gap-x-12 gap-y-4 opacity-40 text-[10px] uppercase font-bold tracking-widest border-t border-dashed border-base-content/20 pt-4"
		>
			<div class="ml-auto text-primary">Authorized Access Only</div>
		</div>
	</div>
</div>
