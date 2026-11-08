import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { site } from "../site";
import { messages } from "./messages";

const LanguageContext = createContext(null);
export const LANGUAGE_KEY = "mono-language";
const supported = (value) => value === "en" || value === "ru";

export function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (supported(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    if (supported(saved)) return saved;
  } catch {
    /* The site also works when browser storage is disabled. */
  }
  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];
  return (
    languages.map((language) => language?.split("-")[0]).find(supported) || "en"
  );
}

export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(getInitialLanguage);
  const [announcement, setAnnouncement] = useState("");
  const setLanguage = useCallback((next) => {
    if (!supported(next)) return;
    updateLanguage(next);
    setAnnouncement(messages[next]["language.announce"]);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  }, []);
  const t = useCallback(
    (key, values = {}) => {
      const template = messages[language][key] ?? messages.en[key] ?? key;
      return template.replace(
        /\{(\w+)\}/g,
        (_, name) => values[name] ?? `{${name}}`,
      );
    },
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t("seo.title");
    const updateMeta = (attribute, name, content) => {
      let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, name);
        document.head.append(tag);
      }
      tag.content = content;
    };
    updateMeta("name", "description", t("seo.description"));
    updateMeta("property", "og:title", t("seo.title"));
    updateMeta("property", "og:description", t("seo.description"));
    updateMeta("property", "og:locale", language === "ru" ? "ru_RU" : "en_US");
    updateMeta("property", "og:image", site.origin + site.previewImage);
    updateMeta("property", "og:image:alt", t("seo.imageAlt"));
    updateMeta("property", "og:url", `${site.origin}/?lang=${language}`);
    updateMeta("name", "twitter:card", "summary_large_image");
    updateMeta("name", "twitter:title", t("seo.title"));
    updateMeta("name", "twitter:description", t("seo.description"));
    updateMeta("name", "twitter:image", site.origin + site.previewImage);
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      /* Optional persistence. */
    }
    const frame = requestAnimationFrame(() =>
      window.dispatchEvent(new Event("mono:language-change")),
    );
    return () => cancelAnimationFrame(frame);
  }, [language, t]);

  useEffect(() => {
    const onPopState = () => updateLanguage(getInitialLanguage());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
      <span className="visuallyHidden" role="status" aria-live="polite">
        {announcement}
      </span>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value)
    throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
