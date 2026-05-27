import React from "react";
import { FlatList } from "react-native";
import { Figurinha } from "../data/album";
import { CardFigurinha } from "./CardFigurinha";

export const ListaFigurinhas: React.FC<{
  data: Figurinha[];
  onToggle: (stickerId: string) => void;
}> = ({ data, onToggle }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <CardFigurinha figurinha={item} onToggle={() => onToggle(item.id)} />
      )}
    />
  );
};
