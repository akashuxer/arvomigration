import { useState } from 'react'
import { ArvoIconButton } from '@arvo/react'

const NAV_ITEMS = [
  { icon: 'th-large', tooltip: 'User Workspaces' },
  { icon: 'desktop', tooltip: 'System Workspaces' },
  { icon: 'user-setting', tooltip: 'Admin Workspaces' },
]

export default function LeftNav({ isHidden = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const classes = [
    'left-nav',
    isCollapsed && 'left-nav--collapsed',
    isHidden && 'left-nav--hidden',
  ]
    .filter(Boolean)
    .join(' ')

  // `inert` keeps the hidden rail out of the tab order and off screen readers
  // while it stays mounted for the transition.
  return (
    <nav className={classes} inert={isHidden || undefined}>
      {!isCollapsed && (
        <>
          <span className="brand-mark o9con o9con-o9-logo" aria-hidden="true" />
          {NAV_ITEMS.map(({ icon, tooltip }) => (
            <ArvoIconButton
              key={icon}
              icon={icon}
              tooltip={tooltip}
              variant="primary"
              size="lg"
            />
          ))}
          <div className="nav-divider" />
          <ArvoIconButton icon="flow-chart" tooltip="Workflows" variant="primary" size="lg" />
        </>
      )}

      <div className="nav-spacer" />

      {!isCollapsed && (
        <ArvoIconButton icon="list" tooltip="Menu Map" variant="primary" size="lg" />
      )}

      {/* Mirrors the launchbar: one chevron, rotated by CSS when collapsed, and
          moved outside the 4px strip so it stays reachable. */}
      <ArvoIconButton
        className="nav-toggle"
        icon="chevron-left"
        tooltip={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        variant={isCollapsed ? 'secondary' : 'primary'}
        size={isCollapsed ? 'sm' : 'lg'}
        onClick={() => setIsCollapsed((collapsed) => !collapsed)}
      />
    </nav>
  )
}
