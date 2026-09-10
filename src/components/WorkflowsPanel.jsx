import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import {
  ArvoAccordion,
  ArvoAccordionItem,
  ArvoActionMenu,
  ArvoAlertDialog,
  ArvoCheckbox,
  ArvoDropdownIconButton,
  ArvoList,
  ArvoTextbox,
  ArvoWindow,
  useToast,
} from '@arvo/react'
import usePersistentState from '../usePersistentState'

/* The Workflows launchbar panel.
 *
 * A workflow is the outer group -- Demand Review, Supply Review. A favorite is
 * a saved view inside one. Selection is single across the whole panel, not per
 * workflow: you are looking at one favorite at a time.
 *
 * Composition:
 *   ArvoAccordion / ArvoAccordionItem -- one workflow each. Carries the
 *     chevron, the title and the `badge` count, and animates its own panel.
 *   ArvoList -- the favorites inside a workflow. Every list is handed the same
 *     selected id, so selecting in one workflow clears the highlight in every
 *     other without any cross-list bookkeeping.
 *
 * The workflow's overflow is a sibling of the accordion item, positioned over
 * its header, rather than the item's own `menuItems`. Arvo renders that trailing
 * cluster inside the accordion's trigger `<button>`, so using it nests a button
 * in a button -- invalid markup, which React rejects outright. The item's root
 * is a div, so a sibling sits in the same place and stays valid. */

const INITIAL_WORKFLOWS = [
  {
    id: 'demand',
    title: 'Demand Review',
    favorites: [
      { id: 'weekly-demand', label: 'Weekly Demand Snapshot' },
      { id: 'forecast-accuracy', label: 'Forecast Accuracy by SKU' },
      { id: 'npi', label: 'New Product Introductions' },
      { id: 'promo-lift', label: 'Promotion Lift Analysis' },
    ],
  },
  {
    id: 'supply',
    title: 'Supply Review',
    favorites: [
      { id: 'capacity', label: 'Capacity vs. Demand' },
      { id: 'inventory-health', label: 'Inventory Health by DC' },
      { id: 'plan-adherence', label: 'Production Plan Adherence' },
    ],
  },
  {
    id: 'sop',
    title: 'S&OP Monthly Cycle',
    favorites: [
      { id: 'sop-pre', label: 'Pre-S&OP Consolidation' },
      { id: 'sop-exec', label: 'Executive S&OP Review' },
      { id: 'sop-actions', label: 'Action Log' },
    ],
  },
  {
    id: 'rebalancing',
    title: 'Inventory Rebalancing',
    favorites: [
      { id: 'rebal-proposals', label: 'Transfer Proposals' },
      { id: 'rebal-approvals', label: 'Approvals' },
    ],
  },
  {
    id: 'my-demand',
    title: 'My Demand Plan Tasks',
    favorites: [{ id: 'my-demand-open', label: 'Open Tasks' }],
  },
  {
    id: 'my-supply',
    title: 'My Supply Plan Tasks',
    favorites: [{ id: 'my-supply-open', label: 'Open Tasks' }],
  },
  {
    id: 'legacy',
    title: 'Legacy MRP Reports',
    favorites: [{ id: 'legacy-mrp', label: 'MRP Exception Report' }],
  },
  {
    id: 'fy24',
    title: 'FY24 Budget Workflows',
    favorites: [{ id: 'fy24-pva', label: 'FY24 Plan vs. Actual' }],
  },
]

/* Inline-content helpers.
 *
 * Toast and dialog copy takes an inline AST, not a string with markup -- raw
 * HTML is not representable. Building the runs this way is what lets the item's
 * name carry weight while the sentence around it stays plain, so the eye finds
 * what was affected without reading the whole line. */
const text = (value) => ({ type: 'text', value })
const strong = (value) => ({ type: 'strong', children: [text(value)] })

/* Remove is flagged destructive rather than merely coloured, so the menu draws
 * it in the negative tone itself. */
const FAVORITE_MENU = [
  { id: 'launch', label: 'Launch', icon: 'play' },
  { id: 'copy', label: 'Copy', icon: 'copy' },
  { id: 'rename', label: 'Rename', icon: 'edit' },
  { id: 'update', label: 'Update', icon: 'refresh' },
  { id: 'delete', label: 'Delete', icon: 'trash', destructive: true },
]

/* Naming something: created, renamed, duplicated -- at either level.
 *
 * One window serves all of it. The field, its required rule and the footer are
 * identical whether the subject is a workflow or a favorite; only the wording
 * and what happens on submit differ. Six near-identical components would have
 * repeated the one piece with any behaviour in it -- the required name -- six
 * times over. `kind` supplies the noun, so the copy stays specific without
 * branching the form. */
const NOUNS = { workflow: 'Workflow', favorite: 'Favorite' }

const FORM_MODES = {
  add: { title: (noun) => `Add ${noun}`, submit: 'Add' },
  rename: { title: (noun) => `Rename ${noun}`, submit: 'Update' },
  copy: { title: (noun, label) => `Copy ${noun}: ${label}`, submit: 'Copy' },
}

const WORKFLOW_MENU = [
  { id: 'copy', label: 'Copy', icon: 'copy' },
  { id: 'rename', label: 'Rename', icon: 'edit' },
  { id: 'share', label: 'Share', icon: 'share-alt' },
  { id: 'hide', label: 'Hide', icon: 'eye-slash' },
  { id: 'delete', label: 'Delete', icon: 'trash', destructive: true },
]

const WorkflowsPanel = forwardRef(function WorkflowsPanel({ query = '' }, ref) {
  const toast = useToast()
  const [workflows, setWorkflows] = usePersistentState('workflows', INITIAL_WORKFLOWS)
  const [selected, setSelected] = usePersistentState('workflow.selected', 'forecast-accuracy')

  /* What the confirmation is about. Held as the whole subject rather than an
   * id, so the dialog can name it and say what else goes with it -- the copy
   * has to be specific to be worth showing at all. */
  const [pendingDelete, setPendingDelete] = useState(null)
  const [expanded, setExpanded] = usePersistentState('workflow.expanded', ['demand', 'supply', 'fy24'])

  /* Add / rename / copy, as one form.
   *
   * `hasSubmitted` gates the error: an empty field is not a mistake until the
   * form has been sent, so the window opens clean and only turns red once the
   * name has actually been asked for. */
  const [form, setForm] = useState(null)
  const patchForm = (patch) => setForm((current) => current && { ...current, ...patch })

  const openForm = (next) =>
    setForm({ kind: 'workflow', name: '', sync: true, hasSubmitted: false, ...next })

  // The panel's own FAB lives in App's ArvoPanel, outside this tree, so the
  // one action that has no trigger of its own here is exposed to it.
  useImperativeHandle(ref, () => ({
    openAdd: () => openForm({ mode: 'add' }),
  }))

  // Which workflow holds a favorite. Rename and copy both need it, and the
  // panel only ever knows the favorite's own id.
  const parentOf = (favoriteId) =>
    workflows.find((workflow) =>
      workflow.favorites.some((favorite) => favorite.id === favoriteId),
    )

  const submitForm = () => {
    if (!form) return false
    const name = form.name.trim()
    if (!name) {
      patchForm({ hasSubmitted: true })
      // Vetoes the window's own close, so the field keeps what was typed.
      return false
    }

    if (form.kind === 'favorite') {
      const id = `fav-${Date.now()}`
      setWorkflows((current) =>
        current.map((workflow) => {
          const index = workflow.favorites.findIndex((favorite) => favorite.id === form.id)
          if (index < 0) return workflow
          const favorites = [...workflow.favorites]
          if (form.mode === 'rename') {
            favorites[index] = { ...favorites[index], label: name }
          } else {
            // Directly below its source, where a duplicate is looked for.
            favorites.splice(index + 1, 0, { ...favorites[index], id, label: name })
          }
          return { ...workflow, favorites }
        }),
      )
      // The copy is the thing you just made, so it becomes the selection; a
      // rename leaves the selection exactly where it was.
      if (form.mode === 'copy') setSelected(id)
      toast.show({
        type: 'positive',
        message:
          form.mode === 'rename'
            ? [strong(form.label), text(' renamed to '), strong(name)]
            : [strong(name), text(' created from '), strong(form.label)],
      })
      setForm(null)
      return true
    }

    if (form.mode === 'add') {
      const id = `wf-${Date.now()}`
      setWorkflows((current) => [{ id, title: name, favorites: [] }, ...current])
      setExpanded((current) => [...current, id])
      toast.show({ type: 'positive', message: [text('Workflow '), strong(name), text(' created')] })
    } else if (form.mode === 'rename') {
      setWorkflows((current) =>
        current.map((workflow) =>
          workflow.id === form.id ? { ...workflow, title: name } : workflow,
        ),
      )
      toast.show({
        type: 'positive',
        message: [strong(form.label), text(' renamed to '), strong(name)],
      })
    } else {
      const id = `wf-${Date.now()}`
      setWorkflows((current) => {
        const index = current.findIndex((workflow) => workflow.id === form.id)
        const source = current[index]
        /* Favorites are copied, not shared, whatever the checkbox says --
           synchronising two workflows is a back-end contract, and the flag is
           carried on the copy so the real thing has it to act on. */
        const copy = {
          id,
          title: name,
          isSynced: form.sync,
          favorites: source.favorites.map((favorite) => ({
            ...favorite,
            id: `${favorite.id}-${id}`,
          })),
        }
        return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]
      })
      setExpanded((current) => [...current, id])
      toast.show({
        type: 'positive',
        message: [strong(name), text(' created from '), strong(form.label)],
      })
    }

    setForm(null)
    return true
  }

  /* One menu for every favorite, retargeted to whichever overflow was clicked.
   * A menu per row would mount dozens of overlays for a control only one of
   * which can ever be open. */
  const anchorRef = useRef(null)
  const menuRef = useRef(null)
  const [openFor, setOpenFor] = useState(null)
  // Read inside the click handler, which closes over a stale `openFor`.
  const openForRef = useRef(null)
  openForRef.current = openFor

  const matches = (label) => label.toLowerCase().includes(query.trim().toLowerCase())

  const confirmMessage = (() => {
    if (!pendingDelete) return ''
    if (pendingDelete.kind === 'workflow') {
      const n = pendingDelete.count
      const favorites = n === 1 ? '1 favorite' : `${n} favorites`
      return [
        strong(pendingDelete.label),
        text(` and its ${favorites} will be permanently deleted. This can’t be undone.`),
      ]
    }
    return [
      strong(pendingDelete.label),
      text(' will be permanently deleted from '),
      strong(pendingDelete.parent),
      text('. This can’t be undone.'),
    ]
  })()

  const confirmDelete = () => {
    if (!pendingDelete) return
    const { kind, id, label } = pendingDelete

    setWorkflows((current) =>
      kind === 'workflow'
        ? current.filter((workflow) => workflow.id !== id)
        : current.map((workflow) => ({
            ...workflow,
            favorites: workflow.favorites.filter((favorite) => favorite.id !== id),
          })),
    )

    // Naming what went keeps the toast useful when several are deleted in a
    // row, and the name is the part worth finding at a glance.
    toast.show({
      type: 'positive',
      message: [
        text(`${kind === 'workflow' ? 'Workflow' : 'Favorite'} `),
        strong(label),
        text(' deleted'),
      ],
    })
    setPendingDelete(null)
  }

  // A search that matched inside a collapsed workflow has to open it, or the
  // rows it found stay hidden.
  const visibleWorkflows = workflows.map((workflow) => ({
    ...workflow,
    shown: workflow.favorites.filter(({ label }) => matches(label)),
  })).filter(({ shown }) => !query || shown.length)

  const openValues = query ? visibleWorkflows.map(({ id }) => id) : expanded

  return (
    <div className="workflows">
      {/* Deletion is confirmed, not undone. There is no undo here, so the
          dialog states the consequence and what disappears with it. */}
      <ArvoAlertDialog
        variant="warning"
        isOpen={pendingDelete != null}
        hasDangerAction
        title={pendingDelete?.kind === 'workflow' ? 'Delete workflow?' : 'Delete favorite?'}
        message={confirmMessage}
        primaryAction={{ label: 'Delete', onClick: confirmDelete }}
        secondaryAction={{ label: 'Cancel' }}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />

      {/* Naming a workflow. Label sits above its field -- a column reads in one
          direction, so the eye never has to travel back across the window to
          pair a label with the control it belongs to, and the field is free to
          take the full width. */}
      <ArvoWindow
        /* sm: one field and a footer. A wider window would be mostly empty
           space around a single input, and the field is full-width either way. */
        size="sm"
        isOpen={form != null}
        title={form ? FORM_MODES[form.mode].title(NOUNS[form.kind], form.label) : ''}
        onOpenChange={(open) => !open && setForm(null)}
        primaryAction={{
          label: form ? FORM_MODES[form.mode].submit : '',
          onClick: submitForm,
        }}
        secondaryActions={[{ label: 'Cancel' }]}
      >
        <div className="wf-form">
          <ArvoTextbox
            label={`${NOUNS[form?.kind ?? 'workflow']} Name`}
            isRequired
            isFullWidth
            value={form?.name ?? ''}
            placeholder="Enter a name"
            isInvalid={Boolean(form?.hasSubmitted && !form.name.trim())}
            errorMsg="Name is required"
            onInput={(event) => patchForm({ name: event.target.value })}
          />

          {/* Copy only: the choice exists because a duplicated workflow is
              usually a variant of the original, and whether the two keep step
              afterwards is the one thing a copy cannot infer. */}
          {form?.mode === 'copy' && form.kind === 'workflow' && (
            <ArvoCheckbox
              label="Synchronize favorites with the original workflow"
              hasDescription
              description="Changes made to favorites in either workflow will be reflected in both."
              isChecked={form.sync}
              onChange={(event) =>
                patchForm({ sync: event?.target?.checked ?? !form.sync })
              }
            />
          )}
        </div>
      </ArvoWindow>

      <ArvoAccordion
        size="lg"
        /* Chevron leads the row rather than trailing it, so the disclosure
           reads before the workflow name instead of after the count. */
        align="start"
        expandMode="multiple"
        value={openValues}
        onValueChange={(next) => setExpanded(Array.isArray(next) ? next : [next])}
      >
        {visibleWorkflows.map(({ id, title, favorites, shown }) => (
          <div className="wf-workflow" key={id}>
            <ArvoAccordionItem
              value={id}
              title={title}
              /* Neutral, not the component's default. ArvoAccordionItem falls
                 back to `negative` when a badge omits its semanticType, so a
                 plain count arrived styled as an error. */
              badge={{ message: String(favorites.length), semanticType: 'neutral' }}
              panelPadding="none"
              /* No rule between workflows -- the header's own weight and the
                 space around it already separate them, and a divider per item
                 turned the panel into a ledger. */
              hasDivider={false}
            >
              {/* selectionMode "none", not "single".
                  Single mounts a radio control in every row, which turns a
                  navigation list into a form. The row itself is the target:
                  clicking it selects, and `isSelected` carries the state. */}
              <ArvoList
                variant="standard"
                selectionMode="none"
                /* Always, not the default hover-only: every favorite carries
                   the same actions, and a control that appears only under the
                   pointer is invisible until you go looking for it. */
                actionsVisibility="always"
                onItemClick={({ id }) => setSelected(id)}
                items={shown.map((favorite) => ({
                  ...favorite,
                  /* Marked per item. `selectedIds` on the list did not reach
                     the rows -- ArvoListItem reads its own `isSelected`, which
                     is what adds the active state and aria-current. */
                  isSelected: favorite.id === selected,
                  actions: [
                    {
                      id: 'more',
                      icon: 'ellipsis-v',
                      tooltip: `${favorite.label} actions`,
                      /* Close, then reopen on the next frame.
                         The surface reads its anchor when it opens, so pointing
                         the ref at a new button while the menu was already open
                         left it where it first appeared -- far from the ellipsis
                         that summoned it. The closed frame in between is what
                         makes it re-anchor. */
                      onClick: ({ event }) => {
                        /* Resolved from `target`, not `currentTarget`.
                           React clears currentTarget once dispatch finishes, and
                           this handler runs through Arvo's own wrapper -- by
                           then it is null, so the menu anchored to nothing and
                           opened at a fixed spot near the viewport foot. */
                        const button =
                          event.target?.closest?.('button') ?? event.currentTarget
                        if (openForRef.current === favorite.id) {
                          menuRef.current?.close()
                          return
                        }
                        // Anchor first, then open: the handle reads the ref
                        // when it runs.
                        anchorRef.current = button
                        setOpenFor(favorite.id)
                        menuRef.current?.open()
                      },
                    },
                  ],
                }))}
              />
            </ArvoAccordionItem>

            <ArvoDropdownIconButton
              className="wf-workflow__menu"
              icon="ellipsis-v"
              tooltip={`${title} actions`}
              variant="tertiary"
              size="sm"
              isCompact
              placement="bottom-end"
              items={WORKFLOW_MENU}
              onSelect={(item) => {
                if (item.id === 'rename') {
                  openForm({ mode: 'rename', id, label: title, name: title })
                  return
                }
                if (item.id === 'copy') {
                  // Prefilled the way a duplicate is normally named, and
                  // selectable, so the suffix can be typed over rather than
                  // deleted first.
                  openForm({ mode: 'copy', id, label: title, name: `${title} copy` })
                  return
                }
                if (item.id !== 'delete') return
                setPendingDelete({
                  kind: 'workflow',
                  id,
                  label: title,
                  count: favorites.length,
                })
              }}
            />
          </div>
        ))}
      </ArvoAccordion>

      {/* Opened through the imperative handle, which is what ActionMenu
          documents for a consumer-owned trigger: it "does NOT attach a click
          listener on the trigger; drive open/close via the imperative ref
          handle's open()/close()/toggle()".
          Driving it by the controlled `isOpen` prop instead left it anchored
          wherever `triggerRef.current` pointed when the menu was built -- null
          at that moment -- so it opened unanchored at the foot of the viewport
          however the ref was retargeted afterwards. */}
      <ArvoActionMenu
        ref={menuRef}
        triggerRef={anchorRef}
        items={FAVORITE_MENU}
        onSelect={(item) => {
          if (!openForRef.current) return
          const parent = parentOf(openForRef.current)
          const favorite = parent?.favorites.find((f) => f.id === openForRef.current)
          if (!favorite) return

          if (item.id === 'rename') {
            openForm({
              kind: 'favorite',
              mode: 'rename',
              id: favorite.id,
              label: favorite.label,
              name: favorite.label,
            })
            return
          }
          if (item.id === 'copy') {
            openForm({
              kind: 'favorite',
              mode: 'copy',
              id: favorite.id,
              label: favorite.label,
              name: `${favorite.label} copy`,
            })
            return
          }
          if (item.id !== 'delete') return

          setPendingDelete({
            kind: 'favorite',
            id: favorite.id,
            label: favorite.label,
            parent: parent.title,
          })
        }}
        onOpenChange={(open) => !open && setOpenFor(null)}
        placement="bottom-end"
      />
    </div>
  )
})

export default WorkflowsPanel
