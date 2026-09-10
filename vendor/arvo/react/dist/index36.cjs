"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const utils = require("@arvo/utils");
const IconButton = require("./index17.cjs");
const ToggleButton = require("./index18.cjs");
const DropdownIconButton = require("./index60.cjs");
const Button = require("./index16.cjs");
const Badge = require("./index45.cjs");
const Status = require("./index14.cjs");
const MessageAlert = require("./index13.cjs");
const ActionMenu = require("./index49.cjs");
const useControllableState = require("./index90.cjs");
const useHorizontalOverflow = require("./index95.cjs");
function sortTabs(tabs) {
  const pinned = tabs.filter((t) => t.pinned);
  const unpinned = tabs.filter((t) => !t.pinned);
  const byOrder = (a, b) => {
    const aO = a.order ?? Infinity;
    const bO = b.order ?? Infinity;
    if (aO !== Infinity || bO !== Infinity) return aO - bO;
    return 0;
  };
  pinned.sort(byOrder);
  unpinned.sort(byOrder);
  return [...pinned, ...unpinned];
}
function getTabOrder(tabs) {
  return sortTabs(tabs).map((t) => t.id);
}
function composeAriaLabel(tab, isSelected) {
  var _a, _b;
  if (tab.ariaLabel) return tab.ariaLabel;
  const parts = [`${tab.label} tab`];
  if (isSelected) parts.push("selected");
  if ((_a = tab.badge) == null ? void 0 : _a.label) parts.push(tab.badge.label.toLowerCase());
  if (tab.alert) {
    parts.push(tab.alert.label ?? "contains validation issues");
  }
  if ((_b = tab.status) == null ? void 0 : _b.label) {
    parts.push(`status: ${tab.status.label.toLowerCase()}`);
  }
  if (tab.pinned) parts.push("pinned");
  return parts.join(", ");
}
const TAB_MENU_ID = {
  PIN: "__tabstrip:pin",
  UNPIN: "__tabstrip:unpin",
  CLOSE: "__tabstrip:close",
  CLOSE_OTHERS: "__tabstrip:close-others",
  CLOSE_RIGHT: "__tabstrip:close-right",
  MOVE_LEFT: "__tabstrip:move-left",
  MOVE_RIGHT: "__tabstrip:move-right",
  MOVE_START: "__tabstrip:move-start",
  MOVE_END: "__tabstrip:move-end"
};
function buildDefaultMenuItems(tab, flags, globalClosable) {
  const items = [];
  const tabClosable = tab.isClosable ?? globalClosable;
  if (flags.isPinnable && flags.isHorizontal && !tab.isDisabled) {
    items.push({
      id: tab.pinned ? TAB_MENU_ID.UNPIN : TAB_MENU_ID.PIN,
      label: tab.pinned ? "Unpin tab" : "Pin tab",
      shortcut: "Ctrl+P"
    });
  }
  if (tabClosable && flags.isHorizontal && !tab.pinned && !tab.isDisabled) {
    items.push({
      id: TAB_MENU_ID.CLOSE,
      label: "Close tab",
      shortcut: "Del"
    });
    items.push({
      id: TAB_MENU_ID.CLOSE_OTHERS,
      label: "Close other tabs"
    });
    items.push({
      id: TAB_MENU_ID.CLOSE_RIGHT,
      label: "Close tabs to the right"
    });
  }
  if (flags.isReorderable && flags.isHorizontal && !tab.isDisabled) {
    items.push({
      id: TAB_MENU_ID.MOVE_LEFT,
      label: "Move left",
      shortcut: "Ctrl+ArrowLeft"
    });
    items.push({
      id: TAB_MENU_ID.MOVE_RIGHT,
      label: "Move right",
      shortcut: "Ctrl+ArrowRight"
    });
    items.push({
      id: TAB_MENU_ID.MOVE_START,
      label: "Move to start",
      shortcut: "Ctrl+Home"
    });
    items.push({
      id: TAB_MENU_ID.MOVE_END,
      label: "Move to end",
      shortcut: "Ctrl+End"
    });
  }
  return items;
}
function composeTabMenu(tab, flags, globalClosable) {
  const consumer = tab.menuItems ?? [];
  const defaults = buildDefaultMenuItems(tab, flags, globalClosable);
  if (consumer.length === 0 && defaults.length === 0) return null;
  if (consumer.length === 0) return defaults;
  if (defaults.length === 0) return consumer;
  return [
    { id: "__tabstrip:group-consumer", items: consumer },
    { id: "__tabstrip:group-defaults", items: defaults }
  ];
}
function flattenMenuPayload(payload) {
  if (!payload) return [];
  if (payload.length === 0) return [];
  if ("items" in payload[0]) {
    return payload.flatMap((g) => g.items);
  }
  return payload;
}
const ArvoTabstrip = React.forwardRef(
  function ArvoTabstrip2({
    variant = "primary",
    size = "lg",
    orientation = "horizontal",
    tabs,
    selectedId: selectedIdProp,
    defaultSelectedId,
    activationMode = "automatic",
    isFullWidth = false,
    isClosable = false,
    isPinnable = false,
    isReorderable = false,
    // Off by default per the latest UX guidance -- consumers opt in
    // explicitly when the surrounding layout doesn't already supply a
    // visual seam between the tab row and its content panel.
    hasTabstripBorder = false,
    hasOverflow: hasOverflowProp = true,
    hasAddButton = false,
    addButtonLabel = "Add New",
    isAddDisabled = false,
    maxTabs,
    closeBehavior = "select-nearest",
    isDisabled = false,
    isLoading: isLoadingProp = false,
    menuProps,
    overflowMenuProps,
    onSelect,
    onClose,
    onPin,
    onTabAdd,
    onTabReorder,
    onOverflowOpen,
    className,
    ...rest
  }, ref) {
    var _a;
    const tabRefs = React.useRef(/* @__PURE__ */ new Map());
    const tabLabelRefs = React.useRef(/* @__PURE__ */ new Map());
    const tabTruncationHandlesRef = React.useRef(
      /* @__PURE__ */ new Map()
    );
    const boundaryRef = React.useRef(null);
    const listRef = React.useRef(null);
    const rightClusterRef = React.useRef(null);
    const overflowTriggerRef = React.useRef(null);
    const overflowMenuRef = React.useRef(null);
    const tabMenuButtonRefs = React.useRef(/* @__PURE__ */ new Map());
    const tabMenuHiddenHandles = React.useRef(
      /* @__PURE__ */ new Map()
    );
    const isLoading = isLoadingProp === true;
    const isHorizontal = orientation === "horizontal";
    const hasOverflowEnabled = hasOverflowProp && isHorizontal;
    const fallbackId = ((_a = tabs.find((t) => !t.isDisabled)) == null ? void 0 : _a.id) ?? null;
    const [resolvedSelectedId, setSelectedId] = useControllableState.useControllableState(
      selectedIdProp,
      defaultSelectedId !== void 0 ? defaultSelectedId : fallbackId
    );
    const stripIconBtnSize = size === "sm" ? "sm" : "md";
    const shouldFocusOnNextSelectionRef = React.useRef(false);
    const displayOrder = React.useMemo(() => sortTabs(tabs), [tabs]);
    const pinnedSet = React.useMemo(() => {
      const s = /* @__PURE__ */ new Set();
      for (const t of tabs) if (t.pinned) s.add(t.id);
      return s;
    }, [tabs]);
    const { hiddenIds: hiddenTabIds } = useHorizontalOverflow.useHorizontalOverflow({
      containerRef: listRef,
      boundaryRef,
      triggerRef: rightClusterRef,
      enabled: hasOverflowEnabled,
      getItems: () => {
        const out = [];
        for (const tab of displayOrder) {
          const el = tabRefs.current.get(tab.id);
          if (el) out.push({ id: tab.id, el });
        }
        return out;
      },
      isPinned: (id) => pinnedSet.has(id),
      promotedId: resolvedSelectedId ?? null,
      deps: [displayOrder, pinnedSet]
    });
    const overflowActive = hasOverflowEnabled && hiddenTabIds.size > 0;
    const isAddButtonCompact = overflowActive;
    const classes = [
      "arvo-tabs",
      `arvo-tabs--${variant}`,
      `arvo-tabs--${size}`,
      `arvo-tabs--${orientation}`,
      isFullWidth && "arvo-tabs--full-width",
      hasOverflowEnabled && "arvo-tabs--overflow",
      overflowActive && "has-overflow",
      isDisabled && "is-disabled",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const lastKnownSelectedIdxRef = React.useRef(-1);
    const resolvedSelectedIdRef = React.useRef(
      resolvedSelectedId
    );
    resolvedSelectedIdRef.current = resolvedSelectedId;
    React.useEffect(() => {
      if (resolvedSelectedId) {
        const idx = tabs.findIndex((t) => t.id === resolvedSelectedId);
        if (idx >= 0) lastKnownSelectedIdxRef.current = idx;
      }
    }, [resolvedSelectedId, tabs]);
    React.useEffect(() => {
      const currentId = resolvedSelectedIdRef.current;
      if (!currentId) return;
      const exists = tabs.some((t) => t.id === currentId);
      if (exists) return;
      const lastIdx = lastKnownSelectedIdxRef.current;
      const enabledTabs = tabs.filter((t) => !t.isDisabled);
      if (enabledTabs.length === 0) {
        setSelectedId(null);
        return;
      }
      let nextTab;
      if (closeBehavior === "select-next") {
        nextTab = enabledTabs.find((t) => tabs.indexOf(t) >= lastIdx);
        if (!nextTab) nextTab = enabledTabs[enabledTabs.length - 1];
      } else {
        const before = enabledTabs.filter((t) => tabs.indexOf(t) < lastIdx);
        nextTab = before.length > 0 ? before[before.length - 1] : enabledTabs[0];
      }
      if (nextTab) {
        const idx = tabs.findIndex((t) => t.id === nextTab.id);
        shouldFocusOnNextSelectionRef.current = true;
        setSelectedId(nextTab.id);
        onSelect == null ? void 0 : onSelect({ id: nextTab.id, index: idx });
      }
    }, [tabs]);
    const getEnabledTabs = React.useCallback(
      () => displayOrder.filter((t) => !t.isDisabled && !hiddenTabIds.has(t.id)),
      [displayOrder, hiddenTabIds]
    );
    const focusTab = React.useCallback((tabId) => {
      var _a2;
      (_a2 = tabRefs.current.get(tabId)) == null ? void 0 : _a2.focus();
    }, []);
    const togglePinFor = React.useCallback(
      (tab) => {
        if (!isPinnable || isDisabled || isLoading || tab.isDisabled) return;
        const newPinned = !tab.pinned;
        const updated = tabs.map(
          (t) => t.id === tab.id ? { ...t, pinned: newPinned } : t
        );
        onPin == null ? void 0 : onPin({
          id: tab.id,
          pinned: newPinned,
          tabOrder: getTabOrder(updated)
        });
      },
      [isPinnable, isDisabled, isLoading, tabs, onPin]
    );
    const moveTabBy = React.useCallback(
      (tab, action) => {
        if (!isReorderable || isDisabled || isLoading) return;
        const group = tab.pinned ? "pinned" : "unpinned";
        const groupTabs = displayOrder.filter(
          (t) => (t.pinned ? "pinned" : "unpinned") === group
        );
        const idxInGroup = groupTabs.findIndex((t) => t.id === tab.id);
        if (idxInGroup < 0) return;
        let targetIdxInGroup = idxInGroup;
        if (action === "start") targetIdxInGroup = 0;
        else if (action === "end") targetIdxInGroup = groupTabs.length - 1;
        else if (action === "left") targetIdxInGroup = Math.max(0, idxInGroup - 1);
        else if (action === "right")
          targetIdxInGroup = Math.min(groupTabs.length - 1, idxInGroup + 1);
        if (targetIdxInGroup === idxInGroup) return;
        const newGroup = [...groupTabs];
        const [moved] = newGroup.splice(idxInGroup, 1);
        newGroup.splice(targetIdxInGroup, 0, moved);
        const newDisplay = group === "pinned" ? [...newGroup, ...displayOrder.filter((t) => !t.pinned)] : [...displayOrder.filter((t) => t.pinned), ...newGroup];
        const orderById = new Map(newDisplay.map((t, i) => [t.id, i]));
        const reordered = [...tabs].sort((a, b) => {
          const ai = orderById.get(a.id) ?? Number.MAX_SAFE_INTEGER;
          const bi = orderById.get(b.id) ?? Number.MAX_SAFE_INTEGER;
          return ai - bi;
        });
        onTabReorder == null ? void 0 : onTabReorder(reordered);
      },
      [isReorderable, isDisabled, isLoading, displayOrder, tabs, onTabReorder]
    );
    const closeManyTabs = React.useCallback(
      (tabIds) => {
        if (isDisabled || isLoading) return;
        for (const id of tabIds) {
          const idx = tabs.findIndex((t) => t.id === id);
          if (idx < 0) continue;
          onClose == null ? void 0 : onClose({ id, index: idx });
        }
      },
      [isDisabled, isLoading, tabs, onClose]
    );
    const openTabContextMenu = React.useCallback((tabId) => {
      const btn = tabMenuButtonRefs.current.get(tabId);
      if (btn) {
        btn.click();
        return;
      }
      const handle = tabMenuHiddenHandles.current.get(tabId);
      handle == null ? void 0 : handle.open();
    }, []);
    const handleKeyDown = React.useCallback(
      (e) => {
        var _a2;
        if (isDisabled || isLoading) return;
        const enabled = getEnabledTabs();
        if (enabled.length === 0) return;
        const activeEl = document.activeElement;
        const currentId = ((_a2 = activeEl == null ? void 0 : activeEl.closest(".arvo-tabs__tab")) == null ? void 0 : _a2.getAttribute("data-tab-id")) ?? null;
        const currentIdx = enabled.findIndex((t) => t.id === currentId);
        if (currentIdx < 0) return;
        const currentTab = enabled[currentIdx];
        if (e.key === "F10" && e.shiftKey) {
          e.preventDefault();
          openTabContextMenu(currentTab.id);
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "\\" || e.code === "Backslash")) {
          e.preventDefault();
          openTabContextMenu(currentTab.id);
          return;
        }
        if (core.isModKey(e.nativeEvent) && !e.shiftKey && !e.altKey && (e.key === "p" || e.key === "P")) {
          if (isPinnable && isHorizontal && !currentTab.isDisabled) {
            e.preventDefault();
            togglePinFor(currentTab);
          }
          return;
        }
        if (core.isModKey(e.nativeEvent) && (e.key === "Home" || e.key === "End")) {
          if (isReorderable && isHorizontal && !currentTab.isDisabled) {
            e.preventDefault();
            moveTabBy(currentTab, e.key === "Home" ? "start" : "end");
          }
          return;
        }
        let nextIdx = null;
        switch (e.key) {
          case "ArrowRight":
            if (!isHorizontal) return;
            e.preventDefault();
            nextIdx = (currentIdx + 1) % enabled.length;
            break;
          case "ArrowLeft":
            if (!isHorizontal) return;
            e.preventDefault();
            nextIdx = (currentIdx - 1 + enabled.length) % enabled.length;
            break;
          case "ArrowDown":
            if (isHorizontal) return;
            e.preventDefault();
            nextIdx = (currentIdx + 1) % enabled.length;
            break;
          case "ArrowUp":
            if (isHorizontal) return;
            e.preventDefault();
            nextIdx = (currentIdx - 1 + enabled.length) % enabled.length;
            break;
          case "Home":
            e.preventDefault();
            nextIdx = 0;
            break;
          case "End":
            e.preventDefault();
            nextIdx = enabled.length - 1;
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            if (currentTab.id !== resolvedSelectedId) {
              const tabsIdx = tabs.findIndex((t) => t.id === currentTab.id);
              setSelectedId(currentTab.id);
              onSelect == null ? void 0 : onSelect({ id: currentTab.id, index: tabsIdx });
            }
            return;
          case "Delete":
          case "Backspace": {
            if (currentTab.pinned) return;
            const tabClosable = currentTab.isClosable ?? isClosable;
            if (tabClosable) {
              e.preventDefault();
              const tabsIdx = tabs.findIndex((t) => t.id === currentTab.id);
              onClose == null ? void 0 : onClose({ id: currentTab.id, index: tabsIdx });
            }
            return;
          }
          default:
            return;
        }
        if (nextIdx !== null) {
          if (activationMode === "automatic") {
            const target = enabled[nextIdx];
            const tabsIdx = tabs.findIndex((t) => t.id === target.id);
            setSelectedId(target.id);
            onSelect == null ? void 0 : onSelect({ id: target.id, index: tabsIdx });
          }
          focusTab(enabled[nextIdx].id);
        }
      },
      [
        isDisabled,
        isLoading,
        isHorizontal,
        isPinnable,
        isReorderable,
        getEnabledTabs,
        resolvedSelectedId,
        activationMode,
        tabs,
        isClosable,
        onSelect,
        onClose,
        focusTab,
        setSelectedId,
        openTabContextMenu,
        togglePinFor,
        moveTabBy
      ]
    );
    React.useEffect(() => {
      if (resolvedSelectedId) {
        const el = tabRefs.current.get(resolvedSelectedId);
        el == null ? void 0 : el.setAttribute("tabindex", "0");
        if (shouldFocusOnNextSelectionRef.current) {
          shouldFocusOnNextSelectionRef.current = false;
          el == null ? void 0 : el.focus();
        }
      }
    }, [resolvedSelectedId]);
    React.useEffect(() => {
      const liveIds = /* @__PURE__ */ new Set();
      for (const tab of tabs) {
        liveIds.add(tab.id);
        const tabEl = tabRefs.current.get(tab.id);
        const lblEl = tabLabelRefs.current.get(tab.id);
        if (!tabEl || !lblEl) continue;
        const existing = tabTruncationHandlesRef.current.get(tab.id);
        if (existing) {
          existing.update(tab.label);
        } else {
          tabTruncationHandlesRef.current.set(
            tab.id,
            utils.attachTitleTruncationTooltip({
              element: lblEl,
              triggerElement: tabEl,
              content: tab.label,
              placement: "bottom-center"
            })
          );
        }
      }
      for (const [id, handle] of tabTruncationHandlesRef.current) {
        if (!liveIds.has(id)) {
          handle.destroy();
          tabTruncationHandlesRef.current.delete(id);
        }
      }
    }, [tabs]);
    React.useEffect(() => {
      const handles = tabTruncationHandlesRef.current;
      return () => {
        for (const handle of handles.values()) handle.destroy();
        handles.clear();
      };
    }, []);
    const tabsRef = React.useRef(tabs);
    const onTabReorderRef = React.useRef(onTabReorder);
    const pinnedSetRef = React.useRef(pinnedSet);
    const displayOrderRef = React.useRef(displayOrder);
    React.useEffect(() => {
      tabsRef.current = tabs;
      onTabReorderRef.current = onTabReorder;
      pinnedSetRef.current = pinnedSet;
      displayOrderRef.current = displayOrder;
    }, [tabs, onTabReorder, pinnedSet, displayOrder]);
    const canReorder = isReorderable && isHorizontal && !isDisabled && !isLoading;
    React.useEffect(() => {
      const list = listRef.current;
      if (!canReorder || !list) return;
      const handle = core.createSortableList(list, {
        itemSelector: ".arvo-tabs__tab",
        handleSelector: null,
        axis: "x",
        // A click on a tab MUST NOT pick it up. The user must drag at
        // least 4px along the strip's axis before the drag commits.
        dragThreshold: 4,
        // Looser displacement -- siblings shift aside as soon as the
        // source has overlapped ~25% of a neighbor instead of crossing
        // the midpoint.
        overlapThreshold: 0.25,
        // Cross-axis lock: when the user scrolls the page vertically
        // mid-drag the floating clone follows the strip instead of
        // drifting off it.
        lockCrossAxisToContainer: true,
        getGroupOf: (el) => pinnedSetRef.current.has(el.dataset.tabId ?? "") ? "pinned" : "unpinned",
        allowCrossGroup: false,
        // Clamp the lifted clone to the source's group bounds so an
        // unpinned tab can never visually overlap the pinned region nor
        // the right-edge cluster (overflow / add-button), and a pinned
        // tab can never cross into the unpinned region. Re-evaluated on
        // every pointermove + scroll by the core sortable.
        getDragBounds: (el) => {
          const id = el.dataset.tabId ?? "";
          const group = pinnedSetRef.current.has(id) ? "pinned" : "unpinned";
          const groupEls = [];
          for (const tab of displayOrderRef.current) {
            const groupOfTab = pinnedSetRef.current.has(tab.id) ? "pinned" : "unpinned";
            if (groupOfTab !== group) continue;
            const tabEl = list.querySelector(
              `.arvo-tabs__tab[data-tab-id="${tab.id}"]`
            );
            if (tabEl) groupEls.push(tabEl);
          }
          if (groupEls.length === 0) return null;
          const first = groupEls[0].getBoundingClientRect();
          const last = groupEls[groupEls.length - 1].getBoundingClientRect();
          return { min: first.left, max: last.right };
        },
        onCommit: (from, to) => {
          var _a2;
          const display = displayOrderRef.current;
          if (from < 0 || from >= display.length || to < 0 || to >= display.length || from === to) {
            return;
          }
          const moved = display[from];
          const target = display[to];
          if (!moved || !target) return;
          const next = tabsRef.current.filter((t) => t.id !== moved.id);
          const targetIdx = next.findIndex((t) => t.id === target.id);
          if (targetIdx < 0) {
            next.push(moved);
          } else {
            const insertIdx = to > from ? targetIdx + 1 : targetIdx;
            next.splice(insertIdx, 0, moved);
          }
          (_a2 = onTabReorderRef.current) == null ? void 0 : _a2.call(onTabReorderRef, next);
        }
      });
      return () => handle.destroy();
    }, [canReorder]);
    const handleTabClick = React.useCallback(
      (tab, index) => {
        if (tab.isDisabled || isDisabled || isLoading) return;
        if (tab.id !== resolvedSelectedId) {
          setSelectedId(tab.id);
          onSelect == null ? void 0 : onSelect({ id: tab.id, index });
        }
      },
      [isDisabled, isLoading, resolvedSelectedId, setSelectedId, onSelect]
    );
    const overflowMenuItems = React.useMemo(() => {
      return displayOrder.filter((t) => hiddenTabIds.has(t.id)).map((tab) => {
        const actions = [];
        if (isPinnable) {
          actions.push({
            id: `pin-${tab.id}`,
            icon: tab.pinned ? "push-pinned" : "push-pin",
            ariaLabel: tab.pinned ? "Unpin tab" : "Pin tab",
            isDisabled: tab.isDisabled || isDisabled,
            onClick: () => {
              const newPinned = !tab.pinned;
              const updated = tabs.map(
                (t) => t.id === tab.id ? { ...t, pinned: newPinned } : t
              );
              onPin == null ? void 0 : onPin({
                id: tab.id,
                pinned: newPinned,
                tabOrder: getTabOrder(updated)
              });
              return false;
            }
          });
        }
        if (!tab.pinned && (tab.isClosable ?? isClosable)) {
          actions.push({
            id: `close-${tab.id}`,
            icon: "close",
            ariaLabel: "Close tab",
            isDisabled: tab.isDisabled || isDisabled,
            onClick: () => {
              const idx = tabs.findIndex((t) => t.id === tab.id);
              onClose == null ? void 0 : onClose({ id: tab.id, index: idx });
              return false;
            }
          });
        }
        return {
          id: tab.id,
          label: tab.label,
          icon: tab.icon,
          isDisabled: tab.isDisabled,
          active: tab.id === resolvedSelectedId,
          actions: actions.length > 0 ? actions : void 0
        };
      });
    }, [
      displayOrder,
      hiddenTabIds,
      isPinnable,
      isClosable,
      isDisabled,
      tabs,
      resolvedSelectedId,
      onPin,
      onClose
    ]);
    const handleOverflowSelect = React.useCallback(
      (item) => {
        if (item.isDisabled) return;
        const idx = tabs.findIndex((t) => t.id === item.id);
        setSelectedId(item.id);
        onSelect == null ? void 0 : onSelect({ id: item.id, index: idx });
      },
      [tabs, setSelectedId, onSelect]
    );
    const handleOverflowOpenChange = React.useCallback(
      (open) => {
        if (open) onOverflowOpen == null ? void 0 : onOverflowOpen();
      },
      [onOverflowOpen]
    );
    const addButtonDisabled = isDisabled || isAddDisabled || typeof maxTabs === "number" && tabs.length >= maxTabs;
    const indicatorRef = React.useRef(null);
    const indicatorJustReadyRef = React.useRef(false);
    const updateIndicator = React.useCallback(() => {
      const indicator = indicatorRef.current;
      const list = listRef.current;
      if (!indicator || !list) return;
      const activeTab = resolvedSelectedId ? tabRefs.current.get(resolvedSelectedId) : null;
      const activeTabModel = resolvedSelectedId ? tabs.find((t) => t.id === resolvedSelectedId) ?? null : null;
      const activeDisabled = !!(activeTabModel == null ? void 0 : activeTabModel.isDisabled) || isDisabled || isLoading;
      const activeHidden = resolvedSelectedId ? hiddenTabIds.has(resolvedSelectedId) : false;
      const show = !!activeTab && !activeDisabled && !activeHidden;
      if (!show || !activeTab) {
        indicator.dataset.indicatorState = "hidden";
        return;
      }
      const tabRect = activeTab.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      if (isHorizontal) {
        const x = tabRect.left - listRect.left + list.scrollLeft;
        const w = tabRect.width;
        list.style.setProperty("--arvo-tabs-indicator-x", `${x}px`);
        list.style.setProperty("--arvo-tabs-indicator-w", `${w}px`);
      } else {
        const y = tabRect.top - listRect.top + list.scrollTop;
        const h = tabRect.height;
        list.style.setProperty("--arvo-tabs-indicator-y", `${y}px`);
        list.style.setProperty("--arvo-tabs-indicator-h", `${h}px`);
      }
      if (indicator.dataset.indicatorState !== "visible") {
        indicator.style.transition = "none";
        void indicator.offsetWidth;
        indicator.dataset.indicatorState = "visible";
        indicator.style.transition = "";
      }
    }, [
      resolvedSelectedId,
      tabs,
      hiddenTabIds,
      isDisabled,
      isLoading,
      isHorizontal,
      variant
    ]);
    React.useLayoutEffect(() => {
      indicatorJustReadyRef.current = true;
      const indicator = indicatorRef.current;
      if (indicator) {
        indicator.style.transition = "none";
        void indicator.offsetWidth;
        indicator.style.transition = "";
      }
      updateIndicator();
    }, [orientation, size, variant]);
    React.useLayoutEffect(() => {
      updateIndicator();
    }, [updateIndicator, displayOrder]);
    React.useEffect(() => {
      const list = listRef.current;
      if (!list) return;
      if (typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(() => updateIndicator());
      ro.observe(list);
      const activeTab = resolvedSelectedId ? tabRefs.current.get(resolvedSelectedId) : null;
      if (activeTab) ro.observe(activeTab);
      return () => ro.disconnect();
    }, [updateIndicator, resolvedSelectedId]);
    const handleTabMenuSelect = React.useCallback(
      (tab, item) => {
        switch (item.id) {
          case TAB_MENU_ID.PIN:
          case TAB_MENU_ID.UNPIN:
            togglePinFor(tab);
            return;
          case TAB_MENU_ID.CLOSE: {
            const idx = tabs.findIndex((t) => t.id === tab.id);
            onClose == null ? void 0 : onClose({ id: tab.id, index: idx });
            return;
          }
          case TAB_MENU_ID.CLOSE_OTHERS: {
            const otherIds = tabs.filter((t) => t.id !== tab.id && !t.pinned && !t.isDisabled).map((t) => t.id);
            closeManyTabs(otherIds);
            return;
          }
          case TAB_MENU_ID.CLOSE_RIGHT: {
            const startIdx = displayOrder.findIndex((t) => t.id === tab.id);
            if (startIdx < 0) return;
            const rightIds = displayOrder.slice(startIdx + 1).filter((t) => !t.pinned && !t.isDisabled).map((t) => t.id);
            closeManyTabs(rightIds);
            return;
          }
          case TAB_MENU_ID.MOVE_LEFT:
            moveTabBy(tab, "left");
            return;
          case TAB_MENU_ID.MOVE_RIGHT:
            moveTabBy(tab, "right");
            return;
          case TAB_MENU_ID.MOVE_START:
            moveTabBy(tab, "start");
            return;
          case TAB_MENU_ID.MOVE_END:
            moveTabBy(tab, "end");
            return;
          default:
            return;
        }
      },
      [tabs, displayOrder, togglePinFor, closeManyTabs, moveTabBy, onClose]
    );
    const defaultActionFlags = {
      isPinnable,
      isReorderable,
      isHorizontal
    };
    const tabElements = displayOrder.map((tab) => {
      var _a2, _b;
      const index = tabs.findIndex((t) => t.id === tab.id);
      const isSelected = tab.id === resolvedSelectedId;
      const isTabDisabled = tab.isDisabled || isDisabled;
      const tabClosable = isHorizontal && !tab.pinned && (tab.isClosable ?? isClosable);
      const tabPinnable = isHorizontal && isPinnable;
      const hasVisibleMenu = Array.isArray(tab.menuItems) && tab.menuItems.length > 0;
      const composedMenu = composeTabMenu(tab, defaultActionFlags, isClosable);
      const hasComposedMenu = composedMenu !== null;
      const composedFlatItems = flattenMenuPayload(composedMenu);
      const composedIsGrouped = Array.isArray(composedMenu) && composedMenu.length > 0 && "items" in composedMenu[0];
      const tabClasses = [
        "arvo-tabs__tab",
        isSelected && "active",
        isTabDisabled && "is-disabled",
        tab.pinned && "is-pinned"
      ].filter(Boolean).join(" ");
      const handleClick = () => handleTabClick(tab, index);
      const handleCloseClick = (e) => {
        e.stopPropagation();
        if (isDisabled || isLoading) return;
        onClose == null ? void 0 : onClose({ id: tab.id, index });
      };
      const handleContextMenu = (e) => {
        if (!hasComposedMenu || isTabDisabled || isLoading) return;
        e.preventDefault();
        openTabContextMenu(tab.id);
      };
      const hasActions = hasVisibleMenu || tabPinnable || tabClosable;
      const ariaLabel = composeAriaLabel(tab, isSelected);
      const statusTooltip = ((_a2 = tab.status) == null ? void 0 : _a2.tooltip) ?? ((_b = tab.status) == null ? void 0 : _b.label);
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: (el) => {
            if (el) tabRefs.current.set(tab.id, el);
            else tabRefs.current.delete(tab.id);
          },
          role: "tab",
          className: tabClasses,
          "data-tab-id": tab.id,
          "aria-selected": isSelected,
          "aria-controls": tab.panelId || void 0,
          "aria-disabled": isTabDisabled || void 0,
          "aria-label": ariaLabel,
          tabIndex: isSelected ? 0 : -1,
          title: tab.tooltip,
          onClick: handleClick,
          onContextMenu: handleContextMenu,
          onKeyDown: handleKeyDown,
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-tabs__tab-lft", children: [
              tab.icon && /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: `arvo-tabs__tab-ico o9con o9con-${tab.icon}`,
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-lbl", "data-label": tab.label, children: /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: "arvo-tabs__tab-lbl-text",
                  ref: (el) => {
                    if (el) tabLabelRefs.current.set(tab.id, el);
                    else tabLabelRefs.current.delete(tab.id);
                  },
                  children: tab.label
                }
              ) }),
              tab.alert && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-alert", children: /* @__PURE__ */ jsxRuntime.jsx(
                MessageAlert.ArvoMessageAlert,
                {
                  isInline: true,
                  type: tab.alert.type ?? "negative",
                  message: tab.alert.label
                }
              ) }),
              tab.badge && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-badge", children: /* @__PURE__ */ jsxRuntime.jsx(
                Badge.ArvoBadge,
                {
                  size: "sm",
                  semanticType: tab.badge.semanticType ?? "positive",
                  message: tab.badge.label,
                  hasBadgeIcon: false,
                  tooltip: tab.badge.tooltip
                }
              ) }),
              tab.status && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-status", children: /* @__PURE__ */ jsxRuntime.jsx(
                Status.ArvoStatus,
                {
                  size: "sm",
                  type: tab.status.type ?? "available",
                  placement: "inline",
                  tooltip: statusTooltip
                }
              ) })
            ] }),
            hasActions && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-tabs__tab-actions", children: [
              hasVisibleMenu && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-menu", children: /* @__PURE__ */ jsxRuntime.jsx(
                DropdownIconButton.default,
                {
                  ...menuProps,
                  ref: (node) => {
                    if (node) tabMenuButtonRefs.current.set(tab.id, node);
                    else tabMenuButtonRefs.current.delete(tab.id);
                  },
                  size: "sm",
                  icon: "ellipsis-v",
                  items: composedIsGrouped ? composedMenu : composedFlatItems,
                  hasGroupDividers: composedIsGrouped,
                  variant: "tertiary",
                  isCompact: true,
                  tooltip: "Tab actions",
                  tabIndex: -1,
                  closeOnSelect: true,
                  isDisabled: isTabDisabled,
                  isLoading,
                  onSelect: (item) => handleTabMenuSelect(tab, item)
                }
              ) }),
              tabPinnable && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-pin", children: /* @__PURE__ */ jsxRuntime.jsx(
                ToggleButton.ArvoToggleButton,
                {
                  icon: "push-pin",
                  selectedIcon: "push-pinned",
                  variant: "tertiary",
                  size: "sm",
                  tooltip: tab.pinned ? "Unpin tab" : "Pin tab",
                  isDisabled: isTabDisabled,
                  isLoading,
                  isSelected: tab.pinned ?? false,
                  status: tab.pinActionStatus ?? null,
                  tabIndex: -1,
                  onClick: (e) => e.stopPropagation(),
                  onSelectedChange: () => togglePinFor(tab)
                }
              ) }),
              tabClosable && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__tab-close", children: /* @__PURE__ */ jsxRuntime.jsx(
                IconButton.ArvoIconButton,
                {
                  icon: "close",
                  variant: "tertiary",
                  size: "sm",
                  tooltip: "Close tab",
                  isDisabled: isTabDisabled,
                  isLoading,
                  status: tab.closeActionStatus ?? null,
                  tabIndex: -1,
                  onClick: handleCloseClick
                }
              ) })
            ] }),
            !hasVisibleMenu && hasComposedMenu && /* @__PURE__ */ jsxRuntime.jsx(
              ActionMenu.ArvoActionMenu,
              {
                ref: (node) => {
                  if (node) tabMenuHiddenHandles.current.set(tab.id, node);
                  else tabMenuHiddenHandles.current.delete(tab.id);
                },
                triggerRef: {
                  current: tabRefs.current.get(tab.id) ?? null
                },
                items: composedFlatItems,
                placement: "bottom-end",
                closeOnSelect: true,
                isDisabled: isTabDisabled || isLoading,
                onSelect: (item) => handleTabMenuSelect(tab, item)
              }
            ),
            isLoading && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__skel", "aria-hidden": "true" })
          ]
        },
        tab.id
      );
    });
    const mergedRootRef = React.useCallback(
      (node) => {
        boundaryRef.current = (node == null ? void 0 : node.parentElement) ?? node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    const showOverflowTrigger = isHorizontal && hasOverflowEnabled && overflowActive;
    const showAddButton = isHorizontal && hasAddButton;
    const showRightCluster = showOverflowTrigger || showAddButton;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: mergedRootRef,
        className: classes,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              ref: listRef,
              className: "arvo-tabs__list",
              role: "tablist",
              "aria-orientation": orientation,
              "aria-label": rest["aria-label"] || "Tabs",
              children: [
                isHorizontal && hasTabstripBorder && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tabs__divider", "aria-hidden": "true" }),
                tabElements,
                /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    ref: indicatorRef,
                    className: "arvo-tabs__indicator",
                    "data-indicator-state": "hidden",
                    "aria-hidden": "true"
                  }
                )
              ]
            }
          ),
          showRightCluster && /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: rightClusterRef, className: "arvo-tabs__right", children: [
            showOverflowTrigger && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-tabs__overflow-btn", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                IconButton.ArvoIconButton,
                {
                  ref: overflowTriggerRef,
                  icon: "ellipsis-v",
                  variant: "tertiary",
                  size: stripIconBtnSize,
                  tooltip: "More tabs",
                  isDisabled,
                  isLoading
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                ActionMenu.ArvoActionMenu,
                {
                  ...overflowMenuProps,
                  ref: overflowMenuRef,
                  triggerRef: overflowTriggerRef,
                  items: overflowMenuItems,
                  placement: "bottom-end",
                  closeOnSelect: true,
                  actionsVisibility: (overflowMenuProps == null ? void 0 : overflowMenuProps.actionsVisibility) ?? "always",
                  isDisabled: isDisabled || isLoading,
                  onSelect: handleOverflowSelect,
                  onOpenChange: handleOverflowOpenChange
                }
              )
            ] }),
            showAddButton && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-tabs__add-btn", children: isAddButtonCompact ? (
              // Space-constrained: collapse the labeled outline
              // ArvoButton into an icon-only ArvoIconButton so the
              // strip can keep showing the add affordance without
              // claiming label-width. The label moves into the
              // tooltip. TERTIARY so it matches the overflow
              // trigger's strip-utility weight.
              /* @__PURE__ */ jsxRuntime.jsx(
                IconButton.ArvoIconButton,
                {
                  icon: "plus",
                  variant: "tertiary",
                  size: stripIconBtnSize,
                  tooltip: addButtonLabel,
                  isDisabled: addButtonDisabled,
                  isLoading,
                  onClick: onTabAdd
                }
              )
            ) : /* @__PURE__ */ jsxRuntime.jsx(
              Button.ArvoButton,
              {
                variant: "outline",
                size: size === "sm" ? "sm" : "md",
                icon: "plus",
                label: addButtonLabel,
                isDisabled: addButtonDisabled,
                isLoading,
                onClick: onTabAdd
              }
            ) })
          ] })
        ]
      }
    );
  }
);
exports.default = ArvoTabstrip;
//# sourceMappingURL=index36.cjs.map
