import { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Image,
  Text,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';
import { commonStyles } from '@/styles/common';
import { spacing } from '@/constants/theme';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonListRow from '@/components/PokemonListRow';


export default function PokemonListScreen() {
  const { pokemonList, isLoading, isRefreshing, loadMore, refresh } = usePokemonList();
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);

  const handleRowPress = useCallback((pokemon: PokemonListItem) => {
    setSelectedPokemon(pokemon);
  }, []);

  return (
    <View style={commonStyles.screen}>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <PokemonListRow
            pokemon={item}
            onPress={handleRowPress}
            />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={
          isLoading && !isRefreshing ? (
            <ActivityIndicator size="large" style={{ margin: spacing.lg }} />
          ) : null
        }
      />

      <Modal
        visible={!!selectedPokemon}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPokemon(null)}
      >
        <Pressable style={commonStyles.backdrop} onPress={() => setSelectedPokemon(null)}>
          <Pressable style={commonStyles.card} onPress={() => {}}>
            {selectedPokemon && (
              <>
                <Image
                  source={{ uri: selectedPokemon.imageUrl }}
                  style={styles.modalImage}
                />
                <Text style={commonStyles.title}>
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
  thumbnail: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  rowText: {
    color: "#ffffff",
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1,
  },
  modalImage: {
    width: 120,
    height: 120,
  },
});