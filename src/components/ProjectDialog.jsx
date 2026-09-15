import { useRef, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import s from "../App.module.css";
export default function ProjectDialog({ project, onClose }) {
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
        aria-label="Close project"
      >
        <X />
      </button>
      <img
        src={`/art/${project.image}.svg`}
        alt={`${project.name} concept visual`}
      />
      <div className={s.dialogBody}>
        <span className={s.eyebrow}>CONCEPT PROJECT / {project.year}</span>
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
          Let’s make something like this <ArrowUpRight />
        </button>
      </div>
    </dialog>
  );
}
