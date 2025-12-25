// data/mesalbums.ts
export interface Album {
  id: string;
  artiste: string;
  album: string;
  titre: string;
  genre: string;
  annee: number;
  duree: string;
  imageSrc: string;
  audioSrc: string;
  new?: boolean;
  plays: number; // <- nombre d'écoutes
}

export const albumsData: Album[] = [
  {
    id: "1",
    artiste: "Adele",
    album: "Skyfall",
    titre: "Skyfall",
    genre: "Pop",
    annee: 2012,
    duree: "4:46",
    imageSrc: "/images/skyfall.jpg",
    audioSrc: "/audio/skyfall.mp3",
    new: true,
    plays: 101,
  },

  { 
    id: "2", 
    artiste: "Julien Doré", 
    album: "Bichon", 
    titre: "Porto Vecchio", 
    genre: "Pop", 
    annee: 2020, 
    duree: "3:45", 
    imageSrc: "/images/julien-dore.jpg", 
    audioSrc: "/audio/porto-vecchio.mp3", 
    plays: 102,
}, 
    
   { 
     id: "3", 
     artiste: "Idan Raichel", 
     album: "The Idan Raichel Project", 
     titre: "Mimaamakim", 
     genre: "World", 
     annee: 2006, 
     duree: "5:20", 
     imageSrc: "/images/idan-raichel.jpg", 
     audioSrc: "/audio/mimaamakim.mp3", 
     plays: 103,
    }, 
    
    { id: "4", 
      artiste: "Hervé", 
      album: "Adrénaline", 
      titre: "Addenda", 
      genre: "Electronic", 
      annee: 2021, 
      duree: "3:30", 
      imageSrc: "/images/herve.jpg", 
      audioSrc: "/audio/addenda.mp3", 
      plays: 104,
    }, 
        
    { id: "5", 
        artiste: "Hans Zimmer", 
        album: "Gladiator", 
        titre: "Elysium", 
        genre: "Soundtrack", 
        annee: 2000, 
        duree: "5:45", 
        imageSrc: "/images/gladiator.jpg", 
        audioSrc: "/audio/gladiator.mp3",  
        plays: 105,
    }, 

    { 
        id: "6", 
        artiste: "Prawm", 
        album: "The Big Cheese All Star", 
        titre: "All Star", 
        genre: "Jazz", 
        annee: 1995, 
        duree: "4:15", 
        imageSrc: "/images/big-cheese.jpg", 
        audioSrc: "/audio/the-big-cheese.mp3", 
        plays: 106,
    },
        
    {    
        id: "7", 
        artiste: "The Beatles", 
        album: "The Beatles", 
        titre: "Let It Be", 
        genre: "Rock", 
        annee: 1968, 
        duree: "4:00", 
        imageSrc: "/images/beatles.jpg", 
        audioSrc: "/audio/let-it-be.mp3", 
        plays: 107,
    }, 
  
];
