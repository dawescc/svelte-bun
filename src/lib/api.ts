import { z } from 'zod';

const pokemonSchema = z.object({
	name: z.string(),
	url: z.string()
});

const pokemonListResponseSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(pokemonSchema)
});

const fetchPokemon = async (url: string) => {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const data = await response.json();
	const validatedData = pokemonListResponseSchema.parse(data);
	return validatedData;
};

export async function getPokemonList(limit: number = 20, offset: number = 0) {
	const baseUrl = 'https://pokeapi.co/api/v2/pokemon';
	const url = `${baseUrl}?limit=${limit}&offset=${offset}`;

	try {
		return await fetchPokemon(url);
	} catch (error) {
		console.error('Failed to fetch Pokemon:', error);
		throw error;
	}
}

const pokemonDataSchema = z.object({
	id: z.number(),
	sprites: z.object({
		front_default: z.string().nullable()
	})
});

export const getPokemonImageUrl = async (pokemonName: string): Promise<string | null> => {
	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
		if (!response.ok) {
			console.error(`Failed to fetch details for ${pokemonName}: ${response.status}`);
			return null;
		}
		const data = await response.json();
		const validatedData = pokemonDataSchema.parse(data);
		return validatedData.sprites.front_default;
	} catch (error) {
		console.error('Failed to fetch Pokemon data:', error);
		return null;
	}
};
