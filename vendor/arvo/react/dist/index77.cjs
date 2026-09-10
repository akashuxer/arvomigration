"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const core = require("@arvo/core");
const Button = require("./index16.cjs");
const IconButton = require("./index17.cjs");
const DropdownButton = require("./index57.cjs");
const SplitButton = require("./index58.cjs");
const DropdownIconButton = require("./index60.cjs");
const SplitIconButton = require("./index59.cjs");
const Switch = require("./index26.cjs");
const Badge = require("./index45.cjs");
const Status = require("./index14.cjs");
const EmptyState = require("./index88.cjs");
const useOverlaySurface = require("./index92.cjs");
const utils = require("@arvo/utils");
const MAX_HEADER_ACTIONS = 3;
const MAX_SECONDARY_ACTIONS = 2;
const ALLOWED_HEADER_VARIANTS = /* @__PURE__ */ new Set(["tertiary", "outline", "inline"]);
const HEADER_EXCLUDE_DRAG_SELECTOR = [
  ".arvo-win__back-btn",
  ".arvo-win__max-btn",
  ".arvo-win__close-btn",
  ".arvo-win__header-actions",
  ".arvo-win__status",
  ".arvo-win__badge",
  "button",
  '[role="button"]',
  "a[href]",
  "input",
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])'
].join(", ");
const warnedKeys = /* @__PURE__ */ new Set();
function warnOnce(key, message) {
  var _a;
  if (typeof process === "undefined" || ((_a = process.env) == null ? void 0 : _a.NODE_ENV) === "production") {
    return;
  }
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(message);
}
function validateHeaderActionVariant(action) {
  if (action.type === "switch") return;
  const variant = action.variant;
  if (!variant) return;
  if (!ALLOWED_HEADER_VARIANTS.has(variant)) {
    warnOnce(
      `win-header-variant-${action.id ?? action.type}-${variant}`,
      `[ArvoWindow] Header action variant '${variant}' is not allowed. Use one of: ${[...ALLOWED_HEADER_VARIANTS].join(", ")}. Falling back to 'tertiary'.`
    );
  }
}
function clampHeaderActions(actions) {
  if (!actions || actions.length === 0) return [];
  if (actions.length > MAX_HEADER_ACTIONS) {
    warnOnce(
      `win-header-overflow-${actions.length}`,
      `[ArvoWindow] headerActions accepts at most ${MAX_HEADER_ACTIONS} consumer items (Maximize and Close are system-controlled). Extra items are dropped.`
    );
  }
  return actions.slice(0, MAX_HEADER_ACTIONS);
}
function clampSecondaryActions(actions) {
  if (!actions || actions.length === 0) return [];
  if (actions.length > MAX_SECONDARY_ACTIONS) {
    warnOnce(
      `win-footer-secondary-overflow-${actions.length}`,
      `[ArvoWindow] secondaryActions accepts at most ${MAX_SECONDARY_ACTIONS} items. Extra items are dropped.`
    );
  }
  return actions.slice(0, MAX_SECONDARY_ACTIONS);
}
const ArvoWindow = React.forwardRef(
  function ArvoWindow2({
    size = "md",
    isOpen: openProp,
    defaultOpen = false,
    onOpenChange,
    onOpen,
    onClose,
    title,
    hasTitle = true,
    hasHeader = true,
    hasFooter = true,
    hasIcon = false,
    icon = "desktop",
    hasStatusIndicator = false,
    statusType = "available",
    badge = null,
    hasBackBtn = false,
    backLabel = "Go back",
    onBack,
    closeLabel = "Close window",
    hasMaximize = false,
    isMaximized: maximizedProp,
    defaultMaximized = false,
    onMaximizeChange,
    isDraggable = true,
    onDragStart,
    onDragEnd,
    hasBackdrop = true,
    closeOnBackdrop = false,
    closeOnEscape = true,
    headerActions,
    primaryAction = null,
    secondaryActions,
    footerLeft,
    stickyHeader,
    isEmptyState = false,
    emptyContent,
    isLoading: isLoadingProp = false,
    isDisabled = false,
    ariaLabel,
    ariaDescribedBy,
    container = null,
    initialFocus = "auto",
    className,
    children
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = React.useId();
    const titleId = `arvo-win-title-${uid}`;
    const bodyId = `arvo-win-body-${uid}`;
    const rootRef = React.useRef(null);
    const panelRef = React.useRef(null);
    const footerActionsRef = React.useRef(null);
    const headerRef = React.useRef(null);
    const stickyHeaderRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    React.useImperativeHandle(ref, () => rootRef.current, []);
    const [maximizedInternal, setMaximizedInternal] = React.useState(defaultMaximized);
    const isMaximizedControlled = maximizedProp !== void 0;
    const isMaximized = isMaximizedControlled ? !!maximizedProp : maximizedInternal;
    const setMaximized = React.useCallback(
      (next) => {
        if (!isMaximizedControlled) setMaximizedInternal(next);
        onMaximizeChange == null ? void 0 : onMaximizeChange(next);
      },
      [isMaximizedControlled, onMaximizeChange]
    );
    const handleMaxClick = React.useCallback(() => {
      if (isDisabled || isLoading) return;
      setMaximized(!isMaximized);
    }, [isDisabled, isLoading, isMaximized, setMaximized]);
    const closingProgrammaticallyRef = React.useRef(false);
    const handleEngineClose = React.useCallback(() => {
      if (closingProgrammaticallyRef.current) return;
    }, []);
    const handleEngineOpen = React.useCallback(() => {
      if ((onOpen == null ? void 0 : onOpen()) === false) return false;
    }, [onOpen]);
    const surface = useOverlaySurface.useOverlaySurface({
      type: "modal",
      priority: 10,
      triggerRef,
      panelRef,
      // Pin the outer host's stacking context to the panel's hub-assigned
      // z-index so consumer-level zIndexBase tuning lifts the WHOLE window
      // above sibling overlays -- not just the inner panel inside a wrapper
      // trapped at the SCSS fallback layer.
      wrapperRef: rootRef,
      isOpen: openProp,
      defaultOpen,
      onOpenChange,
      onOpen: handleEngineOpen,
      onClose: handleEngineClose,
      positioned: false,
      focus: "trap",
      initialFocus: initialFocus === "none" ? "none" : () => {
        var _a, _b;
        return core.resolveOverlayInitialFocus({
          initialFocus,
          root: panelRef.current,
          stickyHeader: stickyHeaderRef.current,
          body: ((_a = panelRef.current) == null ? void 0 : _a.querySelector(".arvo-win__body")) ?? null,
          footer: ((_b = panelRef.current) == null ? void 0 : _b.querySelector(".arvo-win__footer")) ?? null,
          header: headerRef.current
        });
      },
      returnFocus: true,
      transition: "scale",
      transitionDuration: 150,
      activateAfterTransition: true,
      closeOnEscape,
      closeOnOutside: closeOnBackdrop,
      mask: hasBackdrop ? { className: "arvo-win__overlay-mask", closeOnClick: closeOnBackdrop } : void 0,
      managesOwnBackdrop: true,
      lockScroll: hasBackdrop,
      triggerAria: false,
      emitStyle: false
    });
    const isOpen = surface.isOpen;
    const dragRef = React.useRef(null);
    const dragOffsetRef = React.useRef({ x: 0, y: 0 });
    const preMaximizeOffsetRef = React.useRef(null);
    const dragEnabled = isOpen && isDraggable && hasHeader && !isMaximized && !isLoading && !isDisabled;
    React.useEffect(() => {
      if (!dragEnabled) return;
      const handle = headerRef.current;
      const panel = panelRef.current;
      if (!handle || !panel) return;
      const instance = core.createDragHandle({
        handle,
        target: panel,
        excludeSelector: HEADER_EXCLUDE_DRAG_SELECTOR,
        bounds: "viewport",
        initialOffset: dragOffsetRef.current,
        cssVar: { x: "--arvo-win-x", y: "--arvo-win-y" },
        draggingClass: "",
        onDragStart: (e) => {
          var _a;
          (_a = rootRef.current) == null ? void 0 : _a.classList.add("dragging");
          onDragStart == null ? void 0 : onDragStart(e);
        },
        onDrag: (offset) => {
          dragOffsetRef.current = offset;
        },
        onDragEnd: (offset) => {
          var _a;
          dragOffsetRef.current = offset;
          (_a = rootRef.current) == null ? void 0 : _a.classList.remove("dragging");
          onDragEnd == null ? void 0 : onDragEnd(offset);
        }
      });
      dragRef.current = instance;
      return () => {
        instance.destroy();
        dragRef.current = null;
      };
    }, [dragEnabled, onDragStart, onDragEnd]);
    React.useEffect(() => {
      if (isMaximized) {
        if (preMaximizeOffsetRef.current === null) {
          preMaximizeOffsetRef.current = { ...dragOffsetRef.current };
        }
      } else if (preMaximizeOffsetRef.current !== null) {
        dragOffsetRef.current = preMaximizeOffsetRef.current;
        preMaximizeOffsetRef.current = null;
        const panel = panelRef.current;
        if (panel) {
          panel.style.setProperty(
            "--arvo-win-x",
            `${dragOffsetRef.current.x}px`
          );
          panel.style.setProperty(
            "--arvo-win-y",
            `${dragOffsetRef.current.y}px`
          );
        }
      }
    }, [isMaximized]);
    React.useEffect(() => {
    }, [isOpen]);
    const handleProgrammaticClose = React.useCallback(
      (reason) => {
        if (!isOpen) return;
        if ((onClose == null ? void 0 : onClose({ reason })) === false) return;
        closingProgrammaticallyRef.current = true;
        surface.close();
        closingProgrammaticallyRef.current = false;
      },
      [isOpen, onClose, surface]
    );
    const runFooterAction = React.useCallback(
      (action, reason) => {
        return (e) => {
          var _a;
          if (isLoading || isDisabled || action.isDisabled) return;
          const result = (_a = action.onClick) == null ? void 0 : _a.call(action, e);
          if (result === false) return;
          if (action.closeOnClick !== false) {
            handleProgrammaticClose(reason);
          }
        };
      },
      [isLoading, isDisabled, handleProgrammaticClose]
    );
    const handleBackClick = React.useCallback(
      (e) => {
        if (isLoading || isDisabled) return;
        onBack == null ? void 0 : onBack(e);
      },
      [isLoading, isDisabled, onBack]
    );
    const clampedHeaderActions = React.useMemo(
      () => clampHeaderActions(headerActions),
      [headerActions]
    );
    const clampedSecondaryActions = React.useMemo(
      () => clampSecondaryActions(secondaryActions),
      [secondaryActions]
    );
    React.useEffect(() => {
      clampedHeaderActions.forEach(validateHeaderActionVariant);
    }, [clampedHeaderActions]);
    const footerFitKey = React.useMemo(() => {
      const parts = [];
      clampedSecondaryActions.forEach(
        (a) => parts.push(`s|${a.id ?? ""}|${a.label ?? ""}|${a.icon ?? ""}`)
      );
      if (primaryAction)
        parts.push(`p|${primaryAction.id ?? ""}|${primaryAction.label ?? ""}|${primaryAction.icon ?? ""}`);
      return parts.length > 0 ? parts.join("//") : null;
    }, [clampedSecondaryActions, primaryAction]);
    React.useEffect(() => {
      if (footerFitKey == null) return;
      if (!surface.isMounted) return;
      const host = footerActionsRef.current;
      if (!host) return;
      const fit = utils.attachOverlayFooterFit(host, { gap: 6 });
      return () => fit.destroy();
    }, [footerFitKey, surface.isMounted]);
    const portalTarget = React.useMemo(() => {
      if (typeof document === "undefined") return null;
      if (!container) return document.body;
      if (typeof container === "string") {
        return document.querySelector(container) ?? document.body;
      }
      return container;
    }, [container]);
    if (!surface.isMounted || !portalTarget) return null;
    const renderTitle = hasHeader && hasTitle && !!title;
    const hasAccessibleName = renderTitle || !!ariaLabel;
    if (!hasAccessibleName) {
      warnOnce(
        "win-no-accessible-name",
        "[ArvoWindow] Provide either a visible `title` or an `ariaLabel`. Windows must have an accessible name."
      );
    }
    const rootClasses = [
      "arvo-win",
      `arvo-win--${size}`,
      isMaximized && "arvo-win--maximized",
      dragEnabled && "arvo-win--draggable",
      !hasBackdrop && "arvo-win--no-backdrop",
      hasIcon && "arvo-win--has-icon",
      hasStatusIndicator && "arvo-win--has-status",
      badge && "arvo-win--has-badge",
      hasBackBtn && "arvo-win--has-back-btn",
      hasMaximize && "arvo-win--has-maximize",
      isEmptyState && "arvo-win--empty",
      isOpen && "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const renderHeaderAction = (action, index) => {
      const key = action.id ?? `${action.type}-${index}`;
      const disabled = isLoading || isDisabled || action.isDisabled;
      switch (action.type) {
        case "icon-button": {
          const variant = action.variant && ALLOWED_HEADER_VARIANTS.has(action.variant) ? action.variant : "tertiary";
          return /* @__PURE__ */ jsxRuntime.jsx(
            IconButton.ArvoIconButton,
            {
              icon: action.icon,
              size: "sm",
              variant,
              tooltip: action.tooltip ?? "",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onClick: action.onClick
            },
            key
          );
        }
        case "button": {
          const variant = action.variant && ALLOWED_HEADER_VARIANTS.has(action.variant) ? action.variant : "inline";
          return /* @__PURE__ */ jsxRuntime.jsx(
            Button.ArvoButton,
            {
              label: action.label,
              icon: action.icon,
              variant,
              size: "sm",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onClick: action.onClick
            },
            key
          );
        }
        case "dropdown-button": {
          const variant = action.variant && ALLOWED_HEADER_VARIANTS.has(action.variant) ? action.variant : "tertiary";
          return /* @__PURE__ */ jsxRuntime.jsx(
            DropdownButton.default,
            {
              label: action.label,
              icon: action.icon,
              items: action.items,
              variant,
              size: "sm",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onSelect: action.onSelect
            },
            key
          );
        }
        case "dropdown-icon-button": {
          const variant = action.variant && ALLOWED_HEADER_VARIANTS.has(action.variant) ? action.variant : "tertiary";
          return /* @__PURE__ */ jsxRuntime.jsx(
            DropdownIconButton.default,
            {
              icon: action.icon ?? "ellipsis-v",
              tooltip: action.tooltip ?? "",
              items: action.items,
              variant,
              size: "sm",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onSelect: action.onSelect
            },
            key
          );
        }
        case "split-button": {
          if (action.variant === "outline") {
            warnOnce(
              `win-split-button-outline-${action.id ?? "unkeyed"}`,
              `[ArvoWindow] SplitButton header action does not support variant 'outline'; falling back to 'tertiary'.`
            );
          }
          return /* @__PURE__ */ jsxRuntime.jsx(
            SplitButton.ArvoSplitButton,
            {
              label: action.label,
              icon: action.icon,
              items: action.items,
              variant: "tertiary",
              size: "sm",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onClick: action.onPrimaryClick,
              onSelect: action.onSelect
            },
            key
          );
        }
        case "split-icon-button": {
          if (action.variant === "outline") {
            warnOnce(
              `win-split-icon-button-outline-${action.id ?? "unkeyed"}`,
              `[ArvoWindow] SplitIconButton header action does not support variant 'outline'; falling back to 'tertiary'.`
            );
          }
          return /* @__PURE__ */ jsxRuntime.jsx(
            SplitIconButton.default,
            {
              icon: action.icon,
              tooltip: action.tooltip ?? "",
              items: action.items,
              variant: "tertiary",
              size: "sm",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onClick: action.onPrimaryClick,
              onSelect: action.onSelect
            },
            key
          );
        }
        case "switch": {
          return /* @__PURE__ */ jsxRuntime.jsx(
            Switch.default,
            {
              label: action.label ?? null,
              size: "sm",
              isChecked: action.isChecked,
              defaultChecked: action.defaultChecked,
              isDisabled: disabled,
              isLoading: action.isLoading,
              onChange: action.onChange
            },
            key
          );
        }
        default:
          return null;
      }
    };
    const renderFooterAction = (action, reason, role, index) => {
      const key = action.id ?? `${role}-${index}`;
      const disabled = isLoading || isDisabled || action.isDisabled;
      const onClick = runFooterAction(action, reason);
      const type = action.type ?? "button";
      const buttonVariant = role === "primary" ? action.semantic === "danger-primary" ? "danger-primary" : "primary" : "secondary";
      const ddVariant = role === "primary" ? "primary" : "secondary";
      switch (type) {
        case "dropdown-button": {
          return /* @__PURE__ */ jsxRuntime.jsx(
            DropdownButton.default,
            {
              label: action.label,
              icon: action.icon,
              items: action.items ?? [],
              variant: ddVariant,
              size: "md",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onSelect: action.onSelect,
              onClick: (e) => onClick(e)
            },
            key
          );
        }
        case "split-button": {
          return /* @__PURE__ */ jsxRuntime.jsx(
            SplitButton.ArvoSplitButton,
            {
              label: action.label,
              icon: action.icon,
              items: action.items ?? [],
              variant: ddVariant,
              size: "md",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onClick: (e) => {
                var _a;
                const r = (_a = action.onPrimaryClick) == null ? void 0 : _a.call(action, e);
                if (r === false) return;
                onClick(e);
              },
              onSelect: action.onSelect
            },
            key
          );
        }
        case "button":
        default: {
          return /* @__PURE__ */ jsxRuntime.jsx(
            Button.ArvoButton,
            {
              label: action.label,
              icon: action.icon,
              variant: buttonVariant,
              size: "md",
              isDisabled: disabled,
              isLoading: action.isLoading,
              onClick
            },
            key
          );
        }
      }
    };
    const bodyContent = isEmptyState ? /* @__PURE__ */ jsxRuntime.jsx(
      EmptyState.default,
      {
        ...emptyContent,
        size: isMaximized ? "lg" : "sm",
        orientation: "vertical"
      }
    ) : children;
    return require$$0.createPortal(
      /* @__PURE__ */ jsxRuntime.jsx("div", { ref: rootRef, className: rootClasses, children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: panelRef,
          className: "arvo-win__panel",
          role: "dialog",
          "aria-modal": hasBackdrop ? "true" : "false",
          "aria-labelledby": renderTitle ? titleId : void 0,
          "aria-label": !renderTitle ? ariaLabel : void 0,
          "aria-describedby": ariaDescribedBy ?? (children ? bodyId : void 0),
          "aria-busy": isLoading || void 0,
          tabIndex: -1,
          children: [
            hasHeader && /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: headerRef, className: "arvo-win__header", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-win__header-left", children: [
                hasBackBtn && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-win__back-btn", children: /* @__PURE__ */ jsxRuntime.jsx(
                  IconButton.ArvoIconButton,
                  {
                    icon: "arrow-left",
                    size: "sm",
                    variant: "secondary",
                    tooltip: backLabel,
                    "aria-label": backLabel,
                    isDisabled: isLoading || isDisabled,
                    onClick: handleBackClick
                  }
                ) }),
                hasIcon && /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    className: `arvo-win__ico o9con o9con-${icon}`,
                    "aria-hidden": "true"
                  }
                ),
                renderTitle && /* @__PURE__ */ jsxRuntime.jsx("p", { id: titleId, className: "arvo-win__title", children: title }),
                hasStatusIndicator && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-win__status", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx(Status.ArvoStatus, { type: statusType, size: "sm" }) }),
                badge && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-win__badge", children: /* @__PURE__ */ jsxRuntime.jsx(
                  Badge.ArvoBadge,
                  {
                    ...badge,
                    variant: "label",
                    size: "sm",
                    placement: "inline",
                    hasStatus: false
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-win__header-actions", children: [
                clampedHeaderActions.map(renderHeaderAction),
                hasMaximize && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-win__max-btn", children: /* @__PURE__ */ jsxRuntime.jsx(
                  IconButton.ArvoIconButton,
                  {
                    icon: isMaximized ? "priority-edge" : "expand",
                    size: "sm",
                    variant: "tertiary",
                    tooltip: isMaximized ? "Restore Exit Full screen" : "Maximize Full Screen",
                    "aria-label": isMaximized ? "Restore Exit Full screen" : "Maximize Full Screen",
                    isDisabled: isLoading || isDisabled,
                    onClick: handleMaxClick
                  }
                ) }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-win__close-btn", children: /* @__PURE__ */ jsxRuntime.jsx(
                  IconButton.ArvoIconButton,
                  {
                    icon: "close",
                    size: "sm",
                    variant: "tertiary",
                    tooltip: closeLabel,
                    "aria-label": closeLabel,
                    isDisabled: isLoading || isDisabled,
                    onClick: () => handleProgrammaticClose("close-button")
                  }
                ) })
              ] })
            ] }),
            stickyHeader != null && /* @__PURE__ */ jsxRuntime.jsx("div", { ref: stickyHeaderRef, className: "arvo-win__sticky-header", children: stickyHeader }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { id: bodyId, className: "arvo-win__body", children: bodyContent }),
            hasFooter && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-win__footer", children: [
              footerLeft != null && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-win__footer-left", children: footerLeft }),
              (primaryAction || clampedSecondaryActions.length > 0) && /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: footerActionsRef, className: "arvo-win__actions", children: [
                clampedSecondaryActions.map(
                  (a, i) => renderFooterAction(a, "secondary", "secondary", i)
                ),
                primaryAction && renderFooterAction(primaryAction, "primary", "primary", 0)
              ] })
            ] })
          ]
        }
      ) }),
      portalTarget
    );
  }
);
exports.ArvoWindow = ArvoWindow;
//# sourceMappingURL=index77.cjs.map
