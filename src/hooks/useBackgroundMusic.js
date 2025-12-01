import { useEffect, useRef, useState } from 'react';

export const useBackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Crear el elemento de audio
    audioRef.current = new Audio('/src/assets/music/DileMuiscIA.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Volumen al 30% por defecto

    // Verificar preferencia guardada
    const savedMusicPreference = localStorage.getItem('backgroundMusic');
    if (savedMusicPreference === 'enabled') {
      playMusic();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playMusic = () => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(error => {
        console.log('Error playing music:', error);
      });
      setIsPlaying(true);
      localStorage.setItem('backgroundMusic', 'enabled');
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('backgroundMusic', 'disabled');
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return {
    isPlaying,
    isMuted,
    toggleMusic,
    toggleMute,
    playMusic,
    pauseMusic
  };
};
