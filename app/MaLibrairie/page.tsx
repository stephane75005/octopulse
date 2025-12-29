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

import AlbumItem from "@/components/AlbumItem";
import { albumsData } from "@/app/data/mesalbums";

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
    let result = albumsData.filter(album =>
      normalize(album.artiste).includes(value) ||
      normalize(album.album).includes(value) ||
      normalize(album.titre).includes(value) ||
      normalize(album.genre).includes(value)
    );

    result.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    return result;
  }, [search, sortBy]);

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="#121212" minH="100vh">
      {/* Header */}
      <Flex align="center" mb={6} gap={4}>
        <IconButton
          aria-label="Retour Home"
          icon={<FiChevronLeft />}
          colorScheme="purple"
          size="sm"
          onClick={() => router.push("/")}
        />
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Ma librairie
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
          {filteredAlbums.map(album => (
            <Box key={album.id}>
              <AlbumItem album={album} variant="vertical" />
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}
