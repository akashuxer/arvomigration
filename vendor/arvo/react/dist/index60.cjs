"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const ActionMenu = require("./index49.cjs");
const useTooltip = require("./index10.cjs");
const useOpenStateSync = require("./index91.cjs");
const ArvoDropdownIconButton = React.forwardRef(
  function ArvoDropdownIconButton2({
    icon,
    tooltip,
    variant = "primary",
    size = "md",
    isCompact = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    items,
    search,
    placement = "bottom-end",
    maxHeight,
    hasGroupDividers = true,
    closeOnSelect = true,
    menuProps,
    overlay,
    triggerRef: triggerRefProp,
    isOpen: isOpenProp,
    className,
    onSelect,
    onOpen,
    onClose,
    onOpenChange,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const menuRef = React.useRef(null);
    const triggerRefInternal = React.useRef(null);
    useTooltip.useTooltip({ triggerRef: triggerRefInternal, tooltip });
    const isExternalMode = overlay != null || items == null && menuProps == null;
    const [internalOpen, setInternalOpen] = React.useState(false);
    const externalOpen = useOpenStateSync.useOpenStateSync({
      isOpen: isOpenProp,
      triggerRef: triggerRefInternal,
      onOpenChange: isExternalMode ? onOpenChange : void 0,
      enabled: isExternalMode
    });
    const isOpen = isExternalMode ? externalOpen : internalOpen;
    const dispatchedOpenRef = React.useRef(false);
    React.useEffect(() => {
      var _a;
      if (dispatchedOpenRef.current === isOpen) return;
      dispatchedOpenRef.current = isOpen;
      (_a = triggerRefInternal.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent(isOpen ? "dd-icon-btn:open" : "dd-icon-btn:close", {
          bubbles: true,
          cancelable: true,
          detail: {}
        })
      );
    }, [isOpen]);
    const tooltipContent = typeof tooltip === "string" ? tooltip : tooltip.content;
    const handleInternalOpenChange = React.useCallback(
      (next) => {
        setInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [onOpenChange]
    );
    const handleMenuSelect = React.useCallback(
      (item, index) => {
        var _a;
        (_a = triggerRefInternal.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("dd-icon-btn:select", {
            bubbles: true,
            cancelable: true,
            detail: { item, index }
          })
        );
        return onSelect == null ? void 0 : onSelect(item, index);
      },
      [onSelect]
    );
    const mergeRef = React.useCallback(
      (node) => {
        triggerRefInternal.current = node;
        if (triggerRefProp) {
          triggerRefProp.current = node;
        }
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, triggerRefProp]
    );
    const triggerClasses = [
      "arvo-dd-icon-btn",
      "arvo-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`,
      isCompact && "arvo-dd-icon-btn--compact",
      isOpen && "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const handleTriggerKeyDown = React.useCallback(
      (e) => {
        var _a, _b;
        onKeyDown == null ? void 0 : onKeyDown(e);
        if (e.defaultPrevented) return;
        if (e.key !== "ArrowDown" || isDisabled || isLoading) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        if (isExternalMode) {
          (_a = triggerRefInternal.current) == null ? void 0 : _a.click();
        } else {
          (_b = menuRef.current) == null ? void 0 : _b.open();
        }
      },
      [onKeyDown, isDisabled, isLoading, isExternalMode]
    );
    const renderedOverlay = React.useMemo(() => {
      if (!overlay) return null;
      if (!React.isValidElement(overlay)) return overlay;
      const existing = overlay.props;
      const injected = {};
      if (existing.triggerRef === void 0) {
        injected.triggerRef = triggerRefInternal;
      }
      if (isOpenProp !== void 0 && existing.isOpen === void 0) {
        injected.isOpen = isOpenProp;
      }
      return React.cloneElement(overlay, injected);
    }, [overlay, isOpenProp]);
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          ref: mergeRef,
          type: "button",
          ...rest,
          className: triggerClasses,
          disabled: isDisabled,
          "aria-label": tooltipContent,
          "aria-busy": isLoading || void 0,
          onClick: (e) => {
            var _a;
            onClick == null ? void 0 : onClick(e);
            if (!e.defaultPrevented && !isExternalMode) {
              (_a = menuRef.current) == null ? void 0 : _a.toggle();
            }
          },
          onFocus,
          onBlur,
          onKeyDown: handleTriggerKeyDown,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: `arvo-dd-icon-btn__icon o9con o9con-${icon}`,
                "aria-hidden": "true"
              }
            ),
            !isCompact && /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "arvo-dd-icon-btn__caret o9con o9con-angle-down",
                "aria-hidden": "true"
              }
            )
          ]
        }
      ),
      !isExternalMode && // Hybrid prop surface: spread `menuProps` first so flat / computed
      // values win on overlap. Only bag-only keys flow through.
      /* @__PURE__ */ jsxRuntime.jsx(
        ActionMenu.ArvoActionMenu,
        {
          ...menuProps,
          ref: menuRef,
          triggerRef: triggerRefInternal,
          items: items ?? [],
          placement,
          search,
          maxHeight,
          hasGroupDividers,
          closeOnSelect,
          isDisabled: isDisabled || isLoading,
          isLoading: false,
          onOpen,
          onClose,
          onSelect: handleMenuSelect,
          onOpenChange: handleInternalOpenChange
        }
      ),
      renderedOverlay
    ] });
  }
);
exports.default = ArvoDropdownIconButton;
//# sourceMappingURL=index60.cjs.map
