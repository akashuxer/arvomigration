import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useState, useEffect, useCallback, useMemo, isValidElement, cloneElement } from "react";
import { ArvoActionMenu } from "./index49.js";
import { useTooltip } from "./index10.js";
import { useOpenStateSync } from "./index91.js";
const ArvoSplitIconButton = forwardRef(function ArvoSplitIconButton2({
  icon,
  tooltip,
  variant = "primary",
  size = "md",
  isDisabled = false,
  isActionDisabled = false,
  isTriggerDisabled = false,
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
  triggerLabel = "Show options",
  className,
  onAction,
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
  const wrapperRef = useRef(null);
  const actionRef = useRef(null);
  const triggerRefInternal = useRef(null);
  const menuRef = useRef(null);
  const isLoading = isLoadingProp === true;
  const isExternalMode = overlay != null || items == null && menuProps == null;
  const [activeSegment, setActiveSegment] = useState(
    "action"
  );
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !tooltip) {
      console.warn(
        "ArvoSplitIconButton: `tooltip` is required so the action segment has an accessible name (it is also rendered as the visual tooltip)."
      );
    }
  }, [tooltip]);
  useTooltip({ triggerRef: actionRef, tooltip });
  const tooltipLabel = typeof tooltip === "string" ? tooltip : tooltip != null ? tooltip.content : void 0;
  const [internalOpen, setInternalOpen] = useState(false);
  const externalOpen = useOpenStateSync({
    isOpen: isOpenProp,
    triggerRef: triggerRefInternal,
    onOpenChange: isExternalMode ? onOpenChange : void 0,
    enabled: isExternalMode
  });
  const isOpen = isExternalMode ? externalOpen : internalOpen;
  const dispatchWrapperEvent = useCallback(
    (name, detail, cancelable = true) => {
      var _a;
      (_a = wrapperRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent(name, { bubbles: true, cancelable, detail })
      );
    },
    []
  );
  const dispatchedOpenRef = useRef(false);
  useEffect(() => {
    if (dispatchedOpenRef.current === isOpen) return;
    dispatchedOpenRef.current = isOpen;
    dispatchWrapperEvent(
      isOpen ? "split-icon-btn:open" : "split-icon-btn:close",
      {}
    );
  }, [isOpen, dispatchWrapperEvent]);
  const handleInternalOpenChange = useCallback(
    (next) => {
      setInternalOpen(next);
      onOpenChange == null ? void 0 : onOpenChange(next);
    },
    [onOpenChange]
  );
  const handleMenuSelect = useCallback(
    (item, index) => {
      dispatchWrapperEvent("split-icon-btn:select", { item, index });
      return onSelect == null ? void 0 : onSelect(item, index);
    },
    [dispatchWrapperEvent, onSelect]
  );
  const actionDisabled = isDisabled || isActionDisabled || isLoading;
  const triggerDisabled = isDisabled || isTriggerDisabled || isLoading;
  const handleActionClick = useCallback(
    (event) => {
      if (actionDisabled) return;
      dispatchWrapperEvent("split-icon-btn:action", {});
      onAction == null ? void 0 : onAction(event);
      onClick == null ? void 0 : onClick(event);
    },
    [actionDisabled, dispatchWrapperEvent, onAction, onClick]
  );
  const handleActionKeyDown = useCallback(
    (event) => {
      onKeyDown == null ? void 0 : onKeyDown(event);
    },
    [onKeyDown]
  );
  const focusSegment = useCallback((next) => {
    setActiveSegment(next);
    const target = next === "action" ? actionRef.current : triggerRefInternal.current;
    target == null ? void 0 : target.focus({ preventScroll: true });
  }, []);
  const handleWrapperKeyDown = useCallback(
    (event) => {
      var _a, _b;
      if (event.defaultPrevented) return;
      const target = event.target;
      const onAction2 = target === actionRef.current;
      const onTrigger = target === triggerRefInternal.current;
      if (!onAction2 && !onTrigger) return;
      const { key, altKey } = event;
      if (key === "ArrowDown" || altKey && key === "ArrowDown") {
        if (actionDisabled && triggerDisabled) return;
        event.preventDefault();
        if (isExternalMode) {
          (_a = triggerRefInternal.current) == null ? void 0 : _a.click();
        } else {
          (_b = menuRef.current) == null ? void 0 : _b.open();
        }
        return;
      }
      if (key === "ArrowRight" && onAction2) {
        if (triggerDisabled) return;
        event.preventDefault();
        focusSegment("trigger");
        return;
      }
      if (key === "ArrowLeft" && onTrigger) {
        if (actionDisabled) return;
        event.preventDefault();
        focusSegment("action");
        return;
      }
      if (key === "Home") {
        if (actionDisabled) return;
        event.preventDefault();
        focusSegment("action");
        return;
      }
      if (key === "End") {
        if (triggerDisabled) return;
        event.preventDefault();
        focusSegment("trigger");
        return;
      }
    },
    [actionDisabled, triggerDisabled, focusSegment, isExternalMode]
  );
  const handleWrapperFocus = useCallback(
    (event) => {
      const target = event.target;
      if (target === actionRef.current) setActiveSegment("action");
      else if (target === triggerRefInternal.current) setActiveSegment("trigger");
    },
    []
  );
  const effectiveActiveSegment = activeSegment === "action" && actionDisabled && !triggerDisabled ? "trigger" : activeSegment === "trigger" && triggerDisabled && !actionDisabled ? "action" : activeSegment;
  const actionTabIndex = actionDisabled || effectiveActiveSegment !== "action" ? -1 : 0;
  const triggerTabIndex = triggerDisabled || effectiveActiveSegment !== "trigger" ? -1 : 0;
  const mergeActionRef = useCallback(
    (node) => {
      actionRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  const mergeTriggerRef = useCallback(
    (node) => {
      triggerRefInternal.current = node;
      if (triggerRefProp) {
        triggerRefProp.current = node;
      }
    },
    [triggerRefProp]
  );
  const renderedOverlay = useMemo(() => {
    if (!overlay) return null;
    if (!isValidElement(overlay)) return overlay;
    const existing = overlay.props;
    const injected = {};
    if (existing.triggerRef === void 0) {
      injected.triggerRef = triggerRefInternal;
    }
    if (isOpenProp !== void 0 && existing.isOpen === void 0) {
      injected.isOpen = isOpenProp;
    }
    return cloneElement(overlay, injected);
  }, [overlay, isOpenProp]);
  const wrapperClasses = [
    "arvo-split-icon-btn",
    `arvo-split-icon-btn--${variant}`,
    `arvo-split-icon-btn--${size}`,
    isOpen && "open",
    isLoading && "loading",
    className
  ].filter(Boolean).join(" ");
  const actionSegmentClasses = [
    "arvo-icon-btn",
    `arvo-btn--${variant}`,
    `arvo-btn--${size}`,
    "arvo-split-icon-btn__action"
  ].join(" ");
  const triggerSegmentClasses = [
    "arvo-btn",
    `arvo-btn--${variant}`,
    `arvo-btn--${size}`,
    "arvo-split-icon-btn__trigger"
  ].join(" ");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: wrapperRef,
      className: wrapperClasses,
      role: "group",
      "aria-disabled": isDisabled || void 0,
      "aria-busy": isLoading || void 0,
      onKeyDown: handleWrapperKeyDown,
      onFocus: handleWrapperFocus,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            ...rest,
            ref: mergeActionRef,
            type: "button",
            className: actionSegmentClasses,
            disabled: actionDisabled,
            tabIndex: actionTabIndex,
            "aria-label": tooltipLabel,
            onClick: handleActionClick,
            onKeyDown: handleActionKeyDown,
            onFocus,
            onBlur,
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: `arvo-split-icon-btn__icon o9con o9con-${icon}`,
                "aria-hidden": "true"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            ref: mergeTriggerRef,
            type: "button",
            className: triggerSegmentClasses,
            disabled: triggerDisabled,
            tabIndex: triggerTabIndex,
            "aria-label": triggerLabel,
            onClick: (e) => {
              var _a;
              if (!isExternalMode) {
                if (e.defaultPrevented) return;
                (_a = menuRef.current) == null ? void 0 : _a.toggle();
              }
            },
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: "arvo-split-icon-btn__caret o9con o9con-angle-down",
                "aria-hidden": "true"
              }
            )
          }
        ),
        !isExternalMode && /* @__PURE__ */ jsx(
          ArvoActionMenu,
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
            isDisabled: isDisabled || isTriggerDisabled || isLoading,
            isLoading: false,
            onOpen,
            onClose,
            onSelect: handleMenuSelect,
            onOpenChange: handleInternalOpenChange
          }
        ),
        renderedOverlay
      ]
    }
  );
});
export {
  ArvoSplitIconButton as default
};
//# sourceMappingURL=index59.js.map
