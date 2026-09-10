/* Two workarounds for the same family of overlay defects in this Arvo build.
 *
 * ---------------------------------------------------------------------------
 * 1. Option panels never become visible.
 *
 * `.arvo-opt-list` is `display: none` in the stylesheet and is revealed by an
 * `.open` class that this build never adds -- so every Select, MultiSelect and
 * Combobox dropdown mounts, gets positioned (`translate: 492px 455px`), fills
 * itself with options, and paints nothing. The options are in the DOM, which is
 * why they can be found and even clicked programmatically, while a person sees
 * a control that does not respond. The popover surface adds `.open` for itself;
 * the option list does not.
 *
 * The panel is only in the DOM while it is open -- it is removed on close, not
 * hidden -- so adding the class as it mounts is safe and needs no teardown.
 *
 * ---------------------------------------------------------------------------
 * 2. Keeps a closing overlay where it was.
 *
 * The bug, exactly:
 *
 * Arvo positions an overlay surface with the CSS `translate` property, set
 * inline by the positioning engine -- the panel itself is `position: absolute;
 * top: 0; left: 0`, so that one declaration is the entire placement. Opening
 * the notifications popover produces
 *
 *   style="--arvo-popover-width: 380px; z-index: 1000; translate: 989px 48px"
 *
 * On close, the engine tears the positioner down and wipes that inline
 * `translate` -- but the element stays mounted for the 150ms exit transition it
 * just armed:
 *
 *   style="--arvo-popover-width: 380px; z-index: 1000; transition-duration: 150ms"
 *
 * With the translate gone and `top/left: 0` underneath it, the panel snaps to
 * the document's top-left corner and fades out from there. That is the jump to
 * the corner: not an animation glitch, a placement that is discarded one frame
 * before the animation that needed it. It affects every popover on the page --
 * notifications, favorites, share -- because the behaviour lives in the shared
 * overlay surface rather than in any one component.
 *
 * The fix, until the engine holds its placement until the exit finishes: watch
 * for the moment `translate` is cleared from a surface that is still in the
 * document, and put the last known value back. The observer sees its own write,
 * finds a non-empty translate, records it and stops -- so this settles in one
 * extra mutation rather than looping. Re-opening overwrites it with a freshly
 * measured position, so a stale value can never outlive one frame of the next
 * open.
 */

/* Every surface the engine places this way. Menus are included because they
 * share the same positioning path, so the same teardown would move them too. */
const OPTION_PANEL = '.arvo-opt-list'

const SURFACES = [
  '.arvo-popover',
  '.arvo-action-menu',
  '.arvo-context-menu',
  '.arvo-menu',
].join(',')

export default function keepOverlayPlacement() {
  // Keyed by element, so an unmounted surface's last position is collected with
  // it rather than accumulating for the life of the page.
  const lastPlacement = new WeakMap()

  const sync = (el) => {
    const translate = el.style.translate
    if (translate) {
      lastPlacement.set(el, translate)
      return
    }
    const remembered = lastPlacement.get(el)
    // Only while it is still on screen: once the surface is unmounted there is
    // nothing to hold in place, and re-applying would be pointless work.
    if (remembered && el.isConnected) el.style.translate = remembered
  }

  // Reveals an option panel the frame it appears.
  const reveal = (node) => {
    if (node.nodeType !== 1) return
    if (node.matches?.(OPTION_PANEL)) node.classList.add('open')
    node.querySelectorAll?.(OPTION_PANEL).forEach((panel) => panel.classList.add('open'))
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'childList') {
        record.addedNodes.forEach(reveal)
        continue
      }
      const el = record.target
      if (el.nodeType !== 1 || !el.matches?.(SURFACES)) continue
      sync(el)
    }
  })

  // Anything already mounted when this installs.
  document.querySelectorAll(OPTION_PANEL).forEach((panel) => panel.classList.add('open'))

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style'],
  })

  return () => observer.disconnect()
}
