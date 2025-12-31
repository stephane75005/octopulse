export interface Word {
  text: string;
  start: number;
  end: number;
}

export interface LyricLine {
  words: Word[];
  start?: number;
  end?: number;
  duration?: number;
}

export interface Album {
  id: number;
  artiste: string;
  album: string;
  titre: string;
  genre: string;
  annee: number;
  duree: string;
  imageSrc: string;
  audioSrc: string;
  lrcSrc?: string;
  plays: number;
  lyrics?: LyricLine[];
}

export const albumsData: Album[] = [
  {
    id: 1,
    artiste: "Adele",
    album: "Skyfall",
    titre: "Skyfall",
    genre: "Pop",
    annee: 2012,
    duree: "4:46",
    imageSrc: "/images/skyfall.jpg",
    audioSrc: "/audio/skyfall.mp3",
    lrcSrc: "/audio/skyfall.lrc",
    plays: 0,
  },
  {
    id: 2,
    artiste: "Julien Doré",
    album: "Bichon",
    titre: "Porto Vecchio",
    genre: "Pop",
    annee: 2020,
    duree: "3:45",
    imageSrc: "/images/julien-dore.jpg",
    audioSrc: "/audio/porto-vecchio.mp3",
    lrcSrc: "/audio/porto-vecchio.lrc",
    plays: 102,
  },
];
