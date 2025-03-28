<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import PokemonDetailCard from '$lib/components/PokemonDetailCard.svelte';
	import { getPokemonList } from '$lib/api';
	import type { Pokemon } from '$lib/types';

	let pokemonList: Pokemon[] = [];
	let isLoading = false;
	let hasError = false;
	let offset = 0;
	let selectedPokemon: string | null = null;
	const limit = 20;

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
		if (selectedPokemon) return; // Don't load more when modal is open

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

	function handleSelectPokemon(name: string) {
		selectedPokemon = name;
	}
</script>

<div class="container mx-auto mt-8 px-4 pb-20">
	<div class="mb-10 flex items-center">
		<img
			src="/favicon.png"
			alt="Eleanes Logo"
			class="mr-4 size-[36px]"
			style="image-rendering: pixelated;"
		/>
	</div>

	<h1 class="text-title-large mb-20 font-bold">built with svelte 5</h1>

	{#if isLoading && offset === 0}
		<div class="flex justify-center">
			<div
				class="border-blacka-9 dark:border-whitea-9 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"
			></div>
		</div>
	{:else if hasError}
		<div class="bg-red-3 text-red-11 rounded-md p-4">
			Error loading Pokemon. Please try again later.
		</div>
	{:else}
		{#if selectedPokemon}
			<PokemonDetailCard pokemonName={selectedPokemon} onClose={() => (selectedPokemon = null)} />
		{/if}

		<div
			class="grid grid-cols-2 border-t border-l *:border-r *:border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		>
			{#each pokemonList as pokemon, index (pokemon.name)}
				<div in:fly={{ y: 50, duration: 150, delay: (index % 5) * 50 }}>
					<PokemonCard {pokemon} onClick={() => handleSelectPokemon(pokemon.name)} />
				</div>
			{/each}
		</div>

		{#if isLoading}
			<div class="py-4 text-center">
				<div
					class="border-blacka-9 dark:border-whitea-9 inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2"
				></div>
			</div>
		{/if}
	{/if}
</div>
