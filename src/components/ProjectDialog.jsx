import { useRef, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import s from "../App.module.css";
import ProjectImage from "./ProjectImage";
export default function ProjectDialog({ project, onClose }) {
  const { t } = useLanguage();
  const ref = useRef();
  useEffect(() => {
    ref.current.showModal();
    const lenis = window.__monoLenis;
    lenis?.stop();
    return () => lenis?.start();
  }, []);
  return (
    <dialog
      ref={ref}
      className={s.dialog}
      data-lenis-prevent
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="project-title"
    >
      <button
        autoFocus
        className={s.close}
        onClick={onClose}
        aria-label={t("project.close")}
      >
        <X />
      </button>
      <ProjectImage
        image={project.image}
        alt={project.alt}
        sizes="(max-width: 1195px) 92vw, 1100px"
      />
      <div className={s.dialogBody}>
        <span className={s.eyebrow}>
          {t("project.kicker")} / {project.year}
        </span>
        <h2 id="project-title">{project.name}</h2>
        <h3>{project.tag}</h3>
        <p>{project.description}</p>
        <p>{project.detail}</p>
        <ul>
          {project.scope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button
          className={s.textLink}
          onClick={() => {
            onClose();
            document
              .getElementById("contact")
              .scrollIntoView({ behavior: "instant" });
          }}
        >
          {t("project.cta")}
          <ArrowUpRight />
        </button>
      </div>
    </dialog>
  );
}
