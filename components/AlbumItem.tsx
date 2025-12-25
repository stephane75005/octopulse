'use client';

import { useRef, useState, useEffect } from "react";
import { Box, Flex, Text, Image, Badge } from "@chakra-ui/react";
import { Album } from "@/app/data/mesalbums";

interface Props {
  album: Album;
  variant?: "horizontal" | "vertical";
  onPlay?: (albumId: number) => void;
}

interface ActiveAudio {
  ref: HTMLAudioElement | null;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>> | null;
}

let activeAudio: ActiveAudio = { ref: null, setPlaying: null };

const formatTime = (t: number) => {
  if (!t || isNaN(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const AlbumItem: React.FC<Props> = ({
  album,
  variant = "horizontal",
  onPlay,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setCurrentTime(audio.currentTime);
    const meta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", meta);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", meta);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop l’audio actif précédent
    if (activeAudio.ref && activeAudio.ref !== audio) {
      activeAudio.ref.pause();
      activeAudio.setPlaying?.(false);
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        activeAudio = { ref: audio, setPlaying: setIsPlaying };

        // ✅ album.id est bien un number
        onPlay?.(album.id);
      } else {
        audio.pause();
        setIsPlaying(false);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 1500);
      }
    } catch (err) {
      console.warn("Audio playback failed:", err);
    }
  };

  const borderColor =
    isPlaying ? "#853e8a" : isPaused ? "red" : isHovered ? "gray" : "transparent";

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Flex
      direction={variant === "vertical" ? "column" : "row"}
      bg="#1E1D1D"
      borderRadius="10px"
      border={`2px solid ${borderColor}`}
      p="0.6rem"
      cursor="pointer"
      onClick={togglePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      w={{
        base: variant === "vertical" ? "140px" : "310px",
        md: variant === "vertical" ? "182px" : "380px",
        lg: variant === "vertical" ? "200px" : "420px",
      }}
    >
      <Image
        src={album.imageSrc}
        alt={album.titre}
        w={variant === "vertical" ? "100%" : { base: "80px", md: "90px", lg: "100px" }}
        h={
          variant === "vertical"
            ? { base: "140px", md: "160px", lg: "180px" }
            : { base: "80px", md: "90px", lg: "100px" }
        }
        objectFit="cover"
        borderRadius="8px"
      />

      <Box ml={variant === "vertical" ? 0 : 4} mt={variant === "vertical" ? 3 : 0}>
        <Text color="white" fontWeight="bold">
          {album.titre}
          {album.new && (
            <Badge ml="2" colorScheme="green">
              New
            </Badge>
          )}
        </Text>

        <Text color="white" fontSize="sm">
          {album.artiste}
        </Text>

        <Text color="white" fontSize="xs">
          {formatTime(currentTime)} / {album.duree}
        </Text>

        {duration > 0 && (
          <Box h="4px" bg="gray.600" mt="1" borderRadius="2px">
            <Box h="100%" w={`${progress}%`} bg="#853e8a" />
          </Box>
        )}

        <Text color="gray" fontSize="xs">
          {album.genre} • {album.annee}
        </Text>
      </Box>

      <audio ref={audioRef} src={album.audioSrc} />
    </Flex>
  );
};

export default AlbumItem;
