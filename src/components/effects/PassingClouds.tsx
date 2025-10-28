"use client";

import React from "react";

export default function PassingClouds() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Cloud Layer 1 - Fast, High Opacity */}
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />

      {/* Cloud Layer 2 - Medium Speed, Medium Opacity */}
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />

      {/* Cloud Layer 3 - Slow, Low Opacity (Far away) */}
      <div className="cloud cloud-5" />
      <div className="cloud cloud-6" />

      <style jsx>{`
        .cloud {
          position: absolute;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.5) 40%,
            rgba(240, 240, 255, 0.2) 70%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 50%;
          filter: blur(40px);
          animation: drift linear infinite;
        }

        /* Layer 1 - Closest, fastest clouds */
        .cloud-1 {
          width: clamp(300px, 40vw, 500px);
          height: clamp(90px, 12vw, 150px);
          top: 15%;
          left: 0%;
          opacity: 0.9;
          animation: drift 40s linear infinite;
        }

        .cloud-2 {
          width: clamp(270px, 36vw, 450px);
          height: clamp(80px, 10vw, 130px);
          top: 65%;
          left: 20%;
          opacity: 0.85;
          animation: drift 45s linear infinite;
          animation-delay: -22s;
        }

        /* Layer 2 - Middle distance */
        .cloud-3 {
          width: clamp(360px, 48vw, 600px);
          height: clamp(110px, 14vw, 180px);
          top: 35%;
          left: 40%;
          opacity: 0.7;
          animation: drift 60s linear infinite;
          animation-delay: -10s;
        }

        .cloud-4 {
          width: clamp(330px, 44vw, 550px);
          height: clamp(100px, 13vw, 160px);
          top: 80%;
          left: 60%;
          opacity: 0.75;
          animation: drift 55s linear infinite;
          animation-delay: -35s;
        }

        /* Layer 3 - Farthest, slowest */
        .cloud-5 {
          width: clamp(420px, 56vw, 700px);
          height: clamp(130px, 16vw, 200px);
          top: 5%;
          left: 10%;
          opacity: 0.5;
          animation: drift 80s linear infinite;
          animation-delay: -25s;
        }

        .cloud-6 {
          width: clamp(390px, 52vw, 650px);
          height: clamp(120px, 15vw, 190px);
          top: 50%;
          left: 80%;
          opacity: 0.55;
          animation: drift 75s linear infinite;
          animation-delay: -50s;
        }

        @keyframes drift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 700px));
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .cloud {
            filter: blur(30px); /* Reduce blur for better performance */
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .cloud {
            animation: drift 200s linear infinite;
          }
        }
      `}</style>
    </div>
  );
}
