import { useEffect, useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import ShareFavoriteWindow from './ShareFavoriteWindow'
import {
  ArvoAlertDialog,
  ArvoDropdownIconButton,
  ArvoMultiSelect,
  ArvoPopover,
  ArvoTextarea,
  ArvoTextbox,
  useToast,
} from '@arvo/react'

/* Favorites, as the launchbar's star.
 *
 * Unchanged from the version that sat on the filter bar -- same dropdown, same
 * Save As popover, same per-row share/edit/delete, same confirmations. Only the
 * trigger's position moved: it is a launchbar tool now rather than a control
 * competing with the filter chips for room on the bar.
 *
 * The menu opens to the left, because the button is against the right edge of
 * the window and there is nothing to the right of it to open into.
 */

const TAG_OPTIONS = [
  { id: 'planning', label: 'Planning', value: 'planning' },
  { id: 'trade-spend', label: 'Trade Spend', value: 'trade-spend' },
  { id: 'seasonal', label: 'Seasonal', value: 'seasonal' },
  { id: 'review', label: 'Review', value: 'review' },
  { id: 'shared', label: 'Shared', value: 'shared' },
]

/* The fixed part of the menu. Saved favourites are appended as a second,
 * unlabelled group -- a group with no label renders as a divider, which is how
 * the two halves separate without a second heading. */
const FAVORITES_ACTIONS = [
  // First, because it is the one row that makes a new thing.
  { id: 'save-as', label: 'Save As' },
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
    tags: ['review'],
  },
  {
    id: 'fav-emea-launch',
    label: 'EMEA Launch Readiness',
    description: 'New product introductions across the EMEA channel.',
    tags: ['planning'],
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

/* What the current view is called, which is what a new favorite is a copy of.
 * The header already shows it; the save form should not make you retype it. */
const VIEW_NAME = 'Market Plan'

export default function FavoritesMenu({ onOpenChange }) {
  const toast = useToast()
  const anchorRef = useRef(null)
  const menuRef = useRef(null)
  const formRef = useRef(null)

  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isFactoryOpen, setIsFactoryOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  // Which favorite the share window is about. Null means the current view.
  const [sharedFavorite, setSharedFavorite] = useState(null)
  const [isFavOpen, setIsFavOpen] = useState(false)
  // Whether the dropdown itself is showing, which the rail needs so its active
  // indicator can slide onto this tool like it does for the panel launchers.
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tags, setTags] = useState([])

  /* Uncontrolled, and read out of the DOM rather than from React state.
   *
   * Controlled inputs re-render on every keystroke, and the popover re-applies
   * its initial focus when it re-renders -- so typing in Description kept
   * throwing the caret back to Name.
   *
   * Read through a ref on the form, not refs on the fields: ArvoTextbox and
   * ArvoTextarea forward their ref to the component's root <div>, not to the
   * inner input, so `fieldRef.current.value` is undefined and every save
   * silently failed the empty-name guard. */
  const field = (selector) => formRef.current?.querySelector(selector) ?? null
  const nameInput = () => field('.arvo-textbox__input')
  const descriptionInput = () => field('.arvo-textarea__input')

  /* Cleared back to the view's own name rather than to empty. A favorite is a
     snapshot of the view you are looking at, so its name almost always starts
     from the view's -- typing it out again is a step that exists only because
     the field opened blank. */
  const resetForm = () => {
    const name = nameInput()
    const description = descriptionInput()
    if (name) name.value = VIEW_NAME
    if (description) description.value = ''
    setTags([])
  }

  /* Prefill on open. The field is uncontrolled and lives inside the popover, so
     it does not exist until the popover mounts -- hence the effect rather than a
     defaultValue. The short delay lets the popover apply its own initial focus
     first; selecting afterwards means the name is highlighted, so typing
     replaces it and Enter keeps it. */
  useEffect(() => {
    if (!isFavOpen) return undefined
    const timer = window.setTimeout(() => {
      const name = nameInput()
      if (name && !name.value) {
        name.value = VIEW_NAME
        name.select?.()
      }
    }, 60)
    return () => window.clearTimeout(timer)
  }, [isFavOpen])

  const [savedFavorites, setSavedFavorites] = usePersistentState('favorites', DEMO_FAVORITES)
  const [selectedFavorite, setSelectedFavorite] = usePersistentState('favorite.selected', 'factory')

  const saveFavorite = () => {
    const name = (nameInput()?.value ?? '').trim()
    if (!name) return
    const id = `fav-${Date.now()}`
    setSavedFavorites((current) => [{ id, label: name }, ...current])
    setSelectedFavorite(id)
    resetForm()
    toast.show({ type: 'positive', message: `Favorite “${name}” created` })
  }

  const updateFavorite = () => {
    const name = editing.label.trim()
    if (!name) return false
    setSavedFavorites((current) =>
      current.map((item) => (item.id === editing.id ? { ...item, ...editing, label: name } : item)),
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
        /* Share, edit and delete, in that order: the two that change nothing
           come before the one that cannot be undone, so the destructive control
           is not the one nearest the thumb travelling in from the right. Only on
           the favorites someone made -- Factory Setting and Last Visited are not
           anyone's to share. Each returns true to close the menu, because what
           it opens is the surface that now owns the decision. */
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
                    return true
                  },
                },
              ],
            }
          : null),
      })),
    },
  ]

  return (
    <span className="fav-split" ref={anchorRef}>
      {/* The Save As popover's anchor, and deliberately not the button.
       *
       * ArvoPopover has no manual trigger -- 'click' is the only option it
       * offers -- so it attaches its own click listener to whatever triggerRef
       * points at. Pointed at a wrapper containing the button, every press of
       * the star opened the menu and the popover at once. This span covers the
       * button's box for positioning but takes no pointer events. */}
      <span className="fav-anchor" ref={menuRef} aria-hidden="true" />

      <ArvoDropdownIconButton
        className={`launchbar-tool${isMenuOpen ? ' launchbar-tool--active' : ''}`}
        icon={isFavoriteApplied ? 'star' : 'star-o'}
        tooltip={isFavoriteApplied ? `“${appliedFavorite.label}” is applied` : 'Favorites'}
        variant="tertiary"
        /* lg, matching the launchers below it: this is one of the rail's tools
           now, and a smaller star would read as a different class of control. */
        size="lg"
        /* No caret. Every other button on this rail is a bare icon, and a
           dropdown chevron on one of them made the star read as a different
           kind of control sitting in the wrong place. The menu still opens on
           click -- isCompact drops the affordance, not the behaviour. */
        isCompact
        hasGroupDividers
        /* Opens to the left. The button is against the right edge of the window,
           so a bottom-end menu would have nowhere to go. */
        placement="left-start"
        menuProps={{ menuWidth: 280, actionsVisibility: 'hover' }}
        items={favoritesMenu}
        onOpenChange={(open) => {
          setIsMenuOpen(open)
          onOpenChange?.(open)
          if (!open) return
          /* Tag the rows with Arvo's own hover-reveal class.
           *
           * `.arvo-menu-item--actions-on-hover` is what the stylesheet keys the
           * reveal off, so borrowing the class beats restating its rules here.
           * The panel is portaled and mounts a frame later, hence the rAF. */
          requestAnimationFrame(() => {
            document.querySelectorAll('.arvo-action-menu.open .arvo-menu-item').forEach((item) => {
              if (item.querySelector('.arvo-menu-item__actions')) {
                item.classList.add('arvo-menu-item--actions-on-hover')
              }
            })
          })
        }}
        onSelect={(item) => {
          if (item.id === 'save-as') {
            /* Opened after the menu has finished closing, not in the same tick.
               The menu's teardown runs an outside-click pass that shuts whatever
               else is open, so a popover opened immediately was closed again a
               frame later by the surface on its way out. */
            window.setTimeout(() => setIsFavOpen(true), 220)
            return
          }
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

      {/* Save-a-favourite form. `actions` puts Save and Cancel in the popover's
          own footer rather than in the body, so they sit on the footer rule and
          stay put if the body ever scrolls. */}
      <ArvoPopover
        triggerRef={menuRef}
        title="Favorites"
        placement="left-start"
        width={320}
        isOpen={isFavOpen}
        onOpenChange={setIsFavOpen}
        actions={[
          { id: 'save', label: 'Save', variant: 'primary', onClick: saveFavorite },
          { id: 'cancel', label: 'Cancel', variant: 'secondary', onClick: resetForm },
        ]}
      >
        <div className="fav-form" ref={formRef}>
          <ArvoTextbox label="Name" placeholder={VIEW_NAME} />
          <ArvoTextarea label="Description" placeholder="What this view is for" rows={3} />
          {/* MultiSelect reports (value, item, isSelected) -- the first argument
              is the full selection, not the item just clicked. */}
          <ArvoMultiSelect
            label="Tags"
            placeholder="Add tags"
            items={TAG_OPTIONS}
            value={tags}
            onChange={setTags}
          />
        </div>
      </ArvoPopover>

      {/* Edit, as a second popover on the same trigger.
       *
       * A back button rather than a close: you arrived here from the favorites
       * menu, and the way out that keeps your place is the way you came in. */}
      <ArvoPopover
        triggerRef={menuRef}
        title={editing ? `Edit “${editing.label}”` : 'Edit favorite'}
        placement="left-start"
        width={320}
        hasBackButton
        onBack={() => {
          /* Reopened after the popover has finished closing, not in the same
             tick -- its teardown runs an outside-click pass that would shut the
             menu a frame later. Reopened by clicking the trigger rather than by
             setting state: the component takes an `isOpen` prop but does not act
             on it for its own menu in this build. */
          setEditing(null)
          window.setTimeout(() => anchorRef.current?.querySelector('button')?.click(), 220)
        }}
        isOpen={editing != null}
        onOpenChange={(open) => !open && setEditing(null)}
        actions={[
          { id: 'update', label: 'Update', variant: 'primary', onClick: updateFavorite },
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
              onChange={(value) => setEditing((current) => ({ ...current, tags: value }))}
            />
          </div>
        )}
      </ArvoPopover>

      <ShareFavoriteWindow
        isOpen={isShareOpen}
        onOpenChange={(open) => {
          setIsShareOpen(open)
          if (!open) setSharedFavorite(null)
        }}
        {...(sharedFavorite ? { favoriteName: sharedFavorite } : null)}
      />

      {/* Deleting a favorite. Names it, says what is lost and what is not -- the
          view itself is a saved set of filters, so losing it does not lose any
          data, and saying so is the difference between a confident click and a
          hesitant one. */}
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
        /* Type-to-confirm. Deleting is irreversible and the trigger is a small
           icon on a hovered row -- exactly the shape of mistake a bare "are you
           sure" does nothing to catch, because the reflex that clicked the icon
           also clicks the button. */
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
        primaryAction={{
          label: 'Save for everyone',
          onClick: () => {
            toast.show({ type: 'positive', message: 'Factory Setting updated for everyone' })
            setIsFactoryOpen(false)
          },
        }}
        secondaryAction={{ label: 'Cancel' }}
        onOpenChange={setIsFactoryOpen}
      />
    </span>
  )
}
