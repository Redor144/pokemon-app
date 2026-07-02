import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Pressable, Modal, Image } from 'react-native';

interface PokemonListItem {
    name: string;
    url: string;
    id: number;
    imageUrl: string;
}

export default function PokemonListScreen() {
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const loadingMoreRef = useRef(false);
    const offsetRef = useRef(0);


    const LIMIT = 20;

    useEffect(() => {
        fetchPokemon(0, false);
    }, []);

    const fetchPokemon = async (currentOffset: number, append: boolean) => {
        if (loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setIsLoading(true);

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`)
            const data = await response.json();

            const formattedResults: PokemonListItem[] = data.results.map((item: any) => {
                const urlParts = item.url.split('/');
                const id = parseInt(urlParts[urlParts.length - 2], 10);
                return {
                    name: item.name,
                    url: item.url,
                    id: id,
                    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                };
            });

            if (append) {
                setPokemonList((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const newItems = formattedResults.filter((p) => !existingIds.has(p.id));
                    return [...prev, ...newItems];
                });
            } else {
                setPokemonList(formattedResults);
            }
        } catch (error) {
            console.error("Error fetching Pokémon list: ", error);
        } finally {
            loadingMoreRef.current = false;
            offsetRef.current = currentOffset;
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }

  return (
    <View style={styles.list}>
        <FlatList
            data={pokemonList}
            keyExtractor={(item) => item.id.toString()}

            renderItem={({ item }) => (
                <Pressable onPress={() => setSelectedPokemon(item)}>
                    <View style={styles.row}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.thumbnail}
                            resizeMode="contain"
                        />
                        <Text style={styles.rowText}>
                            #{item.id} - {item.name}
                        </Text>
                    </View>
                </Pressable>
            )}

            onEndReached={() => {
                const nextOffset = offsetRef.current + LIMIT;
                fetchPokemon(nextOffset, true);
            }}
            onEndReachedThreshold={0.5}
            
            refreshing={isRefreshing}
            onRefresh={() => {
                setIsRefreshing(true);
                offsetRef.current = 0;
                fetchPokemon(0, false);
            }}

            ListFooterComponent={
                isLoading && !isRefreshing ? (
                    <ActivityIndicator size="large" style={{ margin: 15 }} />
                ) : null
            }
        />
        <Modal
            visible={!!selectedPokemon}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedPokemon(null)}
        >
            <Pressable style={styles.backdrop} onPress={() => setSelectedPokemon(null)}>
                <Pressable style={styles.card} onPress={() => {}}>
                    {selectedPokemon && (
                        <>
                            <Image source={{ uri: selectedPokemon.imageUrl }} style={{ width: 120, height: 120 }}/>
                            <Text style={styles.title}>
                                #{selectedPokemon.id} - {selectedPokemon.name} 
                            </Text>
                        </>
                    )}
                </Pressable>
            </Pressable>

        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 10
  },
  text: {
    textAlign: 'center',
    marginVertical: 10
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
    textTransform: 'capitalize'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  thumbnail: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  rowText: {
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1
  }
});