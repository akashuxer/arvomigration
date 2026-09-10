import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useState, useCallback, useEffect, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { createResizeHandle, resolveOverlayInitialFocus } from "@arvo/core";
import { ArvoButton } from "./index16.js";
import { ArvoIconButton } from "./index17.js";
import ArvoDropdownIconButton from "./index60.js";
import ArvoSwitch from "./index26.js";
import ArvoEmptyState from "./index88.js";
import { ArvoStatus } from "./index14.js";
import { ArvoBadge } from "./index45.js";
import { useOverlaySurface } from "./index92.js";
import { clampFooterActions, attachOverlayFooterFit } from "@arvo/utils";
const ALERT_ICON_GLYPH = {
  positive: "status-success-filled",
  warning: "exclamation-triangle-filled",
  negative: "status-error-filled",
  block: "prohibit",
  info: "info-circle-filled"
};
function mapPlacement(p) {
  switch (p) {
    case "top":
      return "top-start";
    case "bottom":
      return "bottom-start";
    case "left":
      return "left-start";
    case "right":
      return "right-start";
    default:
      return p;
  }
}
const ArvoPopover = forwardRef(
  function ArvoPopover2({
    variant = "space",
    placement = "auto",
    title,
    hasHeader = true,
    isClosable = true,
    hasBackButton = false,
    hasIcon = false,
    icon,
    hasAlert = false,
    alertType = "warning",
    hasStatusIndicator = false,
    statusType = "available",
    badge = null,
    headerActions,
    stickyHeader,
    stickyBody,
    emptyContent,
    children,
    actions,
    footerLeftSlot = null,
    hasFooter = true,
    width = null,
    offset = 4,
    trigger = "click",
    closeOnOutside = true,
    hasArrow = false,
    isLoading: isLoadingProp = false,
    isInteractive = true,
    initialFocus = "auto",
    isOpen: openProp,
    defaultOpen = false,
    isResizable = false,
    onOpenChange,
    onOpen,
    onClose,
    onBack,
    onResize,
    onResizeCommit,
    triggerRef: triggerRefProp,
    renderTrigger,
    isInline = false,
    className,
    ...rest
  }, ref) {
    const uid = useId();
    const panelId = `arvo-popover-${uid}`;
    const titleId = `arvo-popover-title-${uid}`;
    const panelRef = useRef(null);
    const headerRef = useRef(null);
    const stickyHeaderRef = useRef(null);
    const bodyRef = useRef(null);
    const footerRef = useRef(null);
    const footerActionsRef = useRef(null);
    const resizeHostRef = useRef(null);
    const resizeInstanceRef = useRef(null);
    const internalTriggerRef = useRef(null);
    const triggerRef = triggerRefProp ?? internalTriggerRef;
    const resolvedStickyHeader = stickyBody ?? stickyHeader;
    const [bodyOverride, setBodyOverride] = useState(null);
    const [loadingOverride, setLoadingOverride] = useState(null);
    const [footerVisibleOverride, setFooterVisibleOverride] = useState(null);
    const [actionsOverride, setActionsOverride] = useState(null);
    const repositionRef = useRef(() => {
    });
    const isLoading = isLoadingProp === true;
    const effectiveLoading = (loadingOverride ?? isLoading) === true;
    const effectiveActions = clampFooterActions(
      actionsOverride ?? actions ?? [],
      { componentName: "ArvoPopover" }
    );
    const hasFooterLeft = footerLeftSlot != null && footerLeftSlot !== false;
    const showFooter = hasFooter && (footerVisibleOverride ?? true) && !emptyContent && (effectiveActions.length > 0 || hasFooterLeft);
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
    const [inlineInternalOpen, setInlineInternalOpen] = useState(
      // seed from defaultOpen only; openProp is handled reactively below
      isInline ? defaultOpen : false
    );
    const inlineIsOpen = isInline ? openProp !== void 0 ? openProp : inlineInternalOpen : false;
    const setInlineOpen = useCallback(
      (next) => {
        if (openProp === void 0) setInlineInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [openProp, onOpenChange]
    );
    const closingProgrammaticallyRef = useRef(false);
    const isOpenRef = useRef(false);
    const handleHookOpen = useCallback(() => {
      var _a;
      if ((onOpen == null ? void 0 : onOpen()) === false) return false;
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("popover:open", { bubbles: true })
      );
    }, [onOpen, triggerRef]);
    const handleHookClose = useCallback(() => {
      var _a;
      clearHoverTimers();
      if (closingProgrammaticallyRef.current) return;
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("popover:close", { bubbles: true, cancelable: false })
      );
      onClose == null ? void 0 : onClose();
    }, [triggerRef, onClose, clearHoverTimers]);
    const surface = useOverlaySurface({
      type: "popover",
      priority: 10,
      triggerRef,
      panelRef,
      haspopup: "dialog",
      controlsId: panelId,
      placement: mapPlacement(placement),
      gap: offset,
      width: width === "anchor" ? "anchor" : void 0,
      transition: "fade",
      transitionDuration: 150,
      focus: isInteractive ? "trap" : "none",
      initialFocus: initialFocus === "none" ? "none" : () => resolveOverlayInitialFocus({
        initialFocus,
        root: panelRef.current,
        stickyHeader: stickyHeaderRef.current,
        body: bodyRef.current,
        footer: footerRef.current,
        header: headerRef.current
      }),
      // Inline: force the hook dormant so hub/outside-click/trap never run.
      isOpen: isInline ? false : openProp,
      defaultOpen: isInline ? false : defaultOpen,
      onOpenChange: isInline ? void 0 : onOpenChange,
      onOpen: isInline ? void 0 : handleHookOpen,
      onClose: isInline ? void 0 : handleHookClose,
      positioned: isInline ? false : void 0,
      closeOnEscape: !isInline,
      closeOnOutside: isInline ? false : closeOnOutside,
      emitStyle: false
    });
    const effectiveIsOpen = isInline ? inlineIsOpen : surface.isOpen;
    const effectiveIsMounted = isInline ? inlineIsOpen : surface.isMounted;
    const effectivePositioned = isInline ? true : surface.positioned;
    const effectivePosition = isInline ? null : surface.position;
    isOpenRef.current = effectiveIsOpen;
    repositionRef.current = isInline ? (() => {
    }) : surface.reposition;
    const prevInlineOpenRef = useRef(false);
    useEffect(() => {
      var _a;
      if (!isInline) return;
      const wasOpen = prevInlineOpenRef.current;
      prevInlineOpenRef.current = inlineIsOpen;
      if (inlineIsOpen && !wasOpen) {
        (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("popover:open", { bubbles: true })
        );
      }
    }, [isInline, inlineIsOpen, triggerRef]);
    const surfaceClose = surface.close;
    const handleProgrammaticClose = useCallback(() => {
      var _a;
      if (!isOpenRef.current) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const evt = new CustomEvent("popover:close", {
        bubbles: true,
        cancelable: true
      });
      (_a = triggerRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      clearHoverTimers();
      if (isInline) {
        setInlineOpen(false);
      } else {
        closingProgrammaticallyRef.current = true;
        surfaceClose();
        closingProgrammaticallyRef.current = false;
      }
    }, [isInline, onClose, triggerRef, clearHoverTimers, surfaceClose, setInlineOpen]);
    const surfaceOpen = surface.open;
    const toggleOpen = useCallback(() => {
      if (isOpenRef.current) handleProgrammaticClose();
      else surfaceOpen();
    }, [handleProgrammaticClose, surfaceOpen]);
    useImperativeHandle(
      ref,
      () => ({
        get element() {
          return panelRef.current;
        },
        renderBody: (content) => {
          setBodyOverride(content);
          repositionRef.current();
        },
        setLoading: (loading) => {
          setLoadingOverride(loading);
        },
        setFooterVisible: (visible) => {
          setFooterVisibleOverride(visible);
        },
        updateFooterAction: (actionId, props) => {
          setActionsOverride((prev) => {
            const base = prev ?? actions ?? [];
            return base.map(
              (action) => action.id === actionId ? { ...action, ...props } : action
            );
          });
        },
        reposition: () => {
          repositionRef.current();
        }
      }),
      [actions]
    );
    useEffect(() => {
      const el = triggerRef.current;
      if (!el || isInline) return;
      if (trigger === "click") {
        const onClick = () => toggleOpen();
        el.addEventListener("click", onClick);
        return () => el.removeEventListener("click", onClick);
      }
      if (trigger === "hover") {
        const onEnter = () => {
          clearHoverTimers();
          hoverOpenTimer.current = setTimeout(surfaceOpen, 150);
        };
        const onLeave = () => {
          clearHoverTimers();
          hoverCloseTimer.current = setTimeout(handleProgrammaticClose, 100);
        };
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
          clearHoverTimers();
        };
      }
      if (trigger === "focus") {
        const onFocus = () => surfaceOpen();
        const onBlur = () => {
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
    }, [trigger, triggerRef, isInline, toggleOpen, surfaceOpen, handleProgrammaticClose, clearHoverTimers]);
    const handlePanelPointerEnter = useCallback(() => {
      if (trigger !== "hover") return;
      clearHoverTimers();
    }, [trigger, clearHoverTimers]);
    const handlePanelPointerLeave = useCallback(() => {
      if (trigger !== "hover") return;
      hoverCloseTimer.current = setTimeout(handleProgrammaticClose, 100);
    }, [trigger, handleProgrammaticClose]);
    useEffect(() => {
      if (!isResizable || isInline) return;
      if (!effectiveIsMounted) return;
      const panel2 = panelRef.current;
      const host = resizeHostRef.current;
      if (!panel2 || !host) return;
      const POPOVER_MIN_WIDTH = 270;
      const POPOVER_MAX_WIDTH = 700;
      const POPOVER_MIN_HEIGHT = 80;
      const POPOVER_MAX_HEIGHT = 700;
      const VIEWPORT_PADDING = 16;
      const handle = createResizeHandle(panel2, {
        corners: ["bottom-right"],
        min: { width: POPOVER_MIN_WIDTH, height: POPOVER_MIN_HEIGHT },
        max: (rect) => ({
          width: Math.max(
            POPOVER_MIN_WIDTH,
            Math.min(
              POPOVER_MAX_WIDTH,
              window.innerWidth - rect.left - VIEWPORT_PADDING
            )
          ),
          height: Math.max(
            POPOVER_MIN_HEIGHT,
            Math.min(
              POPOVER_MAX_HEIGHT,
              window.innerHeight - rect.top - VIEWPORT_PADDING
            )
          )
        }),
        viewportPadding: VIEWPORT_PADDING,
        block: "arvo-popover",
        host,
        onResize: (rect) => {
          onResize == null ? void 0 : onResize(rect);
        },
        onCommit: (rect) => {
          onResizeCommit == null ? void 0 : onResizeCommit(rect);
        }
      });
      handle.mount();
      resizeInstanceRef.current = handle;
      return () => {
        handle.destroy();
        resizeInstanceRef.current = null;
      };
    }, [isResizable, isInline, effectiveIsMounted, onResize, onResizeCommit]);
    const footerActionsCount = effectiveActions.length;
    useEffect(() => {
      if (!effectiveIsMounted) return;
      const host = footerActionsRef.current;
      if (!host) return;
      const fit = attachOverlayFooterFit(host, { gap: 6 });
      return () => fit.destroy();
    }, [effectiveIsMounted, footerActionsCount]);
    const handleActionClick = useCallback(
      (action, e) => {
        const callback = action.action ?? action.onClick;
        const result = callback == null ? void 0 : callback(e);
        if (result !== false) handleProgrammaticClose();
      },
      [handleProgrammaticClose]
    );
    const renderHeaderAction = (ha) => {
      const wrap = (node) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "arvo-popover__header-action",
          "data-action-id": ha.id,
          "data-action-type": ha.type,
          children: node
        },
        ha.id
      );
      if (ha.type === "btn") {
        return wrap(
          /* @__PURE__ */ jsx(
            ArvoIconButton,
            {
              icon: ha.icon,
              variant: "tertiary",
              size: "sm",
              tooltip: ha.label ?? ha.id,
              onClick: ha.onClick,
              isDisabled: effectiveLoading || ha.isDisabled
            }
          )
        );
      }
      if (ha.type === "inline") {
        return wrap(
          /* @__PURE__ */ jsx(
            ArvoButton,
            {
              label: ha.label,
              icon: ha.icon,
              variant: "inline",
              size: "sm",
              onClick: ha.onClick,
              isDisabled: effectiveLoading || ha.isDisabled
            }
          )
        );
      }
      if (ha.type === "switch") {
        return wrap(
          /* @__PURE__ */ jsx(
            ArvoSwitch,
            {
              isChecked: ha.isChecked,
              defaultChecked: ha.defaultChecked,
              isDisabled: effectiveLoading || ha.isDisabled,
              isLoading: effectiveLoading,
              "aria-label": ha.label ?? ha.id,
              onChange: ({ isChecked }) => {
                var _a;
                if (effectiveLoading || ha.isDisabled) return;
                (_a = ha.onChange) == null ? void 0 : _a.call(ha, isChecked);
              }
            }
          )
        );
      }
      const tooltip = ha.ariaLabel ?? ha.label ?? ha.id;
      return wrap(
        /* @__PURE__ */ jsx("span", { className: "arvo-popover__header-action-trigger", children: /* @__PURE__ */ jsx(
          ArvoDropdownIconButton,
          {
            icon: ha.icon,
            variant: "tertiary",
            size: "sm",
            tooltip,
            items: ha.items,
            placement: ha.placement ?? "bottom-end",
            isDisabled: effectiveLoading || ha.isDisabled,
            isLoading: effectiveLoading,
            onSelect: (item) => {
              var _a;
              if (effectiveLoading || ha.isDisabled) return;
              (_a = ha.onSelect) == null ? void 0 : _a.call(ha, item.id);
            }
          }
        ) })
      );
    };
    const panelClasses = [
      "arvo-popover",
      variant === "edge" && "arvo-popover--edge",
      hasArrow && "arvo-popover--with-arrow",
      showFooter && "arvo-popover--with-footer",
      hasFooterLeft && "arvo-popover--with-footer-left",
      isClosable && "arvo-popover--closable",
      isResizable && !isInline && "arvo-popover--with-resize",
      isInline && "arvo-popover--inline",
      effectiveIsMounted && "open",
      effectiveLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const panelStyle = {
      ...effectivePosition ? { translate: `${effectivePosition.x}px ${effectivePosition.y}px` } : {},
      ...(effectivePosition == null ? void 0 : effectivePosition.maxHeight) != null ? { "--arvo-popover-max-height": `${effectivePosition.maxHeight}px` } : {},
      ...(effectivePosition == null ? void 0 : effectivePosition.width) != null ? { "--arvo-popover-width": effectivePosition.width } : {},
      ...typeof width === "number" ? { "--arvo-popover-width": `${width}px` } : {},
      ...typeof width === "string" && width !== "anchor" ? { "--arvo-popover-width": width } : {},
      ...!effectivePositioned ? { opacity: 0, pointerEvents: "none" } : {}
    };
    const dataArvoSide = (() => {
      const placement2 = (effectivePosition == null ? void 0 : effectivePosition.placement) ?? null;
      if (placement2) {
        if (placement2.startsWith("top")) return "top";
        if (placement2.startsWith("left")) return "left";
        if (placement2.startsWith("right")) return "right";
        return "bottom";
      }
      return void 0;
    })();
    const renderHeader = () => {
      const hasAnyHeaderContent = isClosable || title || hasBackButton || hasIcon || hasAlert || hasStatusIndicator || badge != null || headerActions && headerActions.length > 0;
      if (!hasHeader || !hasAnyHeaderContent) return null;
      const alertGlyph = hasAlert ? ALERT_ICON_GLYPH[alertType] : null;
      return /* @__PURE__ */ jsxs("div", { ref: headerRef, className: "arvo-popover__header", children: [
        /* @__PURE__ */ jsxs("div", { className: "arvo-popover__header-left", children: [
          hasBackButton && /* @__PURE__ */ jsx("span", { className: "arvo-popover__back-btn", children: /* @__PURE__ */ jsx(
            ArvoIconButton,
            {
              icon: "arrow-left",
              variant: "secondary",
              size: "sm",
              tooltip: "Back",
              "aria-label": "Back",
              onClick: onBack,
              isDisabled: effectiveLoading
            }
          ) }),
          hasAlert && alertGlyph && /* @__PURE__ */ jsx(
            "i",
            {
              className: `arvo-popover__alert-ico arvo-popover__alert-ico--${alertType} o9con o9con-${alertGlyph}`,
              "aria-hidden": "true"
            }
          ),
          hasIcon && icon && /* @__PURE__ */ jsx(
            "i",
            {
              className: `arvo-popover__lead-ico o9con o9con-${icon}`,
              "aria-hidden": "true"
            }
          ),
          title && /* @__PURE__ */ jsx("span", { id: titleId, className: "arvo-popover__title", children: title }),
          hasStatusIndicator && /* @__PURE__ */ jsx("span", { className: "arvo-popover__status", children: /* @__PURE__ */ jsx(ArvoStatus, { type: statusType, size: "sm", placement: "inline" }) }),
          badge && /* @__PURE__ */ jsx("span", { className: "arvo-popover__badge", children: /* @__PURE__ */ jsx(
            ArvoBadge,
            {
              ...badge,
              variant: "label",
              size: "sm",
              placement: "inline"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "arvo-popover__header-actions", children: [
          headerActions == null ? void 0 : headerActions.map((ha) => renderHeaderAction(ha)),
          isClosable && /* @__PURE__ */ jsx("span", { className: "arvo-popover__close-btn", children: /* @__PURE__ */ jsx(
            ArvoIconButton,
            {
              icon: "close",
              variant: "tertiary",
              size: "sm",
              tooltip: "Close",
              "aria-label": "Close",
              onClick: handleProgrammaticClose,
              isDisabled: effectiveLoading
            }
          ) })
        ] })
      ] });
    };
    const renderBodyContent = () => {
      if (emptyContent) {
        return /* @__PURE__ */ jsx(
          ArvoEmptyState,
          {
            ...emptyContent,
            size: "sm",
            orientation: "vertical"
          }
        );
      }
      if (bodyOverride !== null) {
        return bodyOverride;
      }
      return children;
    };
    const renderFooter = () => {
      if (!showFooter) return null;
      const hasRightCluster = effectiveActions.length > 0;
      return /* @__PURE__ */ jsxs("div", { ref: footerRef, className: "arvo-popover__footer", children: [
        hasFooterLeft && /* @__PURE__ */ jsx("div", { className: "arvo-popover__footer-left", children: footerLeftSlot }),
        hasRightCluster && /* @__PURE__ */ jsx(
          "div",
          {
            ref: footerActionsRef,
            className: "arvo-popover__footer-actions",
            children: effectiveActions.map((action) => {
              if (action.icon && !action.label) {
                return /* @__PURE__ */ jsx(
                  ArvoIconButton,
                  {
                    icon: action.icon,
                    variant: action.variant ?? "tertiary",
                    size: "md",
                    tooltip: action.label ?? action.id ?? "",
                    onClick: (e) => handleActionClick(action, e),
                    isDisabled: effectiveLoading || action.isDisabled
                  },
                  action.id
                );
              }
              return /* @__PURE__ */ jsx(
                ArvoButton,
                {
                  label: action.label,
                  icon: action.icon,
                  variant: action.variant ?? "secondary",
                  size: "md",
                  onClick: (e) => handleActionClick(action, e),
                  isDisabled: effectiveLoading || action.isDisabled
                },
                action.id
              );
            })
          }
        )
      ] });
    };
    const triggerContent = renderTrigger ? renderTrigger({
      ref: internalTriggerRef,
      "aria-expanded": effectiveIsOpen,
      "aria-controls": panelId,
      "aria-haspopup": "dialog"
    }) : null;
    const panelNode = effectiveIsMounted ? /* @__PURE__ */ jsxs(
      "div",
      {
        ref: panelRef,
        id: panelId,
        className: panelClasses,
        role: isInteractive ? "dialog" : "tooltip",
        "aria-busy": effectiveLoading || void 0,
        "aria-labelledby": title ? titleId : void 0,
        tabIndex: isInteractive ? -1 : void 0,
        "data-arvo-side": dataArvoSide,
        style: Object.keys(panelStyle).length > 0 ? panelStyle : void 0,
        onPointerEnter: handlePanelPointerEnter,
        onPointerLeave: handlePanelPointerLeave,
        ...rest,
        children: [
          hasArrow && /* @__PURE__ */ jsx("div", { className: "arvo-popover__arrow", "aria-hidden": "true" }),
          renderHeader(),
          resolvedStickyHeader && /* @__PURE__ */ jsx("div", { ref: stickyHeaderRef, className: "arvo-popover__sticky-header", children: resolvedStickyHeader }),
          /* @__PURE__ */ jsx("div", { ref: bodyRef, className: "arvo-popover__body", children: renderBodyContent() }),
          renderFooter(),
          isResizable && !isInline && /* @__PURE__ */ jsx("div", { ref: resizeHostRef, className: "arvo-popover__resize", "aria-hidden": "true" })
        ]
      }
    ) : null;
    const panel = panelNode ? isInline ? panelNode : createPortal(panelNode, document.body) : null;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      triggerContent,
      panel
    ] });
  }
);
export {
  ArvoPopover,
  ArvoPopover as default
};
//# sourceMappingURL=index27.js.map
