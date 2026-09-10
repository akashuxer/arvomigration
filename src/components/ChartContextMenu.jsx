import { useEffect, useRef } from 'react'
import { ArvoContextMenu } from '@arvo/react'
import useContextMenuOpen from './useContextMenuOpen'

/* Right-click menu for a report chart, shared by every chart in the app.
 *
 * The same arrangement as PivotContextMenu: the browser's own menu is blocked
 * across the whole plot, and Arvo's open state is mirrored onto the document
 * element because this build's ContextMenu never sets the `.open` class its own
 * stylesheet needs. See PivotContextMenu for the detail. */

const CHART_TYPES = [
  { id: 'line', label: 'Line', icon: 'line-chart' },
  { id: 'column', label: 'Bar', icon: 'bar-chart' },
  { id: 'area', label: 'Area', icon: 'area-chart' },
]

/* Which series was right-clicked.
 *
 * Highcharts tags each series group `highcharts-series-N`, so the index comes
 * off the nearest such ancestor. Returns null on the plot background, where no
 * particular series is implied. */
function seriesIndexOf(invoker) {
  const group = invoker.closest?.('[class*="highcharts-series-"]')
  const match =
    group && String(group.getAttribute('class') || '').match(/highcharts-series-(\d+)/)
  return match ? Number(match[1]) : null
}

export default function ChartContextMenu({ targetRef, seriesNames = [], onChartType }) {
  // Which series the menu was opened on. Read by the selection handler, which
  // has no access to the menu's own context.
  const seriesIndex = useRef(null)

  /* Blocks the browser's own menu, and records which series was right-clicked.
   *
   * The index is taken straight off the event rather than from Arvo's
   * `resolveContext`, which is not invoked in this build -- the menu opened
   * with no context, so every selection resolved to "no series" and did
   * nothing. This listener runs before the menu opens, so the index is always
   * ready by the time a row is picked. */
  useEffect(() => {
    const chart = targetRef.current
    if (!chart) return
    const onContextMenu = (event) => {
      event.preventDefault()
      seriesIndex.current = seriesIndexOf(event.target)
    }
    chart.addEventListener('contextmenu', onContextMenu)
    return () => chart.removeEventListener('contextmenu', onContextMenu)
  }, [targetRef])

  const { className, onOpenChange } = useContextMenuOpen((_, label) => {
    const type = CHART_TYPES.find(({ label: name }) => name === label)
    if (type) onChartType?.(seriesIndex.current, type.id)
  })

  /* Chart types are a labelled group, not a submenu.
   *
   * A `submenu` renders its chevron here but never opens -- not on hover, not
   * on click, not on ArrowRight -- the same defect that affects ArvoActionMenu.
   * A group reaches the same three options in one fewer interaction and, unlike
   * a chevron that leads nowhere, it works.
   *
   * The first group is labelled with the series you clicked, so the actions
   * read as applying to that series rather than to the chart at large. A
   * right-click on the plot background leaves it unlabelled rather than
   * claiming a series that was never chosen. */
  const buildItems = ({ index }) => [
    {
      id: 'chart-type',
      label: index != null ? `${seriesNames[index] ?? ''} · Chart type`.trim() : 'Chart type',
      items: CHART_TYPES,
    },
    {
      id: 'actions',
      items: [
        { id: 'comment', label: 'Add comment', icon: 'comment-empty' },
        { id: 'member', label: 'Member details', icon: 'file-text-o' },
      ],
    },
  ]

  return (
    <ArvoContextMenu
      targetRef={targetRef}
      resolveContext={(invoker) => ({ index: seriesIndexOf(invoker) })}
      items={buildItems}
      className={className}
      onOpenChange={onOpenChange}
      ariaLabel="Chart actions"
    />
  )
}
