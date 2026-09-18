import { useEffect, useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import Highcharts from 'highcharts'
import { ArvoIconButton } from '@arvo/react'
import { ChartActions, PivotActions } from './TileActions'
import { useSettings } from '../SettingsContext'
import { MONTHS } from './PivotTable'
import { OUTCOME, REFERENCE, SPEND, alpha, heat } from '../viz'
import PivotContextMenu from './PivotContextMenu'
import ColumnFilter, { ColumnFilterButton } from './ColumnFilter'
import { PivotRowsSkeleton } from './ContentSkeleton'
import ChartContextMenu from './ChartContextMenu'
import usePivotCellFocus from './usePivotCellFocus'

/* Channel Assortments: trade spend. Same tile conventions as the Market tab --
 * stacked report tiles, hidden subtitles, hover-revealed expand that fills the
 * area and hides the sibling. */

// M05-2019 is the last actual month; everything after it is forecast.
const LAST_ACTUAL = 4

/* M01-M04 are the exact measure values from the source report; M05-M12 are not
 * shown there and are modelled on the same shape. */
const PRICE_PROTECTION = [
  93_614, 97_868, 100_669, 97_718,
  140_000, 138_000, 142_000, 139_000, 136_000, 145_000, 140_000, 141_000,
]
const PROMO_ALLOWANCES = [
  138_685, 139_326, 128_260, 135_429,
  220_000, 218_000, 224_000, 219_000, 215_000, 228_000, 220_000, 222_000,
]
const REGIONAL_INCENTIVES = [
  1_316_372, 1_344_096, 1_297_271, 1_321_178,
  1_890_000, 1_844_000, 1_884_000, 1_842_000, 1_799_000, 1_927_000, 1_840_000, 1_837_000,
]
const TARGET = [
  1_622_676, 1_599_525, 1_588_639, 1_665_323,
  2_400_000, 2_450_000, 2_500_000, 2_350_000, 2_400_000, 2_480_000, 2_420_000, 2_450_000,
]

const STACK_TOTALS = MONTHS.map(
  (_, i) => PRICE_PROTECTION[i] + PROMO_ALLOWANCES[i] + REGIONAL_INCENTIVES[i],
)

/* Product-group rows for the Details pivot. Declared here rather than beside
 * the table because the KPI band above is derived from them, and a module-level
 * const cannot read a binding declared further down the file. */
const ROWS = [
  {
    group: 'PL_30',
    spendLY: 15_000_000,
    growth: 1_800_000,
    spend: 16_800_000,
    billback: 5.77,
    priceProtection: 965_256,
    promo: 1_557_220,
    regional: 14_294_037,
  },
  {
    group: 'PL_20',
    spendLY: 2_800_000,
    growth: 309_300,
    spend: 3_100_000,
    billback: 6.13,
    priceProtection: 190_089,
    promo: 280_666,
    regional: 2_667_602,
  },
  {
    group: 'PL_40',
    spendLY: 1_900_000,
    growth: 220_100,
    spend: 2_100_000,
    billback: 6.13,
    priceProtection: 128_873,
    promo: 186_606,
    regional: 1_787_695,
  },
  {
    group: 'PL_10',
    spendLY: 1_400_000,
    growth: 147_000,
    spend: 1_600_000,
    billback: 5.98,
    priceProtection: 90_763,
    promo: 142_213,
    regional: 1_320_210,
  },
]

const PEAK_GROWTH = Math.max(...ROWS.map((row) => row.growth))

const TARGET_TOTALS = TARGET
const sum = (nums) => nums.reduce((total, n) => total + n, 0)

const SPEND_ACTUAL = sum(ROWS.map((row) => row.spend))
const SPEND_LY = sum(ROWS.map((row) => row.spendLY))
const REGIONAL_SHARE = (sum(ROWS.map((row) => row.regional)) / SPEND_ACTUAL) * 100

const SPEND_TOTAL = sum(STACK_TOTALS)
const TARGET_TOTAL = sum(TARGET_TOTALS)
const PEAK_MONTH = Math.max(...STACK_TOTALS)

/* Heat position for a month, by rank rather than by value.
 *
 * Two earlier attempts read the data wrong. Against zero, every month landed in
 * the top fifth of the ramp and the strip came out flat -- monthly spend never
 * approaches zero. Against the observed min-max it went bimodal instead: spend
 * steps up sharply from actuals to forecast, so months clustered at the two
 * ends and the middle of the ramp was never used.
 *
 * Ranking spreads twelve months evenly across the five steps, which is what the
 * strip is for -- reading which months ran hot relative to each other, not
 * measuring the gap between them. The value itself is on the KPI beside it. */
/* Series order as the chart builds them -- the context menu names the series
 * you clicked from this, by index. */
const SERIES_NAMES = [
  'Price Protection',
  'Promo Allowances',
  'Regional Incentives',
  'Target Trade Spend',
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

const ORDERED_SPEND = [...STACK_TOTALS].sort((a, b) => a - b)
const heatPosition = (spend) =>
  ORDERED_SPEND.indexOf(spend) / (ORDERED_SPEND.length - 1)

// A month counts as on target when spend lands within 5% of the target line.
const ON_TARGET = STACK_TOTALS.map(
  (spend, i) => Math.abs((spend - TARGET_TOTALS[i]) / TARGET_TOTALS[i]) < 0.05,
)
const MONTHS_ON_TARGET = ON_TARGET.filter(Boolean).length

const pct = (n) => `${n.toFixed(1)}%`

function KpiSpark({ data }) {
  const el = useRef(null)

  useEffect(() => {
    const chart = Highcharts.chart(el.current, {
      chart: {
        type: 'area',
        height: 24,
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
          // Stays off here, unlike the report charts: six 24px sparklines
          // animating at once in the KPI band is noise, not feedback.
          animation: false,
          enableMouseTracking: false,
          lineWidth: 1.5,
          marker: { enabled: false },
          fillOpacity: 0.12,
        },
      },
      series: [{ data, color: SPEND.base }],
    })
    return () => chart.destroy()
  }, [data])

  return <div className="kpi-cell__spark" ref={el} />
}

function KpiVisual({ kpi }) {
  if (kpi.visual === 'spark') return <KpiSpark data={kpi.series} />

  if (kpi.visual === 'winloss') {
    return (
      <div className="kpi-strip">
        {ON_TARGET.map((met, i) => (
          <span
            key={MONTHS[i]}
            className="kpi-strip__cell"
            /* Translucent like the heat strip beside it: these two sit in the
               same band and a solid pair next to a see-through one reads as two
               different kinds of thing. */
            style={{ backgroundColor: alpha(met ? OUTCOME.met : OUTCOME.missed, 0.55) }}
            title={`${MONTHS[i]} · ${met ? 'on target' : 'off target'}`}
          />
        ))}
      </div>
    )
  }

  if (kpi.visual === 'heat') {
    return (
      <div className="kpi-strip">
        {STACK_TOTALS.map((spend, i) => (
          <span
            key={MONTHS[i]}
            className="kpi-strip__cell"
            /* Sequential ramp: five discrete steps of one hue read as a scale,
               where a continuous alpha over white just looked washed out. */
            style={{ backgroundColor: heat(heatPosition(spend), SPEND.ramp) }}
            title={`${MONTHS[i]} · $${(spend / 1_000_000).toFixed(2)}m`}
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

/* KPIs are derived from the trade spend figures the reports below show, so the
 * band and the reports cannot disagree. */
const KPIS = [
  {
    label: 'Trade Spend',
    value: `$${(SPEND_TOTAL / 1_000_000).toFixed(1)}m`,
    meta: 'FY2019 total',
    visual: 'spark',
    series: STACK_TOTALS,
  },
  {
    label: 'vs Last Year',
    value: `+${pct(((SPEND_ACTUAL - SPEND_LY) / SPEND_LY) * 100)}`,
    meta: 'Growth on prior year',
    progress: 100,
    tone: 'positive',
    visual: 'bar',
  },
  {
    label: 'Target Attainment',
    value: pct((SPEND_TOTAL / TARGET_TOTAL) * 100),
    meta: 'Target 100%',
    progress: (SPEND_TOTAL / TARGET_TOTAL) * 100,
    tone: 'warning',
    caption: `${pct(100 - (SPEND_TOTAL / TARGET_TOTAL) * 100)} under target`,
    visual: 'bar',
  },
  {
    label: 'Spend Intensity',
    value: `$${(PEAK_MONTH / 1_000_000).toFixed(2)}m`,
    meta: 'Peak month',
    caption: 'Darker is higher spend',
    visual: 'heat',
  },
  {
    label: 'Months On Target',
    value: `${MONTHS_ON_TARGET} / 12`,
    meta: 'Within 5% of target',
    tone: MONTHS_ON_TARGET >= 6 ? 'positive' : 'negative',
    caption: 'Green months met target',
    visual: 'winloss',
  },
  {
    label: 'Regional Share',
    value: pct(REGIONAL_SHARE),
    meta: 'Of total trade spend',
    progress: REGIONAL_SHARE,
    tone: 'positive',
    visual: 'bar',
  },
]

function KpiBand() {
  return (
    <section className="kpi-group">
      <div className="kpi-group__grid">
        {KPIS.map((kpi) => (
          <div className="kpi-cell" key={kpi.label}>
            <span className="kpi-cell__label">{kpi.label}</span>
            <span className={`kpi-cell__value kpi-cell__value--${kpi.tone}`}>{kpi.value}</span>
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

// Tooltip money: "$2 m" / "$197 k", as the source report shows it.
const tipMoney = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(0)} m` : `$${Math.round(n / 1000)} k`

/* `chartRef` is owned by ChannelView rather than created here: the tile header
 * sits outside this component, and the relocated legend in Report Settings has
 * to reach the same Highcharts instance this draws into. */
function TradeSpendChart({ isCumulative, expandedId, chartRef }) {
  const el = useRef(null)
  const ownChart = useRef(null)
  const chart = chartRef ?? ownChart
  /* Per-series type overrides, keyed by series index. Applied through
   * chart.update rather than folded into the build, so switching a series to a
   * line does not rebuild and re-animate the whole chart. */
  const [seriesTypes, setSeriesTypes] = usePersistentState('chart.types.channel', {})
  // Axis type is a Highcharts option rather than CSS, so it is read here and
  // the chart rebuilt when it changes.
  const { settings } = useSettings()

  useEffect(() => {
    // Cumulative shows spend to date rather than spend in month.
    const runningTotal = (series) =>
      series.reduce((out, v) => [...out, (out.at(-1) ?? 0) + v], [])
    const shape = (series) => (isCumulative ? runningTotal(series) : series)

    chart.current = Highcharts.chart(el.current, {
      // No `height`: a fixed one wins over the container, so the chart stayed
      // 320px tall however far the tile was expanded. Leaving it out lets
      // Highcharts take the container's height, which .report-tile--expanded
      // grows -- the same arrangement as the Waterfall chart.
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        spacing: [8, 8, 8, 8],
        /* Redraw animation, which is what a legend toggle needs here.
         *
         * Hiding a series in the Waterfall only removes its own columns --
         * nothing else moves, so plotOptions.series.animation covers it. These
         * columns are stacked, so hiding one also makes every segment above it
         * drop and the axis rescale. That repositioning is a chart redraw, and
         * it is chart.animation that governs it.
         *
         * Set explicitly rather than left to Highcharts' 500ms default so the
         * motion matches the rest of the shell ($arvo-duration-slow). */
        animation: { duration: 300 },
      },
      title: { text: null },
      credits: { enabled: false },
      tooltip: {
        /* Not shared, which is what makes hovering a segment highlight that
         * whole series and dim the others -- Highcharts' inactive state never
         * fires while a shared tooltip is activating every series at once. The
         * Waterfall gets that behaviour from the defaults; this chart had opted
         * out of it, so the two tabs behaved differently on hover.
         *
         * The full stack breakdown is kept by reading the sibling series at the
         * hovered index rather than from `this.points`, which an unshared
         * tooltip does not provide. */
        shared: false,
        useHTML: true,
        backgroundColor: '#ffffff',
        borderColor: '#e5e5e5',
        borderRadius: 0,
        borderWidth: 1,
        shadow: false,
        padding: 0,
        formatter() {
          const index = this.point.index
          const at = (series) => series.points[index]

          // Stack components top-down, then the benchmark, matching how the
          // bar is read from the top of the stack downwards.
          const all = this.series.chart.series
          const stacked = all.filter((s) => s.type === 'column').reverse()
          const target = all.find((s) => s.type === 'line')
          const total = stacked.reduce((sum, s) => sum + (at(s)?.y ?? 0), 0)

          const row = (series) => {
            const point = at(series)
            if (!point) return ''
            // The hovered series is marked so the row reads as the one the
            // pointer is on, matching the highlight in the plot.
            const isHovered = series === this.series
            return (
              `<tr class="${isHovered ? 'tip__row--on' : ''}"><td class="tip__name">` +
              `<span class="tip__swatch" style="background:${series.color}"></span>${series.name}` +
              `</td><td class="tip__value">${tipMoney(point.y)}</td></tr>`
            )
          }

          // `this.x` is the category index on a categorised axis, not its
          // label -- the point's own key carries the month name.
          const month = this.point.category ?? this.key

          return (
            `<div class="tip">` +
            `<div class="tip__head"><span>${month}</span>` +
            `<span class="tip__total">${tipMoney(total)}</span></div>` +
            `<table class="tip__table">${stacked.map(row).join('')}` +
            (target ? row(target) : '') +
            `</table></div>`
          )
        },
      },
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
          // useHTML is needed to give the current period a filled chip. It is
          // safe only because rotation is pinned to 0 -- Highcharts' auto-rotate
          // writes NaN into a foreignObject transform and floods the console.
          useHTML: true,
          rotation: 0,
          formatter() {
            if (this.pos !== LAST_ACTUAL) return this.value
            return (
              `<span style="background:var(--arvo-color-s-fn-currenttime,#efbc5c);` +
              `color:var(--arvo-color-t-neutral,#010101);font-weight:500;` +
              `padding:2px 6px;">${this.value}</span>`
            )
          },
        },
        /* Boundary between actuals and forecast, in the same currenttime amber
         * as the M05 axis chip. Two plot lines at the same x: the first draws
         * the rule and labels the forecast side, the second is zero-width and
         * exists only to label the past side -- a plot line carries one label. */
        plotLines: [
          {
            value: LAST_ACTUAL + 0.5,
            color: 'var(--arvo-color-s-fn-currenttime, #efbc5c)',
            width: 2,
            zIndex: 4,
            label: {
              text: 'Future',
              style: { fontSize: '12px', color: '#303030' },
              // xAxis plot-line labels default to rotation 90.
              rotation: 0,
              verticalAlign: 'top',
              align: 'left',
              x: 8,
              y: 14,
            },
          },
          {
            value: LAST_ACTUAL + 0.5,
            width: 0,
            zIndex: 4,
            label: {
              text: 'Past',
              style: { fontSize: '12px', color: '#303030' },
              rotation: 0,
              verticalAlign: 'top',
              align: 'right',
              x: -8,
              y: 14,
            },
          },
        ],
      },
      yAxis: {
        title: { text: null },
        gridLineColor: '#e5e5e5',
        labels: {
          style: {
            fontSize: `${settings.chartYSize}px`,
            fontWeight: String(settings.chartYWeight),
            color: '#303030',
          },
          formatter() {
            return `$${this.value / 1_000_000}m`
          },
        },
      },
      legend: {
        enabled: settings.chartLegend !== 'settings',
        align: 'left',
        verticalAlign: 'bottom',
        symbolRadius: 0,
        squareSymbol: true,
        itemStyle: { fontSize: '12px', fontWeight: '400', color: '#303030' },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderRadius: 0,
          groupPadding: 0.1,
          /* 1px separator between stacked segments, drawn in the tile's own
             surface colour so it reads as a gap rather than an outline. Without
             it the adjacent blues of the ramp touch and the boundary between
             two segments is ambiguous.

             Highcharts writes this to an SVG stroke attribute, where CSS var()
             does not resolve, so it is the literal s-layer-01 white. */
          borderWidth: 1,
          borderColor: '#ffffff',
        },
      },
      /* One hue in three steps: these are components of a single measure, so a
         ramp reads as parts of a whole where three unrelated hues would read as
         three unrelated measures. Steps 5/3/1 rather than 4/3/2 -- adjacent
         steps were too close to separate in a stacked column. */
      series: [
        { name: 'Price Protection', data: shape((PRICE_PROTECTION)), color: SPEND.stack[0] },
        { name: 'Promo Allowances', data: shape((PROMO_ALLOWANCES)), color: SPEND.stack[1] },
        {
          name: 'Regional Incentives',
          data: shape((REGIONAL_INCENTIVES)),
          color: SPEND.stack[2],
          // Stack total printed inside the bar, as in the source report. Read
          // from Highcharts' own stackTotal so it stays correct in both the
          // per-month and cumulative shapes.
          dataLabels: {
            enabled: true,
            inside: true,
            verticalAlign: 'middle',
            style: { fontSize: '12px', fontWeight: '400', textOutline: 'none', color: '#303030' },
            formatter() {
              return tipMoney(this.point.stackTotal)
            },
          },
        },
        {
          // Purple: distinct from the three blues of the stack, so the target
          // line reads as a benchmark rather than another spend component.
          name: 'Target Trade Spend',
          type: 'line',
          data: shape(TARGET),
          color: REFERENCE,
          dashStyle: 'ShortDash',
          lineWidth: 2,
          marker: { enabled: false },
          zIndex: 3,
        },
      ],
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
        legend: { enabled: settings.chartLegend !== 'settings' },
      },
      true,
      false,
      false,
    )
  }, [settings])

  // Highcharts only auto-reflows on window resize, so expanding or collapsing
  // has to tell it the container changed. Skipped while the tile is hidden --
  // reflowing then would measure zero and blank the chart.
  useEffect(() => {
    if (el.current?.offsetParent) chart.current?.reflow()
  }, [expandedId])

  useEffect(() => {
    if (!Object.keys(seriesTypes).length) return
    chart.current?.update(
      {
        series: SERIES_NAMES.map((_, i) =>
          seriesTypes[i] ? typeOptions(seriesTypes[i]) : {},
        ),
      },
      true,
      false,
      false,
    )
  }, [seriesTypes])

  /* The three spend measures are one stack, so they change together.
   *
   * Converting a single member would leave the other two stacked on nothing --
   * a stack is a single reading of a total, not three independent series that
   * happen to be adjacent. The target line is not part of that stack, so
   * choosing a type on it changes only itself. */
  const changeType = (index, type) => {
    if (index == null) return
    const stacked = [0, 1, 2]
    const targets = stacked.includes(index) ? stacked : [index]
    setSeriesTypes((current) => ({
      ...current,
      ...Object.fromEntries(targets.map((i) => [i, type])),
    }))
  }

  return (
    <>
      <div className="tile-body" ref={el} />
      <ChartContextMenu targetRef={el} seriesNames={SERIES_NAMES} onChartType={changeType} />
    </>
  )
}

// --- Details pivot ------------------------------------------------------

const compact = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)} m` : `$${(n / 1000).toFixed(1)} k`
const exact = (n) => `$${n.toLocaleString('en-US')}`

/* Which columns this grid can be filtered by.
 *
 * ProductGroup3 only. The rest are measures -- filtering "Billback %" by
 * picking from a list of its own values is a value filter wearing a member
 * filter's clothes, and the toolbar already has Manage Value Filters for that.
 * The Market grid offers months because a month is a member; a currency amount
 * is not. */
const FILTERABLE = ['ProductGroup3']

function DetailsPivot() {
  const tableRef = useRef(null)
  usePivotCellFocus(tableRef)

  /* The same arrangement the Market pivot uses: one popover retargeted to
     whichever header opened it, and a draft that is not applied until OK. */
  const [openColumn, setOpenColumn] = useState(null)
  const [columnState, setColumnState] = useState({})
  const anchorRef = useRef(null)
  /* Applying a filter refetches the rows, so the rows say so. Only the rows --
     the chart and the KPIs above are unaffected by a column filter, and a full
     page skeleton would claim more work than is happening. */
  const [isFiltering, setIsFiltering] = useState(false)
  const filterTimer = useRef(null)

  const reload = () => {
    setIsFiltering(true)
    window.clearTimeout(filterTimer.current)
    filterTimer.current = window.setTimeout(() => setIsFiltering(false), 500)
  }

  useEffect(() => () => window.clearTimeout(filterTimer.current), [])

  const openFilter = (label, trigger) => {
    anchorRef.current = trigger
    setOpenColumn(label)
  }

  const valuesFor = () => [...new Set(ROWS.map((row) => row.group))]

  const applied = columnState.ProductGroup3?.values
  const sorted = columnState.ProductGroup3?.sort
  const rows = (() => {
    let out = applied ? ROWS.filter((row) => applied.has(row.group)) : ROWS
    if (sorted) {
      const direction = sorted === 'asc' ? 1 : -1
      out = [...out].sort((a, b) => a.group.localeCompare(b.group) * direction)
    }
    return out
  })()

  return (
    <div className="pivot">
      {openColumn && (
        <ColumnFilter
          anchorRef={anchorRef}
          column={openColumn}
          values={valuesFor()}
          applied={columnState[openColumn]?.values ?? null}
          sort={columnState[openColumn]?.sort ?? null}
          onClose={() => setOpenColumn(null)}
          onApply={({ values, sort }) => {
            setColumnState((current) => ({
              ...current,
              [openColumn]: {
                // A set covering every value is not a filter -- storing it as
                // one would light the funnel for a column filtering nothing.
                values: values && values.size < valuesFor().length ? values : null,
                sort,
              },
            }))
            setOpenColumn(null)
            reload()
          }}
        />
      )}

      <div className="pivot__scroll">
        <table className="pivot__table" ref={tableRef}>
          <colgroup>
            <col className="pivot__col--actions" />
            <col className="pivot__col--member" />
            <col span={7} />
          </colgroup>

          <thead>
            {/* Group header spanning its child columns, per the pivot guidelines. */}
            <tr>
              <th scope="col" aria-label="Row actions" />
              <th scope="col" />
              <th scope="col" colSpan={2} className="pivot__cell--attr">
                Trade Spend vs LY
              </th>
              <th scope="col" colSpan={5} />
            </tr>
            <tr>
              <th scope="col" className="pivot__cell--center">Actions</th>
              <th scope="col" className="pivot__cell--filterable">
                <span className="pivot__head">
                  <span className="pivot__head-label">ProductGroup3</span>
                  <ColumnFilterButton
                    column="ProductGroup3"
                    isFiltered={Boolean(columnState.ProductGroup3?.values)}
                    isSorted={Boolean(columnState.ProductGroup3?.sort)}
                    isOpen={openColumn === 'ProductGroup3'}
                    onOpen={openFilter}
                  />
                </span>
              </th>
              <th scope="col" className="pivot__cell--num">Trade Spend LY</th>
              <th scope="col" className="pivot__cell--num pivot__cell--attr">Growth</th>
              <th scope="col" className="pivot__cell--num">Trade Spend</th>
              <th scope="col" className="pivot__cell--num">Billback %</th>
              <th scope="col" className="pivot__cell--num">Price Protection</th>
              <th scope="col" className="pivot__cell--num">Promo Allowances</th>
              <th scope="col" className="pivot__cell--num">Regional Incentives</th>
            </tr>
          </thead>

          {isFiltering ? (
            <PivotRowsSkeleton rows={4} columns={9} />
          ) : (
          <tbody>
            {rows.map((row) => (
              <tr key={row.group}>
                <td className="pivot__cell--center">
                  <span
                    className="o9con o9con-info-circle pivot__info"
                    role="img"
                    aria-label={`Row details for ${row.group}`}
                  />
                </td>
                <td>{row.group}</td>
                <td className="pivot__cell--num">{compact(row.spendLY)}</td>
                {/* Data bar behind the figure, sized against the largest growth. */}
                <td
                  className="pivot__cell--num pivot__cell--bar pivot__cell--attr"
                  style={{ '--bar-width': `${Math.round((row.growth / PEAK_GROWTH) * 100)}%` }}
                >
                  <span className="pivot__figure">{compact(row.growth)}</span>
                </td>
                <td className="pivot__cell--num">{compact(row.spend)}</td>
                <td className="pivot__cell--num">{row.billback.toFixed(2)}%</td>
                <td className="pivot__cell--num">{exact(row.priceProtection)}</td>
                <td className="pivot__cell--num">{exact(row.promo)}</td>
                <td className="pivot__cell--num">{exact(row.regional)}</td>
              </tr>
            ))}
          </tbody>
          )}
        </table>
      </div>
      <PivotContextMenu targetRef={tableRef} />
    </div>
  )
}

// --- view ---------------------------------------------------------------

// The expand control is pulled out of the header flow and pinned to the tile's
// top-right corner, so it costs no layout space and only appears on hover.
function TileHeader({ title, subtitle, actions, isExpanded, onToggle }) {
  return (
    <>
      <div className="tile-header">
        <div className="tile-heading">
          <h2 className="tile-title">{title}</h2>
          <p className="tile-subtitle">{subtitle}</p>
        </div>
        {actions}
      </div>
      <ArvoIconButton
        className="tile-expand"
        icon={isExpanded ? 'compress' : 'expand'}
        tooltip={isExpanded ? 'Collapse report' : 'Expand report'}
        variant="tertiary"
        size="xs"
        onClick={onToggle}
      />
    </>
  )
}

export default function ChannelView({ onReportSelect }) {
  // Held here so the tile header's ChartActions and the chart below it are
  // talking about the same Highcharts instance.
  const spendChart = useRef(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isCumulative, setIsCumulative] = useState(false)
  const toggle = (id) => setExpandedId((current) => (current === id ? null : id))

  // The chart reflows itself from the expandedId prop. A synthetic window
  // resize used to stand in for that, but it reached every chart on the page
  // including the ones inside the hidden tile, which then measured zero.

  const isHidden = (id) => expandedId !== null && expandedId !== id
  const tileClass = (id) =>
    `report-tile${expandedId === id ? ' report-tile--expanded' : ''}`

  return (
    <div className="content-area">
      <KpiBand />

      {/* onMouseDown, not onClick: a click landing on a Highcharts element can
          be stopped before it bubbles, and selecting the report should not
          depend on where inside it you pressed. */}
      <section
        className={tileClass('spend')}
        hidden={isHidden('spend')}
        onMouseDown={() => onReportSelect?.('chart')}
      >
        <TileHeader
          title="Trade Spend"
          subtitle="Price protection, promo allowances and regional incentives against target"
          actions={
            <ChartActions
              isCumulative={isCumulative}
              onCumulativeChange={setIsCumulative}
              chartRef={spendChart}
            />
          }
          isExpanded={expandedId === 'spend'}
          onToggle={() => toggle('spend')}
        />
        <TradeSpendChart
          isCumulative={isCumulative}
          expandedId={expandedId}
          chartRef={spendChart}
        />
      </section>

      <section
        className={tileClass('details')}
        hidden={isHidden('details')}
        onMouseDown={() => onReportSelect?.('pivot')}
      >
        <TileHeader
          title="Details"
          subtitle="Trade spend by product group"
          actions={<PivotActions />}
          isExpanded={expandedId === 'details'}
          onToggle={() => toggle('details')}
        />
        <DetailsPivot />
      </section>
    </div>
  )
}
