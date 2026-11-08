import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import ProjectImage from "./ProjectImage";
import s from "../App.module.css";
export default function ProjectCard({ project, onOpen }) {
  const { t } = useLanguage();
  return (
    <button
      className={s.project}
      onClick={() => onOpen(project.image)}
      aria-label={t("project.explore", {
        name: project.name,
        type: project.type,
      })}
      data-reveal
    >
      <div className={s.projectImage} data-image>
        <ProjectImage image={project.image} alt={project.alt} />
      </div>
      <div className={s.projectInfo}>
        <h3>{project.name}</h3>
        <span>{project.type}</span>
        <ArrowUpRight />
      </div>
      <p className={s.projectSummary}>
        {t(`project.summary.${project.image}`)}
      </p>
    </button>
  );
}
