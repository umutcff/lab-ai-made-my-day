// Small helper module for talking to the PokéAPI.

// Base endpoint for the list of Pokémon.
export const POKE_API = "https://pokeapi.co/api/v2/pokemon";

// How many Pokémon we show per page.
export const PAGE_SIZE = 20;

// The list endpoint returns each Pokémon as { name, url }.
// The url looks like "https://pokeapi.co/api/v2/pokemon/25/", and the
// number at the end is the Pokémon id. We use that id to build the image url.
export function getPokemonId(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

// Official artwork for a given Pokémon id.
export function getPokemonImage(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
