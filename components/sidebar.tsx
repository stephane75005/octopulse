"use client";

import React from "react";
import { Box, Flex, Text, IconButton, Divider, useDisclosure } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiMenu, FiHome, FiSearch, FiMusic, FiPlus, FiHeart, FiX } from "react-icons/fi";
import { TbMicrophone2 } from "react-icons/tb"; // 👈 nouvel import
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    { icon: TbMicrophone2, label: "Karaoké", path: "/Karaoke" }, // 🎤 icône micro
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
        <Box mt={20} display="flex" flexDirection="column" alignItems="center">
          {/* Logo */}
          <Link href="/">
            <Box
              mb={12}
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.3s ease"
              animation="bounceLogo 5s infinite"
              style={{ display: "inline-block", filter: "drop-shadow(0 0 4px rgba(133,62,138,0.6))" }}
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={60}
                height={60}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Link>

          {/* Menu items */}
          <Box w="full">
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
                    mb={index === 3 ? 20 : 4}
                    borderRadius="md"
                    bg={isActive ? "gray.700" : "transparent"}
                    _hover={{
                      bg: "gray.700",
                      "& svg": {
                        transform: "scale(1.2)",
                        filter: "drop-shadow(0 0 4px rgba(255,255,255,0.7))",
                      },
                    }}
                    transition="all 0.2s ease"
                  >
                    <Flex w="32px" h="32px" align="center" justify="center">
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

        {/* Animation keyframes */}
        <style jsx>{`
          @keyframes bounceLogo {
            0%, 80%, 100% { transform: translateY(0); filter: drop-shadow(0 0 4px rgba(133,62,138,0.6)); }
            40% { transform: translateY(-10px); filter: drop-shadow(0 0 8px rgba(133,62,138,0.9)); }
          }
        `}</style>
      </Box>
    </>
  );
};

export default Sidebar;
