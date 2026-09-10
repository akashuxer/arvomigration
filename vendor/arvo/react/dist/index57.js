import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useEffect, useState, useMemo, useCallback, isValidElement, cloneElement } from "react";
import { ArvoActionMenu } from "./index49.js";
import { useOpenStateSync } from "./index91.js";
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) return items.flatMap((g) => g.items);
  return items;
}
const ArvoDropdownButton = forwardRef(
  function ArvoDropdownButton2({
    label,
    variant = "primary",
    size = "md",
    icon,
    mode = "action",
    displaySelected = "label",
    value,
    defaultValue = null,
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
    const internalTriggerRef = useRef(null);
    const menuRef = useRef(null);
    const isLoading = isLoadingProp === true;
    const isExternalMode = overlay != null || items == null && menuProps == null;
    const effectiveMode = isExternalMode && mode === "selection" ? "action" : mode;
    useEffect(() => {
      if (process.env.NODE_ENV !== "production" && isExternalMode && mode === "selection") {
        console.warn(
          'ArvoDropdownButton: `mode="selection"` is only supported with the default internal ArvoActionMenu composition. Falling back to `mode="action"`. To update the button label from an external overlay, call your overlay\'s onSelect handler with whatever payload makes sense for that overlay and update the `label` prop yourself.'
        );
      }
    }, [isExternalMode, mode]);
    const [internalOpen, setInternalOpen] = useState(false);
    const externalOpen = useOpenStateSync({
      isOpen: isOpenProp,
      triggerRef: internalTriggerRef,
      onOpenChange: isExternalMode ? onOpenChange : void 0,
      enabled: isExternalMode
    });
    const isOpen = isExternalMode ? externalOpen : internalOpen;
    const dispatchedOpenRef = useRef(false);
    useEffect(() => {
      var _a;
      if (dispatchedOpenRef.current === isOpen) return;
      dispatchedOpenRef.current = isOpen;
      (_a = internalTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent(isOpen ? "dd-btn:open" : "dd-btn:close", {
          bubbles: true,
          cancelable: true,
          detail: {}
        })
      );
    }, [isOpen]);
    const isControlled = value !== void 0;
    const [internalSelected, setInternalSelected] = useState(defaultValue);
    const effectiveSelectedId = isControlled ? value : internalSelected;
    const flat = useMemo(
      () => items ? flattenItems(items) : [],
      [items]
    );
    const selectedItemData = useMemo(() => {
      if (effectiveMode !== "selection") return null;
      if (effectiveSelectedId == null) return null;
      const id = String(effectiveSelectedId);
      return flat.find((item) => item.id === id) ?? null;
    }, [flat, effectiveSelectedId, effectiveMode]);
    const displayLabel = useMemo(() => {
      if (effectiveMode === "action" || !selectedItemData) return label;
      if (displaySelected === "value") {
        const val = selectedItemData.value;
        return val != null ? String(val) : selectedItemData.id;
      }
      return selectedItemData.label;
    }, [effectiveMode, selectedItemData, label, displaySelected]);
    const handleInternalOpenChange = useCallback(
      (next) => {
        setInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [onOpenChange]
    );
    const processedItems = useMemo(() => {
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
    const handleSelect = useCallback(
      (item, index) => {
        var _a, _b;
        if (effectiveMode === "selection") {
          const prevId = isControlled ? value : internalSelected;
          const previousItem = prevId != null ? flat.find((i) => i.id === String(prevId)) ?? null : null;
          if (!isControlled) setInternalSelected(item.id);
          (_a = internalTriggerRef.current) == null ? void 0 : _a.dispatchEvent(
            new CustomEvent("dd-btn:change", {
              bubbles: true,
              cancelable: true,
              detail: { item, index, previousItem }
            })
          );
        } else {
          (_b = internalTriggerRef.current) == null ? void 0 : _b.dispatchEvent(
            new CustomEvent("dd-btn:select", {
              bubbles: true,
              cancelable: true,
              detail: { item, index }
            })
          );
        }
        return onSelect == null ? void 0 : onSelect(item, index);
      },
      [effectiveMode, isControlled, value, internalSelected, flat, onSelect]
    );
    const mergeRef = useCallback(
      (node) => {
        internalTriggerRef.current = node;
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
      "arvo-dd-btn",
      "arvo-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`,
      isOpen && "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const handleTriggerKeyDown = useCallback(
      (e) => {
        var _a, _b;
        onKeyDown == null ? void 0 : onKeyDown(e);
        if (e.defaultPrevented) return;
        if (e.key !== "ArrowDown" || isDisabled || isLoading) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        if (isExternalMode) {
          (_a = internalTriggerRef.current) == null ? void 0 : _a.click();
        } else {
          (_b = menuRef.current) == null ? void 0 : _b.open();
        }
      },
      [onKeyDown, isDisabled, isLoading, isExternalMode]
    );
    const renderedOverlay = useMemo(() => {
      if (!overlay) return null;
      if (!isValidElement(overlay)) return overlay;
      const existing = overlay.props;
      const injected = {};
      if (existing.triggerRef === void 0) {
        injected.triggerRef = internalTriggerRef;
      }
      if (isOpenProp !== void 0 && existing.isOpen === void 0) {
        injected.isOpen = isOpenProp;
      }
      return cloneElement(overlay, injected);
    }, [overlay, isOpenProp]);
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: mergeRef,
          type: "button",
          ...rest,
          className: triggerClasses,
          disabled: isDisabled,
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
            icon && /* @__PURE__ */ jsx(
              "span",
              {
                className: `arvo-dd-btn__icon o9con o9con-${icon}`,
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "arvo-dd-btn__lbl", children: displayLabel }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "arvo-dd-btn__caret o9con o9con-angle-down",
                "aria-hidden": "true"
              }
            )
          ]
        }
      ),
      !isExternalMode && // Hybrid prop surface: spread `menuProps` first so any flat /
      // computed value the parent owns wins on overlap. The bag's
      // TypeScript whitelist (DropdownButtonMenuProps) excludes anything
      // already flat, so in practice only bag-only keys
      // (`actionsVisibility`, `submenuTrigger`) flow through here.
      /* @__PURE__ */ jsx(
        ArvoActionMenu,
        {
          ...menuProps,
          ref: menuRef,
          triggerRef: internalTriggerRef,
          items: processedItems,
          placement,
          search,
          maxHeight,
          hasGroupDividers,
          closeOnSelect,
          isDisabled: isDisabled || isLoading,
          isLoading: false,
          onOpen,
          onClose,
          onSelect: handleSelect,
          onOpenChange: handleInternalOpenChange
        }
      ),
      renderedOverlay
    ] });
  }
);
export {
  ArvoDropdownButton as default
};
//# sourceMappingURL=index57.js.map
