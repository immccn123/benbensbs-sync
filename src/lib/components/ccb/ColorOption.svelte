<script lang="ts">
	import { contrastText, type CcbColor } from "$lib/ccb";

	let {
		color,
		selected = false,
		correct = false,
		wrong = false,
		dimmed = false,
		interactive = false,
		picked = false,
		fraction,
		count,
		onclick,
	}: {
		color: CcbColor;
		selected?: boolean;
		correct?: boolean;
		wrong?: boolean;
		dimmed?: boolean;
		interactive?: boolean;
		picked?: boolean;
		fraction?: number;
		count?: number;
		onclick: () => void;
	} = $props();

	const filled = $derived(selected || correct);
	const pct = $derived(
		fraction === undefined ? 0 : Math.min(Math.max(fraction * 100, 0), 100),
	);
</script>

{#if fraction !== undefined}
	{@const textColor = (count ?? 0) > 0 ? contrastText(color.hex) : color.hex}
	<button
		type="button"
		disabled
		style="--c: {color.hex}; border-left-color: {color.hex}; color: {textColor};"
		class="relative flex w-full items-center border-l-4 py-2.5 pl-5 pr-3 text-left font-mono text-sm {correct
			? 'ring-2 ring-success ring-offset-1 ring-offset-base-100'
			: wrong
				? 'ring-2 ring-error ring-offset-1 ring-offset-base-100'
				: ''}"
	>
		<span class="absolute inset-0 bg-base-content/5"></span>
		<span
			class="absolute inset-y-0 left-0 bg-(--c) transition-all duration-500"
			style="width: {pct}%;"
		></span>
		<span class="relative z-10 flex w-full items-center">
			<span>{color.label}</span>
			<span class="ml-auto tabular-nums">{count ?? 0}</span>
		</span>
		{#if correct || wrong}
			<span
				class="absolute left-0 top-1/2 z-20 -translate-x-full -translate-y-1/2 -ml-2 font-bold {correct
					? 'text-success'
					: 'text-error'}"
			>
				{correct ? '✓' : '✕'}
			</span>
		{/if}
	</button>
{:else}
	<button
		type="button"
		{onclick}
		disabled={!interactive}
		style="--c: {color.hex}; border-left-color: {color.hex};"
		class="flex w-full items-center gap-3 border-l-4 py-2.5 pl-5 pr-3 text-left font-mono text-sm transition-colors duration-150 {filled
			? 'bg-(--c) text-base-100'
			: wrong
				? 'text-error'
				: 'text-(--c)'} {selected || picked
			? 'relative z-10 ring-2 ring-base-content ring-offset-1 ring-offset-base-100'
			: ''} {interactive && !selected
			? 'cursor-pointer hover:bg-(--c) hover:text-base-100'
			: ''} {dimmed ? 'opacity-30' : ''}"
	>
		<span>{color.label}</span>
		{#if correct}
			<span class="ml-auto font-bold">✓</span>
		{:else if wrong}
			<span class="ml-auto font-bold">✕</span>
		{/if}
	</button>
{/if}
