import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useEffect, useMemo, useState, useCallback, useLayoutEffect, useImperativeHandle } from "react";
import { c as clientExports } from "./index97.js";
import { filterGroups, filterItems, createInlinePanelStack, createResizeHandle } from "@arvo/core";
import { formatMatchCountMessage } from "@arvo/utils";
import { ArvoPopover } from "./index27.js";
import ArvoSearch from "./index51.js";
import ArvoButtonGroup from "./index30.js";
import { ArvoBannerAlert } from "./index48.js";
import { ArvoMessageAlert } from "./index13.js";
import { ArvoList } from "./index63.js";
import { resolveItemInline, isPopoverInlineConfig, toListPayload, mapListEmptyState } from "./index98.js";
const HPOP_MIN_WIDTH = 270;
const HPOP_DEFAULT_WIDTH = 360;
const HPOP_MAX_WIDTH = 700;
const HPOP_MIN_HEIGHT = 272;
const HPOP_SKELETON_ROWS = 12;
let _inlineEntryCounter = 0;
function nextInlineEntryId() {
  _inlineEntryCounter += 1;
  return `hpop-inline-${_inlineEntryCounter}`;
}
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) return items.flatMap((g) => g.items);
  return items;
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function applyReorder(items, fromIndex, toIndex, fromGroup, toGroup) {
  if (!isGrouped(items)) {
    const arr = [...items];
    if (fromIndex < 0 || fromIndex >= arr.length) return items;
    const [moved2] = arr.splice(fromIndex, 1);
    const insertIdx2 = clamp(toIndex, 0, arr.length);
    arr.splice(insertIdx2, 0, moved2);
    return arr;
  }
  const groups = items;
  const flat = [];
  groups.forEach(
    (g) => g.items.forEach((it) => flat.push({ item: it, groupId: g.id }))
  );
  if (fromIndex < 0 || fromIndex >= flat.length) return items;
  const [moved] = flat.splice(fromIndex, 1);
  const targetGroupId = toGroup ?? fromGroup ?? moved.groupId;
  moved.groupId = targetGroupId;
  const insertIdx = clamp(toIndex, 0, flat.length);
  flat.splice(insertIdx, 0, moved);
  return groups.map((g) => ({
    ...g,
    items: flat.filter((entry) => entry.groupId === g.id).map((e) => e.item)
  }));
}
function resolveSelection(variant, selectionMode) {
  if (selectionMode) return selectionMode;
  if (variant === "multi") return "multi";
  if (variant === "single") return "single";
  return "multi";
}
function defaultDraft(selection, controlled, defaultValue) {
  const seed = controlled ?? defaultValue ?? null;
  if (selection === "multi") {
    return Array.isArray(seed) ? [...seed] : [];
  }
  if (selection === "single") {
    return typeof seed === "string" ? seed : null;
  }
  return null;
}
function valuesEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }
  return false;
}
const ArvoHybridPopover = forwardRef(
  function ArvoHybridPopover2(props, ref) {
    const {
      variant = "multi",
      selectionMode,
      items: itemsProp,
      defaultItems,
      value: controlledValue,
      defaultValue,
      onChange,
      commitOn = "apply",
      search = { variant: "filter-search", placeholder: "Search" },
      bannerAlert = false,
      conditional = false,
      hasGlobalSelectAll = false,
      enableReorder = false,
      crossGroupDrag = false,
      onReorder,
      emptyConfig,
      actions,
      isResizable = true,
      width = HPOP_DEFAULT_WIDTH,
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
      isLoading: isLoadingProp = false,
      dataState: dataStateProp = "data",
      isOpen: openProp,
      defaultOpen = false,
      onOpenChange,
      onOpen,
      onClose,
      triggerRef,
      renderTrigger,
      isInline = false,
      parent = null,
      initialFocus = "auto",
      onApply,
      onCancel,
      onReset,
      className,
      listProps
    } = props;
    const uid = useId();
    const panelId = `arvo-hpop-${uid}`;
    const isUnimplemented = variant === "boolean" || variant === "conditional" || variant === "custom";
    const lastWarnedVariantRef = useRef(null);
    useEffect(() => {
      if (isUnimplemented && lastWarnedVariantRef.current !== variant) {
        lastWarnedVariantRef.current = variant;
        console.warn(
          `HybridPopover: variant "${variant}" is not yet implemented.`
        );
      }
    }, [variant, isUnimplemented]);
    const selection = useMemo(
      () => resolveSelection(variant, selectionMode),
      [variant, selectionMode]
    );
    const isControlledItems = itemsProp !== void 0 && defaultItems === void 0;
    const [internalItems, setInternalItems] = useState(() => itemsProp ?? defaultItems ?? []);
    useEffect(() => {
      if (isControlledItems && itemsProp !== void 0) {
        setInternalItems(itemsProp);
      }
    }, [isControlledItems, itemsProp]);
    const items = internalItems;
    const grouped = isGrouped(items);
    const [internalLoading, setInternalLoading] = useState(isLoadingProp === true);
    useEffect(() => {
      setInternalLoading(isLoadingProp === true);
    }, [isLoadingProp]);
    const isLoading = internalLoading;
    const isControlledOpen = openProp !== void 0 && openProp !== null;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = isControlledOpen ? !!openProp : internalOpen;
    const setOpen = useCallback(
      (next) => {
        if (!isControlledOpen) setInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [isControlledOpen, onOpenChange]
    );
    const handleOpen = useCallback(() => {
      if (isOpen) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      setOpen(true);
    }, [isOpen, onOpen, setOpen]);
    const inlineStackRef = useRef(null);
    const reactRootsRef = useRef(/* @__PURE__ */ new Map());
    const unmountInlineRoot = useCallback((entryId) => {
      const root = reactRootsRef.current.get(entryId);
      if (root) {
        queueMicrotask(() => root.unmount());
        reactRootsRef.current.delete(entryId);
      }
    }, []);
    const closeAllInlinePanels = useCallback(() => {
      const stack = inlineStackRef.current;
      if (!stack) return;
      for (const entry of stack.getEntries()) {
        unmountInlineRoot(entry.id);
      }
      stack.popAll();
    }, [unmountInlineRoot]);
    const popInlinePanelBack = useCallback(() => {
      const stack = inlineStackRef.current;
      if (!stack || stack.getDepth() === 0) return;
      const top = stack.getTop();
      if (!top) return;
      stack.pop({ via: "back" });
      unmountInlineRoot(top.id);
    }, [unmountInlineRoot]);
    const closeInlinePanel = useCallback(() => {
      const stack = inlineStackRef.current;
      if (!stack || stack.getDepth() === 0) return;
      const top = stack.getTop();
      if (!top) return;
      stack.pop({ via: "default" });
      unmountInlineRoot(top.id);
    }, [unmountInlineRoot]);
    const handleClose = useCallback(() => {
      if (!isOpen) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      closeAllInlinePanels();
      setOpen(false);
    }, [isOpen, onClose, setOpen, closeAllInlinePanels]);
    const handleToggle = useCallback(() => {
      if (isOpen) handleClose();
      else handleOpen();
    }, [isOpen, handleOpen, handleClose]);
    const isControlledValue = controlledValue !== void 0;
    const [internalCommitted, setInternalCommitted] = useState(() => defaultDraft(selection, void 0, defaultValue));
    const committed = isControlledValue ? controlledValue : internalCommitted;
    const setCommitted = useCallback(
      (next) => {
        if (!isControlledValue) setInternalCommitted(next);
      },
      [isControlledValue]
    );
    const [draft, setDraft] = useState(
      () => defaultDraft(selection, controlledValue, defaultValue)
    );
    useEffect(() => {
      setDraft(
        defaultDraft(selection, committed, null)
      );
    }, [isOpen, selection]);
    useEffect(() => {
      if (isControlledValue) {
        setDraft(
          defaultDraft(selection, controlledValue, null)
        );
      }
    }, [controlledValue, selection]);
    const searchEnabled = search !== false;
    const searchCfg = useMemo(
      () => searchEnabled ? {
        variant: "filter-search",
        placeholder: "Search",
        ...search
      } : { placeholder: "" },
      [search, searchEnabled]
    );
    const [query, setQuery] = useState("");
    const filteredItems = useMemo(() => {
      if (!searchEnabled || !query) return items;
      if (grouped) {
        return filterGroups(items, {
          query,
          keys: ["label"]
        });
      }
      return filterItems(items, {
        query,
        keys: ["label"]
      });
    }, [items, grouped, query, searchEnabled]);
    const flatFiltered = useMemo(() => flattenItems(filteredItems), [filteredItems]);
    const flatAll = useMemo(() => flattenItems(items), [items]);
    const totalCount = flatAll.length;
    const filteredCount = flatFiltered.length;
    const effectiveDataState = useMemo(() => {
      if (dataStateProp !== "data") return dataStateProp;
      if (totalCount === 0) return "noData";
      if (filteredCount === 0) return "noResults";
      return "data";
    }, [dataStateProp, totalCount, filteredCount]);
    const draftAsArray = useCallback(
      () => Array.isArray(draft) ? draft : [],
      [draft]
    );
    const fireOnChange = useCallback(
      (next, meta) => {
        onChange == null ? void 0 : onChange(next, meta);
      },
      [onChange]
    );
    const updateDraft = useCallback(
      (next, meta) => {
        setDraft(next);
        if (commitOn === "change") {
          setCommitted(next);
          fireOnChange(next, meta);
        }
      },
      [commitOn, setCommitted, fireOnChange]
    );
    const handleListSelectionChange = useCallback(
      (detail) => {
        if (selection === "none") return;
        const next = detail.selectedIds;
        if (selection === "single") {
          const nextId = typeof next === "string" ? next : null;
          const item = nextId ? flatAll.find((i) => i.id === nextId) ?? null : null;
          updateDraft(nextId, { item, action: "toggle" });
          return;
        }
        const prevArr = draftAsArray();
        const nextArr = Array.isArray(next) ? next : [];
        const prevSet = new Set(prevArr);
        const nextSet = new Set(nextArr);
        const added = [];
        const removed = [];
        nextArr.forEach((id) => {
          if (!prevSet.has(id)) added.push(id);
        });
        prevArr.forEach((id) => {
          if (!nextSet.has(id)) removed.push(id);
        });
        const changed = [...added, ...removed].sort();
        if (changed.length === 0) {
          updateDraft(nextArr, { item: null, action: "toggle" });
          return;
        }
        if (changed.length === 1) {
          const id = changed[0];
          const item = flatAll.find((i) => i.id === id) ?? null;
          updateDraft(nextArr, { item, action: "toggle" });
          return;
        }
        const globalEnabled = flatAll.filter((i) => !i.isDisabled).map((i) => i.id).sort();
        const matchesSet = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
        if (hasGlobalSelectAll && matchesSet(changed, globalEnabled)) {
          updateDraft(nextArr, { item: null, action: "select-all" });
          return;
        }
        if (grouped) {
          const groupHit = items.find((g) => {
            const groupEnabled = g.items.filter((i) => !i.isDisabled).map((i) => i.id).sort();
            return matchesSet(changed, groupEnabled);
          });
          if (groupHit) {
            updateDraft(nextArr, { item: null, action: "group-select-all" });
            return;
          }
        }
        if (matchesSet(changed, globalEnabled)) {
          updateDraft(nextArr, { item: null, action: "select-all" });
          return;
        }
        updateDraft(nextArr, { item: null, action: "toggle" });
      },
      [selection, draftAsArray, flatAll, grouped, items, updateDraft]
    );
    const handleListReorder = useCallback(
      (detail) => {
        const { fromIndex, toIndex, fromGroupId, toGroupId } = detail;
        if (!crossGroupDrag && fromGroupId !== toGroupId) return;
        const next = applyReorder(
          items,
          fromIndex,
          toIndex,
          fromGroupId,
          toGroupId
        );
        if (!isControlledItems) {
          setInternalItems(next);
        }
        onReorder == null ? void 0 : onReorder({
          fromIndex,
          toIndex,
          fromGroup: fromGroupId,
          toGroup: toGroupId,
          items: next
        });
      },
      [crossGroupDrag, items, isControlledItems, onReorder]
    );
    const handleApply = useCallback(() => {
      const next = draft;
      const result = onApply == null ? void 0 : onApply(next);
      setCommitted(next);
      fireOnChange(next, { item: null, action: "apply" });
      if (result === false) return false;
      handleClose();
      return void 0;
    }, [draft, onApply, setCommitted, fireOnChange, handleClose]);
    const handleCancel = useCallback(() => {
      setDraft(defaultDraft(selection, committed, null));
      setQuery("");
      onCancel == null ? void 0 : onCancel();
      handleClose();
    }, [committed, selection, onCancel, handleClose]);
    const handleReset = useCallback(() => {
      const cleared = selection === "multi" ? [] : null;
      setDraft(cleared);
      setQuery("");
      if (commitOn === "change") {
        setCommitted(cleared);
        fireOnChange(cleared, {
          item: null,
          action: "reset"
        });
      }
      onReset == null ? void 0 : onReset();
    }, [selection, commitOn, setCommitted, fireOnChange, onReset]);
    const builtActions = useMemo(() => {
      if (actions === false) return void 0;
      if (actions) return actions;
      if (isLoading) return void 0;
      if (effectiveDataState === "noData") return void 0;
      const list = [];
      list.push({
        id: "Reset",
        icon: "rotate-left",
        variant: "tertiary",
        action: () => {
          handleReset();
          return false;
        }
      });
      list.push({
        id: "cancel",
        label: "Cancel",
        variant: "secondary",
        action: () => {
          handleCancel();
          return false;
        }
      });
      list.push({
        id: "apply",
        label: "Apply",
        variant: "primary",
        action: () => {
          const r = handleApply();
          return r;
        }
      });
      return list;
    }, [actions, isLoading, effectiveDataState, handleReset, handleCancel, handleApply]);
    const handleSearchInput = useCallback((value) => {
      setQuery(value);
    }, []);
    const handleSearchClear = useCallback(() => {
      setQuery("");
    }, []);
    const conditionalItems = useMemo(
      () => [
        { value: "and", label: "And" },
        { value: "or", label: "Or" }
      ],
      []
    );
    const messageAlertText = useMemo(() => {
      if (!searchEnabled || searchCfg.messageAlert === false) return null;
      if (!searchCfg.counter || !query) return null;
      const msgCfg = typeof searchCfg.messageAlert === "object" ? searchCfg.messageAlert : {};
      if (typeof msgCfg.message === "function") {
        return msgCfg.message(filteredCount, totalCount);
      }
      const template = typeof msgCfg.message === "string" ? msgCfg.message : "{count} matching results found.";
      return formatMatchCountMessage(filteredCount, template);
    }, [searchEnabled, searchCfg, query, filteredCount, totalCount]);
    const renderInlinePopoverLayer = useCallback(
      (config, onPopLayer, onBackLayer) => {
        const hasBackButton2 = config.hasBackButton !== false;
        const showClose = config.isClosable !== false;
        return /* @__PURE__ */ jsx(
          ArvoPopover,
          {
            isInline: true,
            variant: "edge",
            title: config.title,
            hasHeader: !!(config.title || hasBackButton2 || showClose),
            isClosable: false,
            hasBackButton: hasBackButton2,
            onBack: onBackLayer,
            onClose: onPopLayer,
            actions: config.actions,
            isOpen: true,
            isInteractive: true,
            children: config.content
          }
        );
      },
      []
    );
    const renderInlineHybridLayer = useCallback(
      (config, onPopLayer, onBackLayer) => /* @__PURE__ */ jsx(
        ArvoHybridPopover2,
        {
          isInline: true,
          parent: parent ?? panelId,
          title: config.title,
          items: config.items ?? [],
          variant: config.variant,
          hasBackButton: config.hasBackButton !== false,
          isClosable: false,
          isOpen: true,
          onBack: onBackLayer,
          onClose: onPopLayer,
          headerActions: [{
            id: "close",
            type: "btn",
            icon: "close",
            label: "Close",
            onClick: closeAllInlinePanels
          }]
        }
      ),
      [parent, panelId, closeAllInlinePanels]
    );
    const openInlineFromItem = useCallback(
      (item, opener) => {
        const cfg = resolveItemInline(item);
        if (!cfg) return;
        const stack = inlineStackRef.current;
        if (!stack) return;
        const entryId = nextInlineEntryId();
        const host = document.createElement("div");
        const root = clientExports.createRoot(host);
        reactRootsRef.current.set(entryId, root);
        const onPopLayer = () => closeInlinePanel();
        const onBackLayer = () => popInlinePanelBack();
        root.render(
          isPopoverInlineConfig(cfg) ? renderInlinePopoverLayer(cfg, onPopLayer, onBackLayer) : renderInlineHybridLayer(cfg, onPopLayer, onBackLayer)
        );
        const pushed = stack.push({
          id: entryId,
          kind: isPopoverInlineConfig(cfg) ? "popover" : "hybrid",
          element: host,
          openedFrom: opener,
          onOpen: () => {
            var _a;
            return ((_a = cfg.onOpen) == null ? void 0 : _a.call(cfg)) === false ? false : void 0;
          },
          onBack: () => {
            var _a;
            return (_a = cfg.onBack) == null ? void 0 : _a.call(cfg);
          },
          onClose: () => {
            var _a;
            return ((_a = cfg.onClose) == null ? void 0 : _a.call(cfg)) === false ? false : void 0;
          }
        });
        if (!pushed) {
          unmountInlineRoot(entryId);
        }
      },
      [
        closeInlinePanel,
        popInlinePanelBack,
        renderInlineHybridLayer,
        renderInlinePopoverLayer,
        unmountInlineRoot
      ]
    );
    const handleListItemActivate = useCallback(
      (detail) => {
        const source = detail.item.data ?? flatAll.find((i) => i.id === detail.id);
        if (!source) return;
        const target = detail.event.currentTarget;
        const anchor = target instanceof HTMLElement ? target : detail.event.target instanceof HTMLElement ? detail.event.target : null;
        if (!anchor) return;
        openInlineFromItem(source, anchor);
      },
      [flatAll, openInlineFromItem]
    );
    const renderStickyHeader = () => {
      if (isLoading) return null;
      const showBanner = bannerAlert !== false && !!bannerAlert;
      const showConditional = !!conditional;
      if (!showBanner && !searchEnabled && !showConditional) return null;
      if (effectiveDataState === "noData") return null;
      const counter = searchEnabled && searchCfg.counter && query ? { current: filteredCount, total: totalCount } : null;
      const msgType = typeof searchCfg.messageAlert === "object" ? searchCfg.messageAlert.type ?? "info" : "info";
      const msgIcon = typeof searchCfg.messageAlert === "object" ? searchCfg.messageAlert.icon : void 0;
      return /* @__PURE__ */ jsxs("div", { className: "arvo-hpop__sticky", children: [
        showBanner && /* @__PURE__ */ jsx("div", { className: "arvo-hpop__banner", children: /* @__PURE__ */ jsx(ArvoBannerAlert, { ...bannerAlert }) }),
        searchEnabled && /* @__PURE__ */ jsxs("div", { className: "arvo-hpop__search", ref: searchHostRef, children: [
          /* @__PURE__ */ jsx(
            ArvoSearch,
            {
              variant: "filter",
              value: query,
              placeholder: searchCfg.placeholder ?? "Search",
              shortcut: searchCfg.shortcut,
              counter,
              onSearch: handleSearchInput,
              onChange: handleSearchInput,
              onClear: handleSearchClear,
              isFullWidth: true,
              "aria-label": "Filter options"
            }
          ),
          messageAlertText && /* @__PURE__ */ jsx("div", { className: "arvo-hpop__search-msg", children: /* @__PURE__ */ jsx(
            ArvoMessageAlert,
            {
              type: msgType,
              message: messageAlertText,
              icon: msgIcon
            }
          ) })
        ] }),
        showConditional && /* @__PURE__ */ jsx("div", { className: "arvo-hpop__cond", children: /* @__PURE__ */ jsx(
          ArvoButtonGroup,
          {
            ariaLabel: "Combine filters",
            items: conditionalItems,
            value: conditional.value,
            size: "sm",
            onChange: (detail) => {
              const v = detail.value;
              if (v === "and" || v === "or") conditional.onChange(v);
            }
          }
        ) })
      ] });
    };
    const panelRef = useRef(null);
    const searchHostRef = useRef(null);
    useEffect(() => {
      const normalizedInitialFocus2 = initialFocus ?? "auto";
      if (!isOpen || !searchEnabled || normalizedInitialFocus2 !== "auto") return;
      const raf = requestAnimationFrame(() => {
        var _a;
        const input = (_a = searchHostRef.current) == null ? void 0 : _a.querySelector(
          "input, textarea"
        );
        input == null ? void 0 : input.focus();
      });
      return () => cancelAnimationFrame(raf);
    }, [isOpen, searchEnabled, initialFocus]);
    const normalizedInitialFocus = initialFocus ?? "auto";
    const popoverInitialFocus = normalizedInitialFocus !== "auto" ? normalizedInitialFocus : searchEnabled ? "none" : "auto";
    const renderBody = () => {
      if (!isLoading && effectiveDataState === "appliesToAll") {
        const msg = (emptyConfig == null ? void 0 : emptyConfig.appliesToAllMessage) ?? "This filter currently applies to all values.";
        return /* @__PURE__ */ jsx("div", { className: "arvo-hpop__applies-to-all", children: /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "info", message: msg }) });
      }
      if (isUnimplemented && !isLoading) {
        return null;
      }
      const listPayload = toListPayload(filteredItems, enableReorder);
      const isEmpty = effectiveDataState === "noData" || effectiveDataState === "noResults";
      const emptyState = isEmpty ? mapListEmptyState(
        effectiveDataState === "noResults" ? "no-results" : "no-data",
        emptyConfig,
        effectiveDataState === "noResults" ? handleSearchClear : void 0
      ) : void 0;
      return /* @__PURE__ */ jsx(
        ArvoList,
        {
          ...listProps,
          variant: (listProps == null ? void 0 : listProps.variant) ?? "standard",
          selectionMode: selection,
          items: listPayload.items,
          groups: listPayload.groups,
          selectedIds: selection === "none" ? null : draft,
          hasGlobalSelectAll: hasGlobalSelectAll && selection === "multi",
          isReorderable: enableReorder,
          crossGroupReorder: crossGroupDrag,
          isLoading,
          skeletonRows: (listProps == null ? void 0 : listProps.skeletonRows) ?? HPOP_SKELETON_ROWS,
          isEmpty,
          emptyState,
          searchQuery: query || void 0,
          ariaLabel: (listProps == null ? void 0 : listProps.ariaLabel) ?? title ?? "Filter options",
          onSelectionChange: handleListSelectionChange,
          onReorder: handleListReorder,
          onItemActivate: handleListItemActivate
        }
      );
    };
    useEffect(() => {
      var _a;
      if (!isOpen) return;
      const panel = (_a = panelRef.current) == null ? void 0 : _a.element;
      if (!panel) return;
      const stack = createInlinePanelStack({
        host: panel,
        containerClass: "arvo-hpop__inline-panel",
        maxDepth: 5
      });
      inlineStackRef.current = stack;
      return () => {
        for (const entry of stack.getEntries()) {
          unmountInlineRoot(entry.id);
        }
        stack.destroy();
        inlineStackRef.current = null;
      };
    }, [isOpen, unmountInlineRoot]);
    const resizeRef = useRef(null);
    const [resizedWidth, setResizedWidth] = useState(
      () => clamp(width, HPOP_MIN_WIDTH, HPOP_MAX_WIDTH)
    );
    const [resizedHeight, setResizedHeight] = useState(height);
    const firstOpenRef = useRef(true);
    const lastWidthPropRef = useRef(width);
    const lastHeightPropRef = useRef(height);
    useEffect(() => {
      if (width !== lastWidthPropRef.current) {
        lastWidthPropRef.current = width;
        setResizedWidth(clamp(width, HPOP_MIN_WIDTH, HPOP_MAX_WIDTH));
      }
    }, [width]);
    useEffect(() => {
      if (height !== lastHeightPropRef.current) {
        lastHeightPropRef.current = height;
        setResizedHeight(height);
      }
    }, [height]);
    useLayoutEffect(() => {
      var _a;
      const panel = (_a = panelRef.current) == null ? void 0 : _a.element;
      if (!panel || !isOpen) return;
      if (resizedHeight != null) {
        const maxH = Math.floor(window.innerHeight * 0.9);
        panel.style.height = `${clamp(resizedHeight, HPOP_MIN_HEIGHT, maxH)}px`;
      } else {
        panel.style.removeProperty("height");
      }
    }, [isOpen, resizedHeight]);
    useEffect(() => {
      if (isOpen && firstOpenRef.current) {
        firstOpenRef.current = false;
      }
    }, [isOpen]);
    useEffect(() => {
      var _a;
      if (!isOpen || !isResizable) return;
      const panel = (_a = panelRef.current) == null ? void 0 : _a.element;
      if (!panel) return;
      const handle = createResizeHandle(panel, {
        corners: ["bottom-left", "bottom-right"],
        min: { width: HPOP_MIN_WIDTH, height: HPOP_MIN_HEIGHT },
        max: (rect) => ({
          // Cap to viewport remaining space minus padding so handles stay
          // visible until the panel is flush with the edge.
          width: Math.max(
            HPOP_MIN_WIDTH,
            Math.min(
              HPOP_MAX_WIDTH,
              window.innerWidth - rect.left - 16
            )
          ),
          height: Math.max(
            HPOP_MIN_HEIGHT,
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
          panel.setAttribute("data-arvo-resized", "true");
          onResize == null ? void 0 : onResize(rect);
        },
        onCommit: (rect) => {
          setResizedWidth(rect.width);
          setResizedHeight(rect.height);
          panel.setAttribute("data-arvo-resized", "true");
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
    useImperativeHandle(
      ref,
      () => ({
        open: () => handleOpen(),
        close: () => handleClose(),
        toggle: () => handleToggle(),
        isOpen: () => isOpen,
        value: (next) => {
          if (next === void 0) {
            return committed;
          }
          setCommitted(next);
          setDraft(defaultDraft(selection, next, null));
          if (!valuesEqual(next, committed)) {
            fireOnChange(next, { item: null, action: "apply" });
          }
          return void 0;
        },
        setLoading: (loading) => setInternalLoading(loading === true),
        updateItems: (next) => setInternalItems(next),
        reposition: () => window.dispatchEvent(new Event("resize"))
      }),
      [
        handleOpen,
        handleClose,
        handleToggle,
        isOpen,
        committed,
        setCommitted,
        selection,
        fireOnChange
      ]
    );
    const variantClass = `arvo-hpop--${variant}`;
    const featureClasses = [
      bannerAlert !== false && !!bannerAlert && "arvo-hpop--with-banner",
      searchEnabled && "arvo-hpop--with-search",
      conditional && "arvo-hpop--with-conditional",
      isResizable && "arvo-hpop--with-resize"
    ].filter(Boolean);
    const stateClasses = [];
    if (effectiveDataState === "noData") stateClasses.push("arvo-hpop--no-data");
    else if (effectiveDataState === "noResults") stateClasses.push("arvo-hpop--no-results");
    else if (effectiveDataState === "appliesToAll") stateClasses.push("arvo-hpop--applies-to-all");
    const composedClassName = [
      "arvo-hpop",
      variantClass,
      ...featureClasses,
      ...stateClasses,
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsx(
      ArvoPopover,
      {
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
        triggerRef,
        renderTrigger,
        isInline,
        stickyHeader: renderStickyHeader(),
        actions: builtActions,
        hasFooter: builtActions !== void 0 && builtActions.length > 0,
        className: composedClassName,
        id: panelId,
        width: resizedWidth,
        initialFocus: popoverInitialFocus,
        children: renderBody()
      }
    );
  }
);
ArvoHybridPopover.displayName = "ArvoHybridPopover";
export {
  ArvoHybridPopover,
  HPOP_DEFAULT_WIDTH,
  HPOP_MAX_WIDTH,
  HPOP_MIN_HEIGHT,
  HPOP_MIN_WIDTH,
  ArvoHybridPopover as default
};
//# sourceMappingURL=index28.js.map
