import { useState } from 'react'
import usePersistentState from '../usePersistentState'
import FilterPanel, { ActiveChips, INITIAL_SELECTION, attributeById } from './FilterPanel'
import {
  ArvoBadge,
  ArvoButton,
  ArvoDropdownButton,
  ArvoIconButton,
  ArvoSplitButton,
  useToast,
} from '@arvo/react'

const FILTER_SETS = [
  { id: 'default', label: 'Default Filter Set' },
  { id: 'seasonal', label: 'Seasonal Planning' },
  { id: 'market', label: 'Market Review' },
]

const APPLY_ACTIONS = [
  { id: 'apply', label: 'Apply' },
  { id: 'apply-save', label: 'Apply and save' },
  { id: 'reset', label: 'Reset filters' },
]

// A chip is "unset" when it selects everything AND carries no count. One that
// reports how many members "(All)" covers is still telling you something.
const isUnset = (chip) =>
  (chip.value === 'All' || chip.value === '(All)') && chip.count == null

export default function FilterBar({ chips: allChips = [], isV2 = false }) {
  /* Expanded or collapsed, and the selection behind it.
   *
   * `applied` is what the report is filtered by; `selection` is what the panel
   * is showing. They are the same object until someone touches a tile, which is
   * what lets Reset mean "put back what was applied" and lets closing the panel
   * without applying change nothing. */
  const toast = useToast()

  const [isExpanded, setIsExpanded] = usePersistentState('filters.expanded', false)
  const [applied, setApplied] = usePersistentState('filters.applied', INITIAL_SELECTION)
  const [selection, setSelection] = useState(applied)

  const toggleMember = (attributeId, member, isSingle) =>
    setSelection((current) => {
      const chosen = current[attributeId] ?? []
      if (isSingle) {
        /* Re-pressing the selected member keeps it. A single-select attribute
           with nothing chosen is not a filter the report can run on, so the
           click that would empty it is the one click that does nothing. */
        return { ...current, [attributeId]: [member] }
      }
      return {
        ...current,
        [attributeId]: chosen.includes(member)
          ? chosen.filter((value) => value !== member)
          : [...chosen, member],
      }
    })

  const removeMember = (attributeId, member) =>
    setSelection((current) => ({
      ...current,
      [attributeId]: (current[attributeId] ?? []).filter((value) => value !== member),
    }))

  /* Excluded members, kept beside the selection rather than inside it.
     A member is still chosen when it is excluded -- the exclusion is what the
     filter does with it, so folding the two into one list would lose the
     difference between "not picked" and "picked, and kept out". */
  const [excluded, setExcluded] = usePersistentState('filters.excluded', {})
  const [draftExcluded, setDraftExcluded] = useState(excluded)

  const selectAll = (attributeId) =>
    setSelection((current) => ({
      ...current,
      [attributeId]: [...(attributeById(attributeId)?.members ?? [])],
    }))

  const clearAttribute = (attributeId) => {
    setSelection((current) => ({ ...current, [attributeId]: [] }))
    setDraftExcluded((current) => ({ ...current, [attributeId]: [] }))
  }

  // All-or-nothing per attribute: the menu item acts on "selected members", so
  // it reads as one switch rather than as a per-member toggle in disguise.
  const toggleExclude = (attributeId) =>
    setDraftExcluded((current) => {
      const chosen = selection[attributeId] ?? []
      const already = current[attributeId] ?? []
      const isAll = chosen.length > 0 && chosen.every((value) => already.includes(value))
      return { ...current, [attributeId]: isAll ? [] : chosen }
    })

  // v2: a chip reading "All" with nothing behind it announces that nothing is
  // filtered -- zero information at full visual weight. Show only what is
  // actually set and collapse the rest into a single control.
  const chips = isV2 ? allChips.filter((chip) => !isUnset(chip)) : allChips
  const unsetCount = allChips.length - chips.length

  return (
    <div className={`filter-shell${isExpanded ? ' filter-shell--expanded' : ''}`}>
    <div className="filter-bar">
      {/* The toggle, and the only control that survives into the expanded
          state: it is what opened the panel, so it is what has to close it. */}
      <ArvoIconButton
        icon={isExpanded ? 'filled-filter' : 'filter'}
        tooltip={isExpanded ? 'Close filters' : 'Filters'}
        variant="tertiary"
        size="md"
        isSelected={isExpanded}
        onClick={() => {
          /* Opening starts from what is applied, so the panel never opens
             showing a half-finished selection someone abandoned last time. */
          if (!isExpanded) {
            setSelection(applied)
            setDraftExcluded(excluded)
          }
          setIsExpanded((open) => !open)
        }}
      />

      {/* Separates the filter toggle from the filter set, not the filter set
          from the chips: the set and the chips it produced belong together, and
          a rule between them read as if they were unrelated controls. */}
      <div className="filter-divider" />

      {isExpanded ? (
        /* Expanded, the bar carries one thing: what is selected.
         *
         * Filter Set, the summary chips and the favorite/share group all go --
         * they describe or act on the filter as a finished thing, and nothing
         * here is finished until Apply. Leaving them would offer to save a
         * state that does not exist yet. */
        <>
          <ActiveChips
            selection={selection}
            excluded={draftExcluded}
            onRemove={removeMember}
          />
          <span className="filter-bar__spacer" />
          <ArvoIconButton
            icon="close"
            tooltip="Close filters"
            variant="tertiary"
            size="md"
            onClick={() => setIsExpanded(false)}
          />
        </>
      ) : (
      <>
      <ArvoDropdownButton
        label="Select Filter Set"
        icon="stacking"
        variant="secondary"
        size="sm"
        items={FILTER_SETS}
      />

      <div className="filter-chips">
        {chips.map(({ label, value, count }) => (
          <div className="filter-chip" key={label}>
            {/* The colon does the work a gap was doing: it says the second word
                belongs to the first, which is what turns two runs of text into
                one statement. */}
            <span className="filter-label">{label}:</span>
            <span className="filter-value">{value}</span>
            {count != null && (
              /* A badge, not a bordered run of text -- the count is a quantity
                 attached to the value, which is the one thing a badge is for. */
              <ArvoBadge
                message={String(count)}
                semanticType="neutral"
                appearance="primary"
                hasBadgeIcon={false}
                size="sm"
              />
            )}
          </div>
        ))}

        {unsetCount > 0 && (
          <ArvoButton
            label={`+${unsetCount} filters`}
            variant="tertiary"
            size="sm"
          />
        )}
      </div>

      {/* Apply belongs with the filter set it acts on, not with the favourite /
          share group that floats to the far right. */}
      <ArvoSplitButton label="Apply" variant="primary" size="sm" items={APPLY_ACTIONS} />

      </>
      )}
    </div>

    {/* The expansion itself.
     *
     * A 0fr → 1fr grid row rather than a max-height guess: the panel's height
     * is whatever its dimensions add up to, and animating a max-height large
     * enough to cover that makes the opening fast and the closing slow. The
     * grid row animates to the real height, so both directions take the same
     * 260ms.
     *
     * In normal flow, not floating over the canvas -- the report below is
     * pushed down as the panel grows, which is what the user asked for and also
     * what keeps the grid readable while you filter it: it moves, it does not
     * get covered. */}
    <div className="filter-expand" aria-hidden={!isExpanded}>
      <div className="filter-expand__clip">
        <FilterPanel
          selection={selection}
          excluded={draftExcluded}
          onToggle={toggleMember}
          onSelectAll={selectAll}
          onClearAttribute={clearAttribute}
          onToggleExclude={toggleExclude}
          onClear={() => {
            setSelection({})
            setDraftExcluded({})
          }}
          onReset={() => {
            setSelection(applied)
            setDraftExcluded(excluded)
          }}
          onApply={() => {
            setApplied(selection)
            setExcluded(draftExcluded)
            setIsExpanded(false)
            toast.show({ type: 'positive', message: 'Filters applied' })
          }}
        />
      </div>
    </div>
    </div>
  )
}
