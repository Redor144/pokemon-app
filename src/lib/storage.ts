import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'pokemon-app' });

export const FAVORITE_KEY = 'fav-poke';