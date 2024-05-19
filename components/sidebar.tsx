import React, { useState } from 'react';
import { Box, Flex, IconButton, Text, Divider, useDisclosure } from '@chakra-ui/react';
import { FiMenu, FiHome, FiSearch, FiBookOpen, FiPlus, FiHeart } from 'react-icons/fi';

const Sidebar = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex>
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        zIndex="100"
        bg="gray.800"
        p={4}
        width={{ base: '100%', md: '250px' }}
        boxShadow={{ base: 'none', md: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Contenu du menu latéral */}
        <Box mt={100}>
          <Box mb={4}>
            <Flex align="center">
              <FiHome color={isOpen ? 'white' : 'gray.300'} />
              <Text ml={3} fontWeight="bold" color={isOpen ? 'white' : 'gray.300'}>Accueil</Text>
            </Flex>
          </Box>
          <Box mb={4}>
            <Flex align="center">
              <FiSearch color={isOpen ? 'white' : 'gray.300'} />
              <Text ml={3} fontWeight="bold" color={isOpen ? 'white' : 'gray.300'}>Recherche</Text>
            </Flex>
          </Box>
          <Box mb={20}>
            <Flex align="center">
              <FiBookOpen color={isOpen ? 'white' : 'gray.300'} />
              <Text ml={3} fontWeight="bold" color={isOpen ? 'white' : 'gray.300'}>Ma librairie</Text>
            </Flex>
          </Box>
          <Box mb={4}>
            <Flex align="center">
              <FiPlus color={isOpen ? 'white' : 'gray.300'} />
              <Text ml={3} fontWeight="bold" color={isOpen ? 'white' : 'gray.300'}>Créer une playlist</Text>
            </Flex>
          </Box>
          <Box>
            <Flex align="center">
              <FiHeart color={isOpen ? 'white' : 'gray.300'} />
              <Text ml={3} fontWeight="bold" color={isOpen ? 'white' : 'gray.300'}>Mes albums favoris</Text>
            </Flex>
          </Box>
          <Divider my={10} borderColor="white" />
        </Box>
      </Box>

      {/* Icône burger */}
      <Box ml={{ base: 0, md: isOpen ? '250px' : 0 }}>
        <IconButton
          display={{ base: 'block', md: 'none' }}
          onClick={onToggle}
          aria-label="Open sidebar"
          icon={<FiMenu />}
          variant="ghost"
          colorScheme={isOpen ? 'white' : 'gray'}
        />
      </Box>
    </Flex>
  );
};

export default Sidebar;
