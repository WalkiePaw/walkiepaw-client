import React, { useEffect, useRef } from 'react';
import './ParticleCursor.css';

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `hsl(${hue}, 90%, 60%)`;
    this.life = 1000;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size -= 0.02;
    this.life -= 2;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ParticleCursor = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hueRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(new Particle(e.clientX, e.clientY, hueRef.current));
      }
    };

    const handleClick = (e) => {
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push(new Particle(e.clientX, e.clientY, hueRef.current));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);

        if (particle.size <= 0.3 || particle.life <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });

      hueRef.current += 2;
      if (hueRef.current > 360) hueRef.current = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-cursor" />;
};

export default ParticleCursor;
