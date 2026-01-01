"use client";

import { useState, useEffect } from "react";
import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

import AlbumItem from "@/components/AlbumItem";
import { albumsData } from "@/app/data/mesalbums";

export default function FavorisPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const favoriteAlbums = albumsData.filter(album => favorites.includes(album.id));

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="#121212" minH="100vh">
      {/* Header avec bouton retour */}
      <Flex align="center" mb={6} gap={4}>
        <IconButton
          aria-label="Retour Home"
          icon={<FiChevronLeft />}
          bg="#ae29b8"
          color="white"
          _hover={{ bg: "#9822a1" }}
          _active={{ bg: "#821c8a" }}
          size="sm"
          onClick={() => router.push("/")}
        />
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Mes Favoris
        </Text>
      </Flex>

      {favoriteAlbums.length === 0 ? (
        <Text color="gray.500">Aucun favori pour le moment.</Text>
      ) : (
        <Flex wrap="wrap" gap={6} justify={{ base: "center", md: "flex-start" }}>
          {favoriteAlbums.map(album => (
            <Box key={album.id} position="relative">
              <AlbumItem album={album} variant="vertical" />

              <IconButton
                aria-label="Favori"
                icon={<FaHeart color="red" />}
                size="sm"
                position="absolute"
                top="6px"
                right="6px"
                bg="rgba(0,0,0,0.65)"
                _hover={{ bg: "rgba(0,0,0,0.85)", transform: "scale(1.15)" }}
                _active={{ transform: "scale(0.95)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(album.id);
                }}
              />
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}
