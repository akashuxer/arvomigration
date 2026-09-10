import { jsx } from "react/jsx-runtime";
import { forwardRef, useMemo, useCallback, useEffect, useRef } from "react";
import { useControllableState } from "./index90.js";
import { ArvoAccordionItem } from "./index70.js";
import { AccordionContext } from "./index102.js";
const EMPTY_ARRAY = [];
function toSet(value, mode) {
  if (value == null) return /* @__PURE__ */ new Set();
  if (mode === "multiple") {
    if (Array.isArray(value)) return new Set(value);
    return /* @__PURE__ */ new Set([value]);
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? /* @__PURE__ */ new Set([value[0]]) : /* @__PURE__ */ new Set();
  }
  return /* @__PURE__ */ new Set([value]);
}
function fromSet(set, mode) {
  if (mode === "multiple") return Array.from(set);
  const first = set.values().next();
  return first.done ? "" : first.value;
}
function resolveDefaultValue(defaultValue, mode) {
  if (defaultValue !== void 0) return defaultValue;
  return mode === "multiple" ? EMPTY_ARRAY : null;
}
const ArvoAccordion = forwardRef(
  function ArvoAccordion2({
    variant = "surface",
    size = "lg",
    align = "end",
    expandMode = "single",
    isCollapsible = true,
    value: valueProp,
    defaultValue,
    items,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    skeletonRowCount = 4,
    ariaLabel,
    ariaLabelledBy,
    onValueChange,
    onExpand,
    onCollapse,
    className,
    children,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const [resolvedValue, setResolvedValue] = useControllableState(valueProp, resolveDefaultValue(defaultValue, expandMode));
    const expandedValues = useMemo(
      () => toSet(resolvedValue, expandMode),
      [resolvedValue, expandMode]
    );
    const toggle = useCallback(
      (itemValue) => {
        const wasExpanded = expandedValues.has(itemValue);
        const next = new Set(expandedValues);
        if (wasExpanded) {
          if (!isCollapsible && expandedValues.size === 1) {
            return false;
          }
          next.delete(itemValue);
        } else {
          if (expandMode === "single") next.clear();
          next.add(itemValue);
        }
        const nextValue = fromSet(next, expandMode);
        const meta = {
          itemValue,
          isExpanded: !wasExpanded
        };
        setResolvedValue(nextValue);
        onValueChange == null ? void 0 : onValueChange(nextValue, meta);
        if (wasExpanded) onCollapse == null ? void 0 : onCollapse({ itemValue });
        else onExpand == null ? void 0 : onExpand({ itemValue });
        return true;
      },
      [
        expandedValues,
        expandMode,
        isCollapsible,
        setResolvedValue,
        onValueChange,
        onExpand,
        onCollapse
      ]
    );
    useEffect(() => {
      if (!items) return;
      if (expandedValues.size === 0) return;
      const valid = new Set(items.map((i) => i.value));
      let needsTrim = false;
      for (const v of expandedValues) {
        if (!valid.has(v)) {
          needsTrim = true;
          break;
        }
      }
      if (!needsTrim) return;
      const next = /* @__PURE__ */ new Set();
      for (const v of expandedValues) if (valid.has(v)) next.add(v);
      const nextValue = fromSet(next, expandMode);
      setResolvedValue(nextValue);
    }, [items, expandedValues, expandMode, setResolvedValue]);
    const rootRef = useRef(null);
    const setRootRef = useCallback(
      (node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          ref.current = node;
      },
      [ref]
    );
    const handleKeyDown = useCallback((e) => {
      var _a;
      const root = rootRef.current;
      if (!root) return;
      const target = e.target;
      if (!target) return;
      const isHeader = target.matches("button.arvo-acc-item__trg");
      if (!isHeader) return;
      const triggers = Array.from(
        root.querySelectorAll(
          'button.arvo-acc-item__trg:not([aria-disabled="true"]):not([disabled])'
        )
      );
      if (triggers.length === 0) return;
      const currentIdx = triggers.indexOf(target);
      let nextIdx = null;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % triggers.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIdx = currentIdx < 0 ? triggers.length - 1 : (currentIdx - 1 + triggers.length) % triggers.length;
          break;
        case "Home":
          e.preventDefault();
          nextIdx = 0;
          break;
        case "End":
          e.preventDefault();
          nextIdx = triggers.length - 1;
          break;
        default:
          return;
      }
      if (nextIdx !== null) {
        (_a = triggers[nextIdx]) == null ? void 0 : _a.focus();
      }
    }, []);
    const ctxValue = useMemo(
      () => ({
        size,
        align,
        variant,
        expandMode,
        isCollapsible,
        isDisabled,
        isLoading,
        expandedValues,
        toggle,
        hasProvider: true
      }),
      [
        size,
        align,
        variant,
        expandMode,
        isCollapsible,
        isDisabled,
        isLoading,
        expandedValues,
        toggle
      ]
    );
    const classes = [
      "arvo-acc",
      `arvo-acc--${variant}`,
      `arvo-acc--${size}`,
      `arvo-acc--align-${align}`,
      isDisabled && "is-disabled",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const showSkeleton = isLoading;
    const rowCount = Math.max(1, skeletonRowCount);
    const renderItems = !children && items && items.length > 0;
    return /* @__PURE__ */ jsx(AccordionContext.Provider, { value: ctxValue, children: /* @__PURE__ */ jsx(
      "div",
      {
        ...rest,
        ref: setRootRef,
        className: classes,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-disabled": isDisabled || void 0,
        "aria-busy": isLoading || void 0,
        onKeyDown: handleKeyDown,
        children: showSkeleton ? /* @__PURE__ */ jsx("div", { className: "arvo-acc__skel", "aria-hidden": "true", children: Array.from({ length: rowCount }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "arvo-acc__skel-row" }, i)) }) : /* @__PURE__ */ jsx("div", { className: "arvo-acc__list", children: renderItems ? items.map((item) => /* @__PURE__ */ jsx(
          ArvoAccordionItem,
          {
            value: item.value,
            title: item.title,
            description: item.description,
            icon: item.icon,
            status: item.status ?? null,
            badge: item.badge ?? null,
            actions: item.actions,
            menuItems: item.menuItems,
            switch: item.switch ?? null,
            search: item.search ?? null,
            hasDivider: item.hasDivider ?? true,
            panelPadding: item.panelPadding,
            isDisabled: item.isDisabled,
            isLoading: item.isLoading,
            isEmpty: item.isEmpty,
            emptyState: item.emptyState,
            statusProps: item.statusProps,
            badgeProps: item.badgeProps,
            menuProps: item.menuProps,
            switchProps: item.switchProps,
            searchProps: item.searchProps,
            children: item.content
          },
          item.value
        )) : children })
      }
    ) });
  }
);
export {
  ArvoAccordion,
  ArvoAccordion as default
};
//# sourceMappingURL=index69.js.map
