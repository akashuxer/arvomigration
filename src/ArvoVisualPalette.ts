/**
 * Arvo's canonical colors for data visualization.
 *
 * Use this palette for charts, legends, sparklines, KPI trend and movement
 * indicators, data bars, heatmaps, conditional formatting, and the visual
 * color picker. Keep a series color consistent across related views.
 *
 * For all other UI, including Arvo component surfaces, text, borders, states,
 * and feedback, use the existing Arvo Semantic Color Palette instead.
 * Determine whether KPI movement is favorable for the measure before choosing
 * a color. Pair color with text, a value, or an icon; verify contrast in each
 * theme and select a suitable shade from the same family if needed.
 */
export const ArvoVisualPalette = {
  pink: { light: '#F2B8D9', soft: '#E38ABF', bright: '#C52E8B', base: '#B60071', dark: '#96005C', darker: '#770049', darkest: '#580036' },
  red: { light: '#FFBEC5', soft: '#FF96A2', bright: '#FF465C', base: '#FF1E39', dark: '#BC1227', darker: '#931020', darkest: '#660914' },
  orange: { light: '#FFD7B9', soft: '#FFBE8F', bright: '#FF8C3B', base: '#FF7311', dark: '#D25F0C', darker: '#A44A09', darkest: '#763506' },
  yellow: { light: '#FFF9B8', soft: '#FFF48A', bright: '#FFEA2E', base: '#FFE500', dark: '#D2BB00', darker: '#A49200', darkest: '#766900' },
  indigo: { light: '#B3B1F2', soft: '#9B8DEE', bright: '#673CE1', base: '#5111DA', dark: '#410EB4', darker: '#330B8D', darkest: '#250866' },
  purple: { light: '#D8C7F0', soft: '#BFA2E7', bright: '#8D58D5', base: '#7433CC', dark: '#5F29A8', darker: '#4A2083', darkest: '#35175E' },
  green: { light: '#CBF9E7', soft: '#AEECD4', bright: '#2FE09D', base: '#00C278', dark: '#00A264', darker: '#00804F', darkest: '#015132' },
  blue: { light: '#BAD8EB', soft: '#8BC0DD', bright: '#2F8CBB', base: '#0172AA', dark: '#005D8D', darker: '#004A70', darkest: '#003753' },
  blueViolet: { light: '#B8C7FF', soft: '#8AA3FF', bright: '#2E5BFF', base: '#0037FF', dark: '#002ED2', darker: '#0024A4', darkest: '#001A76' },
} as const;

export type ArvoVisualColorFamily = keyof typeof ArvoVisualPalette;
export type ArvoVisualShade = keyof (typeof ArvoVisualPalette)['blue'];
