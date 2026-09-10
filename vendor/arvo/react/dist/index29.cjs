"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const Popover = require("./index27.cjs");
const Search = require("./index51.cjs");
const DropdownIconButton = require("./index60.cjs");
const Checkbox = require("./index23.cjs");
const TreeView = require("./index68.cjs");
const EmptyState = require("./index88.cjs");
const DD_TREE_MIN_WIDTH = 270;
const DD_TREE_DEFAULT_WIDTH = 362;
const DD_TREE_MAX_WIDTH = 700;
const DD_TREE_MIN_HEIGHT = 272;
const SKELETON_ROW_COUNT = 6;
const NO_RESULTS_TITLE = "No results found";
const NO_RESULTS_MESSAGE = "Try adjusting your search query.";
const CLEAR_SEARCH_LABEL = "Clear Search";
const NO_DATA_DEFAULT = {
  illustration: "no-data",
  title: "No data available",
  message: "There are no items to display."
};
const HEADER_ACTIONS_MAX = 4;
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function collectAllEligibleIds(items) {
  const ids = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isDisabled) continue;
      ids.push(node.id);
      if (Array.isArray(node.children)) walk(node.children);
    }
  }
  walk(items);
  return ids;
}
function filterTreeByQuery(items, query) {
  const trimmed = query.trim();
  if (!trimmed) return { items, expanded: [] };
  const needle = trimmed.toLowerCase();
  const expanded = [];
  function walk(node) {
    const labelMatches = node.label.toLowerCase().includes(needle);
    const children = Array.isArray(node.children) ? node.children : null;
    if (children && children.length > 0) {
      const filteredChildren = [];
      for (const child of children) {
        const kept = walk(child);
        if (kept) filteredChildren.push(kept);
      }
      if (filteredChildren.length > 0) {
        expanded.push(node.id);
        return { ...node, children: filteredChildren };
      }
      return labelMatches ? { ...node, children } : null;
    }
    return labelMatches ? node : null;
  }
  const filtered = [];
  for (const root of items) {
    const kept = walk(root);
    if (kept) filtered.push(kept);
  }
  return { items: filtered, expanded };
}
const ArvoDropdownTree = React.forwardRef(
  function ArvoDropdownTree2(props, ref) {
    const {
      items = [],
      sections,
      selectionMode = "multiple",
      size = "sm",
      appearance = "default",
      selectedIds: selectedIdsProp,
      defaultSelectedIds,
      expandedIds: expandedIdsProp,
      defaultExpandedIds,
      onSelectionChange,
      onExpandedChange,
      searchQuery: searchQueryProp,
      onSearchChange,
      search = { placeholder: "Search" },
      filter = { icon: "filter", tooltip: "Filter" },
      emptyConfig,
      hasGlobalSelectAll = false,
      isResizable = true,
      width = DD_TREE_DEFAULT_WIDTH,
      height = null,
      onResize,
      onResizeCommit,
      title,
      hasHeader = true,
      isClosable = true,
      hasBackButton = false,
      onBack,
      headerActions,
      placement = "auto",
      offset = 4,
      closeOnOutside = true,
      actions,
      isLoading: isLoadingProp = false,
      isOpen: openProp,
      defaultOpen = false,
      onOpenChange,
      onOpen,
      onClose,
      triggerRef,
      renderTrigger,
      popoverProps,
      treeProps,
      commitOn = "apply",
      onApply,
      onCancel,
      onReset,
      className
      // style is accepted by the public Props interface for parity but the
      // popover's panel currently owns its own inline style; the prop is
      // declared so future direct-style forwarding stays additive.
    } = props;
    const uid = React.useId();
    const panelId = `arvo-dd-tree-${uid}`;
    const internalTriggerRef = React.useRef(null);
    const effectiveTriggerRef = triggerRef ?? internalTriggerRef;
    const wrappedRenderTrigger = React.useMemo(() => {
      if (!renderTrigger) return void 0;
      return (renderProps) => renderTrigger({ ...renderProps, ref: effectiveTriggerRef });
    }, [renderTrigger, effectiveTriggerRef]);
    const lastWarnedRef = React.useRef(false);
    React.useEffect(() => {
      if (sections !== void 0 && sections.length > 0 && !lastWarnedRef.current) {
        lastWarnedRef.current = true;
        console.warn(
          "ArvoDropdownTree: `sections` is reserved for a follow-up release and is ignored in this build. The dropdown renders the flat `items` prop instead."
        );
      }
    }, [sections]);
    const headerWarnedRef = React.useRef(false);
    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if (headerWarnedRef.current) return;
      const closeCount = isClosable === false ? 0 : 1;
      const headerCount = ((headerActions == null ? void 0 : headerActions.length) ?? 0) + closeCount;
      if (headerCount > HEADER_ACTIONS_MAX) {
        headerWarnedRef.current = true;
        console.warn(
          `ArvoDropdownTree: header has ${headerCount} actions (including the close X) -- the spec allows a maximum of ${HEADER_ACTIONS_MAX}. Consider moving overflow into the body or footer.`
        );
      }
    }, [headerActions, isClosable]);
    const isControlledOpen = openProp !== void 0 && openProp !== null;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = isControlledOpen ? !!openProp : internalOpen;
    const setOpen = React.useCallback(
      (next) => {
        if (!isControlledOpen) setInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [isControlledOpen, onOpenChange]
    );
    const handleOpen = React.useCallback(() => {
      if (isOpen) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      setOpen(true);
    }, [isOpen, onOpen, setOpen]);
    const handleClose = React.useCallback(() => {
      if (!isOpen) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      setOpen(false);
    }, [isOpen, onClose, setOpen]);
    const handleToggle = React.useCallback(() => {
      if (isOpen) handleClose();
      else handleOpen();
    }, [isOpen, handleOpen, handleClose]);
    const [internalLoading, setInternalLoading] = React.useState(isLoadingProp === true);
    React.useEffect(() => {
      setInternalLoading(isLoadingProp === true);
    }, [isLoadingProp]);
    const isLoading = internalLoading;
    const [internalItems, setInternalItems] = React.useState(items);
    React.useEffect(() => {
      setInternalItems(items);
    }, [items]);
    const treeItems = internalItems;
    const isControlledQuery = searchQueryProp !== void 0;
    const [internalQuery, setInternalQuery] = React.useState(searchQueryProp ?? "");
    const query = isControlledQuery ? searchQueryProp ?? "" : internalQuery;
    const handleSearchInput = React.useCallback(
      (value) => {
        if (!isControlledQuery) setInternalQuery(value);
        onSearchChange == null ? void 0 : onSearchChange(value);
      },
      [isControlledQuery, onSearchChange]
    );
    const handleSearchClear = React.useCallback(() => {
      if (!isControlledQuery) setInternalQuery("");
      onSearchChange == null ? void 0 : onSearchChange("");
    }, [isControlledQuery, onSearchChange]);
    const isCommitOnApply = commitOn === "apply";
    const [shadowSelectedIds, setShadowSelectedIds] = React.useState(
      () => selectedIdsProp ?? defaultSelectedIds ?? []
    );
    const [draftSelectedIds, setDraftSelectedIds] = React.useState(
      () => selectedIdsProp ?? defaultSelectedIds ?? []
    );
    const openSnapshotRef = React.useRef(
      selectedIdsProp ?? defaultSelectedIds ?? []
    );
    React.useEffect(() => {
      if (selectedIdsProp !== void 0) {
        setShadowSelectedIds(selectedIdsProp);
        if (!isCommitOnApply) {
          setDraftSelectedIds(selectedIdsProp);
        }
      }
    }, [isCommitOnApply, selectedIdsProp]);
    const prevOpenRef = React.useRef(false);
    React.useEffect(() => {
      if (isOpen && !prevOpenRef.current) {
        const snapshot = selectedIdsProp ?? shadowSelectedIds;
        openSnapshotRef.current = snapshot;
        setDraftSelectedIds(snapshot);
      }
      prevOpenRef.current = isOpen;
    }, [isOpen, selectedIdsProp, shadowSelectedIds]);
    const [shadowExpandedIds, setShadowExpandedIds] = React.useState(
      () => expandedIdsProp ?? defaultExpandedIds ?? []
    );
    React.useEffect(() => {
      if (expandedIdsProp !== void 0) {
        setShadowExpandedIds(expandedIdsProp);
      }
    }, [expandedIdsProp]);
    const handleTreeSelectionChange = React.useCallback(
      (ids, ctx) => {
        var _a;
        setDraftSelectedIds(ids);
        if (!isCommitOnApply) {
          setShadowSelectedIds(ids);
          onSelectionChange == null ? void 0 : onSelectionChange(ids, ctx);
          (_a = effectiveTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
            new CustomEvent("dd-tree:change", {
              bubbles: true,
              detail: { ids, item: ctx.item, isSelected: ctx.isSelected }
            })
          );
        }
      },
      [effectiveTriggerRef, isCommitOnApply, onSelectionChange]
    );
    const handleTreeExpandedChange = React.useCallback(
      (ids, ctx) => {
        setShadowExpandedIds(ids);
        onExpandedChange == null ? void 0 : onExpandedChange(ids, ctx);
      },
      [onExpandedChange]
    );
    const handleReset = React.useCallback(() => {
      var _a;
      setDraftSelectedIds([]);
      if (!isCommitOnApply) setShadowSelectedIds([]);
      onReset == null ? void 0 : onReset();
      (_a = effectiveTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("dd-tree:reset", { bubbles: true })
      );
    }, [effectiveTriggerRef, isCommitOnApply, onReset]);
    const handleCancel = React.useCallback(() => {
      var _a;
      setDraftSelectedIds(openSnapshotRef.current);
      onCancel == null ? void 0 : onCancel();
      (_a = effectiveTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("dd-tree:cancel", { bubbles: true })
      );
      handleClose();
    }, [effectiveTriggerRef, onCancel, handleClose]);
    const handleApply = React.useCallback(() => {
      var _a;
      const ids = draftSelectedIds;
      const result = onApply == null ? void 0 : onApply(ids);
      if (result === false) return false;
      if (isCommitOnApply) {
        setShadowSelectedIds(ids);
        onSelectionChange == null ? void 0 : onSelectionChange(ids, {
          // We cannot attribute the commit to a single triggering
          // item -- the Apply button is the trigger. Pass the first
          // item in the draft for a sensible default context.
          item: { id: ids[0] ?? "", label: "" },
          isSelected: true
        });
      }
      (_a = effectiveTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("dd-tree:apply", {
          bubbles: true,
          detail: { ids }
        })
      );
      handleClose();
      return void 0;
    }, [
      draftSelectedIds,
      effectiveTriggerRef,
      handleClose,
      isCommitOnApply,
      onApply,
      onSelectionChange
    ]);
    const builtActions = React.useMemo(() => {
      if (actions === false) return void 0;
      if (actions) return actions;
      if (isLoading) return void 0;
      return [
        {
          id: "reset",
          label: "Reset",
          variant: "tertiary",
          action: () => {
            handleReset();
            return false;
          }
        },
        {
          id: "cancel",
          label: "Cancel",
          variant: "secondary",
          action: () => {
            handleCancel();
            return false;
          }
        },
        {
          id: "apply",
          label: "Apply",
          variant: "primary",
          action: () => {
            const r = handleApply();
            return r;
          }
        }
      ];
    }, [actions, isLoading, handleReset, handleCancel, handleApply]);
    const panelRef = React.useRef(null);
    const resizeRef = React.useRef(null);
    const [resizedWidth, setResizedWidth] = React.useState(
      () => clamp(width, DD_TREE_MIN_WIDTH, DD_TREE_MAX_WIDTH)
    );
    const [resizedHeight, setResizedHeight] = React.useState(height);
    const lastWidthPropRef = React.useRef(width);
    const lastHeightPropRef = React.useRef(height);
    React.useEffect(() => {
      if (width !== lastWidthPropRef.current) {
        lastWidthPropRef.current = width;
        setResizedWidth(clamp(width, DD_TREE_MIN_WIDTH, DD_TREE_MAX_WIDTH));
      }
    }, [width]);
    React.useEffect(() => {
      if (height !== lastHeightPropRef.current) {
        lastHeightPropRef.current = height;
        setResizedHeight(height);
      }
    }, [height]);
    React.useLayoutEffect(() => {
      var _a;
      const panel = (_a = panelRef.current) == null ? void 0 : _a.element;
      if (!panel || !isOpen) return;
      if (resizedHeight != null) {
        const maxH = Math.floor(window.innerHeight * 0.9);
        panel.style.height = `${clamp(resizedHeight, DD_TREE_MIN_HEIGHT, maxH)}px`;
      } else {
        panel.style.removeProperty("height");
      }
    }, [isOpen, resizedHeight]);
    React.useEffect(() => {
      var _a;
      if (!isOpen || !isResizable) return;
      const panel = (_a = panelRef.current) == null ? void 0 : _a.element;
      if (!panel) return;
      const handle = core.createResizeHandle(panel, {
        corners: ["bottom-left", "bottom-right"],
        min: { width: DD_TREE_MIN_WIDTH, height: DD_TREE_MIN_HEIGHT },
        max: (rect) => ({
          width: Math.max(
            DD_TREE_MIN_WIDTH,
            Math.min(DD_TREE_MAX_WIDTH, window.innerWidth - rect.left - 16)
          ),
          height: Math.max(
            DD_TREE_MIN_HEIGHT,
            Math.min(
              Math.floor(window.innerHeight * 0.9),
              window.innerHeight - rect.top - 16
            )
          )
        }),
        viewportPadding: 16,
        onResize: (rect) => {
          setResizedWidth(rect.width);
          setResizedHeight(rect.height);
          onResize == null ? void 0 : onResize(rect);
        },
        onCommit: (rect) => {
          setResizedWidth(rect.width);
          setResizedHeight(rect.height);
          onResizeCommit == null ? void 0 : onResizeCommit(rect);
        }
      });
      handle.mount();
      resizeRef.current = handle;
      return () => {
        handle.destroy();
        resizeRef.current = null;
      };
    }, [isOpen, isResizable, onResize, onResizeCommit]);
    const searchHostRef = React.useRef(null);
    const treeHandleRef = React.useRef(null);
    const searchEnabled = search !== false;
    React.useEffect(() => {
      if (!isOpen) return;
      const raf = requestAnimationFrame(() => {
        var _a, _b, _c;
        if (searchEnabled) {
          const input = (_a = searchHostRef.current) == null ? void 0 : _a.querySelector(
            "input, textarea"
          );
          input == null ? void 0 : input.focus();
          return;
        }
        const panel = (_b = panelRef.current) == null ? void 0 : _b.element;
        const firstRow = panel == null ? void 0 : panel.querySelector(
          '[role="treeitem"]:not([aria-disabled="true"])'
        );
        if (firstRow) {
          const treeitemId = firstRow.id;
          const itemId = (_c = treeitemId.match(/-row-(.+)$/)) == null ? void 0 : _c[1];
          if (itemId && treeHandleRef.current) {
            treeHandleRef.current.focusItem(itemId);
          } else {
            firstRow.focus();
          }
        }
      });
      return () => cancelAnimationFrame(raf);
    }, [isOpen, searchEnabled]);
    const allEligibleIds = React.useMemo(
      () => collectAllEligibleIds(treeItems),
      [treeItems]
    );
    const selectAllState = React.useMemo(() => {
      if (allEligibleIds.length === 0) return "none";
      const draftSet = new Set(draftSelectedIds);
      let count = 0;
      for (const id of allEligibleIds) if (draftSet.has(id)) count += 1;
      if (count === 0) return "none";
      if (count === allEligibleIds.length) return "all";
      return "some";
    }, [allEligibleIds, draftSelectedIds]);
    const handleSelectAllToggle = React.useCallback(() => {
      var _a;
      const next = selectAllState === "all" ? [] : [...allEligibleIds];
      setDraftSelectedIds(next);
      if (!isCommitOnApply) {
        setShadowSelectedIds(next);
        onSelectionChange == null ? void 0 : onSelectionChange(next, {
          item: treeItems[0] ?? { id: "", label: "" },
          isSelected: selectAllState !== "all"
        });
        (_a = effectiveTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("dd-tree:change", {
            bubbles: true,
            detail: {
              ids: next,
              item: treeItems[0],
              isSelected: selectAllState !== "all"
            }
          })
        );
      }
    }, [
      allEligibleIds,
      effectiveTriggerRef,
      isCommitOnApply,
      onSelectionChange,
      selectAllState,
      treeItems
    ]);
    const renderStickyHeader = () => {
      if (isLoading) return null;
      const showSearch = searchEnabled;
      const showFilter = filter !== false;
      const showSelectAll = hasGlobalSelectAll && selectionMode === "multiple" && treeItems.length > 0;
      if (!showSearch && !showFilter && !showSelectAll) return null;
      const searchCfg = showSearch && typeof search === "object" ? search : {};
      const filterCfg = showFilter && typeof filter === "object" ? filter : {};
      const filterIcon = filterCfg.icon ?? "filter";
      const filterTooltip = filterCfg.tooltip ?? "Filter";
      const filterItems = filterCfg.items ?? [];
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-dd-tree__sticky", children: [
        (showSearch || showFilter) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-dd-tree__search", children: [
          showSearch && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__search-input", ref: searchHostRef, children: /* @__PURE__ */ jsxRuntime.jsx(
            Search.default,
            {
              variant: "filter",
              value: query,
              placeholder: searchCfg.placeholder ?? "Search",
              shortcut: searchCfg.shortcut,
              onSearch: handleSearchInput,
              onChange: handleSearchInput,
              onClear: handleSearchClear,
              isFullWidth: true,
              "aria-label": "Filter tree"
            }
          ) }),
          showFilter && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__filter", children: /* @__PURE__ */ jsxRuntime.jsx(
            DropdownIconButton.default,
            {
              icon: filterIcon,
              tooltip: filterTooltip,
              variant: "secondary",
              size: "sm",
              items: filterItems,
              onSelect: filterCfg.onSelect
            }
          ) })
        ] }),
        showSelectAll && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-dd-tree__sa", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            Checkbox.default,
            {
              isChecked: selectAllState === "all",
              isIndeterminate: selectAllState === "some",
              label: null,
              "aria-label": "Select all",
              onChange: handleSelectAllToggle
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "arvo-dd-tree__sa__lbl",
              onClick: handleSelectAllToggle,
              children: "Select all"
            }
          )
        ] })
      ] });
    };
    const trimmedQuery = query.trim();
    const isQueryActive = trimmedQuery.length > 0;
    const { items: filteredItems, expanded: queryExpandedIds } = React.useMemo(
      () => filterTreeByQuery(treeItems, trimmedQuery),
      [treeItems, trimmedQuery]
    );
    const lastSeededQueryRef = React.useRef(trimmedQuery);
    const isUncontrolledExpansion = expandedIdsProp === void 0;
    const isFreshQueryTransition = trimmedQuery !== lastSeededQueryRef.current && isQueryActive && isUncontrolledExpansion && queryExpandedIds.length > 0;
    React.useEffect(() => {
      if (trimmedQuery === lastSeededQueryRef.current) return;
      lastSeededQueryRef.current = trimmedQuery;
      if (!trimmedQuery || queryExpandedIds.length === 0) return;
      if (!isUncontrolledExpansion) return;
      setShadowExpandedIds(
        (prev) => Array.from(/* @__PURE__ */ new Set([...prev, ...queryExpandedIds]))
      );
    }, [trimmedQuery, isUncontrolledExpansion]);
    const expandedIdsForTree = expandedIdsProp ?? (isFreshQueryTransition ? Array.from(/* @__PURE__ */ new Set([...shadowExpandedIds, ...queryExpandedIds])) : shadowExpandedIds);
    const dataState = isLoading ? "loading" : treeItems.length === 0 ? "noData" : isQueryActive && filteredItems.length === 0 ? "noResults" : "data";
    const renderBody = () => {
      if (dataState === "loading") {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__body", "aria-busy": "true", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__skeleton", children: Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-dd-tree__skeleton-row", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-dd-tree__skeleton-icon", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-dd-tree__skeleton-text", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-dd-tree__skeleton-icon", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-dd-tree__skeleton-icon", "aria-hidden": "true" })
        ] }, i)) }) });
      }
      if (dataState === "noData") {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__body", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__empty", children: /* @__PURE__ */ jsxRuntime.jsx(
          EmptyState.default,
          {
            size: "sm",
            orientation: "vertical",
            illustration: (emptyConfig == null ? void 0 : emptyConfig.illustration) ?? NO_DATA_DEFAULT.illustration,
            title: (emptyConfig == null ? void 0 : emptyConfig.title) ?? NO_DATA_DEFAULT.title,
            message: (emptyConfig == null ? void 0 : emptyConfig.message) ?? NO_DATA_DEFAULT.message,
            primaryAction: (emptyConfig == null ? void 0 : emptyConfig.primaryAction) ? {
              label: emptyConfig.primaryAction.label,
              variant: emptyConfig.primaryAction.variant ?? "outline",
              onClick: emptyConfig.primaryAction.onClick
            } : void 0
          }
        ) }) });
      }
      if (dataState === "noResults") {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__body", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__empty", children: /* @__PURE__ */ jsxRuntime.jsx(
          EmptyState.default,
          {
            size: "sm",
            orientation: "vertical",
            illustration: "no-results",
            title: NO_RESULTS_TITLE,
            message: NO_RESULTS_MESSAGE,
            primaryAction: {
              label: CLEAR_SEARCH_LABEL,
              variant: "outline",
              onClick: handleSearchClear
            }
          }
        ) }) });
      }
      return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__body", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dd-tree__tree", children: /* @__PURE__ */ jsxRuntime.jsx(
        TreeView.ArvoTreeView,
        {
          ...treeProps,
          ref: treeHandleRef,
          items: filteredItems,
          variant: selectionMode === "multiple" ? "multiSelect" : "singleSelect",
          size,
          appearance,
          selectedIds: draftSelectedIds,
          defaultSelectedIds,
          expandedIds: expandedIdsForTree,
          defaultExpandedIds,
          onSelectionChange: handleTreeSelectionChange,
          onExpandedChange: handleTreeExpandedChange,
          ariaLabel: title ?? "Tree items",
          searchQuery: trimmedQuery
        }
      ) }) });
    };
    React.useImperativeHandle(
      ref,
      () => ({
        open: () => handleOpen(),
        close: () => handleClose(),
        toggle: () => handleToggle(),
        isOpen: () => isOpen,
        selected: (ids) => {
          if (ids === void 0) return shadowSelectedIds;
          setShadowSelectedIds(ids);
          setDraftSelectedIds(ids);
          return void 0;
        },
        expanded: (ids) => {
          if (ids === void 0) return shadowExpandedIds;
          setShadowExpandedIds(ids);
          return void 0;
        },
        setLoading: (loading) => setInternalLoading(loading === true),
        updateItems: (next) => setInternalItems(next),
        reposition: () => {
          var _a;
          return (_a = panelRef.current) == null ? void 0 : _a.reposition();
        }
      }),
      [
        handleOpen,
        handleClose,
        handleToggle,
        isOpen,
        shadowSelectedIds,
        shadowExpandedIds
      ]
    );
    const wasOpenRef = React.useRef(false);
    React.useEffect(() => {
      var _a, _b;
      const wasOpen = wasOpenRef.current;
      wasOpenRef.current = isOpen;
      if (isOpen && !wasOpen) {
        (_a = effectiveTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("dd-tree:open", { bubbles: true })
        );
      } else if (!isOpen && wasOpen) {
        (_b = effectiveTriggerRef.current) == null ? void 0 : _b.dispatchEvent(
          new CustomEvent("dd-tree:close", { bubbles: true })
        );
      }
    }, [isOpen, effectiveTriggerRef]);
    const composedClassName = [
      "arvo-dd-tree",
      `arvo-dd-tree--${selectionMode}`,
      searchEnabled && "arvo-dd-tree--with-search",
      filter !== false && "arvo-dd-tree--with-filter",
      isResizable && "arvo-dd-tree--with-resize",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsxRuntime.jsx(
      Popover.ArvoPopover,
      {
        ...popoverProps,
        ref: panelRef,
        variant: "edge",
        title: title ?? void 0,
        hasHeader,
        isClosable,
        hasBackButton,
        onBack,
        headerActions,
        placement,
        offset,
        closeOnOutside,
        isLoading,
        isOpen,
        onOpenChange: (next) => {
          if (next) handleOpen();
          else handleClose();
        },
        onOpen,
        onClose,
        triggerRef: effectiveTriggerRef,
        renderTrigger: wrappedRenderTrigger ?? renderTrigger,
        stickyHeader: renderStickyHeader(),
        actions: builtActions,
        hasFooter: builtActions !== void 0 && builtActions.length > 0,
        className: composedClassName,
        id: panelId,
        width: resizedWidth,
        children: renderBody()
      }
    );
  }
);
ArvoDropdownTree.displayName = "ArvoDropdownTree";
exports.ArvoDropdownTree = ArvoDropdownTree;
exports.DD_TREE_DEFAULT_WIDTH = DD_TREE_DEFAULT_WIDTH;
exports.DD_TREE_MAX_WIDTH = DD_TREE_MAX_WIDTH;
exports.DD_TREE_MIN_HEIGHT = DD_TREE_MIN_HEIGHT;
exports.DD_TREE_MIN_WIDTH = DD_TREE_MIN_WIDTH;
//# sourceMappingURL=index29.cjs.map
