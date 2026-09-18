import { ArvoVisualPalette } from './ArvoVisualPalette'

/* Data-visualisation roles.
 *
 * Every colour below resolves to a shade of ArvoVisualPalette -- the canonical
 * Arvo palette for charts, sparklines, heatmaps, data bars, KPI movement and
 * conditional formatting. This file names the *roles* ("what actuals look
 * like"); the palette owns the values. Nothing here invents a hex, and no
 * consumer should: a chart asks for SPEND or ACTUAL, not for a colour.
 *
 * This replaced a twelve-hue table of values eyeballed from a swatch sheet.
 * Rule 7 -- one canonical definition -- is why that table is gone rather than
 * kept alongside: two palettes that mostly agree are the expensive kind of
 * duplicate, because the disagreements only surface in a chart nobody is
 * looking at.
 *
 * Deliberately separate from Arvo's *semantic* tokens. Those encode UI state --
 * negative, warning, positive, selected -- and reusing them for data would tie
 * the meaning of a series to the meaning of an alert. The one exception below
 * is CURRENT_PERIOD_TINT, which is genuinely a function colour and says so.
 */

const P = ArvoVisualPalette

/* Categorical sequence for multi-series charts. Ordered so adjacent series stay
 * distinguishable rather than walking round the colour wheel, and held at a
 * matched darkness so no series shouts louder than its neighbours. */
export const CATEGORICAL = [
  P.blue.bright,
  P.green.dark,
  P.purple.bright,
  P.orange.base,
  P.pink.base,
  P.blueViolet.bright,
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

/* Sequential heat. `t` is 0-1 and drives opacity within one family, which is
 * what rule 2 asks of an intensity scale -- ordered shades of a single family,
 * never a walk across hues.
 *
 * Quantised to five steps so the scale reads as bands rather than as a smear --
 * the earlier continuous version was hard to compare cell to cell -- but each
 * band is translucent, so the strip sits over its surface instead of blanking
 * it out. The ceiling stops well short of solid for the same reason. */
const HEAT_ALPHAS = [0.1, 0.24, 0.38, 0.52, 0.66]

export const heat = (t, family = 'blue') => {
  const clamped = Math.min(1, Math.max(0, t))
  const step = Math.round(clamped * (HEAT_ALPHAS.length - 1))
  return alpha(P[family].bright, HEAT_ALPHAS[step])
}

/* Diverging pair for conditional formatting, at two strengths so a grid can
 * mark "notable" and "severe" without four separate constants.
 *
 * Translucent for the same reason heat is: these tint cells that already carry
 * a number -- which is also rule 4's requirement, that the value stays readable
 * so the result never rests on colour alone. */
export const DIVERGING = {
  under: [alpha(P.red.dark, 0.16), alpha(P.red.dark, 0.34)],
  over: [alpha(P.green.dark, 0.16), alpha(P.green.dark, 0.34)],
}

/* Named roles, so a chart or KPI asks for what a colour means rather than for a
 * family and a shade. Blue stays the spend family for the summary marks -- the
 * sparkline and the intensity heat strip both encode total spend, and sharing a
 * family is what makes the KPI band read as a summary of the reports below it
 * rather than as six unrelated tiles.
 *
 * The stack is three families, not three shades of one.
 *
 * It was an ordered blue ramp on the reasoning that stacked segments are parts
 * of a whole. They are not: Price Protection, Promo Allowances and Regional
 * Incentives are three different measures that happen to sum, and rule 2 wants
 * distinguishable families for separate categories. The ramp also had to reach
 * `darker` to keep three blues apart, which is what made the chart read as a
 * dark slab.
 *
 * Bright and light shades only, so the plot stays airy: the segments sit on a
 * white tile under a dashed target line, and none of them carries text. Regional
 * Incentives is roughly 85% of every column, so it takes the palest shade -- a
 * saturated block that size sets the tone for the whole report. */
export const SPEND = {
  ramp: 'blue',
  base: P.blue.bright,
  stack: [P.blue.bright, P.green.bright, P.purple.light],
}

/* The forecast horizons are separate measures, not parts of a whole, so they
 * take three distinct families at a matched darkness rather than one ramp.
 *
 * Deliberately clear of green, red, blue and orange, which all already mean
 * something on the screen these are drawn on: the Details pivot below the
 * waterfall tints cells green and red for above/below plan, and its trend
 * column draws blue and orange sparklines. The trio used to include green.dark,
 * which made green say "60d Forecast" in the chart and "above plan" in the grid
 * eight pixels below it -- one colour, two meanings, in one view.
 *
 * Violet -> magenta: three families 45 degrees apart with their own lightness
 * spread, so they stay separable as adjacent columns and in a legend.
 *
 * All three at `soft`, not `bright` and `base`. Twelve months of grouped columns
 * means thirty-six bars filling most of the tile, and at full saturation that is
 * a wall rather than a chart -- the reference palette keeps its heavier shades
 * for thin marks and small areas. The dotted actuals line on top is the one mark
 * here that needs weight, and it only reads as the answer if the bars behind it
 * sit back.
 *
 * One shade across all three, rather than soft/soft/light: matched lightness is
 * what says these are three horizons of the same measure. A paler third made the
 * 90d bars look like a different kind of thing. */
export const FORECAST = [P.blueViolet.soft, P.purple.soft, P.pink.soft]

/* Target and plan lines: a family that appears nowhere in the bars it is drawn
 * over, so the reference never reads as another series. Indigo rather than the
 * purple it was, now that purple is a forecast horizon -- on the Scorecard the
 * Plan line and the 60d columns share a screen.
 *
 * `soft`, not `dark`: it is drawn as a thin dashed line over the columns, and at
 * full darkness it was the heaviest mark in a chart where it is the least
 * important one. A target is a threshold to notice, not a series to read. */
export const REFERENCE = P.indigo.soft

/* Measured actuals -- the series a forecast is judged against.
 *
 * Warm, where every forecast family is cool, so actuals separate from the
 * horizons at a glance rather than by legend. `dark` rather than `base`: this
 * is drawn as a 2px dotted line as often as it is drawn as bars, and orange at
 * base weight is too faint to follow across a plot (rule 6). */
export const ACTUAL = P.orange.dark

/* Outcome markers for pass/fail sequences such as the on-target strip.
 *
 * Softer than Arvo's negative/positive *state* colours, which are tuned to
 * interrupt -- twelve months of history should not read as twelve alerts. This
 * is why they come from the visual palette and not from the semantic one, even
 * though "met/missed" sounds like a state: it is data about the past, not
 * feedback about the interface. The strip carries a title per cell, so the
 * reading never depends on colour alone. */
export const OUTCOME = { met: P.green.dark, missed: P.red.soft }

/* KPI movement.
 *
 * Not "up is green": rule 3. Whether a rise is favourable depends on the
 * measure -- spend over target is bad, growth over plan is good -- so the caller
 * passes the verdict it has already worked out, and this only maps that verdict
 * to a colour. Every consumer pairs it with a direction icon and the value. */
/* KPI indicators -- the delta figures, direction arrows and small meters that
 * sit on a white card.
 *
 * These are the one place in the palette where the *dark* end is correct and the
 * bright end is not, which is the opposite of the charts above. A chart series
 * is a large filled area, so saturation there becomes a slab; an indicator is
 * 12px of text or a 2px arrow, and a light shade on white simply cannot be read.
 *
 * Contrast against s-layer-01 (#fff), measured rather than assumed:
 *
 *   favorable    green.darker    #00804F   5.00:1   AA
 *   unfavorable  red.dark        #BC1227   6.45:1   AA
 *   caution      yellow.darkest  #766900   5.54:1   AA
 *   neutral      blue.dark       #005D8D   7.12:1   AAA
 *
 * All four clear 4.5:1, so they are safe as small text, not only as blocks.
 * Caution is the reason this reaches to `darkest` in one family and stops at
 * `dark` or `darker` in the others -- yellow is the palette's lightest hue and
 * `darker` (#A49200) measures only 3.14:1, which is a graphics-only pass and
 * would have failed the moment someone set a percentage in it.
 *
 * None of these is pushed further than it needs to be: the stop chosen per
 * family is the first one that clears AA, which is what keeps them from reading
 * as the near-black the earlier chart colours did. And every consumer pairs the
 * colour with a sign and a number, so the reading never rests on hue -- rule 4,
 * and what keeps these usable for anyone who cannot separate red from green. */
export const INDICATOR = {
  favorable: P.green.darker,
  unfavorable: P.red.dark,
  caution: P.yellow.darkest,
  neutral: P.blue.dark,
}

/* The current period.
 *
 * Arvo already names this: `s-fn-currenttime` is the function colour for "this
 * is now", and the pivot ships a `--currenttime` cell class that uses it. So
 * this is not a palette decision at all -- the chart reads the same token the
 * grid does, and the two marks cannot drift. Rule 8's boundary in the other
 * direction: a function colour is interface meaning, not data.
 *
 * Softened for the plot area, where it sits under bars and gridlines that have
 * to stay readable through it; the grid cell takes the token at full strength
 * because nothing is drawn on top of a header. */
export const CURRENT_PERIOD_TINT = 'rgba(239, 188, 92, 0.22)'

/* KPI movement, which is the same set of colours asked for by a different
 * question. Kept as a name because a caller saying MOVEMENT.favorable is
 * stating a verdict about a measure, where INDICATOR.favorable is describing a
 * mark -- and rule 3 turns on callers having already decided which. */
export const MOVEMENT = INDICATOR
