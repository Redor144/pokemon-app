import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoriteScreen() {
  const [favoritePokemon, setFavoritePokemon] = useState<string | null>(null);

  useEffect(() => {
    loadFavorite();
  }, []);

  const loadFavorite = async () => {
    try{
      const favPokemon = await AsyncStorage.getItem('fav-poke');
      setFavoritePokemon(favPokemon ? JSON.parse(favPokemon) : null);
    } catch (error) {
      console.error("Error logging favorite: ", error);
    }
  };
  
  if (!favoritePokemon) {
    return (
      <View style={styles.container}>
        <Text>Placeholder for NO favorite pokémon sad</Text>
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <Text>Placeholder for favorite pokémon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});