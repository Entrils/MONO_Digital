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
import { projects, services } from "./data";
import Magnetic from "./components/Magnetic";
import ProjectDialog from "./components/ProjectDialog";
import ContactForm from "./components/ContactForm";
const Sculpture = lazy(() => import("./components/Sculpture"));
gsap.registerPlugin(ScrollTrigger);
export default function App() {
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
      gsap.utils
        .toArray("[data-reveal]")
        .forEach((el) =>
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
          }),
        );
      gsap.utils
        .toArray("[data-image]")
        .forEach((el) =>
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
    links[0]?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current.focus();
      }
      if (e.key === "Tab") {
        const items = [menuButton.current, ...links];
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
  const closeMenu = () => {
    setMenu(false);
    menuButton.current?.focus();
  };
  return (
    <div ref={root} className={s.app}>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      <div className={s.cursor} ref={cursor} aria-hidden="true" />
      {loading && (
        <div className={s.preloader} aria-hidden="true">
          <span>
            MONO<sup>®</sup>
          </span>
          <div className={s.loadBottom}>
            <p>LOADING A DIFFERENT PERSPECTIVE</p>
            <strong>{progress.toString().padStart(3, "0")}%</strong>
          </div>
          <i style={{ width: `${progress}%` }} />
        </div>
      )}
      <header className={s.header}>
        <a href="#" className={s.logo} aria-label="MONO home">
          MONO<sup>®</sup>
        </a>
        <span className={s.navCaption}>
          <i /> Independent Digital Studio
        </span>
        <nav aria-label="Main navigation">
          {["Work", "Studio", "Services", "Contact"].map((x) => (
            <a href={`#${x.toLowerCase()}`} key={x}>
              {x}
            </a>
          ))}
        </nav>
        <button
          ref={menuButton}
          className={s.menuToggle}
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      {menu && (
        <div id="mobile-menu" className={s.mobileMenu} data-menu>
          <span className={s.eyebrow}>A DIFFERENT WAY IN</span>
          {["Work", "Studio", "Services", "Contact"].map((x, i) => (
            <a href={`#${x.toLowerCase()}`} onClick={closeMenu} key={x}>
              <sup>0{i + 1}</sup>
              {x}
              <ArrowUpRight />
            </a>
          ))}
          <p>Independent minds. Unconventional outcomes.</p>
        </div>
      )}
      <main id="main">
        <section className={s.hero}>
          <div className={s.heroMeta}>
            <span>
              INDEPENDENT MINDS.
              <br />
              UNCONVENTIONAL OUTCOMES.
            </span>
            <span>
              DESIGN × TECHNOLOGY
              <br />
              AVAILABLE FOR THE UNEXPECTED <i />
            </span>
          </div>
          <div className={s.sculpture} data-parallax>
            <Suspense fallback={<div className={s.fallback}>✳</div>}>
              <Sculpture reduced={reduced} />
            </Suspense>
          </div>
          <h1 className={s.heroTitle}>
            <span>
              <b data-hero>WE MAKE</b>
            </span>
            <span>
              <b data-hero>DIGITAL</b>
              <small>
                STRATEGY.
                <br />
                DESIGN.
                <br />A LITTLE DISOBEDIENCE.
              </small>
            </span>
            <span className={s.lastLine}>
              <b data-hero>
                FEEL <em>DIFFERENT.</em>
              </b>
            </span>
          </h1>
          <div className={s.heroBottom}>
            <a href="#work" className={s.scroll}>
              <span>
                <ArrowDown size={20} />
              </span>
              SCROLL TO FEEL SOMETHING
            </a>
            <p>
              We shape identities and digital experiences
              <br />
              for brands that refuse to blend in.
            </p>
            <span className={s.edition}>© MONO STUDIO — 2026</span>
          </div>
          <span className={s.heroCross} aria-hidden="true">
            +
          </span>
        </section>
        <div
          className={s.marquee}
          aria-label="Design is not decoration. Design is an experience."
        >
          <div aria-hidden="true">
            {[0, 1, 2, 3].map((x) => (
              <span key={x}>
                DESIGN IS NOT DECORATION <i>↗</i> DESIGN IS AN EXPERIENCE{" "}
                <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
        <section id="work" className={s.work}>
          <div className={s.sectionTop} data-reveal>
            <span className={s.eyebrow}>01 / SELECTED EXPLORATIONS</span>
            <span className={s.eyebrow}>2024 — 2026</span>
          </div>
          <div className={s.workHeading} data-reveal>
            <h2>
              SELECTED
              <br />
              <span>WORK</span>
              <sup>(04)</sup>
            </h2>
            <p>
              A few different ways
              <br />
              to make a difference.
              <br />
              <span>Self-initiated concept projects.</span>
            </p>
          </div>
          <div className={s.projectGrid}>
            {projects.map((p, i) => (
              <button
                key={p.name}
                className={`${s.project} ${s[`project${i}`]}`}
                onClick={() => setProject(p)}
                aria-label={`Explore ${p.name}, ${p.type}`}
                data-reveal
              >
                <div className={s.projectImage} data-image>
                  <img
                    src={`/art/${p.image}.svg`}
                    alt={
                      [
                        "Liquid metallic identity on lavender",
                        "Sculptural terracotta object on a warm stone backdrop",
                        "Orbital violet geometry on black",
                        "Sage colored design object with a lime display",
                      ][i]
                    }
                    width="1200"
                    height={i === 0 || i === 3 ? "1400" : "1100"}
                    loading="lazy"
                  />
                  <span className={s.projectBadge}>
                    VIEW PROJECT <ArrowUpRight size={16} />
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
            <span>DIFFERENT BRIEFS. SAME RESTLESS CURIOSITY.</span>
            <a href="#contact">
              YOURS COULD BE NEXT <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section id="studio" className={s.studio}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>02 / THE STUDIO</span>
            <span className={s.eyebrow}>NO DEFAULT SETTINGS.</span>
          </div>
          <h2 data-reveal>
            WE DON’T
            <br />
            FOLLOW THE
            <br />
            <span>FUTURE.</span>
            <br />
            WE DESIGN IT<span className={s.lime}>.</span>
          </h2>
          <div className={s.studioBottom}>
            <div className={s.star} aria-hidden="true">
              ✳
            </div>
            <div data-reveal>
              <p className={s.studioLead}>
                Good enough is a starting point.
                <br />
                Different is the destination.
              </p>
              <p>
                MONO is an independent digital studio working at the
                intersection of brand, design and technology. We turn complex
                ideas into clear, distinctive experiences — with equal parts
                precision and instinct.
              </p>
              <p>
                We believe the best work happens when curious minds ask better
                questions. Less noise. More intention. And always, something you
                haven’t felt before.
              </p>
              <a className={s.textLink} href="#services">
                MEET OUR CAPABILITIES <ArrowUpRight size={18} />
              </a>
            </div>
            <span className={s.studioNote}>
              SMALL BY DESIGN.
              <br />
              BOUNDLESS BY NATURE.
            </span>
          </div>
        </section>
        <section id="services" className={s.services}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>03 / OUR CAPABILITIES</span>
            <span className={s.eyebrow}>IDEA → IMPACT</span>
          </div>
          <h2 data-reveal>
            WHAT WE DO<span className={s.lime}>↘</span>
          </h2>
          <div>
            {services.map((item, i) => (
              <div
                key={item.name}
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
                  <img src={`/art/${item.image}.svg`} alt="" loading="lazy" />
                  <div>
                    <p>{item.text}</p>
                    <span className={s.eyebrow}>{item.tags}</span>
                  </div>
                  <a href="#contact" aria-label={`Discuss ${item.name}`}>
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
            <span className={s.eyebrow}>04 / A FRIENDLY REMINDER</span>
            <span className={s.eyebrow}>TURN UP THE FEELING.</span>
          </div>
          <div className={s.experimentArt} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h2 data-experiment>
            GOOD DESIGN
            <br />
            IS NEVER
            <br />
            <span>INVISIBLE.</span>
          </h2>
          <div className={s.experimentBottom}>
            <span>
              MAKE A MARK.
              <br />
              LEAVE A FEELING.
            </span>
            <span className={s.experimentStar} aria-hidden="true">
              ✳
            </span>
            <span>
              THAT’S THE
              <br />
              MONO EFFECT. ↗
            </span>
          </div>
        </section>
        <section id="contact" className={s.contact}>
          <div className={s.sectionTop}>
            <span className={s.eyebrow}>05 / NEXT STARTS HERE</span>
            <span className={s.availability}>
              <i /> OPEN TO NEW POSSIBILITIES
            </span>
          </div>
          <h2 data-reveal>
            HAVE A PROJECT?
            <br />
            LET’S MAKE IT
            <br />
            <span>IMPOSSIBLE</span>
            <br />
            TO IGNORE.
          </h2>
          <div className={s.contactAction}>
            <p>
              Big ambition? Unusual idea?
              <br />
              We’d like to hear it.
            </p>
            <Magnetic
              className={s.conversation}
              onClick={() => {
                setForm(!form);
                if (!form)
                  setTimeout(
                    () =>
                      document
                        .getElementById("brief")
                        ?.scrollIntoView({
                          behavior: reduced ? "instant" : "smooth",
                          block: "start",
                        }),
                    80,
                  );
              }}
              aria-expanded={form}
              aria-controls="brief"
            >
              {form ? "CLOSE THE BRIEF" : "START A CONVERSATION"}
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
            Independent digital studio.
            <br />
            Made of different.
          </p>
          <div>
            <span className={s.eyebrow}>EXPLORE</span>
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <a href="#services">Services</a>
          </div>
          <div>
            <span className={s.eyebrow}>LET’S CONNECT</span>
            <a href="#contact">
              Project enquiries <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/Entrils/MONO_Digital"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
            <span className={s.conceptNote}>
              A fictional studio concept.
              <br />
              Social channels coming with launch.
            </span>
          </div>
          <a href="#" className={s.backTop} aria-label="Back to top">
            <ArrowUp />
            <span>BACK TO TOP</span>
          </a>
        </div>
        <a href="#" className={s.footerLogo} aria-label="MONO back to top">
          MONO<sup>®</sup>
          <MoveUpRight aria-hidden="true" />
        </a>
        <div className={s.footerBottom}>
          <span>© 2026 MONO® DIGITAL STUDIO</span>
          <span>DESIGNED TO FEEL DIFFERENT.</span>
          <span>
            LOCAL TIME <Clock />
          </span>
        </div>
      </footer>
      {project && (
        <ProjectDialog project={project} onClose={() => setProject(null)} />
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
