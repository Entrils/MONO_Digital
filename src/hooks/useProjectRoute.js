import { useEffect, useRef, useState } from "react";
const ids = new Set(["aether", "objects", "form", "nova"]);
export function projectUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("project", id);
  return url;
}
function currentProject() {
  const id = new URLSearchParams(window.location.search).get("project");
  return ids.has(id) ? id : null;
}
export function useProjectRoute() {
  const [project, setProject] = useState(currentProject);
  const pending = useRef(null);
  useEffect(() => {
    const sync = () => setProject(currentProject());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    if (project || pending.current !== "contact") return;
    pending.current = null;
    const url = new URL(window.location.href);
    url.hash = "contact";
    window.history.replaceState(window.history.state, "", url);
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector("#contact h2");
      target?.focus({ preventScroll: true });
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [project]);
  const openProject = (id) => {
    if (!ids.has(id)) return;
    window.history.pushState(
      { ...window.history.state, monoProjectEntry: true },
      "",
      projectUrl(id),
    );
    setProject(id);
  };
  const closeProject = (intent = null) => {
    pending.current = intent;
    if (window.history.state?.monoProjectEntry) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.history.replaceState(window.history.state, "", url);
    setProject(null);
  };
  return { project, openProject, closeProject };
}
