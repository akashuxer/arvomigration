"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const ActionMenu = require("./index49.cjs");
const useControllableState = require("./index90.cjs");
const useOpenStateSync = require("./index91.cjs");
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) return items.flatMap((g) => g.items);
  return items;
}
const ArvoSplitButton = React.forwardRef(
  function ArvoSplitButton2({
    label,
    variant = "primary",
    size = "md",
    icon,
    mode = "action",
    displaySelected = "label",
    value,
    defaultValue = null,
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
    const wrapperRef = React.useRef(null);
    const actionRef = React.useRef(null);
    const triggerRefInternal = React.useRef(null);
    const menuRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const isExternalMode = overlay != null || items == null && menuProps == null;
    const effectiveMode = isExternalMode && mode === "selection" ? "action" : mode;
    React.useEffect(() => {
      if (process.env.NODE_ENV !== "production" && isExternalMode && mode === "selection") {
        console.warn(
          'ArvoSplitButton: `mode="selection"` is only supported with the default internal ArvoActionMenu composition. Falling back to `mode="action"`. To update the action segment label from an external overlay, call your overlay\'s callback with whatever payload makes sense for that overlay and update the `label` prop yourself.'
        );
      }
    }, [isExternalMode, mode]);
    const [activeSegment, setActiveSegment] = React.useState(
      "action"
    );
    const [effectiveSelectedId, setSelectedId] = useControllableState.useControllableState(value, defaultValue ?? null);
    const flat = React.useMemo(
      () => items ? flattenItems(items) : [],
      [items]
    );
    const selectedItem = React.useMemo(() => {
      if (effectiveMode !== "selection") return null;
      if (effectiveSelectedId == null) return null;
      const id = String(effectiveSelectedId);
      return flat.find((item) => item.id === id) ?? null;
    }, [flat, effectiveSelectedId, effectiveMode]);
    const displayLabel = React.useMemo(() => {
      if (effectiveMode === "action" || !selectedItem) return label;
      if (displaySelected === "value") {
        const val = selectedItem.value;
        return val != null ? String(val) : selectedItem.id;
      }
      return selectedItem.label;
    }, [effectiveMode, selectedItem, label, displaySelected]);
    const displayIcon = React.useMemo(() => {
      if (effectiveMode === "action") return icon;
      return (selectedItem == null ? void 0 : selectedItem.icon) ?? icon;
    }, [effectiveMode, selectedItem, icon]);
    const processedItems = React.useMemo(() => {
      const list = items ?? [];
      if (effectiveMode !== "selection" || effectiveSelectedId == null)
        return list;
      const selId = String(effectiveSelectedId);
      const mark = (item) => ({
        ...item,
        active: item.id === selId
      });
      if (isGrouped(list)) {
        return list.map((group) => ({
          ...group,
          items: group.items.map(mark)
        }));
      }
      return list.map(mark);
    }, [items, effectiveMode, effectiveSelectedId]);
    const [internalOpen, setInternalOpen] = React.useState(false);
    const externalOpen = useOpenStateSync.useOpenStateSync({
      isOpen: isOpenProp,
      triggerRef: triggerRefInternal,
      onOpenChange: isExternalMode ? onOpenChange : void 0,
      enabled: isExternalMode
    });
    const isOpen = isExternalMode ? externalOpen : internalOpen;
    const dispatchWrapperEvent = React.useCallback(
      (name, detail, cancelable = true) => {
        var _a;
        (_a = wrapperRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent(name, { bubbles: true, cancelable, detail })
        );
      },
      []
    );
    const dispatchedOpenRef = React.useRef(false);
    React.useEffect(() => {
      if (dispatchedOpenRef.current === isOpen) return;
      dispatchedOpenRef.current = isOpen;
      dispatchWrapperEvent(
        isOpen ? "split-btn:open" : "split-btn:close",
        {}
      );
    }, [isOpen, dispatchWrapperEvent]);
    const handleInternalOpenChange = React.useCallback(
      (next) => {
        setInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [onOpenChange]
    );
    const handleMenuSelect = React.useCallback(
      (item, index) => {
        if (effectiveMode === "selection") {
          const previousItem = selectedItem;
          setSelectedId(item.id);
          dispatchWrapperEvent(
            "split-btn:change",
            { item, previousItem },
            false
          );
        } else {
          dispatchWrapperEvent("split-btn:select", { item, index });
        }
        return onSelect == null ? void 0 : onSelect(item, index);
      },
      [effectiveMode, selectedItem, setSelectedId, dispatchWrapperEvent, onSelect]
    );
    const actionDisabled = isDisabled || isActionDisabled || isLoading;
    const triggerDisabled = isDisabled || isTriggerDisabled || isLoading;
    const handleActionClick = React.useCallback(
      (event) => {
        if (actionDisabled) return;
        if (effectiveMode === "selection" && selectedItem) {
          const currentIndex = flat.findIndex((i) => i.id === selectedItem.id);
          dispatchWrapperEvent("split-btn:action", { selectedItem });
          onSelect == null ? void 0 : onSelect(selectedItem, currentIndex);
        } else {
          dispatchWrapperEvent("split-btn:action", { selectedItem: null });
          onAction == null ? void 0 : onAction(event, null);
        }
        onClick == null ? void 0 : onClick(event);
      },
      [
        actionDisabled,
        effectiveMode,
        selectedItem,
        flat,
        dispatchWrapperEvent,
        onAction,
        onSelect,
        onClick
      ]
    );
    const handleActionKeyDown = React.useCallback(
      (event) => {
        onKeyDown == null ? void 0 : onKeyDown(event);
      },
      [onKeyDown]
    );
    const focusSegment = React.useCallback((next) => {
      setActiveSegment(next);
      const target = next === "action" ? actionRef.current : triggerRefInternal.current;
      target == null ? void 0 : target.focus({ preventScroll: true });
    }, []);
    const handleWrapperKeyDown = React.useCallback(
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
    const handleWrapperFocus = React.useCallback(
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
    const mergeActionRef = React.useCallback(
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
    const mergeTriggerRef = React.useCallback(
      (node) => {
        triggerRefInternal.current = node;
        if (triggerRefProp) {
          triggerRefProp.current = node;
        }
      },
      [triggerRefProp]
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
    const wrapperClasses = [
      "arvo-split-btn",
      `arvo-split-btn--${variant}`,
      `arvo-split-btn--${size}`,
      isOpen && "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const segmentBaseClasses = [
      "arvo-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`
    ].join(" ");
    return /* @__PURE__ */ jsxRuntime.jsxs(
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
          /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              ...rest,
              ref: mergeActionRef,
              type: "button",
              className: `${segmentBaseClasses} arvo-split-btn__action`,
              disabled: actionDisabled,
              tabIndex: actionTabIndex,
              onClick: handleActionClick,
              onKeyDown: handleActionKeyDown,
              onFocus,
              onBlur,
              children: [
                displayIcon && /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    className: `arvo-split-btn__icon o9con o9con-${displayIcon}`,
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-split-btn__lbl", children: displayLabel })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              ref: mergeTriggerRef,
              type: "button",
              className: `${segmentBaseClasses} arvo-split-btn__trigger`,
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
              children: /* @__PURE__ */ jsxRuntime.jsx(
                "span",
                {
                  className: "arvo-split-btn__caret o9con o9con-angle-down",
                  "aria-hidden": "true"
                }
              )
            }
          ),
          !isExternalMode && /* @__PURE__ */ jsxRuntime.jsx(
            ActionMenu.ArvoActionMenu,
            {
              ...menuProps,
              ref: menuRef,
              triggerRef: triggerRefInternal,
              items: processedItems,
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
  }
);
exports.ArvoSplitButton = ArvoSplitButton;
exports.default = ArvoSplitButton;
//# sourceMappingURL=index58.cjs.map
