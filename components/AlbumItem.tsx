'use client';

import { useRef, useState, useEffect } from "react";
import { WrapItem, Box, Flex, Text, Image, Wrap } from '@chakra-ui/react';

interface ActiveAudio {
  ref: HTMLAudioElement | null;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>> | null;
}

let activeAudio: ActiveAudio = { ref: null, setPlaying: null };

interface AlbumItemProps {
  id: string;
  artiste: string;
  titre: string;
  imageSrc: string;
  audioSrc: string;
  genre: string;
  annee: number;
  duree: string;
}

const formatTime = (t: number) => {
  if (!t || isNaN(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const AlbumItem: React.FC<AlbumItemProps> = ({
  artiste,
  titre,
  imageSrc,
  audioSrc,
  genre,
  annee,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  /* ================= AUDIO CONTEXT + VISUALIZER ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const audioContext = audioContextRef.current;

    if (!analyserRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
    }

    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    if (audioRef.current && !sourceRef.current) {
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const h = dataArray[i] / 3;
        ctx.fillStyle = `rgb(${h + 100},50,50)`;
        ctx.fillRect(x, canvas.height - h, barWidth, h);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      analyser.disconnect();
      // Ne pas déconnecter sourceRef
    };
  }, []);

  /* ================= TIME UPDATE ================= */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateMeta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateMeta);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateMeta);
    };
  }, []);

  /* ================= PLAY / PAUSE ================= */
  const handlePlayOrPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Pause l'autre audio actif si nécessaire
    if (activeAudio.ref && activeAudio.ref !== audio) {
      activeAudio.ref.pause();
      activeAudio.setPlaying?.(false);
    }

    try {
      if (audio.paused) {
        // Resume AudioContext si suspendu
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }

        await audio.play();
        setIsPlaying(true);
        setIsPaused(false);
        activeAudio = { ref: audio, setPlaying: setIsPlaying };
      } else {
        audio.pause();
        setIsPlaying(false);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 1500);
      }
    } catch (err) {
      console.error("Lecture impossible:", err);
    }
  };

  /* ================= SEEK ================= */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const borderColor =
    isPlaying ? "#853e8a" : isPaused ? "red" : isHovered ? "gray" : "transparent";

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Flex justify="center">
      <Wrap>
        <WrapItem
          w={["320px", "380px"]}
          h="140px"
          bg="#1E1D1D"
          p="0.6rem"
          borderRadius="10px"
          border={`2px solid ${borderColor}`}
          onClick={handlePlayOrPause}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          cursor="pointer"
        >
          <Flex>
            <Image w="90px" h="90px" src={imageSrc} alt={artiste} />
            <Box ml="4" flex="1">
              <Text color="white" fontWeight="bold">{titre}</Text>
              <Text color="white" fontSize="sm">{artiste}</Text>

              <Text color="white" fontSize="xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <Box
                ref={progressRef}
                h="4px"
                bg="gray.600"
                mt="1"
                borderRadius="2px"
                onClick={handleSeek}
              >
                <Box
                  h="100%"
                  w={`${progress}%`}
                  bg="#853e8a"
                  borderRadius="2px"
                />
              </Box>

              <Text color="gray" fontSize="xs" mt="1">
                {genre} • {annee}
              </Text>

              <canvas ref={canvasRef} width={100} height={20} />
            </Box>
          </Flex>

          <audio ref={audioRef} src={audioSrc} />
        </WrapItem>
      </Wrap>
    </Flex>
  );
};

export default AlbumItem;
