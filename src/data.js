import { projectTranslations, serviceTranslations } from "./i18n/content.ru";
export const projects = [
  {
    name: "AETHER",
    type: "Digital Identity",
    year: "2026",
    image: "aether",
    alt: "Cobalt clothbound art book, letterpress cards and architectural prints on a steel table",
    tag: "Beyond the ordinary.",
    description:
      "A self-initiated identity study for an independent culture publisher. The brief: give art books, printed matter and a digital catalogue one recognisable visual system.",
    scope: ["Brand strategy", "Visual identity", "Digital art direction"],
    detail:
      "Cobalt cloth, uncoated paper and a restrained circular mark form the starting palette. Overlapping print formats explore how the identity could work across a small publishing range.",
  },
  {
    name: "FORM/01",
    type: "Art Direction",
    year: "2025",
    image: "form",
    alt: "Oxblood leather and chrome lounge chair in a sunlit limestone interior",
    tag: "Material has a voice.",
    description:
      "A campaign direction for a fictional furniture collection. The brief: communicate the construction and material quality of a lounge chair through a single interior scene.",
    scope: ["Creative concept", "Art direction", "Editorial design"],
    detail:
      "Oxblood leather and tubular chrome sit against warm limestone. Side lighting reveals seams, surface wear and the frame, making the object itself the focus of the composition.",
  },
  {
    name: "NOVA",
    type: "Spatial Identity Study",
    year: "2025",
    image: "nova",
    alt: "Monumental red and cobalt light installation inside an industrial exhibition hall",
    tag: "Enter another dimension.",
    description:
      "A visual concept for an electronic arts festival. The brief: establish a strong sense of scale and a graphic language that can carry from the physical venue to a website.",
    scope: ["Experience design", "Creative development", "Motion system"],
    detail:
      "Red light frames and cobalt illumination repeat through an industrial hall. Human silhouettes provide scale; the same limited palette could organise programme and navigation screens.",
  },
  {
    name: "OBJECTS",
    type: "Creative Commerce",
    year: "2024",
    image: "objects",
    alt: "Olive task lamp, amber glass, ceramics and linen on a walnut table",
    tag: "Less, but with feeling.",
    description:
      "A commerce concept for a curated homeware shop. The brief: present different products as one considered collection, while keeping material and finish easy to read.",
    scope: ["Digital strategy", "E-commerce design", "Creative development"],
    detail:
      "Olive enamel, amber glass and ivory ceramics are brought together on walnut. Close framing and directional light separate the materials without turning the scene into a product catalogue.",
  },
];
export const services = [
  {
    name: "Brand Identity",
    text: "Positioning, naming and a visual identity system. Proposed outputs include a logo, typography, colour palette and guidelines for print and digital use.",
    tags: "STRATEGY / IDENTITY / GUIDELINES",
    image: "aether",
  },
  {
    name: "Web Design",
    text: "Site structure, page layouts and responsive interface design. The focus is on a clear content hierarchy and a consistent component system.",
    tags: "UX / UI / DIGITAL SYSTEMS",
    image: "objects",
  },
  {
    name: "Creative Development",
    text: "Frontend implementation, responsive behaviour and accessible interactions. Motion and WebGL are used where they help explain the content.",
    tags: "FRONTEND / WEBGL / INTERACTION",
    image: "nova",
  },
  {
    name: "Art Direction",
    text: "A visual direction for a launch or campaign: references, composition, lighting and image treatment, documented so the idea stays consistent.",
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
