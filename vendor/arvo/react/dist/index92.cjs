"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
const useOverlay = require("./index6.cjs");
const useFocusTrap = require("./index7.cjs");
const usePositioning = require("./index9.cjs");
function useOverlaySurface(options) {
  const {
    type,
    priority = 10,
    zIndex,
    parentId,
    relation,
    triggerRef,
    triggerAriaRef,
    anchorRect = null,
    panelRef,
    wrapperRef,
    isOpen: openProp,
    defaultOpen = false,
    onOpenChange,
    onOpen,
    onClose,
    placement = "bottom-start",
    gap = 2,
    width,
    observeContainerSelector,
    positioned: positioningEnabled = true,
    flip = "main-axis",
    lockPlacementOnFloatResize = false,
    focus = "none",
    initialFocus = "first",
    getOrderedElements,
    returnFocus = true,
    closeOnOutside = true,
    closeOnEscape = true,
    transition = "fade",
    transitionDuration = 150,
    activateAfterTransition = false,
    haspopup = true,
    controlsId,
    emitStyle = true,
    mask,
    lockScroll = false,
    managesOwnFocus: managesOwnFocusProp,
    managesOwnBackdrop: managesOwnBackdropProp,
    triggerAria,
    openClass = "open"
  } = options;
  const uid = React.useId();
  const surfaceId = `arvo-surface-${uid.replace(/[:]/g, "")}`;
  const ariaControls = controlsId ?? surfaceId;
  const overlay = useOverlay.useOverlay();
  const isClosingRef = React.useRef(false);
  const effectiveManagesOwnFocus = managesOwnFocusProp ?? focus === "trap";
  const effectiveManagesOwnBackdrop = managesOwnBackdropProp ?? !!mask;
  const maskRef = React.useRef(null);
  const scrollUnlockRef = React.useRef(null);
  const [trapActive, setTrapActive] = React.useState(false);
  const isControlled = openProp !== void 0;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? openProp : internalOpen;
  const [isMounted, setIsMounted] = React.useState(isOpen);
  const setOpen = React.useCallback(
    (next) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange == null ? void 0 : onOpenChange(next);
    },
    [isControlled, onOpenChange]
  );
  const open = React.useCallback(() => {
    if (isOpen) return;
    if ((onOpen == null ? void 0 : onOpen()) === false) return;
    setIsMounted(true);
    setOpen(true);
  }, [isOpen, onOpen, setOpen]);
  const close = React.useCallback(() => {
    if (!isOpen) return;
    if ((onClose == null ? void 0 : onClose()) === false) return;
    setOpen(false);
    if (returnFocus) {
      queueMicrotask(() => {
        const trigger = triggerRef.current;
        if (!trigger || !trigger.isConnected) return;
        if (document.activeElement === trigger || trigger.contains(document.activeElement)) {
          return;
        }
        const focused = document.activeElement;
        const focusIsLost = !focused || focused === document.body || focused === document.documentElement;
        const focusIsInClosingPanel = focused != null && panelRef.current != null && panelRef.current.contains(focused);
        if (!focusIsLost && !focusIsInClosingPanel) return;
        trigger.focus({ preventScroll: true });
      });
    }
  }, [isOpen, onClose, setOpen, returnFocus, triggerRef, panelRef]);
  const toggle = React.useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  React.useEffect(() => {
    if (isOpen) setIsMounted(true);
  }, [isOpen]);
  const { position, update: reposition } = usePositioning.usePositioning({
    anchorRef: triggerRef,
    anchorRect,
    floatRef: panelRef,
    placement,
    gap,
    enabled: isOpen && isMounted && positioningEnabled,
    width: width === "anchor" ? "anchor" : void 0,
    observeContainerSelector,
    flip,
    lockPlacementOnFloatResize
  });
  const positioned = positioningEnabled ? !!position : isMounted;
  React.useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    panelRef.current.classList.add(openClass);
    overlay.open({
      id: surfaceId,
      type,
      element: panelRef.current,
      triggerElement: triggerRef.current ?? void 0,
      priority,
      parentId,
      relation,
      zIndex,
      config: {
        autoCloseOnOutsideClick: closeOnOutside,
        managesOwnFocus: effectiveManagesOwnFocus || void 0,
        managesOwnBackdrop: effectiveManagesOwnBackdrop || void 0
      },
      onClose: close
    });
    if (wrapperRef == null ? void 0 : wrapperRef.current) {
      overlay.attachWrapperElement(surfaceId, wrapperRef.current);
    }
    return () => {
      if (wrapperRef == null ? void 0 : wrapperRef.current) {
        overlay.attachWrapperElement(surfaceId, null);
      }
      overlay.close(surfaceId);
    };
  }, [isOpen]);
  React.useEffect(() => {
    if (!transition || !isOpen || !positioned || !panelRef.current) return;
    const el = panelRef.current;
    void core.enter({ element: el, type: transition, duration: transitionDuration }).then(() => {
      if (activateAfterTransition) setTrapActive(true);
    });
  }, [isOpen, positioned, transition, transitionDuration, panelRef, activateAfterTransition]);
  React.useEffect(() => {
    if (isOpen || !isMounted || isClosingRef.current) return;
    setTrapActive(false);
    const el = panelRef.current;
    if (!el || !transition) {
      el == null ? void 0 : el.classList.remove(openClass);
      setIsMounted(false);
      return;
    }
    isClosingRef.current = true;
    void core.exit({
      element: el,
      type: transition,
      duration: transitionDuration,
      onComplete: () => {
        isClosingRef.current = false;
        el.classList.remove(openClass);
        setIsMounted(false);
      }
    });
  }, [isOpen, isMounted, transition, transitionDuration, panelRef, openClass]);
  React.useEffect(() => {
    if (!isOpen || !mask) return;
    const maskOpts = typeof mask === "object" ? { ...mask } : {};
    maskOpts.zIndex = overlay.getZIndex(surfaceId) - 1;
    if (maskOpts.closeOnClick == null) maskOpts.closeOnClick = closeOnOutside;
    if (closeOnOutside && !maskOpts.onOutside) {
      maskOpts.onOutside = () => close();
    }
    const inst = core.createMask(maskOpts);
    maskRef.current = inst;
    inst.show();
    return () => {
      inst.hide();
      maskRef.current = null;
    };
  }, [isOpen]);
  React.useEffect(() => {
    if (!isOpen || !lockScroll) return;
    scrollUnlockRef.current = core.lockPageScroll();
    return () => {
      var _a;
      (_a = scrollUnlockRef.current) == null ? void 0 : _a.call(scrollUnlockRef);
      scrollUnlockRef.current = null;
    };
  }, [isOpen, lockScroll]);
  const trapIsActive = focus === "trap" && isOpen && positioned && (!activateAfterTransition || trapActive);
  useFocusTrap.useFocusTrap(panelRef, {
    active: trapIsActive,
    escapeDeactivates: false,
    returnFocusOnDeactivate: returnFocus,
    allowOutsideClick: true,
    initialFocus,
    getOrderedElements,
    // Canonical return target -- prefer the live trigger over `saveFocus()`.
    // Function form so the trap resolves the current `triggerRef.current`
    // at deactivation time, not at activation time. This is what makes
    // focus return reliable for surfaces that move DOM focus AFTER trap
    // activation (e.g. ActionMenu's filter search input focused via rAF).
    returnFocusTo: () => triggerRef.current ?? null
  });
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, closeOnEscape, close]);
  React.useEffect(() => {
    if (!isOpen || !closeOnOutside || mask) return;
    const onPointerDown = (e) => {
      var _a;
      const target = e.target;
      if (overlay.isOverlayClickInside(panelRef.current, target)) return;
      if ((_a = triggerRef.current) == null ? void 0 : _a.contains(target)) return;
      close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen, closeOnOutside, close, overlay, panelRef, triggerRef, mask]);
  React.useEffect(() => {
    if (triggerAria === false) return;
    const el = (triggerAriaRef == null ? void 0 : triggerAriaRef.current) ?? triggerRef.current;
    if (!el) return;
    el.setAttribute("aria-haspopup", haspopup === true ? "true" : haspopup);
    el.setAttribute("aria-controls", ariaControls);
    el.setAttribute("aria-expanded", String(isOpen));
    return () => {
      el.removeAttribute("aria-haspopup");
      el.removeAttribute("aria-controls");
      el.removeAttribute("aria-expanded");
    };
  }, [isOpen, ariaControls, triggerRef, triggerAriaRef, haspopup, triggerAria]);
  const lastPositionRef = React.useRef(null);
  if (position) lastPositionRef.current = position;
  const effectivePosition = position ?? (isMounted && !isOpen ? lastPositionRef.current : null);
  const panelStyle = (() => {
    if (!emitStyle) return void 0;
    const style = {};
    if (effectivePosition) {
      style.translate = `${effectivePosition.x}px ${effectivePosition.y}px`;
      if (effectivePosition.maxHeight != null) {
        style["--arvo-overlay-max-height"] = `${effectivePosition.maxHeight}px`;
      }
      if (effectivePosition.width != null) {
        style["--arvo-overlay-width"] = effectivePosition.width;
      }
    }
    if (typeof width === "number") {
      style["--arvo-overlay-width"] = `${width}px`;
    } else if (typeof width === "string" && width !== "anchor") {
      style["--arvo-overlay-width"] = width;
    }
    if (positioningEnabled && !positioned && isOpen) {
      style.opacity = 0;
      style.pointerEvents = "none";
    }
    return Object.keys(style).length > 0 ? style : void 0;
  })();
  const triggerAriaProps = {
    "aria-haspopup": haspopup,
    "aria-controls": ariaControls,
    "aria-expanded": isOpen
  };
  const panelSide = (() => {
    const p = effectivePosition == null ? void 0 : effectivePosition.placement;
    if (!p) return void 0;
    if (p.startsWith("top")) return "top";
    if (p.startsWith("left")) return "left";
    if (p.startsWith("right")) return "right";
    return "bottom";
  })();
  return {
    isOpen,
    isMounted,
    positioned,
    position,
    surfaceId,
    open,
    close,
    toggle,
    setOpen,
    reposition,
    panelStyle,
    panelSide,
    triggerAriaProps
  };
}
exports.useOverlaySurface = useOverlaySurface;
//# sourceMappingURL=index92.cjs.map
