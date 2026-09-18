import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Design-system CSS stack. Order is load-bearing: tokens define every --arvo-*
// custom property, assets register the o9con icon font and o9 Sans faces, and
// component styles consume both. Mirrors packages' own bootstrap in
// apps/arvo-js-playground/src/main.ts.
import '@arvo/tokens/css'
import '@arvo/assets/o9con/css'
// The illustration font is a separate entry point from the icon font. Without
// it every ArvoEmptyState renders its text with a blank space where the
// illustration should be -- the glyph resolves to nothing, silently.
import '@arvo/assets/o9illus/css'
import '@arvo/assets/fonts/css'
import '@arvo/styles/css'

import './App.css'
import App from './App.jsx'
import keepOverlayPlacement from './keepOverlayPlacement'

// Overlay surfaces lose their inline placement one frame before their exit
// transition runs, which throws every closing popover to the top-left corner.
// Installed once, for the whole document, rather than per component.
keepOverlayPlacement()

/* Publish the nova gradient's two stops as CSS variables.
 *
 * `$arvo-global-nova-start` and `$arvo-global-nova-end` are SCSS -- they
 * compile away, and the only CSS-visible form is
 * `--arvo-color-s-nova-static`, which bakes them into a fixed 61deg gradient.
 * Anything that needs the stops on their own (a gradient at a moving angle, a
 * conic ring, a glow) would otherwise hardcode the hexes and drift the day the
 * token changes. Reading them back out of the token keeps one source.
 */
/* KPI indicator colours, published as custom properties.
 *
 * The deltas, meters and outcome strips are data marks, so the palette rules put
 * them on ArvoVisualPalette rather than on Arvo's semantic t-positive /
 * t-negative / t-warning, which are for interface feedback. They are applied in
 * CSS, and viz.js is JavaScript, so the roles are bridged here rather than
 * having App.css restate four hexes that would then drift from the palette. */
import { INDICATOR } from './viz'

Object.entries(INDICATOR).forEach(([role, color]) => {
  document.documentElement.style.setProperty(`--viz-${role}`, color)
})

const novaStops = getComputedStyle(document.documentElement)
  .getPropertyValue('--arvo-color-s-nova-static')
  .match(/#[0-9a-f]{3,8}/gi)

if (novaStops?.length >= 2) {
  document.documentElement.style.setProperty('--nova-start', novaStops[0])
  document.documentElement.style.setProperty('--nova-end', novaStops.at(-1))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
