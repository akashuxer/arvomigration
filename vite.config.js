import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const arvo = path.resolve(rootDir, 'vendor/arvo')

/* The @arvo packages are vendored into `vendor/arvo` and resolved by alias.
 *
 * They were aliased to a checkout outside the project, which worked on the
 * machine that had it and nowhere else -- CI cloned the repo and failed on six
 * unloadable imports. Vendoring makes the build self-contained. The copy is
 * trimmed: no source maps, and no CJK Noto faces (60MB+ of fallback this app
 * never renders), which takes 83MB down to 12MB.
 *
 * They are aliases rather than npm dependencies because the design-system path
 * contains spaces, which npm writes verbatim into a `file:` symlink and breaks.
 * Refresh the copy with `npm run vendor:arvo`.
 */
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
      // Imported by @arvo/react itself, not by this app.
      { find: '@arvo/core', replacement: path.join(arvo, 'core/dist/index.js') },
      { find: '@arvo/utils', replacement: path.join(arvo, 'utils/dist/index.js') },
    ],
  },
})
