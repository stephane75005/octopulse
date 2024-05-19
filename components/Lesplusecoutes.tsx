'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Wrap, WrapItem, Box, Flex, Text, Badge, Image } from '@chakra-ui/react';

// Tableau des chansons
const songs = [
  {
    id: "1",
    artiste: "Adele",
    album: "Skyfall",
    titre: "Skyfall",
    genre: "Pop",
    annee: 2012,
    duree: "4:46",
    imageSrc: "skyfall.jpg",
    audioSrc: "skyfall.mp3",
    new: true,
  },
  {
    id: "2",
    artiste: "Lenny Kravitz",
    album: "Blue Electric Light",
    titre: "Johnny Cash",
    genre: "Rock",
    annee: 2004,
    duree: "5:05",
    imageSrc: "lenny-kravitz.jpg",
    audioSrc: "lenny-kravitz.mp3",
    new: false,
  },
  {
    id: "3",
    artiste: "Serge Gainsbourg",
    album: "Essential",
    titre: "Essential",
    genre: "Chanson",
    annee: 1980,
    duree: "3:30",
    imageSrc: "serge-gainsbourg.jpg",
    audioSrc: "havanes.mp3",
    new: false,
  },
  {
    id: "4",
    artiste: "Lucky Star",
    album: "Super Funk",
    titre: "Super Funk",
    genre: "Funk",
    annee: 1999,
    duree: "4:15",
    imageSrc: "super-funk.jpg",
    audioSrc: "superfunk.mp3",
    new: false,
  },
  {
    id: "5",
    artiste: "Adèle Castillon · Mattyeux",
    album: "Amour Plastique",
    titre: "Amour Plastique",
    genre: "Pop",
    annee: 2019,
    duree: "3:20",
    imageSrc: "amour-plastique.jpg",
    audioSrc: "amour-plastique.mp3",
    new: true,
  },
];

interface ActiveAudio {
  ref: HTMLAudioElement | null;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>> | null;
}

// Objet global pour suivre le lecteur audio actif et son état de lecture
let activeAudio: ActiveAudio = {
  ref: null,
  setPlaying: null,
};

const Lesplusecoutes: React.FC = () => {
  // Référence pour l'AudioContext
  const audioContextRef = useRef<AudioContext | null>(null);

  // État pour suivre la piste audio actuelle
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Initialisation de l'AudioContext
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
  }, []);

  // Fonction pour gérer la lecture ou la pause de l'audio
  const handlePlayOrPause = (audioRef: React.RefObject<HTMLAudioElement>, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>, setIsPaused: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!audioRef.current) return;

    if (activeAudio.ref && activeAudio.ref !== audioRef.current) {
      activeAudio.ref.pause();
      if (activeAudio.setPlaying) activeAudio.setPlaying(false);
    }

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      activeAudio = { ref: audioRef.current, setPlaying: setIsPlaying };
      setCurrentAudio(audioRef.current); // Enregistrer la piste audio actuelle
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
      }, 2000); // Désactive le border rouge après 2 secondes
      activeAudio = { ref: null, setPlaying: null }; // Réinitialiser l'audio actif
      setCurrentAudio(null); // Réinitialiser la piste audio actuelle
    }
  };

  return (
    <Flex>
      <Wrap spacing={4} align="center">
        {songs.map(song => {
          const [isPlaying, setIsPlaying] = useState(false);
          const [isHovered, setIsHovered] = useState(false);
          const [isPaused, setIsPaused] = useState(false); // Nouvel état pour la musique arrêtée
          const [currentTime, setCurrentTime] = useState(0);
          const audioRef = useRef<HTMLAudioElement>(null);

          // Met à jour le temps de lecture actuel
          useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;

            const updateTime = () => setCurrentTime(audio.currentTime);
            const updateDuration = () => setCurrentTime(audio.duration);

            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('loadedmetadata', updateDuration);

            return () => {
              audio.removeEventListener('timeupdate', updateTime);
              audio.removeEventListener('loadedmetadata', updateDuration);
            };
          }, []);

          useEffect(() => {
            // Si la musique est arrêtée, met à jour l'état après 2 secondes
            if (isPaused) {
              const timer = setTimeout(() => setIsPaused(false), 2000);
              return () => clearTimeout(timer);
            }
          }, [isPaused]);

          const borderColor = isPlaying ? '#853e8a' : isPaused ? 'red' : isHovered ? 'gray' : 'transparent';

          return (
            <WrapItem
              key={song.id}
              w="220px"
              h="350px"
              bg="#1E1D1D"
              borderRadius="10px"
              p="0.6rem"
              border={`2px solid ${borderColor}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                handlePlayOrPause(audioRef, setIsPlaying, setIsPaused);
              }}
              style={{
                cursor: 'pointer',
                transition: 'border-color 0.3s',
                marginBottom: '0.5rem',
              }}
            >
              <Flex direction="column">
                <Image src={song.imageSrc} alt={song.titre} />
                <Box mt="1rem">
                  <Text color="white" fontWeight="bold">
                    {song.titre}
                    {song.new && (
                      <Badge ml="1" colorScheme="green">
                        New
                      </Badge>
                    )}
                  </Text>
                  <Text color="white" fontSize="sm">{song.artiste}</Text>
                  <Text color="white" fontSize="xs" mt="2">
                  {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {song.duree}
                  </Text>
                  <Text color="gray" fontSize="xs">
                    Genre: {song.genre}, Année: {song.annee}
                  </Text>
                </Box>
                <audio ref={audioRef} src={song.audioSrc}></audio>
              </Flex>
            </WrapItem>
          );
        })}
      </Wrap>
    </Flex>
  );
};

export default Lesplusecoutes;

