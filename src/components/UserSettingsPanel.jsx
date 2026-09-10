import { useEffect, useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import {
  ArvoButtonGroup,
  ArvoCombobox,
  ArvoRadio,
  ArvoRadioGroup,
  ArvoTabstrip,
} from '@arvo/react'

/* User preferences.
 *
 * Two decisions shape the whole panel:
 *
 *   Segmented controls, not dropdowns, wherever the option set is small and the
 *   values are short. A dropdown hides four numbers behind a click and says
 *   nothing about the range; a segmented control shows the whole scale at once
 *   and makes the current value a position rather than a word. Only the date
 *   formats stay a combobox -- those values are long and there are more of them
 *   than fit in a row.
 *
 *   Every change applies live. These are all visual settings and the reports
 *   are on screen beside the panel, so the change is its own preview. A commit
 *   step would mean choosing a size, seeing nothing move, and hunting for the
 *   button that makes it real.
 */

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'reports', label: 'Reports' },
]

/* Format patterns, not rendered examples. A pattern says what every field will
 * look like; a single example ("31 May 2019") leaves you guessing whether the
 * month is always spelled out or only in May. */
const asItems = (patterns) =>
  patterns.map((pattern) => ({
    id: pattern,
    value: pattern,
    label: pattern === 'default' ? 'Default Format' : pattern,
  }))

const DATE_TIME_FORMATS = asItems([
  'default',
  'yyyy/MM/dd HH:mm:ss',
  'yyyy/MM/dd HH:mm',
  'dd-MM-yyyyTHH:mm:ss',
  'dd-MMM-yyyyTHH:mm:ss',
  'dd-MMM-yyyy HH:mm:ss',
  'dd-MMM-yyyy HH:mm',
  'ddd MMM dd yyyy HH:mm:ss',
  'MMM/dd/yyyy HH:mm:ss',
  'MM/dd/yyyy HH:mm',
])

const DATE_FORMATS = asItems([
  'default',
  'MMM/dd/yyyy',
  'MM/dd/yyyy',
  'MM/dd/yy',
  'MM.dd.yyyy',
  'yyyy/MM/dd',
  'dd/MMM/yyyy',
  'dd/MM/yyyy',
  'dd.MM.yyyy',
])

/* The swatches are the palette itself, not an illustration of it -- the whole
 * choice is about what the charts will look like. */
const PALETTES = [
  {
    value: 'tenant',
    label: 'Tenant palette',
    hint: 'Matches your workspace branding',
    colors: ['#bfcbfb', '#2f77f0', '#00a273', '#7a4fd4', '#f98131'],
  },
  {
    value: 'colorblind',
    label: 'Colorblind safe',
    hint: 'Distinguishable without relying on hue',
    colors: ['#bcd6ec', '#2e8fbe', '#c08b00', '#99005f', '#04701f'],
  },
]

const SCROLLBAR_OPTIONS = [
  { value: 'default', label: 'Default', hint: 'Follows your operating system' },
  { value: 'always', label: 'Always visible', hint: 'Never hides while content overflows' },
  { value: 'hover', label: 'On hover', hint: 'Appears when the pointer is over the area' },
  { value: 'scroll', label: 'On scroll', hint: 'Appears while scrolling, then fades' },
]

const FONT_SIZES = [12, 14, 16, 18]

/* Arvo's three weight tokens: $arvo-regular (400), $arvo-medium (500),
 * $arvo-bold (700). There is no semibold -- 600 is not defined anywhere in the
 * system -- so the third option is Bold, which is the weight that exists. */
const FONT_WEIGHTS = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '700', label: 'Bold' },
]

const EXPORT_MODES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
]

/* One attribute of the thing named by the FieldGroup above it.
 *
 * Labels are single words -- "Size", "Weight" -- because the subject is stated
 * once by the group rather than repeated in every row. That is what lets label
 * and control share a line at 320px, which halves the height of the tab. */
function Field({ label, hint, children }) {
  return (
    <div className={`pref-field${hint ? ' pref-field--stacked' : ''}`}>
      <span className="pref-field__label">{label}</span>
      {hint && <span className="pref-field__hint">{hint}</span>}
      {children}
    </div>
  )
}

/* Names the thing its fields describe -- "Column header", "X-axis labels".
 * Size and weight are two attributes of one subject, not two settings, and
 * saying the subject once is what removes the repetition.
 */
function FieldGroup({ caption, description, children }) {
  return (
    <div className="pref-group">
      <span className="pref-group__caption">{caption}</span>
      {description && <span className="pref-group__desc">{description}</span>}
      {children}
    </div>
  )
}

function Segmented({ value, items, onChange }) {
  return (
    <ArvoButtonGroup
      items={items}
      value={String(value)}
      size="sm"
      variant="secondary"
      onChange={({ value: next }) => next != null && onChange(next)}
    />
  )
}

function Section({ id, title, description, icon, isFlashed, children }) {
  return (
    <section
      className={`pref-section${isFlashed ? ' pref-section--flash' : ''}`}
      data-pref-section={id}
    >
      <h3 className="pref-section__title">
        {icon && (
          <span className={`pref-section__ico o9con o9con-${icon}`} aria-hidden="true" />
        )}
        {title}
      </h3>
      {description && <p className="pref-section__desc">{description}</p>}
      <div className="pref-section__body">{children}</div>
    </section>
  )
}


/* A combobox that opens when you click it.
 *
 * Arvo's opens from its chevron only -- clicking the field puts a caret in it
 * and leaves the list closed, so the whole set of formats is invisible unless
 * you happen to aim at the 20px arrow. These are a menu of options to pick
 * from, not a search box, and picking is the common case: the field opens the
 * list, and typing still filters it. */
function FormatCombobox({ label, items, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      className="prefs__combo"
      onMouseDown={(event) => {
        if (event.target.closest('button')) return
        if (!isOpen) setIsOpen(true)
      }}
    >
      <ArvoCombobox
        label={label}
        items={items}
        value={value}
        onChange={onChange}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isFullWidth
      />
    </div>
  )
}

export default function UserSettingsPanel({ settings, onChange, focus }) {
  const [tab, setTab] = usePersistentState('settings.tab', 'general')
  const [flash, setFlash] = useState(null)
  const bodyRef = useRef(null)

  /* Selecting a report in the workspace brings its settings into view.
   *
   * The tab switch and the scroll cannot happen together: the Reports sections
   * do not exist in the DOM while General is showing, so the scroll runs in a
   * second pass once `tab` has actually changed and React has committed the
   * new markup. `focus` carries a token rather than a bare id so that clicking
   * the same report twice still scrolls -- a plain id would be unchanged state
   * and the effect would not re-run. */
  useEffect(() => {
    if (focus?.section) setTab('reports')
  }, [focus])

  useEffect(() => {
    if (!focus?.section || tab !== 'reports') return
    const target = bodyRef.current?.querySelector(
      `[data-pref-section="${focus.section}"]`,
    )
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    /* A brief mark on the section that was asked for.
     *
     * Scrolling alone is not always visible feedback: when the section is
     * already in view there is nothing to move, and the click looks ignored.
     * This confirms which settings you landed on either way. */
    setFlash(focus.section)
    const timer = setTimeout(() => setFlash(null), 900)
    return () => clearTimeout(timer)
  }, [focus, tab])

  const set = (key) => (value) => onChange({ ...settings, [key]: value })
  const setNumber = (key) => (value) => set(key)(Number(value))
  const sizeItems = FONT_SIZES.map((size) => ({ value: String(size), label: String(size) }))

  return (
    <div className="prefs">
      <ArvoTabstrip
        tabs={TABS}
        selectedId={tab}
        onSelect={(selected) => setTab(selected?.id ?? selected)}
        isFullWidth
      />

      <div
        ref={bodyRef}
        className={`prefs__body${tab === 'reports' ? ' prefs__body--reports' : ''}`}
      >
        {tab === 'general' ? (
          <>
            <Section title="Date & Time">
              <FormatCombobox
                label="Date and time format"
                items={DATE_TIME_FORMATS}
                value={settings.dateTimeFormat}
                onChange={set('dateTimeFormat')}
              />
              <FormatCombobox
                label="Date format"
                items={DATE_FORMATS}
                value={settings.dateFormat}
                onChange={set('dateFormat')}
              />
            </Section>

            <Section
              title="Color Palette"
              description="Used by charts, heatmaps and conditional formatting."
            >
              <ArvoRadioGroup
                name="palette"
                value={settings.palette}
                onChange={({ value }) => set('palette')(value)}
              >
                {PALETTES.map(({ value, label, hint, colors }) => (
                  /* The swatch sits below the label rather than beside it, so
                     the preview gets the full width and reads as a palette
                     instead of five specks. */
                  <div
                    key={value}
                    className={`palette-card${
                      settings.palette === value ? ' palette-card--on' : ''
                    }`}
                  >
                    <ArvoRadio value={value} label={label} />
                    <span className="palette-card__hint">{hint}</span>
                    <span className="palette-card__swatch" aria-hidden="true">
                      {colors.map((color) => (
                        <span key={color} style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </div>
                ))}
              </ArvoRadioGroup>
            </Section>

            <Section title="Scrollbars" description="When scrollbars appear inside reports.">
              <ArvoRadioGroup
                name="scrollbar"
                value={settings.scrollbar}
                onChange={({ value }) => set('scrollbar')(value)}
              >
                {SCROLLBAR_OPTIONS.map(({ value, label, hint }) => (
                  <div className="pref-choice" key={value}>
                    <ArvoRadio value={value} label={label} />
                    <span className="pref-choice__hint">{hint}</span>
                  </div>
                ))}
              </ArvoRadioGroup>
            </Section>
          </>
        ) : (
          <>
            <Section id="pivot" icon="pivot" title="Pivot" isFlashed={flash === 'pivot'}>
              <FieldGroup
                caption="Column header"
                description="The row of column names at the top of every grid."
              >
                <Field label="Size">
                  <Segmented
                    value={settings.pivotHeaderSize}
                    items={sizeItems}
                    onChange={setNumber('pivotHeaderSize')}
                  />
                </Field>
                <Field label="Weight">
                  <Segmented
                    value={settings.pivotHeaderWeight}
                    items={FONT_WEIGHTS}
                    onChange={setNumber('pivotHeaderWeight')}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup
                caption="Rows"
                description="Every data cell beneath the header."
              >
                <Field label="Size">
                  <Segmented
                    value={settings.pivotRowSize}
                    items={sizeItems}
                    onChange={setNumber('pivotRowSize')}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup
                caption="Export"
                description="How numbers are written to a downloaded file."
              >
                <Field label="Values as">
                  <Segmented
                    value={settings.exportPivot}
                    items={EXPORT_MODES}
                    onChange={set('exportPivot')}
                  />
                </Field>
              </FieldGroup>
            </Section>

            <Section id="chart" icon="bar-chart" title="Chart" isFlashed={flash === 'chart'}>
              <FieldGroup
                caption="X-axis labels"
                description="The category names along the bottom of a chart."
              >
                <Field label="Size">
                  <Segmented
                    value={settings.chartXSize}
                    items={sizeItems}
                    onChange={setNumber('chartXSize')}
                  />
                </Field>
                <Field label="Weight">
                  <Segmented
                    value={settings.chartXWeight}
                    items={FONT_WEIGHTS}
                    onChange={setNumber('chartXWeight')}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup
                caption="Y-axis labels"
                description="The value scale up the side of a chart."
              >
                <Field label="Size">
                  <Segmented
                    value={settings.chartYSize}
                    items={sizeItems}
                    onChange={setNumber('chartYSize')}
                  />
                </Field>
                <Field label="Weight">
                  <Segmented
                    value={settings.chartYWeight}
                    items={FONT_WEIGHTS}
                    onChange={setNumber('chartYWeight')}
                  />
                </Field>
              </FieldGroup>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
