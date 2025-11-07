"use client";

import { motion } from "framer-motion";
import { Dumbbell, Bike, Trophy, TrendingUp } from "lucide-react";

const hobbies = [
  {
    icon: Dumbbell,
    title: "Fitness & Wellness",
    description: "Staying active through regular gym workouts and maintaining a healthy lifestyle",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Bike,
    title: "Cycling",
    description: "Exploring the outdoors and staying fit through cycling adventures",
    gradient: "from-emerald to-teal-500",
  },
  {
    icon: Trophy,
    title: "Badminton",
    description: "Competitive badminton player, combining strategy with athleticism",
    gradient: "from-blue-500 to-cyan",
  },
  {
    icon: TrendingUp,
    title: "Finance & Tech",
    description: "Keen interest in financial markets including stocks, ETFs, and cryptocurrency",
    gradient: "from-violet to-purple-500",
  },
];

export default function Hobbies() {
  return (
    <section id="hobbies" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/background_first.jpg)" }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-purple-400">Beyond the Code</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Hobbies & Interests
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            A well-rounded life balancing technology, fitness, and personal growth
          </p>
        </motion.div>

        {/* Hobbies Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hobbies.map((hobby, idx) => {
            const Icon = hobby.icon;
            return (
              <motion.div
                key={hobby.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${hobby.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}
                />

                {/* Card */}
                <div className="relative h-full backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 hover:scale-105 text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${hobby.gradient} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-3 text-white">{hobby.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed">{hobby.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
