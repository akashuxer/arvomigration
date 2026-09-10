import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
  ArvoButton,
  ArvoCombobox,
  ArvoIconButton,
  ArvoMultiSelect,
  ArvoNumberInput,
  ArvoRadio,
  ArvoRadioGroup,
} from '@arvo/react'

/* Bulk Edit — Copy, Adjust and Apply.
 *
 * One form, three verbs. They ask the same two questions in the same order --
 * which measures, and over which slice of the grid -- and differ only in what
 * happens to the measure in between, so they share a component rather than
 * three that drift apart.
 *
 *   Adjust  increase or decrease a measure by a percentage or a value
 *   Copy    write one measure's numbers into another
 *   Apply   set a measure to a value outright
 *
 * Two rules the legacy dialog left implicit:
 *
 * 1. Nothing is editable until a measure is chosen. Increase-by-5%-of-nothing
 *    is not a half-finished instruction, it is a meaningless one, and a form
 *    that lets you fill it in is a form that has to reject it afterwards.
 *
 * 2. The scope fields are read-only. Account, Product, SKU and Time carry what
 *    the pivot is currently showing; they are changed through the picker behind
 *    the + rather than typed into, because a bulk edit aimed at a mistyped
 *    account is the expensive kind of mistake.
 */

const MEASURES = [
  { id: 'sku-mix-actuals', value: 'sku-mix-actuals', label: 'SKU Mix % Actuals' },
  { id: 'sku-mix-planner', value: 'sku-mix-planner', label: 'SKU Mix % Planner' },
  { id: 'sku-mix-lc', value: 'sku-mix-lc', label: 'SKU Mix % LC' },
  { id: 'sku-mix-consensus', value: 'sku-mix-consensus', label: 'SKU Mix % Consensus' },
  { id: 'units-actuals', value: 'units-actuals', label: 'Units Actuals' },
  { id: 'units-planner', value: 'units-planner', label: 'Units Planner' },
  { id: 'trade-spend', value: 'trade-spend', label: 'Trade Spend' },
  { id: 'trade-spend-target', value: 'trade-spend-target', label: 'Target Trade Spend' },
  { id: 'price-protection', value: 'price-protection', label: 'Price Protection' },
  { id: 'promo-allowance', value: 'promo-allowance', label: 'Promo Allowance' },
  { id: 'forecast-30', value: 'forecast-30', label: '30d Forecast' },
  { id: 'forecast-60', value: 'forecast-60', label: '60d Forecast' },
  { id: 'forecast-90', value: 'forecast-90', label: '90d Forecast' },
  { id: 'consensus', value: 'consensus', label: 'Consensus Forecast' },
]

/* The slice the edit lands on. These mirror the pivot's current filters, which
 * is why they arrive populated and read-only. */
const SCOPE = [
  { id: 'account', label: 'Account', values: ['Customer_18'] },
  { id: 'product', label: 'Product', values: ['SKU'] },
  { id: 'sku', label: 'SKU', values: ['P_9000_1', 'P_9000_2', 'P_9000_3'] },
  { id: 'time', label: 'Time', values: ['Day'] },
  { id: 'period', label: 'Period', values: ['M06-2019'] },
  { id: 'version', label: 'Version', values: ['Current Working View'] },
]

const TITLES = {
  copy: 'Bulk Edit — Copy',
  adjust: 'Bulk Edit — Adjust',
  apply: 'Bulk Edit — Apply',
}

let seq = 0
const newRow = () => ({
  id: `row-${(seq += 1)}`,
  measure: '',
  source: '',
  direction: 'increase',
  by: 'percent',
  value: '',
})

/* A row is finished when its measure is set and whatever that verb needs
 * alongside it is too. */
const isComplete = (row, mode) => {
  if (!row.measure) return false
  if (mode === 'copy') return Boolean(row.source)
  return String(row.value ?? '').trim() !== ''
}

const BulkEditForm = forwardRef(function BulkEditForm({ mode, onPickScope, onSummaryChange }, ref) {
  const [rows, setRows] = useState(() => [newRow()])

  const patchRow = (rowId, patch) =>
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)))

  const complete = rows.filter((row) => isComplete(row, mode))
  const started = rows.filter(
    (row) => row.measure || row.source || String(row.value ?? '').trim(),
  )
  const ignored = started.length - complete.length

  useImperativeHandle(ref, () => ({
    collect: () => ({ mode, rows: complete, scope: SCOPE }),
    reset: () => setRows([newRow()]),
  }))

  /* What the form adds up to, in the footer beside the buttons. A bulk edit is
     the kind of action people want to read back before committing. */
  const summary = (() => {
    if (!complete.length) return ''
    const label = (value) => MEASURES.find((m) => m.value === value)?.label ?? ''
    const sentences = complete.map((row) => {
      if (mode === 'copy') return `${label(row.source)} → ${label(row.measure)}`
      if (mode === 'apply') return `${label(row.measure)} = ${row.value}`
      const sign = row.direction === 'increase' ? '+' : '−'
      return `${label(row.measure)} ${sign}${row.value}${row.by === 'percent' ? '%' : ''}`
    })
    const scope = SCOPE.flatMap(({ values }) => values).length
    return `${sentences.join(', ')} across ${scope} selected member${scope === 1 ? '' : 's'}`
  })()

  const footerText =
    ignored > 0
      ? `${summary ? `${summary}. ` : ''}${ignored} incomplete row${
          ignored === 1 ? ' will be' : 's will be'
        } ignored`
      : summary

  // In an effect, not during render: calling back into a parent's setState
  // while rendering is how you get an update-during-render warning and, in
  // React 19, a dropped update.
  useEffect(() => {
    onSummaryChange?.(footerText)
  }, [footerText, onSummaryChange])

  return (
    <div className="bulk">
      <div className="bulk__toolbar">
        <ArvoButton
          label="Add measure"
          icon="plus"
          variant="secondary"
          size="sm"
          onClick={() => setRows((current) => [...current, newRow()])}
        />
      </div>

      {/* Column names once, above the rows. */}
      <div className={`bulk__labels bulk__labels--${mode}`} aria-hidden="true">
        <span>To measure</span>
        {mode === 'copy' && <span>Copy from</span>}
        {mode === 'adjust' && (
          <>
            <span>Increase / decrease</span>
            <span>By</span>
          </>
        )}
        {mode !== 'copy' && <span>Value</span>}
        <span />
      </div>

      <ol className="bulk__rows">
        {rows.map((row) => {
          /* Everything downstream of the measure waits for it.
             *
             * Disabled here, not read-only: these controls are genuinely
             * unavailable until a measure exists, and Arvo's read-only
             * treatment (the dashed underline) means "settled, changed
             * elsewhere" -- which is what the scope fields below are, and what
             * these are not. */
          const isReady = Boolean(row.measure)
          return (
            <li className={`bulk__row bulk__row--${mode}`} key={row.id}>
              {/* Combobox, not multi-select: one row edits one measure, and a
                  row that could hold several would make "increase by 5%" mean
                  something different per measure without saying so. */}
              <ArvoCombobox
                aria-label="To measure"
                placeholder="Select measure"
                items={MEASURES}
                /* null, not '': an empty string is a value the combobox tries
                   to resolve against its items, and this build answers by
                   selecting the first one -- so the form opened with a measure
                   nobody had chosen and every gated control already unlocked. */
                value={row.measure || null}
                isFullWidth
                /* No clear button: the row itself is the unit you remove, and
                   an X that empties the measure while leaving its adjustment
                   behind is a half-row nobody asked for. */
                isClearable={false}
                onChange={(value) =>
                  patchRow(row.id, { measure: typeof value === 'string' ? value : value?.value })
                }
              />

              {mode === 'copy' && (
                <ArvoCombobox
                  aria-label="Copy from"
                  placeholder="Select source"
                  items={MEASURES.filter(({ value }) => value !== row.measure)}
                  value={row.source || null}
                  isClearable={false}
                  isDisabled={!isReady}
                  isFullWidth
                  onChange={(value) =>
                    patchRow(row.id, { source: typeof value === 'string' ? value : value?.value })
                  }
                />
              )}

              {mode === 'adjust' && (
                <>
                  <ArvoRadioGroup
                    name={`direction-${row.id}`}
                    orientation="horizontal"
                    value={row.direction}
                    isDisabled={!isReady}
                    onChange={({ value }) => patchRow(row.id, { direction: value })}
                  >
                    <ArvoRadio value="increase" label="Increase" />
                    <ArvoRadio value="decrease" label="Decrease" />
                  </ArvoRadioGroup>

                  <ArvoRadioGroup
                    name={`by-${row.id}`}
                    orientation="horizontal"
                    value={row.by}
                    isDisabled={!isReady}
                    onChange={({ value }) => patchRow(row.id, { by: value })}
                  >
                    <ArvoRadio value="percent" label="%" />
                    <ArvoRadio value="value" label="Value" />
                  </ArvoRadioGroup>
                </>
              )}

              {mode !== 'copy' && (
                <ArvoNumberInput
                  aria-label="Value"
                  placeholder="0"
                  isFullWidth
                  isDisabled={!isReady}
                  value={row.value}
                  onInput={(event) => patchRow(row.id, { value: event.target.value })}
                />
              )}

              {rows.length > 1 ? (
                <ArvoIconButton
                  icon="trash"
                  tooltip="Remove measure"
                  variant="tertiary"
                  size="sm"
                  onClick={() =>
                    setRows((current) => current.filter(({ id }) => id !== row.id))
                  }
                />
              ) : (
                <span />
              )}
            </li>
          )
        })}
      </ol>

      {/* Scope. Read-only always, and never gated on the measure.
          *
          * These fields are not downstream of To measure -- they report the
          * slice the pivot is already showing, which is true before any measure
          * is chosen and stays true after. Only the controls to the right of To
          * measure depend on it, because only they are describing what happens
          * to that measure. */}
      <div className="bulk__scope">
        {SCOPE.map(({ id, label, values }) => (
          <div className="bulk__field" key={id}>
            <span className="bulk__field-label">
              {label} <span className="bulk__required">*</span>
            </span>
            <div className="bulk__field-row">
              {/* ArvoMultiSelect in its read-only state, rather than a tray
                  of chips built here.
                  *
                  * It is the component that already owns this shape: chips that
                  * cannot be removed, no typing, no panel, and the read-only
                  * context propagating into the chips so they match every other
                  * settled field in the product. Hand-rolling it meant
                  * maintaining a lookalike that would drift the first time the
                  * chip or the field changed. */}
              <ArvoMultiSelect
                aria-label={label}
                isReadOnly
                /* Read-only is documented as suppressing the clear affordance,
                   but this build still renders it -- passing false explicitly
                   is what actually removes it. */
                isClearable={false}
                isFullWidth
                items={values.map((value) => ({ id: value, value, label: value }))}
                value={values}
              />

              <ArvoIconButton
                icon="plus"
                tooltip={`Choose ${label}`}
                variant="tertiary"
                size="sm"
                onClick={() => onPickScope(label)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export { TITLES as BULK_EDIT_TITLES }
export default BulkEditForm
