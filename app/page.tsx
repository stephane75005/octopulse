'use client'
import { Flex, Spacer, Text, Center, Square, Box,  Wrap, WrapItem, Image, Heading } from '@chakra-ui/react'
import { useRef, useState} from "react"


import Header from "@components/Header";
import Lesplusecoutes from "@components/Lesplusecoutes";
import Login from "@components/Login";
import Mesalbums from '@components/Mesalbums';
import Sidebar from '@components/sidebar';


export default function Home() {
  return (
    <>
    <Flex w='100%' h='100%' bgGradient='linear(to-tr, #1A202C, #2C5282)' >
    <Sidebar/>
    <Header/>
    <Flex direction='column' pl='2rem' pr='2rem'>
    <Login/>
    <Heading color='white' fontSize='4xl' pb='3rem' pt='2rem' noOfLines={1}> Les plus écoutés</Heading>
    <Lesplusecoutes/>
    <Heading color='white' fontSize='4xl' pb='3rem' pt='2rem' noOfLines={1}> Mes Albums</Heading>
    <Mesalbums/>
    </Flex>
    </Flex>
    </>
  );
}
