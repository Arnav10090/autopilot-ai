'use client';

import { useEffect, useRef, useState } from 'react';

export function FloatingAccent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x: x * 20, y: y * 20 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 flex items-center justify-center"
      role="img"
      aria-label="Floating 3D accent illustration"
    >
      {/* Low-poly blob shape using CSS gradients */}
      <div
        className="relative w-64 h-64 animate-rotate-slow"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Blob with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-2 to-accent rounded-full opacity-80 filter blur-3xl animate-bob" />

        {/* Polygon effect using clip-path */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-2 rounded-3xl"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          }}
        />

        {/* Rotating rings */}
        <div
          className="absolute inset-0 border-2 border-accent/30 rounded-full animate-rotate-slow"
          style={{ animationDirection: 'reverse', animationDuration: '20s' }}
        />

        <div
          className="absolute inset-4 border border-accent-2/20 rounded-full animate-rotate-slow"
          style={{ animationDirection: 'reverse', animationDuration: '15s' }}
        />
      </div>

      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent rounded-full" />
    </div>
  );
}
