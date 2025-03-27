<script lang="ts">
	import { getPokemonList, getPokemonImageUrl } from '$lib/api';
	import type { Pokemon } from '$lib/types';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let pokemonList: Pokemon[] = [];
	let isLoading = false;
	let hasError = false;
	let offset = 0;
	const limit = 20;

	const imageCache = new Map<string, Promise<string | null>>();

	function getImageUrl(pokemonName: string) {
		if (!imageCache.has(pokemonName)) {
			imageCache.set(pokemonName, getPokemonImageUrl(pokemonName));
		}
		return imageCache.get(pokemonName)!;
	}

	async function loadPokemon() {
		if (hasError || isLoading) return;

		isLoading = true;
		try {
			const data = await getPokemonList(limit, offset);
			pokemonList = [...pokemonList, ...data.results];
			offset += limit;
		} catch (error) {
			hasError = true;
			console.error('Failed to load Pokemon:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleScroll() {
		const scrollPosition = window.scrollY + window.innerHeight;
		const totalHeight = document.documentElement.scrollHeight;
		const scrollPercentage = (scrollPosition / totalHeight) * 100;

		if (scrollPercentage > 77 && !isLoading) {
			loadPokemon();
		}
	}

	onMount(async (): Promise<any> => {
		await loadPokemon();
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="container mx-auto mt-8 px-2">
	<img
		src={'/favicon.png'}
		alt={'Eleanes Logo'}
		class="mb-10 size-[36px]"
		style="image-rendering: pixelated;"
	/>
	<h1 class="text-title-large mb-20 font-bold">built with svelte 5</h1>

	{#if isLoading && offset === 0}
		<p>Loading...</p>
	{:else if hasError}
		<p>Error loading Pokemon.</p>
	{:else}
		<div
			class="*:hover:bg-blacka-1 grid grid-cols-2 border-t border-l *:border-r *:border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		>
			{#each pokemonList as pokemon, index (pokemon.name)}
				<div
					transition:fly={{ y: 50, duration: 500, delay: (index % 4) * 50 }}
					class="group/card p-4 transition-all duration-[333ms] ease-in-out"
				>
					<div class="aspect-square">
						{#await getImageUrl(pokemon.name)}
							<div class="flex h-full w-full items-center justify-center">
								<img
									src={`https://avatar.vercel.sh/${pokemon.name}?rounded=200`}
									alt={pokemon.name}
									style="image-rendering: pixelated;"
									class="size-32 animate-pulse rounded-full opacity-25 blur-2xl"
								/>
							</div>
						{:then imageUrl}
							{#if imageUrl}
								<div class="relative h-full">
									<img
										src={imageUrl}
										alt={pokemon.name}
										class="h-full w-full object-contain group-hover/card:animate-pulse"
										style="image-rendering: pixelated;"
									/>
									<div
										class="bg-gray-3 absolute inset-0 z-[-1] size-full translate-y-[35%] scale-y-[10%] rounded-full"
									></div>
								</div>
							{:else}
								<p class="flex h-full items-center justify-center">No image</p>
							{/if}
						{:catch error}
							<p class="flex h-full items-center justify-center">Error loading image</p>
						{/await}
						<p class="text-title-1 mt-2 text-center font-medium capitalize">{pokemon.name}</p>
					</div>
				</div>
			{/each}
		</div>

		{#if isLoading}
			<div class="py-4 text-center">
				<p>Loading more...</p>
			</div>
		{/if}
	{/if}
</div>
