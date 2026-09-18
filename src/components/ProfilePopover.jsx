import { useState } from 'react'
import usePersistentState from '../usePersistentState'
import {
  ArvoAvatar,
  ArvoChip,
  ArvoIconButton,
  ArvoLink,
  ArvoPopover,
  ArvoSelect,
  ArvoSwitch,
  useToast,
} from '@arvo/react'

/* The account panel, opened from the identity in the header.
 *
 * Four things in a deliberate order: who you are, which tenant you are in, what
 * you are allowed to do, and the handful of account actions. The tenant sits
 * second rather than last because in a product where two customers' plans look
 * alike, "am I in the right tenant" is the question worth answering before any
 * of the others -- and it is the one control here that changes what you see.
 *
 * It replaced a hover tooltip carrying the same three lines of identity. A
 * tooltip cannot hold a tenant switcher or a logout, and two surfaces answering
 * "who am I" from the same target is one more than the question needs.
 */

const TENANTS = [
  { id: 'optimal', value: 'optimal', label: 'Optimal Industries' },
  { id: 'northwind', value: 'northwind', label: 'Northwind Trading' },
  { id: 'meridian', value: 'meridian', label: 'Meridian Foods' },
]

/* Roles are read-only here -- this says what you can do, not where to change it.
 * Granting a role is an admin screen, and a chip that looks editable but is not
 * is worse than one that plainly is not. */
const ROLES = [
  'admin',
  'dataadmin',
  'System Architect',
  'BDPAdmin',
  'Nova - Admin',
  'Nova Report Admin',
]

const ACCOUNT_ACTIONS = [
  { id: 'password', label: 'Update Password', icon: 'lock' },
  { id: 'jobs', label: 'My Jobs', icon: 'server' },
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'logout', label: 'Logout', icon: 'sign-out' },
]

/* Build metadata. Bottom, quiet, and in a row rather than a sentence: nobody
 * reads these until they are on a support call, and then they need to be
 * copyable at a glance. */
const VERSIONS = [
  { label: 'o9 Version', value: '1783565260573' },
  { label: 'o9 AI Version', value: 'local' },
]

export default function ProfilePopover({ triggerRef, identity }) {
  const toast = useToast()
  const [tenant, setTenant] = usePersistentState('profile.tenant', 'optimal')
  const [isDark, setIsDark] = usePersistentState('profile.dark', false)
  const [isFavoriteTenant, setIsFavoriteTenant] = usePersistentState('profile.tenantFav', true)
  const [isOpen, setIsOpen] = useState(false)
  /* Unverified until the link is used. It is the only state in this panel that
     changes what is drawn rather than just what is stored, so the flag and the
     link both read from it and both disappear together. */
  const [isVerified, setIsVerified] = usePersistentState('profile.verified', false)

  const run = (id) => {
    setIsOpen(false)
    if (id === 'logout') {
      toast.show({ type: 'warning', message: 'Signing out…' })
      return
    }
    toast.show({ type: 'positive', message: `${id} is not wired up in this prototype` })
  }

  return (
    <ArvoPopover
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      width={340}
      /* No title bar: the person's own name is the heading, and a "Profile"
         caption above it would say less than the name already does.
         `hasHeader`, not `hasCloseButton` -- the latter is not a prop this
         component has, and React passed it straight through to the DOM. */
      hasHeader={false}
    >
      <div className="profile">
        <div className="profile__identity">
          {/* The pencil rides the avatar, where the thing it edits is. */}
          <span className="profile__avatar">
            <ArvoAvatar variant="initials" name={identity.name} size="lg" />
            <ArvoIconButton
              className="profile__avatar-edit"
              icon="edit"
              tooltip="Change photo"
              variant="secondary"
              size="xs"
              onClick={() => run('photo')}
            />
          </span>

          <span className="profile__who">
            {/* No alert mark beside the name.
              *
              * A red badge on someone's own name reads as "there is something
              * wrong with you", which is not what an unverified address means --
              * and it is the loudest thing in a panel where nothing is urgent.
              * The Verify email link on the next line already says what is
              * outstanding and offers the fix in the same breath, which is all
              * the state this needs. */}
            <span className="profile__name">{identity.name}</span>

            {/* Address and its fix on one line: the problem and the thing you do
                about it belong together, and a second row for four words pushed
                the tenant switcher down for no gain. */}
            <span className="profile__email">
              <span className="profile__email-text">{identity.email}</span>
              {!isVerified && (
                <ArvoLink
                  label="Verify email"
                  size="sm"
                  onClick={() => {
                    setIsVerified(true)
                    toast.show({
                      type: 'positive',
                      message: `Verification sent to ${identity.email}`,
                    })
                  }}
                />
              )}
            </span>
          </span>
        </div>

        {/* The tenant, and whether it is the one you land in. */}
        <div className="profile__tenant">
          <ArvoSelect
            aria-label="Tenant"
            items={TENANTS}
            value={tenant}
            isFullWidth
            onChange={(item) => setTenant(item?.value ?? item)}
          />
          {/* Filled when this is your default tenant -- the same star, meaning
              the same thing, as the one on the favorites rail. */}
          <ArvoIconButton
            icon={isFavoriteTenant ? 'star' : 'star-o'}
            tooltip={
              isFavoriteTenant ? 'Your default tenant' : 'Make this your default tenant'
            }
            variant={isFavoriteTenant ? 'primary' : 'secondary'}
            size="md"
            onClick={() => setIsFavoriteTenant((on) => !on)}
          />
        </div>

        <p className="profile__login">
          Last login <time dateTime="2026-07-08T21:32:14">08-Jul-2026, 09:32:14 PM</time>
        </p>

        <div className="profile__section">
          <h3 className="profile__caption">Roles</h3>
          <div className="profile__roles">
            {ROLES.map((role) => (
              <ArvoChip key={role} variant="general" size="sm" label={role} />
            ))}
          </div>
        </div>

        <div className="profile__section profile__section--actions">
          {/* Dark mode is a switch rather than a row, because it is the one item
              here with a state -- everything below it goes somewhere. */}
          <div className="profile__row profile__row--switch">
            <span className="profile__row-label">
              <i className="o9con o9con-moon-o" aria-hidden="true" />
              Dark mode
            </span>
            <ArvoSwitch
              aria-label="Dark mode"
              size="sm"
              isChecked={isDark}
              /* Guarded against its own echo.
                 *
                 * ArvoSwitch reports onChange for a programmatic toggle as well
                 * as a user one, so writing state unconditionally meant: render
                 * -> switch syncs to the new prop -> onChange -> setState ->
                 * render. That looped until React gave up, and raised a toast on
                 * every pass. Acting only on a real change breaks the cycle. */
              onChange={({ isChecked }) => {
                if (isChecked === isDark) return
                setIsDark(isChecked)
                toast.show({
                  type: 'positive',
                  message: `Dark mode ${isChecked ? 'on' : 'off'} — theming is not built in this prototype`,
                })
              }}
            />
          </div>

          {ACCOUNT_ACTIONS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={`profile__row${id === 'logout' ? ' profile__row--logout' : ''}`}
              onClick={() => run(id)}
            >
              <span className="profile__row-label">
                <i className={`o9con o9con-${icon}`} aria-hidden="true" />
                {label}
              </span>
            </button>
          ))}
        </div>

        <dl className="profile__versions">
          {VERSIONS.map(({ label, value }) => (
            <div className="profile__version" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ArvoPopover>
  )
}
