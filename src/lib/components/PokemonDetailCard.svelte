<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { getPokemonDetails, getPokemonList } from '$lib/api';
	import type { PokemonData } from '$lib/types';

	export let pokemonName: string;
	export let onClose: () => void;

	let pokemon: PokemonData | null = null;
	let isLoading = true;
	let hasError = false;
	let activeTab: 'stats' | 'moves' | 'abilities' = 'stats';
	let pokemonList: string[] = [];
	let currentIndex = -1;

	onMount(() => {
		document.body.style.overflow = 'hidden';
		loadPokemonList();
	});

	onDestroy(() => {
		document.body.style.overflow = '';
	});

	async function loadPokemonList() {
		try {
			// Load first 151 Pokemon (or adjust as needed)
			const data = await getPokemonList(151, 0);
			pokemonList = data.results.map((p) => p.name);
			currentIndex = pokemonList.findIndex((name) => name === pokemonName);
		} catch (error) {
			console.error('Failed to load Pokemon list:', error);
		}
	}

	async function loadPokemonDetails(name: string) {
		try {
			isLoading = true;
			pokemon = await getPokemonDetails(name);
			pokemonName = name;
		} catch (error) {
			hasError = true;
			console.error(`Failed to load details for ${name}:`, error);
		} finally {
			isLoading = false;
		}
	}

	function goToPrevious() {
		if (currentIndex > 0) {
			const prevName = pokemonList[currentIndex - 1];
			currentIndex--;
			loadPokemonDetails(prevName);
		}
	}

	function goToNext() {
		if (currentIndex < pokemonList.length - 1) {
			const nextName = pokemonList[currentIndex + 1];
			currentIndex++;
			loadPokemonDetails(nextName);
		}
	}

	onMount(async () => {
		try {
			isLoading = true;
			pokemon = await getPokemonDetails(pokemonName);
		} catch (error) {
			hasError = true;
			console.error(`Failed to load details for ${pokemonName}:`, error);
		} finally {
			isLoading = false;
		}
	});

	function formatStatName(statName: string): string {
		switch (statName) {
			case 'hp':
				return 'HP';
			case 'attack':
				return 'Attack';
			case 'defense':
				return 'Defense';
			case 'special-attack':
				return 'Sp. Atk';
			case 'special-defense':
				return 'Sp. Def';
			case 'speed':
				return 'Speed';
			default:
				return statName;
		}
	}

	function getTypeColor(type: string): string {
		const typeColors: Record<string, string> = {
			normal: '#A8A77A',
			fire: '#EE8130',
			water: '#6390F0',
			electric: '#F7D02C',
			grass: '#7AC74C',
			ice: '#96D9D6',
			fighting: '#C22E28',
			poison: '#A33EA1',
			ground: '#E2BF65',
			flying: '#A98FF3',
			psychic: '#F95587',
			bug: '#A6B91A',
			rock: '#B6A136',
			ghost: '#735797',
			dragon: '#6F35FC',
			dark: '#705746',
			steel: '#B7B7CE',
			fairy: '#D685AD'
		};

		return typeColors[type] || '#777777';
	}
</script>

<div
	class="bg-blacka-12 fixed inset-0 z-50 flex items-center justify-center p-4"
	transition:fade={{ duration: 200 }}
>
	{#if isLoading}
		<div class="border-whitea-12 h-16 w-16 animate-spin rounded-full border-t-2 border-b-2"></div>
	{:else if hasError || !pokemon}
		<div class="w-full max-w-md rounded-lg p-6" transition:scale={{ duration: 200, start: 0.9 }}>
			<h2 class="mb-4 text-xl font-bold">Error</h2>
			<p>Failed to load Pokemon details. Please try again.</p>
			<button
				on:click={onClose}
				class="bg-red-9 text-whitea-12 hover:bg-red-10 mt-4 rounded-md px-4 py-2"
			>
				Close
			</button>
		</div>
	{:else}
		<div
			class="w-full max-w-4xl overflow-hidden rounded-lg shadow-xl"
			transition:scale={{ duration: 200, start: 0.9 }}
		>
			<div
				class="border-blacka-3 dark:border-whitea-3 flex items-center justify-between border-b p-4"
			>
				<div class="flex items-center">
					<button
						class="hover:bg-blacka-1 dark:hover:bg-whitea-2 mr-2 rounded-full p-1"
						aria-label="Previous Pokemon"
						on:click={goToPrevious}
						disabled={currentIndex <= 0}
						class:opacity-50={currentIndex <= 0}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-6 w-6"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>
					<h2 class="text-2xl font-bold capitalize">{pokemon.name}</h2>
					<span class="text-blacka-9 dark:text-whitea-9 ml-2"
						>#{pokemon.id.toString().padStart(3, '0')}</span
					>
					<button
						class="hover:bg-blacka-1 dark:hover:bg-whitea-2 ml-2 rounded-full p-1"
						aria-label="Next Pokemon"
						on:click={goToNext}
						disabled={currentIndex >= pokemonList.length - 1}
						class:opacity-50={currentIndex >= pokemonList.length - 1}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-6 w-6"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				</div>
				<button
					on:click={onClose}
					class="hover:bg-blacka-1 dark:hover:bg-whitea-2 rounded-full p-1"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</div>

			<div
				class="grid max-h-[calc(90vh-4rem)] grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-2"
			>
				<div class="flex flex-col items-center">
					<div
						class="bg-blacka-1 dark:bg-whitea-1 relative mb-4 aspect-square w-full rounded-lg p-4"
					>
						{#if pokemon.sprites.other?.home?.front_default || pokemon.sprites.front_default}
							<img
								src={pokemon.sprites.other?.home?.front_default || pokemon.sprites.front_default}
								alt={pokemon.name}
								class="h-full w-full object-contain"
							/>
						{/if}
					</div>

					<div class="w-full">
						<div class="mb-4 flex justify-center gap-2">
							{#each pokemon.types as typeInfo}
								<span
									class="text-whitea-12 rounded-full px-3 py-1 text-sm font-medium capitalize"
									style="background-color: {getTypeColor(typeInfo.type.name)}"
								>
									{typeInfo.type.name}
								</span>
							{/each}
						</div>

						<div class="grid grid-cols-2 gap-4 text-center">
							<div class="bg-blacka-1 dark:bg-whitea-1 rounded-lg p-3">
								<p class="text-blacka-9 dark:text-whitea-9 text-sm">Height</p>
								<p class="font-medium">{(pokemon.height / 10).toFixed(1)}m</p>
							</div>
							<div class="bg-blacka-1 dark:bg-whitea-1 rounded-lg p-3">
								<p class="text-blacka-9 dark:text-whitea-9 text-sm">Weight</p>
								<p class="font-medium">{(pokemon.weight / 10).toFixed(1)}kg</p>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div class="border-blacka-3 dark:border-whitea-3 mb-4 flex border-b">
						<button
							class="px-4 py-2 font-medium {activeTab === 'stats'
								? 'border-blue-9 text-blue-9 border-b-2'
								: 'text-blacka-9 dark:text-whitea-9'}"
							on:click={() => (activeTab = 'stats')}
						>
							Stats
						</button>
						<button
							class="px-4 py-2 font-medium {activeTab === 'abilities'
								? 'border-blue-9 text-blue-9 border-b-2'
								: 'text-blacka-9 dark:text-whitea-9'}"
							on:click={() => (activeTab = 'abilities')}
						>
							Abilities
						</button>
						<button
							class="px-4 py-2 font-medium {activeTab === 'moves'
								? 'border-blue-9 text-blue-9 border-b-2'
								: 'text-blacka-9 dark:text-whitea-9'}"
							on:click={() => (activeTab = 'moves')}
						>
							Moves
						</button>
					</div>

					{#if activeTab === 'stats'}
						<div class="space-y-3">
							{#each pokemon.stats as stat}
								<div>
									<div class="mb-1 flex justify-between">
										<span class="text-sm font-medium capitalize">
											{formatStatName(stat.stat.name)}
										</span>
										<span class="text-sm font-medium">{stat.base_stat}</span>
									</div>
									<div class="bg-blacka-3 dark:bg-whitea-3 h-2.5 w-full rounded-full">
										<div
											class="bg-blue-9 h-2.5 rounded-full"
											style="width: {Math.min(100, (stat.base_stat / 255) * 100)}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					{:else if activeTab === 'abilities'}
						<div class="space-y-4">
							{#each pokemon.abilities as abilityInfo}
								<div class="bg-blacka-1 dark:bg-whitea-1 rounded-lg p-3">
									<div class="flex items-center justify-between">
										<h3 class="font-medium capitalize">
											{abilityInfo.ability.name.replace('-', ' ')}
										</h3>
										{#if abilityInfo.is_hidden}
											<span
												class="bg-purple-3 text-purple-11 dark:bg-purple-9 dark:text-purple-1 rounded-full px-2 py-1 text-xs font-medium"
											>
												Hidden
											</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else if activeTab === 'moves'}
						<div class="max-h-[400px] space-y-2 overflow-y-auto pr-2">
							{#each pokemon.moves.slice(0, 20) as moveInfo}
								<div class="bg-blacka-1 dark:bg-whitea-1 rounded-lg p-2">
									<p class="font-medium capitalize">{moveInfo.move.name.replace('-', ' ')}</p>
									<p class="text-blacka-9 dark:text-whitea-9 text-xs">
										Level: {moveInfo.version_group_details[0]?.level_learned_at || 'N/A'}
									</p>
								</div>
							{/each}
							{#if pokemon.moves.length > 20}
								<p class="text-blacka-9 dark:text-whitea-9 text-center text-sm">
									+ {pokemon.moves.length - 20} more moves
								</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
