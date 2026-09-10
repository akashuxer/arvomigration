import { useEffect, useMemo, useState } from 'react'
import { ArvoAvatar, ArvoIconButton, ArvoPopover, ArvoTabstrip } from '@arvo/react'
import usePersistentState from '../usePersistentState'

/* The notifications popover.
 *
 * Three things decide the shape of this component, and each is a UX call worth
 * stating rather than leaving implicit in the markup:
 *
 * 1. What marks a message as new.
 *    Unread carries a corner wedge on the row and a heavier message line, not a
 *    coloured background. A tinted row would fight the semantic icon that
 *    already says what kind of message it is -- a red error on a red row reads
 *    as one signal twice, and worse, the tint would be doing the same job as
 *    the count on the bell. The wedge is orthogonal to type: it says "you have
 *    not seen this", whatever the message says. Opening the popover does not
 *    clear it; reading a row does, because dismissing everything the moment the
 *    surface opens is what makes people distrust the count.
 *
 * 2. How time is shown.
 *    Relative while it is still useful ("a few seconds ago", "12m ago"), and
 *    absolute once it is not -- past a day, "3d ago" is worse than the date
 *    itself. Either way the exact stamp is on the row's `title`, so precision
 *    is a hover away and never costs a line of layout. Relative labels re-render
 *    on a timer, because a label that says "a few seconds ago" ten minutes later
 *    is wrong, and this surface stays open while people work.
 *
 * 3. How tall it is.
 *    Flexible, not fixed. The body is sized by its content up to a ceiling of
 *    roughly six rows and scrolls past that, so three notifications produce a
 *    short popover instead of a tall one with a well of empty space under it,
 *    and fifty produce a scroll rather than a surface taller than the viewport.
 *    The empty state gets a floor instead, so the illustration has room to sit
 *    in rather than being squeezed into a strip.
 */

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/* Semantic type -> the icon that leads the row, and the tone it carries. The
 * tone is a class rather than an inline colour so it can answer to dark mode. */
const KINDS = {
  share: { icon: 'share-alt', tone: 'info' },
  mention: { icon: 'comment-empty', tone: 'info' },
  task: { icon: 'notes', tone: 'info' },
  comment: { icon: 'comment-empty', tone: 'info' },
  approval: { icon: 'check-circle', tone: 'warning' },
  warning: { icon: 'exclamation-triangle', tone: 'warning' },
  download: { icon: 'download', tone: 'info' },
  error: { icon: 'times-circle', tone: 'negative' },
  success: { icon: 'check-circle', tone: 'positive' },
  link: { icon: 'external-link', tone: 'info' },
}

/* Avatar tint, derived from the name rather than stored with it.
 *
 * Colour here is identity, not meaning -- it exists so the same colleague looks
 * the same every time they appear in the list. Hashing the name is what gives
 * that stability for free; assigning colours by hand would drift the moment the
 * data came from a real directory. */
const AVATAR_COLORS = ['blue', 'purple', 'teal', 'orange', 'pink', 'green']

function colorFor(name) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 9973
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const pad = (n) => String(n).padStart(2, '0')

/* The full stamp, always available on hover, in the same 05-Aug-2024 06:56:36 PM
 * form the platform uses elsewhere. */
function absolute(date) {
  const hours = date.getHours() % 12 || 12
  const suffix = date.getHours() < 12 ? 'AM' : 'PM'
  return (
    `${pad(date.getDate())}-${MONTHS[date.getMonth()]}-${date.getFullYear()} ` +
    `${pad(hours)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${suffix}`
  )
}

/* Relative up to a day, absolute after.
 *
 * "Updated" prefixes it the way the platform words it -- the line is about when
 * the thing last changed, not when the notification was written. */
function relative(date, now) {
  const elapsed = now - date.getTime()
  if (elapsed < MINUTE) return 'a few seconds ago'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`
  return absolute(date)
}

const ago = (minutes) => Date.now() - minutes * MINUTE

/* Day buckets.
 *
 * A flat list makes you read timestamps to work out what is recent; grouped,
 * the answer is the heading above the row. Three buckets only -- Today,
 * Yesterday, Earlier -- because past two days the precise day stops mattering
 * and more headings would cost more height than they return.
 */
function bucketOf(at, now) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  if (at >= start.getTime()) return 'Today'
  if (at >= start.getTime() - DAY) return 'Yesterday'
  return 'Earlier'
}

function groupByDay(items, now) {
  const groups = []
  for (const item of items) {
    const label = bucketOf(item.at, now)
    const last = groups.at(-1)
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

/* Message runs.
 *
 * A notification is a sentence with one named thing in it -- a view, a file, a
 * scenario -- and that name is what the eye should find first. Held as ordered
 * runs rather than a template string so the emphasis can sit wherever the
 * sentence puts it, which is not always the front: "<sender> has shared a view
 * favorite <name>" emphasises the tail, "<scenario> has been deleted" the head.
 */
const t = (value) => ({ value })
const b = (value) => ({ value, isStrong: true })

/* Seeded relative to load, so the list always reads as a plausible recent
 * history rather than as fixed dates receding into the past.
 *
 * `actor` is what separates the two halves of this list. A notification with an
 * actor is something a colleague did to you -- shared, assigned, mentioned,
 * asked -- and it leads with their face, because "who" is the first thing you
 * want and the thing you scan for. A notification without one came from the
 * platform, and leads with a semantic icon instead: no face, because inventing
 * one for a PDF job would be a lie about where the message came from.
 */
const SEED = [
  {
    id: 'n1',
    kind: 'share',
    at: ago(1),
    actor: {
      name: 'Jayanta Paul',
      email: 'jayanta.paul@o9solutions.com',
      photo: 'https://i.pravatar.cc/80?img=12',
    },
    parts: [t('shared the favorite '), b('Apple Fav View'), t(' with you')],
    action: { id: 'open', icon: 'external-link', label: 'Open favorite' },
  },
  {
    id: 'n2',
    kind: 'task',
    at: ago(6),
    actor: {
      name: 'Priya Raman',
      email: 'priya.raman@o9solutions.com',
      photo: 'https://i.pravatar.cc/80?img=45',
    },
    parts: [t('assigned you '), b('Review Q3 trade spend variance'), t(' — due Friday')],
    action: { id: 'open-task', icon: 'external-link', label: 'Open task' },
  },
  {
    id: 'n3',
    kind: 'mention',
    at: ago(18),
    actor: {
      name: 'Marcus Feld',
      email: 'marcus.feld@o9solutions.com',
      photo: 'https://i.pravatar.cc/80?img=33',
    },
    parts: [t('mentioned you in '), b('Channel Assortments — planning notes')],
  },
  {
    id: 'n4',
    kind: 'approval',
    at: ago(52),
    actor: { name: 'Ana Ortiz', email: 'ana.ortiz@o9solutions.com' },
    parts: [t('requested your approval on '), b('FY25 Promotion Plan')],
    action: { id: 'review', icon: 'external-link', label: 'Review request' },
  },
  {
    id: 'n5',
    kind: 'download',
    at: ago(95),
    parts: [b('Contiguous'), t(': PDF generated successfully')],
    action: { id: 'retry', icon: 'download', label: 'Download PDF' },
  },
  {
    id: 'n6',
    kind: 'comment',
    at: ago(210),
    actor: { name: 'Wei Chen', email: 'wei.chen@o9solutions.com' },
    parts: [t('replied to your comment on '), b('Market Assortments')],
    isRead: true,
  },
  {
    id: 'n7',
    kind: 'error',
    at: ago(400),
    parts: [
      b('DownloadAsync'),
      t(' failed with error ERR-GC-500. The export was not written and can be run again.'),
    ],
    action: { id: 'retry-export', icon: 'refresh', label: 'Run export again' },
  },
  {
    id: 'n8',
    kind: 'warning',
    at: ago(60 * 26),
    parts: [b('Private scenario 1'), t(' has been deleted')],
    isRead: true,
  },
  {
    id: 'n9',
    kind: 'success',
    at: ago(60 * 30),
    parts: [b('MassConfig'), t(' Excel file upload complete')],
    isRead: true,
  },
  {
    id: 'n10',
    kind: 'link',
    at: ago(60 * 74),
    parts: [t('Tell us how planning went this cycle — '), b('2 minute survey')],
    isRead: true,
  },
]

export default function NotificationsPopover({ triggerRef, onUnreadChange }) {
  /* Read state outlives the popover, and the session -- a notification you have
   * already dealt with coming back unread on the next open is the fastest way
   * to make the count meaningless. */
  const [items, setItems] = usePersistentState('notifications', SEED)
  const [tab, setTab] = useState('all')

  /* Ticks the relative labels forward. One timer for the whole list, and only
   * while there is something to age -- a minute is fine granularity for labels
   * that read in minutes and hours. */
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), MINUTE)
    return () => clearInterval(id)
  }, [])

  /* Newest first, always. The store keeps insertion order; what the reader
     wants is recency, and sorting here means an arriving notification lands at
     the top without the caller having to know that. */
  const ordered = useMemo(() => [...items].sort((a, b) => b.at - a.at), [items])
  const unread = ordered.filter(({ isRead }) => !isRead)
  const shown = tab === 'unread' ? unread : ordered
  const groups = useMemo(() => groupByDay(shown, now), [shown, now])

  /* The bell owns the badge but not the data, so the count is reported up
     rather than read from a second copy of the store -- two hooks over the same
     key are two pieces of state, and they would drift the moment one changed. */
  useEffect(() => {
    onUnreadChange?.(unread.length)
  }, [unread.length, onUnreadChange])

  const markRead = (id) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    )

  const markAllRead = () =>
    setItems((current) => current.map((item) => ({ ...item, isRead: true })))

  /* Per-row dismiss. Clearing everything is a blunt instrument -- most of the
     time one message is done with and the rest are not, and without this the
     only way to make the list shorter is to throw all of it away. */
  const dismiss = (id) => setItems((current) => current.filter((item) => item.id !== id))

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'All' },
      /* The count is the Tabstrip's own badge slot rather than text baked into
         the label -- it is a number that changes, and the badge is the platform
         control for exactly that. Hidden at zero, where "Unread 0" would be a
         label arguing with itself. */
      {
        id: 'unread',
        label: 'Unread',
        ...(unread.length
          ? { badge: { label: String(unread.length), semanticType: 'neutral' } }
          : null),
      },
    ],
    [unread.length],
  )

  return (
    <ArvoPopover
      triggerRef={triggerRef}
      title="Notifications"
      placement="bottom-end"
      width={380}
      hasFooter={false}
      /* Edge: the body carries no horizontal padding of its own, so rows run
         wall to wall and own their insets -- which is what lets a hovered or
         focused row read as a full-width band instead of a floating strip. */
      variant="edge"
      /* Clear All sits in the header as an inline action, which is where a
         destructive-ish list command belongs -- a footer button would be
         permanently visible for something used once in a while, and would cost
         a whole row of height on every open. */
      headerActions={[
        /* The only header action now. Marking read is the frequent, recoverable
           one; clearing lives in the footer, where it is deliberate and out of
           the path of the thing people came here to do. */
        {
          id: 'read-all',
          type: 'inline',
          label: 'Mark all as read',
          isDisabled: unread.length === 0,
          onClick: markAllRead,
        },
      ]}
      /* Clear all is a footer action, so it is pinned to the bottom edge and
         stays put while the list scrolls -- always in the same place, never
         mixed in with the messages it would destroy. Tertiary, because it is
         the exit from this surface rather than its purpose. */
      hasFooter
      actions={[
        {
          id: 'clear',
          label: 'Clear all',
          variant: 'tertiary',
          isDisabled: items.length === 0,
          /* Returning false keeps the popover open. Clearing closed it, so the
             only feedback was the list vanishing along with the surface --
             staying open shows the empty state, which is the confirmation that
             the action did what it said. */
          onClick: () => {
            setItems([])
            return false
          },
        },
      ]}
      stickyHeader={
        /* Pinned, so the filter stays reachable however far the list is
           scrolled -- the tabs are the way back out of a long history. */
        <ArvoTabstrip
          variant="primary"
          size="md"
          tabs={tabs}
          selectedId={tab}
          onSelect={(id) => setTab(typeof id === 'string' ? id : id?.id)}
          /* Two tabs splitting the width: the pair reads as one segmented
             control over the list below, and each target is half the popover
             instead of a short label at the left edge. */
          isFullWidth
          hasOverflow={false}
        />
      }
      emptyContent={
        shown.length === 0
          ? tab === 'unread'
            ? {
                illustration: 'no-notifications',
                title: 'You’re all caught up',
                message: 'Every notification has been read.',
              }
            : {
                illustration: 'no-notifications',
                title: 'No new notification',
                message: 'Updates about your views, downloads and scenarios will appear here.',
              }
          : undefined
      }
    >
      {/* Announced, not just drawn. Someone using a screen reader has no bell
          to glance at, so the count is spoken when it changes -- politely, so
          it never interrupts what is being read. */}
      <span className="sr-only" role="status" aria-live="polite">
        {unread.length
          ? `${unread.length} unread notification${unread.length === 1 ? '' : 's'}`
          : 'No unread notifications'}
      </span>

      <div className="notif-list">
        {groups.map((group) => (
          <section className="notif-group" key={group.label}>
            {/* Sticks to the top of the scroll area, so the day you are reading
                stays named however far down the history you go. */}
            <h3 className="notif-group__label">{group.label}</h3>
            <ul className="notif-group__items">
              {group.items.map((item) => {
                const { icon, tone } = KINDS[item.kind] ?? KINDS.share
                const date = new Date(item.at)
                const stamp = absolute(date)
                return (
                  <li
                    key={item.id}
                    className={`notif${item.isRead ? '' : ' notif--unread'}`}
                    /* The row is the read target: clicking anywhere on it is how
                       a notification is consumed, so it carries the affordance
                       rather than hiding it behind a per-row control. */
                    tabIndex={0}
                    role="button"
                    onClick={() => markRead(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Delete' || event.key === 'Backspace') {
                        // Dismiss from the keyboard too -- the hover-revealed
                        // close button is unreachable without a pointer.
                        event.preventDefault()
                        dismiss(item.id)
                        return
                      }
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      markRead(item.id)
                    }}
                  >
                    {!item.isRead && <span className="notif__flag" aria-hidden="true" />}

                    {/* Who it came from, or what it was about. A person gets
                        their face with the message type as a small overlay, so
                        both questions are answered in one 32px slot; the
                        platform gets the type alone. */}
                    {item.actor ? (
                      <span className="notif__avatar">
                        {/* A real photo when the directory has one, initials
                            when it does not -- which is most of any real tenant.
                            The image variant falls back to initials on its own
                            if the file fails to load, so a broken avatar URL
                            degrades to the same thing rather than a gap.
                            md is 32px, matching the slot: at sm the face sat at
                            20px inside a 32px column and looked shrunken. */}
                        <ArvoAvatar
                          variant={item.actor.photo ? 'image' : 'initials'}
                          size="md"
                          src={item.actor.photo}
                          name={item.actor.name}
                          alt={item.actor.name}
                          colorMode="custom"
                          customColor={colorFor(item.actor.name)}
                        />
                        <span
                          className={`notif__stamp notif__stamp--${tone}`}
                          aria-hidden="true"
                        >
                          <i className={`o9con o9con-${icon}`} />
                        </span>
                      </span>
                    ) : (
                      <span className={`notif__icon notif__icon--${tone}`} aria-hidden="true">
                        <i className={`o9con o9con-${icon}`} />
                      </span>
                    )}

                    <span className="notif__content">
                      {/* title carries the untruncated sentence, so a clamped
                          message is still readable without opening anything. */}
                      <span
                        className="notif__message"
                        title={`${item.actor ? `${item.actor.name} ` : ''}${item.parts
                          .map((p) => p.value)
                          .join('')}`}
                      >
                        {/* The name leads the sentence and carries the weight:
                            "Priya Raman assigned you X" scans as who-did-what,
                            which a bare "You were assigned X" does not. */}
                        {item.actor && (
                          <>
                            <strong className="notif__subject">{item.actor.name}</strong>{' '}
                          </>
                        )}
                        {item.parts.map((part, index) =>
                          part.isStrong ? (
                            <strong key={index} className="notif__subject">
                              {part.value}
                            </strong>
                          ) : (
                            <span key={index}>{part.value}</span>
                          ),
                        )}
                      </span>
                      {/* datetime carries the machine-readable stamp; title puts
                          the exact time one hover away from the relative label. */}
                      <time className="notif__time" dateTime={date.toISOString()} title={stamp}>
                        Updated {relative(date, now)}
                      </time>
                    </span>

                    <span className="notif__actions">
                      {item.action && (
                        <ArvoIconButton
                          icon={item.action.icon}
                          tooltip={item.action.label}
                          variant="tertiary"
                          size="sm"
                          /* Acting on a row reads it too, but the row's own
                             handler must not also fire -- one click, one
                             outcome. */
                          onClick={(event) => {
                            event.stopPropagation()
                            markRead(item.id)
                          }}
                        />
                      )}
                      {/* Revealed on hover and focus. Present for every row, but
                          not competing for attention with the message until the
                          pointer is on it. */}
                      <span className="notif__dismiss">
                        <ArvoIconButton
                          /* `close`, not `times`: this build's icon font has
                             no glyph for `times`, so the button rendered as an
                             empty box. */
                          icon="close"
                          tooltip="Dismiss"
                          variant="tertiary"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation()
                            dismiss(item.id)
                          }}
                        />
                      </span>
                    </span>

                    {!item.isRead && <span className="sr-only">Unread</span>}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

    </ArvoPopover>
  )
}
