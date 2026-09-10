/* Refresh vendor/arvo from a local Arvo Design System checkout.
 *
 * The app resolves @arvo/* by alias into vendor/arvo so the build is
 * self-contained -- CI has no copy of the design system, and aliasing a path
 * outside the repo failed there with six unloadable imports.
 *
 * What is deliberately left out:
 *   - source maps, which are for debugging the library, not running it
 *   - the CJK Noto faces (JP/KR/SC/TC), 60MB+ of fallback this app never
 *     renders. Their @font-face rules are stripped from the copied fonts.css
 *     too, so nothing points at a file that is not here.
 *
 * Usage:  npm run vendor:arvo [-- /path/to/Arvo Design System/packages]
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dest = path.join(root, 'vendor/arvo')

const src =
  process.argv[2] ??
  path.resolve(root, '../../Desktop/Paranomic Filter/Arvo Design System/packages')

if (!existsSync(src)) {
  console.error(`No Arvo checkout at:\n  ${src}\nPass the path as an argument.`)
  process.exit(1)
}

const copy = async (from, to) => {
  await mkdir(path.dirname(path.join(dest, to)), { recursive: true })
  await cp(path.join(src, from), path.join(dest, to), { recursive: true })
}

await rm(dest, { recursive: true, force: true })

await copy('tokens/dist/arvo-tokens.css', 'tokens/dist/arvo-tokens.css')
await copy('styles/dist/arvo.css', 'styles/dist/arvo.css')
await copy('assets/o9con/css', 'assets/o9con/css')
await copy('assets/o9con/fonts', 'assets/o9con/fonts')
await copy('assets/o9illus', 'assets/o9illus')
await copy('assets/fonts/fonts.css', 'assets/fonts/fonts.css')
for (const family of ['o9Sans', 'Helvetica', 'Roboto']) {
  await copy(`assets/fonts/${family}`, `assets/fonts/${family}`)
}

// Latin Noto only.
await mkdir(path.join(dest, 'assets/fonts/NotoSans'), { recursive: true })
const notoFiles = await readdir(path.join(src, 'assets/fonts/NotoSans'))
for (const file of notoFiles.filter((f) => /^NotoSans-.*\.ttf$/.test(f))) {
  await copy(`assets/fonts/NotoSans/${file}`, `assets/fonts/NotoSans/${file}`)
}

await copy('react/dist', 'react/dist')
/* @arvo/react imports @arvo/core and @arvo/utils as bare specifiers. Inside the
 * design-system monorepo those resolved through its own node_modules; from
 * vendor/ they resolve through the aliases in vite.config.js, so both builds
 * have to come along. */
await copy('core/dist', 'core/dist')
await copy('utils/dist', 'utils/dist')

// Strip source maps.
let maps = 0
const stripMaps = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await stripMaps(full)
    else if (entry.name.endsWith('.map')) {
      await rm(full)
      maps += 1
    }
  }
}
for (const pkg of ['react/dist', 'core/dist', 'utils/dist']) {
  await stripMaps(path.join(dest, pkg))
}

// Strip the @font-face rules whose files were not copied.
const fontsPath = path.join(dest, 'assets/fonts/fonts.css')
const original = await readFile(fontsPath, 'utf8')
const kept = original.replace(/@font-face\s*\{[^}]*\}/g, (block) =>
  /NotoSans(JP|KR|SC|TC)/.test(block) ? '' : block,
)
const header =
  '/* Vendored from @arvo/assets by tools/vendor-arvo.mjs.\n' +
  ' * CJK @font-face rules are removed because their files are not vendored.\n' +
  ' * Do not edit here -- re-run `npm run vendor:arvo`. */\n'
await writeFile(fontsPath, header + kept.replace(/\n{3,}/g, '\n\n'))

const dropped =
  (original.match(/@font-face/g)?.length ?? 0) - (kept.match(/@font-face/g)?.length ?? 0)
console.log(`vendored ${src}\n  source maps removed: ${maps}\n  CJK font-face rules removed: ${dropped}`)
