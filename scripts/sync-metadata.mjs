import { readFileSync, writeFileSync } from "node:fs";
import { messages } from "../src/i18n/messages.js";
import { site } from "../src/site.js";
const path = new URL("../index.html", import.meta.url);
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
let html = readFileSync(path, "utf8");
const title = messages.en["seo.title"];
const description = messages.en["seo.description"];
html = html.replace(
  /<title>[\s\S]*?<\/title>/,
  `<title>${escape(title)}</title>`,
);
function tag(attribute, key, value) {
  const line = `<meta ${attribute}="${key}" content="${escape(value)}" />`;
  const regex = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`);
  html = regex.test(html)
    ? html.replace(regex, line)
    : html.replace("</head>", `  ${line}\n  </head>`);
}
for (const [key, value] of Object.entries({
  description,
  "twitter:card": "summary_large_image",
  "twitter:title": title,
  "twitter:description": description,
  "twitter:image": site.origin + site.previewImage,
}))
  tag("name", key, value);
for (const [key, value] of Object.entries({
  "og:title": title,
  "og:description": description,
  "og:type": "website",
  "og:url": site.origin + "/",
  "og:locale": "en_US",
  "og:image": site.origin + site.previewImage,
  "og:image:type": "image/webp",
  "og:image:width": "1400",
  "og:image:height": "1050",
  "og:image:alt": messages.en["seo.imageAlt"],
}))
  tag("property", key, value);
writeFileSync(path, html);
