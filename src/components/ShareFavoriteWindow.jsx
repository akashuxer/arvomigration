import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ArvoAvatar,
  ArvoBadge,
  ArvoButton,
  ArvoMultiSelect,
  ArvoSelect,
  ArvoTextarea,
  ArvoWindow,
  useToast,
} from '@arvo/react'

/* Share favorite.
 *
 * Modelled on how sharing actually works in the tools people already use
 * (Drive, Figma, Notion), because sharing is one of the few flows where a
 * mental model is already installed and inventing a new one only costs
 * comprehension. Four regions, in the order the questions arrive:
 *
 *   1. Invite    -- who else should have this, and at what level
 *   2. Access    -- who has it now, and what each of them can do
 *   3. General   -- what happens for everyone else in the tenant
 *   4. Link      -- the thing you paste into a message
 *
 * Two decisions worth stating:
 *
 * The role sits next to the person, not in a mode switch. Sharing at the wrong
 * level is the expensive mistake here -- an editor who was meant to be a viewer
 * can change a saved view under everyone else -- so each row carries its own
 * level and can be changed without leaving the window.
 *
 * Nothing is sent until Share is pressed. The invite row composes a change; the
 * access list shows the state as it will be. That is what makes the optional
 * note meaningful, and it is why removing someone is a pending change too
 * rather than an irreversible click halfway through a sentence.
 */

const ROLES = [
  { value: 'viewer', label: 'Can view', hint: 'Open the favorite and read its data' },
  { value: 'commenter', label: 'Can comment', hint: 'Read, and leave comments on it' },
  { value: 'editor', label: 'Can edit', hint: 'Change filters, layout and formatting' },
]

/* The menu says what each level actually permits. "Can edit" is unambiguous
 * only to whoever wrote the permission model; everyone else is guessing whether
 * it also means "can delete". */
/* `secondaryLabel`, and the list rendered `rich`. Arvo's option rows only show
 * a second line in that variant, and the key is not `description` -- passing
 * one silently rendered label-only rows. */
const ROLE_ITEMS = ROLES.map(({ value, label, hint }) => ({
  id: value,
  value,
  label,
  secondaryLabel: hint,
}))

/* The row menu, in two groups with a rule between them.
 *
 * Above the rule: what this person can do, three mutually exclusive levels.
 * Below it: things that change who they are to this favorite -- handing it over
 * or taking it away. They are separated because picking a level is routine and
 * the two below it are not, and a menu that lists them as four peers invites
 * the wrong one at speed. */
const ROW_MENU = [
  { id: 'roles', items: ROLE_ITEMS },
  {
    id: 'actions',
    items: [
      {
        id: 'transfer',
        value: 'transfer',
        label: 'Transfer ownership',
        secondaryLabel: 'They become the owner; you keep edit access',
      },
      {
        id: 'revoke',
        value: 'revoke',
        label: 'Revoke access',
        secondaryLabel: 'Removes them when you save',
      },
    ],
  },
]

// A group's menu, minus the transfer it cannot meaningfully accept.
const ROW_MENU_GROUP = ROW_MENU.map((group) =>
  group.id === 'actions'
    ? { ...group, items: group.items.filter(({ value }) => value !== 'transfer') }
    : group,
)

// What the field shows once a row is staged for removal.
const REVOKED_ITEM = { id: 'revoke', value: 'revoke', label: 'Remove' }

// Every option list in this window shows two lines per row.
const RICH_LIST = { variant: 'rich' }

/* Owner is not in the role list: it is a transfer, not a permission, and
 * offering it in the same control as "Can view" invites it to be picked by
 * accident. */
const OWNER_ROLE = { value: 'owner', label: 'Owner' }

/* Prefix matching, on any word of the name or the address.
 *
 * A plain substring match made the picker useless at one character: typing "b"
 * offered Anita Broussard and Caleb Ford, because both contain a b somewhere.
 * People type the beginning of a name -- first name, surname, or the address --
 * so that is what is matched, and "b" now returns the five people whose name
 * actually starts with one. */
const startsWord = (label, email, needle) =>
  label
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .some((word) => word.startsWith(needle)) || email.toLowerCase().startsWith(needle)

const person = (label, isGroup = false) => ({
  value: label.toLowerCase().replace(/[^a-z]+/g, '-'),
  label,
  email: isGroup
    ? `${3 + (label.length % 12)} members`
    : `${label.toLowerCase().replace(/[^a-z]+/g, '.')}@o9solutions.com`,
  isGroup,
})

/* A directory deep enough to type into.
 *
 * Five or more names behind every common initial, because a picker that returns
 * one result for "a" teaches you nothing about how it behaves -- the whole
 * point of a typeahead is what it does when several people match. Groups are in
 * the same list as people: sharing to "Demand Planning" survives someone
 * joining or leaving the team, where sharing to its members one at a time
 * quietly rots. */
const DIRECTORY = [
  person('Aarti Nair'),
  person('Adam Kessler'),
  person('Alan Whitfield'),
  person('Ana Ortiz'),
  person('Anita Broussard'),
  person('Beatrice Lam'),
  person('Ben Okafor'),
  person('Bianca Rossi'),
  person('Bradley Nunes'),
  person('Brianna Coles'),
  person('Caleb Ford'),
  person('Camila Duarte'),
  person('Carlos Mendes'),
  person('Cathy Nolan'),
  person('Chen Wei'),
  person('Daniel Ruiz'),
  person('Dara Singh'),
  person('David Kim'),
  person('Deepa Menon'),
  person('Diana Prentice'),
  person('Eduardo Silva'),
  person('Elena Petrova'),
  person('Eli Rosenberg'),
  person('Emma Lindqvist'),
  person('Evan Marsh'),
  person('Jayanta Paul'),
  person('Marcus Feld'),
  person('Priya Raman'),
  person('Demand Planning', true),
  person('Finance Partners', true),
  person('Executive Review Board', true),
]


const INITIAL_ACCESS = [
  {
    id: 'akash',
    name: 'Akash Upadhyay',
    email: 'akash.upadhyay@o9solutions.com',
    role: 'owner',
    photo: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 'austin',
    name: 'Austin Brooks',
    email: 'austin.brooks@o9solutions.com',
    role: 'editor',
  },
  {
    id: 'grp-demand',
    name: 'Demand Planning',
    email: '12 members',
    role: 'viewer',
    isGroup: true,
  },
]

const GENERAL_ACCESS = [
  {
    value: 'restricted',
    label: 'Restricted',
    hint: 'Only people listed above can open this favorite',
    icon: 'lock',
  },
  {
    value: 'tenant',
    label: 'Everyone at Optimal Industries',
    hint: 'Anyone signed in to this tenant can find and open it',
    icon: 'globe',
  },
]

const AVATAR_COLORS = ['blue', 'purple', 'teal', 'orange', 'pink', 'green']

function colorFor(name) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 9973
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export default function ShareFavoriteWindow({
  isOpen,
  onOpenChange,
  favoriteName = 'Market Plan — Current Working View',
}) {
  const toast = useToast()

  const [access, setAccess] = useState(INITIAL_ACCESS)
  const [invitees, setInvitees] = useState([])
  const [inviteRole, setInviteRole] = useState('viewer')
  const [note, setNote] = useState('')
  const [general, setGeneral] = useState('restricted')
  const [generalRole, setGeneralRole] = useState('viewer')
  const [isCopied, setIsCopied] = useState(false)

  const hasInvitees = invitees.length > 0

  /* Focus the invite field once per open, and only then.
   *
   * ArvoWindow re-applies its own initial focus on every render, which pulls
   * the caret out of whatever you are typing in; this window opts out of that
   * and places focus itself, once. */
  const hasFocused = useRef(false)
  const attachForm = useCallback((node) => {
    if (!node) {
      hasFocused.current = false
      return
    }
    if (hasFocused.current) return
    hasFocused.current = true
    /* The invite field specifically, not "the first input": the access select
       beside it also renders one, and which of the two the DOM offers first is
       an implementation detail of the components, not a decision about where a
       person should start typing. */
    node.querySelector('.arvo-multi-sel__input')?.focus()
  }, [])

  /* Typing filters the list here, rather than being handed to the component.
   *
   * People search for a colleague by whichever half they happen to know --
   * "ana", "ortiz" and "ana.ortiz@" should all find the same person -- and
   * owning the query means the match is over both the name and the address, and
   * that what the menu shows is exactly what this component decided to show.
   * Anyone already on the access list is filtered out first: offering to invite
   * someone who is already here is an invitation to a no-op. */
  const [query, setQuery] = useState('')

  /* Composing an invite is a mode, and it starts at the first keystroke rather
     than at the first chip -- someone half-way through typing a name is already
     inviting, and the sections below are not what they are looking at. */
  const isInviting = hasInvitees || query.trim().length > 0

  const directory = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return DIRECTORY.filter(({ value }) => !access.some(({ id }) => id === value))
      .filter(({ label, email }) => !needle || startsWord(label, email, needle))
      .map(({ value, label, email }) => ({
        id: value,
        value,
        label,
        secondaryLabel: email,
      }))
  }, [access, query])

  const reset = () => {
    setInvitees([])
    setQuery('')
    setInviteRole('viewer')
    setNote('')
    setIsCopied(false)
  }

  const share = () => {
    if (!hasInvitees) {
      // Nothing to send, but the levels in the list may have changed.
      toast.show({ type: 'positive', message: 'Sharing settings updated' })
      return true
    }
    const added = invitees
      .map((value) => DIRECTORY.find((person) => person.value === value))
      .filter(Boolean)

    setAccess((current) => [
      ...current,
      ...added.map(({ value, label, email, isGroup }) => ({
        id: value,
        name: label,
        email,
        isGroup,
        role: inviteRole,
      })),
    ])

    const who =
      added.length === 1 ? added[0].label : `${added.length} people and groups`
    toast.show({
      type: 'positive',
      message: [
        { type: 'text', value: 'Shared with ' },
        { type: 'strong', children: [{ type: 'text', value: who }] },
      ],
    })
    reset()
    /* Stay open. The point of the access list is that it shows the result --
       closing the window the moment Share is pressed hides the one piece of
       evidence that the share landed, and sharing with a second person means
       reopening. Done is how you leave. */
    return false
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/favorites/market-plan`)
      setIsCopied(true)
      // The button says what happened rather than a toast doing it: the
      // feedback belongs where the click was.
      window.setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.show({ type: 'negative', message: 'Could not copy the link' })
    }
  }

  /* Edits to the access list are staged, not applied.
   *
   * Changing a level, handing over ownership and revoking are all pending until
   * Save -- which is what lets a revoke show as a struck-through name you can
   * still change your mind about, instead of a row that vanishes under the
   * pointer. It also means one Save covers several edits, rather than each
   * dropdown firing its own silent write.
   *
   * Keyed by id and holding only what changed, so an untouched row has no
   * entry and the diff is the object itself. */
  const [edits, setEdits] = useState({})
  const hasEdits = Object.keys(edits).length > 0

  const roleOf = (entry) => edits[entry.id]?.role ?? entry.role
  const isRevoked = (entry) => edits[entry.id]?.role === 'revoke'

  const setRole = (id, role) =>
    setEdits((current) => {
      const entry = access.find((person) => person.id === id)
      const next = { ...current }
      // Choosing the level someone already has is not an edit -- dropping it
      // from the set is what keeps Save honest about there being changes.
      if (!entry || entry.role === role) delete next[id]
      else next[id] = { role }
      return next
    })

  const transferTo = (id) =>
    setEdits((current) => ({ ...current, [id]: { role: 'owner', isTransfer: true } }))

  const discardEdits = () => setEdits({})

  const saveEdits = () => {
    const revoked = access.filter(isRevoked)
    const transfer = access.find((entry) => edits[entry.id]?.isTransfer)

    setAccess((current) =>
      current
        .filter((entry) => edits[entry.id]?.role !== 'revoke')
        .map((entry) => {
          // Ownership is exclusive: handing it over demotes whoever held it.
          if (transfer && entry.role === 'owner' && entry.id !== transfer.id) {
            return { ...entry, role: 'editor' }
          }
          const role = edits[entry.id]?.role
          return role ? { ...entry, role } : entry
        }),
    )

    toast.show({
      type: 'positive',
      message: transfer
        ? [
            { type: 'text', value: 'Ownership transferred to ' },
            { type: 'strong', children: [{ type: 'text', value: transfer.name }] },
          ]
        : revoked.length === 1
          ? [
              { type: 'text', value: 'Access revoked for ' },
              { type: 'strong', children: [{ type: 'text', value: revoked[0].name }] },
            ]
          : 'Access updated',
    })
    setEdits({})
    return false
  }

  return (
    <ArvoWindow
      size="md"
      title="Share favorite"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) reset()
        onOpenChange(open)
      }}
      /* See attachForm: the window's own focus handling fights typing. */
      initialFocus="none"
      /* The footer answers whatever the window is currently for.
       *
       * Inviting: Share and Cancel, because a composed invite is the only thing
       * that matters while you are composing it. Editing the list: Save and
       * Cancel, because the changes are staged and need committing. Neither:
       * Done, because there is nothing to commit and the only thing left is to
       * leave. One primary that reads as the next step, rather than three
       * buttons competing to be it. */
      primaryAction={{
        label: isInviting ? 'Share' : hasEdits ? 'Save' : 'Done',
        onClick: isInviting ? share : hasEdits ? saveEdits : () => true,
      }}
      secondaryActions={
        isInviting || hasEdits
          ? [
              {
                label: 'Cancel',
                onClick: () => {
                  if (isInviting) {
                    setInvitees([])
                    setQuery('')
                  } else {
                    discardEdits()
                  }
                  return false
                },
              },
            ]
          : []
      }
      footerLeft={
        <button type="button" className="share__link" onClick={copyLink}>
          <i className={`o9con o9con-${isCopied ? 'check' : 'link'}`} aria-hidden="true" />
          {isCopied ? 'Link copied' : 'Copy link'}
        </button>
      }
    >
      <div className="share" ref={attachForm}>
        {/* What is being shared, named once at the top. Sharing the wrong view
            is easy when the dialog never says which one it is. */}
        <div className="share__subject">
          <i className="o9con o9con-star" aria-hidden="true" />
          <span className="share__subject-name">{favoriteName}</span>
        </div>

        <div className="share__invite">
          <ArvoMultiSelect
            label="Invite people and groups"
            isFullWidth
            chipAppearance="outline"
            placeholder="Name, email or group…"
            items={directory}
            value={invitees}
            onChange={setInvitees}
            inputValue={query}
            onInputChange={setQuery}
            optionListProps={RICH_LIST}
          />
          <ArvoSelect
            label="Access"
            items={ROLE_ITEMS}
            value={inviteRole}
            /* ArvoSelect hands back the option object and its index, not the
               value -- every handler here reads `item.value`. Passing a setter
               straight in stored the whole option and silently broke the
               comparisons downstream. */
            onChange={(item) => setInviteRole(item?.value ?? inviteRole)}
            optionListProps={RICH_LIST}
            width={148}
          />
        </div>

        {/* The note appears only once there is somebody to send it to. An empty
            message box above an empty invite field is a prompt to write to
            nobody. */}
        {hasInvitees && (
          <ArvoTextarea
            label="Add a note"
            isFullWidth
            rows={2}
            autoResize
            placeholder="Why are you sharing this? (optional)"
            value={note}
            onInput={(event) => setNote(event.target.value)}
          />
        )}

        {/* Hidden while an invite is being composed.
            Who already has access is not the question being asked at that
            moment, and both lists on screen at once make the window a wall of
            controls doing two different jobs. They return the moment the field
            is cleared or the invite is sent. */}
        {!isInviting && (
        <>
        <section className="share__section">
          {/* Outline badge, with the icon explicitly off. ArvoBadge draws a
              leading glyph unless `hasBadgeIcon` says otherwise, which is what
              put a meaningless mark beside the number; outline keeps the count
              as a quiet ring rather than a filled chip shouting a status it
              does not have. */}
          <h3 className="share__heading">
            People with access
            <ArvoBadge
              message={String(access.length)}
              semanticType="neutral"
              appearance="outline"
              hasBadgeIcon={false}
              size="sm"
            />
          </h3>

          <ul className="share__list">
            {access.map((entry) => (
              <li className="share__row" key={entry.id}>
                {/* A group is not a face. Using an icon for it keeps the list
                    honest about what is a person and what is a set of them. */}
                {entry.isGroup ? (
                  <span className="share__group" aria-hidden="true">
                    <i className="o9con o9con-users" />
                  </span>
                ) : (
                  <ArvoAvatar
                    variant={entry.photo ? 'image' : 'initials'}
                    size="md"
                    src={entry.photo}
                    name={entry.name}
                    alt={entry.name}
                    colorMode="custom"
                    customColor={colorFor(entry.name)}
                  />
                )}

                <span className="share__identity">
                  {/* Struck through while a removal is staged. The name is what
                      you scan for, so marking the name itself is what makes a
                      pending removal legible at a glance -- and it stays
                      readable, which a disappeared row does not. */}
                  <span
                    className={`share__name${isRevoked(entry) ? ' share__name--revoked' : ''}`}
                  >
                    {entry.name}
                  </span>
                  <span className="share__email">{entry.email}</span>
                </span>

                {/* The owner's row states the fact rather than offering a
                    control that cannot be used -- until an incoming transfer
                    makes it a pending change like any other. */}
                {roleOf(entry) === 'owner' && !edits[entry.id] ? (
                  <span className="share__owner">{OWNER_ROLE.label}</span>
                ) : (
                  <ArvoSelect
                    aria-label={`Access for ${entry.name}`}
                    optionListProps={RICH_LIST}
                    /* The staged value needs an option to render as, so the
                       revoked and incoming-owner labels join the list for the
                       row that is in that state. */
                    /* The staged group leads, so the field renders "Remove"
                       rather than the menu's own "Revoke access": the select
                       shows the first option whose value matches, and a row on
                       its way out should read as a state, not as the command
                       that put it there. */
                    items={[
                      ...(isRevoked(entry)
                        ? [{ id: 'staged', items: [REVOKED_ITEM] }]
                        : []),
                      ...(edits[entry.id]?.isTransfer
                        ? [
                            {
                              id: 'staged',
                              items: [{ id: 'owner', value: 'owner', label: 'Owner' }],
                            },
                          ]
                        : []),
                      /* Ownership goes to a person, never to a group: an owner
                         is accountable for the favorite, and "Demand Planning
                         owns it" names nobody who can answer for it. */
                      ...(entry.isGroup ? ROW_MENU_GROUP : ROW_MENU),
                    ]}
                    hasGroupDividers
                    value={roleOf(entry)}
                    onChange={(item) => {
                      if (!item) return
                      if (item.value === 'transfer') transferTo(entry.id)
                      else setRole(entry.id, item.value)
                    }}
                    width={172}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="share__section">
          <h3 className="share__heading">General access</h3>

          <div className="share__general">
            <span className="share__general-icon" aria-hidden="true">
              <i
                className={`o9con o9con-${
                  GENERAL_ACCESS.find(({ value }) => value === general)?.icon
                }`}
              />
            </span>

            <span className="share__identity">
              <ArvoSelect
                aria-label="General access"
                items={GENERAL_ACCESS.map(({ value, label, hint }) => ({
                id: value,
                value,
                label,
                secondaryLabel: hint,
              }))}
              optionListProps={RICH_LIST}
                value={general}
                onChange={(item) => item && setGeneral(item.value)}
                surface="base"
                width={260}
              />
              <span className="share__email">
                {GENERAL_ACCESS.find(({ value }) => value === general)?.hint}
              </span>
            </span>

            {/* Only meaningful once access is open to the tenant: what everyone
                gets is a different question from whether everyone gets in. */}
            {general === 'tenant' && (
              <ArvoSelect
                aria-label="Access for everyone at Optimal Industries"
                items={ROLE_ITEMS}
                value={generalRole}
                onChange={(item) => item && setGeneralRole(item.value)}
                width={148}
              />
            )}
          </div>
        </section>
        </>
        )}
      </div>
    </ArvoWindow>
  )
}
