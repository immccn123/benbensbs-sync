<script lang="ts">
	import PoWWorker from "./pow.worker?worker";
	import { onDestroy, onMount } from "svelte";

	let stage = $state("idle");
	let errorMessage = $state("");
	let currentHash = $state("");
	let fetching = $state(false);
	let worker: Worker | null = null;

	let nonce = "";
	let difficulty = $state(0);

	// Dot grid
	const DOT_SIZE = 2;
	const DOT_STEP = 7;
	let litIndex = $state(0);
	let scanTimer: ReturnType<typeof setInterval> | null = null;

	const dots = $derived.by(() => {
		const cols = Math.floor(384 / DOT_STEP);
		const rows = Math.floor(80 / DOT_STEP);
		const arr: { x: number; y: number }[] = [];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				arr.push({
					x: c * DOT_STEP + DOT_STEP / 2,
					y: r * DOT_STEP + DOT_STEP / 2,
				});
			}
		}
		return arr;
	});

	$effect(() => {
		if (stage === "processing") {
			scanTimer = setInterval(() => {
				litIndex = Math.floor(Math.random() * dots.length);
			}, 100);
		} else {
			if (scanTimer) clearInterval(scanTimer);
		}
	});

	const displayHash = $derived(
		currentHash ? currentHash.slice(0, 12).toLowerCase() + "[...]" : "Loading...",
	);

	const highlightCount = $derived(difficulty > 0 ? Math.ceil(difficulty / 4) : 0);

	const hashParts = $derived({
		bold: displayHash.slice(0, highlightCount),
		dim: displayHash.slice(highlightCount),
	});

	const startTransition = async () => {
		if (stage !== "idle" && stage !== "error") return;
		errorMessage = "";
		try {
			fetching = true;
			const res = await fetch("/pow/challenge");
			if (!res.ok) throw new Error();
			const data = await res.json();
			nonce = data.nonce;
			difficulty = data.difficulty;
			stage = "transitioning";
		} catch (e) {
			stage = "error";
			errorMessage = "在获取挑战时出错 / ERROR IN FETCHING CHALLENGE";
		} finally {
			fetching = false;
		}
	};

	const handleTransitionRun = () => {
		if (stage === "transitioning") stage = "processing";
		else if (stage === "processing") {
			runPowInWorker();
		}
	};

	onMount(() => {
		worker = new PoWWorker();
		worker.onmessage = (e) => {
			const { type, hash, answer } = e.data;
			if (type === "progress") currentHash = hash;
			else if (type === "done") {
				currentHash = hash;
				verifyAndFinish(answer);
				worker?.terminate();
			}
		};
		worker.onerror = () => {
			stage = "error";
			errorMessage = "计算引擎崩溃 / WORKER_ERR";
		};
	});

	const runPowInWorker = () => {
		worker?.postMessage({ nonce, difficulty });
	};

	const verifyAndFinish = async (answer: string) => {
		try {
			const res = await fetch("/pow/verify", {
				method: "POST",
				body: JSON.stringify({ answer }),
				headers: { "Content-Type": "application/json" },
			});
			if (res.ok) stage = "done";
			else throw new Error();
		} catch (e) {
			stage = "error";
			errorMessage = "验证未通过 / INVALID_PROOF";
		}
	};

	const reset = () => {
		stage = "idle";
		errorMessage = "";
		currentHash = "";
	};

	onDestroy(() => {
		worker?.terminate();
		if (scanTimer) clearInterval(scanTimer);
	});
</script>

<div
	class="min-h-screen flex items-center justify-center p-4 bg-base-200 font-sans text-base-content selection:bg-primary/30"
>
	<div
		class="max-w-md w-full border-l-4 {stage === 'error'
			? 'border-error'
			: 'border-primary'} bg-base-100 p-8 relative overflow-hidden ring-1 ring-base-content/10 transition-colors duration-300 transform-gpu"
	>
		<div class="h-20 -mx-8 relative select-none overflow-hidden mb-0">
			<svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
				{#each dots as dot, i}
					<circle
						cx={dot.x}
						cy={dot.y}
						r={DOT_SIZE / 2}
						fill={stage === "error" ? "oklch(var(--er))" : "currentColor"}
						opacity={stage === "done" || stage === "error"
							? i === litIndex
								? 0.9
								: 0.04
							: stage === "processing"
								? i === litIndex
									? 0.85
									: 0.03
								: 0.05}
					/>
				{/each}
			</svg>
			<div
				class="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-base-100 to-transparent pointer-events-none"
			></div>
			{#if difficulty > 0}
				<div class="absolute bottom-2 right-0 px-8">
					<span class="font-mono text-[9px] tracking-[0.18em] uppercase opacity-30"
						>1 / 2<sup>{difficulty}</sup></span
					>
				</div>
			{/if}
		</div>

		<main>
			<div class="mb-5">
				<h2
					class="text-3xl font-black tracking-tighter uppercase leading-none {stage ===
					'error'
						? 'text-error'
						: ''} transition-colors"
				>
					工作量证明
				</h2>
				<p class="text-xs font-mono opacity-70 uppercase tracking-[0.2em] mt-2">
					Proof of Work Required
				</p>
			</div>

			<div class="-mx-8 relative h-16 overflow-hidden bg-zinc-900 shadow-inner transform-gpu">
				<div
					class="absolute inset-0 flex flex-col justify-center px-8 z-10 transition-all duration-300 ease-out transform-gpu"
					class:bg-success={stage === "done"}
					class:bg-error={stage === "error"}
					style:clip-path={stage === "processing" || stage === "done" || stage === "error"
						? "inset(0 0 0 0)"
						: "inset(0 100% 0 0)"}
				>
					<div
						class="font-mono text-2xl font-bold tracking-widest tabular-nums leading-none"
					>
						{#if stage === "error"}
							<span class="text-error-content brightness-110">ERROR</span>
						{:else if stage === "done"}
							<span class="text-success-content">{displayHash}</span>
						{:else}
							<span class="text-white">{hashParts.bold}</span><span
								class="text-white/20">{hashParts.dim}</span
							>
						{/if}
					</div>
					<div
						class="font-extrabold text-[9px] tracking-[0.2em] uppercase mt-1.5
                        {stage === 'done'
							? 'text-success-content/60'
							: stage === 'error'
								? 'text-error-content/80'
								: 'text-white/40'}"
					>
						{#if stage === "error"}
							{errorMessage} —
							<button
								onclick={reset}
								class="underline cursor-pointer hover:text-white transition-colors"
								>RETRY</button
							>
						{:else if stage === "done"}
							VERIFIED / 成功
						{:else}
							PROCESSING / 处理中
						{/if}
					</div>
				</div>

				<div
					class="absolute inset-0 bg-zinc-700 z-30 pointer-events-none transform-gpu"
					ontransitionrun={handleTransitionRun}
					style="transition: clip-path 0.5s cubic-bezier(0.77, 0,0.175, 1)"
					style:clip-path={stage === "idle"
						? "inset(0 100% 0 0)"
						: stage === "transitioning"
							? "inset(0 0 0 0)"
							: "inset(0 0 0 100%)"}
				></div>

				<button
					onclick={startTransition}
					disabled={fetching || (stage !== "idle" && stage !== "error")}
					class="absolute inset-0 bg-primary flex items-center px-8 z-20 border-none rounded-none active:brightness-90 disabled:pointer-events-none transition-all transform-gpu"
					style:clip-path={stage === "idle" ? "inset(0 0 0 0)" : "inset(0 0 0 100%)"}
					style="transition: clip-path 0.5s cubic-bezier(0.77, 0, 0.175, 1)"
				>
					<div class="flex items-center w-full gap-4">
						<span
							class="font-extrabold text-base tracking-widest whitespace-nowrap text-primary-content"
						>
							{#if fetching}
								正在获取挑战 / FETCHING
							{:else}
								开始 / START
							{/if}
						</span>
						<div class="h-[1.5px] bg-primary-content/30 w-full mt-0.5"></div>
					</div>
				</button>
			</div>
		</main>

		<footer class="mt-12 pt-4 border-t border-base-content/5 flex justify-between items-end">
			<div class="text-[10px] font-mono opacity-40 leading-tight">
				ALGORITHM: SHA-256<br />
				STATUS:
				<span class={stage === "error" ? "text-error opacity-100" : ""}
					>{stage === "processing" ? "CALCULATING" : stage.toUpperCase()}</span
				>
			</div>
			<div class="flex gap-1">
				<div
					class="w-8 h-1 transition-colors duration-300 {stage === 'done'
						? 'bg-success'
						: stage === 'error'
							? 'bg-error'
							: 'bg-primary'}"
				></div>
				<div
					class="w-2 h-1 transition-colors duration-300 {stage === 'done'
						? 'bg-success/40'
						: stage === 'error'
							? 'bg-error/40'
							: 'bg-primary/40'}"
				></div>
				<div
					class="w-2 h-1 transition-colors duration-300 {stage === 'done'
						? 'bg-success/20'
						: stage === 'error'
							? 'bg-error/20'
							: 'bg-primary/20'}"
				></div>
			</div>
		</footer>
	</div>
</div>
