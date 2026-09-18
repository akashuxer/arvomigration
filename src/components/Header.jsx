import { useLayoutEffect, useRef, useState } from 'react'
import usePersistentState from '../usePersistentState'
import {
  ArvoAvatar,
  ArvoDropdownIconButton,
  ArvoIconButton,
} from '@arvo/react'
import NotificationsPopover from './NotificationsPopover'
import CreatePostWindow from './CreatePostWindow'
import ProfilePopover from './ProfilePopover'


/* Every action the header offers, in the order the menu lists them.
 *
 * This is the single registry behind both surfaces -- the bar renders whatever
 * is pinned, the menu lists all of them -- so adding an action here puts it in
 * both places with no second list to keep in step. The same arrangement the
 * report tiles use for their puzzle menu.
 *
 * Nothing is pinned by default. The bar had nine icons on it, which is nine
 * things to read past before reaching the two that are actually about *now*:
 * whether anything has happened, and the assistant. Those two stay outside;
 * everything else is a command you go looking for when you want it, and the
 * pins are there for whichever ones a given person wants back.
 */
const HEADER_ACTIONS = [
  { id: 'create-post', label: 'Create Post', icon: 'comment-empty' },
  { id: 'refresh', label: 'Refresh', icon: 'refresh' },
  { id: 'send', label: 'Send', icon: 'paper-plane' },
  { id: 'snapshot', label: 'Create snapshot', icon: 'image' },
  { id: 'download', label: 'Download', icon: 'cloud-download' },
  { id: 'upload', label: 'Upload', icon: 'cloud-upload' },
  { id: 'export-pdf', label: 'Export as PDF', icon: 'file-pdf-o' },
  { id: 'note', label: 'Add note', icon: 'notes' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
]

/* Who you are signed in as, and where.
 *
 * The tenant name and the avatar are one identity between them -- the tenant
 * says which company's data is on screen, the avatar says whose account is
 * reading it -- so they share a tooltip rather than each holding half of the
 * answer. Getting the tenant wrong is the expensive mistake in a product where
 * two customers' plans look alike, which is why it leads. */
const IDENTITY = {
  tenant: 'Optimal Industries',
  name: 'Kayle Sank',
  email: 'kayle.sink@o9solutions.com',
}

// The View Tabs: the top-level report views this workspace offers.
export const VIEW_TABS = [
  { id: 'market', label: 'Market Assortments' },
  { id: 'channel', label: 'Channel Assortments' },
]

export default function Header({
  onOpenNova,
  isNovaOpen = false, activeTab, onTabChange, onBack, canGoBack = false }) {
  const navRef = useRef(null)
  const bellRef = useRef(null)
  const identityRef = useRef(null)
  // Owned here so the bell can badge it; the popover holds the notifications
  // themselves and reports the count up.
  const [unread, setUnread] = useState(0)
  const [isPostOpen, setIsPostOpen] = useState(false)

  /* Which actions were promoted out of the menu. A layout choice about the
     workspace rather than about this visit, so it outlives the session. */
  const [pinned, setPinned] = usePersistentState('header.pinned', [])

  const togglePin = (id) =>
    setPinned((current) =>
      current.includes(id) ? current.filter((pin) => pin !== id) : [...current, id],
    )

  const run = (id) => {
    if (id === 'create-post') setIsPostOpen(true)
  }

  /* Menu rows. Selecting a row runs the action; the trailing pin toggles whether
     it also sits on the bar. The pin returns false so the menu stays open --
     pinning several in a row should not mean reopening the menu each time. */
  const menuItems = HEADER_ACTIONS.map(({ id, label, icon }) => {
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
          tooltip: isPinned ? `Unpin ${label}` : `Pin ${label}`,
          onClick: () => {
            togglePin(id)
            return false
          },
        },
      ],
    }
  })
  const [indicator, setIndicator] = useState(null)

  // Measured in a layout effect so the indicator is positioned before paint --
  // in a plain effect the block would visibly jump on the first render.
  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const measure = () => {
      const active = nav.querySelector('.tab-button.active')
      if (!active) return
      // Rects rather than offsetLeft/offsetWidth: those round to whole pixels,
      // which left the block a fraction narrower than the tab it sits on.
      const navBox = nav.getBoundingClientRect()
      const tabBox = active.getBoundingClientRect()
      setIndicator({ x: tabBox.left - navBox.left + nav.scrollLeft, w: tabBox.width })
    }

    measure()

    /* Watch the active tab, not just the strip.
     *
     * Tabs shrink as the header narrows, so the strip can keep its width while
     * the tab inside it halves -- observing only the strip left the block at
     * its old width, overhanging the tab and inflating the strip's scrollWidth
     * enough to produce a scrollbar. Observing both catches either resizing. */
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    const active = nav.querySelector('.tab-button.active')
    if (active) observer.observe(active)

    // A window resize alongside the observer, for the plain case.
    window.addEventListener('resize', measure)

    /* And once more when the web font has loaded.
     *
     * The first measurement runs against the fallback font, and o9 Sans is
     * wider -- the tab grew underneath a block that had already been sized,
     * leaving it about 11px short of the tab it belongs to. */
    document.fonts?.ready.then(measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [activeTab])

  return (
    <header className="top-header">
      <div className="header-nav">
        {/* Disabled with no history rather than hidden: a control that comes
            and goes shifts the workspace name beside it. */}
        <ArvoIconButton
          icon="arrow-left"
          tooltip={canGoBack ? 'Back' : 'No previous view'}
          variant="secondary"
          size="md"
          isDisabled={!canGoBack}
          onClick={onBack}
        />
        <span className="workspace-name">Market Plan</span>
      </div>

      <nav className="view-tabs" ref={navRef}>
        {/* One shared block that slides between tabs, rather than each tab
            painting its own background: a background cannot travel from one
            element to another, so the movement has to belong to a single node.
            It is only rendered once measured, so it mounts already in place
            instead of sliding in from the left on first paint. */}
        {indicator && (
          /* Width and transform are set directly, not through custom
             properties. A `transition: width` whose value comes from a
             changing var() does not resolve reliably -- the block sat at an
             interpolated width indefinitely, ending up ~10px short of its tab,
             and only snapped correct when the transition was removed. */
          <span
            className="tab-indicator"
            aria-hidden="true"
            style={{ width: `${indicator.w}px`, transform: `translateX(${indicator.x}px)` }}
          />
        )}
        {VIEW_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`tab-button${activeTab === id ? ' active' : ''}`}
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="action-icons">
        {/* Pinned actions, in the registry's order rather than in the order they
            were pinned -- the bar should not reshuffle itself as you change your
            mind about what belongs on it. */}
        {HEADER_ACTIONS.filter(({ id }) => pinned.includes(id)).map(({ id, label, icon }) => (
          <ArvoIconButton
            key={id}
            icon={icon}
            tooltip={label}
            variant="tertiary"
            size="md"
            onClick={() => run(id)}
          />
        ))}

        {/* The v1/v2 switch is the "J" shortcut in App.jsx, not a header
            control -- it is a comparison aid, not a user-facing feature. */}
        <ArvoDropdownIconButton
          icon="ellipsis-h"
          tooltip="More Actions"
          variant="tertiary"
          size="md"
          placement="bottom-end"
          menuProps={{ menuWidth: 260 }}
          items={menuItems}
          /* Menu-level, not per item: ArvoActionMenu calls this prop and ignores
             any onSelect placed on the item objects. */
          onSelect={(item) => run(item.id)}
        />
        <CreatePostWindow isOpen={isPostOpen} onOpenChange={setIsPostOpen} />
        <ArvoIconButton
          ref={bellRef}
          icon="bell-o"
          /* Count when there is one, nothing when there is not -- an empty
             badge would claim attention for no news. Capped, because past a
             point the exact number stops changing what anyone does. */
          tooltip={unread ? `${unread} unread notifications` : 'You’ve no unread notifications'}
          badge={{ count: unread, overflowCount: 99, hideWhenZero: true, semanticType: 'negative' }}
          variant="tertiary"
          size="md"
        />
        {/* Popover opens itself from the trigger ref -- its default trigger is
            click, so the button needs no handler of its own. */}
        <NotificationsPopover triggerRef={bellRef} onUnreadChange={setUnread} />
      </div>

      <div className="header-divider" />

      <div className="user-context">
        {/* Nova AI. The novai variant defaults to the `outline` appearance,
            which is the resting gradient ring -- `filled` is its active state,
            so it is left alone here. */}
        {/* Filled while the panel is open, outline when it is not.
            *
            * The avatar is the only control for this panel, so it has to carry
            * its state -- and Arvo's novai variant already ships that pair:
            * `filled` is the live gradient, `outline` the resting ring. Using
            * the appearance the design system defines beats inventing an active
            * treatment that would have to be maintained beside it. */}
        <ArvoAvatar
          variant="novai"
          appearance={isNovaOpen ? 'filled' : 'outline'}
          size="md"
          tooltip={isNovaOpen ? 'Close o9 AI' : 'Ask o9 AI'}
          isInteractive
          onClick={onOpenNova}
        />
        {/* One target across both, because the tenant and the avatar are one
            identity between them -- the tenant says whose data is on screen,
            the avatar says who is reading it.
            *
            * A click, not a hover tooltip. It used to be three lines in a dark
            * bubble; a tooltip cannot hold a tenant switcher or a logout, and
            * once the panel exists two surfaces answering "who am I" from the
            * same target is one more than the question needs. */}
        <button
          type="button"
          className="identity"
          ref={identityRef}
          aria-haspopup="dialog"
          aria-label={`Account: ${IDENTITY.name}, ${IDENTITY.tenant}`}
        >
          <span className="tenant-name">{IDENTITY.tenant}</span>
          <ArvoAvatar variant="initials" name={IDENTITY.name} size="md" />
        </button>
        <ProfilePopover triggerRef={identityRef} identity={IDENTITY} />
      </div>
    </header>
  )
}
