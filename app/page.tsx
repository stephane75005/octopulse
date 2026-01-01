'use client'
import { Flex, Spacer, Text, Center, Square, Box, Wrap, WrapItem, Image, Heading } from '@chakra-ui/react'
import { useRef, useState } from "react"

import Header from "@components/Header";
import Lesplusecoutes from "@components/Lesplusecoutes";
import Login from "@components/Login";
import DataAlbums from "@/components/DataAlbums";
import Sidebar from '@components/sidebar';
import MostPlayedAlbums from '@components/MostPlayedAlbums';

export default function Home() {
  return (
    <>
      <Flex
        w='100%'
        h='100%'
        bgImage="url('images/forme-abstrait5.jpg')"   // ✅ image de fond
        bgSize="cover"                        // couvre tout le conteneur
        bgPosition="center"                    // centre l'image
        bgRepeat="no-repeat"                   // ne pas répéter
      >
        <Sidebar />
        <Header />
        <Flex
          direction="column"
          px={{ base: '1rem', sm: '1.5rem', md: '2rem', lg: '12rem' }}
        >
          <Login />
          <Heading
            color="white"
            fontSize="4xl"
            pb="3rem"
            pt="2rem"
            noOfLines={1}
            pl="15px"
          >
            Les plus écoutés
          </Heading>

          <Box pl="1px">
            <MostPlayedAlbums />
          </Box>

          <Heading
            color="white"
            fontSize="4xl"
            pb="3rem"
            pt="2rem"
            noOfLines={1}
            pl="15px"
          >
            Mes Albums
          </Heading>
          <DataAlbums />
          <Box h="4rem" />
        </Flex>
      </Flex>
    </>
  );
}
