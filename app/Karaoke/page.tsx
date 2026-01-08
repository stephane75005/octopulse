"use client";

import { useState, useMemo } from "react";
import {
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  Flex,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiSearch, FiChevronLeft } from "react-icons/fi";
import { TbMicrophone2 } from "react-icons/tb";

import AlbumItem from "@/components/AlbumItem";
import { albumsData } from "@/app/data/karaoke";

/* util : suppression des accents */
const normalize = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function LibrairiePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"artiste" | "album" | "genre">("artiste");

  // Filtrage et tri des albums
  const filteredAlbums = useMemo(() => {
    const value = normalize(search);
    let result = albumsData.filter(
      (album) =>
        normalize(album.artiste).includes(value) ||
        normalize(album.album).includes(value) ||
        normalize(album.titre).includes(value) ||
        normalize(album.genre).includes(value)
    );

    result.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    return result;
  }, [search, sortBy]);

  const handleMicroClick = (albumId: number) => {
    router.push(`/karaoke-player/${albumId}`);
  };

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="#121212" minH="100vh">
      {/* Header */}
      <Flex align="center" mb={6} gap={4}>
        <IconButton
          aria-label="Retour Home"
          icon={<FiChevronLeft />}
        bg="#ca3c76"
          color="white"
          _hover={{ bg: "#881c49ff" }}
          _active={{ bg: "#ca3c76" }}
          size="sm"
          onClick={() => router.push("/")}
        />
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Karaoké
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
            borderColor: "#ca3c76",
            boxShadow: "0 0 0 1px #ca3c76",
          }}
        />
      </InputGroup>

      {/* Tri */}
      <Flex mb={8} gap={4} flexWrap="wrap">
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "artiste" | "album" | "genre")}
          size="sm"
          bg="#1E1D1D"
          color="white"
          border="1px solid #333"
          _hover={{ bg: "#2A2A2A" }}
        >
          <option value="artiste">Trier par artiste</option>
          <option value="album">Trier par album</option>
          <option value="genre">Trier par genre</option>
        </Select>
      </Flex>

      {/* Résultats */}
      {filteredAlbums.length === 0 ? (
        <Text color="gray.500">Aucun album trouvé.</Text>
      ) : (
        <Flex wrap="wrap" gap={6} justify={{ base: "center", md: "flex-start" }}>
          {filteredAlbums.map((album) => (
            <Box key={album.id} position="relative">
              <AlbumItem album={album} variant="vertical" />

              {/* Micro carré blanc */}
              <IconButton
                aria-label="Karaoké"
                icon={<TbMicrophone2 color="white" />}
                size="sm"
                position="absolute"
                top="6px"
                right="6px"
                bg="rgba(0,0,0,0.65)"
                borderRadius="md"
                _hover={{ bg: "rgba(0,0,0,0.85)", transform: "scale(1.15)" }}
                _active={{ transform: "scale(0.95)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMicroClick(album.id);
                }}
              />
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}
