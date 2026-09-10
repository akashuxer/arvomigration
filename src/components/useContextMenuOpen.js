import { useCallback, useId, useRef } from 'react'

/* Reveals one ArvoContextMenu panel while it is open.
 *
 * Arvo styles the panel `display: none` and reveals it with an `.open` class,
 * but the ContextMenu surface never adds that class in this build -- it runs
 * the enter/exit transition and nothing else, so the menu mounts, animates and
 * tears down entirely invisibly.
 *
 * The first workaround toggled one class on the document element, which was
 * wrong as soon as a second menu existed: the rule matched every panel on the
 * page, so opening the chart's menu also revealed the pivot's, and whichever
 * came first in the DOM was the one you saw.
 *
 * This tags each menu with an id of its own and toggles the class on that
 * panel alone. The panel is portaled and is not in the DOM on the frame the
 * open is reported, so the lookup waits a frame.
 *
 * Remove all of this once ContextMenu sets `.open` itself.
 */
export default function useContextMenuOpen(onPick) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const className = `ctx-${id}`
  const pickRef = useRef(onPick)
  pickRef.current = onPick

  const onOpenChange = useCallback(
    (isOpen) => {
      const apply = () => {
        const panel = document.querySelector(`.arvo-context-menu.${className}`)
        if (!panel) return
        panel.classList.toggle('is-open', isOpen)

        /* Selection is handled here too, for the same reason visibility is.
         *
         * Neither `onSelect` on the menu nor `onSelect` on an item is ever
         * called in this build -- the row activates and the menu closes, and
         * no callback runs. Reading the activated row out of the DOM is the
         * only path that works, so the flat row index reported by the panel is
         * mapped back to the item list the menu was given.
         *
         * Remove this once ContextMenu calls its own onSelect. */
        if (!isOpen || panel.dataset.pickBound) return
        panel.dataset.pickBound = '1'
        panel.addEventListener('click', (event) => {
          const row = event.target.closest?.('[role="menuitem"]')
          if (!row || !panel.contains(row)) return
          const rows = [...panel.querySelectorAll('[role="menuitem"]')]
          pickRef.current?.(rows.indexOf(row), row.innerText.trim())
        })
      }
      if (isOpen) requestAnimationFrame(apply)
      else apply()
    },
    [className],
  )

  return { className, onOpenChange }
}
