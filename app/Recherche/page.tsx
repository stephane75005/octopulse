"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  Flex,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiSearch, FiChevronLeft } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import AlbumItem from "@/components/AlbumItem";
import { albumsData } from "@/app/data/mesalbums";

/* util : suppression des accents */
const normalize = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function RecherchePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Chargement des favoris depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Sauvegarde des favoris dans localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Filtrage des albums
  const filteredAlbums = useMemo(() => {
    const value = normalize(search);
    return albumsData.filter(album => {
      const matchSearch =
        normalize(album.artiste).includes(value) ||
        normalize(album.album).includes(value) ||
        normalize(album.titre).includes(value) ||
        normalize(album.genre).includes(value);
      const matchFav = showFavoritesOnly ? favorites.includes(album.id) : true;
      return matchSearch && matchFav;
    });
  }, [search, favorites, showFavoritesOnly]);

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="#121212" minH="100vh">
      {/* Header avec bouton retour */}
      <Flex align="center" mb={6} gap={4}>
        <IconButton
          aria-label="Retour Home"
          icon={<FiChevronLeft />}
          colorScheme="purple"
          size="sm"       // bouton compact comme sur Favoris
          onClick={() => router.push("/")}
        />
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Recherche
        </Text>
      </Flex>

      {/* Barre de recherche */}
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="white" size={18} />
        </InputLeftElement>
        <Input
          placeholder="Rechercher un artiste, album, titre ou genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="#1E1D1D"
          color="white"
          border="1px solid #333"
          pl="2.5rem"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            borderColor: "#853e8a",
            boxShadow: "0 0 0 1px #853e8a",
          }}
        />
      </InputGroup>

      {/* Bouton filtrer favoris */}
      <Button
        mb={8}
        size="sm"
        bg={showFavoritesOnly ? "red.600" : "#1E1D1D"}
        color="white"
        border="1px solid #333"
        _hover={{ bg: showFavoritesOnly ? "red.700" : "#2A2A2A" }}
        leftIcon={showFavoritesOnly ? <FaHeart color="white" /> : <FaRegHeart color="white" />}
        onClick={() => setShowFavoritesOnly(prev => !prev)}
      >
        {showFavoritesOnly ? "Favoris uniquement" : "Afficher les favoris"}
      </Button>

      {/* Résultats */}
      {filteredAlbums.length === 0 ? (
        <Text color="gray.500">Aucun résultat trouvé.</Text>
      ) : (
        <Flex wrap="wrap" gap={6} justify={{ base: "center", md: "flex-start" }}>
          {filteredAlbums.map(album => {
            const isFavorite = favorites.includes(album.id);

            return (
              <Box key={album.id} position="relative">
                <AlbumItem album={album} variant="vertical" />
                <IconButton
                  aria-label="Favori"
                  icon={isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
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
            );
          })}
        </Flex>
      )}
    </Box>
  );
}
