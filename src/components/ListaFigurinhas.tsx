import React, { useCallback } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { useAlbum } from "../context/AlbumContext";
import { Figurinha } from "../data/album";
import { CardFigurinha } from "./CardFigurinha";

const keyExtractor = (i: Figurinha) => i.id;

const ListaFigurinhasInner: React.FC<{
  data: Figurinha[];
  onToggle: (stickerId: string) => void;
}> = ({ data, onToggle }) => {
  const { stickerToTeamId } = useAlbum();

  const renderItem = useCallback<ListRenderItem<Figurinha>>(
    ({ item }) => (
      <CardFigurinha
        figurinha={item}
        teamId={stickerToTeamId[item.id]}
        onToggle={() => onToggle(item.id)}
      />
    ),
    [stickerToTeamId, onToggle],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={7}
      removeClippedSubviews
    />
  );
};

export const ListaFigurinhas = React.memo(ListaFigurinhasInner);
