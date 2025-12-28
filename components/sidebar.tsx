"use client";

import React from "react";
import { Box, Flex, Text, IconButton, Divider, useDisclosure } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiMenu, FiHome, FiSearch, FiMusic, FiPlus, FiHeart, FiX } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const pathname = usePathname();

const menuItems: MenuItem[] = [
  { icon: FiHome, label: "Accueil", path: "/" },
  { icon: FiSearch, label: "Recherche", path: "/Recherche" },
  { icon: FiMusic, label: "Ma librairie", path: "/MaLibrairie" },
  { icon: FiPlus, label: "Créer une playlist", path: "/CreerUnePlaylist" },
  { icon: FiHeart, label: "Mes albums favoris", path: "/MesAlbumsFavoris" },
];


  return (
    <>
      {/* Bouton burger */}
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

      {/* Overlay mobile */}
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
        transform={{ base: isOpen ? "translateX(0)" : "translateX(-100%)", lg: "translateX(0)" }}
      >
        <Box mt={16}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link href={item.path} key={index} passHref>
                <Flex
                  align="center"
                  gap={3}
                  w="full"
                  h="50px"
                  px={3}
                  mb={index === 2 ? 20 : 4}
                  borderRadius="md"
                  bg={isActive ? "gray.700" : "transparent"}
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
                    {/* Icône toujours blanche */}
                    <Icon color="white" size={24} />
                  </Flex>
                  <Text fontWeight="medium" color={isActive ? "white" : "gray.200"}>
                    {item.label}
                  </Text>
                </Flex>
              </Link>
            );
          })}
          <Divider my={10} borderColor="gray.600" />
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
