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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
