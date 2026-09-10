"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const PanelShell = require("./index105.cjs");
const useOverlaySurface = require("./index92.cjs");
const core = require("@arvo/core");
function toCssLength(value) {
  if (value === null || value === void 0) return void 0;
  return typeof value === "number" ? `${value}px` : value;
}
function resolveMask(hasMask, closeOnOutsideClickProp) {
  if (hasMask === void 0 || hasMask === false) {
    return {
      hasMask: false,
      closeOnClick: closeOnOutsideClickProp
    };
  }
  if (hasMask === true) {
    return {
      hasMask: true,
      closeOnClick: closeOnOutsideClickProp
    };
  }
  return {
    hasMask: true,
    closeOnClick: hasMask.closeOnClick ?? closeOnOutsideClickProp
  };
}
function resolveSide(side) {
  var _a;
  if (side === "top" || side === "bottom") {
    if (typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a.NODE_ENV) !== "production" && typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn(
        `[ArvoDrawer] side="${side}" is not supported; the design system only allows "left" and "right". Falling back to "right".`
      );
    }
    return "right";
  }
  return side;
}
function resolveContainer(container) {
  if (typeof document === "undefined") return null;
  if (container == null) return document.body;
  if (typeof container === "function") return container();
  return container;
}
function DrawerInner(props, ref) {
  core.warnDeprecated({
    component: "ArvoDrawer",
    successor: "ArvoPanel",
    reason: "Use displayMode='overlay' + placement='left'|'right' + isModal={hasMask}."
  });
  const {
    side: sideProp = "right",
    isOpen: isOpenProp,
    defaultOpen = false,
    onOpenChange,
    onOpen,
    onClose,
    hasMask = false,
    closeOnEscape = true,
    closeOnOutsideClick,
    closeOnMaskClick = true,
    lockScroll = "auto",
    container,
    width = 320,
    minWidth = 280,
    maxWidth = "80vw",
    height = null,
    animationDuration,
    ariaLabel,
    ariaLabelledBy,
    isClosable = true,
    isDisabled = false,
    isLoading: isLoadingProp = false,
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
    searchQuery,
    defaultSearchQuery,
    onSearchChange,
    onTabSelect,
    ...rest
  } = props;
  const isLoading = isLoadingProp === true;
  const side = resolveSide(sideProp);
  const closeOutside = closeOnOutsideClick !== void 0 ? closeOnOutsideClick : closeOnMaskClick;
  const mask = React.useMemo(
    () => resolveMask(hasMask, closeOutside),
    [hasMask, closeOutside]
  );
  const lockScrollResolved = lockScroll === "auto" ? mask.hasMask : lockScroll === true;
  const hostRef = React.useRef(null);
  const paneRef = React.useRef(null);
  const shellRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => hostRef.current, []);
  const closingProgrammaticallyRef = React.useRef(false);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  const handleEngineClose = React.useCallback(() => {
    if (closingProgrammaticallyRef.current) return;
  }, []);
  const maskOutsideRef = React.useRef();
  const surface = useOverlaySurface.useOverlaySurface({
    type: "side-panel",
    priority: 0,
    triggerRef,
    panelRef: hostRef,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    onOpen,
    onClose: handleEngineClose,
    positioned: false,
    focus: "trap",
    initialFocus: "first",
    returnFocus: true,
    closeOnEscape: false,
    closeOnOutside: false,
    transition: "fade",
    transitionDuration: animationDuration ?? 200,
    activateAfterTransition: true,
    mask: mask.hasMask ? {
      closeOnClick: mask.closeOnClick,
      onOutside: () => {
        var _a;
        return (_a = maskOutsideRef.current) == null ? void 0 : _a.call(maskOutsideRef);
      },
      className: "arvo-drw__overlay-mask"
    } : void 0,
    lockScroll: lockScrollResolved,
    triggerAria: false,
    emitStyle: false,
    managesOwnFocus: true,
    managesOwnBackdrop: true
  });
  const isOpenState = surface.isOpen;
  const doClose = React.useCallback(
    (reason, fromEngine) => {
      var _a, _b, _c;
      if (!fromEngine) {
        const vetoed = ((_a = onCloseRef.current) == null ? void 0 : _a.call(onCloseRef, reason)) === false;
        if (vetoed) return;
      } else {
        (_b = onCloseRef.current) == null ? void 0 : _b.call(onCloseRef, reason);
      }
      const ev = new CustomEvent("drw:close", {
        detail: { reason },
        bubbles: true,
        cancelable: !fromEngine
      });
      (_c = paneRef.current) == null ? void 0 : _c.dispatchEvent(ev);
      closingProgrammaticallyRef.current = true;
      surface.close();
      closingProgrammaticallyRef.current = false;
    },
    [surface]
  );
  maskOutsideRef.current = () => {
    var _a;
    (_a = paneRef.current) == null ? void 0 : _a.dispatchEvent(
      new CustomEvent("drw:mask-click", { bubbles: true })
    );
    doClose("mask-click", true);
  };
  const handleOpen = React.useCallback(() => {
    surface.open();
  }, [surface]);
  const handleToggle = React.useCallback(() => {
    if (surface.isOpen) {
      doClose("programmatic", false);
    } else {
      surface.open();
    }
  }, [surface, doClose]);
  React.useEffect(() => {
    if (!isOpenState) return;
    const pane = paneRef.current;
    if (!pane) return;
    const timer = window.setTimeout(() => {
      pane.dispatchEvent(new CustomEvent("drw:open", { bubbles: true }));
    }, (animationDuration ?? 200) + 16);
    return () => window.clearTimeout(timer);
  }, [isOpenState, animationDuration]);
  React.useEffect(() => {
    if (!isOpenState || !closeOnEscape) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        doClose("escape", true);
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpenState, closeOnEscape, doClose]);
  React.useEffect(() => {
    if (!isOpenState || mask.hasMask || !mask.closeOnClick) return;
    const onPointerDown = (e) => {
      var _a, _b;
      const target = e.target;
      if (!target) return;
      if ((_a = hostRef.current) == null ? void 0 : _a.contains(target)) return;
      (_b = paneRef.current) == null ? void 0 : _b.dispatchEvent(
        new CustomEvent("drw:mask-click", { bubbles: true })
      );
      doClose("mask-click", true);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [isOpenState, mask.hasMask, mask.closeOnClick, doClose]);
  const [resolvedContainer, setResolvedContainer] = React.useState(
    () => resolveContainer(container)
  );
  React.useEffect(() => {
    setResolvedContainer(resolveContainer(container));
  }, [container]);
  React.useImperativeHandle(
    instanceRef,
    () => ({
      open: () => handleOpen(),
      close: (reason) => doClose(reason ?? "programmatic", false),
      toggle: () => handleToggle(),
      isOpen: () => isOpenState,
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
      handleOpen,
      doClose,
      handleToggle,
      isOpenState,
      isLoading,
      isDisabled
    ]
  );
  const hostClasses = [
    "arvo-drw",
    `arvo-drw--side-${side}`,
    mask.hasMask && "arvo-drw--with-mask",
    isOpenState && "open",
    isLoading && "loading",
    isDisabled && "is-disabled",
    className
  ].filter(Boolean).join(" ");
  const styleVars = React.useMemo(() => {
    const out = {};
    const w = toCssLength(width);
    const minW = toCssLength(minWidth);
    const maxW = toCssLength(maxWidth);
    const h = toCssLength(height);
    if (w) out["--arvo-drw-width"] = w;
    if (minW) out["--arvo-drw-min-width"] = minW;
    if (maxW) out["--arvo-drw-max-width"] = maxW;
    if (h) out["--arvo-drw-height"] = h;
    if (animationDuration) {
      out["--arvo-drw-slide-duration"] = `${animationDuration}ms`;
    }
    return out;
  }, [width, minWidth, maxWidth, height, animationDuration]);
  const ariaModalAttr = mask.hasMask ? "true" : "false";
  const ariaHiddenAttr = !isOpenState ? true : void 0;
  const [shellTitleId, setShellTitleId] = React.useState(null);
  React.useEffect(() => {
    var _a, _b;
    setShellTitleId(((_b = (_a = shellRef.current) == null ? void 0 : _a.getTitleId) == null ? void 0 : _b.call(_a)) ?? null);
  }, [title, hasHeader, isOpenState]);
  const computedAriaLabelledBy = ariaLabelledBy ?? (title ? shellTitleId ?? void 0 : void 0);
  const computedAriaLabel = !title && !computedAriaLabelledBy && ariaLabel ? ariaLabel : void 0;
  if (!resolvedContainer) {
    return null;
  }
  const portalContents = /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref: hostRef,
      className: hostClasses,
      style: styleVars,
      ...rest,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: paneRef,
          className: "arvo-drw__pane",
          role: "dialog",
          "aria-modal": ariaModalAttr,
          "aria-hidden": ariaHiddenAttr,
          "aria-busy": isLoading || void 0,
          "aria-disabled": isDisabled || void 0,
          "aria-label": computedAriaLabel,
          "aria-labelledby": computedAriaLabelledBy,
          children: /* @__PURE__ */ jsxRuntime.jsx(
            PanelShell.PanelShell,
            {
              ref: shellRef,
              parentBlock: "arvo-drw",
              title,
              hasHeader,
              hasBackButton,
              onBack,
              headerActions,
              stickyHeader,
              actions,
              isClosable,
              onClose: () => doClose("close-button", false),
              isLoading,
              isDisabled,
              isClosableCount: isClosable ? 1 : 0,
              searchQuery,
              defaultSearchQuery,
              onSearchChange,
              onTabSelect,
              children
            }
          )
        }
      )
    }
  ) });
  return require$$0.createPortal(portalContents, resolvedContainer);
}
const ArvoDrawer = React.forwardRef(DrawerInner);
ArvoDrawer.displayName = "ArvoDrawer";
exports.ArvoDrawer = ArvoDrawer;
//# sourceMappingURL=index76.cjs.map
