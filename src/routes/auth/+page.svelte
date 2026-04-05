<script lang="ts">
	import { onMount } from "svelte";

	onMount(() => {
		if (window.parent !== window) {
			window.parent.postMessage({ type: "auth:ready" }, "*");
		}
	});

	const onCancel = () => {
		if (window.parent !== window) {
			window.parent.postMessage({ type: "auth:cancel" }, "*");
		} else {
			window.history.back();
		}
	};
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-base-200">
	<div
		class="max-w-md w-full border-l-4 border-primary bg-base-100 p-8 relative overflow-hidden ring-1 ring-base-content/10"
	>
		<header class="mb-10">
			<h1 class="text-4xl font-black tracking-tighter uppercase mb-2">Authenticate</h1>
			<div class="flex items-center gap-2">
				<span class="bg-primary text-primary-content text-[10px] px-1 font-bold"
					>SYSTEM</span
				>
				<p class="text-xs opacity-60 font-mono uppercase tracking-widest">
					External Identity Protocol
				</p>
			</div>
		</header>

		<main class="space-y-6">
			<p class="text-sm leading-relaxed opacity-80 border-l-2 border-primary/30 pl-3">
				您即将离开当前页面，前往 <span class="text-primary font-bold">CP OAuth</span> 执行鉴权。
			</p>

			<div class="flex flex-col gap-3">
				<a
					class="btn btn-primary btn-block rounded-none font-bold tracking-widest group relative"
					href="/auth/login"
				>
					<span class="relative z-10">确认重定向 / CONFIRM</span>
					<div
						class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
					></div>
				</a>

				<button
					class="btn btn-ghost btn-block rounded-none font-normal opacity-60 hover:opacity-100"
					onclick={onCancel}
				>
					取消 / CANCEL
				</button>
			</div>
		</main>

		<footer class="mt-12 pt-4 border-t border-base-content/5 flex justify-between items-end">
			<div class="text-[10px] font-mono opacity-40">
				RE-DIRECTING TO:<br />
				AUTH.LUOGU.ME
			</div>
			<div class="flex gap-1">
				<div class="w-8 h-1 bg-primary"></div>
				<div class="w-2 h-1 bg-primary/40"></div>
				<div class="w-2 h-1 bg-primary/20"></div>
			</div>
		</footer>
	</div>
</div>
