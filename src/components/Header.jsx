import { useLayoutEffect, useRef, useState } from 'react'
import {
  ArvoAvatar,
  ArvoDropdownIconButton,
  ArvoIconButton,
  ArvoRichTooltip,
} from '@arvo/react'
import NotificationsPopover from './NotificationsPopover'
import CreatePostWindow from './CreatePostWindow'


// Actions that are not on the bar itself live behind More Actions. Comments is
// absent because Create Post now covers it on the bar.
const MORE_ACTIONS = [
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

export default function Header({ activeTab, onTabChange, onBack, canGoBack = false }) {
  const navRef = useRef(null)
  const bellRef = useRef(null)
  const identityRef = useRef(null)
  // Owned here so the bell can badge it; the popover holds the notifications
  // themselves and reports the count up.
  const [unread, setUnread] = useState(0)
  const [isPostOpen, setIsPostOpen] = useState(false)
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
        {/* The v1/v2 switch is the "J" shortcut in App.jsx, not a header
            control -- it is a comparison aid, not a user-facing feature. */}
        <ArvoDropdownIconButton
          icon="ellipsis-h"
          tooltip="More Actions"
          variant="tertiary"
          size="md"
          placement="bottom-end"
          items={MORE_ACTIONS}
        />
        <ArvoIconButton icon="refresh" tooltip="Refresh" variant="tertiary" size="md" />
        <ArvoIconButton
          icon="comment-empty"
          tooltip="Create Post"
          variant="tertiary"
          size="md"
          onClick={() => setIsPostOpen(true)}
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
        <ArvoAvatar variant="novai" size="md" tooltip="Ask Nova AI" isInteractive />
        {/* One trigger across both, so hovering either the tenant or the
            avatar answers the whole question. */}
        <span className="identity" ref={identityRef}>
          <span className="tenant-name">{IDENTITY.tenant}</span>
          <ArvoAvatar variant="initials" name={IDENTITY.name} size="md" />
        </span>

        <ArvoRichTooltip
          triggerRef={identityRef}
          trigger="hover"
          placement="bottom-end"
          title={`Tenant: ${IDENTITY.tenant}`}
          /* Name and address on their own lines, as bodyContent rather than one
             message string: the inline adapter renders a message as a single
             run, and a name run together with an email is the one thing this
             tooltip exists to keep apart. */
          bodyContent={
            <span className="identity__lines">
              <span className="identity__name">{IDENTITY.name}</span>
              <span className="identity__email">{IDENTITY.email}</span>
            </span>
          }
        />
      </div>
    </header>
  )
}
