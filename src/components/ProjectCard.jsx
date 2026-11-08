import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { projectUrl } from "../hooks/useProjectRoute";
import ProjectImage from "./ProjectImage";
import s from "../App.module.css";
export default function ProjectCard({ project, onOpen }) {
  const { t } = useLanguage();
  return (
    <a
      className={s.project}
      href={projectUrl(project.image).toString()}
      data-project={project.image}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        onOpen(project.image);
      }}
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
    </a>
  );
}
