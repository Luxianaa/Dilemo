import { createContext, useContext, useEffect, useRef, useState } from 'react';
import musicFile from '../assets/music/DileMuiscIA.mp3';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
    const audioRef = useRef(null);

    // Establecer estado inicial basado en preferencia guardada
    const getInitialPlayingState = () => {
        const savedPreference = localStorage.getItem('backgroundMusic');
        return savedPreference !== 'disabled'; // true por defecto, false solo si está desactivado
    };

    const [isPlaying, setIsPlaying] = useState(getInitialPlayingState());
    const [volume, setVolume] = useState(0.3);

    useEffect(() => {
        // Crear el elemento de audio
        audioRef.current = new Audio(musicFile);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        // Verificar preferencia guardada
        const savedMusicPreference = localStorage.getItem('backgroundMusic');
        const savedVolume = localStorage.getItem('musicVolume');

        if (savedVolume) {
            const vol = parseFloat(savedVolume);
            setVolume(vol);
            audioRef.current.volume = vol;
        }

        // Reproducir música automáticamente a menos que esté explícitamente desactivada
        if (savedMusicPreference !== 'disabled') {
            // Intentar reproducir automáticamente
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        localStorage.setItem('backgroundMusic', 'enabled');
                    })
                    .catch(error => {
                        console.log('Autoplay prevented:', error);
                        setIsPlaying(false);
                    });
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playMusic = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    localStorage.setItem('backgroundMusic', 'enabled');
                })
                .catch(error => {
                    console.log('Error playing music:', error);
                });
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

    const changeVolume = (newVolume) => {
        const vol = Math.max(0, Math.min(1, newVolume));
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
        localStorage.setItem('musicVolume', vol.toString());
    };

    const value = {
        isPlaying,
        volume,
        toggleMusic,
        playMusic,
        pauseMusic,
        changeVolume
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within MusicProvider');
    }
    return context;
};
