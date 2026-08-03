<script lang="ts">
	import type { Snippet } from "svelte";
	import SignalBars from "./SignalBars.svelte";

	export type Accent = "primary" | "success" | "warning" | "error";

	let {
		accent = "primary",
		watermark = "",
		badge = "",
		subtitle = "",
		footTop = "",
		footBottom = "",
		title,
		children,
	}: {
		accent?: Accent;
		watermark?: string;
		badge?: string;
		subtitle?: string;
		footTop?: string;
		footBottom?: string;
		title: Snippet;
		children?: Snippet;
	} = $props();

	const ACCENTS = {
		primary: { border: "border-primary", badge: "bg-primary text-primary-content" },
		success: { border: "border-success", badge: "bg-success text-success-content" },
		warning: { border: "border-warning", badge: "bg-warning text-warning-content" },
		error: { border: "border-error", badge: "bg-error text-error-content" },
	} as const;

	const a = $derived(ACCENTS[accent]);
	const hasFooter = $derived(footTop !== "" || footBottom !== "");
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-base-200">
	<div
		class="max-w-md w-full border-l-4 {a.border} bg-base-100 p-8 relative overflow-hidden ring-1 ring-base-content/10"
	>
		{#if watermark}
			<div class="absolute top-0 right-0 p-2 opacity-5 font-mono text-xs select-none">
				{watermark}
			</div>
		{/if}

		<header class="mb-10">
			<h1 class="text-4xl font-bold tracking-tighter uppercase mb-2">{@render title()}</h1>
			{#if badge || subtitle}
				<div class="flex items-center gap-2">
					{#if badge}
						<span class="{a.badge} text-[10px] px-1 font-bold">{badge}</span>
					{/if}
					{#if subtitle}
						<p class="text-xs opacity-60 font-mono uppercase tracking-widest">{subtitle}</p>
					{/if}
				</div>
			{/if}
		</header>

		<main class="space-y-6">
			{#if children}{@render children()}{/if}
		</main>

		{#if hasFooter}
			<footer class="mt-12 pt-4 border-t border-base-content/5 flex justify-between items-end">
				<div class="text-[10px] font-mono opacity-40 leading-relaxed">
					{footTop}<br />
					{footBottom}
				</div>
				<SignalBars {accent} />
			</footer>
		{/if}
	</div>
</div>
