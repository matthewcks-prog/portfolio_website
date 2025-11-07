"use client";

import { motion } from "framer-motion";
import { Briefcase, Award, Trophy, Users2 } from "lucide-react";

const experiences = [
  {
    type: "work",
    icon: Briefcase,
    title: "Intern, Technology Consulting",
    organization: "Ernst & Young (EY)",
    period: "2023",
    highlights: [
      "Gained practical experience in cybersecurity, collaborating with the penetration testing team",
      "Contributed to vulnerability assessments, report writing, and risk assessments",
      "Applied professional cybersecurity frameworks including ISO 27001",
    ],
    gradient: "from-cyan to-blue-500",
  },
  {
    type: "work",
    icon: Users2,
    title: "Hardware Engineer",
    organization: "Monash Connected Autonomous Vehicle (MCAV)",
    period: "2023 - Present",
    highlights: [
      "Key member of the central controller team developing small-scale testing environment for autonomous vehicles",
      "Engineered ROS2-based communication system to control vehicle movement",
      "Established serial communication bridge between Raspberry Pi and ESP32",
    ],
    gradient: "from-indigo to-purple-500",
  },
  {
    type: "work",
    icon: Users2,
    title: "Sponsorship & Industry Coordinator",
    organization: "Monash Connected Autonomous Vehicle (MCAV)",
    period: "2023 - Present",
    highlights: [
      "Built relationships with companies to secure sponsorship",
      "Planned and executed industry partnership events",
      "Demonstrated strong communication and networking skills",
    ],
    gradient: "from-violet to-purple-500",
  },
];

const achievements = [
  {
    icon: Award,
    title: "Monash International High Achievers Scholarship",
    description: "Awarded prestigious scholarship for outstanding academic merit",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Trophy,
    title: "Faculty of IT Commendation",
    description: "Received highest grade for FIT1056 (Collaborative Engineering for Web Applications) in Semester 2, 2023",
    gradient: "from-emerald to-teal-500",
  },
  {
    icon: Users2,
    title: "Resident Advisor",
    organization: "Briggs Hall",
    description: "Fostered safe, diverse, and inclusive community as key liaison between residents and administration",
    gradient: "from-pink to-rose-500",
  },
  {
    icon: Award,
    title: "Charter President",
    organization: "Interact Club",
    description: "Led community service initiatives including food drives, book collections, and environmental activities",
    gradient: "from-blue-500 to-cyan",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/background_first.jpg)" }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-indigo/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
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
            className="inline-block mb-4 px-4 py-2 rounded-full bg-indigo/10 border border-indigo/20 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-indigo">Professional Journey</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo via-purple-500 to-violet bg-clip-text text-transparent">
            Experience & Highlights
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            Building expertise through hands-on work, leadership, and academic excellence
          </p>
        </motion.div>

        {/* Professional Experience */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white mb-8"
          >
            Professional Experience
          </motion.h3>

          <div className="space-y-6">
            {experiences.map((exp, idx) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${exp.gradient} rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500`}
                  />

                  {/* Card */}
                  <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">{exp.title}</h4>
                            <p className="text-base text-cyan font-semibold">{exp.organization}</p>
                          </div>
                          <span className="text-sm text-white/50 mt-2 sm:mt-0">{exp.period}</span>
                        </div>

                        {/* Highlights */}
                        <ul className="space-y-2">
                          {exp.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-3 text-white/70 text-sm">
                              <span className="text-cyan mt-1">▸</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievements & Leadership */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white mb-8"
          >
            Achievements & Leadership
          </motion.h3>

          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${achievement.gradient} rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500`}
                  />

                  {/* Card */}
                  <div className="relative h-full backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] transition-all duration-300">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${achievement.gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-white mb-1">{achievement.title}</h4>
                        {achievement.organization && <p className="text-sm text-cyan/80 mb-2">{achievement.organization}</p>}
                        <p className="text-sm text-white/60 leading-relaxed">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
