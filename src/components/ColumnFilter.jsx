import { useMemo, useState } from 'react'
import {
  ArvoButton,
  ArvoCheckbox,
  ArvoIconButton,
  ArvoPopover,
  ArvoSearch,
  ArvoToggleButton,
} from '@arvo/react'

/* Column filter and sort, as a spreadsheet does it.
 *
 * One popover serves every column: it is retargeted to whichever header opened
 * it rather than one instance mounted per column, which for a wide grid would
 * be a dozen overlays to keep only one of open.
 *
 * The draft is local until OK. A value list you can uncheck through, watching
 * the grid rebuild under you at every click, is the version of this control
 * everyone has been annoyed by -- so nothing is applied until the change is
 * finished, and Cancel leaves the grid exactly as it was.
 */

const SORTS = [
  { id: 'asc', icon: 'sort-alpha-asc', label: 'Sort A to Z' },
  { id: 'desc', icon: 'sort-alpha-desc', label: 'Sort Z to A' },
]

export default function ColumnFilter({
  anchorRef,
  column,
  values,
  applied,
  sort,
  onApply,
  onClose,
}) {
  const isOpen = Boolean(column)

  /* Seeded from what is applied, re-seeded whenever a different column opens
     the popover -- keying on the column name is what makes one instance behave
     like one per column. */
  const [draft, setDraft] = useState(() => new Set(applied ?? values))
  const [draftSort, setDraftSort] = useState(sort ?? null)
  const [query, setQuery] = useState('')
  const [seededFor, setSeededFor] = useState(column)

  if (column !== seededFor) {
    setSeededFor(column)
    setDraft(new Set(applied ?? values))
    setDraftSort(sort ?? null)
    setQuery('')
  }

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle ? values.filter((value) => value.toLowerCase().includes(needle)) : values
  }, [values, query])

  /* Select-all reflects what is on screen, and acts on it: with a search
     running, "all" means the matches you can see, not the ones the search is
     hiding. Half-checked when the set is mixed, which is the only honest state
     for a box standing over a partial selection. */
  const shownSelected = shown.filter((value) => draft.has(value))
  const isAll = shown.length > 0 && shownSelected.length === shown.length
  const isSome = shownSelected.length > 0 && !isAll

  const toggle = (value, isChecked) =>
    setDraft((current) => {
      const next = new Set(current)
      if (isChecked) next.add(value)
      else next.delete(value)
      return next
    })

  const toggleAll = (isChecked) =>
    setDraft((current) => {
      const next = new Set(current)
      shown.forEach((value) => (isChecked ? next.add(value) : next.delete(value)))
      return next
    })

  return (
    <ArvoPopover
      triggerRef={anchorRef}
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={column ?? ''}
      placement="bottom-start"
      width={280}
      actions={[
        {
          id: 'ok',
          label: 'OK',
          variant: 'primary',
          /* A filter that selects nothing shows an empty grid, which reads as
             broken rather than as filtered -- so an empty draft is refused
             here instead of being explained afterwards. */
          isDisabled: draft.size === 0,
          onClick: () => onApply({ values: draft, sort: draftSort }),
        },
        { id: 'cancel', label: 'Cancel', variant: 'secondary', onClick: onClose },
      ]}
      footerLeftSlot={
        <ArvoIconButton
          icon="filter-remove"
          tooltip="Clear filter on this column"
          variant="tertiary"
          size="sm"
          isDisabled={!applied && !sort}
          onClick={() => onApply({ values: null, sort: null })}
        />
      }
    >
      <div className="colfilter">
        <div className="colfilter__sort">
          <span className="colfilter__label">
            Sort{draftSort ? `: ${draftSort === 'asc' ? 'Ascending' : 'Descending'}` : ''}
          </span>
          <div className="colfilter__sort-buttons">
            {SORTS.map(({ id, icon, label }) => (
              <ArvoToggleButton
                key={id}
                icon={icon}
                tooltip={label}
                variant="secondary"
                size="sm"
                isSelected={draftSort === id}
                /* Pressing the active direction clears it: sorted-by-nothing is
                   a state people want back, and hunting for a third button to
                   get there is the wrong answer. */
                onClick={() => setDraftSort((current) => (current === id ? null : id))}
              />
            ))}
          </div>
        </div>

        {/* onInput, not onChange: Arvo's search reports onChange on blur, and a
            value list that only narrows once you click away is a list that
            looks broken while you type. */}
        <ArvoSearch
          placeholder="Search"
          isFullWidth
          value={query}
          onInput={(event) => setQuery(event?.target?.value ?? '')}
          onClear={() => setQuery('')}
        />

        <ul className="colfilter__list">
          <li className="colfilter__all">
            <ArvoCheckbox
              label="(Select all)"
              isChecked={isAll}
              isIndeterminate={isSome}
              onChange={(event) => toggleAll(event?.target?.checked ?? !isAll)}
            />
          </li>
          {shown.map((value) => (
            <li key={value}>
              <ArvoCheckbox
                label={value}
                isChecked={draft.has(value)}
                onChange={(event) => toggle(value, event?.target?.checked ?? !draft.has(value))}
              />
            </li>
          ))}
          {shown.length === 0 && <li className="colfilter__empty">No matches</li>}
        </ul>
      </div>
    </ArvoPopover>
  )
}

/* The control in the header: hidden until the column is hovered or focused,
 * and permanently visible -- filled -- once the column carries a filter.
 *
 * A filter you cannot see is a filter you forget you set, which is how people
 * end up mistrusting a grid; so the resting state is quiet but the applied
 * state never hides. */
export function ColumnFilterButton({ column, isFiltered, isSorted, isOpen, onOpen }) {
  return (
    /* is-open holds the button visible while its popover is up. Hover is what
       reveals it, and the pointer leaves the header the moment it travels down
       into the popover -- so without this the control vanishes out from under
       the panel it opened, leaving the panel anchored to nothing. */
    <span
      className={`colfilter__trigger${isFiltered || isSorted ? ' is-applied' : ''}${
        isOpen ? ' is-open' : ''
      }`}
    >
      {/* xs: the control shares a 36px header cell with the column's own name,
          and anything larger pushes the label around as it appears. */}
      <ArvoIconButton
        /* filled-filter, not filter-filled: the second name has no glyph in
           this icon font, so the applied state drew an empty box. */
        icon={isFiltered ? 'filled-filter' : 'filter-ext'}
        isSelected={isOpen}
        tooltip={isFiltered ? `${column}: filtered` : `Filter ${column}`}
        variant="tertiary"
        size="xs"
        onClick={(event) => onOpen(column, event.currentTarget ?? event.target)}
      />
    </span>
  )
}
