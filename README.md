# MONO® Digital Studio

An independent agency concept built with React 19, Vite, JavaScript and CSS Modules. Includes GSAP / ScrollTrigger, Lenis, Three.js, React Three Fiber, Drei and Lucide.

## Development

Requires Node.js 20.19+ (or 22.12+).

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Structure

- `src/App.jsx`: page composition, navigation and animation lifecycle
- `src/components/`: magnetic button, project dialog, enquiry form and lazy-loaded 3D scene
- `src/data.js`: editable project and service content
- `src/App.module.css`: responsive component styles and design tokens in `global.css`
- `public/art/`: original lightweight SVG project artwork

## Interaction and accessibility

Native modal dialogs support Escape, focus containment and focus restoration. Mobile navigation supports Escape and keyboard focus cycling. Service rows work by click, keyboard or desktop hover. Form fields use native validation and announce a demo-only result; no information is transmitted or stored. All four portfolio projects and the studio are fictional concepts; social profiles and operational email are intentionally not invented.

Reduced-motion preferences disable scrolling and reveal animation, continuous 3D rendering, marquee motion and decorative rotation. Mobile uses a lower-resolution 3D mesh and pixel ratio. The canvas pauses continuous rendering outside the hero viewport. WebGL errors have a static fallback. System font fallbacks preserve readability if Google Fonts is unavailable.

## Hosting

The Vite output is `dist/`. It can be hosted on any static web host. `.openai/hosting.json` associates the source with its private Sites deployment.

## Verification

`npm run build` validates the production bundle. The responsive stylesheet covers 320, 375, 768, 1024, 1440 and 1920px layouts. Browser-based visual and interaction QA requires the shared cloud browser tool; this session did not expose `cua_repl.js`, so those checks are not claimed as completed.

DOM-level checks also passed for all internal anchors, a single H1, four portfolio entries, mobile menu opening and Escape handling, service expansion, required fields, invalid email rejection and the demo-only form confirmation. These checks used JSDOM with the 3D scene stubbed, and do not replace visual browser QA.
