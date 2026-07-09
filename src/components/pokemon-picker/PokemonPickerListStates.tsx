import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/theme';
import FeatureCardPlaceholder from '@/components/ui/FeatureCardPlaceholder';
import { pokemonPickerStyles } from '@/components/pokemon-picker/pokemonPickerStyles';
import {
  COULD_NOT_LOAD_POKEMON_CAPTION,
  COULD_NOT_LOAD_POKEMON_TITLE,
} from '@/constants/messages';

type Props = {
  variant: 'screen' | 'embedded';
  state: 'loading' | 'error';
  onRetry?: () => void;
};

export default function PokemonPickerListStates({ variant, state, onRetry }: Props) {
  if (state === 'loading') {
    const content = <ActivityIndicator size="large" color={colors.primary} />;

    if (variant === 'screen') {
      return <View style={pokemonPickerStyles.screenState}>{content}</View>;
    }

    return <View style={pokemonPickerStyles.embeddedState}>{content}</View>;
  }

  const errorContent = (
    <FeatureCardPlaceholder
      title={COULD_NOT_LOAD_POKEMON_TITLE}
      caption={COULD_NOT_LOAD_POKEMON_CAPTION}
      onAction={onRetry ? () => onRetry() : undefined}
    />
  );

  if (variant === 'screen') {
    return errorContent;
  }

  return <View style={pokemonPickerStyles.embeddedState}>{errorContent}</View>;
}
