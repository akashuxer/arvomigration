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
 *    measure gets a number input, a text field gets a textbox. The original
 *    showed `MM-dd-yyyy` as placeholder text in a plain box for every one of
 *    them.
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
  { id: 'spend', value: 'spend', label: 'Trade Spend', type: 'number' },
  { id: 'units', value: 'units', label: 'Units Actuals', type: 'number' },
  { id: 'growth', value: 'growth', label: 'Growth %', type: 'number' },
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
const newRank = () => ({ id: `rank-${(seq += 1)}`, field: '', mode: 'top', count: '' })

/* Only measures can be ranked -- "top 10 accounts by Account" is not a
 * question, so the field list here is narrower than the one above. */
const MEASURES = FIELDS.filter(({ type }) => type === 'number')

const RANK_MODES = [
  { id: 'top', value: 'top', label: 'top' },
  { id: 'bottom', value: 'bottom', label: 'bottom' },
]

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
  const [ranks, setRanks] = useState([])

  const patchRank = (rankId, patch) =>
    setRanks((current) =>
      current.map((rank) => (rank.id === rankId ? { ...rank, ...patch } : rank)),
    )

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
  const startedRanks = ranks.filter((rank) => rank.field || String(rank.count ?? '').trim())
  const incompleteRanks = startedRanks.filter(
    (rank) => !(rank.field && String(rank.count ?? '').trim()),
  ).length

  /* Saveable when something has been built and nothing is half-built --
     conditions and ranking rules counting alike, since either on its own is a
     filter worth applying. */
  const canSave =
    started.length + startedRanks.length > 0 && incomplete + incompleteRanks === 0

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
    const conditions = parts.length ? `Showing rows where ${parts.join(' and ')}` : ''
    const rankText = startedRanks
      .filter((rank) => rank.field && String(rank.count ?? '').trim())
      .map(
        (rank) =>
          `${rank.mode} ${rank.count} by ${
            MEASURES.find(({ value }) => value === rank.field)?.label ?? ''
          }`,
      )
      .join(' and ')
    if (conditions && rankText) return `${conditions}, then ${rankText}`
    if (rankText) return `Showing the ${rankText}`
    return conditions
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

              {/* Column labels once per group, not once per row.
                  *
                  * Three unlabelled dropdowns leave you to infer what each one
                  * is for; a label on every row would repeat that inference
                  * three times over in a five-condition filter. The heading row
                  * names the columns for sighted readers, and every control
                  * carries its own accessible name, so a screen reader hears
                  * "Field", "Condition", "Value" per control regardless of
                  * where the eye takes them from. */}
              <div className="vfilter__labels" aria-hidden="true">
                <span />
                <span>Field</span>
                <span>Condition</span>
                <span>Value</span>
                <span />
              </div>

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

                    {/* Absent rather than disabled on a lone row: a control
                        that can never be pressed is a question about why, and
                        the answer -- "a group needs one condition" -- is
                        already obvious from there being one. The cell stays,
                        so the columns still line up. */}
                    {group.rows.length > 1 ? (
                      <ArvoIconButton
                        icon="close"
                        tooltip={`Remove condition ${rowIndex + 1}`}
                        variant="tertiary"
                        size="sm"
                        onClick={() =>
                          patchGroup(group.id, {
                            rows: group.rows.filter(({ id }) => id !== row.id),
                          })
                        }
                      />
                    ) : (
                      <span />
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        ))}
      </div>

      <div className="vfilter__topbottom">
        {/* Two rules is the ceiling: a top rule and a bottom rule describe the
            ends of one ranking, and a third is either a duplicate or a
            contradiction. The button disables once both exist rather than
            accepting rules that cancel each other out. */}
        <ArvoButton
          label="Add top / bottom"
          icon="plus"
          variant="secondary"
          size="sm"
          isDisabled={ranks.length >= 2}
          onClick={() => setRanks((current) => [...current, newRank()])}
        />

        {ranks.length > 0 && (
          <section className="vfilter__group vfilter__group--rank">
            <header className="vfilter__group-head">
              <span className="vfilter__group-title">Top / bottom</span>
              <ArvoIconButton
                icon="trash"
                tooltip="Remove all top / bottom rules"
                variant="tertiary"
                size="sm"
                onClick={() => setRanks([])}
              />
            </header>

            <div className="vfilter__labels vfilter__labels--rank" aria-hidden="true">
              <span>Measure</span>
              <span>Rank</span>
              <span>How many</span>
              <span />
            </div>

            <ol className="vfilter__rows">
              {ranks.map((rank, index) => (
                <li className="vfilter__row vfilter__row--rank" key={rank.id}>
                  <ArvoSelect
                    aria-label="Measure"
                    placeholder="Select measure"
                    items={MEASURES}
                    value={rank.field}
                    isFullWidth
                    onChange={(item) =>
                      item && patchRank(rank.id, { field: item.value })
                    }
                  />
                  <ArvoSelect
                    aria-label="Rank"
                    items={RANK_MODES}
                    value={rank.mode}
                    isFullWidth
                    onChange={(item) => item && patchRank(rank.id, { mode: item.value })}
                  />
                  <ArvoNumberInput
                    aria-label="How many"
                    placeholder="10"
                    min={1}
                    isFullWidth
                    value={rank.count}
                    onInput={(event) => patchRank(rank.id, { count: event.target.value })}
                  />
                  {ranks.length > 1 ? (
                    <ArvoIconButton
                      icon="close"
                      tooltip={`Remove rule ${index + 1}`}
                      variant="tertiary"
                      size="sm"
                      onClick={() =>
                        setRanks((current) => current.filter(({ id }) => id !== rank.id))
                      }
                    />
                  ) : (
                    <span />
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
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
          {incomplete + incompleteRanks > 0
            ? `${incomplete + incompleteRanks} condition${
                incomplete + incompleteRanks === 1 ? ' still needs' : 's still need'
              } a value`
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
