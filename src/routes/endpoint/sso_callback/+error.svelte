<script lang="ts">
	import { page } from "$app/state";
	import StatusPanel from "$lib/components/StatusPanel.svelte";

	const status = $derived(page.status);
	const isError = $derived(status >= 500 || status === 403);
	const isPermissionDenied = $derived(status === 403);
</script>

<StatusPanel
	accent={isError ? "error" : "warning"}
	watermark="CRITICAL_FAILURE_LOG_{status}"
	badge="ERROR {status}"
	subtitle="Protocol Terminated"
	footTop="MODULE: SSO_CALLBACK"
	footBottom="TRACE: {Date.now().toString(16).toUpperCase()}"
>
	{#snippet title()}
		{#if isPermissionDenied}
			Permission<br />Denied
		{:else}
			Aborted
		{/if}
	{/snippet}

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
			鉴权尝试失败。可能是由于无效的 CSRF 令牌、SSO 状态不匹配或远程服务器响应异常引起的。
		</p>

		<div class="flex flex-col gap-3 pt-2">
			<a
				class="btn btn-outline btn-block rounded-none font-bold tracking-widest group relative overflow-hidden"
				href="/endpoint/login"
			>
				<span class="relative z-10">重试请求 / RE-INITIATE</span>
			</a>
		</div>
	</div>
</StatusPanel>
