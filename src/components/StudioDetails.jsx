import { studio } from "../studio";
import { useLanguage } from "../i18n/LanguageContext";
import s from "../App.module.css";
export default function StudioDetails() {
  const { language, t } = useLanguage();
  return (
    <div className={s.team}>
      <div className={s.teamHeading}>
        <h3>{t("team.title")}</h3>
        <p>{t("team.note")}</p>
      </div>
      <div className={s.teamGrid}>
        {studio.team.map((person) => (
          <div key={person.name.en}>
            <strong>{person.name[language]}</strong>
            <span>{person.role[language]}</span>
          </div>
        ))}
      </div>
      <p className={s.location}>{t("studio.location")}</p>
    </div>
  );
}
