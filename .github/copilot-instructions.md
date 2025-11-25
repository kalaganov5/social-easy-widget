# Social Easy Widget – AI Guide
## Architecture & Entry Points
- Widget logic lives in `main.js` as the `<net-easy-widget>` custom element; it auto-injects itself once imported.
- Runtime config is passed via the loader script tag `<script id="net-easy-widget" data-new="...">` (see `index.html` and `example.html`).
- `#scriptData` expects single-quoted JSON; it is normalized via `.replace(/'/g, '"')`, so keep keys consistent with the README contract.
- Shadow DOM is enabled in the constructor; all DOM mutations must go through `this.shadowRoot` except analytics/logging.
## Styling Workflow
- Author styles in `style.scss`; the production widget imports the minified string exported from `assets.js`.
- Update workflow: recompile SCSS into a single-line template literal (e.g., `sass --style=compressed style.scss assets.css` then paste) and keep the string ASCII-only.
- `injectStyles()` strips whitespace (`.replace(/^\s+|\n/gm, '')`); avoid selectors relying on formatting.
## Behavior & Analytics
- `createWidgetContent()` derives social-specific assets from `#getSocialData()`; extend that map when adding a platform.
- CTA text defaults use the localized strings defined near the top; keep lengths ~20–25 chars to preserve layout.
- `#sendAnalytics` pushes events such as `iec_show`, `iec_click`, and `iec_init_<social>`; preserve these names for GTM dashboards.
- Guard any new analytics against missing `window.dataLayer` (current file initializes an empty array; follow that pattern).
## Configuration Details
- Supported social keys and brand colors live in `#getSocialData()`; each entry defines `link`, `backgroundIconColor`, `brandColor`, and SVG symbol id.
- CTA background color, call-to-action text, offer text, delay, and animation toggle come from the config object (see README snippet).
- `delay` is interpreted as seconds before the widget fades in; keep values numeric strings because dataset attributes are parsed via `JSON.parse` after quote normalization.
- `isAnimationDisabled` is coerced with `Boolean(...)`; pass explicit `true/false` strings to avoid unexpected truthy values.
## Asset Loading
- Inline `<svg>` sprite inside `createWidgetContent` supplies icons; add new paths there (or mirror icons in `/icons`) but remember Shadow DOM isolates styles.
- The social icon pulses via a runtime-generated `@keyframes pulse-custom` that reuses the entry's `brandColor`; new animations must be injected the same way to stay scoped.
## Build & Local Dev
- Install deps with `npm install`; main scripts: `npm run dev` (Vite dev server), `npm run build` (outputs `dist/main.js` ES module), `npm run preview`.
- `vite.config.js` forces Rollup to emit `main.js` into `/dist` with `format: 'es'`; do not rename the entry because consumers import `/main.js` directly.
- When testing embed flows, open `index.html` or `example.html` through `npm run dev` to avoid CORS issues with module scripts.
## Integration Notes
- Consumers embed the built file via a deferred `<script type="module" id="net-easy-widget" data-new="...">` pointing to the hosted `main.js`; the widget then creates `<net-easy-widget>` and appends it to `document.body`.
- Lazy-load scenarios (see `example.html`) attach the script tag on scroll/click; remove listeners after insertion to prevent duplicates.
- For SSR or environments without `document`, guard widget creation; current code assumes browser globals.
## Contribution Tips
- Keep code ES-module friendly (`"type": "module"` in `package.json`); prefer `import`/`export` over CommonJS.
- Favor plain DOM APIs and avoid adding heavy dependencies—the widget is intended for third-party embedding.
