import { useCallback, useEffect, useRef, useState } from 'react'
import { ArvoButton, ArvoIconButton, useToast } from '@arvo/react'

/* Help & Feedback.
 *
 * The panel is built around one idea: people arriving here do not know whether
 * their problem is a question or a complaint, and making them choose is the
 * first thing that makes a help surface feel like paperwork. So the panel opens
 * on a single box -- "What do you need help with?" -- reads what is typed, and
 * routes it. The two quick actions are the same two destinations for people who
 * already know which one they want, and they skip the reading step.
 *
 * Four entries, one loader:
 *
 *   typed, question-shaped  -> "Opening AI help for this task…"
 *   typed, friction-shaped  -> "Opening feedback capture…"
 *   I'm stuck (no typing)   -> the AI loader, immediately
 *   Give feedback (no typing) -> the feedback loader, immediately
 *
 * The loader is one component in both cases -- same container, same motion,
 * same two lines -- because the reassurance being offered is the same
 * ("understood, and your context is coming with you"). Only the icon and the
 * words change. Two visually different waits would read as two systems.
 */

/* Routing.
 *
 * Deliberately crude, and deliberately biased toward feedback. A wrong guess
 * costs a click in either direction, but sending a complaint into a chat bot is
 * the more annoying of the two mistakes -- it answers a question nobody asked --
 * so friction wins ties. The real classifier lives on the server; this is the
 * shape of the contract, not the model. */
const FRICTION_MARKERS = [
  'annoying', 'annoy', 'frustrat', 'keeps', 'every time', 'always happens',
  'slow', 'lag', 'broken', 'bug', 'wrong', 'should not', "shouldn't",
  'hate', 'confusing', 'unusable', 'crash', 'stuck in', 'again and again',
]

const QUESTION_MARKERS = [
  'how', 'what', 'where', 'why', 'can i', 'is there', 'help me',
  "i don't know", 'i dont know', 'unable to', 'show me', 'explain',
]

function classify(text) {
  const value = text.toLowerCase()
  const friction = FRICTION_MARKERS.some((marker) => value.includes(marker))
  const question = QUESTION_MARKERS.some((marker) => value.includes(marker)) || value.includes('?')
  if (friction && !question) return 'feedback'
  if (question) return 'ai'
  return friction ? 'feedback' : 'ai'
}

/* The two destinations, as data. Everything that differs between the AI path
 * and the feedback path is in here, which is what keeps the loader itself from
 * growing a branch. */
const ROUTES = {
  ai: {
    icon: 'novai',
    primary: 'Opening AI help for this task…',
    secondary: 'Adding your question and current page context.',
  },
  feedback: {
    icon: 'comment-empty',
    primary: 'Opening feedback capture…',
    secondary: 'Adding page and workflow context automatically.',
  },
}

const QUICK_ACTIONS = [
  {
    id: 'ai',
    icon: 'novai',
    title: 'I’m stuck',
    hint: 'Ask AI now',
  },
  {
    id: 'feedback',
    icon: 'comment-empty',
    title: 'Give feedback',
    hint: 'Report friction',
  },
]

const RELEASES = [
  {
    id: 'jul-2026',
    month: 'Jul 2026',
    isNew: true,
    title: 'Contextual Help panel launched',
    body: 'Get task-specific help without leaving your planning view.',
    updates: 4,
  },
  {
    id: 'jun-2026',
    month: 'Jun 2026',
    title: 'Workflow drag-and-drop reordering',
    body: 'Rearrange your workflow steps with a pointer instead of the move dialog.',
    updates: 2,
  },
  {
    id: 'may-2026',
    month: 'May 2026',
    title: 'Faster pivot exports',
    body: 'Large pivots now export in the background so you can keep working.',
    updates: 3,
  },
]

const BEST_PRACTICES = [
  {
    id: 'filters',
    title: 'Filter before you scroll',
    body: 'Narrowing to one region or account is faster than hunting a long pivot, and the view is shareable afterwards.',
  },
  {
    id: 'favorites',
    title: 'Save the views you return to',
    body: 'A favorite carries its filters, layout and formatting, so a Monday review is one click rather than six.',
  },
  {
    id: 'workflows',
    title: 'Group favorites into a workflow',
    body: 'Workflows keep a review in order and let you hand the whole sequence to someone covering for you.',
  },
  {
    id: 'comments',
    title: 'Comment where the number is',
    body: 'A comment on the cell survives the export; the same note in chat does not.',
  },
]

const SHORTCUTS = [
  { keys: 'J', label: 'Switch view layout' },
  { keys: 'Shift + F', label: 'Focus mode' },
  { keys: 'Shift + D', label: 'Dark mode' },
  { keys: 'Shift + ~', label: 'Reset saved preferences' },
  { keys: '⌘ / Ctrl + Enter', label: 'Post from the compose box' },
]

export default function HelpPanel({ onClose, view, onViewChange }) {
  const toast = useToast()

  const [intent, setIntent] = useState('')
  const [route, setRoute] = useState(null) // null | 'ai' | 'feedback' while loading
  const [isClosing, setIsClosing] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [shot, setShot] = useState(null)
  const [isClipping, setIsClipping] = useState(false)
  const [isAtPractices, setIsAtPractices] = useState(false)

  const bodyRef = useRef(null)
  const practicesRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  /* The wait.
   *
   * Long enough to be read (~1.4s), short enough not to feel stuck. The panel
   * then fades out on the same motion it opens with, and the destination takes
   * over -- so the loader is the handover, not a stall in front of one. */
  const beginRoute = (kind) => {
    setRoute(kind)
    timers.current.push(
      window.setTimeout(() => {
        setIsClosing(true)
        timers.current.push(
          window.setTimeout(() => {
            setRoute(null)
            setIsClosing(false)
            if (kind === 'ai') {
              onClose?.()
              toast.show({
                type: 'positive',
                message: 'Nova AI opened with your question and page context',
              })
            } else {
              // Feedback stays in the panel: the form is the destination.
              onViewChange?.('feedback')
              setFeedback((current) => current || intent)
            }
            setIntent('')
          }, 260),
        )
      }, 1400),
    )
  }

  const submitIntent = () => {
    const text = intent.trim()
    if (!text) return
    beginRoute(classify(text))
  }

  /* Region capture.
   *
   * The overlay is real -- drag a rectangle and the coordinates are what get
   * attached. The image is a rendering of the selection rather than the pixels
   * under it: capturing those needs getDisplayMedia and a permission prompt,
   * which belongs to the shell rather than to this panel. Wiring that in later
   * changes this function and nothing else. */
  const captureRegion = useCallback((rect) => {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(rect.width))
    canvas.height = Math.max(1, Math.round(rect.height))
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f2f2f2'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#b0b0b0'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)
    ctx.fillStyle = '#616161'
    ctx.font = '16px system-ui, sans-serif'
    ctx.fillText(
      `${Math.round(rect.width)} × ${Math.round(rect.height)}`,
      12,
      Math.min(28, canvas.height - 8),
    )
    setShot({
      src: canvas.toDataURL('image/png'),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    })
  }, [])

  /* Which of the two the sticky row is: a footer you can press, or the heading
     of the section you have reached. One control, two states, so the row never
     duplicates itself on screen. */
  useEffect(() => {
    const body = bodyRef.current
    const section = practicesRef.current
    if (!body || !section || view !== 'home') return
    const onScroll = () => {
      const bodyBox = body.getBoundingClientRect()
      const box = section.getBoundingClientRect()
      setIsAtPractices(box.top <= bodyBox.top + 56)
    }
    onScroll()
    body.addEventListener('scroll', onScroll, { passive: true })
    return () => body.removeEventListener('scroll', onScroll)
  }, [view])

  const goToPractices = () => {
    practicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (view === 'shortcuts') {
    return (
      <div className="help">
        <div className="help__back">
          <ArvoButton
            label="Back to help"
            icon="angle-left"
            variant="tertiary"
            size="sm"
            onClick={() => onViewChange('home')}
          />
        </div>
        <h3 className="help__section-title">Keyboard shortcuts</h3>
        <ul className="help__shortcuts">
          {SHORTCUTS.map(({ keys, label }) => (
            <li key={keys}>
              <span>{label}</span>
              <kbd>{keys}</kbd>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (view === 'feedback') {
    return (
      <div className="help help--feedback">
        <div className="help__back">
          <ArvoButton
            label="Back to help"
            icon="angle-left"
            variant="tertiary"
            size="sm"
            onClick={() => onViewChange('home')}
          />
        </div>

        <h3 className="help__section-title">Report friction</h3>
        <p className="help__muted">
          Page, workflow and filter context are attached automatically.
        </p>

        <textarea
          className="help__textarea help__textarea--plain"
          rows={5}
          value={feedback}
          placeholder="What got in your way?"
          onChange={(event) => setFeedback(event.target.value)}
        />

        {/* "Take a screenshot", not "attach": a paperclip asks you to go and
            find a file, which is the wrong instruction when the thing you want
            to show is on the screen in front of you. */}
        <ArvoButton
          label="Take a screenshot"
          icon="camera"
          variant="secondary"
          size="sm"
          onClick={() => setIsClipping(true)}
        />

        {shot && (
          <figure className="help__shot">
            <img src={shot.src} alt={`Screenshot, ${shot.width} by ${shot.height} pixels`} />
            {/* Annotate on hover, delete always reachable in the corner. */}
            <figcaption className="help__shot-overlay">
              <ArvoButton
                label="Annotate this"
                icon="edit"
                variant="secondary"
                size="sm"
                onClick={() => toast.show({ type: 'positive', message: 'Annotation tools opened' })}
              />
            </figcaption>
            <span className="help__shot-close">
              <ArvoIconButton
                icon="close"
                tooltip="Remove screenshot"
                variant="tertiary"
                size="sm"
                onClick={() => setShot(null)}
              />
            </span>
          </figure>
        )}

        <div className="help__feedback-actions">
          <ArvoButton
            label="Send feedback"
            variant="primary"
            size="sm"
            isDisabled={!feedback.trim()}
            onClick={() => {
              toast.show({ type: 'positive', message: 'Thanks — your feedback was sent' })
              setFeedback('')
              setShot(null)
              onViewChange('home')
            }}
          />
          <ArvoButton
            label="Cancel"
            variant="secondary"
            size="sm"
            onClick={() => onViewChange('home')}
          />
        </div>

        {isClipping && (
          <RegionClipper
            onCancel={() => setIsClipping(false)}
            onSelect={(rect) => {
              setIsClipping(false)
              captureRegion(rect)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className={`help${isClosing ? ' help--closing' : ''}`} ref={bodyRef}>
      {/* Intent capture. The largest thing in the panel, because it is the only
          part most visits use. */}
      <section className="help__intent">
        <h3 className="help__question">What do you need help with?</h3>

        <div className="help__quick">
          {QUICK_ACTIONS.map(({ id, icon, title, hint }) => (
            <button
              key={id}
              type="button"
              className="help__quick-btn"
              disabled={route != null}
              onClick={() => beginRoute(id)}
            >
              <span className={`help__quick-icon help__quick-icon--${id}`} aria-hidden="true">
                <i className={`o9con o9con-${icon}`} />
              </span>
              <span className="help__quick-text">
                <span className="help__quick-title">{title}</span>
                <span className="help__quick-hint">{hint}</span>
              </span>
            </button>
          ))}
        </div>

        {/* The box and the loader occupy one place, and the loader grows out of
            where Submit was rather than appearing somewhere new. */}
        <div className={`help__box${route ? ' help__box--busy' : ''}`}>
          <textarea
            className="help__textarea"
            value={intent}
            rows={6}
            disabled={route != null}
            placeholder="Describe what you need"
            onChange={(event) => setIntent(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submitIntent()
            }}
          />

          <div className="help__box-foot">
            <span className="help__box-hint">
              <i className="o9con o9con-novai" aria-hidden="true" />
              Describe what you need
            </span>
            <ArvoIconButton
              icon="arrow-right"
              tooltip="Submit"
              variant="primary"
              size="sm"
              isDisabled={!intent.trim() || route != null}
              onClick={submitIntent}
            />
          </div>

          {route && (
            <div className="help__loader" role="status" aria-live="polite">
              <span className="help__loader-dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="help__loader-text">
                <span className="help__loader-primary">
                  <i className={`o9con o9con-${ROUTES[route].icon}`} aria-hidden="true" />
                  {ROUTES[route].primary}
                </span>
                <span className="help__loader-secondary">{ROUTES[route].secondary}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="help__news">
        <header className="help__news-head">
          <h4 className="help__eyebrow">What’s new</h4>
          <a className="help__link" href="#release-notes" onClick={(e) => e.preventDefault()}>
            Latest releases
          </a>
        </header>

        <ol className="help__timeline">
          {RELEASES.map(({ id, month, isNew, title, body, updates }) => (
            <li className="help__release" key={id}>
              <span className={`help__dot${isNew ? ' help__dot--new' : ''}`} aria-hidden="true" />
              <div className="help__release-body">
                <span className="help__release-meta">
                  {month}
                  {isNew && <span className="help__new">New</span>}
                </span>
                <h5 className="help__release-title">{title}</h5>
                <p className="help__release-text">{body}</p>
                <div className="help__release-actions">
                  <span className="help__pill">+{updates} updates</span>
                  <ArvoButton
                    label="Guided walkthrough"
                    icon="play"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      toast.show({ type: 'positive', message: `Walkthrough started: ${title}` })
                    }
                  />
                  <a className="help__link" href="#notes" onClick={(e) => e.preventDefault()}>
                    Release notes →
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="help__practices" ref={practicesRef}>
        {/* The same row as the sticky footer, in its landed state. */}
        <header className={`help__practices-head${isAtPractices ? ' is-stuck' : ''}`}>
          <i className="o9con o9con-lightbulb-o" aria-hidden="true" />
          Best practices
        </header>
        <ul className="help__practice-list">
          {BEST_PRACTICES.map(({ id, title, body }) => (
            <li key={id}>
              <h5>{title}</h5>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Sticky until you arrive. Pressing it scrolls to the section, and the
          section's own header takes its place -- so the row is either the way
          in or the label of where you are, never both. */}
      {!isAtPractices && (
        <button type="button" className="help__sticky" onClick={goToPractices}>
          <i className="o9con o9con-lightbulb-o" aria-hidden="true" />
          Best practices
          <i className="o9con o9con-angle-down help__sticky-caret" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/* Drag a rectangle over the app.
 *
 * Crosshair cursor, a dimmed backdrop with the selection punched out of it, and
 * a live size readout -- the three things that make a region selector feel like
 * a tool rather than a mystery. Escape cancels, which is the one shortcut people
 * try when they change their mind mid-drag. */
function RegionClipper({ onSelect, onCancel }) {
  const [start, setStart] = useState(null)
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const rect =
    start && current
      ? {
          left: Math.min(start.x, current.x),
          top: Math.min(start.y, current.y),
          width: Math.abs(current.x - start.x),
          height: Math.abs(current.y - start.y),
        }
      : null

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="clipper"
      onPointerDown={(event) => {
        setStart({ x: event.clientX, y: event.clientY })
        setCurrent({ x: event.clientX, y: event.clientY })
      }}
      onPointerMove={(event) => start && setCurrent({ x: event.clientX, y: event.clientY })}
      onPointerUp={() => {
        // A click with no drag is a miss, not a 1px capture.
        if (rect && rect.width > 8 && rect.height > 8) onSelect(rect)
        else onCancel()
      }}
    >
      <div className="clipper__hint">
        <i className="o9con o9con-crosshairs" aria-hidden="true" />
        Drag to select an area — Esc to cancel
      </div>
      {rect && (
        <div
          className="clipper__sel"
          style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        >
          <span className="clipper__size">
            {Math.round(rect.width)} × {Math.round(rect.height)}
          </span>
        </div>
      )}
    </div>
  )
}
