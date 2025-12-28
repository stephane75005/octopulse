'use client';

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Checkbox,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import AlbumItem from "@/components/AlbumItem";
import { albumsData, Album } from "@/app/data/mesalbums";

type Playlist = {
  name: string;
  albums: Album[];
};

// Carrousel avec flèches
const Carousel = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Flex align="center" position="relative" gap={2}>
      <IconButton
        aria-label="Scroll left"
        icon={<ChevronLeftIcon />}
        onClick={() => scroll("left")}
        position="absolute"
        left={0}
        zIndex={10}
        colorScheme="purple"
        size="sm"
      />
      <Flex
        ref={containerRef}
        overflowX="auto"
        gap={3}
        py={2}
        scrollSnapType="x mandatory"
        css={{
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "#853e8a", borderRadius: "3px" },
        }}
        flex="1"
      >
        {children}
      </Flex>
      <IconButton
        aria-label="Scroll right"
        icon={<ChevronRightIcon />}
        onClick={() => scroll("right")}
        position="absolute"
        right={0}
        zIndex={10}
        colorScheme="purple"
        size="sm"
      />
    </Flex>
  );
};

export default function CreerUnePlaylistPage() {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  // Audio côté client uniquement
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;
    };
  }, []);

  // Toggle album
  const toggleAlbum = (albumId: number) => {
    setSelectedAlbums((prev) =>
      prev.includes(albumId)
        ? prev.filter((id) => id !== albumId)
        : [...prev, albumId]
    );
  };

  const selectedAlbumsData = albumsData.filter((a) => selectedAlbums.includes(a.id));

  // Créer playlist
  const handleCreatePlaylist = () => {
    if (!playlistName || selectedAlbumsData.length === 0) return;
    setPlaylists((prev) => [...prev, { name: playlistName, albums: selectedAlbumsData }]);
    setPlaylistName("");
    setSelectedAlbums([]);
  };

  // Supprimer playlist
  const handleDeletePlaylist = (index: number) => {
    setPlaylists((prev) => prev.filter((_, i) => i !== index));
    if (currentlyPlayingIndex === index) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentlyPlayingIndex(null);
      setCurrentTrackIndex(0);
    }
  };

  // Edit playlist
  const handleEditPlaylist = (index: number) => {
    setEditingIndex(index);
    setEditName(playlists[index].name);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    setPlaylists((prev) =>
      prev.map((pl, i) => (i === editingIndex ? { ...pl, name: editName } : pl))
    );
    setEditingIndex(null);
    setEditName("");
  };

  // Play / Stop des playlists
  const handlePlayStop = (playlistIndex: number) => {
    const playlist = playlists[playlistIndex];
    if (!playlist || playlist.albums.length === 0) return;

    if (currentlyPlayingIndex === playlistIndex) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentlyPlayingIndex(null);
      setCurrentTrackIndex(0);
    } else {
      playTrack(playlistIndex, 0);
    }
  };

  // Fonction pour jouer une piste spécifique
  const playTrack = (playlistIndex: number, trackIndex: number) => {
    const playlist = playlists[playlistIndex];
    if (!playlist) return;

    const track = playlist.albums[trackIndex];
    if (!track) return;

    setCurrentlyPlayingIndex(playlistIndex);
    setCurrentTrackIndex(trackIndex);

    if (audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.play().catch((err) => console.log("Erreur lecture audio:", err));
      audioRef.current.onended = () => {
        if (trackIndex < playlist.albums.length - 1) {
          playTrack(playlistIndex, trackIndex + 1);
        } else {
          setCurrentlyPlayingIndex(null);
          setCurrentTrackIndex(0);
        }
      };
    }
  };

  return (
    <Box bg="#121212" minH="100vh" p={6}>
      <Heading color="white" mb={6}>Créer une playlist</Heading>

      <Input
        placeholder="Nom de la playlist"
        mb={6}
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        bg="#1E1D1D"
        color="white"
        border="1px solid #333"
        _focus={{ borderColor: "#853e8a" }}
      />

      <Text color="gray.400" mb={4}>
        Sélectionne des albums ({selectedAlbums.length} sélectionnés)
      </Text>

      <Flex wrap="wrap" gap={4} mb={6}>
        {albumsData.map((album) => (
          <Box key={album.id} p={1} minW="180px">
            <Checkbox
              isChecked={selectedAlbums.includes(album.id)}
              onChange={() => toggleAlbum(album.id)}
              colorScheme="purple"
            >
              <AlbumItem album={album} variant="horizontal" />
            </Checkbox>
          </Box>
        ))}
      </Flex>

      {selectedAlbumsData.length > 0 && (
        <Box mb={6} p={4} bg="#1E1D1D" borderRadius="10px">
          <Heading size="sm" color="white" mb={2}>Aperçu de la playlist</Heading>
          <Text color="gray.400" mb={3}>{playlistName || "Playlist sans nom"}</Text>
          <Carousel>
            {selectedAlbumsData.map((album) => (
              <Box key={album.id} minW="200px" bg="#121212" borderRadius="6px" p={2} flexShrink={0} scrollSnapAlign="start">
                <Text color="white" fontWeight="medium" fontSize="sm">{album.titre}</Text>
                <Text color="gray.500" fontSize="xs" mb={2}>{album.artiste}</Text>
                <Button size="xs" colorScheme="red" variant="ghost" onClick={() => toggleAlbum(album.id)}>Retirer</Button>
              </Box>
            ))}
          </Carousel>
        </Box>
      )}

      <Flex justify="flex-end" mb={6}>
        <Button colorScheme="purple" size="md" isDisabled={!playlistName || selectedAlbums.length === 0} onClick={handleCreatePlaylist}>
          Créer la playlist
        </Button>
      </Flex>

      {playlists.length > 0 && (
        <Box>
          <Heading size="sm" color="gray.300" mb={4}>Playlists créées</Heading>
          <VStack spacing={3} align="stretch">
            {playlists.map((pl, index) => (
              <Box key={index} p={3} bg={currentlyPlayingIndex === index ? "#2D1B52" : "#1A1A1A"} borderRadius="10px">
                <Flex justify="space-between" align="center" mb={2}>
                  {editingIndex === index ? (
                    <Flex gap={2}>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} bg="#121212" color="white" size="sm" />
                      <Button size="sm" colorScheme="green" onClick={handleSaveEdit}>Sauvegarder</Button>
                    </Flex>
                  ) : (
                    <Heading size="xs" color="white">{pl.name}</Heading>
                  )}

                  <Flex gap={1}>
                    <Button size="xs" colorScheme={currentlyPlayingIndex === index ? "red" : "green"} onClick={() => handlePlayStop(index)}>
                      {currentlyPlayingIndex === index ? "Stop" : "Play"}
                    </Button>
                    <IconButton aria-label="Éditer" icon={<EditIcon />} size="xs" onClick={() => handleEditPlaylist(index)} />
                    <IconButton aria-label="Supprimer" icon={<DeleteIcon />} size="xs" colorScheme="red" onClick={() => handleDeletePlaylist(index)} />
                  </Flex>
                </Flex>

                {currentlyPlayingIndex === index && pl.albums[currentTrackIndex] && (
                  <Text color="green.300" fontSize="sm" mb={2}>
                    🎵 Lecture en cours : {pl.albums[currentTrackIndex].titre} - {pl.albums[currentTrackIndex].artiste}
                  </Text>
                )}

                <Carousel>
                  {pl.albums.map((album) => (
                    <Box key={album.id} minW="180px" bg="#121212" borderRadius="6px" p={2} flexShrink={0} scrollSnapAlign="start">
                      <AlbumItem album={album} variant="horizontal" />
                      <Text color="gray.400" fontSize="xs" mt={1}>{album.titre} - {album.artiste}</Text>
                    </Box>
                  ))}
                </Carousel>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
}
