import { z } from 'zod';
import { pokemonSchema, pokemonDataSchema } from './schemas';

type Pokemon = z.infer<typeof pokemonSchema>;
type PokemonData = z.infer<typeof pokemonDataSchema>;
