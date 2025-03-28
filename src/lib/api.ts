import { pokemonDataSchema, pokemonListResponseSchema } from '$lib/schemas';
import type { PokemonData } from '$lib/types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit: number = 20, offset: number = 0) {
	const url = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		return pokemonListResponseSchema.parse(data);
	} catch (error) {
		console.error('Failed to fetch Pokemon list:', error);
		throw error;
	}
}

export async function getPokemonImageUrl(pokemonName: string): Promise<string | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonName}`);
		if (!response.ok) {
			console.error(`Failed to fetch details for ${pokemonName}: ${response.status}`);
			return null;
		}

		const data = await response.json();
		const validatedData = pokemonDataSchema.parse(data);
		return (
			validatedData.sprites.other?.home?.front_default ||
			validatedData.sprites.other?.['official-artwork']?.front_default ||
			validatedData.sprites.front_default
		);
	} catch (error) {
		console.error('Failed to fetch Pokemon data:', error);
		return null;
	}
}

export async function getPokemonDetails(pokemonName: string): Promise<PokemonData> {
	try {
		const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonName}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch details for ${pokemonName}: ${response.status}`);
		}

		const data = await response.json();
		return pokemonDataSchema.parse(data);
	} catch (error) {
		console.error('Failed to fetch Pokemon details:', error);
		throw error;
	}
}
