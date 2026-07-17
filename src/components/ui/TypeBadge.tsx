import { memo } from "react";
import { View, Text } from "react-native";
import { getPokemonType } from "@/constants/pokemonTypes";
import { commonStyles } from "@/styles/common";

type Props = {
  type: string;
};

const TypeBadge = memo(function TypeBadge({ type }: Props) {
  const meta = getPokemonType(type);
  const Icon = meta.icon;

  return (
    <View
      style={[
        commonStyles.typeBadge,
        { backgroundColor: meta.bg, borderColor: meta.color },
      ]}
    >
      <Icon color={meta.color} size={10} />
      <Text style={[commonStyles.typeText, { color: meta.color }]}>
        {type.toUpperCase()}
      </Text>
    </View>
  );
});

export default TypeBadge;
