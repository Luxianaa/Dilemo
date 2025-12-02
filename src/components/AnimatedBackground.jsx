import { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const shapes = [];
        const shapeCount = 15;

        // Crear formas hexagonales
        for (let i = 0; i < shapeCount; i++) {
            shapes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 100 + 50,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        function drawHexagon(x, y, size, rotation) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const xPos = size * Math.cos(angle);
                const yPos = size * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(xPos, yPos);
                } else {
                    ctx.lineTo(xPos, yPos);
                }
            }
            ctx.closePath();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            shapes.forEach(shape => {
                // Actualizar posición
                shape.x += shape.speedX;
                shape.y += shape.speedY;
                shape.rotation += shape.rotationSpeed;

                // Rebotar en los bordes
                if (shape.x < -100) shape.x = canvas.width + 100;
                if (shape.x > canvas.width + 100) shape.x = -100;
                if (shape.y < -100) shape.y = canvas.height + 100;
                if (shape.y > canvas.height + 100) shape.y = -100;

                // Dibujar
                ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity})`;
                ctx.lineWidth = 2;
                drawHexagon(shape.x, shape.y, shape.size, shape.rotation);
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="animated-background"
        />
    );
}
