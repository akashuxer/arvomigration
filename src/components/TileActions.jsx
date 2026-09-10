import { useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import ValueFilterBuilder from './ValueFilterBuilder'
import BulkEditForm, { BULK_EDIT_TITLES } from './BulkEditForm'
import {
  ArvoCheckbox,
  ArvoWindow,
  ArvoDropdownButton,
  ArvoDropdownIconButton,
  ArvoIconButton,
  ArvoPanel,
  ArvoSplitButton,
  useToast,
} from '@arvo/react'

/* Report-tile controls, shared by every view so a pivot carries the same
 * actions wherever it appears, and likewise a chart. */

const DOWNLOAD_FORMATS = [
  { id: 'xlsx', label: 'Excel workbook' },
  { id: 'csv', label: 'CSV' },
  { id: 'pdf', label: 'PDF' },
]

const BULK_EDIT_ACTIONS = [
  { id: 'copy', label: 'Copy' },
  { id: 'adjust', label: 'Adjust' },
  { id: 'apply', label: 'Apply' },
]

const FILTER_ACTIONS = [
  { id: 'toggle', label: 'Toggle Pivot Filters' },
  { id: 'clear', label: 'Clear Pivot Filters' },
  { id: 'manage', label: 'Manage Value Filters' },
]

const VIEW_ACTIONS = [
  { id: 'columns', label: 'Manage columns' },
  { id: 'freeze', label: 'Freeze panes' },
  { id: 'density', label: 'Row density' },
  { id: 'reset', label: 'Reset view' },
]

/* Every action a pivot tile offers, in the order they appear on the toolbar.
 *
 * This is the single registry behind both surfaces: the toolbar renders the
 * pinned subset, and the puzzle menu lists all of them. Adding an action here
 * puts it in the menu automatically -- there is no second list to keep in step.
 *
 * `kind` says how the action renders when pinned; `items` is its own submenu,
 * which the puzzle menu reuses so an action behaves the same either way. */
const PIVOT_ACTIONS = [
  { id: 'download', label: 'Download', icon: 'download', kind: 'split', items: DOWNLOAD_FORMATS },
  // Every row carries an icon, or its label starts 24px left of the others.
  { id: 'bulk-edit', label: 'Bulk Edit', icon: 'edit', kind: 'dropdown', items: BULK_EDIT_ACTIONS },
  { id: 'filters', label: 'Filters', icon: 'filter', kind: 'dropdown', items: FILTER_ACTIONS },
  { id: 'settings', label: 'Settings', icon: 'cog', kind: 'icon', items: [] },
  { id: 'view', label: 'View actions', icon: 'puzzle-piece', kind: 'dropdown', items: VIEW_ACTIONS },
]

const DEFAULT_PINNED = ['download', 'bulk-edit', 'filters', 'settings']

/* Report settings, opened from the cog on either tile type.
 *
 * Overlay rather than docked: settings are a detour from reading the report, so
 * they float above it and leave the layout alone. The launchbar panels dock
 * because those are meant to sit alongside the work.
 *
 * Non-modal, so no backdrop. `isModal` defaults to true for an overlay panel,
 * and the mask that comes with it dims the very report these settings change --
 * you could not see the effect of a change while making it. Turning it off also
 * drops the focus trap and scroll lock, so the report stays readable and
 * scrollable underneath. Outside-click still dismisses. */
function ReportSettings({ isOpen, onOpenChange }) {
  return (
    <ArvoPanel
      displayMode="overlay"
      placement="right"
      title="Report Settings"
      defaultSize={360}
      isModal={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <p className="panel-placeholder">Report settings content goes here.</p>
    </ArvoPanel>
  )
}

export function PivotActions() {
  const toast = useToast()
  /* How many value filters are live on this tile.
   *
   * Kept here rather than inside the builder because the pivot's toolbar has to
   * show it: a filter that changes what the grid contains, with nothing on
   * screen to say so, is how people end up mistrusting the numbers. */
  const [appliedFilters, setAppliedFilters] = useState(0)
  const [filterSummary, setFilterSummary] = useState('')
  const builderRef = useRef(null)
  const bulkRef = useRef(null)
  /* Which scope field's picker is open, by label. A second window on top of the
     first, so the pivot's own filters are never the thing being typed over. */
  const [scopePicker, setScopePicker] = useState(null)

  const saveFilters = () => {
    const { groups, ranks } = builderRef.current?.collect() ?? { groups: [], ranks: [] }
    const conditions = groups.reduce((total, { rows }) => total + rows.length, 0)
    setAppliedFilters(conditions + ranks.length)

    const parts = []
    if (conditions) parts.push(`${conditions} value filter${conditions === 1 ? '' : 's'}`)
    if (ranks.length) {
      parts.push(`${ranks.length} top/bottom rule${ranks.length === 1 ? '' : 's'}`)
    }
    toast.show({
      type: 'positive',
      message: parts.length ? `${parts.join(' and ')} applied` : 'Filters cleared',
    })
  }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  // Which actions were promoted out of the puzzle menu -- a layout choice,
  // so it outlives the tile that was open when it was made.
  const [pinned, setPinned] = usePersistentState('tile.pinned', DEFAULT_PINNED)

  /* Actions that need room to work open in a window rather than a panel.
   *
   * Bulk Edit and value filters are tasks you complete and commit -- they want
   * the whole field of view and a clear way out. A docked panel would leave the
   * grid half-visible beside a form that is editing all of it. */
  const [task, setTask] = useState(null)

  const togglePin = (id) =>
    setPinned((current) =>
      current.includes(id) ? current.filter((pin) => pin !== id) : [...current, id],
    )

  const run = (id) => {
    if (id === 'settings') setIsSettingsOpen(true)
  }

  const TASK_TITLES = {
    ...BULK_EDIT_TITLES,
    manage: 'Manage Value Filters',
  }

  const isBulk = task === 'copy' || task === 'adjust' || task === 'apply'

  const submitBulk = () => {
    const { rows } = bulkRef.current?.collect() ?? { rows: [] }
    if (!rows.length) {
      toast.show({ type: 'warning', message: 'Add a measure before submitting' })
      // Nothing to submit is not a reason to close the form.
      return false
    }
    toast.show({
      type: 'positive',
      message: `${rows.length} measure${rows.length === 1 ? '' : 's'} updated`,
    })
    return true
  }

  const openTask = (item) => {
    /* Clearing has to reset the count as well as the filters, or the funnel
       keeps claiming something is applied after it was taken away. */
    if (item?.id === 'clear') {
      if (appliedFilters === 0) return
      setAppliedFilters(0)
      toast.show({ type: 'positive', message: 'Value filters cleared' })
      return
    }
    if (TASK_TITLES[item?.id]) setTask(item.id)
  }

  const renderPinned = (action) => {
    const { id, label, kind, items } = action
    /* Filled funnel while filters are applied, hollow when none are -- the
       same icon in two states rather than a separate badge, so the control
       says what it is and what it is doing in one place. */
    const isFiltered = id === 'filters' && appliedFilters > 0
    const icon = isFiltered ? 'filter-filled' : action.icon

    if (kind === 'split') {
      return (
        <ArvoSplitButton
          key={id}
          label={label}
          icon={icon}
          variant="tertiary"
          size="sm"
          items={items}
          onClick={() => run(id)}
        />
      )
    }

    if (kind === 'dropdown') {
      return (
        <ArvoDropdownButton
          key={id}
          label={label}
          icon={icon}
          variant="tertiary"
          size="sm"
          items={items}
          onSelect={openTask}
        />
      )
    }

    return (
      <ArvoIconButton
        key={id}
        icon={icon}
        tooltip={label}
        variant="tertiary"
        size="sm"
        onClick={() => run(id)}
      />
    )
  }

  /* Menu rows for the puzzle button. Selecting a row runs the action; the
   * trailing pin toggles whether it also sits on the toolbar. The pin returns
   * false so the menu stays open -- pinning several in a row should not mean
   * reopening the menu each time.
   *
   * No `submenu` here, deliberately. Giving these rows a submenu of the
   * action's own options renders the chevron but never opens the panel -- not
   * on hover, click or ArrowRight, with or without the pin alongside, and with
   * submenuTrigger set either way. Until that is resolved in the design system,
   * an action's options are reached by pinning it and using its toolbar
   * dropdown, and a chevron that leads nowhere is worse than no chevron.
   *
   * Uniform rows are also what keeps the trailing zone one width, so the pins
   * line up: when some rows had a chevron and others did not, their pins sat at
   * two different x positions. */
  const menuItems = PIVOT_ACTIONS.map(({ id, label, icon }) => {
    const isPinned = pinned.includes(id)
    return {
      id,
      label,
      icon,
      actions: [
        {
          id: `pin-${id}`,
          icon: isPinned ? 'push-pinned' : 'push-pin',
          ariaLabel: isPinned ? `Unpin ${label}` : `Pin ${label}`,
          onClick: () => {
            togglePin(id)
            return false
          },
        },
      ],
    }
  })

  return (
    <div className="tile-actions">
      {PIVOT_ACTIONS.filter(({ id }) => pinned.includes(id)).map(renderPinned)}

      <ReportSettings isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      <ArvoWindow
        size="lg"
        title={TASK_TITLES[task] ?? ''}
        isOpen={task != null}
        onOpenChange={(open) => {
          if (open) return
          setTask(null)
          setFilterSummary('')
        }}
        /* The window re-applies initial focus on every render, which pulls the
           caret out of whatever is being typed into. */
        initialFocus={task === 'manage' ? 'none' : undefined}
        /* Save and Cancel are the window's own footer actions rather than a
           footer the builder draws for itself -- one set of buttons in the
           place every other window puts them. The builder hands back what it
           built through its ref. */
        primaryAction={
          task === 'manage'
            ? { label: 'Save', onClick: saveFilters }
            : isBulk
              ? { label: 'Submit', onClick: submitBulk }
              : undefined
        }
        /* Reset before Cancel: it is the recoverable one, and putting the
           discard-everything action closest to Submit is how a form gets
           cancelled by accident. */
        secondaryActions={
          task === 'manage'
            ? [{ label: 'Cancel' }]
            : isBulk
              ? [
                  {
                    label: 'Reset',
                    onClick: () => {
                      bulkRef.current?.reset()
                      return false
                    },
                  },
                  { label: 'Cancel' },
                ]
              : undefined
        }
        /* The sentence sits beside the buttons it describes, so it is read on
           the way to pressing Save rather than somewhere above it. */
        footerLeft={
          (task === 'manage' || isBulk) && filterSummary ? (
            <span className="vfilter__status">{filterSummary}</span>
          ) : undefined
        }
      >
        {task === 'manage' ? (
          <ValueFilterBuilder ref={builderRef} onSummaryChange={setFilterSummary} />
        ) : isBulk ? (
          <BulkEditForm
            ref={bulkRef}
            mode={task}
            onPickScope={setScopePicker}
            onSummaryChange={setFilterSummary}
          />
        ) : (
          <p className="panel-placeholder">{TASK_TITLES[task]} content goes here.</p>
        )}
      </ArvoWindow>

      {/* The member picker, a sibling of the task window rather than a child.
          A second window rendered inside the first is torn down with it when
          the overlay stack reshuffles -- the same trip the revoke dialog took
          in the share flow. */}
      <ArvoWindow
        size="md"
        title={scopePicker ? `Select ${scopePicker.toLowerCase()}` : ''}
        isOpen={scopePicker != null}
        onOpenChange={(open) => !open && setScopePicker(null)}
        primaryAction={{ label: 'Add' }}
        secondaryActions={[{ label: 'Cancel' }]}
      >
        <p className="panel-placeholder">{scopePicker} picker goes here.</p>
      </ArvoWindow>

      {/* Always present, and never pinnable itself -- it is the way back to
          any action that has been unpinned. */}
      <ArvoDropdownIconButton
        icon="puzzle-piece"
        tooltip="More actions"
        variant="tertiary"
        size="sm"
        isCompact
        placement="bottom-end"
        items={menuItems}
        /* Menu-level, not per item: ArvoActionMenu calls this prop and ignores
           any onSelect placed on the item objects. */
        onSelect={(item) => run(item.id)}
      />
    </div>
  )
}

export function ChartActions({ isCumulative, onCumulativeChange }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="tile-actions">
      {/* ArvoCheckbox reports { isChecked, value }, not a bare boolean --
          passing the detail object straight through leaves the flag
          permanently truthy and the box can never be cleared. */}
      <ArvoCheckbox
        label="Cumulative"
        isChecked={isCumulative}
        onChange={({ isChecked }) => onCumulativeChange(isChecked)}
      />
      <ArvoIconButton
        icon="cog"
        tooltip="Settings"
        variant="tertiary"
        size="sm"
        onClick={() => setIsSettingsOpen(true)}
      />
      <ReportSettings isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  )
}
