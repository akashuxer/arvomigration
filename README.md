# Spend Domain Analysis

A prototype planning workspace built on the Arvo (o9) Design System: a filter bar
with favorites, two report views (chart + pivot), a right-hand launchbar with
Workflows / User Settings / Help panels, notifications, sharing, and a compose
flow.

## Arvo dependency

`@arvo/*` is not installed from a registry. A trimmed copy of the design
system's build lives in `vendor/arvo` and Vite resolves the packages there by
alias, so the build is self-contained and works in CI.

Refresh that copy from a local Arvo checkout with:

```bash
npm run vendor:arvo                      # default path
npm run vendor:arvo -- /path/to/packages # or point it somewhere
```

The copy leaves out source maps and the CJK Noto faces (60MB+ of fallback this
app never renders), taking 83MB down to ~15MB. `tools/vendor-arvo.mjs` also
strips the matching `@font-face` rules so nothing requests a font that is not
there.

Aliases are used rather than npm dependencies because the design-system path
contains spaces, which npm writes verbatim into a `file:` symlink and breaks.

## Running

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

## Keyboard

| Key | Action |
| --- | --- |
| `J` | Switch between the v1 and v2 layouts |
| `Shift + F` | Focus mode (hides both rails) |
| `Shift + D` | Dark mode |
| `Shift + ~` | Reset every saved preference and reload |
| `⌘ / Ctrl + Enter` | Post from the compose window |

## Persistence

Everything done in a session — favorites, workflows, notifications, report
settings, the open panel, the active view — is stored in `localStorage` under
the `sda.v1.*` namespace (`src/usePersistentState.js`). `Shift + ~` clears that
namespace and nothing else.

## Design-system workarounds

`src/keepOverlayPlacement.js` patches two defects in the pinned Arvo build, both
affecting every overlay in the app:

1. **Option panels never become visible.** `.arvo-opt-list` is `display: none`
   until an `.open` class that this build never adds, so every Select /
   MultiSelect / Combobox dropdown mounts, positions and fills itself while
   painting nothing.
2. **A closing overlay loses its placement.** Placement is an inline CSS
   `translate`; the engine clears it at close while the element is still
   mounted for its 150ms exit, so popovers jumped to the top-left corner and
   faded out from there.

Other component-level workarounds are commented where they occur:
`ArvoSelect.onChange` passing the option object rather than its value,
`ArvoWindow` re-applying initial focus on every render (which made text fields
impossible to type in), `ArvoActionMenu` ignoring per-item `onSelect`, and
`actionsVisibility: 'hover'` not applying its own class.

Each one should be fixed upstream in `@arvo/react`; the shims are marked so they
can be deleted when that happens.
