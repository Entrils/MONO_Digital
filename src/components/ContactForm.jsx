import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getServices } from "../data";
import { useLanguage } from "../i18n/LanguageContext";
import { studio } from "../studio";
import s from "../App.module.css";

function validationMessage(field, t) {
  field.setCustomValidity("");
  if (field.validity.valueMissing) return t("validation.required");
  if (field.validity.typeMismatch) return t("validation.email");
  if (field.validity.tooShort)
    return t("validation.short", { min: field.minLength });
  return "";
}

const budgets = [
  { value: "5000-10000", min: 5000, max: 10000 },
  { value: "10000-20000", min: 10000, max: 20000 },
  { value: "20000-50000", min: 20000, max: 50000 },
  { value: "50000-plus", min: 50000 },
];

export default function ContactForm() {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef();
  const copyFallback = useRef();
  const [copyState, setCopyState] = useState("");
  useEffect(() => {
    if (copyState === "manual") {
      copyFallback.current?.focus();
      copyFallback.current?.select();
    }
  }, [copyState]);
  const currency = new Intl.NumberFormat(
    language === "ru" ? "ru-RU" : "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  );
  useEffect(() => {
    for (const field of ref.current.elements) {
      if (field.validity?.customError)
        field.setCustomValidity(validationMessage(field, t));
    }
  }, [t]);
  const briefText = () => {
    const fields = ref.current.elements;
    const body = [
      `${t("form.name")}: ${fields.name.value}`,
      `${t("form.email")}: ${fields.email.value}`,
      `${t("form.type")}: ${fields.type.selectedOptions[0]?.textContent}`,
      `${t("form.budget")}: ${fields.budget.selectedOptions[0]?.textContent}`,
      "",
      fields.message.value,
    ].join("\n");
    return body;
  };
  const emailDraft = () =>
    `mailto:${studio.email}?subject=${encodeURIComponent(`MONO — ${ref.current.elements.name.value}`)}&body=${encodeURIComponent(briefText())}`;
  const copyBrief = async () => {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(briefText());
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  };
  return (
    <form
      ref={ref}
      className={s.form}
      onInput={(event) => {
        event.target.setCustomValidity?.("");
        setSubmitted(false);
        setCopyState("");
      }}
      onInvalidCapture={(event) =>
        event.target.setCustomValidity(validationMessage(event.target, t))
      }
      onSubmit={(event) => {
        event.preventDefault();
        if (event.currentTarget.reportValidity()) setSubmitted(true);
      }}
    >
      <div className={s.formIntro}>
        <span className={s.eyebrow}>{t("form.kicker")}</span>
        <p>{t("form.intro")}</p>
      </div>
      <label>
        {t("form.name")}
        <input
          name="name"
          autoComplete="name"
          placeholder={t("form.namePlaceholder")}
          required
          minLength={2}
          maxLength={100}
        />
      </label>
      <label>
        {t("form.email")}
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("form.emailPlaceholder")}
          required
          maxLength={254}
        />
      </label>
      <label>
        {t("form.type")}
        <select name="type" required defaultValue="">
          <option value="" disabled>
            {t("form.servicePlaceholder")}
          </option>
          {services.map((service) => (
            <option key={service.image} value={service.image}>
              {service.name}
            </option>
          ))}
          <option value="other">{t("form.other")}</option>
        </select>
      </label>
      <label>
        {t("form.budget")}
        <select name="budget" required defaultValue="">
          <option value="" disabled>
            {t("form.budgetPlaceholder")}
          </option>
          {budgets.map(({ value, min, max }) => (
            <option key={value} value={value}>
              {currency.format(min)}
              {max ? `–${currency.format(max)}` : "+"}
            </option>
          ))}
          <option value="discuss">{t("form.discuss")}</option>
        </select>
      </label>
      <label className={s.message}>
        {t("form.message")}
        <textarea
          name="message"
          placeholder={t("form.messagePlaceholder")}
          required
          minLength={10}
          maxLength={5000}
          rows={3}
        />
      </label>
      <div className={s.formEnd}>
        <p>{t("form.demo")}</p>
        <button type="submit" className={s.submit}>
          {t("form.submit")}
          <ArrowUpRight size={20} />
        </button>
      </div>
      <p className={s.status} role="status">
        {submitted ? t("form.success") : ""}
      </p>
      {submitted && (
        <div className={s.draftActions}>
          <a className={s.submit} href={emailDraft()}>
            {t("form.emailAction")} <ArrowUpRight size={18} />
          </a>
          <div className={s.briefUtilities}>
            <button type="button" onClick={copyBrief}>
              {t("form.copy")}
            </button>
            <a
              download="MONO-brief.txt"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(briefText())}`}
            >
              {t("form.download")}
            </a>
          </div>
          {copyState && <p role="status">{t(`form.${copyState}`)}</p>}
          {copyState === "manual" && (
            <label>
              {t("form.briefText")}
              <textarea
                ref={copyFallback}
                readOnly
                value={briefText()}
                rows={6}
              />
            </label>
          )}
          <p>
            {t("form.emailHelp")}{" "}
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
          </p>
        </div>
      )}
    </form>
  );
}
