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

	async function loadPokemon() {
		// Remove the isLoading check since we handle loading state properly now
		if (hasError) return;

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

	onMount(async (): Promise<any> => {
		await loadPokemon();

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading) {
					loadPokemon();
				}
			},
			{ threshold: 0.1 }
		);

		if (loadMoreRef) {
			observer.observe(loadMoreRef);
		}

		return () => {
			observer.disconnect();
		};
	});

	let loadMoreRef: HTMLDivElement;
</script>

<div class="container mx-auto mt-8 px-2">
	<img
		src={'/favicon.png'}
		alt={'Eleanes Logo'}
		class="mb-10 size-[36px]"
		style="image-rendering: pixelated;"
	/>
	<h1 class="mb-20 text-[36px]/[42px] font-bold">built with svelte 5</h1>

	{#if isLoading && offset === 0}
		<p>Loading...</p>
	{:else if hasError}
		<p>Error loading Pokemon.</p>
	{:else}
		<div
			class="*:hover:bg-blacka-1 grid grid-cols-2 divide-x divide-y border-t border-l sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		>
			{#each pokemonList as pokemon, index (pokemon.name)}
				<div
					transition:fly={{ y: 50, duration: 500, delay: (index % 4) * 50 }}
					class="group/card p-4 transition-all duration-[333ms] ease-in-out"
				>
					<div>
						{#await getPokemonImageUrl(pokemon.name) then imageUrl}
							{#if imageUrl}
								<div class="relative">
									<img
										src={imageUrl}
										alt={pokemon.name}
										class="w-full group-hover/card:animate-bounce"
										style="image-rendering: pixelated;"
									/>
									<div
										class="absolute inset-0 z-[-1] size-full translate-y-[35%] scale-y-[10%] rounded-full bg-gray-100 dark:bg-[rgb(25,25,25)]"
									></div>
								</div>
							{:else}
								<p>No image</p>
							{/if}
						{:catch error}
							<p>Error loading image</p>
						{/await}
						<p class="text-title-1 text-center font-medium capitalize">{pokemon.name}</p>
					</div>
				</div>
			{/each}
		</div>
		<div bind:this={loadMoreRef} class="py-4 text-center">
			{#if isLoading}
				<p>Loading more...</p>
			{/if}
		</div>
	{/if}
</div>
