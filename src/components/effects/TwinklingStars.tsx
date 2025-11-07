"use client";

import React, { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function TwinklingStars() {
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const starCount = isMobile ? 75 : 150;

    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.6,
      });
    }

    return starArray;
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}

      <style jsx>{`
        .star {
          animation: twinkle ease-in-out infinite;
          box-shadow:
            0 0 6px rgba(255, 255, 255, 1),
            0 0 12px rgba(255, 255, 255, 0.8),
            0 0 18px rgba(200, 220, 255, 0.6);
          filter: brightness(1.3);
          will-change: opacity, transform;
        }

        @media (max-width: 768px) {
          .star {
            box-shadow:
              0 0 4px rgba(255, 255, 255, 0.9),
              0 0 8px rgba(255, 255, 255, 0.6);
            filter: brightness(1.2);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
            filter: brightness(1.2);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            filter: brightness(1.6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .star {
            animation: none;
            opacity: 0.7 !important;
          }
        }
      `}</style>
    </div>
  );
}
