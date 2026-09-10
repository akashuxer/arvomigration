import { useEffect } from 'react'

const SELECTED = 'pivot__cell--selected'

/* Excel-style cell selection for a pivot table: click to select, arrow keys to
 * move, Escape to clear.
 *
 * Wired by delegation on the table rather than by adding props to every cell:
 * both pivots render their own markup, and this way neither has to change to
 * gain the behaviour, nor to keep it in step.
 *
 * The ring is driven by an explicit class, not by :focus. Native focus was the
 * first attempt and it is the wrong tool here: :focus stops matching the moment
 * the document loses focus, so switching to another window would clear the
 * selection. A spreadsheet keeps showing you which cell you are on. The class
 * survives that, and it is also what lets the ring persist while focus moves
 * into a context menu opened on the cell.
 *
 * The cell is still focused as well, so keyboard users land on it and screen
 * readers announce it -- the class is the appearance, focus is the semantics. */
export default function usePivotCellFocus(tableRef) {
  useEffect(() => {
    const table = tableRef.current
    if (!table) return

    const clear = () => {
      table.querySelectorAll(`.${SELECTED}`).forEach((cell) => {
        cell.classList.remove(SELECTED)
      })
    }

    const select = (cell) => {
      if (!cell) return
      clear()
      cell.classList.add(SELECTED)
      // tabIndex is set as the cell is selected rather than on every cell up
      // front, so the table never adds hundreds of stops to the tab order.
      cell.tabIndex = -1
      cell.focus()
    }

    // pointerdown, not click, so a right-click selects the cell before the
    // context menu opens on it: the menu should act on the cell you just marked.
    const onPointerDown = (event) => {
      const cell = event.target.closest('td, th')
      if (!cell || !table.contains(cell)) return
      select(cell)
    }

    const onKeyDown = (event) => {
      const current = table.querySelector(`.${SELECTED}`)
      if (!current) return

      if (event.key === 'Escape') {
        clear()
        current.blur()
        return
      }

      const row = current.parentElement
      const column = [...row.children].indexOf(current)

      // Walk rows through the table rather than the row's parent: thead and
      // tbody are separate sections, so a plain sibling walk would stop dead at
      // the boundary between the header and the first data row.
      const rows = [...table.rows]
      const rowIndex = rows.indexOf(row)

      const target = {
        ArrowLeft: () => row.children[column - 1],
        ArrowRight: () => row.children[column + 1],
        ArrowUp: () => rows[rowIndex - 1]?.children[column],
        ArrowDown: () => rows[rowIndex + 1]?.children[column],
      }[event.key]

      if (!target) return

      const next = target()
      if (!next) return

      // Only once a move is certain: otherwise Escape and unrelated keys would
      // suppress the browser's own scrolling.
      event.preventDefault()
      select(next)
      next.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }

    table.addEventListener('pointerdown', onPointerDown)
    table.addEventListener('keydown', onKeyDown)
    return () => {
      table.removeEventListener('pointerdown', onPointerDown)
      table.removeEventListener('keydown', onKeyDown)
    }
  }, [tableRef])
}
