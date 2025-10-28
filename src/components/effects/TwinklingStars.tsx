"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";

interface Star {
  id: number;
  baseX: number; // Original X position (0-100%)
  baseY: number; // Original Y position (0-100%)
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface StarPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function TwinklingStars() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const starPositionsRef = useRef<Map<number, StarPosition>>(new Map());
  const animationFrameRef = useRef<number>();
  const [, forceUpdate] = useState({});

  // Generate random stars data
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    // Reduce star count on mobile for better performance
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const starCount = isMobile ? 75 : 150; // 75 stars on mobile, 150 on desktop

    for (let i = 0; i < starCount; i++) {
      const baseX = Math.random() * 100;
      const baseY = Math.random() * 100;
      starArray.push({
        id: i,
        baseX,
        baseY,
        size: Math.random() * 3 + 1, // Random size (1-4px)
        duration: Math.random() * 3 + 2, // Random twinkle duration (2-5s)
        delay: Math.random() * 5, // Random animation delay (0-5s)
        opacity: Math.random() * 0.4 + 0.6, // Random base opacity (0.6-1.0) - increased
      });

      // Initialize position
      starPositionsRef.current.set(i, {
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
      });
    }

    return starArray;
  }, []);

  // Track mouse position
  useEffect(() => {
    let isMounted = true; // Safety flag to prevent state updates after unmount

    const handleMouseMove = (e: MouseEvent) => {
      if (isMounted) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && isMounted) {
        const touch = e.touches[0];
        setMousePos({ x: touch.clientX, y: touch.clientY });
      }
    };

    const handleTouchEnd = () => {
      if (isMounted) {
        setMousePos({ x: -1000, y: -1000 }); // Reset position when touch ends
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      isMounted = false; // Prevent state updates after unmount
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  // Physics simulation
  useEffect(() => {
    let frameCount = 0;
    let isRunning = true; // Safety flag to prevent double execution

    const updateStars = () => {
      if (!isRunning) return; // Early exit if effect was cleaned up

      // Adjust physics based on screen size
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const RIPPLE_RADIUS = isMobile ? 180 : 250; // Smaller radius on mobile
      const FORCE_STRENGTH = isMobile ? 0.6 : 0.8; // Gentler force on mobile
      const DAMPING = 0.85; // Velocity damping (0-1, higher = less friction)
      const SPRING_BACK = 0.05; // How fast stars return to original position

      stars.forEach((star) => {
        const pos = starPositionsRef.current.get(star.id);
        if (!pos) return;

        // Convert star position from % to pixels
        const starPixelX = (pos.x / 100) * window.innerWidth;
        const starPixelY = (pos.y / 100) * window.innerHeight;

        // Calculate distance from mouse
        const dx = starPixelX - mousePos.x;
        const dy = starPixelY - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply ripple force if within radius
        if (distance < RIPPLE_RADIUS && distance > 0) {
          const force = (1 - distance / RIPPLE_RADIUS) * FORCE_STRENGTH;
          const angle = Math.atan2(dy, dx);

          // Push stars away (use -angle for pull effect)
          pos.vx += Math.cos(angle) * force;
          pos.vy += Math.sin(angle) * force;
        }

        // Spring force to return to base position
        const basePixelX = (star.baseX / 100) * window.innerWidth;
        const basePixelY = (star.baseY / 100) * window.innerHeight;
        const springDx = basePixelX - starPixelX;
        const springDy = basePixelY - starPixelY;

        pos.vx += springDx * SPRING_BACK;
        pos.vy += springDy * SPRING_BACK;

        // Apply damping
        pos.vx *= DAMPING;
        pos.vy *= DAMPING;

        // Update position
        const newPixelX = starPixelX + pos.vx;
        const newPixelY = starPixelY + pos.vy;

        // Convert back to percentage
        pos.x = (newPixelX / window.innerWidth) * 100;
        pos.y = (newPixelY / window.innerHeight) * 100;
      });

      // Only force re-render every 2 frames to reduce CPU usage
      frameCount++;
      if (frameCount % 2 === 0) {
        forceUpdate({});
      }

      if (isRunning) {
        animationFrameRef.current = requestAnimationFrame(updateStars);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateStars);

    return () => {
      isRunning = false; // Prevent any pending animation frames from executing
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePos.x, mousePos.y]); // Only depend on mouse position values, not the stars array

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      {stars.map((star) => {
        const pos = starPositionsRef.current.get(star.id);
        if (!pos) return null;

        return (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        );
      })}

      <style jsx>{`
        .star {
          position: absolute;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 1) 20%,
            rgba(230, 240, 255, 0.9) 40%,
            rgba(200, 220, 255, 0.6) 60%,
            transparent 100%
          );
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
          box-shadow:
            0 0 6px rgba(255, 255, 255, 1),
            0 0 12px rgba(255, 255, 255, 0.8),
            0 0 18px rgba(200, 220, 255, 0.6);
          filter: brightness(1.3);
          will-change: transform, opacity;
        }

        /* Reduce star intensity on small screens for better performance */
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

        /* Reduce motion for accessibility */
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
