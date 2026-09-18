import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import LeftNav from './components/LeftNav'
import FilterBar from './components/FilterBar'
import ContentSkeleton, { FilterBarSkeleton } from './components/ContentSkeleton'
import ContentArea from './components/ContentArea'
import ChannelView from './components/ChannelView'
import { ArvoPanel, ArvoToastProvider } from '@arvo/react'
import UserSettingsPanel from './components/UserSettingsPanel'
import WorkflowsPanel from './components/WorkflowsPanel'
import NovaPanel from './components/NovaPanel'
import { SettingsProvider, useSettings, settingsToCssVars } from './SettingsContext'
import RightLaunchbar, { PANELS } from './components/RightLaunchbar'
import usePersistentState, { resetStored } from './usePersistentState'

function AppShell() {
  const { settings, setSettings } = useSettings()

  // Each view filters on its own dimensions, so the chip set follows the tab.
  const MARKET_CHIPS = [
    { label: 'Category', value: 'All' },
    { label: 'Size', value: 'All' },
    { label: 'Colors', value: 'All' },
    { label: 'Customer', value: 'Customer-A06' },
    { label: 'Version Name', value: 'Current Working View' },
  ]

  /* A chip names what is selected, and the badge says how many.
   *
   * "(All)" told you the filter existed and nothing else -- it is the value a
   * filter has when it is not filtering, which is exactly the case where the
   * chip has least to say. Naming the first member and counting the rest means
   * the bar reads as a description of the view rather than as a list of
   * dimensions. */
  const CHANNEL_CHIPS = [
    { label: 'Version Name', value: 'CurrentWorkingView' },
    { label: 'ProductGroup3', value: 'Beverages', count: 9 },
    { label: 'Account', value: 'Customer-A06', count: 14 },
    { label: 'Time', value: 'CY' },
  ]

  // Shift+F toggles focus mode, which hides both rails.
  const [isFocusMode, setIsFocusMode] = usePersistentState('view.focus', false)

  // v1 is the current build; v2 is the decluttered variant. Everything v2
  // changes is either scoped under .app-container--v2 or driven by this flag,
  // so v1 stays exactly as it was. There is no visible control -- "J" switches,
  // which keeps the comparison affordance out of the production header.
  const [isV2, setIsV2] = usePersistentState('view.v2', true)

  // Which launchbar panel is open, by id, or null for none.
  const [activePanel, setActivePanel] = usePersistentState('panel.active', null)

  /* Which report's settings the panel should be showing.
   *
   * Only meaningful while the settings panel is open: selecting a report is
   * how you say "these settings, please", and hijacking that click when the
   * panel is closed would break every other interaction the report has.
   *
   * The token makes repeat selections distinct -- clicking the same report
   * twice should scroll to it twice, which a bare id could not express. */
  const [settingsFocus, setSettingsFocus] = useState(null)
  const focusSettings = (section) => {
    if (activePanel !== 'settings') return
    setSettingsFocus({ section, token: Date.now() })
  }
  /* Nova docks in the same slot as the launchbar panels but has no launcher of
     its own -- it is opened from the assistant avatar in the header, where the
     product has always put it. Its header actions are its own: history and a
     new chat, which are chat concerns rather than panel ones. */
  const NOVA_PANEL = { id: 'nova', title: 'o9 AI', icon: 'genai' }
  const activePanelConfig =
    activePanel === 'nova' ? NOVA_PANEL : PANELS.find(({ id }) => id === activePanel)

  // The panel keeps rendering its last contents while the slot slides shut --
  // otherwise it would blank out on the first frame of the close animation.
  const [closingConfig, setClosingConfig] = useState(null)
  useEffect(() => {
    if (activePanelConfig) setClosingConfig(activePanelConfig)
  }, [activePanelConfig])
  const panelConfig = activePanelConfig ?? closingConfig

  // Search lives on the panel's own sticky header; the body filters on it.
  const [workflowQuery, setWorkflowQuery] = useState('')
  // The panel's FAB belongs to ArvoPanel, but the form it opens lives in the
  // workflows tree, so the action is reached through the panel's own handle.
  const workflowsRef = useRef(null)
  const isWorkflows = panelConfig?.id === 'workflows'

  /* Memoised, because ArvoPanel mirrors these props into its own state through
     effects keyed on their identity:

       useEffect(() => setHeaderActionsState(headerActionsProp ?? []), [headerActionsProp])

     Passed as inline literals they were a new object on every render, so the
     panel set state, re-rendered, and was handed another new object -- React
     capped it at "Maximum update depth exceeded" and the shell logged it a
     hundred times a second. The literals read better inline, but stable
     identity is what this component's contract actually requires. */
  const panelHeaderActions = useMemo(() => {
    if (panelConfig?.id === 'nova') {
      return [
        { id: 'history', type: 'btn', icon: 'history', tooltip: 'Chat history' },
        { id: 'new', type: 'btn', icon: 'edit', tooltip: 'New chat' },
        { id: 'expand', type: 'btn', icon: 'expand', tooltip: 'Expand' },
      ]
    }
    if (isWorkflows) {
      return [
        { id: 'favorite', type: 'btn', icon: 'star-o', tooltip: 'Favorite' },
        { id: 'refresh', type: 'btn', icon: 'refresh', tooltip: 'Refresh' },
      ]
    }
    return undefined
  }, [panelConfig?.id, isWorkflows])

  const panelStickyHeader = useMemo(
    () =>
      isWorkflows
        ? {
            search: {
              placeholder: 'Search Workflows & Favorites',
              onChange: (value) =>
                setWorkflowQuery(typeof value === 'string' ? value : value?.value ?? ''),
            },
          }
        : false,
    [isWorkflows],
  )

  const panelFab = useMemo(
    () =>
      isWorkflows
        ? {
            icon: 'plus',
            tooltip: 'New workflow',
            ariaLabel: 'New workflow',
            onClick: () => workflowsRef.current?.openAdd(),
          }
        : false,
    [isWorkflows],
  )

  // Tabs select the view. Channel Assortments is the KPI-led layout; the other
  // two show the chart-and-pivot analysis view.
  const [activeTab, setActiveTab] = usePersistentState('tab.active', 'market')
  const showScorecard = activeTab === 'channel'

  /* The report area, while a view is being put together.
   *
   * Two things trigger it: opening a view, and applying a saved favorite --
   * both change every number on screen, which is exactly when a page that
   * simply swaps content leaves you unsure whether anything happened.
   *
   * A view you have not opened this session waits longer than one you are
   * coming back to. That is not theatre: the first visit is the one that
   * genuinely fetches, and matching the wait to it means the skeleton is
   * telling the truth rather than performing. `seen` is per session, not
   * persisted -- a reload is a cold start again. */
  const [isLoading, setIsLoading] = useState(false)
  const seenTabs = useRef(new Set())
  // In a ref, not a property hung off the function: one timer at a time, and a
  // rapid second switch replaces the first rather than racing it.
  const loadTimer = useRef(null)

  const load = (ms) => {
    setIsLoading(true)
    window.clearTimeout(loadTimer.current)
    loadTimer.current = window.setTimeout(() => setIsLoading(false), ms)
  }

  useEffect(() => {
    const isFirstVisit = !seenTabs.current.has(activeTab)
    seenTabs.current.add(activeTab)
    load(isFirstVisit ? 850 : 320)
    return () => window.clearTimeout(loadTimer.current)
  }, [activeTab])

  // Applying a favorite re-filters everything, so it gets the same treatment.
  const onFavoriteApply = () => load(650)

  /* Views the user came from, most recent last. Back pops one off rather than
   * flipping to "the other tab" -- with only two tabs those look identical, but
   * a toggle would start lying the moment a third view is added. */
  const [tabHistory, setTabHistory] = usePersistentState('tab.history', [])

  const goToTab = (id) => {
    if (id === activeTab) return
    setTabHistory((history) => [...history, activeTab])
    setActiveTab(id)
  }

  const goBack = () => {
    if (!tabHistory.length) return
    setActiveTab(tabHistory.at(-1))
    setTabHistory((history) => history.slice(0, -1))
  }

  /* Input modality, published on the document element.
   *
   * Menus mark their active row with a `focused` class whether you arrived by
   * arrow key or by moving the mouse over it, and Arvo draws a focus outline on
   * that class -- so hovering a menu produced a keyboard-style ring. CSS keys
   * off this flag to show the ring only when the pointer was not the last thing
   * used. :focus-visible cannot do the job here: the ring comes from a class on
   * a div, not from real focus. */
  useEffect(() => {
    const root = document.documentElement
    const setPointer = () => root.setAttribute('data-input', 'pointer')
    const setKeyboard = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      root.setAttribute('data-input', 'keyboard')
    }
    root.setAttribute('data-input', 'pointer')
    window.addEventListener('pointerdown', setPointer, true)
    window.addEventListener('pointermove', setPointer, true)
    window.addEventListener('keydown', setKeyboard, true)
    return () => {
      window.removeEventListener('pointerdown', setPointer, true)
      window.removeEventListener('pointermove', setPointer, true)
      window.removeEventListener('keydown', setKeyboard, true)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      // Leave OS/browser combos such as Cmd+Shift+F alone.
      if (event.metaKey || event.ctrlKey || event.altKey) return

      // Never steal a key while the user is typing -- the filter-set and
      // overflow menus both have searchable inputs.
      const el = event.target
      if (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName)) return

      const key = event.key.toLowerCase()

      /* Shift+~ wipes every stored preference and reloads.
       *
       * A demo accumulates state fast -- renamed workflows, pinned actions,
       * read notifications, tuned settings -- and persistence means none of it
       * goes away on its own any more. This is the way back to a clean app
       * without opening dev tools. `~` requires Shift on its own, so the check
       * is on the character rather than the modifier. */
      if (event.key === '~') {
        event.preventDefault()
        resetStored()
        return
      }

      if (event.shiftKey && key === 'f') {
        event.preventDefault()
        setIsFocusMode((focused) => !focused)
        return
      }

      // Bare "j" flips between the v1 and v2 layouts.
      if (!event.shiftKey && key === 'j') {
        event.preventDefault()
        setIsV2((v2) => !v2)
        return
      }

      /* Shift+D toggles dark mode. Arvo themes off `data-mode` on the document
         element, so the whole token set switches with one attribute -- nothing
         in this app restates a colour that would need switching alongside. */
      if (event.shiftKey && key === 'd') {
        event.preventDefault()
        const root = document.documentElement
        const next = root.getAttribute('data-mode') === 'dark' ? 'light' : 'dark'
        root.setAttribute('data-mode', next)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    /* Toasts are shell-level: any view can raise one, and they must outlive the
       component that raised it. */
    <ArvoToastProvider position="top-right">
    <div
      className={`app-container${isV2 ? ' app-container--v2' : ''} scrollbars--${settings.scrollbar} tile-actions--${settings.tileActions} col-dividers--${settings.pivotDividers} density--${settings.density}`}
      style={settingsToCssVars(settings)}
    >
      {/* One continuous rail from the logo to the bottom, flush to the edge.
          Both rails stay mounted in focus mode so they can animate out --
          unmounting them would make the transition impossible. */}
      <LeftNav isHidden={isFocusMode} />

      <div className="app-main">
        <Header
          onOpenNova={() => setActivePanel((current) => (current === 'nova' ? null : 'nova'))}
          isNovaOpen={activePanel === 'nova'}
          activeTab={activeTab}
          onTabChange={goToTab}
          onBack={goBack}
          canGoBack={tabHistory.length > 0}
        />
        <div className="app-body">
          <div className="app-content">
            {/* The filter bar is part of what is being rebuilt: its chips
                describe the view that is arriving, so leaving them on screen
                during the wait shows the previous view's filters over the next
                view's skeleton. */}
            {isLoading ? (
              <FilterBarSkeleton />
            ) : (
              <FilterBar
                chips={showScorecard ? CHANNEL_CHIPS : MARKET_CHIPS}
                isV2={isV2}
              />
            )}
            {/* The skeleton replaces the report area rather than covering it:
                an overlay over stale numbers invites reading them, and the whole
                point of the wait is that those numbers are about to change. */}
            {isLoading ? (
              <ContentSkeleton kpis={showScorecard ? 6 : 4} />
            ) : showScorecard ? (
              <ChannelView onReportSelect={focusSettings} />
            ) : (
              <ContentArea isV2={isV2} onReportSelect={focusSettings} />
            )}
          </div>
          {/* Docked, and a sibling of the content and the rail, so the shell's
              own seam supplies the [panel]<space-4>[launchbar] gap rather than
              the panel carrying a margin of its own. */}
          <div
            className={`panel-dock${activePanel ? ' panel-dock--open' : ''}`}
            inert={!activePanel || undefined}
          >
            {panelConfig && (
              <ArvoPanel
                displayMode="docked"
                placement="right"
                title={panelConfig.title}
                /* Matches --panel-width, which sizes the slot that clips it. */
                defaultSize={320}
                onClose={() => setActivePanel(null)}
                /* Search, header actions and the add button are the panel's
                   own features rather than markup in the body -- they belong to
                   the panel chrome and stay put while the body scrolls. */
                headerActions={panelHeaderActions}
                stickyHeader={panelStickyHeader}
                fab={panelFab}
              >
                {panelConfig.id === 'nova' ? (
                  <NovaPanel />
                ) : panelConfig.id === 'settings' ? (
                  <UserSettingsPanel
                    settings={settings}
                    onChange={setSettings}
                    focus={settingsFocus}
                  />
                ) : isWorkflows ? (
                  <WorkflowsPanel ref={workflowsRef} query={workflowQuery} onApply={onFavoriteApply} />
                ) : (
                  <p className="panel-placeholder">
                    {panelConfig.title} content goes here.
                  </p>
                )}
              </ArvoPanel>
            )}
          </div>

          <RightLaunchbar
            isHidden={isFocusMode}
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            onFavoriteApply={onFavoriteApply}
          />
        </div>
      </div>
    </div>
    </ArvoToastProvider>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  )
}
