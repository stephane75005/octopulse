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
    plays: 101,
  },
  {
    id: 2,
  artiste: "Lola Young",
  album: "Messy",
  titre: "Messy",
  genre: "Pop / Alternative",
  annee: 2024,
  duree: "3:45",
  imageSrc: "/images/lola-young.jpg",
  audioSrc: "/audio/lola-young.mp3",
  lrcSrc: "/audio/lola-young.lrc",
  plays: 102,
  },
  {
  id: 3,
  artiste: "Amy Winehouse",
  album: "Black Amy",
  titre: "Black Amy",
  genre: "Pop / Alternative",
  annee: 2024,
  duree: "3:45",
  imageSrc: "/images/amy-winehouse.jpg",
  audioSrc: "/audio/amy-winehouse.mp3",
  lrcSrc: "/audio/amy-winehouse.lrc",
  plays: 102,
},
{
  id: 4,
  artiste: "Urge Overkill",
  album: "Pulp Fiction (Soundtrack)",
  titre: "Girl, You'll Be...",
  genre: "Alternative Rock",
  annee: 1994,
  duree: "3:09",
  imageSrc: "/images/pulp-fiction.jpg",
  audioSrc: "/audio/pulp-fiction.mp3",
  lrcSrc: "/audio/pulp-fiction.lrc",
  plays: 103,
},
{
  id: 6,
  artiste: "Serge Gainsbourg",
  album: "Havane",
  titre: "Havane",
  genre: "Jazz",
  annee: 1984,
  duree: "3:52",
  imageSrc: "/images/serge-gainsbourg.jpg",
  audioSrc: "/audio/serge-gainsbourg.mp3",
  lrcSrc: "/audio/serge-gainsbourg.lrc",
  plays: 98,
},
{
   id: 7,
  artiste: "Damso",
  album: "Ipséité",
  titre: "Dans 911",
  genre: "Rap / Hip-Hop",
  annee: 2017,
  duree: "3:27",
  imageSrc: "/images/damso.jpg",
  audioSrc: "/audio/damso.mp3",
  lrcSrc: "/audio/damso.lrc",
  plays: 120,
}
];
