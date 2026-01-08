"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Image,
  Flex,
  IconButton,
  Center,
  VStack,
} from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb";
import { albumsData, Album, LyricLine, Word } from "@/app/data/karaoke";

export default function KaraokePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params?.id ? Number(params.id) : null;

  const [albumIndex, setAlbumIndex] = useState<number | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number | null>(null);

  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const setLineRef = (index: number) => (el: HTMLDivElement | null) => {
    lineRefs.current[index] = el;
  };

  useEffect(() => {
    if (albumId !== null) {
      const index = albumsData.findIndex(a => a.id === albumId);
      if (index !== -1) {
        setAlbumIndex(index);
        setAlbum(albumsData[index]);
      }
    }
  }, [albumId]);

  useEffect(() => {
    async function loadLyrics() {
      if (!album || !album.lrcSrc) return;
      try {
        const res = await fetch(album.lrcSrc);
        const lrcText = await res.text();
        const lyrics = parseLRC(lrcText);
        setAlbum({ ...album, lyrics });
      } catch (err) {
        console.error("Erreur lecture LRC :", err);
      }
    }
    loadLyrics();
  }, [album]);

  const parseLRC = (lrcText: string): LyricLine[] => {
    const lines: LyricLine[] = [];
    const lrcLines = lrcText.split(/\r?\n/);

    for (const l of lrcLines) {
      const match = l.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (!match) continue;

      const min = parseInt(match[1], 10);
      const sec = parseFloat(match[2]);
      const text = match[3].trim();
      if (!text) continue;

      const start = min * 60 + sec;

      const words: Word[] = text.split(" ").map((word, i) => ({
        text: word,
        start: start + i * 0.5,
        end: start + (i + 1) * 0.5,
      }));

      lines.push({
        words,
        start: words[0].start,
        end: words[words.length - 1].end,
        duration: words[words.length - 1].end - words[0].start,
      });
    }
    return lines;
  };

  const updateProgress = () => {
    if (audioRef.current && !isDragging) {
      setProgress(audioRef.current.currentTime);
      const lyrics: LyricLine[] = album?.lyrics ?? [];
      const idx = lyrics.findIndex(
        (line, i) =>
          audioRef.current!.currentTime >= line.start! &&
          (i === lyrics.length - 1 || audioRef.current!.currentTime < lyrics[i + 1].start!)
      );
      if (idx !== -1) setCurrentLyricIndex(idx);
    }
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    if (isPlaying) animationRef.current = requestAnimationFrame(updateProgress);
    else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, isDragging, album]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!album) return <Box p={6} color="white" bg="#121212" minH="100vh">Aucun album trouvé</Box>;

  const lyrics: LyricLine[] = album?.lyrics ?? [];

  return (
    <Box minH="100vh" w="full" position="relative" overflow="hidden" bg="#121212" color="white">
      {/* Arrière-plan flou et animé */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        backgroundImage={`url(${album.imageSrc})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="blur(25px) brightness(0.5)"
        transform="scale(1.1)"
        animation="zoomInOut 20s ease-in-out infinite alternate"
        zIndex={0}
      />
      <style jsx>{`
        @keyframes zoomInOut {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>

      {/* Contenu principal */}
      <Box position="relative" zIndex={1} p={6}>
        <Flex align="center" mb={6} gap={4}>
          <IconButton
            aria-label="Retour"
            icon={<FiChevronLeft />}
            bg="#ca3c76"
          color="white"
          _hover={{ bg: "#881c49ff" }}
          _active={{ bg: "#ca3c76" }}
            size="sm"
            onClick={() => router.push("/Karaoke")}
          />
          <Text fontSize="2xl" fontWeight="bold">Karaoke</Text>
        </Flex>

        <Center>
          <Flex direction={{ base: "column", md: "row" }} gap={6} align="center" maxW="1000px" w="full">
            <Box position="relative">
              <Image src={album.imageSrc} alt={album.album} boxSize={{ base: "300px", md: "500px" }} objectFit="cover" borderRadius="xl" />
              <IconButton
                aria-label={isPlaying ? "Pause" : "Play"}
                icon={isPlaying ? <TbPlayerPause size={36} /> : <TbPlayerPlay size={36} />}
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
               bg="#ca3c76"
               color="white"
               _hover={{ bg: "#881c49ff" }}
               _active={{ bg: "#ca3c76" }}
                borderRadius="full"
                size="lg"
                onClick={togglePlay}
              />
            </Box>

            <VStack align="start" spacing={4} bg="rgba(0,0,0,0.5)" p={6} borderRadius="xl" w={{ base: "full", md: "auto" }}>
              <Text fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold">{album.album}</Text>

              <Box id="progress-bar" w="full" mt={2} h="8px" bg="gray.700" borderRadius="md" cursor="pointer" onMouseDown={(e) => {
                setIsDragging(true);
                const moveProgress = (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  if (!audioRef.current) return;
                  const progressBar = document.getElementById("progress-bar");
                  if (!progressBar) return;
                  const rect = progressBar.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  let newTime = (clickX / rect.width) * (audioRef.current.duration || 0);
                  newTime = Math.max(0, Math.min(newTime, audioRef.current.duration || 0));
                  audioRef.current.currentTime = newTime;
                  setProgress(newTime);
                };
                moveProgress(e);
                const handleMouseUp = () => {
                  setIsDragging(false);
                  window.removeEventListener("mousemove", moveProgress as any);
                  window.removeEventListener("mouseup", handleMouseUp);
                };
                window.addEventListener("mousemove", moveProgress as any);
                window.addEventListener("mouseup", handleMouseUp);
              }}>
                <Box h="100%" bg="#ca3c76" borderRadius="md" w={`${(progress / (duration || 1)) * 100}%`} />
              </Box>

              <Flex justify="space-between" mt={1}>
                <Text fontSize="sm">{formatTime(progress)} / {formatTime(duration)}</Text>
              </Flex>

              <Box ref={lyricsContainerRef} maxH="300px" overflowY="auto" w="full" mt={4} px={2}>
                <VStack spacing={1} align="start">
                  {lyrics.map((line, i) => {
                    const isActiveLine = i === currentLyricIndex;
                    return (
                      <Text key={i} ref={setLineRef(i)} fontSize={isActiveLine ? "lg" : "md"} fontWeight={isActiveLine ? "bold" : "normal"} whiteSpace="nowrap" style={{ color: isActiveLine ? "#ca3c76" : "white", transition: "color 0.2s" }}>
                        {line.words.map((word, wIndex) => {
                          const audioTime = audioRef.current?.currentTime || 0;
                          const isCurrentWord = audioTime >= word.start && audioTime <= word.end;
                          const progressRatio = Math.min(Math.max((audioTime - word.start) / (word.end - word.start), 0), 1);
                          return (
                            <span key={wIndex} style={{
                              color: isCurrentWord ? "#d6bcfa" : "inherit",
                              background: isCurrentWord ? `linear-gradient(to right, #d6bcfa ${progressRatio * 100}%, transparent ${progressRatio * 100}%)` : "none",
                              WebkitBackgroundClip: isCurrentWord ? "text" : "none",
                              WebkitTextFillColor: isCurrentWord ? "transparent" : "inherit",
                              marginRight: "4px",
                              transition: "color 0.1s linear",
                            }}>{word.text}</span>
                          );
                        })}
                      </Text>
                    );
                  })}
                </VStack>
              </Box>
            </VStack>
          </Flex>
        </Center>
      </Box>

      {album.audioSrc && <audio ref={audioRef} src={album.audioSrc} onLoadedMetadata={() => { if (audioRef.current) { setDuration(audioRef.current.duration || 0); setProgress(0); } }} />}
    </Box>
  );
}
