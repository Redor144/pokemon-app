import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { typography } from "@/constants/theme";
import type { PokemonListItem } from "@/types/pokemon";
import PokemonPickerList from "@/components/pokemon-picker/PokemonPickerList";
import ModalSheetContainer from "@/components/sheets/ModalSheetContainer";
import { useFavoritePokemon } from "@/contexts/FavoritePokemonContext";
import { useModalBottomSheet } from "@/hooks/useModalBottomSheet";

export type PokemonPickerSheetRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  selectedId?: number | null;
  onSelect: (pokemon: PokemonListItem) => void;
};

const LIST_HEIGHT = 280;
const CHOOSE_POKEMON_TITLE = "Choose Pokémon";

const PokemonPickerSheet = forwardRef<PokemonPickerSheetRef, Props>(
  ({ selectedId, onSelect }, ref) => {
    const { favorite } = useFavoritePokemon();
    const { index, isOpen, requestOpen, close, handleIndexChange } =
      useModalBottomSheet();

    const handleSelect = useCallback(
      (pokemon: PokemonListItem) => {
        onSelect(pokemon);
        close();
      },
      [onSelect, close],
    );

    useImperativeHandle(ref, () => ({
      open: requestOpen,
      close,
    }));

    return (
      <ModalSheetContainer
        index={index}
        onIndexChange={handleIndexChange}
        contentStyle={styles.sheetContent}
      >
        <Text style={styles.title}>{CHOOSE_POKEMON_TITLE}</Text>
        <PokemonPickerList
          enabled={isOpen}
          onSelect={handleSelect}
          selectedId={selectedId}
          favoriteId={favorite?.id}
          listHeight={LIST_HEIGHT}
        />
      </ModalSheetContainer>
    );
  },
);

PokemonPickerSheet.displayName = "PokemonPickerSheet";

export default PokemonPickerSheet;

const styles = StyleSheet.create({
  sheetContent: {
    alignItems: "stretch",
  },
  title: {
    ...typography.heading,
    textAlign: "center",
  },
});
