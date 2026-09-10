"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const client = require("./index97.cjs");
const core = require("@arvo/core");
const Popover = require("./index27.cjs");
const HybridPopover = require("./index28.cjs");
const IconButton = require("./index17.cjs");
const DropdownIconButton = require("./index60.cjs");
const Search = require("./index51.cjs");
const Switch = require("./index26.cjs");
const EmptyState = require("./index88.cjs");
const useOverlaySurface = require("./index92.cjs");
const useListNavigation = require("./index93.cjs");
const menuSearch = require("./index100.cjs");
const utils = require("@arvo/utils");
const FILTER_KEYS = ["label", "secondaryLabel"];
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) {
    return items.flatMap((g) => g.items);
  }
  return items;
}
let _inlineEntryCounter = 0;
function nextInlineEntryId() {
  _inlineEntryCounter += 1;
  return `inline-entry-${_inlineEntryCounter}`;
}
function splitLabelForMatch(label, fragment) {
  if (!fragment) return null;
  const idx = label.toLowerCase().indexOf(fragment.toLowerCase());
  if (idx < 0) return null;
  return {
    before: label.slice(0, idx),
    match: label.slice(idx, idx + fragment.length),
    after: label.slice(idx + fragment.length)
  };
}
function resolveStatus(status) {
  if (!status) return { modifier: null, style: null };
  if (typeof status === "string") {
    return { modifier: `arvo-menu-item--status-${status}`, style: null };
  }
  return {
    modifier: null,
    style: {
      ["--arvo-menu-item-status-color"]: status.color
    }
  };
}
function MenuSkeleton({ count = 6 }) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: Array.from({ length: count }, (_, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-action-menu__skeleton", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-action-menu__skeleton-icon" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-action-menu__skeleton-text" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-action-menu__skeleton-trailing" })
  ] }, i)) });
}
function SubmenuPanel({
  items,
  closeOnSelect,
  onClose,
  onCloseAll,
  onSelect,
  anchorRef,
  parentId,
  submenuWidth
}) {
  const panelRef = React.useRef(null);
  const enabledItems = React.useMemo(
    () => items.map((item, i) => ({ item, index: i })).filter(({ item }) => !item.isDisabled),
    [items]
  );
  const [activeIdx, setActiveIdx] = React.useState(() => {
    return enabledItems.length > 0 ? enabledItems[0].index : -1;
  });
  const {
    isOpen: surfaceIsOpen,
    isMounted,
    positioned,
    panelStyle,
    panelSide
  } = useOverlaySurface.useOverlaySurface({
    type: "action-menu",
    priority: 15,
    parentId,
    relation: "submenu",
    triggerRef: anchorRef,
    panelRef,
    isOpen: true,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
    placement: "right-start",
    gap: 0,
    width: submenuWidth ?? void 0,
    focus: "none",
    closeOnOutside: true,
    closeOnEscape: false,
    // parent menu's keyboard handler owns Escape unwind
    // Submenus animate with the same `fade` enter/exit motion as the
    // top-level menu (and as the JS twin, which mounts a full
    // `ArvoActionMenu` for each submenu and inherits its `'fade'`
    // transition). The direction-aware `popup-animation` mixin reads
    // `data-arvo-side` so the submenu slides in from the side opposite
    // the resolved placement (e.g. `right-start` -> slides in from the
    // left).
    transition: "fade",
    transitionDuration: 150,
    haspopup: "menu"
  });
  const handleItemClick = React.useCallback(
    (item, index) => {
      if (item.isDisabled) return;
      const result = onSelect(item, index);
      if (result !== false && closeOnSelect) onCloseAll();
    },
    [onSelect, closeOnSelect, onCloseAll]
  );
  const focusItem = React.useCallback(
    (index) => {
      var _a;
      setActiveIdx(index);
      const el = (_a = panelRef.current) == null ? void 0 : _a.querySelector(
        `[data-submenu-index="${index}"]`
      );
      el == null ? void 0 : el.focus({ preventScroll: true });
    },
    []
  );
  const focusFirstEnabled = React.useCallback(() => {
    if (enabledItems.length > 0) focusItem(enabledItems[0].index);
  }, [enabledItems, focusItem]);
  const focusLastEnabled = React.useCallback(() => {
    if (enabledItems.length > 0) focusItem(enabledItems[enabledItems.length - 1].index);
  }, [enabledItems, focusItem]);
  React.useEffect(() => {
    if (positioned) {
      requestAnimationFrame(() => focusFirstEnabled());
    }
  }, [positioned, focusFirstEnabled]);
  const handleKeyDown = React.useCallback(
    (e) => {
      const currentEnabledIdx = enabledItems.findIndex(({ index }) => index === activeIdx);
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          e.stopPropagation();
          const next = currentEnabledIdx < enabledItems.length - 1 ? currentEnabledIdx + 1 : 0;
          focusItem(enabledItems[next].index);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          e.stopPropagation();
          const prev = currentEnabledIdx > 0 ? currentEnabledIdx - 1 : enabledItems.length - 1;
          focusItem(enabledItems[prev].index);
          break;
        }
        case "Home": {
          e.preventDefault();
          e.stopPropagation();
          focusFirstEnabled();
          break;
        }
        case "End": {
          e.preventDefault();
          e.stopPropagation();
          focusLastEnabled();
          break;
        }
        case "ArrowLeft":
        case "Escape": {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        }
        case "Tab": {
          e.preventDefault();
          e.stopPropagation();
          onCloseAll();
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          e.stopPropagation();
          if (activeIdx >= 0) handleItemClick(items[activeIdx], activeIdx);
          break;
        }
      }
    },
    [activeIdx, enabledItems, items, focusItem, focusFirstEnabled, focusLastEnabled, onClose, onCloseAll, handleItemClick]
  );
  if (!surfaceIsOpen && !isMounted) return null;
  const panelClasses = "arvo-action-menu arvo-action-menu--submenu open";
  return require$$0.createPortal(
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: panelRef,
        className: panelClasses,
        role: "menu",
        tabIndex: -1,
        "data-arvo-side": panelSide,
        style: panelStyle,
        onKeyDown: handleKeyDown,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-action-menu__scroll", children: items.map((item, i) => /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: [
              "arvo-menu-item",
              item.isDisabled && "is-disabled",
              item.destructive && "arvo-menu-item--destructive",
              i === activeIdx && "focused"
            ].filter(Boolean).join(" "),
            role: "menuitem",
            "aria-disabled": item.isDisabled || void 0,
            tabIndex: i === activeIdx ? 0 : -1,
            "data-submenu-index": i,
            onClick: () => handleItemClick(item, i),
            children: [
              item.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: `arvo-menu-item__ico o9con o9con-${item.icon}`, "aria-hidden": "true" }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-menu-item__txt", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__lbl", children: item.label }) })
            ]
          },
          item.id
        )) })
      }
    ),
    document.body
  );
}
const ArvoActionMenu = React.forwardRef(
  function ArvoActionMenu2({
    items,
    isLoading: isLoadingProp = false,
    search,
    placement = "bottom-start",
    menuWidth,
    submenuWidth,
    maxHeight,
    hasGroupDividers = true,
    actionsVisibility = "always",
    actionsMaxVisible = 4,
    submenuTrigger = "hover",
    closeOnSelect = true,
    isOpen: openProp,
    defaultOpen = false,
    isDisabled = false,
    triggerRef: triggerRefProp,
    trigger,
    emptyConfig,
    onOpen,
    onClose,
    onSelect,
    onOpenChange,
    className
  }, ref) {
    const uid = React.useId();
    const menuId = `arvo-action-menu-${uid}`;
    const isLoading = isLoadingProp === true;
    const searchCfg = React.useMemo(
      () => menuSearch.normalizeSearch(search),
      [search]
    );
    const panelRef = React.useRef(null);
    const internalTriggerRef = React.useRef(null);
    const triggerRef = triggerRefProp ?? internalTriggerRef;
    const scrollRef = React.useRef(null);
    const searchWrapperRef = React.useRef(null);
    const inlineStackRef = React.useRef(null);
    const reactRootsRef = React.useRef(/* @__PURE__ */ new Map());
    const closeReasonRef = React.useRef(null);
    const [filterQuery, setFilterQuery] = React.useState("");
    const filteredItems = React.useMemo(() => {
      if (!searchCfg || !filterQuery) return items;
      const filterOpts = { query: filterQuery, keys: [...FILTER_KEYS] };
      if (isGrouped(items)) {
        return core.filterGroups(items, filterOpts);
      }
      return core.filterItems(items, filterOpts);
    }, [items, searchCfg, filterQuery]);
    const flatItems = React.useMemo(() => flattenItems(filteredItems), [filteredItems]);
    const totalItemCount = React.useMemo(() => flattenItems(items).length, [items]);
    React.useEffect(() => {
      var _a;
      if (searchCfg && filterQuery) {
        (_a = searchCfg.onFilter) == null ? void 0 : _a.call(searchCfg, filterQuery, flatItems.length);
      }
    }, [searchCfg, filterQuery, flatItems.length]);
    const [openSubmenuId, setOpenSubmenuId] = React.useState(null);
    const submenuTimerRef = React.useRef(null);
    const itemRefsMap = React.useRef(/* @__PURE__ */ new Map());
    const [inlineStackDepth, setInlineStackDepth] = React.useState(0);
    const inlineStackDepthRef = React.useRef(0);
    const handleCloseRef = React.useRef(() => {
    });
    const unmountInlineRoot = React.useCallback((entryId) => {
      const root = reactRootsRef.current.get(entryId);
      if (!root) return;
      reactRootsRef.current.delete(entryId);
      root.unmount();
    }, []);
    const syncInlineStackDepth = React.useCallback(() => {
      var _a;
      const depth = ((_a = inlineStackRef.current) == null ? void 0 : _a.getDepth()) ?? 0;
      inlineStackDepthRef.current = depth;
      setInlineStackDepth(depth);
    }, []);
    const closeAllInlinePanels = React.useCallback(() => {
      const stack = inlineStackRef.current;
      if (!stack || stack.getDepth() === 0) return;
      for (const entry of stack.getEntries()) {
        unmountInlineRoot(entry.id);
      }
      stack.popAll();
      syncInlineStackDepth();
    }, [unmountInlineRoot, syncInlineStackDepth]);
    const popInlinePanel = React.useCallback(
      (via) => {
        var _a;
        const stack = inlineStackRef.current;
        if (!stack || stack.getDepth() === 0) return false;
        const top = stack.getTop();
        if (!top) return false;
        if (via === "default" && ((_a = top.onClose) == null ? void 0 : _a.call(top)) === false) {
          return false;
        }
        const entryId = top.id;
        unmountInlineRoot(entryId);
        if (stack.pop({ via })) {
          syncInlineStackDepth();
          return true;
        }
        return false;
      },
      [unmountInlineRoot, syncInlineStackDepth]
    );
    const closeInlinePanel = React.useCallback(() => {
      popInlinePanel("default");
    }, [popInlinePanel]);
    const popInlinePanelBack = React.useCallback(() => {
      popInlinePanel("back");
    }, [popInlinePanel]);
    const renderInlinePopoverLayer = React.useCallback(
      (config, onPopLayer, onBackLayer) => {
        const popConfig = config;
        const hasBackButton = popConfig.hasBackButton !== false;
        const showClose = popConfig.isClosable !== false;
        return /* @__PURE__ */ jsxRuntime.jsx(
          Popover.ArvoPopover,
          {
            isInline: true,
            variant: "edge",
            title: popConfig.title,
            hasHeader: !!(popConfig.title || hasBackButton || showClose),
            isClosable: showClose,
            hasBackButton,
            width: popConfig.width,
            onBack: onBackLayer,
            onClose: onPopLayer,
            actions: popConfig.actions,
            isOpen: true,
            isInteractive: true,
            children: popConfig.content
          }
        );
      },
      []
    );
    const renderInlineHybridLayer = React.useCallback(
      (config, onPopLayer, onBackLayer) => {
        return /* @__PURE__ */ jsxRuntime.jsx(
          HybridPopover.ArvoHybridPopover,
          {
            isInline: true,
            parent: menuId,
            title: config.title,
            items: config.items ?? [],
            variant: config.variant,
            hasBackButton: config.hasBackButton !== false,
            width: config.width,
            height: config.height,
            isClosable: true,
            isOpen: true,
            onBack: onBackLayer,
            onClose: onPopLayer
          }
        );
      },
      [menuId]
    );
    const pushInlineLayer = React.useCallback(
      (kind, config, openedFrom) => {
        const stack = inlineStackRef.current;
        if (!stack) return;
        const entryId = nextInlineEntryId();
        const host = document.createElement("div");
        if (kind === "popover") {
          const popHeight = config.height;
          if (popHeight != null) {
            host.style.setProperty(
              "--arvo-popover-height",
              typeof popHeight === "number" ? `${popHeight}px` : popHeight
            );
          }
        }
        const root = client.clientExports.createRoot(host);
        reactRootsRef.current.set(entryId, root);
        const onPopLayer = () => {
          closeInlinePanel();
        };
        const onBackLayer = () => {
          popInlinePanelBack();
        };
        root.render(
          kind === "popover" ? renderInlinePopoverLayer(
            config,
            onPopLayer,
            onBackLayer
          ) : renderInlineHybridLayer(
            config,
            onPopLayer,
            onBackLayer
          )
        );
        const pushed = stack.push({
          id: entryId,
          kind,
          element: host,
          openedFrom,
          onOpen: () => {
            var _a;
            return ((_a = config.onOpen) == null ? void 0 : _a.call(config)) === false ? false : void 0;
          },
          onBack: () => {
            var _a;
            return (_a = config.onBack) == null ? void 0 : _a.call(config);
          },
          onClose: () => {
            var _a;
            return ((_a = config.onClose) == null ? void 0 : _a.call(config)) === false ? false : void 0;
          }
        });
        if (!pushed) {
          unmountInlineRoot(entryId);
          return;
        }
        syncInlineStackDepth();
      },
      [
        closeInlinePanel,
        popInlinePanelBack,
        renderInlineHybridLayer,
        renderInlinePopoverLayer,
        syncInlineStackDepth,
        unmountInlineRoot
      ]
    );
    const openInlinePanel = React.useCallback(
      (config, sourceItem) => {
        pushInlineLayer(
          "popover",
          config,
          itemRefsMap.current.get(sourceItem.id) ?? null
        );
      },
      [pushInlineLayer]
    );
    const openInlineHybridPanel = React.useCallback(
      (config, sourceItem) => {
        pushInlineLayer(
          "hybrid",
          config,
          itemRefsMap.current.get(sourceItem.id) ?? null
        );
      },
      [pushInlineLayer]
    );
    const surfaceOnClose = React.useCallback(() => {
      if (closeReasonRef.current === "programmatic") {
        return void 0;
      }
      setFilterQuery("");
      closeAllInlinePanels();
      setOpenSubmenuId(null);
      return void 0;
    }, [closeAllInlinePanels]);
    const getOrderedElements = React.useCallback(
      () => {
        const selector = 'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), select:not([tabindex="-1"]), textarea:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';
        const stack = inlineStackRef.current;
        if (stack && stack.getDepth() > 0) {
          const top = stack.getTop();
          if (top == null ? void 0 : top.element) {
            return Array.from(
              top.element.querySelectorAll(selector)
            );
          }
        }
        if (!panelRef.current) return [];
        return Array.from(
          panelRef.current.querySelectorAll(selector)
        );
      },
      []
    );
    const {
      isOpen,
      isMounted,
      positioned,
      surfaceId,
      panelStyle: enginePanelStyle,
      panelSide,
      open: surfaceOpen,
      close: surfaceClose,
      reposition: surfaceReposition
    } = useOverlaySurface.useOverlaySurface({
      type: "action-menu",
      priority: 15,
      triggerRef,
      panelRef,
      isOpen: openProp,
      defaultOpen,
      onOpenChange,
      onClose: surfaceOnClose,
      placement,
      gap: 4,
      width: menuWidth ?? void 0,
      focus: "trap",
      initialFocus: "none",
      getOrderedElements,
      transition: "fade",
      haspopup: "menu",
      controlsId: menuId,
      // ActionMenu owns Escape so it can pop inline panel layers and clear
      // search filters before falling back to closing the menu. The engine
      // still owns outside-click dismissal.
      closeOnEscape: false,
      // The engine emits `--arvo-overlay-*` style vars, but ActionMenu
      // wants its own panel CSS (the panel id and inline `maxHeight`
      // computed-from-position style). We build `panelStyle` from
      // `enginePanelStyle` + the menu's extras.
      emitStyle: true,
      // Filtering and dynamic item updates resize the panel; without the
      // lock, the watcher's `'float-size'` callback could re-resolve to a
      // different side once the smaller content suddenly fits the
      // originally-rejected placement, flipping the panel mid-keystroke.
      // Anchor / scroll / window-resize events still re-resolve normally
      // so the world-around-the-menu case is unaffected.
      lockPlacementOnFloatResize: true
    });
    const handleOpen = React.useCallback(() => {
      var _a;
      if (isOpen || isDisabled) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const event = new CustomEvent("action-menu:open", {
        bubbles: true,
        cancelable: true
      });
      const dispatched = ((_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(event)) ?? true;
      if (!dispatched) return;
      surfaceOpen();
    }, [isOpen, isDisabled, onOpen, surfaceOpen, triggerRef]);
    const handleClose = React.useCallback(() => {
      var _a;
      if (!isOpen) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const event = new CustomEvent("action-menu:close", {
        bubbles: true,
        cancelable: true
      });
      const dispatched = ((_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(event)) ?? true;
      if (!dispatched) return;
      setFilterQuery("");
      closeAllInlinePanels();
      setOpenSubmenuId(null);
      closeReasonRef.current = "programmatic";
      surfaceClose();
      queueMicrotask(() => {
        closeReasonRef.current = null;
      });
    }, [isOpen, onClose, surfaceClose, closeAllInlinePanels, triggerRef]);
    handleCloseRef.current = handleClose;
    const toggleOpen = React.useCallback(
      (force) => {
        const next = force !== void 0 ? force : !isOpen;
        if (next) handleOpen();
        else handleClose();
      },
      [isOpen, handleOpen, handleClose]
    );
    React.useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
        close: handleClose,
        toggle: toggleOpen,
        isOpen: () => isOpen,
        getPanelElement: () => panelRef.current
      }),
      [handleOpen, handleClose, toggleOpen, isOpen]
    );
    React.useEffect(() => {
      if (!isMounted || !panelRef.current) return;
      const stack = core.createInlinePanelStack({
        host: panelRef.current,
        containerClass: "arvo-action-menu__inline-panel"
      });
      inlineStackRef.current = stack;
      return () => {
        for (const entry of stack.getEntries()) {
          unmountInlineRoot(entry.id);
        }
        stack.destroy();
        inlineStackRef.current = null;
        inlineStackDepthRef.current = 0;
        setInlineStackDepth(0);
      };
    }, [isMounted, unmountInlineRoot]);
    const searchFocused = React.useRef(false);
    const keyboardActiveRef = React.useRef(false);
    const handleItemSelect = React.useCallback(
      (item, index) => {
        var _a, _b, _c;
        const menuItem = item;
        if (menuItem.isDisabled) return;
        if (menuItem.submenu) {
          setOpenSubmenuId(menuItem.id);
          return;
        }
        if (menuItem.inlineHybridPopover) {
          openInlineHybridPanel(menuItem.inlineHybridPopover, menuItem);
          return;
        }
        if (menuItem.inlinePopover) {
          openInlinePanel(menuItem.inlinePopover, menuItem);
          return;
        }
        if (menuItem.switch) {
          const next = !menuItem.switch.checked;
          (_b = (_a = menuItem.switch).onChange) == null ? void 0 : _b.call(_a, next, menuItem);
          return;
        }
        const event = new CustomEvent("action-menu:select", {
          bubbles: true,
          cancelable: true,
          detail: { item: menuItem, index }
        });
        const dispatched = ((_c = triggerRef.current) == null ? void 0 : _c.dispatchEvent(event)) ?? true;
        const result = onSelect == null ? void 0 : onSelect(menuItem, index);
        if (result !== false && closeOnSelect && dispatched) {
          handleClose();
        }
      },
      [
        onSelect,
        closeOnSelect,
        handleClose,
        openInlinePanel,
        openInlineHybridPanel,
        triggerRef
      ]
    );
    const scrollToIndex = React.useCallback(
      (index) => {
        var _a;
        keyboardActiveRef.current = true;
        const el = (_a = scrollRef.current) == null ? void 0 : _a.querySelector(
          `[data-index="${index}"]`
        );
        if (!el) return;
        el.scrollIntoView({ block: "nearest" });
        if (!searchFocused.current) {
          el.focus({ preventScroll: true });
        }
      },
      []
    );
    const { activeIndex, setActiveIndex, handleKeyDown: navKeyDown } = useListNavigation.useListNavigation({
      items: flatItems,
      onSelect: handleItemSelect,
      onEscape: () => {
        if (inlineStackDepthRef.current > 0) {
          closeInlinePanel();
        } else {
          handleClose();
        }
      },
      wrap: true,
      typeAhead: !searchCfg,
      enabled: isOpen && positioned && !isLoading && !searchFocused.current && inlineStackDepth === 0,
      scrollToIndex
    });
    React.useEffect(() => {
      if (isOpen) {
        keyboardActiveRef.current = false;
        setActiveIndex(0);
      }
    }, [isOpen, flatItems, setActiveIndex]);
    React.useEffect(() => {
      if (submenuTrigger === "click" && openSubmenuId) {
        const activeItem = flatItems[activeIndex];
        if ((activeItem == null ? void 0 : activeItem.id) !== openSubmenuId) {
          setOpenSubmenuId(null);
        }
      }
    }, [activeIndex, flatItems, openSubmenuId, submenuTrigger]);
    React.useEffect(() => {
      if (!isOpen || !positioned) return;
      requestAnimationFrame(() => {
        if (searchCfg && searchWrapperRef.current) {
          const input = searchWrapperRef.current.querySelector("input");
          input == null ? void 0 : input.focus();
        }
      });
    }, [isOpen, positioned, searchCfg]);
    React.useLayoutEffect(() => {
      if (!isOpen || !positioned) return;
      surfaceReposition();
    }, [filterQuery, flatItems.length, isOpen, positioned, surfaceReposition]);
    React.useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e) => {
        var _a;
        if (e.key !== "Escape") return;
        if (openSubmenuId) return;
        if (inlineStackDepthRef.current > 0) {
          e.stopPropagation();
          closeInlinePanel();
          return;
        }
        if (searchCfg && filterQuery) {
          e.stopPropagation();
          setFilterQuery("");
          setActiveIndex(0);
          (_a = searchCfg.onClear) == null ? void 0 : _a.call(searchCfg);
          return;
        }
        e.stopPropagation();
        surfaceClose();
      };
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [
      isOpen,
      closeInlinePanel,
      openSubmenuId,
      searchCfg,
      filterQuery,
      setActiveIndex,
      surfaceClose
    ]);
    const handleItemClick = React.useCallback(
      (item, flatIndex) => {
        if (item.isDisabled || isLoading) return;
        setActiveIndex(flatIndex);
        handleItemSelect(item, flatIndex);
      },
      [isLoading, setActiveIndex, handleItemSelect]
    );
    const handleTrailingActionClick = React.useCallback(
      (action, item, e) => {
        var _a;
        e.stopPropagation();
        if (action.inlinePopover) {
          openInlinePanel(action.inlinePopover, item);
          return;
        }
        if (action.inlineHybridPopover) {
          openInlineHybridPanel(action.inlineHybridPopover, item);
          return;
        }
        const result = (_a = action.onClick) == null ? void 0 : _a.call(action, item, e);
        if (result !== false && closeOnSelect) {
          handleClose();
        }
      },
      [closeOnSelect, handleClose, openInlinePanel, openInlineHybridPanel]
    );
    const getActiveRowActionButtons = React.useCallback(() => {
      var _a;
      const row = (_a = scrollRef.current) == null ? void 0 : _a.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (!row) return [];
      return Array.from(
        row.querySelectorAll(
          ".arvo-menu-item__actions button, .arvo-menu-item__overflow button"
        )
      );
    }, [activeIndex]);
    const handlePanelKeyDown = React.useCallback(
      (e) => {
        var _a;
        if (isLoading) return;
        if (inlineStackDepth === 0 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
          const activeItem = flatItems[activeIndex];
          if (!activeItem) return;
          const actionBtns = getActiveRowActionButtons();
          const activeEl = document.activeElement;
          const focusedActionIndex = activeEl ? actionBtns.indexOf(activeEl) : -1;
          if (e.key === "ArrowRight") {
            if (activeItem.submenu) {
              e.preventDefault();
              setOpenSubmenuId(activeItem.id);
              return;
            }
            if (focusedActionIndex === -1) {
              if (actionBtns.length > 0) {
                e.preventDefault();
                actionBtns[0].focus();
              }
              return;
            }
            if (focusedActionIndex < actionBtns.length - 1) {
              e.preventDefault();
              actionBtns[focusedActionIndex + 1].focus();
            }
            return;
          }
          if (e.key === "ArrowLeft") {
            if (focusedActionIndex <= 0) {
              if (focusedActionIndex === 0) {
                e.preventDefault();
                const rowEl = (_a = scrollRef.current) == null ? void 0 : _a.querySelector(
                  `[data-index="${activeIndex}"]`
                );
                rowEl == null ? void 0 : rowEl.focus({ preventScroll: true });
              }
              return;
            }
            e.preventDefault();
            actionBtns[focusedActionIndex - 1].focus();
            return;
          }
        }
        if (e.key === "Enter" || e.key === " ") {
          const focused = document.activeElement;
          if (focused && focused.closest(
            ".arvo-menu-item__actions, .arvo-menu-item__overflow"
          )) {
            return;
          }
        }
        if (!searchFocused.current && inlineStackDepth === 0) {
          navKeyDown(e);
        }
      },
      [
        isLoading,
        navKeyDown,
        inlineStackDepth,
        flatItems,
        activeIndex,
        getActiveRowActionButtons
      ]
    );
    const handleFilterSearch = React.useCallback(
      (value) => {
        setFilterQuery(value);
        setActiveIndex(0);
      },
      [setActiveIndex]
    );
    const handleFilterClear = React.useCallback(() => {
      var _a;
      setFilterQuery("");
      setActiveIndex(0);
      (_a = searchCfg == null ? void 0 : searchCfg.onClear) == null ? void 0 : _a.call(searchCfg);
    }, [setActiveIndex, searchCfg]);
    const handleSearchFocus = React.useCallback(() => {
      searchFocused.current = true;
    }, []);
    const handleSearchBlur = React.useCallback(() => {
      searchFocused.current = false;
    }, []);
    const moveFocusToListFromSearch = React.useCallback(
      (edge) => {
        var _a;
        if (flatItems.length === 0) return;
        let target = -1;
        if (edge === "first") {
          target = flatItems.findIndex((i) => !i.isDisabled);
        } else {
          for (let i = flatItems.length - 1; i >= 0; i--) {
            if (!flatItems[i].isDisabled) {
              target = i;
              break;
            }
          }
        }
        if (target < 0) return;
        searchFocused.current = false;
        keyboardActiveRef.current = true;
        setActiveIndex(target);
        const el = (_a = scrollRef.current) == null ? void 0 : _a.querySelector(
          `[data-index="${target}"]`
        );
        if (el) {
          el.focus({ preventScroll: true });
          el.scrollIntoView({ block: "nearest" });
        }
      },
      [flatItems, setActiveIndex]
    );
    const handleSearchWrapperKeyDown = React.useCallback(
      (e) => {
        switch (e.key) {
          case "ArrowDown":
          case "Home": {
            if (flatItems.length === 0) return;
            e.preventDefault();
            e.stopPropagation();
            moveFocusToListFromSearch("first");
            return;
          }
          case "ArrowUp":
          case "End": {
            if (flatItems.length === 0) return;
            e.preventDefault();
            e.stopPropagation();
            moveFocusToListFromSearch("last");
            return;
          }
          case "Enter": {
            e.preventDefault();
            if (activeIndex < 0 || activeIndex >= flatItems.length) return;
            const item = flatItems[activeIndex];
            if (item.isDisabled) return;
            handleItemSelect(item, activeIndex);
            return;
          }
          case " ": {
            e.stopPropagation();
            return;
          }
          case "Escape": {
            e.stopPropagation();
            if (filterQuery) {
              handleFilterClear();
            } else {
              handleClose();
            }
            return;
          }
          // Tab / Shift+Tab: allow native focus traversal. The active item's
          // roving tabindex makes it the next focusable element, so Tab moves
          // focus into the list and the focus trap keeps it inside the panel.
          default:
            return;
        }
      },
      [
        moveFocusToListFromSearch,
        activeIndex,
        flatItems,
        handleItemSelect,
        filterQuery,
        handleClose,
        handleFilterClear
      ]
    );
    const panelClasses = [
      "arvo-action-menu",
      isOpen && "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const panelStyle = {
      ...enginePanelStyle ?? {},
      ...maxHeight ? {
        "--arvo-overlay-max-height": maxHeight,
        maxHeight
      } : {}
    };
    const renderTrailing = (item) => {
      var _a;
      const parts = [];
      if (item.status) {
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__status", "aria-hidden": "true" }, "status")
        );
      }
      if (item.value) {
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__meta", children: item.value }, "meta")
        );
      }
      if (item.shortcut) {
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__shortcut", children: utils.formatShortcutDisplay(item.shortcut) }, "shortcut")
        );
      }
      if (item.switch) {
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "arvo-menu-item__switch",
              onClick: (e) => e.stopPropagation(),
              ref: (node) => {
                if (!node) return;
                const input = node.querySelector(
                  "input.arvo-sw__input"
                );
                if (input) input.tabIndex = -1;
              },
              children: /* @__PURE__ */ jsxRuntime.jsx(
                Switch.default,
                {
                  isChecked: item.switch.checked,
                  isDisabled: item.isDisabled || isLoading,
                  "aria-label": item.switch.ariaLabel ?? item.label,
                  onChange: ({ isChecked }) => {
                    var _a2, _b;
                    (_b = (_a2 = item.switch) == null ? void 0 : _a2.onChange) == null ? void 0 : _b.call(_a2, isChecked, item);
                  }
                }
              )
            },
            "switch"
          )
        );
      }
      if ((_a = item.actions) == null ? void 0 : _a.length) {
        const cap = Math.max(1, actionsMaxVisible);
        const visible = item.actions.slice(0, cap);
        const overflow = item.actions.slice(cap);
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-menu-item__actions", children: visible.map((action) => /* @__PURE__ */ jsxRuntime.jsx(
            IconButton.ArvoIconButton,
            {
              icon: action.icon,
              variant: "tertiary",
              size: "sm",
              tooltip: action.ariaLabel ?? action.id,
              "aria-label": action.ariaLabel,
              isDisabled: item.isDisabled || isLoading || action.isDisabled,
              tabIndex: -1,
              onClick: (e) => handleTrailingActionClick(action, item, e)
            },
            action.id
          )) }, "actions")
        );
        if (overflow.length > 0) {
          const overflowItems = overflow.map((action) => ({
            id: action.id,
            label: action.ariaLabel ?? action.id,
            icon: action.icon,
            isDisabled: item.isDisabled || isLoading || action.isDisabled
          }));
          parts.push(
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "arvo-menu-item__overflow",
                onClick: (e) => e.stopPropagation(),
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  DropdownIconButton.default,
                  {
                    icon: "ellipsis-v",
                    tooltip: "More actions",
                    variant: "tertiary",
                    size: "sm",
                    isCompact: true,
                    isDisabled: item.isDisabled || isLoading,
                    tabIndex: -1,
                    items: overflowItems,
                    onSelect: (menuItem) => {
                      const action = overflow.find((a) => a.id === menuItem.id);
                      if (!action) return;
                      handleTrailingActionClick(
                        action,
                        item,
                        {
                          stopPropagation: () => {
                          },
                          preventDefault: () => {
                          }
                        }
                      );
                    }
                  }
                )
              },
              "overflow"
            )
          );
        }
      }
      if (item.submenu) {
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "arvo-menu-item__submenu o9con o9con-angle-right",
              "aria-hidden": "true"
            },
            "submenu"
          )
        );
      }
      if (item.href && item.target === "_blank") {
        parts.push(
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "arvo-menu-item__external o9con o9con-external-link",
              "aria-hidden": "true"
            },
            "external"
          )
        );
      }
      if (parts.length === 0) return null;
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-menu-item__trailing", children: parts });
    };
    const clearHoverTimers = React.useCallback(() => {
      if (submenuTimerRef.current) {
        clearTimeout(submenuTimerRef.current);
        submenuTimerRef.current = null;
      }
    }, []);
    const handleItemMouseEnter = React.useCallback(
      (item, flatIndex) => {
        keyboardActiveRef.current = false;
        setActiveIndex(flatIndex);
        clearHoverTimers();
        if (submenuTrigger === "hover") {
          if (item.submenu && !item.isDisabled) {
            submenuTimerRef.current = setTimeout(() => {
              setOpenSubmenuId(item.id);
            }, 200);
          } else {
            setOpenSubmenuId(null);
          }
        }
      },
      [setActiveIndex, submenuTrigger, clearHoverTimers]
    );
    const handleItemMouseLeave = React.useCallback(
      (item) => {
        if (submenuTrigger === "hover" && item.submenu) {
          if (submenuTimerRef.current) {
            clearTimeout(submenuTimerRef.current);
            submenuTimerRef.current = null;
          }
        }
      },
      [submenuTrigger]
    );
    React.useEffect(() => {
      return () => {
        clearHoverTimers();
      };
    }, [clearHoverTimers]);
    const setItemRef = React.useCallback(
      (id, node) => {
        if (node) {
          itemRefsMap.current.set(id, node);
        } else {
          itemRefsMap.current.delete(id);
        }
      },
      []
    );
    const truncationHandlesRef = React.useRef(/* @__PURE__ */ new Map());
    React.useEffect(() => {
      if (!isMounted) return void 0;
      const panel2 = panelRef.current;
      if (!panel2) return void 0;
      const liveIds = /* @__PURE__ */ new Set();
      const rows = panel2.querySelectorAll(
        '.arvo-menu-item[id^="' + menuId + '-item-"]'
      );
      rows.forEach((row) => {
        const labelEl = row.querySelector(".arvo-menu-item__lbl");
        if (!labelEl) return;
        const id = row.id;
        liveIds.add(id);
        const existing = truncationHandlesRef.current.get(id);
        if (existing && existing.rowEl === row && existing.labelEl === labelEl) {
          return;
        }
        existing == null ? void 0 : existing.destroy();
        const handle = utils.attachTitleTruncationTooltip({
          triggerElement: row,
          element: labelEl,
          content: () => labelEl.textContent ?? "",
          placement: "top-center"
        });
        truncationHandlesRef.current.set(id, {
          destroy: handle.destroy,
          rowEl: row,
          labelEl
        });
      });
      truncationHandlesRef.current.forEach((entry, id) => {
        if (!liveIds.has(id)) {
          entry.destroy();
          truncationHandlesRef.current.delete(id);
        }
      });
      return void 0;
    });
    React.useEffect(() => {
      return () => {
        truncationHandlesRef.current.forEach((entry) => entry.destroy());
        truncationHandlesRef.current.clear();
      };
    }, []);
    const renderEmptyState = () => {
      const isFilterActive = Boolean(searchCfg && filterQuery);
      const baseProps = isFilterActive ? {
        illustration: "no-results",
        title: "No results found",
        message: "Adjust your filter search query.",
        secondaryAction: {
          label: "Clear search",
          onClick: handleFilterClear
        }
      } : {
        illustration: "no-data",
        title: "No data available",
        message: "There are no items to display."
      };
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-action-menu__empty", children: /* @__PURE__ */ jsxRuntime.jsx(
        EmptyState.default,
        {
          ...baseProps,
          ...emptyConfig,
          size: "sm",
          orientation: "vertical"
        }
      ) });
    };
    const renderItem = (item, flatIndex) => {
      var _a;
      const isKeyboardActive = flatIndex === activeIndex && (keyboardActiveRef.current || searchFocused.current);
      const status = resolveStatus(item.status);
      if (process.env.NODE_ENV !== "production") {
        const hasInline = !!(item.inlinePopover || item.inlineHybridPopover);
        if (item.submenu && hasInline) {
          console.warn(
            `[ArvoActionMenu] Item "${item.id}" has both submenu and an inline panel; the inline panel will be ignored.`
          );
        }
        if (item.href && hasInline) {
          console.warn(
            `[ArvoActionMenu] Item "${item.id}" has both href and an inline panel; the inline panel will be ignored.`
          );
        }
      }
      const itemClasses = [
        "arvo-menu-item",
        item.secondaryLabel && "arvo-menu-item--multi-line",
        item.destructive && "arvo-menu-item--destructive",
        status.modifier,
        actionsVisibility === "hover" && ((_a = item.actions) == null ? void 0 : _a.length) && "arvo-menu-item--actions-on-hover",
        item.isDisabled && "is-disabled",
        isKeyboardActive && "focused",
        item.active && "active"
      ].filter(Boolean).join(" ");
      const submenuOpen = item.submenu && openSubmenuId === item.id;
      const matchSplit = searchCfg && filterQuery ? splitLabelForMatch(item.label, filterQuery) : null;
      const labelNode = matchSplit ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        matchSplit.before,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__match", children: matchSplit.match }),
        matchSplit.after
      ] }) : item.label;
      const isExternal = !!item.href && item.target === "_blank";
      const ariaLabelForAnchor = isExternal ? `${item.label}, opens in a new window` : void 0;
      const commonRowProps = {
        id: `${menuId}-item-${flatIndex}`,
        ref: (node) => setItemRef(item.id, node),
        className: itemClasses,
        role: "menuitem",
        "aria-disabled": item.isDisabled || void 0,
        "aria-haspopup": item.submenu ? "menu" : void 0,
        "aria-expanded": item.submenu ? !!submenuOpen : void 0,
        "aria-label": ariaLabelForAnchor,
        tabIndex: flatIndex === activeIndex ? 0 : -1,
        "data-index": flatIndex,
        style: status.style ?? void 0,
        onClick: () => handleItemClick(item, flatIndex),
        onMouseEnter: () => handleItemMouseEnter(item, flatIndex),
        onMouseLeave: () => handleItemMouseLeave(item)
      };
      const innerContent = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        item.icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: `arvo-menu-item__ico o9con o9con-${item.icon}`, "aria-hidden": "true" }),
        item.avatar && /* @__PURE__ */ jsxRuntime.jsx(
          "img",
          {
            className: "arvo-menu-item__avatar",
            src: item.avatar,
            alt: ""
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-menu-item__txt", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__lbl", children: labelNode }),
          item.secondaryLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-menu-item__secondary", children: item.secondaryLabel })
        ] }),
        renderTrailing(item)
      ] });
      const useAnchor = !!item.href && !item.inlinePopover && !item.inlineHybridPopover && !item.submenu;
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { position: "relative" }, children: [
        useAnchor ? /* @__PURE__ */ jsxRuntime.jsx(
          "a",
          {
            ...commonRowProps,
            ref: commonRowProps.ref,
            href: item.href,
            target: item.target ?? "_self",
            rel: item.target === "_blank" ? "noopener noreferrer" : void 0,
            children: innerContent
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            ...commonRowProps,
            ref: commonRowProps.ref,
            children: innerContent
          }
        ),
        submenuOpen && /* @__PURE__ */ jsxRuntime.jsx(
          SubmenuPanel,
          {
            items: item.submenu,
            closeOnSelect,
            parentId: surfaceId,
            onClose: () => {
              setOpenSubmenuId(null);
              const parentEl = itemRefsMap.current.get(item.id);
              parentEl == null ? void 0 : parentEl.focus({ preventScroll: true });
            },
            onCloseAll: handleClose,
            onSelect: (subItem, subIndex) => {
              const result = onSelect == null ? void 0 : onSelect(subItem, subIndex);
              if (result !== false && closeOnSelect) handleClose();
              return false;
            },
            anchorRef: { current: itemRefsMap.current.get(item.id) ?? null },
            submenuWidth
          }
        )
      ] }, item.id);
    };
    const renderContent = () => {
      if (isLoading) {
        return /* @__PURE__ */ jsxRuntime.jsx(MenuSkeleton, {});
      }
      if (flatItems.length === 0) {
        return renderEmptyState();
      }
      if (isGrouped(filteredItems)) {
        let flatIndex = 0;
        return filteredItems.map(
          (group, groupIdx) => /* @__PURE__ */ jsxRuntime.jsxs("div", { role: "group", "aria-label": group.label, children: [
            groupIdx > 0 && hasGroupDividers && /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: "arvo-action-menu__divider",
                role: "separator"
              }
            ),
            group.label && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-action-menu__hdr", children: group.label }),
            group.items.map((item) => {
              const node = renderItem(item, flatIndex);
              flatIndex++;
              return node;
            })
          ] }, group.id)
        );
      }
      return filteredItems.map(
        (item, i) => renderItem(item, i)
      );
    };
    const clonedTrigger = (() => {
      if (!trigger || !React.isValidElement(trigger)) return trigger ?? null;
      const triggerEl = trigger;
      const triggerProps = triggerEl.props;
      const isHostElement = typeof triggerEl.type === "string";
      const overrides = {};
      if (!triggerRefProp) {
        overrides.ref = (node) => {
          internalTriggerRef.current = node;
          const originalRef = triggerEl.ref;
          if (typeof originalRef === "function") {
            originalRef(node);
          } else if (originalRef && typeof originalRef === "object") {
            originalRef.current = node;
          }
        };
      }
      const consumerOnClick = triggerProps.onClick;
      overrides.onClick = (e) => {
        consumerOnClick == null ? void 0 : consumerOnClick(e);
        if (e.defaultPrevented) return;
        toggleOpen();
      };
      if (isHostElement) {
        overrides.disabled = isDisabled || triggerProps.disabled || triggerProps.isDisabled;
      } else {
        overrides.isDisabled = isDisabled || triggerProps.isDisabled;
      }
      return React.cloneElement(triggerEl, overrides);
    })();
    const activeDescendantId = activeIndex >= 0 && activeIndex < flatItems.length ? `${menuId}-item-${activeIndex}` : void 0;
    const panel = isMounted ? require$$0.createPortal(
      /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: panelRef,
          id: menuId,
          className: panelClasses,
          role: "menu",
          "aria-busy": isLoading || void 0,
          "aria-activedescendant": activeDescendantId,
          tabIndex: -1,
          "data-arvo-side": panelSide,
          style: Object.keys(panelStyle).length > 0 ? panelStyle : void 0,
          onKeyDown: handlePanelKeyDown,
          children: [
            searchCfg && !isLoading && (flatItems.length > 0 || !!filterQuery) && /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                ref: searchWrapperRef,
                className: [
                  "arvo-action-menu__search",
                  searchCfg.className
                ].filter(Boolean).join(" "),
                onKeyDown: handleSearchWrapperKeyDown,
                role: "combobox",
                "aria-haspopup": "menu",
                "aria-expanded": true,
                "aria-controls": `${menuId}-list`,
                "aria-activedescendant": activeDescendantId,
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  Search.default,
                  {
                    variant: "filter",
                    value: filterQuery,
                    placeholder: searchCfg.placeholder,
                    searchMode: searchCfg.searchMode,
                    minChars: searchCfg.minChars,
                    isClearable: searchCfg.isClearable,
                    shortcut: searchCfg.shortcut,
                    errorMsg: searchCfg.errorMsg,
                    errorDisplay: "tooltip",
                    counter: searchCfg.counter && filterQuery ? { current: flatItems.length, total: totalItemCount } : null,
                    onSearch: handleFilterSearch,
                    onClear: handleFilterClear,
                    onFocus: handleSearchFocus,
                    onBlur: handleSearchBlur,
                    isDisabled,
                    "aria-label": "Filter menu items"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                id: `${menuId}-list`,
                ref: scrollRef,
                className: "arvo-action-menu__scroll",
                children: renderContent()
              }
            )
          ]
        }
      ),
      document.body
    ) : null;
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      clonedTrigger,
      panel
    ] });
  }
);
exports.ArvoActionMenu = ArvoActionMenu;
exports.default = ArvoActionMenu;
//# sourceMappingURL=index49.cjs.map
