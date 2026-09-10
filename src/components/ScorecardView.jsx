import { useEffect, useRef, useState } from 'react'
import Highcharts from 'highcharts'
import { ArvoIconButton } from '@arvo/react'
import { CUSTOMERS, MONTHS } from './PivotTable'

/* Channel Assortments view: six KPIs over a 2x2 of two charts and two pivots.
 *
 * Every figure is derived from the same CUSTOMERS rows the main pivot renders,
 * so the views cannot disagree. Highcharts draws the two charts; the pivots are
 * tables and the KPI bars are rectangles, so neither needs a chart instance. */

const sum = (nums) => nums.reduce((total, n) => total + n, 0)
const byMonth = (metric) =>
  MONTHS.map((_, i) => sum(CUSTOMERS.map((c) => c.values[metric][i])))

const ACTUALS = byMonth('Units Actuals')
const F30 = byMonth('30d Forecast')
const F60 = byMonth('60d Forecast')
const F90 = byMonth('90d Forecast')

const ACTUALS_TOTAL = sum(ACTUALS)
const attainment = (series) => (sum(series) / ACTUALS_TOTAL) * 100

const ON_TARGET = ACTUALS.map((actual, i) => Math.abs((F30[i] - actual) / actual) < 0.05)
const MONTHS_ON_TARGET = ON_TARGET.filter(Boolean).length

const HORIZONS = [
  { label: '30d', series: F30 },
  { label: '60d', series: F60 },
  { label: '90d', series: F90 },
]
const BEST_HORIZON = HORIZONS.map((h) => ({
  ...h,
  value: attainment(h.series),
})).sort((a, b) => Math.abs(100 - a.value) - Math.abs(100 - b.value))[0]

const pct = (n) => `${n.toFixed(1)}%`
const signed = (n) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

// Monthly 30d accuracy, 1 = exact, 0 = 40%+ out. Drives the heat strip.
const ACCURACY = ACTUALS.map((actual, i) =>
  Math.max(0, 1 - Math.abs((F30[i] - actual) / actual) / 0.4),
)

/* Each KPI carries a micro-visual sized to a single 24px band, so the row stays
 * one clean line of stats rather than six little charts. The visual type is
 * chosen to fit the measure: a trend gets a sparkline, a ratio gets a bar, a
 * pass/fail count gets win-loss blocks, a per-month quality score gets heat. */
const KPIS = [
  {
    label: 'Net Units',
    value: `${(ACTUALS_TOTAL / 1000).toFixed(1)}K`,
    caption: 'FY2019 actuals',
    visual: 'spark',
    series: ACTUALS,
  },
  {
    label: '30d Attainment',
    value: pct(attainment(F30)),
    meta: 'Target 100%',
    progress: attainment(F30),
    tone: 'warning',
    caption: `${(100 - attainment(F30)).toFixed(1)} pts remaining`,
    visual: 'bar',
  },
  {
    label: 'Months On Target',
    value: `${MONTHS_ON_TARGET} / 12`,
    meta: 'Within 5% of actual',
    tone: MONTHS_ON_TARGET >= 6 ? 'positive' : 'negative',
    caption: 'Green months met target',
    visual: 'winloss',
  },
  {
    label: 'Forecast Health',
    value: MONTHS_ON_TARGET >= 6 ? 'Stable' : 'Degraded',
    meta: `${12 - MONTHS_ON_TARGET} of 12 months off target`,
    tone: MONTHS_ON_TARGET >= 6 ? 'positive' : 'negative',
    caption: 'Darker is more accurate',
    visual: 'heat',
  },
  {
    label: 'Best Horizon',
    value: BEST_HORIZON.label,
    meta: `${pct(BEST_HORIZON.value)} attainment`,
    progress: BEST_HORIZON.value,
    tone: 'positive',
    caption: 'Closest to target',
    visual: 'bar',
  },
  {
    label: 'Horizon Spread',
    value: pct(Math.abs(attainment(F30) - attainment(F90))),
    meta: '30d vs 90d attainment',
    tone: 'positive',
    caption: 'Lower is more consistent',
    visual: 'spark',
    series: F30.map((v, i) => Math.abs(v - F90[i])),
  },
]

// Sparkline small enough to sit in a KPI cell without becoming a chart.
function KpiSpark({ data, tone }) {
  const el = useChart(
    {
      ...CHART_BASE,
      chart: {
        type: 'area',
        height: 24,
        margin: [2, 0, 2, 0],
        backgroundColor: 'transparent',
        skipClone: true,
      },
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
        },
      },
      series: [{ data, color: tone === 'negative' ? '#bc1227' : '#2f80ed' }],
    },
    [data, tone],
  )
  return <div className="kpi-cell__spark" ref={el} />
}

function KpiVisual({ kpi }) {
  if (kpi.visual === 'spark') {
    return <KpiSpark data={kpi.series} tone={kpi.tone} />
  }

  if (kpi.visual === 'winloss') {
    return (
      <div className="kpi-strip">
        {ON_TARGET.map((met, i) => (
          <span
            key={MONTHS[i]}
            className={`kpi-strip__cell kpi-strip__cell--${met ? 'won' : 'lost'}`}
            title={`${MONTHS[i]} · ${met ? 'on target' : 'off target'}`}
          />
        ))}
      </div>
    )
  }

  if (kpi.visual === 'heat') {
    return (
      <div className="kpi-strip">
        {ACCURACY.map((score, i) => (
          <span
            key={MONTHS[i]}
            className="kpi-strip__cell"
            style={{ backgroundColor: `rgba(0, 128, 79, ${0.12 + score * 0.75})` }}
            title={`${MONTHS[i]} · ${(score * 100).toFixed(0)}% accurate`}
          />
        ))}
      </div>
    )
  }

  if (kpi.progress != null) {
    return (
      <div className="kpi-cell__track">
        <div
          className={`kpi-cell__fill kpi-cell__fill--${kpi.tone}`}
          style={{ width: `${Math.min(kpi.progress, 100)}%` }}
        />
      </div>
    )
  }

  return null
}

function KpiBand() {
  return (
    <section className="kpi-group">
      <div className="kpi-group__grid">
        {KPIS.map((kpi) => (
          <div className="kpi-cell" key={kpi.label}>
            <span className="kpi-cell__label">{kpi.label}</span>
            <span className={`kpi-cell__value kpi-cell__value--${kpi.tone}`}>
              {kpi.value}
            </span>
            {kpi.meta && <span className="kpi-cell__caption">{kpi.meta}</span>}

            <div className="kpi-cell__visual">
              <KpiVisual kpi={kpi} />
            </div>

            {kpi.caption && <span className="kpi-cell__foot">{kpi.caption}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

// Same conventions as the analysis tab's report tiles: subtitle hidden in v2,
// expand control revealed on hover, expanding fills the area and hides the rest.
function ReportCard({ title, subtitle, isExpanded, isHidden, onToggle, children }) {
  return (
    <section
      className={`report-tile report-card${isExpanded ? ' report-card--expanded' : ''}`}
      hidden={isHidden}
    >
      <div className="tile-header">
        <div className="tile-heading">
          <h2 className="tile-title">{title}</h2>
          <p className="tile-subtitle">{subtitle}</p>
        </div>
        <ArvoIconButton
          className="tile-expand"
          icon={isExpanded ? 'compress' : 'expand'}
          tooltip={isExpanded ? 'Collapse report' : 'Expand report'}
          variant="tertiary"
          size="sm"
          onClick={onToggle}
        />
      </div>
      {children}
    </section>
  )
}

// --- charts -------------------------------------------------------------

function useChart(options, deps = []) {
  const el = useRef(null)
  useEffect(() => {
    const chart = Highcharts.chart(el.current, options)
    return () => chart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return el
}

const CHART_BASE = {
  credits: { enabled: false },
  title: { text: null },
  plotOptions: { series: { animation: false, marker: { enabled: false } } },
}

function ActualVsPlan() {
  const el = useChart({
    ...CHART_BASE,
    chart: { height: 220, backgroundColor: 'transparent', spacing: [4, 4, 4, 4] },
    tooltip: { shared: true },
    xAxis: { categories: MONTHS, lineColor: '#e5e5e5', tickWidth: 0, labels: { enabled: false } },
    yAxis: { title: { text: null }, gridLineColor: '#f2f2f2', labels: { enabled: false } },
    legend: {
      align: 'left',
      symbolRadius: 0,
      squareSymbol: true,
      itemStyle: { fontSize: '12px', fontWeight: '400', color: '#303030' },
    },
    series: [
      { name: 'Actual', type: 'spline', data: ACTUALS, color: '#e08600', lineWidth: 2 },
      { name: 'Plan', type: 'spline', data: F30, color: '#5b6b7c', dashStyle: 'Dash', lineWidth: 2 },
    ],
  })
  return <div ref={el} />
}

function HorizonColumns() {
  const el = useChart({
    ...CHART_BASE,
    chart: { type: 'column', height: 220, backgroundColor: 'transparent', spacing: [4, 4, 4, 4] },
    tooltip: { shared: true },
    xAxis: { categories: MONTHS, lineColor: '#e5e5e5', tickWidth: 0, labels: { enabled: false } },
    yAxis: { title: { text: null }, gridLineColor: '#f2f2f2', labels: { enabled: false } },
    legend: {
      align: 'left',
      symbolRadius: 0,
      squareSymbol: true,
      itemStyle: { fontSize: '12px', fontWeight: '400', color: '#303030' },
    },
    plotOptions: {
      ...CHART_BASE.plotOptions,
      column: { borderWidth: 0, borderRadius: 0, groupPadding: 0.12 },
    },
    series: [
      { name: '30d', data: F30, color: '#2f80ed' },
      { name: '60d', data: F60, color: '#3cb489' },
      { name: '90d', data: F90, color: '#b678a8' },
    ],
  })
  return <div ref={el} />
}

// --- pivots -------------------------------------------------------------

// Attainment per customer per horizon -- a compact pivot, not the full grid.
const CUSTOMER_ROWS = CUSTOMERS.map((customer) => {
  const actual = sum(customer.values['Units Actuals'])
  return {
    id: customer.id,
    cells: HORIZONS.map((h) => (sum(customer.values[`${h.label} Forecast`]) / actual) * 100),
  }
})

function AccuracyPivot() {
  return (
    <div className="mini-pivot">
      <table className="mini-pivot__table">
        <thead>
          <tr>
            <th scope="col">Customer Group</th>
            {HORIZONS.map((h) => (
              <th scope="col" key={h.label} className="mini-pivot__num">{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CUSTOMER_ROWS.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              {row.cells.map((value, i) => (
                <td
                  key={HORIZONS[i].label}
                  className="mini-pivot__num"
                  style={{ backgroundColor: attainmentTint(value) }}
                >
                  {pct(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Only misses beyond 10 points are tinted -- everything else is within noise.
function attainmentTint(value) {
  const miss = Math.abs(100 - value)
  if (miss < 10) return undefined
  const alpha = miss < 20 ? 0.12 : 0.24
  return value < 100 ? `rgba(188, 18, 39, ${alpha})` : `rgba(0, 128, 79, ${alpha})`
}

function VariancePivot() {
  return (
    <div className="mini-pivot">
      <table className="mini-pivot__table">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col" className="mini-pivot__num">Actual</th>
            <th scope="col" className="mini-pivot__num">30d Forecast</th>
            <th scope="col" className="mini-pivot__num">Variance</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((month, i) => {
            const variance = ((F30[i] - ACTUALS[i]) / ACTUALS[i]) * 100
            return (
              <tr key={month}>
                <td>{month}</td>
                <td className="mini-pivot__num">{ACTUALS[i].toLocaleString('en-US')}</td>
                <td className="mini-pivot__num">{F30[i].toLocaleString('en-US')}</td>
                <td
                  className={`mini-pivot__num mini-pivot__var--${
                    variance < 0 ? 'negative' : 'positive'
                  }`}
                >
                  {signed(variance)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const REPORTS = [
  {
    id: 'plan',
    title: 'Actual vs Plan',
    subtitle: 'Units actuals against 30d forecast',
    render: () => <ActualVsPlan />,
  },
  {
    id: 'horizon',
    title: 'Forecast by Horizon',
    subtitle: '30d / 60d / 90d by month',
    render: () => <HorizonColumns />,
  },
  {
    id: 'attainment',
    title: 'Attainment by Customer',
    subtitle: 'Forecast total against actuals',
    render: () => <AccuracyPivot />,
  },
  {
    id: 'variance',
    title: 'Monthly Variance',
    subtitle: `30d forecast against actuals · ${MONTHS_ON_TARGET} of 12 on target`,
    render: () => <VariancePivot />,
  },
]

export default function ScorecardView() {
  const [expandedId, setExpandedId] = useState(null)
  const toggle = (id) => setExpandedId((current) => (current === id ? null : id))

  // Highcharts only reflows on window resize, and this view holds several
  // instances. One synthetic resize updates them all after the layout change,
  // rather than threading a ref out of every chart.
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [expandedId])

  return (
    <div className="content-area content-area--scorecard">
      <KpiBand />

      <div className="report-grid">
        {REPORTS.map(({ id, title, subtitle, render }) => (
          <ReportCard
            key={id}
            title={title}
            subtitle={subtitle}
            isExpanded={expandedId === id}
            isHidden={expandedId !== null && expandedId !== id}
            onToggle={() => toggle(id)}
          >
            {render()}
          </ReportCard>
        ))}
      </div>
    </div>
  )
}
