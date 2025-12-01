import { useRef, useEffect } from 'react';
import gameMusicFile from '../assets/music/MusicaDivertida2.mp3';

export const useGameMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Crear el elemento de audio
    audioRef.current = new Audio(gameMusicFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Volumen al 40%

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startGameMusic = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar desde el principio
      audioRef.current.play().catch(error => {
        console.log('Error playing game music:', error);
      });
    }
  };

  const stopGameMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return {
    startGameMusic,
    stopGameMusic
  };
};
