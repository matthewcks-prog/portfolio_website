"use client";

import SpaceHero from "../components/SpaceHero";

export default function SpaceHeroPage() {
  return (
    <div className="min-h-screen bg-black">
      <SpaceHero />

      {/* Spacer for warp scroll effect */}
      <div className="h-screen bg-black" />

      {/* Projects Section - appears after warp */}
      <section id="projects" className="min-h-screen px-6 py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-white space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Projects</h2>
            <p className="text-xl text-gray-400">Welcome to my portfolio. Explore the work that pushes boundaries.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-8">
            {[
              {
                title: "Project Alpha",
                desc: "A revolutionary web application built with Next.js and Three.js",
                tech: "React • Three.js • WebGL",
              },
              {
                title: "Project Beta",
                desc: "Real-time data visualization with stunning 3D graphics",
                tech: "TypeScript • D3.js • Canvas",
              },
              {
                title: "Project Gamma",
                desc: "E-commerce platform with seamless user experience",
                tech: "Next.js • Stripe • Tailwind",
              },
              {
                title: "Project Delta",
                desc: "AI-powered creative tool for digital artists",
                tech: "Python • TensorFlow • React",
              },
              {
                title: "Project Epsilon",
                desc: "Mobile-first social platform with real-time features",
                tech: "React Native • Firebase • Node",
              },
              {
                title: "Project Zeta",
                desc: "Interactive educational platform for online learning",
                tech: "Vue.js • WebRTC • MongoDB",
              },
            ].map((project, idx) => (
              <div
                key={project.title}
                className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{project.desc}</p>
                  <p className="text-sm text-gray-500 font-mono">{project.tech}</p>
                  <button className="mt-4 text-sm text-white bg-gradient-to-r from-cyan-500/20 to-violet-500/20 px-4 py-2 rounded-lg border border-cyan-400/30 hover:border-cyan-400 hover:from-cyan-500/30 hover:to-violet-500/30 transition-all">
                    View Project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
