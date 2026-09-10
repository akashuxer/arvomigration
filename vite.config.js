import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const arvo = path.resolve(
  rootDir,
  '../../Desktop/Paranomic Filter/Arvo Design System/packages',
)

// The @arvo packages are resolved by alias rather than as npm dependencies.
// npm writes a `file:` spec into the symlink verbatim, and the design-system
// path contains spaces, so every install produced a broken link (escaping and
// percent-encoding both fail). Aliases take plain filesystem paths, so spaces
// are handled correctly. Subpaths mirror each package's own exports map.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@arvo/tokens/css', replacement: path.join(arvo, 'tokens/dist/arvo-tokens.css') },
      { find: '@arvo/assets/o9con/css', replacement: path.join(arvo, 'assets/o9con/css/o9con.css') },
      { find: '@arvo/assets/fonts/css', replacement: path.join(arvo, 'assets/fonts/fonts.css') },
      // The illustration font ships as its own entry point; without it every
      // EmptyState glyph resolves to nothing.
      { find: '@arvo/assets/o9illus/css', replacement: path.join(arvo, 'assets/o9illus/o9illus.css') },
      { find: '@arvo/styles/css', replacement: path.join(arvo, 'styles/dist/arvo.css') },
      { find: '@arvo/react', replacement: path.join(arvo, 'react/dist/index.js') },
    ],
  },
  server: {
    fs: {
      // The design system lives outside this project root, so Vite's strict file
      // serving would otherwise block the o9con font files the icon CSS requests.
      allow: [rootDir, arvo],
    },
  },
})
