/* The report area, while it is being fetched.
 *
 * A skeleton rather than a spinner, and one shaped like the thing it stands in
 * for: the KPI band, a chart tile, a grid. A centred spinner tells you the wait
 * exists; this tells you what is arriving and where it will be, so the layout
 * does not jump when it lands and the eye is already in the right place.
 *
 * It is deliberately vague about content and exact about structure. Row counts
 * and column widths match the real grid, but nothing here is a real number --
 * a skeleton that suggests values people might read is worse than one that
 * plainly cannot be read.
 */

export default function ContentSkeleton({ kpis = 4, rows = 8 }) {
  return (
    <div className="content-area skel" aria-hidden="true">
      {/* The role and the message live on the wrapper, not on the shapes -- a
          screen reader should hear "loading", not forty empty boxes. */}
      <span className="skel__sr" role="status">
        Loading report
      </span>

      <div className="skel__kpis">
        {Array.from({ length: kpis }, (_, i) => (
          <div className="skel__kpi" key={i}>
            <span className="skel__bar skel__bar--label" />
            <span className="skel__bar skel__bar--figure" />
            <span className="skel__bar skel__bar--caption" />
          </div>
        ))}
      </div>

      <div className="skel__tile">
        <span className="skel__bar skel__bar--title" />
        {/* Columns of varied height, so the block reads as a chart rather than
            as a paragraph -- the heights are fixed, not random, because a
            skeleton that reshuffles on every render draws attention to itself. */}
        <div className="skel__chart">
          {[52, 70, 46, 84, 61, 92, 55, 74, 48, 88, 66, 58].map((height, i) => (
            <span className="skel__col" key={i} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      <div className="skel__tile">
        <span className="skel__bar skel__bar--title" />
        <div className="skel__grid">
          {Array.from({ length: rows }, (_, row) => (
            <div className="skel__row" key={row}>
              <span className="skel__cell skel__cell--member" />
              <span className="skel__cell skel__cell--member" />
              <span className="skel__cell skel__cell--wide" />
              <span className="skel__cell" />
              <span className="skel__cell" />
              <span className="skel__cell" />
              <span className="skel__cell" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* The filter bar, while the view it describes is being rebuilt.
 *
 * Same shapes in the same places as the real bar -- funnel, filter set, a run of
 * chips, Apply -- so the row does not change height or reflow when the real one
 * arrives. The chip widths are fixed and uneven rather than equal, because a row
 * of identical blocks reads as a progress bar rather than as filters.
 */
export function FilterBarSkeleton() {
  return (
    <div className="filter-bar skel" aria-hidden="true">
      <span className="skel__bar skel__icon" />
      <span className="filter-divider" />
      <span className="skel__bar skel__set" />
      <span className="skel__chips">
        {[150, 190, 120].map((width) => (
          <span className="skel__bar skel__chip" key={width} style={{ width }} />
        ))}
      </span>
      <span className="skel__bar skel__apply" />
    </div>
  )
}

/* Just the rows of a grid, for when a filter changes which rows there are.
 *
 * Narrower than the page skeleton on purpose: applying a column filter does not
 * rebuild the chart or the KPI band above it, so replacing those would claim
 * more work than is happening. The header stays put too -- it is the thing you
 * just used, and blanking it would take the filter you are still looking at off
 * the screen.
 */
export function PivotRowsSkeleton({ rows = 8, columns = 7 }) {
  return (
    <tbody className="skel skel__tbody" aria-hidden="true">
      {Array.from({ length: rows }, (_, row) => (
        <tr key={row}>
          {Array.from({ length: columns }, (_, col) => (
            <td key={col}>
              <span className="skel__bar skel__tcell" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
