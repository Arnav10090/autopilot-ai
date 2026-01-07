'use client';

import { useEffect, useRef, useState } from 'react';

interface ThreeDAccentProps {
  variant?: 'blob' | 'cube' | 'pyramid' | 'sphere';
  animated?: boolean;
  interactive?: boolean;
  className?: string;
}

export function ThreeDAccent({
  variant = 'blob',
  animated = true,
  interactive = true,
  className = '',
}: ThreeDAccentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x: x * 15, y: y * 15 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const getAnimationClasses = () => {
    if (!animated) return '';
    switch (variant) {
      case 'cube':
        return 'animate-rotate-slow';
      case 'pyramid':
        return 'animate-bob';
      case 'sphere':
        return 'animate-rotate-slow';
      default:
        return 'animate-rotate-slow';
    }
  };

  const renderVariant = () => {
    switch (variant) {
      case 'cube':
        return (
          <div
            className="relative w-48 h-48 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) rotateX(20deg) rotateY(20deg) rotateZ(0deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Cube faces */}
            {[
              { transform: 'rotateY(0deg) translateZ(96px)', color: 'from-accent to-accent-2' },
              { transform: 'rotateY(180deg) translateZ(96px)', color: 'from-accent-2 to-accent' },
              { transform: 'rotateY(90deg) translateZ(96px)', color: 'from-accent via-accent-2 to-accent' },
              { transform: 'rotateY(-90deg) translateZ(96px)', color: 'from-accent-2 via-accent to-accent-2' },
              { transform: 'rotateX(90deg) translateZ(96px)', color: 'from-accent to-accent-2' },
              { transform: 'rotateX(-90deg) translateZ(96px)', color: 'from-accent-2 to-accent' },
            ].map((face, i) => (
              <div
                key={i}
                className={`absolute w-48 h-48 bg-gradient-to-br ${face.color} opacity-70 border border-accent/30 backdrop-blur-sm`}
                style={{
                  transform: face.transform,
                  backfaceVisibility: 'hidden',
                }}
              />
            ))}
          </div>
        );
      case 'pyramid':
        return (
          <div
            className="relative w-56 h-56 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              perspective: '1000px',
            }}
          >
            <div
              className={`relative w-full h-full ${getAnimationClasses()}`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Pyramid faces */}
              <div
                className="absolute left-1/2 top-0 w-0 h-0 opacity-80"
                style={{
                  borderLeft: '112px solid transparent',
                  borderRight: '112px solid transparent',
                  borderBottom: '196px solid rgba(37, 99, 235, 0.8)',
                  transform: 'translateX(-50%) translateZ(50px)',
                }}
              />
              <div
                className="absolute left-1/2 top-0 w-0 h-0 opacity-80"
                style={{
                  borderLeft: '112px solid transparent',
                  borderRight: '112px solid transparent',
                  borderBottom: '196px solid rgba(6, 182, 212, 0.8)',
                  transform: 'translateX(-50%) rotateY(90deg) translateZ(50px)',
                }}
              />
            </div>
          </div>
        );
      case 'sphere':
        return (
          <div
            className="relative w-64 h-64 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          >
            {/* Sphere using multiple rings */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-accent via-accent-2 to-accent opacity-60 filter blur-2xl ${
                animated ? 'animate-rotate-slow' : ''
              }`}
            />

            {/* Rotating rings */}
            {[0, 30, 60, 90].map((rotation) => (
              <div
                key={rotation}
                className="absolute inset-0 rounded-full border border-accent/30"
                style={{
                  transform: `rotateX(${rotation}deg) rotateZ(${rotation}deg)`,
                  animation: animated ? `rotate-slow ${20 + rotation / 10}s linear infinite` : 'none',
                }}
              />
            ))}

            {/* Center core */}
            <div className="absolute inset-12 rounded-full bg-gradient-radial from-accent to-transparent opacity-40" />
          </div>
        );
      default:
        return (
          <div
            className="relative w-64 h-64 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          >
            {/* Organic blob */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-accent via-accent-2 to-accent rounded-full opacity-70 filter blur-3xl ${
                animated ? 'animate-bob' : ''
              }`}
            />

            <div
              className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-2 rounded-3xl opacity-60"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              }}
            />

            {/* Rotating rings */}
            {[0, 8, 16].map((offset) => (
              <div
                key={offset}
                className="absolute inset-0 rounded-full border border-accent/30"
                style={{
                  animation: animated
                    ? `rotate-slow ${15 + offset / 2}s linear infinite ${offset === 8 ? 'reverse' : 'normal'}`
                    : 'none',
                }}
              />
            ))}

            {/* Radial gradient background */}
            <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent rounded-full" />
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      role="img"
      aria-label={`${variant} 3D accent illustration`}
      style={{
        perspective: '1000px',
      }}
    >
      {renderVariant()}
    </div>
  );
}
