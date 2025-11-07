"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, ExternalLink, Send } from "lucide-react";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "matthew888.mcks@gmail.com",
    href: "mailto:matthew888.mcks@gmail.com",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect with me",
    href: "https://www.linkedin.com/in/matthew-chung-kai-shing",
    gradient: "from-blue-500 to-cyan",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "matthewchungkaishing",
    href: "https://github.com/matthewchungkaishing",
    gradient: "from-purple-500 to-violet",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/background_first.jpg)" }}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
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
            <span className="text-sm font-medium text-cyan">Get In Touch</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan via-blue-500 to-indigo bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Whether you have a project in mind, want to collaborate, or just want to say hi, I'd love to hear from you!
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="space-y-6 mb-12">
          {contactLinks.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.label !== "Email" ? "_blank" : undefined}
                rel={contact.label !== "Email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="group relative block"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${contact.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}
                />

                {/* Card */}
                <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.06] transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{contact.label}</h3>
                        <p className="text-sm sm:text-base text-white/60">{contact.value}</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="w-6 h-6 text-cyan" />
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-block backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-8">
            <Send className="w-12 h-12 text-cyan mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Ready to collaborate?</h3>
            <p className="text-white/60 mb-6 max-w-md">
              I'm always open to discussing new opportunities, innovative projects, or just having a chat about technology.
            </p>
            <a
              href="mailto:matthew888.mcks@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan to-blue-500 rounded-full font-semibold text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-cyan/25 hover:shadow-cyan/40 hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              <span>Send me an email</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
