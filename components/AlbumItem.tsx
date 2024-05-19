// Import des hooks et composants nécessaires depuis React et Chakra UI
'use client';
import { useRef, useState, useEffect } from "react";
import { WrapItem, Box, Flex, Text, Image, Wrap } from '@chakra-ui/react';

// Définir le type pour activeAudio
interface ActiveAudio {
  ref: HTMLAudioElement | null;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>> | null;
}

// Objet global pour suivre le lecteur audio actif et son état de lecture
let activeAudio: ActiveAudio = {
  ref: null,
  setPlaying: null,
};

// Définir les types des props du composant AlbumItem
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

// Composant représentant un élément d'album
const AlbumItem: React.FC<AlbumItemProps> = ({ id, artiste, titre, imageSrc, audioSrc, genre, annee, duree }) => {
  // États pour gérer l'état de lecture, de pause, le survol et le temps de lecture actuel
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Références pour les éléments audio et canvas
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Effet pour initialiser l'analyseur audio et le canvas
  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      } else {
        console.error("AudioContext is not supported in this browser.");
        return;
      }
    }

    const audioContext = audioContextRef.current;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const draw = () => {
      requestAnimationFrame(draw);

      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      canvasCtx.fillStyle = '#1E1D1D';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArrayRef.current[i] / 3;
        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, []);

  // Effet pour mettre à jour le temps de lecture actuel et la durée totale de l'audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Fonction pour gérer la lecture ou la pause de l'audio
  const handlePlayOrPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
      }, 2000); // Désactive le border rouge après 2 secondes
    } else {
      if (activeAudio.ref && activeAudio.ref !== audioRef.current) {
        activeAudio.ref.pause();
        if (activeAudio.setPlaying) activeAudio.setPlaying(false);
      }
  
      const audioContext = audioContextRef.current;
      if (!sourceRef.current && audioContext && audioRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current!);
        analyserRef.current!.connect(audioContext.destination);
        sourceRef.current = source;
      }
  
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      activeAudio = { ref: audioRef.current, setPlaying: setIsPlaying };
    }
  };

  // Détermination de la couleur du bord en fonction de l'état de lecture, de pause ou du survol
  const borderColor = isPlaying ? '#853e8a' : isPaused ? 'red' : isHovered ? 'gray' : 'transparent';

  // Rendu du composant
  return (
    <Flex justify="center">
      <Wrap spacing={4} align="center">
        <WrapItem
          w="380px"
          h="150px"
          bg="#1E1D1D"
          padding="0.6rem"
          borderRadius="10px"
          border={`2px solid ${borderColor}`}
          onClick={handlePlayOrPause}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            marginBottom: '0.5rem', // Espacement entre les tuiles
          }}
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
              <canvas ref={canvasRef} width="100" height="20" style={{ borderRadius: '0px', marginTop: '5px' }}></canvas>
            </Box>
          </Flex>
          <audio ref={audioRef} src={audioSrc}></audio>
        </WrapItem>
      </Wrap>
    </Flex>
  );
};

// Export du composant AlbumItem
export default AlbumItem;
