import { useEffect, useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import { ArvoVisualPalette } from '../ArvoVisualPalette'
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
 * choice is about what the charts will look like.
 *
 * Drawn from ArvoVisualPalette, never from hexes typed here.
 *
 * This is a visual colour picker in miniature, so rule 5 applies: what is shown
 * is a selection of the canonical palette, and what is stored is a palette
 * value the charts can resolve -- not a colour copied out of a mockup.
 *
 * The colorblind row deliberately steps *shades* as much as families: it stays
 * legible when hue is unavailable, which is the whole claim the option makes. */
const PALETTES = [
  {
    value: 'tenant',
    label: 'Tenant palette',
    hint: 'Matches your workspace branding.',
    colors: [
      ArvoVisualPalette.blue.light,
      ArvoVisualPalette.blueViolet.bright,
      ArvoVisualPalette.green.dark,
      ArvoVisualPalette.purple.bright,
      ArvoVisualPalette.orange.base,
    ],
  },
  {
    value: 'colorblind',
    label: 'Colorblind safe',
    hint: 'Still tells colours apart if you find some hard to distinguish.',
    colors: [
      ArvoVisualPalette.blue.light,
      ArvoVisualPalette.blue.bright,
      ArvoVisualPalette.yellow.darker,
      ArvoVisualPalette.pink.dark,
      ArvoVisualPalette.green.darkest,
    ],
  },
]

/* How much space the reports give themselves.
 *
 * Two steps, not three. A density control earns its place by making a visible
 * difference; "Default" sitting between comfortable and compact would be a third
 * option nobody can describe, and the honest version of it is just whichever of
 * the two is the default -- which Comfortable is.
 *
 * The preview is a miniature of the thing it changes -- two stacked cards with a
 * gap between them, padding inside them and rows within that -- because all
 * three move together and a picture of rows alone would describe a third of the
 * setting. Its proportions come from the same variables the layout uses, so it
 * cannot drift from what pressing the option actually does.
 *
 * The copy names none of that. "Gaps", "padding" and "row height" are how this
 * is built, not what anyone is choosing between -- a planner picking a density
 * is deciding whether they would rather read comfortably or scroll less, and
 * that is the sentence each option gets. The preview carries the mechanics. */
const DENSITY_OPTIONS = [
  {
    value: 'comfortable',
    label: 'Comfortable',
    hint: 'More breathing space. Easier to read when you’re working through a report.',
    cards: [2, 2],
  },
  {
    value: 'compact',
    label: 'Compact',
    hint: 'Fits more on screen, so you scroll less.',
    cards: [3, 4],
  },
]

const SCROLLBAR_OPTIONS = [
  { value: 'default', label: 'Default', hint: 'Follows your computer’s own setting.' },
  { value: 'always', label: 'Always visible', hint: 'Stays on screen whenever there is more to scroll to.' },
  { value: 'hover', label: 'On hover', hint: 'Appears when you move over the area.' },
  { value: 'scroll', label: 'On scroll', hint: 'Appears while you scroll, then fades away.' },
]

/* Whether a report tile's toolbar is always there or arrives with the pointer.
 *
 * Both are defensible and which is right depends on the person: someone editing
 * all day wants the controls where their hand already is, someone presenting a
 * board wants the numbers and nothing else. Naming the trade-off in the hint is
 * what makes this a choice rather than a coin toss. */
const TILE_ACTION_OPTIONS = [
  {
    value: 'always',
    label: 'Always visible',
    hint: 'Buttons are always there, ready to use.',
  },
  {
    value: 'hover',
    label: 'Reveal on hover',
    hint: 'Buttons appear when you move over a report, so the page stays clear while you read.',
  },
]

/* A miniature report header: the title on the left, its buttons on the right.
 *
 * Worth a picture for the same reason density was. The difference between these
 * two is a state you cannot see while you are reading about it -- one of them is
 * defined by what is *not* on screen until you move the pointer -- and "buttons
 * appear when you move over a report" is a sentence you have to imagine your way
 * through. Drawn once as solid and once as outlines, the choice is just visible.
 */
function ControlsPreview({ value }) {
  return (
    <span className={`ctrl-preview ctrl-preview--${value}`} aria-hidden="true">
      <span className="ctrl-preview__title" />
      <span className="ctrl-preview__buttons">
        <span />
        <span />
        <span />
      </span>
      {/* A pointer, on the hover option only.
       *
       * The dashed outlines say the buttons are drawn on demand; the cursor says
       * what does the drawing. Without it the outlines could be read as "these
       * are switched off", which is the opposite of what the setting means.
       * Aimed at the buttons rather than parked beside them -- it is the act of
       * pointing that is being illustrated. */}
      {value === 'hover' && (
        <svg className="ctrl-preview__cursor" viewBox="0 0 12 16" aria-hidden="true">
          <path
            d="M1 1 L1 12.5 L4 9.6 L6.2 14.5 L8.4 13.5 L6.2 8.8 L10.3 8.8 Z"
            fill="currentColor"
            stroke="var(--arvo-color-s-layer-01, #fff)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

/* Where a chart's series names live.
 *
 * "Upfront" is the default because a chart whose colours are unexplained is a
 * picture rather than a reading -- but on a dense board the legend is a band of
 * text repeated under every tile, and moving it into the report's own settings
 * buys that space back. */
const CHART_LEGEND_OPTIONS = [
  {
    value: 'chart',
    label: 'Below every chart',
    hint: 'Always in view under the chart. Click a name to hide that line or bar.',
  },
  {
    value: 'settings',
    label: 'In the report’s Chart settings',
    hint: 'Tucked away behind the report’s settings, giving the chart itself more room.',
  },
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

/* Vertical rules between pivot columns.
 *
 * On hover by default: a full grid of lines boxes every number in, and the row
 * bands plus the column alignment already do the separating for reading. The
 * lines earn their place when you are working *across* a row -- tracing one
 * customer out to M09 -- which is exactly when the pointer is in the grid.
 * Always-visible is there for anyone who reads a dense pivot as a table rather
 * than as a chart of numbers. */
const DIVIDER_MODES = [
  { value: 'hover', label: 'On hover' },
  { value: 'always', label: 'Always' },
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
              description="Used by charts, heatmaps and the colour shading in tables."
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

            <Section
              title="Density"
              description="How tightly everything is packed on screen."
            >
              <ArvoRadioGroup
                name="density"
                value={settings.density}
                onChange={({ value }) => set('density')(value)}
              >
                {DENSITY_OPTIONS.map(({ value, label, hint, cards }) => (
                  <div
                    key={value}
                    className={`pref-card${
                      settings.density === value ? ' pref-card--on' : ''
                    }`}
                  >
                    <span className="pref-card__text">
                      <ArvoRadio value={value} label={label} />
                      <span className="pref-choice__hint">{hint}</span>
                    </span>
                    {/* Decorative: the radio and its label are the control, and a
                        screen reader gains nothing from a stack of empty divs. */}
                    <span
                      className={`density-preview density-preview--${value}`}
                      aria-hidden="true"
                    >
                      {cards.map((rows, card) => (
                        <span className="density-preview__card" key={card}>
                          {Array.from({ length: rows }, (_, row) => (
                            <span className="density-preview__row" key={row} />
                          ))}
                        </span>
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

            <Section
              title="Report controls"
              description="The Download, Bulk Edit and Filters buttons on each report."
            >
              <ArvoRadioGroup
                name="tileActions"
                value={settings.tileActions}
                onChange={({ value }) => set('tileActions')(value)}
              >
                {TILE_ACTION_OPTIONS.map(({ value, label, hint }) => (
                  <div
                    key={value}
                    className={`pref-card${
                      settings.tileActions === value ? ' pref-card--on' : ''
                    }`}
                  >
                    <span className="pref-card__text">
                      <ArvoRadio value={value} label={label} />
                      <span className="pref-choice__hint">{hint}</span>
                    </span>
                    <ControlsPreview value={value} />
                  </div>
                ))}
              </ArvoRadioGroup>
            </Section>

            <Section
              title="Chart legend"
              description="Where to show the colour key that says what each line and bar means."
            >
              <ArvoRadioGroup
                name="chartLegend"
                value={settings.chartLegend}
                onChange={({ value }) => set('chartLegend')(value)}
              >
                {CHART_LEGEND_OPTIONS.map(({ value, label, hint }) => (
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
                description="The row of column names at the top of every table."
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
                description="The numbers below the column names."
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
                caption="Column dividers"
                description="The lines that separate one column from the next."
              >
                <Field label="Show">
                  <Segmented
                    value={settings.pivotDividers}
                    items={DIVIDER_MODES}
                    onChange={set('pivotDividers')}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup
                caption="Export"
                description="How numbers are saved when you download a report."
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
                description="The labels along the bottom of a chart."
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
