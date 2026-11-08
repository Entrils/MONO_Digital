import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Plus,
  Minus,
  X,
  Menu,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import s from "./App.module.css";
import { getProjects, getServices } from "./data";
import { useLanguage } from "./i18n/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ProjectDialog from "./components/ProjectDialog";
import ContactForm from "./components/ContactForm";
import MobileMenu from "./components/MobileMenu";
import StudioDetails from "./components/StudioDetails";
import { studio } from "./studio";
import ProjectCard from "./components/ProjectCard";
gsap.registerPlugin(ScrollTrigger);
export default function App() {
  const { language, t } = useLanguage();
  const projects = getProjects(language);
  const services = getServices(language);
  const navigation = ["work", "studio", "services", "contact"];
  const root = useRef();
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState(null);
  const [service, setService] = useState(0);
  const [form, setForm] = useState(false);
  const [reduced] = useState(
    () => matchMedia("(prefers-reduced-motion:reduce)").matches,
  );
  const menuButton = useRef();
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from("[data-hero]", {
        yPercent: 110,
        stagger: 0.12,
        duration: 1.15,
        ease: "power4.out",
      });
      gsap.utils.toArray("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 91%", once: true },
        }),
      );
      gsap.utils.toArray("[data-image]").forEach((el) =>
        gsap.from(el, {
          clipPath: "inset(18% 0 18% 0)",
          scale: 0.94,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }),
      );
    }, root);
    let lenis;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.1, anchors: true });
      window.__monoLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const update = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(update);
      lenis._cleanup = () => gsap.ticker.remove(update);
    }
    return () => {
      ctx.revert();
      lenis?._cleanup();
      lenis?.destroy();
      delete window.__monoLenis;
    };
  }, [reduced]);
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("mono:language-change", refresh);
    return () => window.removeEventListener("mono:language-change", refresh);
  }, []);
  const closeMenu = () => setMenu(false);
  return (
    <div
      ref={root}
      className={`${s.app} ${language === "ru" ? s.russian : ""}`}
    >
      <a className={s.skip} href="#main" inert={menu}>
        {t("skip")}
      </a>
      <header className={s.header} inert={menu}>
        <a href="#" className={s.logo} aria-label={t("home")}>
          MONO<sup>®</sup>
        </a>
        <nav aria-label={t("navigation")}>
          {navigation.map((x) => (
            <a href={`#${x}`} key={x}>
              {t(`nav.${x}`)}
            </a>
          ))}
        </nav>
        <LanguageSwitcher />
        <button
          ref={menuButton}
          className={s.menuToggle}
          aria-label={t(menu ? "menu.close" : "menu.open")}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      {menu && <MobileMenu onClose={closeMenu} triggerRef={menuButton} />}
      <main id="main" inert={menu}>
        <section className={s.hero}>
          <p className={s.heroIntro}>{t("caption")}</p>
          <h1 className={s.heroTitle}>
            <span>
              <b data-hero>{t("hero.line1")}</b>
            </span>
            <span>
              <b data-hero>
                <em>{t("hero.line2")}</em>
              </b>
            </span>
          </h1>
          <div className={s.heroBottom}>
            <a href="#work" className={s.scroll}>
              <span>
                <ArrowDown size={20} />
              </span>
              {t("hero.scroll")}
            </a>
            <p>
              {t("hero.description1")}
              <br />
              {t("hero.description2")}
            </p>
          </div>
        </section>
        <section id="work" className={s.work}>
          <div className={s.sectionTop} data-reveal>
            <span className={s.eyebrow}>{t("work.kicker")}</span>
          </div>
          <div className={s.workHeading} data-reveal>
            <h2>
              {t("work.line1")}
              <br />
              <span>{t("work.line2")}</span>
              <sup>(02)</sup>
            </h2>
            <p>{t("work.concepts")}</p>
          </div>
          <p className={s.projectGroupLabel}>{t("work.featured")}</p>
          <div className={s.projectGrid}>
            {projects
              .filter((p) => ["aether", "objects"].includes(p.image))
              .map((p) => (
                <ProjectCard key={p.image} project={p} onOpen={setProject} />
              ))}
          </div>
          <div className={s.studiesHeading}>
            <h3>{t("work.studies")}</h3>
            <p>{t("work.studiesNote")}</p>
          </div>
          <div className={s.projectGrid}>
            {projects
              .filter((p) => ["form", "nova"].includes(p.image))
              .map((p) => (
                <ProjectCard key={p.image} project={p} onOpen={setProject} />
              ))}
          </div>
        </section>
        <section id="studio" className={s.studio}>
          <span className={s.eyebrow}>{t("studio.kicker")}</span>
          <div className={s.studioLayout} data-reveal>
            <h2>{t("studio.title")}</h2>
            <div className={s.studioCopy}>
              <p>{t("studio.paragraph1")}</p>
              <p>{t("studio.paragraph2")}</p>
              <a className={s.textLink} href="#services">
                {t("studio.capabilities")} <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <StudioDetails />
        </section>
        <section id="services" className={s.services}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>{t("services.kicker")}</span>
          </div>
          <h2 data-reveal>{t("services.title")}</h2>
          <div>
            {services.map((item, i) => (
              <div
                key={item.image}
                className={`${s.service} ${service === i ? s.serviceOpen : ""}`}
              >
                <button
                  onClick={() => setService(service === i ? null : i)}
                  aria-expanded={service === i}
                  aria-controls={`service-${i}`}
                >
                  <span className={s.eyebrow}>0{i + 1}</span>
                  <h3>{item.name}</h3>
                  {service === i ? <Minus /> : <Plus />}
                </button>
                <div
                  className={s.serviceDetail}
                  id={`service-${i}`}
                  hidden={service !== i}
                >
                  <div>
                    <p>{item.text}</p>
                    <span className={s.eyebrow}>{item.tags}</span>
                  </div>
                  <a
                    href="#contact"
                    aria-label={t("services.discuss", { name: item.name })}
                  >
                    <ArrowUpRight size={32} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="contact" className={s.contact}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>{t("contact.kicker")}</span>
          </div>
          <h2 data-reveal>
            {t("contact.line1")}
            <br />
            {t("contact.line2")}
          </h2>
          <div className={s.contactLinks}>
            <a href={`mailto:${studio.email}`}>
              {studio.email} <ArrowUpRight size={18} />
            </a>
            <a href={studio.telegram} target="_blank" rel="noreferrer">
              {studio.handle} <ArrowUpRight size={18} />
            </a>
          </div>
          <div className={s.contactAction}>
            <p>
              {t("contact.note1")}
              <br />
              {t("contact.note2")}
            </p>
            <button
              className={s.conversation}
              onClick={() => {
                setForm(!form);
                if (!form)
                  setTimeout(
                    () =>
                      document.getElementById("brief")?.scrollIntoView({
                        behavior: reduced ? "instant" : "smooth",
                        block: "start",
                      }),
                    80,
                  );
              }}
              aria-expanded={form}
              aria-controls="brief"
            >
              {t(form ? "contact.close" : "contact.start")}
              {form ? <X /> : <ArrowUpRight size={28} />}
            </button>
          </div>
          {form && (
            <div id="brief" className={s.brief}>
              <ContactForm />
            </div>
          )}
        </section>
      </main>
      <footer className={s.footer} inert={menu}>
        <div className={s.footerTop}>
          <p>
            {t("footer.line1")}
            <br />
            {t("footer.line2")}
          </p>
          <div>
            <span className={s.eyebrow}>{t("footer.explore")}</span>
            <a href="#work">{t("nav.work")}</a>
            <a href="#studio">{t("nav.studio")}</a>
            <a href="#services">{t("nav.services")}</a>
          </div>
          <div>
            <span className={s.eyebrow}>{t("footer.connect")}</span>
            <a href="#contact">
              {t("footer.enquiries")}
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/Entrils/MONO_Digital"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
          </div>
          <a href="#" className={s.backTop} aria-label={t("footer.back")}>
            <ArrowUp />
            <span>{t("footer.backText")}</span>
          </a>
        </div>
        <div className={s.footerBottom}>
          <span>© 2026 MONO®</span>
          <span>{t("footer.concept1")}</span>
        </div>
      </footer>
      {project && (
        <ProjectDialog
          project={projects.find((item) => item.image === project)}
          onClose={() => setProject(null)}
        />
      )}
    </div>
  );
}
