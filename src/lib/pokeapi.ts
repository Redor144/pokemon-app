import type { PokemonListItem } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function getPokemonIdFromUrl(url: string): number {
    const parts = url.split("/");
    return parseInt(parts[parts.length - 2]);
}

export function getPokemonImageUrl(id: number): string {
    return `${SPRITE_BASE_URL}/${id}.png`;
}

export async function fetchPokemonPage(
    offset: number, limit: number
): Promise<{ items: PokemonListItem[]; hasMore: boolean }> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=15&offset=${offset}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results) {
        throw new Error("Invalid response format");
    }

    const items: PokemonListItem[] = data.results.map((item: { name: string; url: string }) => {
        const id = getPokemonIdFromUrl(item.url);
        return {
            id,
            name: item.name,
            url: item.url,
            imageUrl: getPokemonImageUrl(id),
        };
    });

    return {
        items,
        hasMore: !!data.next,
    };
}