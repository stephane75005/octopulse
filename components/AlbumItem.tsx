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

const AlbumItem: React.FC<AlbumItemProps> = ({ id, artiste, titre, imageSrc, audioSrc, genre, annee, duree }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialisation audio et canvas
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return console.error("AudioContext not supported.");

    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const audioContext = audioContextRef.current;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength); // <-- tableau local, jamais null

    if (audioRef.current && !sourceRef.current) {
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const draw = () => {
      requestAnimationFrame(draw);

      if (!analyserRef.current) return;

      // Toujours utiliser le tableau local
      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = '#1E1D1D';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 1.5;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] / 3;
        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, []);

  // Gestion du temps et de la durée
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Lecture / pause
  const handlePlayOrPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 2000);
    } else {
      if (activeAudio.ref && activeAudio.ref !== audioRef.current) {
        activeAudio.ref.pause();
        activeAudio.setPlaying?.(false);
      }

      if (audioContextRef.current && !sourceRef.current && audioRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current!);
        analyserRef.current!.connect(audioContextRef.current.destination);
        sourceRef.current = source;
      }

      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      activeAudio = { ref: audioRef.current, setPlaying: setIsPlaying };
    }
  };

  const borderColor = isPlaying ? '#853e8a' : isPaused ? 'red' : isHovered ? 'gray' : 'transparent';

  return (
    <Flex justify="center">
      <Wrap spacing={4} align="center">
        <WrapItem
          w={["320px", null, "380px"]}
          h="150px"
          bg="#1E1D1D"
          padding="0.6rem"
          borderRadius="10px"
          border={`2px solid ${borderColor}`}
          onClick={handlePlayOrPause}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ cursor: 'pointer', transition: 'border-color 0.3s', marginBottom: '0.5rem' }}
        >
          <Flex direction="row" alignItems="center">
            <Image w="90px" h="90px" src={imageSrc} alt={artiste} borderRadius="5px" />
            <Box ml="5" pt="1rem" flex="1">
              <Text color="white" fontWeight="bold">{titre}</Text>
              <Text color="white" fontSize="sm">{artiste}</Text>
              <Text color="white" fontSize="xs" mt="2">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {duree}
              </Text>
              <Text color="gray" fontSize="xs">
                Genre: {genre}, Année: {annee}
              </Text>
              <canvas ref={canvasRef} width="100" height="20" style={{ borderRadius: '0px', marginTop: '5px' }} />
            </Box>
          </Flex>
          <audio ref={audioRef} src={audioSrc} />
        </WrapItem>
      </Wrap>
    </Flex>
  );
};

export default AlbumItem;
