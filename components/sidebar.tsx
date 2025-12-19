// components/Sidebar.js
import React from "react";
import { Box, Flex, Text, IconButton, Divider } from "@chakra-ui/react";
import { FiMenu, FiHome, FiSearch, FiMusic, FiPlus, FiHeart, FiX } from "react-icons/fi";
import { useDisclosure } from "@chakra-ui/react";

const Sidebar = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      position="fixed"
      top="0"
      left="0"
      bottom="0"
      zIndex="100"
      bg="gray.800"
      p={4}
      width={{ base: "100%", md: "250px" }}
      boxShadow={{ base: "none", md: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <Box mt={100}>
        <Box mb={4}>
          <Flex align="center">
            <FiHome color="white" />
            <Text ml={3} fontWeight="medium" color="white">
              Accueil
            </Text>
          </Flex>
        </Box>
        <Box mb={4}>
          <Flex align="center">
            <FiSearch color="gray" />
            <Text ml={3} fontWeight="medium" color="gray">
              Recherche
            </Text>
          </Flex>
        </Box>
        <Box mb={20}>
          <Flex align="center">
            <FiMusic color="gray" />
            <Text ml={3} fontWeight="medium" color="gray">
              Ma librairie
            </Text>
          </Flex>
        </Box>
        <Box mb={4}>
          <Flex align="center">
            <FiPlus color="gray" />
            <Text ml={3} fontWeight="medium" color="gray">
              Créer une playlist
            </Text>
          </Flex>
        </Box>
        <Box>
          <Flex align="center">
            <FiHeart color="gray" />
            <Text ml={3} fontWeight="medium" color="gray">
              Mes albums favoris
            </Text>
          </Flex>
        </Box>
        <Divider my={10} borderColor="gray" />
      </Box>

      <IconButton
        display={{ base: "block", md: "none" }}
        onClick={onToggle}
        aria-label={isOpen ? "Fermer la barre latérale" : "Ouvrir la barre latérale"}
        icon={isOpen ? <FiX /> : <FiMenu />}
        variant="ghost"
        colorScheme="gray"
        _hover={{ bg: "gray.600", opacity: 0.8 }}
      />
    </Box>
  );
};

export default Sidebar;