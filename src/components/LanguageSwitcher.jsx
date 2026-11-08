import { useLanguage } from "../i18n/LanguageContext";
import s from "../App.module.css";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      className={s.languageSwitcher}
      data-language-switcher
      role="group"
      aria-label={t("language.label")}
    >
      {[
        { code: "en", label: "EN", name: "English" },
        { code: "ru", label: "RU", name: "Русский" },
      ].map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={name}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
