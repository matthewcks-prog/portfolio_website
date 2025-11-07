"use client";

import AboutMeTerminal from "@/components/sections/AboutMeTerminal";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Hobbies from "@/components/sections/Hobbies";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <AboutMeTerminal />
      <Projects />
      <Skills />
      <Experience />
      <Hobbies />
      <Contact />
    </>
  );
}
