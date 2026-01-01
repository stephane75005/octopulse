'use client';

import { useState, useEffect, useCallback } from "react";
import AlbumItem from "./AlbumItem";
import { albumsData, Album } from "@/app/data/mesalbums";

const MostPlayedAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const sortedByPlays = [...albumsData].sort((a, b) => b.plays - a.plays);
    const topAlbums = sortedByPlays.slice(0, 10);
    const shuffledTopAlbums = [...topAlbums].sort(() => Math.random() - 0.5);
    const top6Albums = shuffledTopAlbums.slice(0, 10); // ✅ 6 albums
    setAlbums(top6Albums);
  }, []);

  // Incrémenter le nombre d'écoutes
  const handlePlay = useCallback((album: Album) => {
    setAlbums(prev =>
      prev.map(a => (a.id === album.id ? { ...a, plays: a.plays + 1 } : a))
    );
  }, []);

  if (albums.length === 0) return <p style={{ color: "white" }}>Chargement...</p>;

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {albums.map(album => (
        <AlbumItem
          key={album.id}
          album={album}
          variant="vertical"
          onPlay={handlePlay}
        />
      ))}
    </div>
  );
};

export default MostPlayedAlbums;
