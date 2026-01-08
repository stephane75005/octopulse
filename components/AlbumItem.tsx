'use client';

import { useRef, useState, useEffect, ReactNode } from "react";
import { Box, Flex, Text, Image, Badge, Center } from "@chakra-ui/react";
import { Album } from "@/app/data/mesalbums";

interface Props {
  album: Album;
  variant?: "horizontal" | "vertical";
  onPlay?: (album: Album) => void; // <-- envoie l'album entier
  children?: ReactNode; // overlay ou autres éléments
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

// === Equalizer 3 bandes placé en haut à gauche ===
const EqualizerBars: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <Flex
    position="absolute"
    top="5px"
    left="5px"
    direction="row"
    gap="2px"
    align="flex-end"
    h="25px"
    w="20px"
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        w="4px"
        bg="#ffff"
        borderRadius="2px"
        animation={isPlaying ? `bounce 0.6s ${i * 0.1}s infinite alternate` : "none"}
      />
    ))}
    <style jsx>{`
      @keyframes bounce {
        0% { height: 4px; }
        50% { height: 20px; }
        100% { height: 4px; }
      }
    `}</style>
  </Flex>
);

const AlbumItem: React.FC<Props> = ({ album, variant = "horizontal", onPlay, children }) => {
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

    if (activeAudio.ref && activeAudio.ref !== audio) {
      activeAudio.ref.pause();
      activeAudio.setPlaying?.(false);
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        activeAudio = { ref: audio, setPlaying: setIsPlaying };
        onPlay?.(album); // <-- envoie l'album entier
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

  const borderColor = isPlaying ? "#ca3c76" : isPaused ? "red" : isHovered ? "gray" : "transparent";
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
        base: variant === "vertical" ? "155px" : "325px",
        md: variant === "vertical" ? "160px" : "330px",
        lg: variant === "vertical" ? "180px" : "310px",
      }}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "scale(1.05)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
    >
      <Box position="relative">
        <Image
          src={album.imageSrc}
          alt={album.titre}
          w={variant === "vertical" ? "100%" : { base: "80px", md: "100px", lg: "100px" }}
          h={
            variant === "vertical"
              ? { base: "140px", md: "160px", lg: "180px" }
              : { base: "80px", md: "90px", lg: "100px" }
          }
          objectFit="cover"
         
          transition="transform 0.2s ease"
          _hover={{ transform: "scale(1.1)" }}
        />

        {/* Overlay Play/Pause */}
        {isHovered && (
          <Center
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(0,0,0,0.4)"
            borderRadius="8px"
            color="white"
            fontSize="2xl"
          >
            {isPlaying ? "⏸" : "▶"}
          </Center>
        )}

        {/* Equalizer en haut à gauche */}
        <EqualizerBars isPlaying={isPlaying} />

        {/* Enfants optionnels */}
        {children}
      </Box>

      <Box ml={variant === "vertical" ? 0 : 4} mt={variant === "vertical" ? 3 : 0}>
        <Text color="white" fontWeight="bold">
          {album.titre}
          {album.new && (
            <Badge ml="2" colorScheme="green">
              New
            </Badge>
          )}
        </Text>
        <Text color="white" fontSize="sm">{album.artiste}</Text>
        <Text color="white" fontSize="xs">{formatTime(currentTime)} / {album.duree}</Text>

        {duration > 0 && (
          <Box h="4px" bg="gray.600" mt="1" borderRadius="2px">
            <Box h="100%" w={`${progress}%`} bg="pink.600" />
          </Box>
        )}

        <Text color="gray" fontSize="xs">{album.genre} • {album.annee}</Text>
      </Box>

      <audio ref={audioRef} src={album.audioSrc} />
    </Flex>
  );
};

export default AlbumItem;
