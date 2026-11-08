import { useRef, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import s from "../App.module.css";
import CaseStudy from "./CaseStudy";
import ProjectImage from "./ProjectImage";
export default function ProjectDialog({ project, onClose, onContact }) {
  const { t } = useLanguage();
  const ref = useRef();
  const returnFocus = useRef(
    document.activeElement === document.body
      ? document.querySelector(`[data-project="${project.image}"]`)
      : document.activeElement,
  );
  const restoreFocus = useRef(true);
  useEffect(() => {
    ref.current.showModal();
    const lenis = window.__monoLenis;
    lenis?.stop();
    return () => {
      lenis?.start();
      if (restoreFocus.current) {
        const target = returnFocus.current?.isConnected
          ? returnFocus.current
          : document.querySelector(`[data-project="${project.image}"]`);
        target?.focus({ preventScroll: true });
      }
    };
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
        <span className={s.eyebrow}>{t("project.kicker")}</span>
        <h2 id="project-title">{project.name}</h2>
        <h3>{project.tag}</h3>
        <h4>{t("project.brief")}</h4>
        <p>{project.description}</p>
        <h4>{t("project.direction")}</h4>
        <p>{project.detail}</p>
        <h4>{t("project.scope")}</h4>
        <ul>
          {project.scope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <CaseStudy image={project.image} />
        <button
          className={s.textLink}
          onClick={() => {
            restoreFocus.current = false;
            onContact();
          }}
        >
          {t("project.cta")}
          <ArrowUpRight />
        </button>
      </div>
    </dialog>
  );
}
