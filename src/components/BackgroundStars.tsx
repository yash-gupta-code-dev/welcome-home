/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  alpha: number;
  alphaDirection: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function BackgroundStars() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      opacity: 0,
      active: false,
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 4000);
      const starColors = ['#ffffff', '#fff3e0', '#e3f2fd', '#f3e5f5'];

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          alpha: Math.random(),
          alphaDirection: Math.random() > 0.5 ? 1 : -1,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    const triggerShootingStar = () => {
      if (shootingStar.active) return;
      shootingStar = {
        x: Math.random() * canvas.width * 0.8,
        y: Math.random() * canvas.height * 0.4,
        length: 40 + Math.random() * 80,
        speed: 8 + Math.random() * 12,
        angle: (Math.PI / 6) + Math.random() * (Math.PI / 12), // Down-rightwards
        opacity: 1,
        active: true,
      };
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a subtle cosmic background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, '#0c1328');
      gradient.addColorStop(0.5, '#070b16');
      gradient.addColorStop(1, '#03050a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw normal stars
      stars.forEach((star) => {
        // Twinkle update
        star.alpha += star.twinkleSpeed * star.alphaDirection;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.alphaDirection = -1;
        } else if (star.alpha <= 0.1) {
          star.alpha = 0.1;
          star.alphaDirection = 1;
        }

        // Slow drift downwards
        star.y += 0.05;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.size * 3;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Handle shooting star
      if (shootingStar.active) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        
        // Calculate endpoint based on length and angle
        const endX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
        
        // Gradient line for tail fade
        const starGrad = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          endX,
          endY
        );
        starGrad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        starGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = starGrad;

        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        // Update shooting star movement
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;

        if (
          shootingStar.opacity <= 0 ||
          shootingStar.x > canvas.width ||
          shootingStar.y > canvas.height
        ) {
          shootingStar.active = false;
        }
      } else if (Math.random() < 0.002) {
        // Trigger a new shooting star randomly
        triggerShootingStar();
      }

      animationId = requestAnimationFrame(updateAndDraw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starsCanvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
