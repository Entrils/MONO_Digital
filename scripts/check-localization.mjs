import { build } from "esbuild";
import { JSDOM } from "jsdom";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
await build({
  stdin: {
    contents: `export {default as App} from './src/App.jsx'; export {LanguageProvider,getInitialLanguage,LANGUAGE_KEY} from './src/i18n/LanguageContext.jsx'; export {messages} from './src/i18n/messages.js'; export {getProjects,getServices} from './src/data.js';`,
    resolveDir: root,
    sourcefile: "qa-entry.jsx",
  },
  bundle: true,
  jsx: "automatic",
  platform: "node",
  format: "esm",
  outfile: root + "/node_modules/.cache/mono-localization-qa.mjs",
  loader: { ".css": "empty" },
  packages: "external",
  plugins: [
    {
      name: "scene-stub",
      setup(b) {
        b.onLoad({ filter: /Sculpture.jsx$/ }, () => ({
          contents: "export default function Sculpture(){return null}",
          loader: "jsx",
        }));
      },
    },
  ],
});
const dom = new JSDOM(
  '<!doctype html><html lang="en"><head></head><body><div id="root"></div></body></html>',
  { url: "https://mono.test/?campaign=launch#work", pretendToBeVisual: true },
);
for (const name of [
  "window",
  "document",
  "HTMLElement",
  "Element",
  "Node",
  "Event",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
])
  globalThis[name] = [
    "getComputedStyle",
    "requestAnimationFrame",
    "cancelAnimationFrame",
  ].includes(name)
    ? dom.window[name].bind(dom.window)
    : dom.window[name];
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
window.matchMedia = globalThis.matchMedia = (q) => ({
  matches: q.includes("reduced-motion"),
  media: q,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
});
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
window.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
const { createRoot } = await import(root + "/node_modules/react-dom/client.js");
const React = await import(root + "/node_modules/react/index.js");
const {
  App,
  LanguageProvider,
  getInitialLanguage,
  LANGUAGE_KEY,
  messages,
  getProjects,
  getServices,
} = await import(root + "/node_modules/.cache/mono-localization-qa.mjs");
assert.deepEqual(
  Object.keys(messages.en).sort(),
  Object.keys(messages.ru).sort(),
);
for (const locale of ["en", "ru"]) {
  for (const [key, value] of Object.entries(messages[locale]))
    assert.ok(value.trim(), `${locale}.${key}`);
  for (const project of getProjects(locale))
    for (const field of ["type", "tag", "description", "detail", "alt"])
      assert.ok(project[field]);
  assert.equal(getServices(locale).length, 4);
}
const h = (url) => window.history.replaceState({}, "", url);
Object.defineProperty(window.navigator, "languages", {
  value: ["ru-RU", "en-US"],
  configurable: true,
});
assert.equal(getInitialLanguage(), "ru", "Russian browser detection");
window.localStorage.setItem(LANGUAGE_KEY, "en");
assert.equal(getInitialLanguage(), "en", "Stored choice overrides browser");
h("/?lang=ru&campaign=launch#work");
assert.equal(getInitialLanguage(), "ru", "URL overrides stored choice");
h("/?lang=de");
assert.equal(
  getInitialLanguage(),
  "en",
  "Unsupported URL falls back to saved choice",
);
window.localStorage.setItem(LANGUAGE_KEY, "invalid");
assert.equal(
  getInitialLanguage(),
  "ru",
  "Invalid saved choice falls back to browser",
);
Object.defineProperty(window.navigator, "languages", {
  value: ["fr-FR", "de-DE"],
  configurable: true,
});
assert.equal(getInitialLanguage(), "en", "Unsupported browser uses English");
h("/?lang=en&campaign=launch#work");
window.localStorage.clear();
let renderer = createRoot(document.getElementById("root"));
renderer.render(
  React.createElement(LanguageProvider, null, React.createElement(App)),
);
const flush = () => new Promise((r) => setTimeout(r, 50));
await new Promise((r) => setTimeout(r, 900));
const ru = () =>
  document.querySelector('[data-language-switcher] button[lang="ru"]');
const en = () =>
  document.querySelector('[data-language-switcher] button[lang="en"]');
const change = async (locale) => {
  (locale === "ru" ? ru() : en()).click();
  await flush();
};
assert.equal(document.documentElement.lang, "en");
assert.equal(en().getAttribute("aria-pressed"), "true");
assert.equal(document.querySelectorAll("h1").length, 1);
assert.equal(document.querySelectorAll('[aria-label^="Explore "]').length, 4);
for (const a of document.querySelectorAll('a[href^="#"]')) {
  const id = a.getAttribute("href").slice(1);
  if (id) assert.ok(document.getElementById(id), `Missing anchor ${id}`);
}
document.querySelector('[aria-controls="brief"]').click();
await flush();
const form = document.querySelector("form");
assert.equal(form.checkValidity(), false);
assert.equal(
  form.elements.name.validationMessage,
  messages.en["validation.required"],
);
const fill = (field, value) => {
  field.value = value;
  field.dispatchEvent(new window.Event("input", { bubbles: true }));
};
fill(form.elements.name, "Александр");
fill(form.elements.email, "invalid");
fill(form.elements.type, "nova");
fill(form.elements.budget, "10000-20000");
fill(
  form.elements.message,
  "Интерактивный сайт для нового независимого бренда.",
);
assert.equal(form.checkValidity(), false);
assert.equal(
  form.elements.email.validationMessage,
  messages.en["validation.email"],
);
await change("ru");
assert.equal(document.documentElement.lang, "ru");
assert.match(document.title, /Независимая/);
assert.match(
  document.querySelector('meta[name="description"]').content,
  /независимая/,
);
assert.equal(
  document.querySelector('meta[property="og:locale"]').content,
  "ru_RU",
);
assert.match(document.querySelector("h1").textContent, /Айдентика/);
assert.equal(ru().getAttribute("aria-pressed"), "true");
assert.equal(window.localStorage.getItem(LANGUAGE_KEY), "ru");
assert.equal(
  new URL(window.location.href).searchParams.get("campaign"),
  "launch",
);
assert.equal(window.location.hash, "#work");
assert.equal(new URL(window.location.href).searchParams.get("lang"), "ru");
assert.equal(document.querySelector("form"), form, "Form stays mounted");
assert.equal(form.elements.name.value, "Александр");
assert.equal(form.elements.type.value, "nova");
assert.equal(form.elements.budget.value, "10000-20000");
assert.match(form.elements.type.selectedOptions[0].textContent, /Креативная/);
assert.equal(
  form.elements.email.validationMessage,
  messages.ru["validation.email"],
);
fill(form.elements.email, "alex@example.com");
assert.equal(form.checkValidity(), true);
form.dispatchEvent(
  new window.Event("submit", { bubbles: true, cancelable: true }),
);
await flush();
assert.match(
  form.querySelector('[role="status"]').textContent,
  /данные не отправлены/,
);
await change("en");
assert.match(
  form.querySelector('[role="status"]').textContent,
  /nothing has been sent or stored/,
);
assert.equal(form.elements.type.value, "nova");
const menu = document.querySelector('[aria-controls="mobile-menu"]');
menu.click();
await flush();
await change("ru");
assert.equal(menu.getAttribute("aria-expanded"), "true");
assert.match(document.querySelector("#mobile-menu").textContent, /Работы/);
assert.match(menu.getAttribute("aria-label"), /Закрыть/);
const links = [...document.querySelectorAll("#mobile-menu a")];
links.at(-1).focus();
document.dispatchEvent(
  new window.KeyboardEvent("keydown", {
    key: "Tab",
    bubbles: true,
    cancelable: true,
  }),
);
assert.equal(document.activeElement, menu);
document.dispatchEvent(
  new window.KeyboardEvent("keydown", {
    key: "Tab",
    bubbles: true,
    cancelable: true,
  }),
);
assert.equal(
  document.activeElement,
  en(),
  "Language control is part of mobile focus cycle",
);
document.dispatchEvent(
  new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
);
await flush();
assert.equal(menu.getAttribute("aria-expanded"), "false");
const service = document.querySelector('[aria-controls="service-2"]');
service.click();
await flush();
assert.equal(document.getElementById("service-2").hidden, false);
assert.match(service.textContent, /Креативная/);
document.querySelector('[aria-label^="Открыть AETHER"]').click();
await flush();
const dialog = document.querySelector("dialog");
assert.ok(dialog.hasAttribute("open"));
assert.match(dialog.textContent, /За пределами привычного/);
assert.match(dialog.textContent, /Стратегия бренда/);
document.querySelector('[aria-label="Закрыть проект"]').click();
await flush();
assert.equal(document.querySelector("dialog"), null);
renderer.unmount();
await flush();
h("/?campaign=reload");
renderer = createRoot(document.getElementById("root"));
renderer.render(
  React.createElement(LanguageProvider, null, React.createElement(App)),
);
await flush();
assert.equal(
  document.documentElement.lang,
  "ru",
  "Stored selection survives remount",
);
renderer.unmount();
await flush();
const getItem = window.Storage.prototype.getItem;
const setItem = window.Storage.prototype.setItem;
window.Storage.prototype.getItem = () => {
  throw new Error("Storage blocked");
};
window.Storage.prototype.setItem = () => {
  throw new Error("Storage blocked");
};
Object.defineProperty(window.navigator, "languages", {
  value: ["en-US"],
  configurable: true,
});
assert.equal(getInitialLanguage(), "en");
renderer = createRoot(document.getElementById("root"));
renderer.render(
  React.createElement(LanguageProvider, null, React.createElement(App)),
);
await flush();
await change("ru");
assert.equal(
  document.documentElement.lang,
  "ru",
  "Switch works with blocked storage",
);
renderer.unmount();
window.Storage.prototype.getItem = getItem;
window.Storage.prototype.setItem = setItem;
console.log(
  "PASS: EN/RU dictionary parity, URL/storage/browser priority, unsupported locales, translated metadata/content/case modal/validation, state-preserving form switch, accessible language controls, mobile focus/Escape, reload persistence, blocked storage. 3D and browser layout not tested.",
);
process.exit(0);
