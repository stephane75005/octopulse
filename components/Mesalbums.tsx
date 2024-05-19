'use client'
import { Wrap } from '@chakra-ui/react';
import AlbumItem from '@components/AlbumItem';

const albumsData = [
  {
    id: "1",
    artiste: "Julien Doré",
    album: "Bichon",
    titre: "Porto Vecchio",
    genre: "Pop",
    annee: 2020,
    duree: "3:45",
    imageSrc: "julien-doree.jpg",
    audioSrc: "porto-vecchio.mp3"
  },
  {
    id: "2",
    artiste: "The Beatles",
    album: "The Beatles",
    titre: "Let It Be",
    genre: "Rock",
    annee: 1968,
    duree: "4:00",
    imageSrc: "beatles.jpg",
    audioSrc: "let-it-be.mp3"
  },
  {
    id: "3",
    artiste: "Idan Raichel",
    album: "The Idan Raichel Project",
    titre: "Mimaamakim",
    genre: "World",
    annee: 2006,
    duree: "5:20",
    imageSrc: "idan-raichel.jpg",
    audioSrc: "mimaamakim.mp3"
  },
  {
    id: "4",
    artiste: "Hervé",
    album: "Adrénaline",
    titre: "Addenda",
    genre: "Electronic",
    annee: 2021,
    duree: "3:30",
    imageSrc: "herve.jpg",
    audioSrc: "addenda.mp3"
  },
  {
    id: "5",
    artiste: "Hans Zimmer",
    album: "Gladiator",
    titre: "Elysium",
    genre: "Soundtrack",
    annee: 2000,
    duree: "5:45",
    imageSrc: "gladiator.jpg",
    audioSrc: "gladiator.mp3"
  },
  {
    id: "6",
    artiste: "Prawm",
    album: "The Big Cheese All Star",
    titre: "All Star",
    genre: "Jazz",
    annee: 1995,
    duree: "4:15",
    imageSrc: "big-cheese.jpg",
    audioSrc: "the-big-cheese.mp3"
  },
  // Ajoutez d'autres albums ici
];

const DataAlbums = () => {
  return (
    <Wrap>
      {albumsData.map((album) => (
        <AlbumItem key={album.id} {...album} />
      ))}
    </Wrap>
  );
};

export default DataAlbums;