/* Data-visualisation palette.
 *
 * Deliberately separate from Arvo's semantic colour tokens. Those encode UI
 * state -- negative, warning, positive, theme -- and reusing them for data
 * would tie the meaning of a chart series to the meaning of an alert. These are
 * for encoding data only: categorical series, sequential heat ramps, and
 * diverging conditional formatting.
 *
 * Twelve hues x five steps, sampled from the supplied swatch sheet. Step 300 is
 * the base used for categorical series; 100-200 are fills and light heat, and
 * 400-500 are the dark end of a ramp.
 *
 * This module is the single source of truth: nothing here is duplicated into
 * CSS, because every consumer applies these values as inline styles or through
 * Highcharts. Values are eyeballed from the swatch image -- swap in the
 * official hexes if the design system publishes them.
 */
export const VIZ = {
  pink: ['#f3c6e2', '#e298cb', '#c72d92', '#99005f', '#6b0044'],
  red: ['#f9c9c4', '#fb95a4', '#fc4058', '#c11429', '#8a1108'],
  coral: ['#fbcbc2', '#ef9b87', '#e8503a', '#c31c10', '#8c1220'],
  orange: ['#fbd9bd', '#f9bd8a', '#f98131', '#d96a09', '#9a4a06'],
  amber: ['#f7e2b8', '#efce8f', '#e2ac33', '#c08b00', '#866000'],
  yellow: ['#fdf7bc', '#fbef8e', '#fbe129', '#c08f00', '#9d9c00'],
  green: ['#b9edc4', '#8fdda3', '#0ec735', '#009a26', '#04701f'],
  teal: ['#c2f5e0', '#a5eed3', '#2ce39c', '#00a273', '#007a55'],
  cyan: ['#bcd6ec', '#91c2e0', '#2e8fbe', '#005f96', '#004466'],
  blue: ['#bfcbfb', '#92a9f7', '#2f77f0', '#0a2ae0', '#001f8c'],
  indigo: ['#b9b6f5', '#9d8bef', '#6039e0', '#3f11a8', '#2e0a76'],
  purple: ['#d5cdf0', '#b39ae4', '#7a4fd4', '#5a189a', '#3b0a6b'],
}

// Step helper: VIZ_STEP.blue(3) -> the base blue.
const step = (hue) => (n) => VIZ[hue][n - 1]
export const viz = Object.fromEntries(
  Object.keys(VIZ).map((hue) => [hue, step(hue)]),
)

/* Categorical sequence for multi-series charts. Ordered so adjacent series stay
 * distinguishable rather than walking round the colour wheel. */
export const CATEGORICAL = [
  viz.blue(3),
  viz.teal(4),
  viz.purple(3),
  viz.orange(3),
  viz.pink(3),
  viz.cyan(3),
]

/* Hex to rgba. Heat and conditional fills are laid *over* content -- data bars,
 * sparklines, the numbers themselves -- so they are expressed as one hue at
 * varying alpha rather than as opaque steps of a ramp. An opaque fill hides
 * whatever it covers; a translucent one encodes the same magnitude and still
 * lets the cell be read. */
export const alpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/* Sequential heat. `t` is 0-1 and drives opacity, not hue.
 *
 * Quantised to five steps so the scale still reads as bands rather than as a
 * smear -- the earlier continuous version was hard to compare cell to cell --
 * but each band is translucent, so the strip sits over its surface instead of
 * blanking it out. The ceiling stops well short of solid for the same reason. */
const HEAT_ALPHAS = [0.1, 0.24, 0.38, 0.52, 0.66]

export const heat = (t, hue = 'cyan') => {
  const clamped = Math.min(1, Math.max(0, t))
  const step = Math.round(clamped * (HEAT_ALPHAS.length - 1))
  return alpha(viz[hue](3), HEAT_ALPHAS[step])
}

/* Diverging pair for conditional formatting. Under and over, at two strengths,
 * so a grid can mark "notable" and "severe" without four separate constants.
 *
 * Translucent for the same reason heat is: these tint cells that already carry
 * a number, and at full opacity the strong step was a block of colour with text
 * struggling on top of it. */
export const DIVERGING = {
  under: [alpha(viz.coral(3), 0.16), alpha(viz.coral(3), 0.34)],
  over: [alpha(viz.green(4), 0.16), alpha(viz.green(4), 0.34)],
}

/* Named roles, so a chart or KPI asks for what a colour means rather than for a
 * hue and a step number. Blue is the spend hue throughout -- the Trade Spend
 * chart, the sparkline that summarises it, and the intensity heat strip all
 * encode the same measure, and sharing a hue is what makes the KPI band read as
 * a summary of the reports below it instead of as six unrelated tiles.
 *
 * The stack runs dark -> light as the segments grow: the largest segment takes
 * the palest step so the small ones stay legible against it. */
export const SPEND = {
  ramp: 'blue',
  base: viz.blue(3),
  stack: [viz.blue(5), viz.blue(3), viz.blue(1)],
}

/* The forecast horizons are separate measures, not parts of a whole, so they
 * take three distinct hues at a matched step rather than one ramp. */
export const FORECAST = [viz.blue(3), viz.teal(4), viz.purple(3)]

/* Target and plan lines: a hue that appears nowhere in the bars, so the
 * reference line never reads as another series. */
export const REFERENCE = viz.purple(3)

/* Measured actuals -- the series a forecast is judged against.
 *
 * Warm, where every forecast hue is cool, so actuals separate from the horizons
 * at a glance rather than by legend. It was #010101 before, which worked as a
 * hairline reference but turned into a wall of black the moment the series was
 * drawn as bars, and was the one colour in the chart from outside this palette. */
export const ACTUAL = viz.orange(4)

/* Outcome markers for pass/fail sequences such as the on-target strip. Softer
 * than the platform's negative/positive state colours, which are tuned to
 * interrupt -- twelve months of history should not read as twelve alerts. */
export const OUTCOME = { met: viz.green(4), missed: viz.coral(2) }
