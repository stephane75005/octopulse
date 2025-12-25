// components/Sidebar.js
import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu, FiHome, FiSearch, FiMusic, FiPlus, FiHeart, FiX } from "react-icons/fi";

const Sidebar = () => {
  const { isOpen, onToggle } = useDisclosure();

  const menuItems = [
    { icon: FiHome, label: "Accueil", color: "white" },
    { icon: FiSearch, label: "Recherche", color: "gray" },
    { icon: FiMusic, label: "Ma librairie", color: "gray" },
    { icon: FiPlus, label: "Créer une playlist", color: "gray" },
    { icon: FiHeart, label: "Mes albums favoris", color: "gray" },
  ];

  return (
    <>
      {/* Bouton burger visible sur mobile et tablette */}
      <IconButton
        display={{ base: "flex", lg: "none" }}
        onClick={onToggle}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        icon={isOpen ? <FiX size={32} color="white" /> : <FiMenu size={32} color="white" />}
        position="fixed"
        top="4"
        left="4"
        zIndex="200"
        variant="ghost"
        w="50px"
        h="50px"
        p={0}
        alignItems="center"
        justifyContent="center"
        _hover={{ bg: "gray.700", borderRadius: "md" }}
      />

      {/* Overlay semi-transparent pour mobile/tablette */}
      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="blackAlpha.400"
          zIndex="100"
          onClick={onToggle}
          display={{ base: "block", lg: "none" }}
        />
      )}

      {/* Sidebar */}
      <Box
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        width={{ base: "full", md: "250px" }}
        bg="gray.800"
        p={4}
        zIndex="150"
        display={{ base: isOpen ? "block" : "none", lg: "block" }}
        transition="transform 0.3s ease"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          lg: "translateX(0)",
        }}
      >
        <Box mt={16}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Flex
                key={index}
                align="center"
                gap={3}
                w="full"
                h="50px"
                px={3}
                mb={index === 2 ? 20 : 4} // espace pour "Ma librairie"
                borderRadius="md"
                _hover={{
                  bg: "gray.700",
                  cursor: "pointer",
                  "& svg": {
                    transform: "scale(1.2)",
                    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.7))",
                  },
                }}
                transition="all 0.2s ease"
              >
                <Flex w="32px" h="32px" align="center" justify="center">
                  <Icon color={item.color} size={20} />
                </Flex>
                <Text fontWeight="medium" color={item.color}>
                  {item.label}
                </Text>
              </Flex>
            );
          })}
          <Divider my={10} borderColor="gray" />
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
