import { useEffect, useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import Highcharts from 'highcharts'
import { ArvoIconButton } from '@arvo/react'
import PivotTable from './PivotTable'
import { ChartActions, PivotActions } from './TileActions'
import { useSettings } from '../SettingsContext'
import ChartContextMenu from './ChartContextMenu'
import { ACTUAL, FORECAST, CURRENT_PERIOD_TINT } from '../viz'

const MONTHS = [
  'M01-2019', 'M02-2019', 'M03-2019', 'M04-2019', 'M05-2019', 'M06-2019',
  'M07-2019', 'M08-2019', 'M09-2019', 'M10-2019', 'M11-2019', 'M12-2019',
]

// M06-2019 is the current period -- shaded in the chart and bolded on the axis.
const CURRENT_PERIOD = 5

const SERIES = [
  {
    name: '30d Forecast',
    color: FORECAST[0],
    data: [122000, 106000, 111000, 103000, 142000, 116000, 130000, 115000, 120000, 152000, 131000, 118000],
  },
  {
    name: '60d Forecast',
    color: FORECAST[1],
    data: [117000, 104000, 108000, 99000, 140000, 114000, 124000, 113000, 119000, 149000, 128000, 114000],
  },
  {
    name: '90d Forecast',
    color: FORECAST[2],
    data: [121000, 106000, 109000, 101000, 146000, 119000, 124000, 116000, 122000, 151000, 129000, 116000],
  },
  {
    name: 'Units Actuals',
    type: 'line',
    color: ACTUAL,
    dashStyle: 'Dot',
    lineWidth: 2,
    marker: { enabled: false },
    data: [106000, 110000, 131000, 122000, 120000, 145000, 135000, 118000, 143000, 128000, 137000, 152000],
  },
]

/* Series options for a chosen chart type.
 *
 * An area drawn from zero paints over whatever is behind it, so three areas at
 * full opacity leave only the last one visible -- which is exactly what a solid
 * heat fill did to the cells underneath it. A translucent fill lets the
 * overlapping series read as three, and the line on top keeps each boundary
 * legible where the fills coincide. */
const typeOptions = (type) =>
  type === 'area' ? { type, fillOpacity: 0.22, lineWidth: 2 } : { type }

// KPIs are derived from the same series the chart plots, so the two can never
// disagree -- no separately maintained summary numbers.
const sum = (nums) => nums.reduce((total, n) => total + n, 0)
const ACTUALS_TOTAL = sum(SERIES.find((s) => s.name === 'Units Actuals').data)

const compact = (n) => `${(n / 1_000_000).toFixed(2)}M`
const signed = (n) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

const KPIS = [
  { label: 'Units Actuals', value: compact(ACTUALS_TOTAL), caption: 'FY2019 total' },
  ...SERIES.filter((s) => s.name.endsWith('Forecast')).map((series) => {
    const total = sum(series.data)
    const bias = ((total - ACTUALS_TOTAL) / ACTUALS_TOTAL) * 100
    return {
      label: series.name,
      value: compact(total),
      delta: signed(bias),
      tone: bias < 0 ? 'negative' : 'positive',
      caption: 'vs actuals',
    }
  }),
]

// Its own layer in the content stack, peer to the reports rather than part of
// the chart -- the figures summarise the whole filtered view, not that widget.
function KpiBand() {
  return (
    <section className="kpi-layer" aria-label="Summary">
      <div className="kpi-row">
        {KPIS.map(({ label, value, delta, tone, caption }) => (
          <div className="kpi" key={label}>
            <span className="kpi__label">{label}</span>
            <span className="kpi__value">{value}</span>
            <span className="kpi__meta">
              {delta && <span className={`kpi__delta kpi__delta--${tone}`}>{delta}</span>}
              <span className="kpi__caption">{caption}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function TileHeader({ title, subtitle, actions, isExpanded, onToggle }) {
  return (
    <div className="tile-header">
      <div className="tile-heading">
        <h2 className="tile-title">{title}</h2>
        <p className="tile-subtitle">{subtitle}</p>
      </div>
      {actions}
      <ArvoIconButton
        className="tile-expand"
        icon={isExpanded ? 'compress' : 'expand'}
        tooltip={isExpanded ? 'Collapse report' : 'Expand report'}
        variant="tertiary"
        size="xs"
        onClick={onToggle}
      />
    </div>
  )
}

export default function ContentArea({ isV2 = false, onReportSelect }) {
  const chartEl = useRef(null)
  const chart = useRef(null)
  // Per-series type overrides, applied through chart.update so switching a
  // series does not rebuild and re-animate the chart.
  const [seriesTypes, setSeriesTypes] = usePersistentState('chart.types.market', {})
  // Axis type is a Highcharts option, not CSS, so it has to be read here and
  // the chart rebuilt when it changes.
  const { settings } = useSettings()

  // null = all reports visible; otherwise the id of the one filling the area.
  const [expandedId, setExpandedId] = useState(null)
  const [isCumulative, setIsCumulative] = useState(false)
  const toggle = (id) => setExpandedId((current) => (current === id ? null : id))

  useEffect(() => {
    // Cumulative shows spend to date rather than spend in month.
    const runningTotal = (data) =>
      data.reduce((out, v) => [...out, (out.at(-1) ?? 0) + v], [])
    const shape = (data) => (isCumulative ? runningTotal(data) : data)

    chart.current = Highcharts.chart(chartEl.current, {
      chart: { type: 'column', backgroundColor: 'transparent', spacing: [8, 8, 8, 8] },
      // Title and subtitle live in the tile header, not inside the chart.
      title: { text: null },
      credits: { enabled: false },
      xAxis: {
        categories: MONTHS,
        lineColor: '#e5e5e5',
        tickWidth: 0,
        labels: {
          style: {
            fontSize: `${settings.chartXSize}px`,
            fontWeight: String(settings.chartXWeight),
            color: '#303030',
          },
          /* Still no useHTML: with it, Highcharts renders labels in a
             <foreignObject> and its auto-rotation writes NaN into the
             transform, flooding the console. That rules out a background on the
             label itself, so the current period is marked in the two ways SVG
             text does support -- weight, and the currenttime colour the band
             and the pivot header both use. The band behind the column carries
             the fill. */
          formatter() {
            if (this.pos !== CURRENT_PERIOD) return `${this.value}`
            return `<span style="font-weight:600;color:#8a6d1f">${this.value}</span>`
          },
        },
        plotBands: [
          {
            from: CURRENT_PERIOD - 0.5,
            to: CURRENT_PERIOD + 0.5,
            color: CURRENT_PERIOD_TINT,
          },
        ],
      },
      yAxis: {
        title: { text: null },
        // Fixed ceiling only makes sense per-month; a running total blows past it.
        max: isCumulative ? null : 175000,
        tickInterval: isCumulative ? null : 25000,
        gridLineColor: '#e5e5e5',
        labels: {
          style: {
            fontSize: `${settings.chartYSize}px`,
            fontWeight: String(settings.chartYWeight),
            color: '#303030',
          },
          formatter() {
            return this.value === 0 ? '0.0' : `${(this.value / 1000).toFixed(1)}k`
          },
        },
      },
      // Nothing on the o9 platform uses rounded corners, so the Highcharts
      // defaults (columns borderRadius 3, rounded legend symbols) are squared off.
      legend: {
        enabled: settings.chartLegend !== 'settings',
        align: 'left',
        verticalAlign: 'bottom',
        borderRadius: 0,
        symbolRadius: 0,
        squareSymbol: true,
        itemStyle: { fontSize: '12px', fontWeight: '400', color: '#303030' },
      },
      plotOptions: {
        column: { borderWidth: 0, borderRadius: 0, groupPadding: 0.12 },
      },
      series: SERIES.map((series) => ({ ...series, data: shape(series.data) })),
    })

    return () => chart.current.destroy()
    // Rebuilt only when the series data changes. Type settings are applied by
    // the effect below instead -- rebuilding for those replayed the whole entry
    // animation every time a font size was nudged.
  }, [isCumulative])

  /* Axis label type, applied in place.
   *
   * chart.update with animation off restyles the existing chart rather than
   * constructing a new one, so stepping through 12/14/16/18 restyles the labels
   * without the columns growing from zero again on each step. */
  useEffect(() => {
    const style = (size, weight) => ({
      fontSize: `${size}px`,
      fontWeight: String(weight),
      color: '#303030',
    })
    chart.current?.update(
      {
        xAxis: { labels: { style: style(settings.chartXSize, settings.chartXWeight) } },
        yAxis: { labels: { style: style(settings.chartYSize, settings.chartYWeight) } },
        /* Applied here as well as at construction, so switching the preference
           reflows the existing chart rather than waiting for the next rebuild.
           The plot takes back the legend's band in the same redraw. */
        legend: { enabled: settings.chartLegend !== 'settings' },
      },
      true,
      false,
      false,
    )
  }, [settings])

  useEffect(() => {
    if (!Object.keys(seriesTypes).length) return
    chart.current?.update(
      { series: SERIES.map((_, i) => (seriesTypes[i] ? typeOptions(seriesTypes[i]) : {})) },
      true,
      false,
      false,
    )
  }, [seriesTypes])

  /* Grouped columns, not stacked: each bar is its own measure, so changing a
   * type converts only the series that was clicked. */
  const changeType = (index, type) => {
    if (index == null) return
    setSeriesTypes((current) => ({ ...current, [index]: type }))
  }

  // Highcharts only auto-reflows on window resize, so expanding or collapsing
  // has to tell it the container changed. Skipped while the tile is hidden --
  // reflowing then would measure zero and blank the chart.
  useEffect(() => {
    if (chartEl.current?.offsetParent) chart.current?.reflow()
  }, [expandedId])

  const isHidden = (id) => expandedId !== null && expandedId !== id
  const tileClass = (id) =>
    `report-tile${expandedId === id ? ' report-tile--expanded' : ''}`

  return (
    <div className="content-area">
      {isV2 && <KpiBand />}

      {/* Selecting the report tells the settings panel which report you mean.
          onMouseDown, not onClick, so it still fires when the click lands on a
          Highcharts element that stops the click from bubbling. */}
      <section
        className={tileClass('spend')}
        hidden={isHidden('spend')}
        onMouseDown={() => onReportSelect?.('chart')}
      >
        <TileHeader
          title="Consensus Forecast Waterfall"
          subtitle="30d / 60d / 90d forecast against units actuals"
          actions={
            <ChartActions
              isCumulative={isCumulative}
              onCumulativeChange={setIsCumulative}
              chartRef={chart}
            />
          }
          isExpanded={expandedId === 'spend'}
          onToggle={() => toggle('spend')}
        />
        <div className="tile-body" ref={chartEl} />
        <ChartContextMenu
          targetRef={chartEl}
          seriesNames={SERIES.map((series) => series.name)}
          onChartType={changeType}
        />
      </section>

      <section
        className={tileClass('assortment')}
        hidden={isHidden('assortment')}
        onMouseDown={() => onReportSelect?.('pivot')}
      >
        {/* v2 folds the table's own toolbar into this header, so the view has
            one control row instead of three stacked strips. */}
        <TileHeader
          title="Details"
          subtitle="Forecast and actuals by product line and customer group"
          actions={isV2 ? <PivotActions /> : null}
          isExpanded={expandedId === 'assortment'}
          onToggle={() => toggle('assortment')}
        />
        <PivotTable hasToolbar={!isV2} isV2={isV2} />
      </section>
    </div>
  )
}
