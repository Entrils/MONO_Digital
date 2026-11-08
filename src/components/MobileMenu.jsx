import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import s from "../App.module.css";

export default function MobileMenu({ onClose, triggerRef }) {
  const { t } = useLanguage();
  const ref = useRef();
  const closeButton = useRef();
  const callback = useRef(onClose);
  callback.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    closeButton.current.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__monoLenis?.stop();
    const keyboard = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        callback.current();
      }
      if (event.key === "Tab") {
        const controls = [
          ...dialog.querySelectorAll("button:not([disabled]), a[href]"),
        ];
        const index = controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[
          (index + (event.shiftKey ? -1 : 1) + controls.length) %
            controls.length
        ]?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const resize = (event) => {
      if (event.matches) callback.current();
    };
    desktop.addEventListener("change", resize);
    document.addEventListener("keydown", keyboard);
    return () => {
      desktop.removeEventListener("change", resize);
      document.removeEventListener("keydown", keyboard);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      window.__monoLenis?.start();
      triggerRef.current?.focus();
    };
  }, [triggerRef]);
  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      className={s.mobileMenu}
      aria-label={t("navigation")}
      aria-modal="true"
      data-menu
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className={s.mobileMenuTop}>
        <span className={s.logo}>
          MONO<sup>®</sup>
        </span>
        <LanguageSwitcher />
        <button
          ref={closeButton}
          className={s.menuClose}
          type="button"
          aria-label={t("menu.close")}
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <span className={s.eyebrow}>{t("menu.kicker")}</span>
      {["work", "studio", "services", "contact"].map((id, index) => (
        <a key={id} href={`#${id}`} onClick={onClose}>
          <sup>0{index + 1}</sup>
          {t(`nav.${id}`)}
          <ArrowUpRight />
        </a>
      ))}
      <p>{t("menu.note")}</p>
    </dialog>
  );
}
