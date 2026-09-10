import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { overlayHub, resolveOverlayInitialFocus } from "@arvo/core";
import { PanelShell } from "./index105.js";
import { ArvoIconButton } from "./index17.js";
import ArvoSplitter from "./index66.js";
import ArvoFabButton from "./index31.js";
import { ArvoStatus } from "./index14.js";
import { ArvoBadge } from "./index45.js";
import { useControllableState } from "./index90.js";
import { useOverlaySurface } from "./index92.js";
function toCssLength(value) {
  if (value == null) return null;
  if (typeof value === "number") return `${value}px`;
  return String(value);
}
function toNumericPx(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}
function isRichHeaderShape(value) {
  if (typeof value !== "object" || value === null) return false;
  if (!("content" in value)) return false;
  if ("hasClear" in value || "onClear" in value) return true;
  return Object.keys(value).length === 1;
}
const PinButton = forwardRef(
  function PinButton2({ isPinned, isDisabled, onClick }, ref) {
    const label = isPinned ? "Unpin panel" : "Pin panel";
    return /* @__PURE__ */ jsx(
      ArvoIconButton,
      {
        ref,
        className: "arvo-pnl__pin",
        size: "sm",
        variant: "tertiary",
        icon: "push-pin",
        tooltip: label,
        isDisabled,
        isSelected: isPinned,
        onClick,
        "aria-label": label
      }
    );
  }
);
const PanelBase = forwardRef(function PanelBase2(props, ref) {
  const {
    panelType,
    extraHostClasses,
    roleOverride,
    displayMode: displayModeProp = "overlay",
    placement = "left",
    isEdge = false,
    body,
    isOpen: isOpenProp,
    defaultOpen = false,
    onOpenChange,
    onOpen,
    onClose,
    isModal: isModalProp,
    closeOnEscape = true,
    closeOnOutsideClick: closeOnOutsideClickProp,
    container: containerProp,
    defaultSize,
    minSize,
    maxSize,
    isResizable = false,
    onResize,
    onResizeCommit,
    isExpandable = false,
    isExpanded: isExpandedProp,
    defaultExpanded = false,
    expandMode: expandModeProp,
    onExpandChange,
    hasHeader = true,
    title = null,
    icon: iconProp,
    status,
    badge,
    hasBackButton = false,
    onBack,
    headerActions,
    hasOverflowMenu = false,
    overflowMenuItems,
    isPinnable = false,
    isPinned: isPinnedProp,
    defaultPinned = false,
    onPinChange,
    isDismissible = true,
    richHeader,
    stickyHeader = false,
    actions = false,
    fab = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    className,
    instanceRef,
    ...rest
  } = props;
  const isLoading = isLoadingProp === true;
  const containerWasExplicitRef = useRef(containerProp !== void 0);
  const hostRef = useRef(null);
  const paneRef = useRef(null);
  const pinBtnRef = useRef(null);
  const shellRef = useRef(null);
  const closingProgrammaticallyRef = useRef({ flag: false, reason: "programmatic" });
  useImperativeHandle(ref, () => hostRef.current, []);
  const [isPinnedState, setPinnedInternal] = useControllableState(
    isPinnedProp,
    defaultPinned
  );
  const [displayModeOverride, setDisplayModeOverride] = useState(null);
  const effectiveDisplayMode = isPinnable ? isPinnedState ? "docked" : "overlay" : displayModeOverride ?? displayModeProp;
  const [iconOverride, setIconOverride] = useState(
    void 0
  );
  useEffect(() => {
    setIconOverride(void 0);
  }, [iconProp]);
  const icon = iconOverride !== void 0 ? iconOverride : iconProp;
  const resolvedContainer = useMemo(() => {
    if (typeof document === "undefined") return null;
    if (containerProp === null) return document.body;
    if (containerProp !== void 0) {
      return typeof containerProp === "function" ? containerProp() : containerProp;
    }
    if (effectiveDisplayMode === "docked") return null;
    return overlayHub.getContainer();
  }, [containerProp, effectiveDisplayMode]);
  const shouldPortal = resolvedContainer != null && (effectiveDisplayMode === "overlay" || containerWasExplicitRef.current);
  const isScoped = effectiveDisplayMode === "overlay" && resolvedContainer != null && typeof document !== "undefined" && resolvedContainer !== document.body;
  const [isOpenState, setOpenInternal] = useControllableState(
    isOpenProp,
    defaultOpen
  );
  const open = effectiveDisplayMode === "docked" ? true : isOpenState;
  const [isExpandedState, setExpandedInternal] = useControllableState(isExpandedProp, defaultExpanded);
  const isModal = effectiveDisplayMode === "docked" ? false : isModalProp ?? true;
  const closeOnOutsideClick = closeOnOutsideClickProp ?? true;
  const expandMode = expandModeProp ?? (effectiveDisplayMode === "overlay" ? "fullscreen" : "maxSize");
  const isVerticalAxis = placement === "left" || placement === "right";
  const defaultSizeFallback = isVerticalAxis ? 400 : 400;
  const minSizeFallback = isVerticalAxis ? 160 : 240;
  const maxSizeFallback = 800;
  const numericDefaultSize = toNumericPx(defaultSize, defaultSizeFallback);
  const numericMinSize = toNumericPx(minSize, minSizeFallback);
  const numericMaxSize = toNumericPx(maxSize, maxSizeFallback);
  const [resizedSize, setResizedSize] = useState(null);
  const renderedSize = resizedSize ?? numericDefaultSize;
  const searchCfg = useMemo(() => {
    const raw = stickyHeader && typeof stickyHeader === "object" ? stickyHeader.search : void 0;
    if (!raw) return null;
    return raw === true ? {} : raw;
  }, [stickyHeader]);
  const [searchQueryState, setSearchQueryInternal] = useControllableState(
    searchCfg == null ? void 0 : searchCfg.value,
    (searchCfg == null ? void 0 : searchCfg.defaultValue) ?? ""
  );
  const handleSearchChange = useCallback(
    (nextQuery, _matchedCount) => {
      var _a, _b, _c;
      setSearchQueryInternal(nextQuery);
      (_a = searchCfg == null ? void 0 : searchCfg.onChange) == null ? void 0 : _a.call(searchCfg, nextQuery);
      (_b = paneRef.current) == null ? void 0 : _b.dispatchEvent(
        new CustomEvent("pnl:search", {
          bubbles: true,
          detail: { value: nextQuery }
        })
      );
      if (nextQuery === "") (_c = searchCfg == null ? void 0 : searchCfg.onClear) == null ? void 0 : _c.call(searchCfg);
    },
    [setSearchQueryInternal, searchCfg]
  );
  const setPinned = useCallback(
    (next) => {
      var _a;
      if (next === isPinnedState) return;
      setPinnedInternal(next);
      onPinChange == null ? void 0 : onPinChange(next);
      (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("pnl:pin", {
          bubbles: true,
          detail: { pinned: next }
        })
      );
    },
    [isPinnedState, onPinChange, setPinnedInternal]
  );
  const setOpen = useCallback(
    (next) => {
      if (next === isOpenState) return;
      setOpenInternal(next);
      onOpenChange == null ? void 0 : onOpenChange(next);
    },
    [isOpenState, onOpenChange, setOpenInternal]
  );
  const [isAnimatingExpand, setIsAnimatingExpand] = useState(false);
  const expandTimeoutRef = useRef(null);
  useEffect(() => () => {
    if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
  }, []);
  const setExpanded = useCallback(
    (next) => {
      var _a;
      if (next === isExpandedState) return;
      setIsAnimatingExpand(true);
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = setTimeout(() => {
        setIsAnimatingExpand(false);
        expandTimeoutRef.current = null;
      }, 360);
      setExpandedInternal(next);
      onExpandChange == null ? void 0 : onExpandChange(next);
      (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("pnl:expand", {
          bubbles: true,
          detail: { isExpanded: next }
        })
      );
    },
    [isExpandedState, onExpandChange, setExpandedInternal]
  );
  const handlePaneTransitionEnd = useCallback(
    (e) => {
      if (e.target !== paneRef.current) return;
      if (e.propertyName !== "width" && e.propertyName !== "height") return;
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
        expandTimeoutRef.current = null;
      }
      setIsAnimatingExpand(false);
    },
    []
  );
  const handleOpen = useCallback(() => {
    var _a;
    if (!open && (onOpen == null ? void 0 : onOpen()) === false) return;
    setOpen(true);
    (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
      new CustomEvent("pnl:open", { bubbles: true, detail: {} })
    );
  }, [open, onOpen, setOpen]);
  const dispatchCloseEvent = useCallback(
    (reason, cancelable) => {
      var _a;
      const ev = new CustomEvent("pnl:close", {
        bubbles: true,
        cancelable,
        detail: { reason }
      });
      (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(ev);
      return ev;
    },
    []
  );
  const handleClose = useCallback(
    (reason = "programmatic") => {
      if (!open) return;
      const veto = (onClose == null ? void 0 : onClose(reason)) === false;
      if (veto) return;
      closingProgrammaticallyRef.current = { flag: true, reason };
      dispatchCloseEvent(reason, true);
      setOpen(false);
    },
    [open, onClose, dispatchCloseEvent, setOpen]
  );
  const handleEngineClose = useCallback(() => {
    if (closingProgrammaticallyRef.current.flag) {
      closingProgrammaticallyRef.current.flag = false;
      return;
    }
    const reason = isModal ? "mask-click" : "outside-click";
    onClose == null ? void 0 : onClose(reason);
    dispatchCloseEvent(reason, false);
    setOpen(false);
  }, [isModal, onClose, dispatchCloseEvent, setOpen]);
  const handlePinClick = useCallback(() => {
    if (isDisabled || !isPinnable) return;
    setPinned(!isPinnedState);
  }, [isDisabled, isPinnable, isPinnedState, setPinned]);
  const handleExpandClick = useCallback(() => {
    if (isDisabled || !isExpandable) return;
    setExpanded(!isExpandedState);
  }, [isDisabled, isExpandable, isExpandedState, setExpanded]);
  const splitterMin = numericMinSize > 0 ? numericMinSize : 100;
  const splitterMax = numericMaxSize > splitterMin ? numericMaxSize : 2e3;
  const splitterValue = Math.min(
    Math.max(renderedSize, splitterMin),
    splitterMax
  );
  const splitterOrientation = isVerticalAxis ? "vertical" : "horizontal";
  const splitterInverse = placement === "right" || placement === "bottom";
  const styleVars = useMemo(() => {
    const sizeCss = toCssLength(renderedSize);
    const minCss = toCssLength(numericMinSize);
    const maxCss = toCssLength(numericMaxSize);
    const out = {};
    if (sizeCss) out["--arvo-pnl-size"] = sizeCss;
    if (minCss) out["--arvo-pnl-min-size"] = minCss;
    if (maxCss) out["--arvo-pnl-max-size"] = maxCss;
    return out;
  }, [renderedSize, numericMinSize, numericMaxSize]);
  const noopTriggerRef = useRef(null);
  useOverlaySurface({
    type: "side-panel",
    panelRef: paneRef,
    triggerRef: noopTriggerRef,
    isOpen: effectiveDisplayMode === "overlay" ? open : false,
    onOpen: () => {
    },
    onClose: () => {
      handleEngineClose();
    },
    closeOnEscape: false,
    closeOnOutside: false,
    positioned: false,
    focus: isModal ? "trap" : "none",
    initialFocus: props.initialFocus === "none" ? "none" : () => {
      const pane = paneRef.current;
      return resolveOverlayInitialFocus({
        initialFocus: props.initialFocus ?? "auto",
        root: pane,
        body: (pane == null ? void 0 : pane.querySelector(".arvo-pnl__body")) ?? null,
        footer: (pane == null ? void 0 : pane.querySelector(".arvo-pnl__footer")) ?? null,
        header: (pane == null ? void 0 : pane.querySelector(".arvo-pnl__hdr")) ?? null
      });
    },
    returnFocus: true,
    mask: isModal ? {
      closeOnClick: closeOnOutsideClick,
      className: "arvo-pnl__overlay-mask",
      container: resolvedContainer && typeof document !== "undefined" && resolvedContainer !== document.body ? resolvedContainer : void 0
    } : void 0,
    managesOwnFocus: true,
    managesOwnBackdrop: true,
    lockScroll: isModal,
    transition: null,
    transitionDuration: 200,
    triggerAria: false,
    activateAfterTransition: true
  });
  useEffect(() => {
    if (effectiveDisplayMode !== "overlay" || !open) return;
    if (!isDismissible || !closeOnEscape) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      onClose == null ? void 0 : onClose("escape");
      dispatchCloseEvent("escape", false);
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [
    effectiveDisplayMode,
    open,
    isDismissible,
    closeOnEscape,
    onClose,
    dispatchCloseEvent,
    setOpen
  ]);
  useEffect(() => {
    if (effectiveDisplayMode !== "overlay" || !open) return;
    if (!isDismissible || !closeOnOutsideClick || isModal) return;
    const onMouseDown = (e) => {
      var _a;
      const target = e.target;
      if (!target) return;
      if ((_a = paneRef.current) == null ? void 0 : _a.contains(target)) return;
      onClose == null ? void 0 : onClose("outside-click");
      dispatchCloseEvent("outside-click", false);
      setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown, true);
    return () => document.removeEventListener("mousedown", onMouseDown, true);
  }, [
    effectiveDisplayMode,
    open,
    isDismissible,
    closeOnOutsideClick,
    isModal,
    onClose,
    dispatchCloseEvent,
    setOpen
  ]);
  const wrappedOnBack = useCallback(() => {
    var _a;
    onBack == null ? void 0 : onBack();
    (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
      new CustomEvent("pnl:back", { bubbles: true, detail: {} })
    );
  }, [onBack]);
  const composedHeaderActions = useMemo(() => {
    const wrapAction = (action) => {
      const inner = action;
      return {
        ...action,
        onClick: () => {
          var _a, _b;
          (_a = inner.onClick) == null ? void 0 : _a.call(inner);
          (_b = paneRef.current) == null ? void 0 : _b.dispatchEvent(
            new CustomEvent("pnl:action", {
              bubbles: true,
              detail: { id: action.id, type: action.type }
            })
          );
        }
      };
    };
    const list = (headerActions ?? []).map(wrapAction);
    if (hasOverflowMenu && overflowMenuItems && overflowMenuItems.length > 0) {
      list.push({
        id: "__overflow__",
        type: "dropdown",
        icon: "ellipsis-v",
        items: overflowMenuItems,
        isCompact: true
      });
    }
    if (isExpandable) {
      list.push({
        id: "__expand__",
        type: "btn",
        icon: isExpandedState ? "priority-edge" : "expand",
        tooltip: isExpandedState ? "Restore panel size" : "Expand panel",
        onClick: handleExpandClick,
        isDisabled
      });
    }
    return list;
  }, [
    headerActions,
    hasOverflowMenu,
    overflowMenuItems,
    isExpandable,
    isExpandedState,
    handleExpandClick,
    isDisabled
  ]);
  useImperativeHandle(
    instanceRef,
    () => ({
      open: () => handleOpen(),
      close: (reason) => handleClose(reason ?? "programmatic"),
      toggle: () => open ? handleClose("programmatic") : handleOpen(),
      isOpen: () => open,
      pinned(value) {
        if (value === void 0) return isPinnedState;
        if (!isPinnable) return;
        setPinned(value);
      },
      expanded(value) {
        if (value === void 0) return isExpandedState;
        setExpanded(value);
      },
      size(value) {
        if (value === void 0) return renderedSize;
        const clamped = Math.min(
          Math.max(value, numericMinSize),
          numericMaxSize
        );
        setResizedSize(clamped);
      },
      setDisplayMode(mode) {
        if (isPinnable) {
          setPinned(mode === "docked");
          return;
        }
        setDisplayModeOverride(mode);
      },
      setStickyHeader: (config) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.setStickyHeader(config);
      },
      setHeaderActions: (next) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.setHeaderActions(next);
      },
      setActions: (next) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.setActions(next);
      },
      setTitle: (next) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.setTitle(next);
      },
      setIcon: (next) => {
        const normalized = next && typeof next === "string" ? next : null;
        setIconOverride(normalized);
      },
      search(query) {
        var _a, _b;
        if (query === void 0) return ((_a = shellRef.current) == null ? void 0 : _a.search()) ?? "";
        (_b = shellRef.current) == null ? void 0 : _b.search(query);
      },
      selectedTab(id) {
        var _a, _b;
        if (id === void 0) return ((_a = shellRef.current) == null ? void 0 : _a.selectedTab()) ?? null;
        (_b = shellRef.current) == null ? void 0 : _b.selectedTab(id);
      },
      loading(state) {
        var _a;
        if (state === void 0) return isLoading;
        (_a = shellRef.current) == null ? void 0 : _a.loading(state);
      },
      disabled(state) {
        var _a;
        if (state === void 0) return isDisabled;
        (_a = shellRef.current) == null ? void 0 : _a.disabled(state);
      },
      focus: (target) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.focus(target);
      }
    }),
    [
      handleOpen,
      handleClose,
      open,
      isPinnedState,
      isPinnable,
      setPinned,
      isExpandedState,
      setExpanded,
      renderedSize,
      numericMinSize,
      numericMaxSize,
      isLoading,
      isDisabled
    ]
  );
  const hostClasses = [
    "arvo-pnl",
    `arvo-pnl--mode-${effectiveDisplayMode}`,
    `arvo-pnl--placement-${placement}`,
    `arvo-pnl--type-${panelType}`,
    isModal ? "arvo-pnl--modal" : "arvo-pnl--non-modal",
    isExpandedState && "arvo-pnl--expanded",
    isExpandedState && `arvo-pnl--expand-${expandMode}`,
    isResizable && "arvo-pnl--resizable",
    isResizable && "arvo-pnl--with-splitter",
    isPinnable && "arvo-pnl--pinnable",
    isDismissible && "arvo-pnl--dismissible",
    !!richHeader && "arvo-pnl--with-rich-hdr",
    !!fab && "arvo-pnl--with-fab",
    isEdge && "arvo-pnl--edge",
    isScoped && "arvo-pnl--scoped",
    isPinnable && (isPinnedState ? "is-pinned" : "is-unpinned"),
    isExpandedState && "is-expanded",
    isAnimatingExpand && "arvo-pnl--animating-expand",
    effectiveDisplayMode === "overlay" && open && "open",
    isLoading && "loading",
    isDisabled && "is-disabled",
    ...extraHostClasses ?? [],
    className
  ].filter(Boolean).join(" ");
  const computedRole = roleOverride ?? (effectiveDisplayMode === "overlay" ? "dialog" : panelType === "navigation" ? "navigation" : "region");
  const computedAriaLabel = ariaLabel ?? title ?? void 0;
  const splitterEl = isResizable && !isExpandedState ? /* @__PURE__ */ jsx(
    ArvoSplitter,
    {
      className: "arvo-pnl__splitter",
      orientation: splitterOrientation,
      inverse: splitterInverse,
      minSize: splitterMin,
      maxSize: splitterMax,
      value: splitterValue,
      ariaLabel: "Resize panel",
      isDisabled,
      onResize: (next) => {
        var _a;
        setResizedSize(next);
        onResize == null ? void 0 : onResize(next);
        (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("pnl:resize", {
            bubbles: true,
            detail: { size: next }
          })
        );
      },
      onResizeEnd: (next) => {
        var _a;
        onResizeCommit == null ? void 0 : onResizeCommit(next);
        (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("pnl:resize-end", {
            bubbles: true,
            detail: { size: next }
          })
        );
      }
    }
  ) : null;
  const bodyCtx = useMemo(
    () => ({
      searchQuery: searchQueryState,
      searchKeys: searchCfg == null ? void 0 : searchCfg.searchKeys,
      getItemSearchText: searchCfg == null ? void 0 : searchCfg.getItemSearchText
    }),
    [searchQueryState, searchCfg]
  );
  const resolvedBody = typeof body === "function" ? body(bodyCtx) : body;
  const richHeaderEl = useMemo(() => {
    if (!richHeader) return null;
    if (isRichHeaderShape(richHeader)) {
      const cfg = richHeader;
      const showClose = cfg.hasClose === true;
      const showClear = !showClose && cfg.hasClear === true;
      return /* @__PURE__ */ jsxs("div", { className: "arvo-pnl__rich-hdr", children: [
        cfg.hasBack && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            className: "arvo-pnl__rich-hdr-back",
            size: "xs",
            variant: "tertiary",
            icon: "arrow-left",
            tooltip: "Back",
            "aria-label": "Back",
            isDisabled,
            onClick: () => {
              var _a, _b;
              if (isDisabled) return;
              (_a = cfg.onBack) == null ? void 0 : _a.call(cfg);
              (_b = paneRef.current) == null ? void 0 : _b.dispatchEvent(
                new CustomEvent("pnl:rich-hdr-back", { bubbles: true })
              );
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "arvo-pnl__rich-hdr-content", children: cfg.content }),
        showClose && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            className: "arvo-pnl__rich-hdr-close",
            size: "xs",
            variant: "tertiary",
            icon: "close",
            tooltip: "Close",
            "aria-label": "Close",
            isDisabled,
            onClick: () => {
              var _a, _b;
              if (isDisabled) return;
              (_a = cfg.onClose) == null ? void 0 : _a.call(cfg);
              (_b = paneRef.current) == null ? void 0 : _b.dispatchEvent(
                new CustomEvent("pnl:rich-hdr-close", { bubbles: true })
              );
            }
          }
        ),
        showClear && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            className: "arvo-pnl__rich-hdr-clear",
            size: "xs",
            variant: "tertiary",
            icon: "close",
            tooltip: "Clear",
            "aria-label": "Clear rich header",
            isDisabled,
            onClick: () => {
              var _a;
              return (_a = cfg.onClear) == null ? void 0 : _a.call(cfg);
            }
          }
        )
      ] });
    }
    return /* @__PURE__ */ jsx("div", { className: "arvo-pnl__rich-hdr", children: /* @__PURE__ */ jsx("div", { className: "arvo-pnl__rich-hdr-content", children: richHeader }) });
  }, [richHeader, isDisabled]);
  const fabEl = fab ? /* @__PURE__ */ jsx("div", { className: "arvo-pnl__fab", children: /* @__PURE__ */ jsx(ArvoFabButton, { ...fab }) }) : null;
  const titleLeadingEl = icon ? /* @__PURE__ */ jsx(
    "i",
    {
      className: `arvo-pnl__icon o9con o9con-${icon}`,
      "aria-hidden": "true"
    }
  ) : null;
  const titleTrailingEl = status || badge ? /* @__PURE__ */ jsxs(Fragment, { children: [
    status && /* @__PURE__ */ jsx(
      ArvoStatus,
      {
        className: "arvo-pnl__status",
        type: status.type,
        size: status.size ?? "sm",
        icon: status.icon,
        tooltip: status.tooltip
      }
    ),
    badge && /* @__PURE__ */ jsx(
      ArvoBadge,
      {
        className: "arvo-pnl__badge",
        variant: badge.variant ?? "label",
        size: badge.size ?? "sm",
        appearance: badge.appearance ?? "outline",
        colorMode: badge.colorMode,
        semanticType: badge.semanticType,
        customColor: badge.customColor,
        message: badge.message,
        counterMode: badge.counterMode,
        count: badge.count,
        total: badge.total,
        overflowCount: badge.overflowCount,
        hideWhenZero: badge.hideWhenZero,
        autoFormat: badge.autoFormat,
        localeAware: badge.localeAware,
        hasBadgeIcon: badge.hasBadgeIcon,
        icon: badge.icon,
        tooltip: badge.tooltip,
        placement: "inline"
      }
    )
  ] }) : null;
  const paneId = useMemo(
    () => `arvo-pnl-pane-${Math.random().toString(36).slice(2, 9)}`,
    []
  );
  const hostTree = /* @__PURE__ */ jsxs(
    "div",
    {
      ref: hostRef,
      className: hostClasses,
      style: styleVars,
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: paneRef,
            id: paneId,
            className: "arvo-pnl__pane",
            role: computedRole,
            "aria-modal": effectiveDisplayMode === "overlay" ? isModal ? "true" : "false" : void 0,
            "aria-busy": isLoading || void 0,
            "aria-disabled": isDisabled || void 0,
            "aria-label": !ariaLabelledBy ? computedAriaLabel : void 0,
            "aria-labelledby": ariaLabelledBy,
            "aria-describedby": ariaDescribedBy,
            onTransitionEnd: handlePaneTransitionEnd,
            children: [
              /* @__PURE__ */ jsx(
                PanelShell,
                {
                  ref: shellRef,
                  parentBlock: "arvo-pnl",
                  title,
                  hasHeader,
                  hasBackButton,
                  onBack: wrappedOnBack,
                  headerActions: composedHeaderActions,
                  stickyHeader,
                  titleLeading: titleLeadingEl,
                  titleTrailing: titleTrailingEl,
                  actions,
                  isClosable: isDismissible,
                  onClose: () => handleClose("close-button"),
                  onTabSelect: (id) => {
                    var _a;
                    (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
                      new CustomEvent("pnl:tab-select", {
                        bubbles: true,
                        detail: { id, index: -1 }
                      })
                    );
                  },
                  searchQuery: searchQueryState,
                  onSearchChange: handleSearchChange,
                  isLoading,
                  isDisabled,
                  isPinnableCount: isPinnable ? 1 : 0,
                  isClosableCount: isDismissible ? 1 : 0,
                  pinSlot: isPinnable ? /* @__PURE__ */ jsx(
                    PinButton,
                    {
                      ref: pinBtnRef,
                      isPinned: isPinnedState,
                      isDisabled,
                      onClick: handlePinClick
                    }
                  ) : null,
                  richHeader: richHeaderEl,
                  children: resolvedBody
                }
              ),
              fabEl
            ]
          }
        ),
        splitterEl
      ]
    }
  );
  if (shouldPortal && resolvedContainer) {
    return createPortal(hostTree, resolvedContainer);
  }
  return hostTree;
});
export {
  PanelBase as default
};
//# sourceMappingURL=index99.js.map
