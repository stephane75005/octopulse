'use client';

import { Wrap } from "@chakra-ui/react";
import AlbumItem from "./AlbumItem";
import { albumsData } from "@/app/data/mesalbums";

const DataAlbums = () => {
  return (
    <Wrap spacing={4}>
      {albumsData.map(album => (
        <AlbumItem
          key={album.id}
          album={album}
          variant="horizontal"
        />
      ))}
    </Wrap>
  );
};

export default DataAlbums;