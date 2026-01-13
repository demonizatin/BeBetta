
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  shape: 'circle' | 'square';
}

const COLORS = ['#4ade80', '#a855f7', '#facc15', '#ef4444', '#3b82f6', '#ec4899'];

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100, // -50 to 50 vw relative to center
      y: (Math.random() - 0.5) * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random(),
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[190] flex justify-center items-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute w-3 h-3 ${p.shape === 'circle' ? 'rounded-full' : 'rounded-sm'}`}
          style={{ backgroundColor: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x * 15, // Spread horizontally
            y: [0, -300 - Math.random() * 200, 600], // Shoot up then fall down
            rotate: p.rotation + 720,
            scale: p.scale,
          }}
          transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.6, 1] }}
        />
      ))}
    </div>
  );
};
