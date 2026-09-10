import { createContext, useContext, useMemo, useState } from 'react'
import usePersistentState from './usePersistentState'

/* Workspace settings, held above every consumer.
 *
 * Two kinds of setting live here and they reach the UI by different routes:
 *
 *   - anything CSS can express (type sizes, weights, scrollbar behaviour) is
 *     published as custom properties on the shell, so the pivot restyles
 *     without re-rendering a single row;
 *   - anything only JavaScript can apply (Highcharts axis labels, the viz
 *     palette) is read from this context by the component that needs it.
 *
 * The panel edits a draft and commits on Apply, so half-made changes never
 * reach the reports -- see UserSettingsPanel.
 */

export const DEFAULT_SETTINGS = {
  dateTimeFormat: 'default',
  dateFormat: 'default',
  palette: 'tenant',
  scrollbar: 'default',
  pivotHeaderSize: 14,
  pivotHeaderWeight: 500,
  pivotRowSize: 12,
  exportPivot: 'text',
  chartXSize: 12,
  chartXWeight: 400,
  chartYSize: 12,
  chartYWeight: 400,
}

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
})

export function SettingsProvider({ children }) {
  // Preferences are the longest-lived thing here: a font size tuned once
  // should survive a reload, not just the panel staying open.
  const [settings, setSettings] = usePersistentState('settings', DEFAULT_SETTINGS)
  const value = useMemo(() => ({ settings, setSettings }), [settings])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}

/* The CSS-expressible half, as inline custom properties for the shell root.
 * Kept beside the defaults so a new setting cannot be added without deciding
 * how it reaches the page. */
export function settingsToCssVars(settings) {
  return {
    '--set-pivot-header-size': `${settings.pivotHeaderSize}px`,
    '--set-pivot-header-weight': settings.pivotHeaderWeight,
    '--set-pivot-row-size': `${settings.pivotRowSize}px`,
  }
}
