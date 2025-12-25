'use client';
import { useRef, useState, useEffect } from "react";
import { WrapItem, Box, Flex, Text, Image, Wrap } from '@chakra-ui/react';

interface ActiveAudio {
  ref: HTMLAudioElement | null;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>> | null;
}

let activeAudio: ActiveAudio = {
  ref: null,
  setPlaying: null,
};

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

const AlbumItem: React.FC<AlbumItemProps> = ({
  id, artiste, titre, imageSrc, audioSrc, genre, annee, duree
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;

    if (!AudioContextClass) {
      console.error("AudioContext not supported");
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass(); // ✅ FIX
    }

    const audioContext = audioContextRef.current;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

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
      requestAnimationFrame(draw);
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] / 3;
        ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, []);

  const handlePlayOrPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 1500);
    } else {
      if (activeAudio.ref && activeAudio.ref !== audioRef.current) {
        activeAudio.ref.pause();
        activeAudio.setPlaying?.(false);
      }

      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      activeAudio = { ref: audioRef.current, setPlaying: setIsPlaying };
    }
  };

  const borderColor =
    isPlaying ? '#853e8a' : isPaused ? 'red' : isHovered ? 'gray' : 'transparent';

  return (
    <Flex justify="center">
      <Wrap spacing={4}>
        <WrapItem
          w={["320px", "380px"]}
          h="150px"
          bg="#1E1D1D"
          p="0.6rem"
          borderRadius="10px"
          border={`2px solid ${borderColor}`}
          onClick={handlePlayOrPause}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          cursor="pointer"
        >
          <Flex align="center">
            <Image w="90px" h="90px" src={imageSrc} alt={artiste} borderRadius="5px" />
            <Box ml="5" flex="1">
              <Text color="white" fontWeight="bold">{titre}</Text>
              <Text color="white" fontSize="sm">{artiste}</Text>
              <Text color="gray" fontSize="xs">
                Genre: {genre}, <br/>
                Année: {annee}
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
