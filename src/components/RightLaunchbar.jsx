import { useLayoutEffect, useRef, useState } from 'react'
import { ArvoIconButton } from '@arvo/react'

/* The three launchers, and the panel each one opens. `title` is the panel
 * heading, which is not always the launcher's own label -- Settings opens User
 * Settings. */
export const PANELS = [
  { id: 'workflows', icon: 'presentation', label: 'Workflows', title: 'Workflows' },
  { id: 'settings', icon: 'cog', label: 'Settings', title: 'User Settings' },
  { id: 'help', icon: 'question-circle', label: 'Help', title: 'Help' },
]

export default function RightLaunchbar({ isHidden = false, activePanel, onPanelChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toolsRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  // Measured before paint, so the block is in place on the frame it appears
  // rather than jumping into position afterwards.
  useLayoutEffect(() => {
    const tools = toolsRef.current
    if (!tools || !activePanel) {
      setIndicator(null)
      return
    }

    const measure = () => {
      const active = tools.querySelector('.launchbar-tool--active')
      if (!active) return
      const box = active.getBoundingClientRect()
      setIndicator({ y: box.top - tools.getBoundingClientRect().top, h: box.height })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(tools)
    return () => observer.disconnect()
  }, [activePanel, isCollapsed])

  const classes = [
    'right-launchbar',
    isCollapsed && 'right-launchbar--collapsed',
    isHidden && 'right-launchbar--hidden',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} inert={isHidden || undefined}>
      {!isCollapsed && (
        <div className="launchbar-tools" ref={toolsRef}>
          {/* Active treatment -- the accent edge and the fill behind the icon --
              is one block that slides between launchers. A button's own
              selected state cannot travel to another button, so carrying it
              here is what lets the change animate rather than blink. */}
          {indicator && (
            <span
              className="launchbar-indicator"
              aria-hidden="true"
              style={{ '--tool-y': `${indicator.y}px`, '--tool-h': `${indicator.h}px` }}
            />
          )}

          {PANELS.map(({ id, icon, label }) => (
            <ArvoIconButton
              key={id}
              className={`launchbar-tool${activePanel === id ? ' launchbar-tool--active' : ''}`}
              icon={icon}
              tooltip={label}
              variant="tertiary"
              size="lg"
              /* aria-pressed, not the visual state: the indicator supplies the
                 appearance, but the control still has to announce that it
                 toggles a panel and which one is showing. */
              aria-pressed={activePanel === id}
              onClick={() => onPanelChange(activePanel === id ? null : id)}
            />
          ))}
        </div>
      )}

      <div className="launchbar-spacer" />

      {/* One button both ways: the chevron is rotated by CSS when collapsed
          rather than swapped for a different icon. */}
      <ArvoIconButton
        className="launchbar-toggle"
        icon="chevron-right"
        tooltip={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        variant={isCollapsed ? 'secondary' : 'tertiary'}
        size={isCollapsed ? 'sm' : 'lg'}
        onClick={() => setIsCollapsed((collapsed) => !collapsed)}
      />
    </aside>
  )
}
