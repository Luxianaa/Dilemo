import { useEffect } from 'react';

const SparklesCursor = () => {
  useEffect(() => {
    const createSparkle = (x, y) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      
      // Añade variación aleatoria en la posición
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      
      document.body.appendChild(sparkle);
      
      // Elimina la partícula después de la animación
      setTimeout(() => {
        sparkle.remove();
      }, 800);
    };

    let lastTime = 0;
    const throttleDelay = 30; // Genera chispas cada 30ms

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime > throttleDelay) {
        createSparkle(e.clientX, e.clientY);
        lastTime = currentTime;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

export default SparklesCursor;
