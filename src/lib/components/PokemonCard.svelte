<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemonImageUrl } from '$lib/api';
	import type { Pokemon } from '$lib/types';

	export let pokemon: Pokemon;
	export let onClick: () => void;

	let imageUrl: string | null = null;
	let isLoading = true;
	let hasError = false;

	onMount(async () => {
		try {
			isLoading = true;
			imageUrl = await getPokemonImageUrl(pokemon.name);
		} catch (error) {
			hasError = true;
			console.error(`Failed to load image for ${pokemon.name}:`, error);
		} finally {
			isLoading = false;
		}
	});
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="group bg-whitea-12 dark:bg-blacka-2 cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
	on:click={onClick}
	role="button"
>
	<div class="p-4">
		<div class="relative flex aspect-square items-center justify-center">
			{#if isLoading}
				<div class="flex h-full w-full items-center justify-center">
					<img
						src={`https://avatar.vercel.sh/${pokemon.name}?rounded=200`}
						alt={pokemon.name}
						style="image-rendering: pixelated;"
						class="size-32 animate-pulse rounded-full opacity-25 blur-2xl"
					/>
				</div>
			{:else if hasError}
				<div class="text-red-9 flex h-full items-center justify-center">Error</div>
			{:else}
				<div class="relative h-full w-full">
					<img
						src={imageUrl || ''}
						alt={pokemon.name}
						class="h-full w-full object-contain transition-all duration-300 group-hover:animate-bounce"
						style="image-rendering: pixelated;"
					/>
					<div
						class="bg-blacka-1 dark:bg-whitea-1 absolute bottom-0 z-[-1] h-[50%] w-full translate-y-[40%] scale-y-30 rounded-full"
					></div>
				</div>
			{/if}
		</div>
		<h2 class="mt-4 text-center text-lg font-medium capitalize">
			{pokemon.name}
		</h2>
	</div>
</div>
