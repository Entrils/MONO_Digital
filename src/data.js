import { projectTranslations, serviceTranslations } from "./i18n/content.ru";
export const projects = [
  {
    name: "AETHER",
    type: "Digital Identity",
    year: "2026",
    image: "aether",
    alt: "Liquid metallic identity on lavender",
    tag: "Beyond the ordinary.",
    description:
      "An identity for a new perspective. AETHER explores the space between the tangible and the imagined, bringing a fluid visual language to an independent culture platform.",
    scope: ["Brand strategy", "Visual identity", "Digital art direction"],
    detail:
      "A sculptural symbol anchors a system of expansive typography, atmospheric color and motion. Every touchpoint feels connected, while leaving room for the unexpected.",
  },
  {
    name: "FORM/01",
    type: "Art Direction",
    year: "2025",
    image: "form",
    alt: "Sculptural terracotta object on a warm stone backdrop",
    tag: "Material has a voice.",
    description:
      "A study of everyday forms with uncommon character. We imagined a contemporary objects label through a tactile, deliberately restrained editorial lens.",
    scope: ["Creative concept", "Art direction", "Editorial design"],
    detail:
      "Warm mineral tones, monumental still-life compositions and an uncompromising grid let each object take the lead. A quiet identity with a strong point of view.",
  },
  {
    name: "NOVA",
    type: "Interactive Experience",
    year: "2025",
    image: "nova",
    alt: "Orbital violet geometry on black",
    tag: "Enter another dimension.",
    description:
      "An exploratory digital world for a fictional electronic arts festival. NOVA turns browsing into an act of discovery, guided by sound-inspired forms and orbital motion.",
    scope: ["Experience design", "Creative development", "Motion system"],
    detail:
      "A generative visual language translates rhythm into geometry. The interface balances experimental interactions with a clear, accessible path through the program.",
  },
  {
    name: "OBJECTS",
    type: "Creative Commerce",
    year: "2024",
    image: "objects",
    alt: "Sage colored design object with a lime display",
    tag: "Less, but with feeling.",
    description:
      "A concept store for things worth keeping. OBJECTS brings a slower, more considered approach to commerce, placing the story of each piece before the transaction.",
    scope: ["Digital strategy", "E-commerce design", "Creative development"],
    detail:
      "Product storytelling, generous space and an earthy palette create a browsing experience that feels closer to a curated gallery than a catalogue.",
  },
];
export const services = [
  {
    name: "Brand Identity",
    text: "A point of view, made visible. Strategy, naming and visual systems that give ambitious brands their own unmistakable language.",
    tags: "STRATEGY / IDENTITY / GUIDELINES",
    image: "aether",
  },
  {
    name: "Web Design",
    text: "Digital spaces with a distinct sense of place. Thoughtful UX meets expressive interfaces, designed for the people on the other side of the screen.",
    tags: "UX / UI / DIGITAL SYSTEMS",
    image: "objects",
  },
  {
    name: "Creative Development",
    text: "Where the idea becomes an experience. Fast, accessible websites, playful interactions and real-time 3D with craft in every detail.",
    tags: "FRONTEND / WEBGL / INTERACTION",
    image: "nova",
  },
  {
    name: "Art Direction",
    text: "One clear vision, across every frame. Concepts, imagery and motion that create a world around your brand.",
    tags: "CONCEPT / IMAGE / MOTION",
    image: "form",
  },
];

export function getProjects(language) {
  return language === "ru"
    ? projects.map((project) => ({
        ...project,
        ...projectTranslations[project.image],
      }))
    : projects;
}

export function getServices(language) {
  return language === "ru"
    ? services.map((service) => ({
        ...service,
        ...serviceTranslations[service.image],
      }))
    : services;
}
