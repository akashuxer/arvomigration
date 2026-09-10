import { useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import ShareFavoriteWindow from './ShareFavoriteWindow'
import {
  ArvoAlertDialog,
  ArvoButton,
  ArvoDropdownButton,
  ArvoIconButton,
  ArvoMultiSelect,
  ArvoPopover,
  ArvoSplitButton,
  ArvoSplitIconButton,
  ArvoTextarea,
  ArvoTextbox,
  useToast,
} from '@arvo/react'

const TAG_OPTIONS = [
  { id: 'planning', label: 'Planning', value: 'planning' },
  { id: 'trade-spend', label: 'Trade Spend', value: 'trade-spend' },
  { id: 'seasonal', label: 'Seasonal', value: 'seasonal' },
  { id: 'review', label: 'Review', value: 'review' },
  { id: 'shared', label: 'Shared', value: 'shared' },
]

/* The fixed part of the Favorites menu. Saved favourites are appended as a
 * second, unlabelled group -- a group with no label renders as a divider, which
 * is how the two halves separate without a second heading. */
const FAVORITES_ACTIONS = [
  { id: 'design-setting', label: 'Design Setting' },
  { id: 'save-factory', label: 'Save as Factory Setting' },
  { id: 'update', label: 'Update Favorite' },
  { id: 'manage', label: 'Manage Favorites' },
  { id: 'add-workflows', label: 'Add to Workflows' },
]

// Always present, below the divider, above anything the user has saved.
const DEMO_FAVORITES = [
  {
    id: 'fav-promo-watch',
    label: 'Q3 Promo Watch',
    description: 'Promo-heavy accounts where spend is running ahead of plan.',
    tags: ['promo'],
  },
  {
    id: 'fav-emea-launch',
    label: 'EMEA Launch Readiness',
    description: 'New product introductions across the EMEA channel.',
    tags: ['forecast'],
  },
  {
    id: 'fav-top-accounts',
    label: 'Top 20 Accounts',
    description: 'The accounts that carry most of the quarter.',
    tags: [],
  },
]

const BUILT_IN_FAVORITES = [
  { id: 'factory', label: 'Factory Setting' },
  { id: 'last-visited', label: 'Last Visited' },
]

const SHARE_TARGETS = [
  { id: 'link', label: 'Copy link' },
  { id: 'people', label: 'Share with people' },
  { id: 'workspace', label: 'Share to workspace' },
]

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
  const favoriteRef = useRef(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  // Which favorite the share window is about. Null means the current view.
  const [sharedFavorite, setSharedFavorite] = useState(null)

  /* One favorite at a time is being edited or deleted, and both are held as the
     whole object rather than an id: the popover has to populate its fields from
     it, and the dialog has to name it. */
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isFactoryOpen, setIsFactoryOpen] = useState(false)
  const menuRef = useRef(null)
  /* The menu's open state is owned here so a row action can close it, and so
     Back from the edit popover can bring it back. */
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFavOpen, setIsFavOpen] = useState(false)

  /* Uncontrolled, and read out of the DOM rather than from React state.
   *
   * Controlled inputs re-render FilterBar on every keystroke, and the popover
   * re-applies its initial focus when it re-renders -- so typing in Description
   * kept throwing the caret back to Name.
   *
   * Read through a ref on the form, not refs on the fields: ArvoTextbox and
   * ArvoTextarea forward their ref to the component's root <div>, not to the
   * inner input, so `fieldRef.current.value` is undefined and every save
   * silently failed the empty-name guard. */
  const formRef = useRef(null)
  const [tags, setTags] = useState([])

  const field = (selector) => formRef.current?.querySelector(selector) ?? null
  const nameInput = () => field('.arvo-textbox__input')
  const descriptionInput = () => field('.arvo-textarea__input')

  const resetForm = () => {
    const name = nameInput()
    const description = descriptionInput()
    if (name) name.value = ''
    if (description) description.value = ''
    setTags([])
  }

  // Newest first, so a favourite just saved is the one at the top of the list.
  /* Seeded with a few saved views.
   *
   * An empty favorites list hides every behaviour that hangs off one -- share,
   * edit, delete, the applied-favorite tooltip -- behind "create one first".
   * These are ordinary starting data, not fixtures: they persist, rename and
   * delete like anything the user makes. */
  const [savedFavorites, setSavedFavorites] = usePersistentState('favorites', DEMO_FAVORITES)
  // Which saved view is currently applied. Single-select: the group below the
  // divider is a choice of one, not a set of commands.
  const [selectedFavorite, setSelectedFavorite] = usePersistentState('favorite.selected', 'factory')
  const toast = useToast()

  const saveFavorite = () => {
    const name = (nameInput()?.value ?? '').trim()
    if (!name) return
    const id = `fav-${Date.now()}`
    setSavedFavorites((current) => [{ id, label: name }, ...current])
    setSelectedFavorite(id)
    resetForm()
    toast.show({ type: 'positive', message: `Favorite "${name}" created` })
  }

  const updateFavorite = () => {
    const name = editing.label.trim()
    if (!name) return false
    setSavedFavorites((current) =>
      current.map((item) =>
        item.id === editing.id ? { ...item, ...editing, label: name } : item,
      ),
    )
    toast.show({
      type: 'positive',
      message: [
        { type: 'strong', children: [{ type: 'text', value: name }] },
        { type: 'text', value: ' updated' },
      ],
    })
    setEditing(null)
  }

  const deleteFavorite = () => {
    setSavedFavorites((current) => current.filter((item) => item.id !== pendingDelete.id))
    // Applying a favorite that no longer exists is not a state worth keeping.
    if (selectedFavorite === pendingDelete.id) setSelectedFavorite('factory')
    toast.show({
      type: 'positive',
      message: [
        { type: 'strong', children: [{ type: 'text', value: pendingDelete.label }] },
        { type: 'text', value: ' deleted' },
      ],
    })
    setPendingDelete(null)
  }

  const saveFactory = () => {
    toast.show({ type: 'positive', message: 'Factory Setting updated for everyone' })
    setIsFactoryOpen(false)
  }

  /* Which favorite is currently applied, by name.
   *
   * The star fills to say "a saved view is in effect", but a filled star with
   * "Favorites" on it says the same thing as an empty one -- the useful part is
   * which view. Naming it in the tooltip turns the icon from a state into an
   * answer. */
  const appliedFavorite = [...BUILT_IN_FAVORITES, ...savedFavorites].find(
    ({ id }) => id === selectedFavorite,
  )
  const isFavoriteApplied = Boolean(appliedFavorite) && selectedFavorite !== 'factory'

  const favoritesMenu = [
    { id: 'favorites', label: 'FAVORITES', items: FAVORITES_ACTIONS },
    {
      id: 'saved',
      items: [...BUILT_IN_FAVORITES, ...savedFavorites].map((item) => ({
        ...item,
        active: item.id === selectedFavorite,
        /* Share rides the row, and only on the favorites someone made.
         *
         * A share button in the bar shares "the current view", which is a
         * different thing from sharing a named favorite, and one button cannot
         * mean both. Per row it is unambiguous. It is revealed on hover so the
         * list stays a list of names rather than a grid of controls -- CSS does
         * the hiding, since the row is the thing being hovered. Factory Setting
         * and Last Visited are excluded: they are not anyone's to share. */
        /* Share, edit and delete, in that order: the two that change nothing
           come before the one that cannot be undone, so the destructive
           control is not the one nearest the thumb travelling in from the
           right. Each returns false to stop the row also being selected --
           editing a favorite is not the same as applying it. */
        ...(savedFavorites.some(({ id }) => id === item.id)
          ? {
              actions: [
                {
                  id: `share-${item.id}`,
                  icon: 'share-alt',
                  ariaLabel: `Share ${item.label}`,
                  tooltip: `Share ${item.label}`,
                  onClick: () => {
                    setSharedFavorite(item.label)
                    setIsShareOpen(true)
                    setIsMenuOpen(false)
                    return true
                  },
                },
                {
                  id: `edit-${item.id}`,
                  icon: 'edit',
                  ariaLabel: `Edit ${item.label}`,
                  tooltip: `Edit ${item.label}`,
                  onClick: () => {
                    setEditing({ tags: [], description: '', ...item })
                    setIsMenuOpen(false)
                    return true
                  },
                },
                {
                  id: `delete-${item.id}`,
                  icon: 'trash',
                  ariaLabel: `Delete ${item.label}`,
                  tooltip: `Delete ${item.label}`,
                  onClick: () => {
                    setPendingDelete(item)
                    /* Close the menu on the way out.
                       A confirmation appearing over a still-open menu leaves
                       two surfaces claiming the same decision, and the menu is
                       the one that no longer has anything to say. */
                    setIsMenuOpen(false)
                    return true
                  },
                },
              ],
            }
          : null),
      })),
    },
  ]
  // v2: a chip reading "All" with nothing behind it announces that nothing is
  // filtered -- zero information at full visual weight. Show only what is
  // actually set and collapse the rest into a single control.
  const chips = isV2 ? allChips.filter((chip) => !isUnset(chip)) : allChips
  const unsetCount = allChips.length - chips.length

  return (
    <div className="filter-bar">
      <ArvoIconButton icon="filter" tooltip="Filters" variant="tertiary" size="md" />

      {/* Separates the filter toggle from the filter set, not the filter set
          from the chips: the set and the chips it produced belong together, and
          a rule between them read as if they were unrelated controls. */}
      <div className="filter-divider" />

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
            <span className="filter-label">{label}</span>
            <span className="filter-value">
              {value}
              {count != null && <span className="filter-count">{count}</span>}
            </span>
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

      <div className="filter-actions">
        {/* Secondary, not tertiary: these sit on the canvas now that the bar
            is transparent, and a tertiary button has no surface of its own to
            separate it from the grey. */}
        {/* One control, two halves: the star and everything else about
            favorites.
            *
            * The star behaves exactly as before -- press it and the save form
            * opens -- and the caret carries the list and its per-favorite
            * actions. They were two adjacent buttons doing one job, which made
            * the bar read as more controls than it has. The wrapper carries the
            * anchor because the popover has to hang off the pair, not off
            * whichever half was pressed. */}
        <span className="fav-split" ref={favoriteRef}>
          <ArvoSplitIconButton
            triggerRef={menuRef}
            icon={isFavoriteApplied ? 'star' : 'star-o'}
            tooltip={
              isFavoriteApplied
                ? `“${appliedFavorite.label}” is applied`
                : 'Add to favorites'
            }
            triggerLabel="Favorite actions"
            variant="secondary"
            size="md"
            onAction={() => setIsFavOpen(true)}
            hasGroupDividers
            placement="bottom-end"
            menuProps={{ menuWidth: 320, actionsVisibility: 'hover' }}
            items={favoritesMenu}
            onOpenChange={(open) => {
              setIsMenuOpen(open)
              if (!open) return
              /* Tag the rows with Arvo's own hover-reveal class.
               *
               * `.arvo-menu-item--actions-on-hover` is what the stylesheet keys
               * the reveal off, so borrowing the class beats restating its
               * rules here. The panel is portaled and mounts a frame later,
               * hence the rAF. */
              requestAnimationFrame(() => {
                document
                  .querySelectorAll('.arvo-action-menu.open .arvo-menu-item')
                  .forEach((item) => {
                    if (item.querySelector('.arvo-menu-item__actions')) {
                      item.classList.add('arvo-menu-item--actions-on-hover')
                    }
                  })
              })
            }}
            onSelect={(item) => {
              if (item.id === 'save-factory') {
                setIsFactoryOpen(true)
                return
              }
              const selectable = [...BUILT_IN_FAVORITES, ...savedFavorites]
              if (selectable.some((entry) => entry.id === item.id)) {
                setSelectedFavorite(item.id)
              }
            }}
          />
        </span>
        {/* Save-a-favourite form. `actions` puts Save and Cancel in the
            popover's own footer rather than in the body, so they sit on the
            footer rule and stay put if the body ever scrolls. */}
        <ArvoPopover
          triggerRef={favoriteRef}
          title="Favorites"
          placement="bottom-end"
          width={320}
          /* Controlled, because the star is now a segment of a split button
             rather than the popover's own trigger: the press arrives as
             onAction, not as a click the popover sees. */
          isOpen={isFavOpen}
          onOpenChange={setIsFavOpen}
          actions={[
            { id: 'save', label: 'Save', variant: 'primary', onClick: saveFavorite },
            {
              id: 'cancel',
              label: 'Cancel',
              variant: 'secondary',
              onClick: resetForm,
            },
          ]}
        >
          <div className="fav-form" ref={formRef}>
            <ArvoTextbox label="Name" placeholder="Market Plan" />
            <ArvoTextarea
              label="Description"
              placeholder="What this view is for"
              rows={3}
            />
            {/* MultiSelect reports (value, item, isSelected) -- the first
                argument is the full selection, not the item just clicked. */}
            <ArvoMultiSelect
              label="Tags"
              placeholder="Add tags"
              items={TAG_OPTIONS}
              value={tags}
              onChange={setTags}
            />
          </div>
        </ArvoPopover>

        {/* No standalone share button.
            It shared "the current view", which is a different thing from
            sharing a named favorite -- and with share now sitting on each
            favorite's own row, one control claiming both meanings was the
            ambiguous one. */}
        <ShareFavoriteWindow
          isOpen={isShareOpen}
          onOpenChange={(open) => {
            setIsShareOpen(open)
            if (!open) setSharedFavorite(null)
          }}
          {...(sharedFavorite ? { favoriteName: sharedFavorite } : null)}
        />

        {/* Edit, as a second popover on the same trigger.
         *
         * A back button rather than a close: you arrived here from the
         * favorites menu, and the way out that keeps your place is the way you
         * came in. Fields are populated from the favorite, and the primary says
         * Update rather than Save -- this changes something that exists. */}
        <ArvoPopover
          triggerRef={menuRef}
          title={editing ? `Edit “${editing.label}”` : 'Edit favorite'}
          placement="bottom-end"
          width={320}
          hasBackButton
          onBack={() => {
            /* Back means back: the favorites menu reopens where it was, rather
             * than dropping you on the bar with nothing open.
             *
             * Reopened after the popover has finished closing, not in the same
             * tick. The popover's own teardown runs an outside-click pass that
             * closes whatever else is open, so a menu reopened immediately was
             * shut again a frame later by the surface that was on its way out.
             * The delay clears the exit transition (150ms) before asking.
             *
             * Reopened by clicking the trigger rather than by setting state:
             * the split button takes an `isOpen` prop but does not act on it
             * for its own menu in this build -- closing worked only because
             * selecting a row closes the menu natively -- so clicking the caret
             * is the one path that actually opens it. */
            setEditing(null)
            window.setTimeout(() => menuRef.current?.click?.(), 220)
          }}
          isOpen={editing != null}
          onOpenChange={(open) => !open && setEditing(null)}
          actions={[
            {
              id: 'update',
              label: 'Update',
              variant: 'primary',
              onClick: updateFavorite,
            },
            {
              id: 'cancel',
              label: 'Cancel',
              variant: 'secondary',
              onClick: () => setEditing(null),
            },
          ]}
        >
          {editing && (
            <div className="fav-form">
              <ArvoTextbox
                label="Name"
                isFullWidth
                value={editing.label}
                onInput={(event) =>
                  setEditing((current) => ({ ...current, label: event.target.value }))
                }
              />
              <ArvoTextarea
                label="Description"
                isFullWidth
                rows={3}
                placeholder="What this view is for"
                value={editing.description}
                onInput={(event) =>
                  setEditing((current) => ({ ...current, description: event.target.value }))
                }
              />
              <ArvoMultiSelect
                label="Tags"
                isFullWidth
                placeholder="Add tags"
                items={TAG_OPTIONS}
                value={editing.tags}
                onChange={(value) =>
                  setEditing((current) => ({ ...current, tags: value }))
                }
              />
            </div>
          )}
        </ArvoPopover>

        {/* Deleting a favorite. Names it, says what is lost and what is not --
            the view itself is a saved set of filters, so losing it does not
            lose any data, and saying so is the difference between a confident
            click and a hesitant one. */}
        <ArvoAlertDialog
          variant="warning"
          isOpen={pendingDelete != null}
          hasDangerAction
          title="Delete favorite?"
          message={
            pendingDelete
              ? [
                  { type: 'strong', children: [{ type: 'text', value: pendingDelete.label }] },
                  {
                    type: 'text',
                    value:
                      ' will be permanently deleted, for you and for anyone it is shared with. Your data is not affected — only this saved set of filters. This can’t be undone.',
                  },
                ]
              : ''
          }
          /* Type-to-confirm, using the dialog's own confirmInput.
           *
           * Deleting a favorite is irreversible and the trigger is a small icon
           * on a hovered row -- exactly the shape of mistake a bare "are you
           * sure" does nothing to catch, because the reflex that clicked the
           * icon also clicks the button. Typing the name is a second, different
           * action, and it forces a look at which favorite this actually is.
           * `expectedValue` keeps Delete disabled until the two match. */
          confirmInput={
            pendingDelete
              ? {
                  type: 'textbox',
                  label: `Type “${pendingDelete.label}” to confirm`,
                  placeholder: pendingDelete.label,
                  expectedValue: pendingDelete.label,
                }
              : null
          }
          primaryAction={{ label: 'Delete', onClick: deleteFavorite }}
          secondaryAction={{ label: 'Cancel' }}
          onOpenChange={(open) => !open && setPendingDelete(null)}
        />

        {/* Factory Setting. The consequence is that it lands on everyone else,
            which is the whole reason to stop and ask -- so the copy leads with
            that rather than with "are you sure". */}
        <ArvoAlertDialog
          variant="warning"
          isOpen={isFactoryOpen}
          title="Save as Factory Setting?"
          message={[
            { type: 'text', value: 'This replaces the Factory Setting for ' },
            { type: 'strong', children: [{ type: 'text', value: 'everyone in this tenant' }] },
            {
              type: 'text',
              value:
                '. Anyone who has not saved a favorite of their own will open this view instead of the current default. Their own favorites are untouched.',
            },
          ]}
          primaryAction={{ label: 'Save for everyone', onClick: saveFactory }}
          secondaryAction={{ label: 'Cancel' }}
          onOpenChange={setIsFactoryOpen}
        />
      </div>
    </div>
  )
}
