import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useRef, useMemo, useCallback, useLayoutEffect, useEffect } from "react";
import { ArvoButton } from "./index16.js";
import { ArvoIconButton } from "./index17.js";
import { ArvoActionMenu } from "./index49.js";
import { useControllableState } from "./index90.js";
import { useHorizontalOverflow } from "./index95.js";
const KNOWN_PROP_TYPOS = {
  iconOnly: "isIconOnly",
  multiSelect: "isMultiSelect",
  disabled: "isDisabled",
  loading: "isLoading",
  overflow: "hasOverflow",
  selected: "value"
};
function stripKnownTypos(props) {
  let warned = false;
  const out = {};
  for (const key of Object.keys(props)) {
    const canonical = KNOWN_PROP_TYPOS[key];
    if (canonical) {
      if (!warned && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
        warned = true;
        console.warn(
          `[ArvoButtonGroup] Received unknown prop "${key}" -- did you mean "${canonical}"? The prop has been dropped to avoid a React DOM warning; please update the call site.`
        );
      }
      continue;
    }
    out[key] = props[key];
  }
  return out;
}
const ArvoButtonGroup = forwardRef(
  function ArvoButtonGroup2({
    items,
    value: valueProp,
    defaultValue = null,
    variant = "primary",
    size = "lg",
    isMultiSelect = false,
    isIconOnly = false,
    hasOverflow = false,
    expandOnSelect = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    ariaLabel,
    overflowMenuProps,
    onChange,
    className,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const [value, setValue] = useControllableState(valueProp, defaultValue);
    const containerRef = useRef(null);
    const boundaryRef = useRef(null);
    const itemRefs = useRef([]);
    const indicatorRef = useRef(null);
    const indicatorReady = useRef(false);
    const overflowTriggerRef = useRef(null);
    const overflowMenuRef = useRef(null);
    const effectiveExpandOnSelect = expandOnSelect && !isMultiSelect;
    const buttonSize = size === "sm" ? "sm" : "md";
    const classes = useMemo(
      () => [
        "arvo-btn-grp",
        `arvo-btn-grp--${variant}`,
        `arvo-btn-grp--${size}`,
        isMultiSelect && "arvo-btn-grp--multi",
        isIconOnly && "arvo-btn-grp--icon-only",
        hasOverflow && "arvo-btn-grp--overflow",
        effectiveExpandOnSelect && "arvo-btn-grp--expand-lbl",
        isDisabled && "is-disabled",
        isLoading && "loading",
        className
      ].filter(Boolean).join(" "),
      [variant, size, isMultiSelect, isIconOnly, hasOverflow, effectiveExpandOnSelect, isDisabled, isLoading, className]
    );
    const isItemActive = useCallback(
      (itemValue) => {
        if (isMultiSelect) {
          return Array.isArray(value) && value.includes(itemValue);
        }
        return value === itemValue;
      },
      [value, isMultiSelect]
    );
    const handleItemClick = useCallback(
      (itemValue) => {
        if (isDisabled || isLoading) return;
        const item = items.find((i) => i.value === itemValue);
        if (!item || item.isDisabled) return;
        if (isMultiSelect) {
          const currentValues = Array.isArray(value) ? value : [];
          const idx = currentValues.indexOf(itemValue);
          const isSelected = idx === -1;
          const newValues = isSelected ? [...currentValues, itemValue] : currentValues.filter((v) => v !== itemValue);
          setValue(newValues);
          onChange == null ? void 0 : onChange({
            value: newValues,
            previousValue: [...currentValues],
            changedValue: itemValue,
            isSelected
          });
        } else {
          if (value === itemValue) return;
          setValue(itemValue);
          onChange == null ? void 0 : onChange({
            value: itemValue,
            previousValue: value ?? null
          });
        }
      },
      [isDisabled, isLoading, items, isMultiSelect, value, onChange, setValue]
    );
    const itemIds = useMemo(() => items.map((i) => i.value), [items]);
    const { hiddenIds } = useHorizontalOverflow({
      containerRef,
      // Detect overflow against the PARENT element's width so the
      // button-group root itself can stay `inline-flex` (content-sized)
      // and the trigger sits flush with the last visible segment -- no
      // whitespace inside the group when there's room for the full
      // toolbar, and seamless growth/shrink as the parent resizes.
      boundaryRef,
      triggerRef: overflowTriggerRef,
      enabled: hasOverflow,
      getItems: () => {
        const out = [];
        for (let i = 0; i < items.length; i++) {
          const el = itemRefs.current[i];
          if (el) out.push({ id: items[i].value, el });
        }
        return out;
      },
      promotedId: !isMultiSelect && typeof value === "string" ? value : null,
      deps: [itemIds, isMultiSelect]
    });
    const hiddenIndexSet = useMemo(() => {
      const s = /* @__PURE__ */ new Set();
      items.forEach((item, i) => {
        if (hiddenIds.has(item.value)) s.add(i);
      });
      return s;
    }, [items, hiddenIds]);
    const getRovingTabIndex = useCallback(
      (index, itemValue) => {
        var _a;
        if (hiddenIndexSet.has(index)) return -1;
        const enabledVisibleItems = items.map((item, i) => ({ item, i })).filter(({ item, i }) => !item.isDisabled && !isDisabled && !hiddenIndexSet.has(i));
        if (enabledVisibleItems.length === 0) return -1;
        const selectedItem = enabledVisibleItems.find(({ item }) => isItemActive(item.value));
        if (selectedItem) {
          return selectedItem.item.value === itemValue ? 0 : -1;
        }
        return ((_a = enabledVisibleItems[0]) == null ? void 0 : _a.i) === index ? 0 : -1;
      },
      [items, isDisabled, hiddenIndexSet, isItemActive]
    );
    const handleKeyDown = useCallback(
      (event) => {
        if (isDisabled || isLoading) return;
        const { key } = event;
        const isArrow = key === "ArrowLeft" || key === "ArrowRight";
        const isEdge = key === "Home" || key === "End";
        const isActivate = key === "Enter" || key === " ";
        if (!isArrow && !isEdge && !isActivate) return;
        const enabledItems = items.map((item, i) => ({ item, i, el: itemRefs.current[i] })).filter(({ item, i, el }) => el && !item.isDisabled && !isDisabled && !hiddenIndexSet.has(i));
        if (enabledItems.length === 0) return;
        const focusedEl = document.activeElement;
        const currentEnabledIdx = enabledItems.findIndex(({ el }) => el === focusedEl);
        if (isArrow || isEdge) {
          event.preventDefault();
          let targetIdx;
          if (key === "ArrowRight") {
            targetIdx = currentEnabledIdx === -1 ? 0 : (currentEnabledIdx + 1) % enabledItems.length;
          } else if (key === "ArrowLeft") {
            targetIdx = currentEnabledIdx === -1 ? enabledItems.length - 1 : (currentEnabledIdx - 1 + enabledItems.length) % enabledItems.length;
          } else if (key === "Home") {
            targetIdx = 0;
          } else {
            targetIdx = enabledItems.length - 1;
          }
          const targetItem = enabledItems[targetIdx];
          if (targetItem == null ? void 0 : targetItem.el) {
            for (const el of itemRefs.current) {
              if (el) el.tabIndex = -1;
            }
            targetItem.el.tabIndex = 0;
            targetItem.el.focus();
            if (!isMultiSelect) {
              handleItemClick(targetItem.item.value);
            }
          }
        } else if (isActivate) {
          event.preventDefault();
          if (currentEnabledIdx !== -1) {
            handleItemClick(enabledItems[currentEnabledIdx].item.value);
          }
        }
      },
      [isDisabled, isLoading, items, hiddenIndexSet, isMultiSelect, handleItemClick]
    );
    useLayoutEffect(() => {
      var _a;
      if (!effectiveExpandOnSelect) return;
      const measure = () => {
        for (let i = 0; i < itemRefs.current.length; i++) {
          const btnEl = itemRefs.current[i];
          if (!btnEl) continue;
          const lblEl = btnEl.querySelector(".arvo-btn__lbl");
          if (!lblEl) {
            btnEl.style.removeProperty("--arvo-btn-grp-lbl-w");
            continue;
          }
          const natural = lblEl.scrollWidth;
          if (natural <= 0) continue;
          const expanded = Math.ceil(natural) + 2;
          btnEl.style.setProperty("--arvo-btn-grp-lbl-w", `${expanded}px`);
        }
      };
      measure();
      let cancelled = false;
      if (typeof document !== "undefined" && ((_a = document.fonts) == null ? void 0 : _a.ready)) {
        document.fonts.ready.then(() => {
          if (cancelled) return;
          measure();
        }).catch(() => {
        });
      }
      return () => {
        cancelled = true;
      };
    }, [items, effectiveExpandOnSelect]);
    useLayoutEffect(() => {
      const ind = indicatorRef.current;
      const container = containerRef.current;
      if (!ind || !container || isMultiSelect) return;
      const activeIdx = items.findIndex((item) => isItemActive(item.value));
      if (activeIdx === -1) {
        ind.style.display = "none";
        return;
      }
      const activeBtn = itemRefs.current[activeIdx];
      if (!activeBtn) return;
      const syncIndicator = () => {
        const btnRect = activeBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const width = btnRect.width;
        if (width === 0) return false;
        if (!indicatorReady.current) {
          ind.style.transition = "none";
        }
        ind.style.display = "";
        container.style.setProperty(
          "--arvo-btn-grp-ind-x",
          `${btnRect.left - containerRect.left}px`
        );
        container.style.setProperty("--arvo-btn-grp-ind-w", `${width}px`);
        if (!indicatorReady.current) {
          ind.getBoundingClientRect();
          ind.style.transition = "";
          indicatorReady.current = true;
        }
        return true;
      };
      if (!syncIndicator()) {
        requestAnimationFrame(() => {
          syncIndicator();
        });
      }
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => {
        syncIndicator();
      });
      if (effectiveExpandOnSelect) {
        for (const el of itemRefs.current) {
          if (el) observer.observe(el);
        }
      } else {
        observer.observe(activeBtn);
      }
      return () => observer.disconnect();
    }, [value, items, isMultiSelect, isItemActive, effectiveExpandOnSelect, hiddenIds]);
    const overflowMenuItems = useMemo(() => {
      return items.filter((item) => hiddenIds.has(item.value)).map((item) => ({
        id: item.value,
        label: item.label ?? item.value,
        icon: item.icon,
        isDisabled: item.isDisabled,
        active: isItemActive(item.value)
      }));
    }, [items, hiddenIds, isItemActive]);
    const handleOverflowSelect = useCallback(
      (item) => {
        if (item.isDisabled) return;
        handleItemClick(item.id);
      },
      [handleItemClick]
    );
    const mergedRef = useCallback(
      (node) => {
        containerRef.current = node;
        boundaryRef.current = (node == null ? void 0 : node.parentElement) ?? node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    useEffect(() => {
      itemRefs.current.length = items.length;
    }, [items.length]);
    const cleanRest = stripKnownTypos(rest);
    const showOverflowTrigger = hasOverflow && hiddenIds.size > 0;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: mergedRef,
        className: classes,
        role: "toolbar",
        "aria-orientation": "horizontal",
        "aria-label": ariaLabel,
        "aria-busy": isLoading || void 0,
        onKeyDown: handleKeyDown,
        ...cleanRest,
        children: [
          !isMultiSelect && /* @__PURE__ */ jsx("span", { ref: indicatorRef, className: "arvo-btn-grp__ind" }),
          items.map((item, index) => {
            const isActive = isItemActive(item.value);
            const isItemDisabled = isDisabled || (item.isDisabled ?? false);
            const isItemLoading = isLoading && !(item.isExcluded ?? false);
            const useAsIconOnly = isIconOnly;
            const tabIdx = getRovingTabIndex(index, item.value);
            const refCallback = (el) => {
              itemRefs.current[index] = el;
            };
            const handleClick = () => handleItemClick(item.value);
            if (useAsIconOnly || !item.label && item.icon) {
              return /* @__PURE__ */ jsx(
                ArvoIconButton,
                {
                  ref: refCallback,
                  icon: item.icon ?? "",
                  tooltip: item.label ?? item.value,
                  variant: "tertiary",
                  size: buttonSize,
                  isDisabled: isItemDisabled,
                  isLoading: isItemLoading,
                  isSelected: isActive,
                  tabIndex: tabIdx,
                  "data-value": item.value,
                  onClick: handleClick
                },
                item.value
              );
            }
            return /* @__PURE__ */ jsx(
              ArvoButton,
              {
                ref: refCallback,
                label: item.label ?? item.value,
                icon: item.icon,
                variant: "tertiary",
                size: buttonSize,
                isDisabled: isItemDisabled,
                isLoading: isItemLoading,
                isSelected: isActive,
                tabIndex: tabIdx,
                "data-value": item.value,
                onClick: handleClick
              },
              item.value
            );
          }),
          showOverflowTrigger && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ArvoIconButton,
              {
                ref: overflowTriggerRef,
                className: "arvo-btn-grp__overflow",
                icon: "ellipsis-v",
                tooltip: "More actions",
                variant: "tertiary",
                size: buttonSize,
                isDisabled
              }
            ),
            /* @__PURE__ */ jsx(
              ArvoActionMenu,
              {
                ...overflowMenuProps,
                ref: overflowMenuRef,
                triggerRef: overflowTriggerRef,
                items: overflowMenuItems,
                placement: "bottom-end",
                closeOnSelect: true,
                isDisabled: isDisabled || isLoading,
                onSelect: handleOverflowSelect
              }
            )
          ] })
        ]
      }
    );
  }
);
export {
  ArvoButtonGroup as default
};
//# sourceMappingURL=index30.js.map
