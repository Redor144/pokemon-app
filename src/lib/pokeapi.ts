import type { PokemonListItem } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

type PokemonApiResponse = {
    id: number;
    name: string;
    sprites: {
        front_default: string | null;
    };
    types: {
        type: {
            name: string;
        };
    }[];
    stats: {
        base_stat: number;
        stat: {
            name: string;
        };
    }[];
};

function getStat(stats: PokemonApiResponse['stats'], name: string): number {
    return stats.find((stat) => stat.stat.name === name)?.base_stat ?? 0;
}

async function fetchPokemonDetails(url: string): Promise<PokemonListItem> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon details: ${response.statusText}`);
    }
    const data: PokemonApiResponse = await response.json();
    const id = data.id;
    const imageUrl = data.sprites.front_default ?? "";
    const types = data.types.map((type) => type.type.name);
    const stats = data.stats;

    return {
        id,
        name: data.name,
        url,
        imageUrl,
        types,
        hp: getStat(stats, 'hp'),
        attack: getStat(stats, 'attack'),
        defense: getStat(stats, 'defense'),
        speed: getStat(stats, 'speed'),
    };
}

export async function fetchPokemonPage(
    offset: number, limit: number
): Promise<{ items: PokemonListItem[]; hasMore: boolean }> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results) {
        throw new Error("Invalid response format");
    }

    const items = await Promise.all(data.results.map((item: { name: string; url: string }) => 
        fetchPokemonDetails(item.url)
    ));

    return {
        items,
        hasMore: !!data.next,
    };
}