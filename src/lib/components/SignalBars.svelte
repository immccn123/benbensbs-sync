<script lang="ts">
	export type Accent = "primary" | "success" | "warning" | "error";

	let { accent = "primary" }: { accent?: Accent } = $props();

	const BARS = {
		primary: ["bg-primary", "bg-primary/40", "bg-primary/20"],
		success: ["bg-success", "bg-success/40", "bg-success/20"],
		warning: ["bg-warning", "bg-warning/40", "bg-warning/20"],
		error: ["bg-error", "bg-error/40", "bg-error/20"],
	} as const;

	const bars = $derived(BARS[accent]);
</script>

<div class="flex gap-1">
	<div class="w-8 h-1 transition-colors duration-300 {bars[0]}"></div>
	<div class="w-2 h-1 transition-colors duration-300 {bars[1]}"></div>
	<div class="w-2 h-1 transition-colors duration-300 {bars[2]}"></div>
</div>
