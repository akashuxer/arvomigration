import { useEffect, useRef } from 'react'
import Highcharts from 'highcharts'
import { ArvoButton, ArvoIconButton } from '@arvo/react'
import { ACTUAL, DIVERGING, SPEND } from '../viz'
import PivotContextMenu from './PivotContextMenu'
import usePivotCellFocus from './usePivotCellFocus'

/* In-cell visualisation, applied by row type so no cell carries two treatments:
 *
 *   Units Actuals  -> data bar behind the number (Excel data bars)
 *   Forecast rows  -> conditional tint by variance against that month's actual
 *   every row      -> a Highcharts sparkline in the trailing Trend column
 */

// Highcharts earns its place on the sparkline; data bars and tints are one CSS
// declaration each, where a chart instance per cell would be absurd overhead.
function Sparkline({ data, color }) {
  const el = useRef(null)

  useEffect(() => {
    const chart = Highcharts.chart(el.current, {
      chart: {
        type: 'area',
        height: 22,
        margin: [2, 0, 2, 0],
        backgroundColor: 'transparent',
        skipClone: true,
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: { enabled: false },
      xAxis: { visible: false },
      yAxis: { visible: false },
      plotOptions: {
        series: {
          animation: false,
          enableMouseTracking: false,
          lineWidth: 1.5,
          marker: { enabled: false },
          fillOpacity: 0.12,
          states: { hover: { enabled: false } },
        },
      },
      series: [{ data, color }],
    })

    return () => chart.destroy()
  }, [data, color])

  return <div className="pivot__spark" ref={el} />
}


// Exported so the scorecard view builds its widgets from the same rows the
// table shows, rather than a second copy of the numbers.
// Matches ContentArea's CURRENT_PERIOD: M06-2019.
const CURRENT_PERIOD = 5

export const MONTHS = [
  'M01-2019', 'M02-2019', 'M03-2019', 'M04-2019', 'M05-2019', 'M06-2019',
  'M07-2019', 'M08-2019', 'M09-2019', 'M10-2019', 'M11-2019', 'M12-2019',
]

export const METRICS = ['Units Actuals', '30d Forecast', '60d Forecast', '90d Forecast']

// Values transcribed from the Consensus Forecast Waterfall screen, in month
// order M01-2019 .. M12-2019. Each customer group carries the four metric rows.
export const CUSTOMERS = [
  {
    id: 'Customer_1',
    values: {
      'Units Actuals': [133, 182, 214, 176, 141, 216, 168, 185, 168, 154, 196, 261],
      '30d Forecast': [158, 185, 159, 200, 166, 159, 168, 172, 119, 182, 179, 206],
      '60d Forecast': [169, 207, 171, 225, 176, 153, 183, 177, 121, 191, 181, 215],
      '90d Forecast': [166, 220, 169, 241, 169, 119, 186, 161, 107, 179, 158, 199],
    },
  },
  {
    id: 'Customer_10',
    values: {
      'Units Actuals': [251, 435, 419, 369, 286, 438, 350, 387, 372, 325, 395, 488],
      '30d Forecast': [326, 398, 313, 398, 349, 338, 343, 374, 253, 394, 355, 346],
      '60d Forecast': [368, 404, 335, 445, 372, 345, 373, 398, 240, 425, 353, 327],
      '90d Forecast': [394, 355, 331, 472, 363, 310, 377, 388, 181, 423, 298, 243],
    },
  },
  {
    id: 'Customer_11',
    values: {
      'Units Actuals': [281, 401, 406, 360, 289, 444, 338, 385, 391, 315, 399, 514],
      '30d Forecast': [350, 375, 288, 388, 331, 352, 351, 364, 290, 362, 425, 403],
      '60d Forecast': [381, 391, 291, 439, 336, 368, 399, 385, 298, 371, 492, 430],
      '90d Forecast': [383, 361, 253, 474, 291, 347, 431, 367, 270, 334, 550, 418],
    },
  },
  {
    id: 'Customer_12',
    values: {
      'Units Actuals': [258, 386, 426, 355, 300, 447, 338, 385, 373, 302, 407, 495],
      '30d Forecast': [320, 341, 304, 358, 367, 366, 322, 385, 267, 323, 350, 391],
      '60d Forecast': [349, 334, 312, 370, 403, 388, 340, 424, 262, 310, 335, 413],
      '90d Forecast': [357, 272, 283, 338, 411, 373, 323, 438, 216, 236, 256, 396],
    },
  },
  {
    id: 'Customer_13',
    values: {
      'Units Actuals': [252, 402, 422, 356, 290, 444, 338, 375, 371, 314, 406, 486],
      '30d Forecast': [301, 351, 304, 357, 347, 374, 330, 341, 275, 387, 390, 335],
      '60d Forecast': [318, 340, 314, 371, 371, 409, 355, 343, 289, 420, 417, 311],
      '90d Forecast': [301, 266, 288, 341, 361, 418, 351, 300, 271, 421, 406, 218],
    },
  },
  {
    id: 'Customer_14',
    values: {
      'Units Actuals': [267, 395, 420, 363, 306, 440, 340, 370, 390, 311, 269, 347],
      '30d Forecast': [318, 362, 297, 371, 358, 361, 336, 352, 281, 375, 371, 358],
      '60d Forecast': [344, 358, 305, 398, 379, 383, 356, 379, 274, 391, 384, 344],
      '90d Forecast': [351, 311, 279, 402, 372, 372, 358, 371, 231, 358, 356, 296],
    },
  },
]

const PRODUCT_LINE = 'PL_10'

// Variance against the same month's actual.
//
// Thresholds come from the data's own distribution rather than being fixed. A
// fixed cutoff cannot work here: at 5% variance 180 of 216 forecast cells
// tripped it, and even at 20% it was still half -- the grid became a red/green
// checkerboard that read worse than plain numbers. Ranking bounds how much
// colour can ever appear: only the worst ~15% is tinted at all and only the
// worst ~4% strongly, whatever the underlying spread turns out to be.
//
// Declared after CUSTOMERS on purpose -- it reads that binding at module load.
const VARIANCES = CUSTOMERS.flatMap((customer) =>
  METRICS.filter((metric) => metric !== 'Units Actuals').flatMap((metric) =>
    customer.values[metric].map((value, i) => {
      const actual = customer.values['Units Actuals'][i]
      return actual ? Math.abs((value - actual) / actual) : 0
    }),
  ),
).sort((a, b) => a - b)

const percentile = (p) => VARIANCES[Math.floor(VARIANCES.length * p)]
const NOTABLE = percentile(0.85)
const SEVERE = percentile(0.96)

function varianceTint(value, actual) {
  if (!actual) return undefined
  const variance = (value - actual) / actual
  const magnitude = Math.abs(variance)
  if (magnitude < NOTABLE) return undefined
  // Two strengths from the diverging viz pair rather than the platform's
  // negative/positive state colours -- a cell that is under plan is data, not
  // an error, and it should not read as one.
  const [notable, severe] = variance < 0 ? DIVERGING.under : DIVERGING.over
  return magnitude < SEVERE ? notable : severe
}

// Exported so v2 can host these controls in the report tile header instead of
// giving the table a third toolbar of its own.
export function PivotToolbar() {
  return (
    <div className="pivot__actions">
      <ArvoButton label="Bulk Edit" variant="tertiary" size="sm" />
      <ArvoButton label="Filters" variant="tertiary" size="sm" />
      <ArvoButton label="Local Edit" variant="tertiary" size="sm" />
      <ArvoIconButton icon="cog" tooltip="Table settings" variant="tertiary" size="sm" />
      <ArvoIconButton icon="plus" tooltip="Add row" variant="tertiary" size="sm" />
      <ArvoIconButton icon="refresh" tooltip="Reset changes" variant="tertiary" size="sm" />
    </div>
  )
}

export default function PivotTable({ hasToolbar = true, isV2 = false }) {
  const tableRef = useRef(null)
  usePivotCellFocus(tableRef)
  const rows = CUSTOMERS.flatMap((customer) =>
    METRICS.map((metric, metricIndex) => ({
      key: `${customer.id}-${metric}`,
      // Attribute labels print once per group, like a collapsed hierarchy.
      customer: metricIndex === 0 ? customer.id : '',
      metric,
      values: customer.values[metric],
      // Each forecast row is scored against its own group's actuals.
      actuals: customer.values['Units Actuals'],
      isActual: metric === 'Units Actuals',
      // Last metric of a customer block -- carries the group separator.
      isGroupEnd: metricIndex === METRICS.length - 1,
    })),
  )

  const peak = Math.max(...rows.flatMap((row) => row.values))

  return (
    <div className="pivot">
      {hasToolbar && (
        <div className="pivot__toolbar">
          <PivotToolbar />
        </div>
      )}

      <div className="pivot__scroll">
        <table className="pivot__table" ref={tableRef}>
          <colgroup>
            <col className="pivot__col--actions" />
            <col className="pivot__col--member" />
            <col className="pivot__col--member" />
            <col className="pivot__col--member" />
            <col span={MONTHS.length} />
            {isV2 && <col className="pivot__col--trend" />}
          </colgroup>

          <thead>
            <tr>
              <th scope="col" className="pivot__cell--center">Actions</th>
              <th scope="col">Product Line</th>
              <th scope="col">Customer Group</th>
              <th scope="col" className="pivot__cell--attr">Data</th>
              {/* Month headers stay left-aligned per the guidelines, while the
                  values beneath them are right-aligned numerics. */}
              {/* The current period is tinted here as well as shaded in the
                  chart above, in the same colour: one fact about the view, so
                  it should not look like two. */}
              {MONTHS.map((month, index) => (
                <th
                  scope="col"
                  key={month}
                  /* Arvo's own currenttime cell class, not one of ours: the
                     design system already defines what "this is now" looks like
                     in a grid, and it carries the specificity to beat the
                     sticky header's background. */
                  className={index === CURRENT_PERIOD ? 'pivot__cell--currenttime' : undefined}
                >
                  {month}
                </th>
              ))}
              {isV2 && <th scope="col">Trend</th>}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.key}
                className={[
                  row.metric === 'Units Actuals' && 'pivot__row--actual',
                  row.isGroupEnd && 'pivot__row--group-end',
                ]
                  .filter(Boolean)
                  .join(' ') || undefined}
              >
                <td className="pivot__cell--center">
                  <span
                    className="o9con o9con-info-circle pivot__info"
                    role="img"
                    aria-label={`Row details for ${row.metric}`}
                  />
                </td>
                <td>{index === 0 ? PRODUCT_LINE : ''}</td>
                <td>{row.customer}</td>
                <td className="pivot__cell--attr">{row.metric}</td>
                {row.values.map((value, i) => {
                  if (!isV2) {
                    return (
                      <td key={MONTHS[i]} className="pivot__cell--num">
                        {value.toLocaleString('en-US')}
                      </td>
                    )
                  }

                  const isBar = row.isActual
                  return (
                    <td
                      key={MONTHS[i]}
                      className={`pivot__cell--num${isBar ? ' pivot__cell--bar' : ''}`}
                      style={
                        isBar
                          ? { '--bar-width': `${Math.round((value / peak) * 100)}%` }
                          : { backgroundColor: varianceTint(value, row.actuals[i]) }
                      }
                    >
                      <span className="pivot__figure">{value.toLocaleString('en-US')}</span>
                    </td>
                  )
                })}
                {isV2 && (
                  <td className="pivot__cell--trend">
                    <Sparkline
                      data={row.values}
                      color={row.isActual ? ACTUAL : SPEND.base}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PivotContextMenu targetRef={tableRef} />
    </div>
  )
}
