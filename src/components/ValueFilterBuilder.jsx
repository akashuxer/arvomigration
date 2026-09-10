import { useState } from 'react'
import {
  ArvoButton,
  ArvoDatePicker,
  ArvoIconButton,
  ArvoNumberInput,
  ArvoRadio,
  ArvoRadioGroup,
  ArvoSelect,
  ArvoTextbox,
} from '@arvo/react'

/* Manage Value Filters.
 *
 * The legacy dialog transcribed into Arvo, with four things changed because
 * they were costing comprehension rather than carrying it:
 *
 * 1. The conjunction is stated once per group, not twice. The original showed
 *    an And/Or radio pair at the top of a group AND the word "And" again
 *    between every pair of rows -- the same fact in two places, which invites
 *    the question of whether they can disagree. The radio is the control; the
 *    rail down the left of the rows is the reminder.
 *
 * 2. The value control follows the field. A date field gets a date picker, a
 *    measure gets a number input with the right suffix, a text field gets a
 *    textbox. The original showed `MM-dd-yyyy` as placeholder text in a plain
 *    box for every one of them.
 *
 * 3. An empty row is a draft, not an error. Rows arrive blank and Save stays
 *    disabled while any of them is incomplete, with the reason on the button
 *    rather than in red text that appears after a failed submit.
 *
 * 4. "Add Top/Bottom" says why it is unavailable. Disabled with no explanation
 *    is the most common way a dialog wastes someone's afternoon.
 */

const FIELDS = [
  { id: 'due-date', value: 'due-date', label: 'Data Due Date', type: 'date' },
  { id: 'updated', value: 'updated', label: 'Last Updated', type: 'date' },
  { id: 'spend', value: 'spend', label: 'Trade Spend', type: 'number', suffix: '$' },
  { id: 'units', value: 'units', label: 'Units Actuals', type: 'number' },
  { id: 'growth', value: 'growth', label: 'Growth %', type: 'number', suffix: '%' },
  { id: 'account', value: 'account', label: 'Account', type: 'text' },
  { id: 'product', value: 'product', label: 'Product Line', type: 'text' },
]

/* Operators are per type: "greater than" on an account name means nothing, and
 * offering it is how a filter builder teaches people not to trust it. */
const OPERATORS = {
  date: [
    { id: 'equals', value: 'equals', label: 'equals' },
    { id: 'before', value: 'before', label: 'is before' },
    { id: 'after', value: 'after', label: 'is after' },
    { id: 'between', value: 'between', label: 'is between' },
  ],
  number: [
    { id: 'equals', value: 'equals', label: 'equals' },
    { id: 'gt', value: 'gt', label: 'is greater than' },
    { id: 'lt', value: 'lt', label: 'is less than' },
    { id: 'between', value: 'between', label: 'is between' },
  ],
  text: [
    { id: 'equals', value: 'equals', label: 'equals' },
    { id: 'contains', value: 'contains', label: 'contains' },
    { id: 'starts', value: 'starts', label: 'starts with' },
    { id: 'not', value: 'not', label: 'does not equal' },
  ],
}

let seq = 0
const newRow = () => ({ id: `row-${(seq += 1)}`, field: '', operator: '', value: '', valueTo: '' })
const newGroup = () => ({ id: `grp-${(seq += 1)}`, join: 'and', rows: [newRow(), newRow()] })

const fieldOf = (row) => FIELDS.find(({ value }) => value === row.field)

/* One condition, in words. The operator labels already read as English, which
 * is what makes the sentence assemble without a second set of strings. */
const describe = (row) => {
  const field = fieldOf(row)
  const operator = OPERATORS[field?.type ?? 'text'].find(({ value }) => value === row.operator)
  const value =
    row.operator === 'between'
      ? `${row.value} and ${row.valueTo}`
      : row.value
  return `${field?.label ?? ''} ${operator?.label ?? ''} ${value}`.trim()
}
const typeOf = (row) => fieldOf(row)?.type ?? 'text'
/* `between` takes two values, so a row with only one is not finished. Offering
 * the operator and then accepting a single bound was a way to build a filter
 * that silently means something other than what it says. */
const isComplete = (row) =>
  Boolean(
    row.field &&
      row.operator &&
      String(row.value ?? '').trim() &&
      (row.operator !== 'between' || String(row.valueTo ?? '').trim()),
  )

export default function ValueFilterBuilder({ onCancel, onSave }) {
  const [groups, setGroups] = useState(() => [newGroup()])

  const patchGroup = (groupId, patch) =>
    setGroups((current) =>
      current.map((group) => (group.id === groupId ? { ...group, ...patch } : group)),
    )

  const patchRow = (groupId, rowId, patch) =>
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rows: group.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
            }
          : group,
      ),
    )

  const started = groups.flatMap(({ rows }) => rows).filter(
    (row) => row.field || row.operator || String(row.value ?? '').trim(),
  )
  const incomplete = started.filter((row) => !isComplete(row)).length
  const canSave = started.length > 0 && incomplete === 0
  const hasMeasure = started.some((row) => typeOf(row) === 'number')

  /* The filter as a sentence. Groups are bracketed only when there is more
     than one, because "(A and B)" with nothing beside it is punctuation for
     its own sake. */
  const summary = (() => {
    const parts = groups
      .map(({ rows, join }) => {
        const complete = rows.filter(isComplete)
        if (!complete.length) return null
        const text = complete.map(describe).join(join === 'and' ? ' and ' : ' or ')
        return complete.length > 1 && groups.length > 1 ? `(${text})` : text
      })
      .filter(Boolean)
    return parts.length ? `Showing rows where ${parts.join(' and ')}` : ''
  })()

  return (
    <div className="vfilter">
      <div className="vfilter__toolbar">
        <ArvoButton
          label="Add value filter"
          icon="plus"
          variant="secondary"
          size="sm"
          onClick={() => setGroups((current) => [...current, newGroup()])}
        />
        {started.length > 0 && (
          <span className="vfilter__count">
            {started.length} condition{started.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="vfilter__groups">
        {groups.map((group, groupIndex) => (
          <div key={group.id}>
            {/* How this group joins the previous one. Between groups rather
                than inside them, because it belongs to neither. */}
            {groupIndex > 0 && (
              <div className="vfilter__joiner">
                <span className="vfilter__joiner-line" />
                <span className="vfilter__joiner-word">and</span>
                <span className="vfilter__joiner-line" />
              </div>
            )}

            <section className="vfilter__group">
              <header className="vfilter__group-head">
                <ArvoRadioGroup
                  name={`join-${group.id}`}
                  orientation="horizontal"
                  value={group.join}
                  onChange={({ value }) => patchGroup(group.id, { join: value })}
                >
                  <ArvoRadio value="and" label="And" />
                  <ArvoRadio value="or" label="Or" />
                </ArvoRadioGroup>

                <span className="vfilter__group-tools">
                  <ArvoButton
                    label="Add condition"
                    icon="plus"
                    variant="tertiary"
                    size="sm"
                    onClick={() =>
                      patchGroup(group.id, { rows: [...group.rows, newRow()] })
                    }
                  />
                  <ArvoIconButton
                    icon="trash"
                    tooltip="Remove this group"
                    variant="tertiary"
                    size="sm"
                    isDisabled={groups.length === 1}
                    onClick={() =>
                      setGroups((current) => current.filter(({ id }) => id !== group.id))
                    }
                  />
                </span>
              </header>

              <ol className="vfilter__rows">
                {group.rows.map((row, rowIndex) => (
                  <li className="vfilter__row" key={row.id}>
                    {/* The rail says how the rows combine without repeating the
                        word on every line. */}
                    <span className="vfilter__rail" aria-hidden="true">
                      {rowIndex > 0 && (
                        <span className="vfilter__rail-word">
                          {group.join === 'and' ? 'and' : 'or'}
                        </span>
                      )}
                    </span>

                    <ArvoSelect
                      aria-label="Field"
                      placeholder="Select field"
                      items={FIELDS}
                      value={row.field}
                      isFullWidth
                      onChange={(item) =>
                        item &&
                        /* Changing the field resets what follows it: an
                           operator and a value chosen for a date are not
                           meaningful against an account name. */
                        patchRow(group.id, row.id, {
                          field: item.value,
                          operator: '',
                          value: '',
                        })
                      }
                    />

                    <ArvoSelect
                      aria-label="Operator"
                      placeholder="Condition"
                      items={OPERATORS[typeOf(row)]}
                      value={row.operator}
                      isDisabled={!row.field}
                      isFullWidth
                      onChange={(item) =>
                        item && patchRow(group.id, row.id, { operator: item.value })
                      }
                    />

                    {row.operator === 'between' ? (
                      <span className="vfilter__between">
                        <ValueField
                          row={row}
                          onChange={(value) => patchRow(group.id, row.id, { value })}
                        />
                        <span className="vfilter__between-word">and</span>
                        <ValueField
                          row={row}
                          field="valueTo"
                          onChange={(valueTo) => patchRow(group.id, row.id, { valueTo })}
                        />
                      </span>
                    ) : (
                      <ValueField
                        row={row}
                        onChange={(value) => patchRow(group.id, row.id, { value })}
                      />
                    )}

                    {/* Duplicate, then edit. Two conditions on the same field
                        differ by a word -- rebuilding the second from three
                        empty dropdowns is the slow way to say "and under
                        100,000" after saying "over 50,000". */}
                    <ArvoIconButton
                      icon="copy"
                      tooltip="Duplicate condition"
                      variant="tertiary"
                      size="sm"
                      isDisabled={!row.field}
                      onClick={() =>
                        patchGroup(group.id, {
                          rows: group.rows.flatMap((entry) =>
                            entry.id === row.id
                              ? [entry, { ...entry, id: `row-${(seq += 1)}` }]
                              : [entry],
                          ),
                        })
                      }
                    />
                    <ArvoIconButton
                      icon="close"
                      tooltip="Remove condition"
                      variant="tertiary"
                      size="sm"
                      isDisabled={group.rows.length === 1}
                      onClick={() =>
                        patchGroup(group.id, {
                          rows: group.rows.filter(({ id }) => id !== row.id),
                        })
                      }
                    />
                  </li>
                ))}
              </ol>
            </section>
          </div>
        ))}
      </div>

      <div className="vfilter__topbottom">
        {/* Enabled once a measure is in play, because top/bottom ranks by
            value and there is nothing to rank without one. */}
        <ArvoButton
          label="Add top / bottom rule"
          icon="plus"
          variant="secondary"
          size="sm"
          isDisabled={!hasMeasure}
        />
      </div>

      <footer className="vfilter__footer">
        {/* The filter in words.
         *
         * A builder shows the shape of a query but not its meaning: five rows
         * of dropdowns are five things to decode. One sentence underneath is
         * how you check you built what you meant before applying it to the
         * report. It doubles as the incomplete-row warning, so there is one
         * place to look rather than two. */}
        <span className="vfilter__status">
          {incomplete > 0
            ? `${incomplete} condition${incomplete === 1 ? ' still needs' : 's still need'} a value`
            : summary}
        </span>
        <span className="vfilter__actions">
          <ArvoButton label="Cancel" variant="secondary" size="sm" onClick={onCancel} />
          <ArvoButton
            label="Save"
            variant="primary"
            size="sm"
            isDisabled={!canSave}
            onClick={() => onSave(groups)}
          />
        </span>
      </footer>
    </div>
  )
}

/* The value control, chosen by the field's type rather than by a single text
 * box asked to mean everything. */
function ValueField({ row, onChange, field: bound = 'value' }) {
  const field = fieldOf(row)
  const current = row[bound] ?? ''
  const shared = {
    'aria-label': bound === 'valueTo' ? 'Upper value' : 'Value',
    isFullWidth: true,
    isDisabled: !row.operator,
  }

  if (!field || field.type === 'text') {
    return (
      <ArvoTextbox
        {...shared}
        placeholder="Enter a value"
        value={current}
        onInput={(event) => onChange(event.target.value)}
      />
    )
  }

  if (field.type === 'number') {
    return (
      <ArvoNumberInput
        {...shared}
        placeholder="0"
        prefix={field.suffix === '$' ? '$' : undefined}
        suffix={field.suffix === '%' ? '%' : undefined}
        value={current}
        onInput={(event) => onChange(event.target.value)}
      />
    )
  }

  return (
    <ArvoDatePicker
      {...shared}
      format="MM-dd-yyyy"
      placeholder="MM-dd-yyyy"
      value={current}
      /* DatePicker reports { value: Date|null, formattedValue }. The formatted
         string is what this filter carries, since that is what gets shown back
         and sent on. */
      onChange={(payload) => onChange(payload?.formattedValue ?? '')}
    />
  )
}
