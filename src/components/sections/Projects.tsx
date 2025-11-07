"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const featuredProjects = [
  {
    title: "Sun & Skin — UV vs. Melanoma in Australia",
    description:
      "An interactive data visualization project that explores the complex relationship between UV exposure and melanoma rates across Australia. Features layered maps, charts, and interactive filters to reveal geographical and demographic patterns.",
    tech: ["Vega-Lite", "JavaScript", "JSON"],
    github: "https://github.com/matthewchungkaishing",
    category: "Data Visualization",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Full-Stack Package Delivery App",
    description:
      "A comprehensive full-stack application simulating a package delivery service. The system allows users to track packages, manage deliveries, and view logistics, all built on the MEAN stack.",
    tech: ["Angular", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/matthewchungkaishing",
    category: "Full-Stack Web",
    gradient: "from-cyan to-blue-500",
  },
  {
    title: "Monash CAV Vehicle Control System",
    description:
      "Developed publisher and subscriber nodes using ROS2 to establish serial communication between Raspberry Pi and ESP32, enabling teleop control of autonomous vehicle movement.",
    tech: ["ROS2", "Python", "Raspberry Pi", "ESP32"],
    link: "#",
    category: "Robotics & IoT",
    gradient: "from-indigo to-purple-500",
  },
  {
    title: "Code Venture — Python LMS",
    description:
      "A web-based Learning Management System built with Django for teaching young learners Python fundamentals through interactive modules and exercises.",
    tech: ["Django", "Python", "HTML", "CSS"],
    github: "https://github.com/matthewchungkaishing",
    category: "Education Tech",
    gradient: "from-emerald to-teal-500",
  },
];

const otherProjects = [
  {
    title: "Data Visualization Dashboard",
    description:
      "Dynamic dashboard demonstrating data visualization principles, idioms, marks, and channels to present complex data intuitively.",
    tech: ["Tableau"],
    link: "#",
    icon: "📊",
  },
  {
    title: "Simulated Traffic Light System",
    description: "Hands-on mechatronics project involving building and programming a functional, multi-intersection traffic light system.",
    tech: ["Arduino", "C/C++"],
    icon: "🚦",
  },
  {
    title: "Engineering Numerical Analysis",
    description: "Applied numerical methods for linear regression, root-finding, integration, and solving differential equations.",
    tech: ["MATLAB"],
    icon: "📐",
  },
  {
    title: "Personal LLM Project",
    description: "Exploring Large Language Models to build intelligent applications with natural language processing capabilities.",
    tech: ["Python", "Hugging Face"],
    github: "https://github.com/matthewchungkaishing",
    icon: "🤖",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/background_first.jpg)" }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/40 via-black/25 to-black/40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo/20 rounded-full blur-3xl animate-pulse delay-1000" />
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
            className="inline-block mb-4 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-cyan">Featured Work</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan via-indigo to-violet bg-clip-text text-transparent">
            Projects & Work
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            Transforming ideas into innovative solutions through code, design, and engineering
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}
              />

              {/* Card */}
              <div className="relative h-full backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.06] transition-all duration-300 hover:scale-[1.02] hover:border-white/20 flex flex-col">
                {/* Category Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r ${project.gradient} rounded-full text-white`}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-cyan transition-colors">{project.title}</h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-white/60 mb-6 leading-relaxed flex-grow">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-md text-cyan/70">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/70 hover:text-cyan transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Code</span>
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/70 hover:text-cyan transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Other Projects & Coursework</h3>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {otherProjects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 * idx }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-500" />

              <div className="relative h-full backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] transition-all duration-300">
                {/* Icon */}
                {project.icon && <div className="text-3xl mb-3">{project.icon}</div>}

                {/* Title */}
                <h4 className="text-base font-bold mb-2 text-white">{project.title}</h4>

                {/* Description */}
                <p className="text-sm text-white/50 mb-4">{project.description}</p>

                {/* Tech */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-xs bg-white/5 rounded text-white/60">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                {(project.github || project.link) && (
                  <div className="flex gap-3 text-xs">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 hover:text-cyan transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 hover:text-cyan transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
