<script lang="ts">
	let {
		href,
		label,
		title,
		icon = "",
		highlight = false,
		filled = false,
		underline = false,
	}: {
		href: string;
		label: string;
		title: string;
		icon?: string;
		highlight?: boolean;
		filled?: boolean;
		underline?: boolean;
	} = $props();
</script>

<a
	{href}
	class="group relative border p-4 hover:border-primary transition-colors cursor-pointer {highlight
		? 'border-primary/60 bg-primary/5'
		: 'border-base-content/20'} {!highlight && filled ? 'bg-base-200/50' : ''}"
>
	<div class="flex justify-between items-start">
		<div>
			<div class="text-xs mb-1 {highlight ? 'text-primary/70' : 'opacity-50'}">{label}</div>
			<div class="text-lg font-bold uppercase">{title}</div>
		</div>
		{#if icon}
			<span
				class="text-xl {highlight
					? 'text-primary transition-transform duration-300 group-hover:translate-x-1'
					: ''}"
				>{icon}</span
			>
		{/if}
	</div>
	{#if underline}
		<div
			class="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300"
		></div>
	{/if}
</a>
