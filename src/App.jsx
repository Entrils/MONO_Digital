import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Plus,
  Minus,
  X,
  Menu,
  MoveUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import s from "./App.module.css";
import { getProjects, getServices } from "./data";
import { useLanguage } from "./i18n/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Magnetic from "./components/Magnetic";
import ProjectDialog from "./components/ProjectDialog";
import ContactForm from "./components/ContactForm";
import ProjectImage from "./components/ProjectImage";
const Sculpture = lazy(() => import("./components/Sculpture"));
gsap.registerPlugin(ScrollTrigger);
export default function App() {
  const { language, t } = useLanguage();
  const projects = getProjects(language);
  const services = getServices(language);
  const navigation = ["work", "studio", "services", "contact"];
  const root = useRef();
  const cursor = useRef();
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState(null);
  const [service, setService] = useState(0);
  const [form, setForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reduced] = useState(
    () => matchMedia("(prefers-reduced-motion:reduce)").matches,
  );
  const menuButton = useRef();
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(100, Math.round((now - start) / 7));
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
      else setLoading(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (loading) return;
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
          y: 50,
          opacity: 0,
          duration: 0.9,
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
      gsap.to("[data-parallax]", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-parallax]",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to("[data-experiment]", {
        scale: 1.09,
        rotation: -2,
        scrollTrigger: {
          trigger: "#experiment",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
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
  }, [loading, reduced]);
  useEffect(() => {
    const move = (e) => {
      if (cursor.current) {
        cursor.current.style.left = `${e.clientX}px`;
        cursor.current.style.top = `${e.clientY}px`;
        cursor.current.dataset.active = Boolean(
          e.target.closest("a,button"),
        ).toString();
      }
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useEffect(() => {
    if (!menu) return;
    window.__monoLenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = [...document.querySelectorAll("[data-menu] a")];
    const languageButtons = [
      ...document.querySelectorAll("[data-language-switcher] button"),
    ];
    links[0]?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current.focus();
      }
      if (e.key === "Tab") {
        const items = [menuButton.current, ...languageButtons, ...links];
        const idx = items.indexOf(document.activeElement);
        e.preventDefault();
        items[
          (idx + (e.shiftKey ? -1 : 1) + items.length) % items.length
        ].focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.__monoLenis?.start();
      document.removeEventListener("keydown", key);
    };
  }, [menu]);
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("mono:language-change", refresh);
    return () => window.removeEventListener("mono:language-change", refresh);
  }, []);
  const closeMenu = () => {
    setMenu(false);
    menuButton.current?.focus();
  };
  return (
    <div
      ref={root}
      className={`${s.app} ${language === "ru" ? s.russian : ""}`}
    >
      <a className={s.skip} href="#main">
        {t("skip")}
      </a>
      <div className={s.cursor} ref={cursor} aria-hidden="true" />
      {loading && (
        <div className={s.preloader} aria-hidden="true">
          <span>
            MONO<sup>®</sup>
          </span>
          <div className={s.loadBottom}>
            <p>{t("loading")}</p>
            <strong>{progress.toString().padStart(3, "0")}%</strong>
          </div>
          <i style={{ width: `${progress}%` }} />
        </div>
      )}
      <header className={s.header}>
        <a href="#" className={s.logo} aria-label={t("home")}>
          MONO<sup>®</sup>
        </a>
        <span className={s.navCaption}>
          <i />
          {t("caption")}
        </span>
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
      {menu && (
        <div id="mobile-menu" className={s.mobileMenu} data-menu>
          <span className={s.eyebrow}>{t("menu.kicker")}</span>
          {navigation.map((x, i) => (
            <a href={`#${x}`} onClick={closeMenu} key={x}>
              <sup>0{i + 1}</sup>
              {t(`nav.${x}`)}
              <ArrowUpRight />
            </a>
          ))}
          <p>{t("menu.note")}</p>
        </div>
      )}
      <main id="main">
        <section className={s.hero}>
          <div className={s.heroMeta}>
            <span>
              {t("hero.meta1")}
              <br />
              {t("hero.meta2")}
            </span>
            <span>
              {t("hero.discipline")}
              <br />
              {t("hero.availability")}
              <i />
            </span>
          </div>
          <div className={s.sculpture} data-parallax>
            <Suspense fallback={<div className={s.fallback}>✳</div>}>
              <Sculpture reduced={reduced} />
            </Suspense>
          </div>
          <h1 className={s.heroTitle}>
            <span>
              <b data-hero>{t("hero.line1")}</b>
            </span>
            <span>
              <b data-hero>{t("hero.line2")}</b>
              <small>
                {t("hero.strategy")}
                <br />
                {t("hero.design")}
                <br />
                {t("hero.rebel")}
              </small>
            </span>
            <span className={s.lastLine}>
              <b data-hero>
                {t("hero.line3")} <em>{t("hero.accent")}</em>
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
            <span className={s.edition}>© MONO STUDIO — 2026</span>
          </div>
          <span className={s.heroCross} aria-hidden="true">
            +
          </span>
        </section>
        <div className={s.marquee} aria-label={t("marquee.label")}>
          <div aria-hidden="true">
            {[0, 1, 2, 3].map((x) => (
              <span key={x}>
                {t("marquee.first")}
                <i>↗</i>
                {t("marquee.second")} <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
        <section id="work" className={s.work}>
          <div className={s.sectionTop} data-reveal>
            <span className={s.eyebrow}>{t("work.kicker")}</span>
            <span className={s.eyebrow}>2024 — 2026</span>
          </div>
          <div className={s.workHeading} data-reveal>
            <h2>
              {t("work.line1")}
              <br />
              <span>{t("work.line2")}</span>
              <sup>(04)</sup>
            </h2>
            <p>
              {t("work.note1")}
              <br />
              {t("work.note2")}
              <br />
              <span>{t("work.concepts")}</span>
            </p>
          </div>
          <div className={s.projectGrid}>
            {projects.map((p, i) => (
              <button
                key={p.name}
                className={`${s.project} ${s[`project${i}`]}`}
                onClick={() => setProject(p.image)}
                aria-label={t("project.explore", {
                  name: p.name,
                  type: p.type,
                })}
                data-reveal
              >
                <div className={s.projectImage} data-image>
                  <ProjectImage image={p.image} alt={p.alt} />
                  <span className={s.projectBadge}>
                    {t("project.view")}
                    <ArrowUpRight size={16} />
                  </span>
                  <span className={s.projectNumber}>0{i + 1}</span>
                </div>
                <div className={s.projectInfo}>
                  <h3>{p.name}</h3>
                  <span>
                    {p.type} / {p.year}
                  </span>
                  <ArrowUpRight />
                </div>
              </button>
            ))}
          </div>
          <div className={s.workFoot}>
            <span>{t("work.footer")}</span>
            <a href="#contact">
              {t("work.next")}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section id="studio" className={s.studio}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>{t("studio.kicker")}</span>
            <span className={s.eyebrow}>{t("studio.note")}</span>
          </div>
          <h2 data-reveal>
            {t("studio.line1")}
            <br />
            {t("studio.line2")}
            <br />
            <span>{t("studio.line3")}</span>
            <br />
            {t("studio.line4")}
            <span className={s.lime}>.</span>
          </h2>
          <div className={s.studioBottom}>
            <div className={s.star} aria-hidden="true">
              ✳
            </div>
            <div data-reveal>
              <p className={s.studioLead}>
                {t("studio.lead1")}
                <br />
                {t("studio.lead2")}
              </p>
              <p>{t("studio.paragraph1")}</p>
              <p>{t("studio.paragraph2")}</p>
              <a className={s.textLink} href="#services">
                {t("studio.capabilities")}
                <ArrowUpRight size={18} />
              </a>
            </div>
            <span className={s.studioNote}>
              {t("studio.small")}
              <br />
              {t("studio.boundless")}
            </span>
          </div>
        </section>
        <section id="services" className={s.services}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>{t("services.kicker")}</span>
            <span className={s.eyebrow}>{t("services.impact")}</span>
          </div>
          <h2 data-reveal>
            {t("services.title")}
            <span className={s.lime}>↘</span>
          </h2>
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
                  onMouseEnter={() => {
                    if (matchMedia("(hover:hover)").matches) setService(i);
                  }}
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
                  <ProjectImage
                    image={item.image}
                    alt=""
                    sizes="(max-width: 767px) 27vw, 24vw"
                  />
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
        <section
          id="experiment"
          className={s.experiment}
          onPointerMove={(e) => {
            if (!reduced) {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty(
                "--mx",
                `${(e.clientX - r.left - r.width / 2) * 0.035}px`,
              );
              e.currentTarget.style.setProperty(
                "--my",
                `${(e.clientY - r.top - r.height / 2) * 0.035}px`,
              );
            }
          }}
        >
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>{t("experiment.kicker")}</span>
            <span className={s.eyebrow}>{t("experiment.note")}</span>
          </div>
          <div className={s.experimentArt} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h2 data-experiment>
            {t("experiment.line1")}
            <br />
            {t("experiment.line2")}
            <br />
            <span>{t("experiment.line3")}</span>
          </h2>
          <div className={s.experimentBottom}>
            <span>
              {t("experiment.mark")}
              <br />
              {t("experiment.feeling")}
            </span>
            <span className={s.experimentStar} aria-hidden="true">
              ✳
            </span>
            <span>
              {t("experiment.effect1")}
              <br />
              {t("experiment.effect2")}
            </span>
          </div>
        </section>
        <section id="contact" className={s.contact}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>{t("contact.kicker")}</span>
            <span className={s.availability}>
              <i />
              {t("contact.available")}
            </span>
          </div>
          <h2 data-reveal>
            {t("contact.line1")}
            <br />
            {t("contact.line2")}
            <br />
            <span>{t("contact.line3")}</span>
            <br />
            {t("contact.line4")}
          </h2>
          <div className={s.contactAction}>
            <p>
              {t("contact.note1")}
              <br />
              {t("contact.note2")}
            </p>
            <Magnetic
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
            </Magnetic>
          </div>
          {form && (
            <div id="brief" className={s.brief}>
              <ContactForm />
            </div>
          )}
        </section>
      </main>
      <footer className={s.footer}>
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
            <span className={s.conceptNote}>
              {t("footer.concept1")}
              <br />
              {t("footer.concept2")}
            </span>
          </div>
          <a href="#" className={s.backTop} aria-label={t("footer.back")}>
            <ArrowUp />
            <span>{t("footer.backText")}</span>
          </a>
        </div>
        <a href="#" className={s.footerLogo} aria-label={t("footer.home")}>
          MONO<sup>®</sup>
          <MoveUpRight aria-hidden="true" />
        </a>
        <div className={s.footerBottom}>
          <span>© 2026 MONO® DIGITAL STUDIO</span>
          <span>{t("footer.tagline")}</span>
          <span>
            {t("footer.time")} <Clock />
          </span>
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
function Clock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-GB", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  useEffect(() => {
    const id = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString("en-GB", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
          }),
        ),
      60000,
    );
    return () => clearInterval(id);
  }, []);
  return <>{time} UTC</>;
}
