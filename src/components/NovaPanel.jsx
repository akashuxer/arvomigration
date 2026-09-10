import { useRef, useState } from 'react'
import { ArvoButton, ArvoIconButton, useToast } from '@arvo/react'

/* o9 AI — the Nova assistant panel.
 *
 * An empty assistant panel has one job: say what it can do before anyone has
 * typed. The welcome mark and the two lines under it name the thing; the
 * suggestions turn that claim into three concrete openings, worded against what
 * is actually on screen so the first question is a click rather than a blank
 * page problem.
 *
 * The gradient is Arvo's own nova token rather than a copy of its stops. The
 * design system already animates that fill on the avatar -- angle, drift and a
 * slow breathe -- so referencing the token keeps this surface in step with the
 * avatar that opened it instead of drifting into a second orange.
 */

const SUGGESTIONS = [
  'Summarize the “Online SKU Mix Forecast” view',
  'Why is 30d forecast 5.2% under actuals?',
  'Which accounts drive most of the Q3 trade spend?',
]

/* Auto lets the assistant pick; the named modes are for when someone already
 * knows which trade-off they want. */
const MODES = [
  { id: 'auto', label: 'Auto' },
  { id: 'fast', label: 'Fast' },
  { id: 'deep', label: 'Deep reasoning' },
]

export default function NovaPanel() {
  const toast = useToast()
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState(MODES[0])
  const [isModeOpen, setIsModeOpen] = useState(false)
  const inputRef = useRef(null)

  const ask = (text) => {
    const question = (text ?? prompt).trim()
    if (!question) return
    toast.show({ type: 'positive', message: `Asked o9 AI: “${question}”` })
    setPrompt('')
  }

  return (
    <div className="nova">
      <div className="nova__welcome">
        {/* The mark, inside the orbiting ring the avatar wears.
            *
            * It is the same gesture as the control that opened the panel, at a
            * size you can actually see it at -- which is what makes the panel
            * feel like the assistant rather than a page about it. */}
        <span className="nova__mark" aria-hidden="true">
          <span className="nova__mark-ring" />
          <span className="nova__mark-face">
            <i className="o9con o9con-genai" />
          </span>
        </span>
        <h2 className="nova__title">Welcome to o9 AI</h2>
        <p className="nova__subtitle">Your Intelligent Partner for Enterprise Decisions</p>
      </div>

      <section className="nova__suggestions">
        <h3 className="nova__suggestions-head">
          <i className="o9con o9con-lightbulb-o" aria-hidden="true" />
          Suggestions
        </h3>
        {SUGGESTIONS.map((text) => (
          /* A button, not a card: it does something when pressed, and the
             cheapest way to make that legible is to let it be the control it
             is. */
          <button key={text} type="button" className="nova__suggestion" onClick={() => ask(text)}>
            {text}
          </button>
        ))}
      </section>

      {/* is-live while there is something to send: the border wakes up when the
          assistant has something to answer, and rests when it does not. */}
      <div className={`nova__composer${prompt.trim() ? ' nova__composer--live' : ''}`}>
        <textarea
          ref={inputRef}
          className="nova__input"
          rows={2}
          value={prompt}
          placeholder="Ask o9 AI"
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            /* Enter sends, Shift+Enter breaks the line -- the convention every
               chat surface has trained people on. */
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              ask()
            }
          }}
        />

        <div className="nova__tools">
          {/* Which model answers. A quiet control, because Auto is right almost
              always and the choice only matters when it is not. */}
          <div className="nova__mode">
            <button
              type="button"
              className="nova__mode-btn"
              aria-expanded={isModeOpen}
              onClick={() => setIsModeOpen((open) => !open)}
            >
              <span className="nova__mode-mark" aria-hidden="true">
                <i className="o9con o9con-genai" />
              </span>
              {mode.label}
              <i className="o9con o9con-angle-down" aria-hidden="true" />
            </button>
            {isModeOpen && (
              <ul className="nova__mode-menu">
                {MODES.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className={entry.id === mode.id ? 'is-selected' : undefined}
                      onClick={() => {
                        setMode(entry)
                        setIsModeOpen(false)
                      }}
                    >
                      {entry.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <span className="nova__tool-group">
            <ArvoIconButton icon="paperclip" tooltip="Attach a file" variant="tertiary" size="sm" />
            <ArvoIconButton icon="microphone" tooltip="Dictate" variant="tertiary" size="sm" />
            <ArvoButton
              label="Send"
              icon="paper-plane"
              variant="primary"
              size="sm"
              isDisabled={!prompt.trim()}
              onClick={() => ask()}
            />
          </span>
        </div>
      </div>
    </div>
  )
}
