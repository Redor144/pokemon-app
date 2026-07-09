import { Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import { favoriteStyles } from '@/components/favorite/favoriteStyles';

const NO_FAVORITE_TITLE = 'No favorite yet';
const NO_FAVORITE_CAPTION = 'Open the Pokédex and set a Pokémon as your favorite.';

export default function FavoriteEmptyState() {
  return (
    <View style={commonStyles.centered}>
      <Heart color={colors.mutedForeground} size={40} />
      <Text style={favoriteStyles.emptyTitle}>{NO_FAVORITE_TITLE}</Text>
      <Text style={favoriteStyles.emptyCaption}>{NO_FAVORITE_CAPTION}</Text>
    </View>
  );
}
