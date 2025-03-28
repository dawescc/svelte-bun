// lib/schemas.ts
import { z } from 'zod';

export const nameUrlSchema = z.object({
	name: z.string(),
	url: z.string().url()
});

export const pokemonSchema = z.object({
	name: z.string(),
	url: z.string()
});

export const pokemonListResponseSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(pokemonSchema)
});

export const pokemonDataSchema = z.object({
	id: z.number(),
	name: z.string(),
	base_experience: z.number(),
	height: z.number(),
	weight: z.number(),
	is_default: z.boolean(),
	order: z.number(),

	// Sprites
	sprites: z.object({
		front_default: z.string().url().nullable(),
		back_default: z.string().url().nullable(),
		front_shiny: z.string().url().nullable(),
		back_shiny: z.string().url().nullable(),
		front_female: z.string().url().nullable(),
		back_female: z.string().url().nullable(),
		front_shiny_female: z.string().url().nullable(),
		back_shiny_female: z.string().url().nullable(),
		other: z.record(z.string(), z.record(z.string(), z.string().url().nullable())).optional(),
		versions: z
			.record(
				z.string(),
				z.record(
					z.string(),
					z.record(
						z.string(),
						z.union([
							z.string().url().nullable(),
							z.record(z.string(), z.string().url().nullable())
						])
					)
				)
			)
			.optional()
	}),

	// Types
	types: z.array(
		z.object({
			slot: z.number(),
			type: nameUrlSchema
		})
	),

	// Stats
	stats: z.array(
		z.object({
			base_stat: z.number(),
			effort: z.number(),
			stat: nameUrlSchema
		})
	),

	// Abilities
	abilities: z.array(
		z.object({
			ability: nameUrlSchema,
			is_hidden: z.boolean(),
			slot: z.number()
		})
	),

	// Moves
	moves: z.array(
		z.object({
			move: nameUrlSchema,
			version_group_details: z.array(
				z.object({
					level_learned_at: z.number(),
					move_learn_method: nameUrlSchema,
					version_group: nameUrlSchema,
					order: z.number().nullable()
				})
			)
		})
	),

	// Species
	species: nameUrlSchema,

	// Optional fields
	forms: z.array(nameUrlSchema).optional(),
	game_indices: z
		.array(
			z.object({
				game_index: z.number(),
				version: nameUrlSchema
			})
		)
		.optional(),
	held_items: z
		.array(
			z.object({
				item: nameUrlSchema,
				version_details: z.array(
					z.object({
						rarity: z.number(),
						version: nameUrlSchema
					})
				)
			})
		)
		.optional(),
	location_area_encounters: z.string().url().optional(),
	past_types: z.array(z.any()).optional(),
	past_abilities: z.array(z.any()).optional(),

	// Cries
	cries: z
		.object({
			latest: z.string().url(),
			legacy: z.string().url()
		})
		.optional()
});
