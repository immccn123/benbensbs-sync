<script lang="ts">
	import { page } from "$app/state";

	let status = page.status;
	let isError = status >= 500 || status === 403;
	let isPermissionDenied = status === 403;
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-base-200">
	<div
		class={[
			"max-w-md w-full border-l-4 bg-base-100 p-8 relative overflow-hidden ring-1 ring-base-content/10",
			isError ? "border-error" : "border-warning",
		]}
	>
		<div class="absolute top-0 right-0 p-2 opacity-5 font-mono text-xs select-none">
			CRITICAL_FAILURE_LOG_{status}
		</div>

		<header class="mb-10">
			<h1 class="text-4xl font-black tracking-tighter uppercase mb-2">
				{#if isPermissionDenied}
					Permission<br />Denied
				{:else}
					Aborted
				{/if}
			</h1>
			<div class="flex items-center gap-2">
				<span
					class="{isError
						? 'bg-error text-error-content'
						: 'bg-warning text-warning-content'} text-[10px] px-1 font-bold"
				>
					ERROR {status}
				</span>
				<p class="text-xs opacity-60 font-mono uppercase tracking-widest">
					Protocol Terminated
				</p>
			</div>
		</header>

		<main class="space-y-6">
			<div class="p-4 border-l-2 border-base-content/10 bg-base-200/30 font-mono">
				<p class="text-[10px] opacity-40 mb-1 uppercase tracking-tighter italic">
					Exception Message:
				</p>
				<p class="text-sm leading-relaxed text-error/90 font-bold uppercase">
					{page.error?.message || "Internal System Collision"}
				</p>
			</div>

			<div class="space-y-4">
				<p class="text-xs leading-relaxed opacity-60 italic">
					鉴权尝试失败。可能是由于无效的 CSRF 令牌、OAuth
					状态不匹配或远程服务器响应异常引起的。
				</p>

				<div class="flex flex-col gap-3 pt-2">
					<a
						class="btn btn-outline btn-block rounded-none font-bold tracking-widest group relative overflow-hidden"
						href="/auth/login"
					>
						<span class="relative z-10">重试请求 / RE-INITIATE</span>
					</a>
				</div>
			</div>
		</main>

		<footer class="mt-12 pt-4 border-t border-base-content/5 flex justify-between items-end">
			<div class="text-[10px] font-mono opacity-40">
				MODULE: OAUTH_CALLBACK<br />
				TRACE: {Date.now().toString(16).toUpperCase()}
			</div>
			<div class="flex gap-1">
				<div class="w-8 h-1 {isError ? 'bg-error' : 'bg-warning'}"></div>
				<div class="w-2 h-1 bg-{isError ? 'error' : 'warning'}/40"></div>
				<div class="w-2 h-1 bg-{isError ? 'error' : 'warning'}/20"></div>
			</div>
		</footer>
	</div>
</div>
