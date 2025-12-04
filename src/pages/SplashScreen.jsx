import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import gsap from 'gsap';
import dilemoLogo from '../assets/dilemo-logo.svg';

export default function SplashScreen() {
    const navigate = useNavigate();
    const { playMusic } = useMusic();
    const logoRef = useRef(null);
    const textRef = useRef(null);
    const buttonRef = useRef(null);
    const containerRef = useRef(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Mostrar el botón después de las animaciones
                setShowButton(true);
            }
        });

        // Animación del logo
        tl.fromTo(logoRef.current,
            {
                scale: 0,
                rotation: -180,
                opacity: 0
            },
            {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)'
            }
        );

        // Animación del texto
        tl.fromTo(textRef.current,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'back.out(1.7)'
            },
            '-=0.4'
        );

        // Efecto de pulso en el logo
        tl.to(logoRef.current,
            {
                scale: 1.1,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut'
            }
        );

        return () => {
            tl.kill();
        };
    }, []);

    // Animar el botón cuando aparezca
    useEffect(() => {
        if (showButton && buttonRef.current) {
            gsap.fromTo(buttonRef.current,
                { y: 30, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
            );
        }
    }, [showButton]);

    const handleStart = () => {
        // Iniciar la música cuando el usuario hace clic
        playMusic();

        // Animación de salida
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => navigate('/home', { replace: true })
        });
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-gradient-to-br from-[#6C5CE7] via-[#4D96FF] to-[#FFD93D] flex flex-col items-center justify-center overflow-hidden z-50"
        >
            {/* Patrón de fondo animado */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                    backgroundSize: '50px 50px',
                    animation: 'movePattern 20s linear infinite'
                }}></div>
            </div>

            {/* Logo */}
            <div ref={logoRef} className="relative z-10 mb-8">
                <div className="bg-white rounded-full p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <img
                        src={dilemoLogo}
                        alt="Dilemo"
                        className="w-48 h-48 object-contain"
                    />
                </div>
            </div>

            {/* Texto */}
            {/* <div ref={textRef} className="relative z-10 text-center mb-8">
                    <h1 className="text-6xl font-black text-white mb-2 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        DILEMO
                    </h1>
                    <p className="text-2xl font-bold text-black">
                        Trivia de Verdadero o Falso
                    </p>
                </div> */}

            {/* Botón EMPEZAR */}
            {showButton && (
                <button
                    ref={buttonRef}
                    onClick={handleStart}
                    className="relative z-10 bg-white text-black px-12 py-4 rounded-2xl border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-3 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-3xl tracking-wide"
                >
                    EMPEZAR
                </button>
            )}

            {/* Elementos decorativos flotantes */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-[#FF6B6B] rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-float"></div>
            <div className="absolute bottom-20 right-20 w-20 h-20 bg-[#6BCB77] rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-float-delayed"></div>
            <div className="absolute top-1/2 left-10 w-12 h-12 bg-[#FFD93D] rotate-45 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-spin-slow"></div>
        </div>
    );
}
