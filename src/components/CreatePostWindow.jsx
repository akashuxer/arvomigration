import { useCallback, useRef, useState } from 'react'
import {
  ArvoChip,
  ArvoIconButton,
  ArvoMultiSelect,
  ArvoSelect,
  ArvoTextbox,
  ArvoToggleButton,
  ArvoWindow,
  useToast,
} from '@arvo/react'

/* Create Post.
 *
 * A modernisation of the legacy dialog rather than a transcription of it. Four
 * judgements drove what changed:
 *
 * 1. The icon rail is gone. A column of glyphs down the left edge -- a speech
 *    bubble beside Topic, a tag beside Tags -- restates the field's own label
 *    and buys nothing; it cost horizontal room every row and made none of them
 *    easier to identify. Labels above their fields do that job, and the eye
 *    reads one column instead of two.
 *
 * 2. The font-family and font-size pickers are gone. They were an artifact of a
 *    rich-text control, not a decision anyone posting an update wants to make,
 *    and "(inherited ...)" as a visible value is an implementation detail
 *    leaking into the UI. What people actually reach for -- emphasis, a list, a
 *    link -- stays, as a small toolbar of toggles.
 *
 * 3. Post is disabled until the post is postable. The original let you submit
 *    an empty topic and told you afterwards. Requirements are stated up front
 *    (a topic and a message), the button reflects them, and the reason is on
 *    the button's own tooltip rather than in an error that appears after the
 *    fact.
 *
 * 4. Only the topic is required. A post is filed under its topic, so that is
 *    the one thing it cannot go without; a topic on its own -- "Promo depth
 *    review moved to Thursday" -- is a perfectly good post, and demanding a
 *    body for it was the form insisting on ceremony it did not need.
 *
 * Closing abandons the post. The compose window is not a document: Post and
 * Discard are the two ways out, and both leave an empty form behind.
 */

const CATEGORIES = [
  { value: 'risks', label: 'Risks & Opportunities' },
  { value: 'decisions', label: 'Decisions' },
  { value: 'assumptions', label: 'Assumptions' },
  { value: 'actions', label: 'Action Items' },
  { value: 'general', label: 'General Discussion' },
]

const TAGS = [
  { value: 'forecast', label: 'forecast' },
  { value: 'trade-spend', label: 'trade-spend' },
  { value: 'promo', label: 'promo' },
  { value: 'supply', label: 'supply' },
  { value: 'pricing', label: 'pricing' },
  { value: 'q3', label: 'q3' },
]

const PEOPLE = [
  { value: 'akash', label: 'Akash Upadhyay' },
  { value: 'austin', label: 'Austin Brooks' },
  { value: 'priya', label: 'Priya Raman' },
  { value: 'marcus', label: 'Marcus Feld' },
  { value: 'ana', label: 'Ana Ortiz' },
  { value: 'wei', label: 'Wei Chen' },
]

/* The formatting people actually use in a post. Bold and italic carry emphasis,
 * a list carries structure, a link carries the thing being discussed. Anything
 * beyond that belongs to a document editor, not a comment box. */
const FORMATS = [
  { id: 'bold', command: 'bold', icon: 'bold', label: 'Bold', shortcut: 'b' },
  { id: 'italic', command: 'italic', icon: 'italic', label: 'Italic', shortcut: 'i' },
  { id: 'underline', command: 'underline', icon: 'underline', label: 'Underline', shortcut: 'u' },
  {
    id: 'list',
    command: 'insertUnorderedList',
    icon: 'list-ul',
    label: 'Bulleted list',
  },
]

const EMPTY_DRAFT = {
  topic: '',
  body: '',
  tags: ['forecast'],
  category: 'risks',
  notify: [],
  isWebOnly: false,
}

export default function CreatePostWindow({ isOpen, onOpenChange }) {
  const toast = useToast()

  /* Held for as long as the window is open, and no longer.
   *
   * An unposted post is not a document -- closing the compose window is how
   * people abandon one, and having it reappear later, half-written, is the
   * surprise rather than the service. Post or Discard are the two ways out;
   * both end with an empty form. */
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }))

  const [attachments, setAttachments] = useState([])
  const formRef = useRef(null)
  const [activeFormats, setActiveFormats] = useState({})
  const [isDropping, setIsDropping] = useState(false)
  const fileRef = useRef(null)

  const hasTopic = draft.topic.trim().length > 0
  const hasBody = draft.body.replace(/<[^>]*>/g, '').trim().length > 0
  // A topic is the only thing a post cannot do without -- it is what the post
  // is listed under. A one-line topic with no body is a legitimate post.
  const canPost = hasTopic
  const bodyChars = draft.body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length

  /* The editor is uncontrolled once mounted -- writing `innerHTML` on every
     keystroke would collapse the selection to the start of the line and make
     typing impossible. So it is seeded exactly once, as the node mounts.
     *
     * A ref callback rather than an effect on `isOpen`: the window does not
     * render its body until it opens, so an effect keyed on opening ran while
     * `bodyRef.current` was still null and the restored draft never reached the
     * editor -- the topic came back and the message looked lost. The callback
     * fires when the node actually exists, which is the only moment that can
     * seed it. */
  const bodyRef = useRef(null)
  const draftBodyRef = useRef(draft.body)
  draftBodyRef.current = draft.body
  const isSeeded = useRef(false)

  /* useCallback with no deps, and a seed-once guard.
   *
   * Both halves are load-bearing. An inline arrow is a new function every
   * render, so React detaches and re-attaches the ref on each one -- which ran
   * the seeding again after every keystroke, rewrote innerHTML and threw the
   * caret back to the start of the field. The symptom was not being able to
   * type at all. The stable identity stops the re-attach; the flag stops a
   * remount from overwriting text that has since been edited. */
  /* Places focus on the first field, once per open.
   *
   * Stable identity and a one-shot flag, for the same reason the editor's ref
   * has them: an inline arrow is a new function every render, so React
   * re-attaches it on each one -- and re-running this focused the Topic field
   * again mid-sentence, which is exactly what made the message box impossible
   * to type in. Clicking into the message must leave focus where it was put. */
  const hasFocused = useRef(false)
  const attachForm = useCallback((node) => {
    formRef.current = node
    if (!node) {
      hasFocused.current = false
      return
    }
    if (hasFocused.current) return
    hasFocused.current = true
    node.querySelector('input[type="text"]')?.focus()
  }, [])

  const attachEditor = useCallback((node) => {
    bodyRef.current = node
    if (!node) {
      // Unmounted with the window; the next open should seed from the draft.
      isSeeded.current = false
      return
    }
    if (isSeeded.current) return
    isSeeded.current = true
    node.innerHTML = draftBodyRef.current
  }, [])

  // Which formats apply where the cursor is, so the toggles show state rather
  // than just issuing commands.
  const syncFormats = () => {
    const next = {}
    for (const { id, command } of FORMATS) {
      try {
        next[id] = document.queryCommandState(command)
      } catch {
        next[id] = false
      }
    }
    setActiveFormats(next)
  }

  const applyFormat = (command) => {
    bodyRef.current?.focus()
    document.execCommand(command)
    syncFormats()
    set('body')(bodyRef.current?.innerHTML ?? '')
  }

  const addLink = () => {
    const url = window.prompt('Link URL')
    if (!url) return
    bodyRef.current?.focus()
    document.execCommand('createLink', false, url)
    set('body')(bodyRef.current?.innerHTML ?? '')
  }

  const attach = (files) => {
    const added = [...files].map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
    }))
    setAttachments((current) => [
      ...current,
      ...added.filter(({ id }) => !current.some((file) => file.id === id)),
    ])
  }

  const reset = () => {
    setDraft(EMPTY_DRAFT)
    setAttachments([])
    draftBodyRef.current = ''
    if (bodyRef.current) bodyRef.current.innerHTML = ''
  }

  const post = () => {
    if (!canPost) return false
    toast.show({
      type: 'positive',
      message: [
        { type: 'text', value: 'Posted to ' },
        {
          type: 'strong',
          children: [
            {
              type: 'text',
              value: CATEGORIES.find(({ value }) => value === draft.category)?.label ?? '',
            },
          ],
        },
      ],
    })
    reset()
    return true
  }

  /* The shortcuts people already have in their fingers. Without these the
     toolbar is the only way to emphasise a word, which is slower than typing
     the sentence was. */
  const onEditorKeyDown = (event) => {
    if (!(event.metaKey || event.ctrlKey)) return
    const format = FORMATS.find(({ shortcut }) => shortcut === event.key.toLowerCase())
    if (!format) return
    event.preventDefault()
    applyFormat(format.command)
  }

  /* Cmd/Ctrl+Enter posts. This is a form people fill in from the keyboard, and
     reaching for the mouse to submit is the slowest part of writing a short
     update. */
  const onKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && canPost) {
      event.preventDefault()
      post()
      onOpenChange(false)
    }
  }

  return (
    <ArvoWindow
      size="md"
      title="Create Post"
      isOpen={isOpen}
      onOpenChange={(open) => {
        // Closing is abandoning: the close button, Escape and Discard all land
        // here, and all of them leave an empty form behind.
        if (!open) reset()
        onOpenChange(open)
      }}
      /* Focus is placed once, by this component, rather than by the window.
       *
       * ArvoWindow builds its `initialFocus` resolver inline, so the option is a
       * new function on every render and the overlay engine re-applies initial
       * focus each time. Any state change while typing -- a keystroke reaching
       * the draft -- therefore threw the caret from the message box back to the
       * Topic field: the message was impossible to type into past one
       * character. Opting out of the engine's focus and doing it ourselves on
       * open is the fix. */
      initialFocus="none"
      primaryAction={{
        label: 'Post',
        isDisabled: !canPost,
        onClick: post,
      }}
      ariaDescribedBy={undefined}
      secondaryActions={[
        {
          /* "Discard", not "Cancel": the draft is kept now, so the two are
             genuinely different outcomes and the label has to say which one
             this is. */
          label: 'Discard',
          onClick: () => {
            reset()
            return true
          },
        },
      ]}
      /* Attach sits in the footer's left slot, opposite the actions -- it acts
         on the post rather than completing it, so it does not belong in the
         same cluster as Post. */
      footerLeft={
        <div className="post__attach">
          <ArvoIconButton
            icon="paperclip"
            tooltip="Attach files"
            variant="tertiary"
            size="sm"
            onClick={() => fileRef.current?.click()}
          />
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(event) => {
              attach(event.target.files)
              event.target.value = ''
            }}
          />
          <span className="post__hint">
            {attachments.length
              ? `${attachments.length} file${attachments.length === 1 ? '' : 's'}`
              : 'Attach'}
          </span>
        </div>
      }
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="post" onKeyDown={onKeyDown} ref={attachForm}>
        <ArvoTextbox
          label="Topic"
          isRequired
          isFullWidth
          placeholder="What is this post about?"
          value={draft.topic}
          maxLength={120}
          onInput={(event) => set('topic')(event.target.value)}
        />

        <div className="post__field">
          <span className="post__label">Message</span>

          {/* Toolbar above the surface it acts on, and inside the same bordered
              block, so the two read as one control rather than as a strip of
              buttons that happens to sit nearby. */}
          {/* Files can be dropped straight onto the message.
              Reaching for a paperclip in the footer is a detour when the file
              is already under the pointer, and a compose box is where people
              expect a drop to land. */}
          <div
            className={`post__editor${isDropping ? ' post__editor--dropping' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDropping(true)
            }}
            onDragLeave={() => setIsDropping(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDropping(false)
              attach(event.dataTransfer.files)
            }}
          >
            <div className="post__toolbar" role="toolbar" aria-label="Formatting">
              {FORMATS.map(({ id, command, icon, label }) => (
                <ArvoToggleButton
                  key={id}
                  icon={icon}
                  tooltip={label}
                  variant="tertiary"
                  size="sm"
                  isSelected={Boolean(activeFormats[id])}
                  onClick={() => applyFormat(command)}
                />
              ))}
              <ArvoIconButton
                icon="link"
                tooltip="Insert link"
                variant="tertiary"
                size="sm"
                onClick={addLink}
              />
            </div>

            {/* contentEditable rather than a textarea: emphasis and lists have
                to render as themselves while being written. */}
            <div
              ref={attachEditor}
              className="post__body"
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="Message"
              data-placeholder="Share an update, a risk, or a decision…"
              onInput={(event) => set('body')(event.currentTarget.innerHTML)}
              onKeyDown={onEditorKeyDown}
              onKeyUp={syncFormats}
              onMouseUp={syncFormats}
            />
          </div>

          {/* Says plainly that the body is optional, which a missing asterisk
              only implies, and counts what has been written once there is
              something to count. */}
          <div className="post__meta">
            <span>Optional — add detail, or post the topic on its own</span>
            <span>{bodyChars ? `${bodyChars} characters` : ''}</span>
          </div>

          {attachments.length > 0 && (
            <div className="post__files">
              {attachments.map((file) => (
                <ArvoChip
                  key={file.id}
                  label={file.name}
                  icon="paperclip"
                  appearance="outline"
                  size="sm"
                  onDismiss={() =>
                    setAttachments((current) => current.filter(({ id }) => id !== file.id))
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Two short fields share a row: category and tags are both
            classification, and stacking them made the window taller than the
            message it was wrapping. */}
        <div className="post__row">
          <ArvoSelect
            label="Category"
            isFullWidth
            items={CATEGORIES}
            value={draft.category}
            onChange={(value) => set('category')(value)}
          />
          <ArvoMultiSelect
            label="Tags"
            isFullWidth
            isClearable
            chipAppearance="outline"
            placeholder="Add tag…"
            items={TAGS}
            value={draft.tags}
            onChange={(value) => set('tags')(value)}
          />
        </div>

        <ArvoMultiSelect
          label="Notify people"
          isFullWidth
          isClearable
          chipAppearance="outline"
          placeholder="Search colleagues…"
          items={PEOPLE}
          value={draft.notify}
          onChange={(value) => set('notify')(value)}
        />

        {/* Only shown once someone is being notified. A delivery preference for
            an empty recipient list is a question about nothing, and it was
            taking a row of the dialog whether or not it applied. */}
        {draft.notify.length > 0 && (
          <label className="post__switch">
            <input
              type="checkbox"
              checked={draft.isWebOnly}
              onChange={(event) => set('isWebOnly')(event.target.checked)}
            />
            <span>
              Notify in the app only
              <span className="post__hint"> — no email will be sent</span>
            </span>
          </label>
        )}
      </div>
    </ArvoWindow>
  )
}
