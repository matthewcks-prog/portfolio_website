"use client";

import { motion } from "framer-motion";
import { Code, Database, Wrench, Cloud, Globe, Shield, Users, Languages } from "lucide-react";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    skills: ["Python", "Java", "JavaScript", "PL/SQL", "MATLAB", "C/C++"],
    color: "from-cyan to-blue-500",
  },
  {
    title: "Web Technologies",
    icon: Globe,
    skills: ["Angular", "Node.js", "Express.js", "MongoDB", "Django", "HTML/CSS"],
    color: "from-indigo to-purple-500",
  },
  {
    title: "Data & Visualization",
    icon: Database,
    skills: ["Vega-Lite", "Tableau", "SQL", "Data Analysis"],
    color: "from-violet to-pink-500",
  },
  {
    title: "Engineering & OS",
    icon: Wrench,
    skills: ["ROS2", "Linux", "SolidWorks", "Arduino"],
    color: "from-pink to-red-500",
  },
  {
    title: "DevOps & Tools",
    icon: Cloud,
    skills: ["Git", "Jira", "CI/CD", "Docker"],
    color: "from-orange to-amber-500",
  },
  {
    title: "Professional Skills",
    icon: Users,
    skills: ["Agile/Scrum", "Software Testing", "ISO 27001", "Risk Assessment", "Teamwork", "Analytical Thinking"],
    color: "from-emerald to-teal-500",
  },
  {
    title: "Cybersecurity",
    icon: Shield,
    skills: ["Penetration Testing", "Vulnerability Assessment", "Security Frameworks"],
    color: "from-red-500 to-rose-500",
  },
  {
    title: "Spoken Languages",
    icon: Languages,
    skills: ["English (Fluent)", "French (Fluent)", "Chinese (Conversational)"],
    color: "from-blue-500 to-cyan",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/background_first.jpg)" }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse delay-700" />
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
            className="inline-block mb-4 px-4 py-2 rounded-full bg-violet/10 border border-violet/20 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-violet">Technical Expertise</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet via-purple-500 to-indigo bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            A comprehensive toolkit for building innovative solutions across the full technology stack
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.05 * idx }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${category.color} rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500`}
                />

                {/* Card */}
                <div className="relative h-full backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 hover:border-white/20">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-4 text-white">{category.title}</h3>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
