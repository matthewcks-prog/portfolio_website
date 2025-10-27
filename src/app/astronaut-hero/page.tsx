"use client";

import TabletFrame from "@/components/3d/TabletFrame";
import AstronautCanvas from "@/components/3d/AstronautCanvas";

export default function AstronautHeroPage() {
  return (
    <div className="min-h-[200vh] bg-[#0a0a12] text-white">
      {/* Hero Section */}
      <section className="min-h-screen px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Sticky Tablet Frame with 3D Astronaut */}
            <div className="flex items-center justify-center">
              <TabletFrame>
                <AstronautCanvas />
              </TabletFrame>
            </div>

            {/* Right: Marketing Text */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl xl:text-7xl">
                  Explore the <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Infinite</span>
                </h1>
                <p className="text-xl text-gray-400 lg:text-2xl">
                  Journey beyond the ordinary with cutting-edge technology and breathtaking experiences.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-gray-300">
                  Immerse yourself in a world where innovation meets imagination. Our astronaut represents the bold explorers who dare to
                  venture into uncharted territories, pushing the boundaries of what&apos;s possible.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  As you scroll, watch the astronaut come alive—floating closer, tilting forward, ready to break through the screen and into
                  your reality. This is more than just a website; it&apos;s an experience.
                </p>
              </div>

              <div className="flex gap-4">
                <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-cyan-500/50">
                  Start Your Journey
                </button>
                <button className="rounded-xl border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Section (for scroll effect) */}
      <section className="min-h-screen px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <h2 className="text-4xl font-bold lg:text-5xl">
            The Future is <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Now</span>
          </h2>

          <div className="space-y-8 text-lg leading-relaxed text-gray-300">
            <p>
              In the vast expanse of space, our astronaut floats weightlessly, exploring new frontiers and discovering possibilities that
              were once thought impossible. This journey represents the human spirit&apos;s endless curiosity and determination.
            </p>
            <p>
              Every detail matters—from the subtle glow of distant stars to the atmospheric rim lighting that surrounds our planetary
              companion. The scene is crafted to transport you beyond the confines of your screen.
            </p>
            <p>
              Watch as the astronaut responds to your scroll, moving from the distant reaches of space toward you, tilting forward with each
              passing moment. This dynamic interaction creates a connection between you and the cosmos.
            </p>
            <p>
              Built with cutting-edge web technologies including React Three Fiber, this experience demonstrates the power of modern web
              development to create immersive, interactive storytelling that runs smoothly in your browser.
            </p>
          </div>

          <div className="grid gap-6 pt-12 md:grid-cols-3">
            {[
              { title: "Advanced 3D", desc: "Real-time WebGL rendering with Three.js" },
              { title: "Smooth Animations", desc: "60fps interactions powered by React" },
              { title: "Cinematic Effects", desc: "Bloom, rim lighting, and atmospheric glow" },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-xl font-semibold text-cyan-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-24" />
    </div>
  );
}
