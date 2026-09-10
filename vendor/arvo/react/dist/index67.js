import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useCallback, useEffect, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { useOverlaySurface } from "./index92.js";
import { renderInlineContentReact } from "./index89.js";
import { ArvoStatus } from "./index14.js";
import { ArvoBadge } from "./index45.js";
import { ArvoBannerAlert } from "./index48.js";
import ArvoLink from "./index32.js";
import ArvoButtonLink from "./index33.js";
import { ArvoButton } from "./index16.js";
const MAX_ACTIONS = 3;
function truncateActions(actions) {
  if (!actions || actions.length === 0) return [];
  if (actions.length <= MAX_ACTIONS) return actions;
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn(
      `[ArvoRichTooltip] actions limited to ${MAX_ACTIONS}; received ${actions.length}. Extra actions were dropped.`
    );
  }
  return actions.slice(0, MAX_ACTIONS);
}
function mapPlacement(p) {
  return p;
}
function resolveCloseFlags(behavior) {
  switch (behavior) {
    case "escape":
      return { closeOnEscape: true, closeOnOutside: false };
    case "outsideClick":
      return { closeOnEscape: false, closeOnOutside: true };
    case "manual":
      return { closeOnEscape: false, closeOnOutside: false };
    case "both":
    default:
      return { closeOnEscape: true, closeOnOutside: true };
  }
}
const ArvoRichTooltip = forwardRef(
  function ArvoRichTooltip2({
    isOpen: openProp,
    defaultOpen = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    trigger = "hover",
    triggerRef: triggerRefProp,
    renderTrigger,
    placement = "bottom-center",
    offset = 4,
    maxWidth = null,
    hasPointer = false,
    title,
    status,
    badge,
    banner,
    message,
    bodyContent,
    actions,
    closeBehavior = "both",
    ariaLabel,
    id: idProp,
    onOpen,
    onClose,
    onOpenChange,
    className,
    ...rest
  }, ref) {
    const uid = useId();
    const stableId = `arvo-rtip-${uid.replace(/[:]/g, "")}`;
    const panelId = idProp ?? stableId;
    const titleId = `${panelId}-title`;
    const panelRef = useRef(null);
    const internalTriggerRef = useRef(null);
    const triggerRef = triggerRefProp ?? internalTriggerRef;
    const isLoading = isLoadingProp === true;
    const effectiveActions = truncateActions(actions);
    const showFooter = effectiveActions.length > 0 && !isLoading;
    const hasHeader = Boolean(title || status || badge);
    const { closeOnEscape, closeOnOutside } = resolveCloseFlags(closeBehavior);
    const hoverOpenTimer = useRef(null);
    const hoverCloseTimer = useRef(null);
    const clearHoverTimers = useCallback(() => {
      if (hoverOpenTimer.current) {
        clearTimeout(hoverOpenTimer.current);
        hoverOpenTimer.current = null;
      }
      if (hoverCloseTimer.current) {
        clearTimeout(hoverCloseTimer.current);
        hoverCloseTimer.current = null;
      }
    }, []);
    const isOpenRef = useRef(false);
    const closingProgrammaticallyRef = useRef(false);
    const suppressFocusOpenRef = useRef(false);
    const restorePanelFocusToTrigger = useCallback(() => {
      const trigger2 = triggerRef.current;
      const panel2 = panelRef.current;
      const active = document.activeElement;
      if (!trigger2 || !panel2 || !active) return;
      if (!panel2.contains(active)) return;
      suppressFocusOpenRef.current = true;
      trigger2.focus({ preventScroll: true });
      setTimeout(() => {
        suppressFocusOpenRef.current = false;
      }, 0);
    }, [triggerRef]);
    const handleHookOpen = useCallback(() => {
      var _a;
      if (isDisabled) return false;
      if ((onOpen == null ? void 0 : onOpen()) === false) return false;
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("rtip:open", { bubbles: true, cancelable: true })
      );
    }, [isDisabled, onOpen, triggerRef]);
    const handleHookClose = useCallback(() => {
      var _a;
      clearHoverTimers();
      restorePanelFocusToTrigger();
      if (closingProgrammaticallyRef.current) return;
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("rtip:close", { bubbles: true, cancelable: false })
      );
      onClose == null ? void 0 : onClose();
    }, [triggerRef, onClose, clearHoverTimers, restorePanelFocusToTrigger]);
    const surface = useOverlaySurface({
      type: "tooltip",
      priority: 10,
      triggerRef,
      panelRef,
      placement: mapPlacement(placement),
      gap: offset,
      // Tooltips intentionally cascade to adjacent (perpendicular) sides
      // when neither the requested side nor its opposite fits. Documented
      // in `descriptors/rich-tooltip.json` + `descriptors/tooltip.json`.
      flip: "any",
      transition: "fade",
      transitionDuration: 150,
      focus: "none",
      // never trap; tab continues through page content
      // ArvoRichTooltip never owns focus (focus: 'none'), so the engine's
      // default "return focus to trigger on close" belt-and-braces is not
      // just unnecessary -- it actively fights our own trigger listeners.
      // For `trigger: 'hover'` and `trigger: 'focus'` we bind `focus` on the
      // trigger (WCAG 1.4.13 keyboard parity). If the engine programmatically
      // re-focuses the trigger after an outside-click / pointerleave / Escape
      // close, that synthetic focus event immediately re-opens the tooltip,
      // producing the "flash close, reopen" loop reported in the playground
      // and consumer apps. Opting out here keeps the natural focus target
      // (wherever the user's action landed) and breaks the loop.
      returnFocus: false,
      isOpen: openProp,
      defaultOpen,
      onOpenChange,
      onOpen: handleHookOpen,
      onClose: handleHookClose,
      closeOnEscape,
      closeOnOutside,
      triggerAria: false,
      // we wire aria-describedby manually below
      emitStyle: false
    });
    isOpenRef.current = surface.isOpen;
    const prevOpenRef = useRef(surface.isOpen);
    useEffect(() => {
      var _a;
      if (prevOpenRef.current === surface.isOpen) return;
      prevOpenRef.current = surface.isOpen;
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("rtip:openchange", {
          bubbles: true,
          detail: { isOpen: surface.isOpen }
        })
      );
    }, [surface.isOpen, triggerRef]);
    const surfaceClose = surface.close;
    const handleProgrammaticClose = useCallback(() => {
      var _a;
      if (!isOpenRef.current) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const evt = new CustomEvent("rtip:close", {
        bubbles: true,
        cancelable: true
      });
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      clearHoverTimers();
      restorePanelFocusToTrigger();
      closingProgrammaticallyRef.current = true;
      surfaceClose();
      closingProgrammaticallyRef.current = false;
    }, [
      onClose,
      triggerRef,
      clearHoverTimers,
      surfaceClose,
      restorePanelFocusToTrigger
    ]);
    const surfaceOpen = surface.open;
    const toggleOpen = useCallback(() => {
      if (isDisabled) return;
      if (isOpenRef.current) handleProgrammaticClose();
      else surfaceOpen();
    }, [isDisabled, handleProgrammaticClose, surfaceOpen]);
    useImperativeHandle(
      ref,
      () => ({
        get element() {
          return panelRef.current;
        },
        open: () => {
          if (isDisabled) return;
          surfaceOpen();
        },
        close: handleProgrammaticClose,
        toggle: toggleOpen,
        isOpen: () => isOpenRef.current,
        reposition: () => surface.reposition()
      }),
      [isDisabled, surfaceOpen, handleProgrammaticClose, toggleOpen, surface]
    );
    useEffect(() => {
      if (isDisabled && isOpenRef.current) {
        handleProgrammaticClose();
      }
    }, [isDisabled, handleProgrammaticClose]);
    useEffect(() => {
      const el = triggerRef.current;
      if (!el || trigger === "manual") return;
      if (trigger === "click") {
        const onClick = () => {
          if (isDisabled) return;
          toggleOpen();
        };
        el.addEventListener("click", onClick);
        return () => el.removeEventListener("click", onClick);
      }
      if (trigger === "hover") {
        const onEnter = () => {
          if (isDisabled) return;
          clearHoverTimers();
          hoverOpenTimer.current = setTimeout(surfaceOpen, 150);
        };
        const onLeave = () => {
          clearHoverTimers();
          hoverCloseTimer.current = setTimeout(handleProgrammaticClose, 100);
        };
        const onFocus = () => {
          if (isDisabled) return;
          if (suppressFocusOpenRef.current) return;
          surfaceOpen();
        };
        const onBlur = () => {
          if (suppressFocusOpenRef.current) return;
          setTimeout(() => {
            if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
              handleProgrammaticClose();
            }
          }, 0);
        };
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
        return () => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
          clearHoverTimers();
        };
      }
      if (trigger === "focus") {
        const onFocus = () => {
          if (isDisabled) return;
          if (suppressFocusOpenRef.current) return;
          surfaceOpen();
        };
        const onBlur = () => {
          if (suppressFocusOpenRef.current) return;
          setTimeout(() => {
            if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
              handleProgrammaticClose();
            }
          }, 0);
        };
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
        return () => {
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
        };
      }
    }, [
      trigger,
      triggerRef,
      isDisabled,
      toggleOpen,
      surfaceOpen,
      handleProgrammaticClose,
      clearHoverTimers
    ]);
    useEffect(() => {
      const el = triggerRef.current;
      if (!el) return;
      const existing = el.getAttribute("aria-describedby");
      const ids = existing ? existing.split(/\s+/).filter(Boolean) : [];
      if (!ids.includes(panelId)) ids.push(panelId);
      el.setAttribute("aria-describedby", ids.join(" "));
      return () => {
        const current = el.getAttribute("aria-describedby");
        if (!current) return;
        const next = current.split(/\s+/).filter((token) => token && token !== panelId);
        if (next.length > 0) {
          el.setAttribute("aria-describedby", next.join(" "));
        } else {
          el.removeAttribute("aria-describedby");
        }
      };
    }, [triggerRef, panelId]);
    const handlePanelPointerEnter = useCallback(() => {
      if (trigger !== "hover") return;
      clearHoverTimers();
    }, [trigger, clearHoverTimers]);
    const handlePanelPointerLeave = useCallback(() => {
      if (trigger !== "hover") return;
      hoverCloseTimer.current = setTimeout(handleProgrammaticClose, 100);
    }, [trigger, handleProgrammaticClose]);
    const renderStatus = () => {
      if (!status) return null;
      return /* @__PURE__ */ jsx(
        ArvoStatus,
        {
          ...status,
          size: "sm",
          placement: "inline"
        }
      );
    };
    const renderBadge = () => {
      if (!badge) return null;
      return /* @__PURE__ */ jsx(
        ArvoBadge,
        {
          ...badge,
          size: "sm",
          placement: "inline"
        }
      );
    };
    const renderBanner = () => {
      if (!banner) return null;
      const { message: bannerMessage, type = "warning", isDismissible = true, role, onDismiss, className: bannerClass } = banner;
      return /* @__PURE__ */ jsx("div", { className: "arvo-rtip__banner", children: /* @__PURE__ */ jsx(
        ArvoBannerAlert,
        {
          message: bannerMessage,
          type,
          isCompact: true,
          isDismissible,
          role,
          onDismiss,
          className: bannerClass
        }
      ) });
    };
    const renderAction = (action, idx) => {
      const key = action.id ?? `rtip-action-${idx}`;
      const dataActionId = action.id ?? key;
      const handleActionClick = (e) => {
        var _a;
        if (action.isDisabled) return;
        (_a = action.onClick) == null ? void 0 : _a.call(action, e);
      };
      if (action.kind === "link") {
        return /* @__PURE__ */ jsx(
          ArvoLink,
          {
            "data-action-id": dataActionId,
            variant: "primary",
            size: "sm",
            label: action.label,
            href: action.href ?? "#",
            icon: action.icon,
            isExternal: action.isExternal,
            isDisabled: action.isDisabled,
            onClick: handleActionClick
          },
          key
        );
      }
      if (action.kind === "buttonLink") {
        return /* @__PURE__ */ jsx(
          ArvoButtonLink,
          {
            "data-action-id": dataActionId,
            variant: "outline",
            size: "sm",
            label: action.label,
            href: action.href ?? "#",
            icon: action.icon,
            hasExternalLink: action.isExternal,
            isDisabled: action.isDisabled,
            onClick: handleActionClick
          },
          key
        );
      }
      return /* @__PURE__ */ jsx(
        ArvoButton,
        {
          "data-action-id": dataActionId,
          variant: "inline",
          size: "sm",
          label: action.label,
          icon: action.icon,
          isDisabled: action.isDisabled,
          onClick: handleActionClick
        },
        key
      );
    };
    const renderHeader = () => {
      if (!hasHeader) return null;
      return /* @__PURE__ */ jsxs("div", { className: "arvo-rtip__hdr", children: [
        title && /* @__PURE__ */ jsx("span", { id: titleId, className: "arvo-rtip__title", children: title }),
        (status || badge) && /* @__PURE__ */ jsxs("div", { className: "arvo-rtip__hdr-meta", children: [
          renderStatus(),
          renderBadge()
        ] })
      ] });
    };
    const renderBody = () => {
      return /* @__PURE__ */ jsxs("div", { className: "arvo-rtip__bdy", children: [
        renderBanner(),
        message != null && /* @__PURE__ */ jsx("div", { className: "arvo-rtip__msg", children: renderInlineContentReact(message, { profile: "basic-inline" }) }),
        bodyContent != null && /* @__PURE__ */ jsx("div", { className: "arvo-rtip__slot", children: bodyContent })
      ] });
    };
    const renderFooter = () => {
      if (!showFooter) return null;
      return /* @__PURE__ */ jsx("div", { className: "arvo-rtip__ftr", children: effectiveActions.map((action, idx) => renderAction(action, idx)) });
    };
    const panelClasses = [
      "arvo-rtip",
      `arvo-rtip--${placement}`,
      hasPointer && "arvo-rtip--with-pointer",
      showFooter && "arvo-rtip--with-footer",
      surface.isMounted && "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const panelStyle = {};
    if (surface.position) {
      panelStyle.translate = `${surface.position.x}px ${surface.position.y}px`;
    }
    if (typeof maxWidth === "number") {
      panelStyle["--arvo-rtip-max-width"] = `${maxWidth}px`;
    } else if (typeof maxWidth === "string") {
      panelStyle["--arvo-rtip-max-width"] = maxWidth;
    }
    if (!surface.positioned) {
      panelStyle.opacity = 0;
      panelStyle.pointerEvents = "none";
    }
    const triggerContent = renderTrigger ? renderTrigger({
      ref: internalTriggerRef,
      "aria-describedby": panelId
    }) : null;
    const panelNode = surface.isMounted ? /* @__PURE__ */ jsxs(
      "div",
      {
        ref: panelRef,
        id: panelId,
        className: panelClasses,
        role: "tooltip",
        "aria-busy": isLoading || void 0,
        "aria-labelledby": !ariaLabel && title ? titleId : void 0,
        "aria-label": ariaLabel || void 0,
        "data-arvo-side": surface.panelSide,
        style: Object.keys(panelStyle).length > 0 ? panelStyle : void 0,
        onPointerEnter: handlePanelPointerEnter,
        onPointerLeave: handlePanelPointerLeave,
        ...rest,
        children: [
          renderHeader(),
          renderBody(),
          renderFooter(),
          hasPointer && /* @__PURE__ */ jsx("div", { className: "arvo-rtip__pointer", "aria-hidden": "true" })
        ]
      }
    ) : null;
    const panel = panelNode ? typeof document !== "undefined" ? createPortal(panelNode, document.body) : null : null;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      triggerContent,
      panel
    ] });
  }
);
export {
  ArvoRichTooltip
};
//# sourceMappingURL=index67.js.map
