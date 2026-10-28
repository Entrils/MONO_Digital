import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import ProjectImage from "./ProjectImage";
import s from "./CaseStudy.module.css";

export default function CaseStudy({ image }) {
  const { language } = useLanguage();
  const ru = language === "ru";
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  if (!["aether", "objects"].includes(image)) return null;
  const aether = image === "aether";
  const items = [
    {
      id: "light",
      name: ru ? "Лампа Dome" : "Dome lamp",
      material: ru ? "Эмаль · латунь" : "Enamel · brass",
      position: "85% 25%",
    },
    {
      id: "glass",
      name: ru ? "Ваза Amber" : "Amber vessel",
      material: ru ? "Выдувное стекло" : "Blown glass",
      position: "15% 45%",
    },
    {
      id: "ceramic",
      name: ru ? "Чашки Form" : "Form cups",
      material: ru ? "Глазурованная керамика" : "Glazed ceramic",
      position: "55% 65%",
    },
  ];
  return (
    <section
      className={s.study}
      aria-label={ru ? "Разработка концепта" : "Concept development"}
    >
      <div className={s.intro}>
        <span>
          01 /{" "}
          {aether
            ? ru
              ? "СИСТЕМА АЙДЕНТИКИ"
              : "IDENTITY SYSTEM"
            : ru
              ? "СТРУКТУРА КАТАЛОГА"
              : "CATALOGUE STRUCTURE"}
        </span>
        <h3>
          {aether
            ? ru
              ? "Один принцип. Разные носители."
              : "One principle. Different formats."
            : ru
              ? "Сначала предмет. Затем детали."
              : "The object first. The details next."}
        </h3>
        <p>
          {aether
            ? ru
              ? "Круг задаёт знак, формат изображения и ритм композиции. Кобальт объединяет печатные материалы с цифровым каталогом."
              : "The circle informs the mark, image framing and composition. Cobalt connects the printed material to the digital catalogue."
            : ru
              ? "Каталог разделён по типам предметов. Название и материал видны сразу; подробности открываются по нажатию. Ниже — интерактивный прототип, не действующий магазин."
              : "The catalogue separates objects by type. Names and materials are visible at a glance; selecting an item reveals details. This is an interactive prototype, not a live shop."}
        </p>
      </div>
      {aether ? (
        <>
          <div className={s.identity}>
            <div className={s.mark}>
              <i />
              <strong>AETHER</strong>
              <span>Independent editions / 001</span>
            </div>
            <div className={s.specimen}>
              <span>TYPE / SPACE GROTESK</span>
              <p>
                Ideas
                <br />
                in print.
              </p>
              <small>
                Aa Bb Cc Dd Ee Ff Gg
                <br />
                0123456789 — & ®
              </small>
            </div>
          </div>
          <div className={s.palette}>
            {[
              ["#183DCB", "Cobalt"],
              ["#EEECE3", "Paper"],
              ["#20211F", "Ink"],
            ].map(([color, name]) => (
              <div
                key={name}
                style={{
                  background: color,
                  color: name === "Paper" ? "#20211F" : "#fff",
                }}
              >
                {name}
                <span>{color}</span>
              </div>
            ))}
          </div>
          <div className={s.intro}>
            <span>02 / {ru ? "РЕДАКЦИОННЫЙ ДИЗАЙН" : "EDITORIAL DESIGN"}</span>
            <h3>
              {ru
                ? "Сетка, которая держит содержание."
                : "A grid that holds the content."}
            </h3>
          </div>
          <div className={s.spread} lang="en">
            <div>
              <header>AETHER / JOURNAL 01</header>
              <h4>
                Space,
                <br />
                in between.
              </h4>
              <p>
                An independent study of architecture, objects and the ways we
                inhabit them.
              </p>
              <footer>01 — OBSERVATIONS</footer>
            </div>
            <div>
              <ProjectImage
                image="aether"
                alt={
                  ru
                    ? "Применение айдентики на печатных носителях"
                    : "Identity applied to printed matter"
                }
                sizes="50vw"
              />
              <footer>02 — MATERIAL STUDIES</footer>
            </div>
          </div>
          <div className={s.intro}>
            <span>03 / {ru ? "ЦИФРОВОЙ КАТАЛОГ" : "DIGITAL CATALOGUE"}</span>
            <h3>
              {ru ? "Та же система на экране." : "The same system on screen."}
            </h3>
            <p>
              {ru
                ? "Крупный заголовок, один акцентный цвет и спокойная иерархия. Мобильная версия сохраняет содержание и порядок чтения."
                : "Large typography, one accent colour and a quiet hierarchy. The mobile layout preserves the content and reading order."}
            </p>
          </div>
          <div className={s.screenStage}>
            <div className={s.screen} lang="en">
              <header>
                AETHER <span>Journal / Editions / About</span>
              </header>
              <h4>
                Independent
                <br />
                by edition.
              </h4>
              <ProjectImage image="aether" alt="" sizes="700px" />
              <footer>01 / New perspectives in print</footer>
            </div>
            <div className={s.phone} lang="en">
              <header>
                AETHER <span>☰</span>
              </header>
              <h4>
                Independent
                <br />
                by edition.
              </h4>
              <ProjectImage image="aether" alt="" sizes="240px" />
              <p>
                Journal 01
                <br />
                Space, in between.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={s.shop}>
            <header>
              <strong>objects.</strong>
              <span>
                {ru
                  ? "Предметы для повседневной жизни"
                  : "Objects for everyday living"}
              </span>
            </header>
            <div className={s.shopHero}>
              <ProjectImage image="objects" alt="" sizes="900px" />
              <h4>{ru ? "Вещи, с которыми живут." : "Made to live with."}</h4>
            </div>
            <div
              className={s.filters}
              role="group"
              aria-label={ru ? "Категория каталога" : "Catalogue category"}
            >
              {[
                ["all", ru ? "Все предметы" : "All objects"],
                ["light", ru ? "Свет" : "Lighting"],
                ["glass", ru ? "Стекло" : "Glass"],
                ["ceramic", ru ? "Керамика" : "Ceramics"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={category === id}
                  onClick={() => {
                    setCategory(id);
                    setSelected(null);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={s.products}>
              {items
                .filter((item) => category === "all" || category === item.id)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-expanded={selected === item.id}
                    onClick={() =>
                      setSelected(selected === item.id ? null : item.id)
                    }
                  >
                    <div>
                      <ProjectImage
                        image="objects"
                        alt={item.name}
                        style={{ transformOrigin: item.position }}
                        sizes="300px"
                      />
                    </div>
                    <strong>{item.name}</strong>
                    <span>{item.material}</span>
                    {selected === item.id && (
                      <p>
                        {ru
                          ? "Исследование формы и материала. В прототипе показана логика подачи товара: крупный план, материал и контекст использования. Покупка недоступна."
                          : "A study of form and material. This prototype demonstrates product presentation: a close view, material and context of use. Purchasing is unavailable."}
                      </p>
                    )}
                  </button>
                ))}
            </div>
          </div>
          <div className={s.intro}>
            <span>
              02 / {ru ? "ПРИНЦИПЫ ИНТЕРФЕЙСА" : "INTERFACE PRINCIPLES"}
            </span>
            <h3>
              {ru
                ? "Понятно и на небольшом экране."
                : "Clear on a smaller screen, too."}
            </h3>
            <p>
              {ru
                ? "Категории переносятся на новую строку, карточки выстраиваются в колонку, подписи остаются читаемыми. Никаких скрытых жестов или управления только наведением."
                : "Categories wrap, cards stack and captions remain readable. No hidden gestures or interactions that depend on hover."}
            </p>
          </div>
        </>
      )}
      <p className={s.note}>
        {ru
          ? "Авторский концепт. Графика и интерфейсы разработаны для демонстрации подхода; изображения — сгенерированные визуализации."
          : "Self-initiated concept. Graphics and interfaces demonstrate the design approach; imagery is generated visualisation."}
      </p>
    </section>
  );
}
