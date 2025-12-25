'use client';

import { useState, useEffect, useCallback } from "react";
import AlbumItem from "./AlbumItem";
import { albumsData, Album } from "@/app/data/mesalbums";

const MostPlayedAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    // 1️⃣ Trier par plays décroissant
    const sortedByPlays = [...albumsData].sort((a, b) => b.plays - a.plays);
    const topAlbums = sortedByPlays.slice(0, 10);

    // 2️⃣ Mélanger le top 10
    const shuffledTopAlbums = [...topAlbums].sort(() => Math.random() - 0.5);

    // 3️⃣ Prendre les 6 premiers
    const top6Albums = shuffledTopAlbums.slice(0, 6);

    setAlbums(top6Albums);
  }, []);

  // Incrémenter le nombre d'écoutes avec type guard
  const handlePlay = useCallback((albumId: number) => {
    setAlbums(prev =>
      prev.map(a =>
        // Vérifie que l'id existe et est un number
        a.id != null && a.id === albumId ? { ...a, plays: a.plays + 1 } : a
      )
    );
  }, []);

  // Loader côté client
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
