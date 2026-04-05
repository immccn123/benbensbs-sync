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
			<span class="text-primary">Synchronizer</span>
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
			</div>

			<div class="md:col-span-5 flex flex-col gap-4">
				<a
					class="group relative border border-base-content/20 p-4 hover:border-primary transition-colors cursor-pointer bg-base-200/50"
					href="/auth"
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
