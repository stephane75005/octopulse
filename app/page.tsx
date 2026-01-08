'use client'
import { Flex, Box, Heading, keyframes } from '@chakra-ui/react'
import { useEffect, useRef } from 'react';
import Header from "@components/Header";
import Lesplusecoutes from "@components/Lesplusecoutes";
import Login from "@components/Login";
import DataAlbums from "@/components/DataAlbums";
import Sidebar from '@components/sidebar';
import MostPlayedAlbums from '@components/MostPlayedAlbums';

export default function Home() {
  const gradientRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  // Parallaxe fluide avec requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (gradientRef.current) gradientRef.current.style.transform = `translateY(${scrollY * 0.02}px)`;
      if (cloudsRef.current) cloudsRef.current.style.transform = `translateY(${scrollY * 0.05}px)`;
      if (starsRef.current) starsRef.current.style.transform = `translateY(${scrollY * 0.08}px)`;
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animation du dégradé vertical
  const gradientAnimation = keyframes`
    0% { background-position: 50% 0%; }
    50% { background-position: 50% 100%; }
    100% { background-position: 50% 0%; }
  `;

  // Étoiles scintillantes
  const starsAnimation = keyframes`
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.3); }
  `;

  // Nuages animés
  const cloudsAnimation = keyframes`
    0% { transform: translate(-20%, -20%) rotate(0deg); opacity: 0.7; }
    50% { transform: translate(20%, 20%) rotate(180deg); opacity: 0.8; }
    100% { transform: translate(-20%, -20%) rotate(360deg); opacity: 0.7; }
  `;

  return (
    <Flex w='100%' h='100%' position="relative" overflow="hidden">
      
      {/* Dégradé animé */}
      <Box
        ref={gradientRef}
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgGradient="linear(to-b, #06195cff, #030c37ff)"
        bgSize="200% 200%"
        bgPosition="center"
        bgRepeat="no-repeat"
        animation={`${gradientAnimation} 30s ease infinite`}
        zIndex={-3}
      />

      {/* Étoiles scintillantes */}
      <Box ref={starsRef} position="absolute" w="100%" h="100%" zIndex={-1}>
        {Array.from({ length: 150 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 2 + 0.5;
          const delay = Math.random() * 5;
          return (
            <Box
              key={i}
              position="absolute"
              top={`${top}%`}
              left={`${left}%`}
              w={`${size}px`}
              h={`${size}px`}
              bg="white"
              borderRadius="50%"
              opacity={0.2}
              animation={`${starsAnimation} 3s ease-in-out ${delay}s infinite`}
            />
          )
        })}
      </Box>

      {/* Contenu principal */}
      <Sidebar />
      <Header />

      <Flex direction="column" px={{ base: '1rem', sm: '1.5rem', md: '2rem', lg: '12rem' }}>
        <Login />

        <Heading color="white" fontSize="4xl" pb="3rem" pt="2rem" noOfLines={1} pl="15px">
          Les plus écoutés
        </Heading>

        <Box pl="1px">
          <MostPlayedAlbums />
        </Box>

        <Heading color="white" fontSize="4xl" pb="3rem" pt="2rem" noOfLines={1} pl="15px">
          Mes Albums
        </Heading>

        <DataAlbums />
        <Box h="4rem" />
      </Flex>
    </Flex>
  );
}
