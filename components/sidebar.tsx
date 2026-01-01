"use client";

import React from "react";
import { Box, Flex, Text, IconButton, Divider, useDisclosure } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiMenu, FiHome, FiSearch, FiMusic, FiPlus, FiHeart, FiX } from "react-icons/fi";
import { TbMicrophone2 } from "react-icons/tb";
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
    { icon: TbMicrophone2, label: "Karaoké", path: "/Karaoke" },
    { icon: FiPlus, label: "Créer une playlist", path: "/CreerUnePlaylist" },
    { icon: FiHeart, label: "Mes favoris", path: "/MesAlbumsFavoris" },
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
        _hover={{ bg: "070211", borderRadius: "md" }}
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
        width={{ base: "full", md: "230px" }}
        bg="#280b46ff"
        p={4}
        zIndex="150"
        display={{ base: isOpen ? "block" : "none", lg: "block" }}
        transition="transform 0.3s ease, width 0.3s ease"
        transform={{ base: isOpen ? "translateX(0)" : "translateX(-100%)", lg: "translateX(0)" }}
      >
        <Flex mt={20} direction="column" align="center">
          {/* Logo */}
          <Link href="/">
            <Box
              mb={6}
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.3s ease"
              animation="bounceLogo 5s infinite"
            >
              <Image
                src="/images/logo-octopulse.png"
                alt="Logo"
                width={85}
                height={85}
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
                    bg={isActive ? "#070211" : "transparent"}
                    _hover={{
                      bg: "#120729",
                      "& svg": { transform: "scale(1.2)" },
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
        </Flex>

        {/* Animation keyframes */}
        <style jsx>{`
          @keyframes bounceLogo {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
          }
        `}</style>
      </Box>
    </>
  );
};

export default Sidebar;
