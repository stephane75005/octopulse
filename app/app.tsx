"use client";

import React from "react";
import Sidebar from "@components/sidebar";
import Recherche from "@app/Recherche/page";
import MaLibrairie from "@app/MaLibrairie/page";
import CreerUnePlaylist from "@app/CreerUnePlaylist/page";
import MesAlbumsFavoris from "@app/MesAlbumsFavoris/page";
import { Box } from "@chakra-ui/react";

// Next.js App Router utilise le dossier "app" pour le routage.
// On n’a plus besoin de <Router>, <Routes> ou <Route>.

interface PageProps {
  pathname: string;
}

const App: React.FC = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex="1" ml={{ base: 0, md: "250px" }} p={5}>
        {/* Ici tu peux utiliser les pages Next.js via le routing de fichiers */}
        {/* Exemple d’inclusion manuelle pour une démo (sinon tu passes par /app/page.tsx, etc.) */}
        {/* <Recherche /> */}
        {/* <MaLibrairie /> */}
        {/* <CreerUnePlaylist /> */}
        {/* <MesAlbumsFavoris /> */}
      </Box>
    </Box>
  );
};

export default App;
