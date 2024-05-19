// Import des hooks et composants nécessaires depuis React et Chakra UI
'use client';
import { useRef, useState, useEffect } from "react";
import { WrapItem, Box, Flex, Text, Image } from '@chakra-ui/react';

// Objet global pour suivre le lecteur audio actif et son état de lecture
let activeAudio = {
  ref: null,
  setPlaying: null,
};

// Composant représentant un élément d'album
const AlbumItem = ({ id, artiste, titre, imageSrc, audioSrc, genre, annee, duree }) => {
  // États pour gérer l'état de lecture, de pause, le survol et le temps de lecture actuel
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Références pour les éléments audio et canvas
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  // Effet pour initialiser l'analyseur audio et le canvas
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = '#1E1D1D';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 3;
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
        activeAudio.setPlaying(false);
      }
  
      const audioContext = audioContextRef.current;
      if (!sourceRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
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
   <WrapItem
  w="370px"
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
    margin: 'auto', // Ajout de cette ligne pour centrer
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
<Text color="white" fontSize="xs">
Genre: {genre}, Année: {annee}
</Text>
<canvas ref={canvasRef} width="100" height="20" style={{ borderRadius: '10px', marginTop: '5px' }}></canvas>
</Box>
</Flex>
<audio ref={audioRef} src={audioSrc}></audio>
</WrapItem>
);
};

// Export du composant AlbumItem
export default AlbumItem;