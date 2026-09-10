import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useState, useCallback, useEffect, useMemo } from "react";
import { warnDeprecated } from "@arvo/core";
import { PanelShell } from "./index105.js";
import { ArvoIconButton } from "./index17.js";
import ArvoSplitter from "./index66.js";
import { useControllableState } from "./index90.js";
import { useOverlaySurface } from "./index92.js";
const PinButton = forwardRef(function PinButton2({ isPinned, isDisabled, onClick }, ref) {
  const label = isPinned ? "Unpin panel" : "Pin panel";
  return /* @__PURE__ */ jsx(
    ArvoIconButton,
    {
      ref,
      className: "arvo-sp__pin",
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
});
function toCssLength(value) {
  if (value === null || value === void 0) return void 0;
  return typeof value === "number" ? `${value}px` : value;
}
function SidePanelInner(props, ref) {
  warnDeprecated({
    component: "ArvoSidePanel",
    successor: "ArvoPanel",
    reason: "Use displayMode='overlay'|'docked' + placement='left'|'right'."
  });
  const {
    variant: variantProp = "layout",
    side = "right",
    isPinnable = false,
    isPinned: isPinnedProp,
    defaultPinned = true,
    onPinChange,
    hasSplitter = false,
    width = 290,
    minWidth = 320,
    // matches $arvo-sidepanel-wmin / SCSS default --arvo-sp-min-width
    maxWidth = null,
    isOpen: isOpenProp,
    defaultOpen = true,
    onOpenChange,
    onOpen,
    onClose,
    closeOnEscape = true,
    closeOnOutside = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    ariaLabel,
    className,
    children,
    instanceRef,
    // PanelShell passthrough
    title = null,
    hasHeader = true,
    hasBackButton = false,
    onBack,
    headerActions,
    stickyHeader = false,
    actions = false,
    hasFooter,
    isClosable = false,
    searchQuery,
    defaultSearchQuery,
    onSearchChange,
    onTabSelect,
    ...rest
  } = props;
  const isLoading = isLoadingProp === true;
  const hostRef = useRef(null);
  const paneRef = useRef(null);
  const pinBtnRef = useRef(null);
  const triggerRef = useRef(null);
  const shellRef = useRef(null);
  const pinClickedRef = useRef(false);
  useImperativeHandle(ref, () => hostRef.current, []);
  const [isPinnedState, setPinnedInternal] = useControllableState(
    isPinnedProp,
    defaultPinned
  );
  const [isOpenState, setOpenInternal] = useControllableState(
    isOpenProp,
    defaultOpen
  );
  const [variantOverride, setVariantOverride] = useState(null);
  const effectiveVariant = isPinnable ? isPinnedState ? "layout" : "overlay" : variantOverride ?? variantProp;
  const open = effectiveVariant === "layout" ? true : isOpenState;
  const closingProgrammaticallyRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const setPinned = useCallback(
    (next) => {
      var _a;
      if (next === isPinnedState) return;
      setPinnedInternal(next);
      onPinChange == null ? void 0 : onPinChange(next);
      (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("sp:pin", { bubbles: true, detail: { pinned: next } })
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
  const doCloseRef = useRef();
  const handleEngineClose = useCallback(() => {
    var _a;
    if (closingProgrammaticallyRef.current) return;
    (_a = doCloseRef.current) == null ? void 0 : _a.call(doCloseRef, true);
  }, []);
  const handleEngineOpen = useCallback(() => {
    if ((onOpen == null ? void 0 : onOpen()) === false) return false;
  }, [onOpen]);
  const surface = useOverlaySurface({
    type: "side-panel",
    priority: 0,
    triggerRef,
    panelRef: hostRef,
    isOpen: effectiveVariant === "overlay" ? isOpenState : false,
    onOpenChange: effectiveVariant === "overlay" ? onOpenChange : void 0,
    onOpen: handleEngineOpen,
    onClose: handleEngineClose,
    positioned: false,
    focus: "trap",
    initialFocus: "first",
    returnFocus: true,
    closeOnEscape: false,
    closeOnOutside: false,
    transition: "fade",
    transitionDuration: 200,
    activateAfterTransition: true,
    triggerAria: false,
    emitStyle: false,
    managesOwnFocus: true,
    managesOwnBackdrop: true
  });
  const doClose = useCallback(
    (fromEngine) => {
      var _a, _b, _c;
      if (effectiveVariant === "overlay" && !isOpenState) return;
      if (!fromEngine) {
        if (((_a = onCloseRef.current) == null ? void 0 : _a.call(onCloseRef)) === false) return;
      } else {
        (_b = onCloseRef.current) == null ? void 0 : _b.call(onCloseRef);
      }
      const ev = new CustomEvent("sp:close", {
        detail: {},
        bubbles: true,
        cancelable: !fromEngine
      });
      (_c = paneRef.current) == null ? void 0 : _c.dispatchEvent(ev);
      if (effectiveVariant === "overlay") {
        setOpenInternal(false);
        if (!fromEngine) {
          closingProgrammaticallyRef.current = true;
          surface.close();
          closingProgrammaticallyRef.current = false;
        }
      }
    },
    [effectiveVariant, isOpenState, surface, setOpenInternal]
  );
  doCloseRef.current = doClose;
  const handleOpen = useCallback(() => {
    if (effectiveVariant !== "overlay") return;
    if (isOpenState) return;
    if ((onOpen == null ? void 0 : onOpen()) === false) return;
    setOpen(true);
  }, [effectiveVariant, isOpenState, onOpen, setOpen]);
  const handleClose = useCallback(() => {
    doClose(false);
  }, [doClose]);
  const handleToggle = useCallback(() => {
    if (effectiveVariant !== "overlay") return;
    if (isOpenState) handleClose();
    else handleOpen();
  }, [effectiveVariant, isOpenState, handleOpen, handleClose]);
  const handlePinClick = useCallback(() => {
    if (isDisabled) return;
    pinClickedRef.current = true;
    setPinned(!isPinnedState);
  }, [isDisabled, isPinnedState, setPinned]);
  useEffect(() => {
    var _a;
    if (!pinClickedRef.current) return;
    pinClickedRef.current = false;
    (_a = pinBtnRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
  }, [isPinnedState]);
  useEffect(() => {
    if (effectiveVariant !== "overlay" || !open) return;
    const pane = paneRef.current;
    if (!pane) return;
    const timer = window.setTimeout(() => {
      pane.dispatchEvent(new CustomEvent("sp:open", { bubbles: true }));
    }, 200 + 16);
    return () => window.clearTimeout(timer);
  }, [effectiveVariant, open]);
  useEffect(() => {
    if (effectiveVariant !== "overlay" || !open || !closeOnEscape) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        doClose(true);
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [effectiveVariant, open, closeOnEscape, doClose]);
  useEffect(() => {
    if (effectiveVariant !== "overlay" || !open || !closeOnOutside) return;
    const onMouseDown = (e) => {
      var _a;
      const target = e.target;
      if (!target) return;
      if ((_a = hostRef.current) == null ? void 0 : _a.contains(target)) return;
      doClose(true);
    };
    document.addEventListener("mousedown", onMouseDown, true);
    return () => document.removeEventListener("mousedown", onMouseDown, true);
  }, [effectiveVariant, open, closeOnOutside, doClose]);
  const splitterResolved = useMemo(() => {
    if (hasSplitter === "auto") return effectiveVariant === "layout";
    return hasSplitter === true;
  }, [hasSplitter, effectiveVariant]);
  const initialResizeWidthRef = useRef(width);
  const [resizedWidth, setResizedWidth] = useState(null);
  useEffect(() => {
    if (initialResizeWidthRef.current !== width) {
      initialResizeWidthRef.current = width;
      setResizedWidth(null);
    }
  }, [width]);
  const renderedWidth = resizedWidth ?? width;
  const numericRenderedWidth = typeof renderedWidth === "number" ? renderedWidth : parseFloat(String(renderedWidth));
  const numericMinWidth = typeof minWidth === "number" ? minWidth : parseFloat(String(minWidth));
  const numericMaxWidth = typeof maxWidth === "number" ? maxWidth : maxWidth === null || maxWidth === void 0 ? null : parseFloat(String(maxWidth));
  useImperativeHandle(
    instanceRef,
    () => ({
      pinned(value) {
        if (value === void 0) return isPinnedState;
        if (!isPinnable) return;
        setPinned(value);
      },
      setVariant(next) {
        if (isPinnable) {
          setPinned(next === "layout");
          return;
        }
        setVariantOverride(next);
      },
      open: () => handleOpen(),
      close: () => handleClose(),
      toggle: () => handleToggle(),
      isOpen: () => open,
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
      setInfo: (config) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.setInfo(config);
      },
      updateAction: (id, patch) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.updateAction(id, patch);
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
      setTitle: (next) => {
        var _a;
        return (_a = shellRef.current) == null ? void 0 : _a.setTitle(next);
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
      isPinnedState,
      isPinnable,
      setPinned,
      handleOpen,
      handleClose,
      handleToggle,
      open,
      isLoading,
      isDisabled
    ]
  );
  const splitterClass = splitterResolved ? side === "right" ? "arvo-sp--with-splitter-l" : "arvo-sp--with-splitter-r" : null;
  const hostClasses = [
    "arvo-sp",
    `arvo-sp--${effectiveVariant}`,
    `arvo-sp--side-${side}`,
    isPinnable && "arvo-sp--pinnable",
    isClosable && "arvo-sp--closable",
    hasBackButton && "arvo-sp--with-back",
    isPinnable && (isPinnedState ? "is-pinned" : "is-unpinned"),
    effectiveVariant === "overlay" && open && "open",
    isLoading && "loading",
    isDisabled && "is-disabled",
    splitterClass,
    className
  ].filter(Boolean).join(" ");
  const styleVars = useMemo(() => {
    const widthCss = toCssLength(renderedWidth);
    const minWidthCss = toCssLength(minWidth);
    const maxWidthCss = toCssLength(maxWidth);
    const out = {};
    if (widthCss) out["--arvo-sp-width"] = widthCss;
    if (minWidthCss) out["--arvo-sp-min-width"] = minWidthCss;
    if (maxWidthCss) out["--arvo-sp-max-width"] = maxWidthCss;
    return out;
  }, [renderedWidth, minWidth, maxWidth]);
  const role = effectiveVariant === "overlay" ? "dialog" : "region";
  const ariaModalAttr = effectiveVariant === "overlay" ? "false" : void 0;
  const ariaHiddenAttr = effectiveVariant === "overlay" && !open ? true : void 0;
  const computedAriaLabel = ariaLabel ?? title ?? void 0;
  const splitterMin = Number.isFinite(numericMinWidth) && numericMinWidth > 0 ? numericMinWidth : 100;
  const splitterMax = numericMaxWidth !== null && Number.isFinite(numericMaxWidth) ? numericMaxWidth : 2e3;
  const splitterValue = Number.isFinite(numericRenderedWidth) && numericRenderedWidth > 0 ? Math.min(Math.max(numericRenderedWidth, splitterMin), splitterMax) : splitterMin;
  const splitterEl = splitterResolved ? /* @__PURE__ */ jsx(
    ArvoSplitter,
    {
      className: "arvo-sp__splitter",
      orientation: "vertical",
      inverse: side === "right",
      minSize: splitterMin,
      maxSize: splitterMax,
      value: splitterValue,
      ariaLabel: "Resize side panel",
      isDisabled,
      onResize: (next) => setResizedWidth(next)
    }
  ) : null;
  const splitterFirst = side === "right" ? splitterEl : null;
  const splitterLast = side === "left" ? splitterEl : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: hostRef,
      className: hostClasses,
      style: styleVars,
      ...rest,
      children: [
        splitterFirst,
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: paneRef,
            className: "arvo-sp__pane",
            role,
            "aria-modal": ariaModalAttr,
            "aria-hidden": ariaHiddenAttr,
            "aria-busy": isLoading || void 0,
            "aria-disabled": isDisabled || void 0,
            "aria-label": computedAriaLabel,
            children: /* @__PURE__ */ jsx(
              PanelShell,
              {
                ref: shellRef,
                parentBlock: "arvo-sp",
                title,
                hasHeader,
                hasBackButton,
                onBack,
                headerActions,
                stickyHeader,
                actions,
                isClosable,
                onClose: handleClose,
                isLoading,
                isDisabled,
                isPinnableCount: isPinnable ? 1 : 0,
                isClosableCount: isClosable ? 1 : 0,
                searchQuery,
                defaultSearchQuery,
                onSearchChange,
                onTabSelect,
                pinSlot: isPinnable ? /* @__PURE__ */ jsx(
                  PinButton,
                  {
                    ref: pinBtnRef,
                    isPinned: isPinnedState,
                    isDisabled,
                    onClick: handlePinClick
                  }
                ) : null,
                children
              }
            )
          }
        ),
        splitterLast
      ]
    }
  );
}
const ArvoSidePanel = forwardRef(SidePanelInner);
ArvoSidePanel.displayName = "ArvoSidePanel";
export {
  ArvoSidePanel
};
//# sourceMappingURL=index72.js.map
