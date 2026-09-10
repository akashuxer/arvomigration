import { useEffect } from 'react'
import { ArvoContextMenu } from '@arvo/react'
import useContextMenuOpen from './useContextMenuOpen'

/* Right-click menus for a pivot, shared by every pivot in the app so the same
 * gesture offers the same actions wherever the grid appears.
 *
 * One menu, not two: a single ArvoContextMenu resolves whether the invoker was
 * a header or a body cell and returns the matching items. Mounting two menus on
 * the same table would leave both listening for the same contextmenu event. */

const CELL_ACTIONS = [
  { id: 'copy', label: 'Copy', icon: 'copy' },
  { id: 'copy-header', label: 'Copy With Header', icon: 'files-copy' },
  { id: 'paste', label: 'Paste', icon: 'paste' },
  { id: 'lock', label: 'Lock', icon: 'lock' },
  {
    id: 'respread',
    label: 'Re-spread',
    icon: 'respread',
    submenu: [
      { id: 'respread-proportional', label: 'Proportional' },
      { id: 'respread-equal', label: 'Equal' },
      { id: 'respread-copy', label: 'Copy value' },
    ],
  },
  {
    id: 'filter',
    label: 'Filter',
    icon: 'filter',
    submenu: [
      { id: 'filter-value', label: 'Filter by value' },
      { id: 'filter-selection', label: 'Filter by selection' },
      { id: 'filter-clear', label: 'Clear filter' },
    ],
  },
]

const HEADER_ACTIONS = [
  { id: 'sort-asc', label: 'Sort ascending', icon: 'sort-amount-asc' },
  { id: 'sort-desc', label: 'Sort descending', icon: 'sort-amount-desc' },
  { id: 'filter', label: 'Filter column', icon: 'filter' },
  { id: 'freeze', label: 'Freeze up to column', icon: 'lock' },
  { id: 'hide', label: 'Hide column', icon: 'eye-slash' },
]

export default function PivotContextMenu({ targetRef }) {
  /* The browser's own menu is suppressed across the whole table, not just on
   * cells: right-clicking a gap between cells otherwise produced the native
   * menu, so the gesture behaved differently depending on the exact pixel. */
  useEffect(() => {
    const table = targetRef.current
    if (!table) return
    const block = (event) => event.preventDefault()
    table.addEventListener('contextmenu', block)
    return () => table.removeEventListener('contextmenu', block)
  }, [targetRef])

  /* Arvo reveals the panel with an `.open` class that this build's ContextMenu
   * never sets, so the menu opened invisibly. Mirroring its open state onto the
   * document element gives App.css something real to key the panel's display
   * off -- keyed to open/closed rather than to the enter transition, which
   * lasts a few hundred milliseconds and then let the menu vanish again. */
  const { className, onOpenChange } = useContextMenuOpen()

  return (
    <ArvoContextMenu
      targetRef={targetRef}
      // Only cells and headers open a menu.
      contextSelector="th, td"
      resolveContext={(invoker) => ({ isHeader: invoker.tagName === 'TH' })}
      items={({ isHeader }) => (isHeader ? HEADER_ACTIONS : CELL_ACTIONS)}
      className={className}
      onOpenChange={onOpenChange}
      ariaLabel="Pivot actions"
    />
  )
}
