import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useRef, useState, useCallback, useLayoutEffect, useEffect, useMemo } from "react";
import { useControllableState } from "./index90.js";
import { ArvoNavItem } from "./index39.js";
import { NAV_ITEM_MAX_INLINE_ACTIONS } from "./index39.js";
function sortItems(items) {
  const pinned = [];
  const unpinned = [];
  for (const item of items) {
    if (item.isPinned) pinned.push(item);
    else unpinned.push(item);
  }
  return [...pinned, ...unpinned];
}
function getItemOrder(items) {
  return sortItems(items).map((i) => i.id);
}
const ArvoNav = forwardRef(function ArvoNav2({
  size = "md",
  isCompact = false,
  items,
  selectedId: selectedIdProp,
  defaultSelectedId,
  hasPinning = false,
  actionsVisibility = "hover",
  isDisabled = false,
  isLoading: isLoadingProp = false,
  ariaLabel = "Navigation",
  menuProps,
  onSelect,
  onPinChange,
  onAction,
  className,
  ...rest
}, ref) {
  const isLoading = isLoadingProp === true;
  const itemRefs = useRef(/* @__PURE__ */ new Map());
  const listRef = useRef(null);
  const [resolvedSelectedId, setSelectedId] = useControllableState(
    selectedIdProp,
    defaultSelectedId !== void 0 ? defaultSelectedId : null
  );
  const [hasMeasured, setHasMeasured] = useState(false);
  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    if (!resolvedSelectedId) {
      list.style.setProperty("--arvo-nav-active-top", "0px");
      list.style.setProperty("--arvo-nav-active-h", "0px");
      return;
    }
    const activeEl = itemRefs.current.get(resolvedSelectedId);
    if (!activeEl) {
      list.style.setProperty("--arvo-nav-active-top", "0px");
      list.style.setProperty("--arvo-nav-active-h", "0px");
      return;
    }
    list.style.setProperty(
      "--arvo-nav-active-top",
      `${activeEl.offsetTop}px`
    );
    list.style.setProperty(
      "--arvo-nav-active-h",
      `${activeEl.offsetHeight}px`
    );
  }, [resolvedSelectedId]);
  useLayoutEffect(() => {
    updateIndicator();
    if (!hasMeasured) {
      const raf = requestAnimationFrame(() => setHasMeasured(true));
      return () => cancelAnimationFrame(raf);
    }
    return void 0;
  }, [updateIndicator, hasMeasured]);
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(list);
    return () => ro.disconnect();
  }, [updateIndicator]);
  const displayOrder = useMemo(() => sortItems(items), [items]);
  const buildPinToggle = useCallback(
    (item) => {
      if (!hasPinning) return void 0;
      if (item.isPinnable === false) return void 0;
      if (item.isDisabled) return void 0;
      return {
        isSelected: !!item.isPinned,
        tooltip: item.isPinned ? "Unpin" : "Pin",
        onSelectedChange: (next) => {
          const updated = items.map(
            (i) => i.id === item.id ? { ...i, isPinned: next } : i
          );
          onPinChange == null ? void 0 : onPinChange({
            id: item.id,
            pinned: next,
            itemOrder: getItemOrder(updated)
          });
        }
      };
    },
    [hasPinning, items, onPinChange]
  );
  const handleItemSelect = useCallback(
    (item) => {
      if (item.isDisabled || item.isLoading || isDisabled || isLoading) return;
      if (item.id !== resolvedSelectedId) {
        setSelectedId(item.id);
        const idx = items.findIndex((i) => i.id === item.id);
        onSelect == null ? void 0 : onSelect({ id: item.id, item, index: idx });
      }
    },
    [
      isDisabled,
      isLoading,
      resolvedSelectedId,
      setSelectedId,
      items,
      onSelect
    ]
  );
  const focusItem = useCallback((itemId) => {
    var _a;
    (_a = itemRefs.current.get(itemId)) == null ? void 0 : _a.focus();
  }, []);
  const getEnabledItems = useCallback(
    () => displayOrder.filter((i) => !i.isDisabled),
    [displayOrder]
  );
  const handleKeyDown = useCallback(
    (e) => {
      var _a;
      if (isDisabled || isLoading) return;
      const enabled = getEnabledItems();
      if (enabled.length === 0) return;
      const activeId = (_a = document.activeElement) == null ? void 0 : _a.getAttribute("data-nav-item-id");
      const currentIdx = enabled.findIndex((i) => i.id === activeId);
      let nextIdx = null;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % enabled.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIdx = currentIdx < 0 ? enabled.length - 1 : (currentIdx - 1 + enabled.length) % enabled.length;
          break;
        case "Home":
          e.preventDefault();
          nextIdx = 0;
          break;
        case "End":
          e.preventDefault();
          nextIdx = enabled.length - 1;
          break;
        default:
          return;
      }
      if (nextIdx !== null) {
        focusItem(enabled[nextIdx].id);
      }
    },
    [isDisabled, isLoading, getEnabledItems, focusItem]
  );
  const tabStopId = useMemo(() => {
    if (resolvedSelectedId) {
      const sel = items.find(
        (i) => i.id === resolvedSelectedId && !i.isDisabled
      );
      if (sel) return sel.id;
    }
    const firstEnabled = displayOrder.find((i) => !i.isDisabled);
    return (firstEnabled == null ? void 0 : firstEnabled.id) ?? null;
  }, [resolvedSelectedId, items, displayOrder]);
  useEffect(() => {
    if (!resolvedSelectedId) return;
    const exists = items.some((i) => i.id === resolvedSelectedId);
    if (!exists) {
      setSelectedId(null);
    }
  }, [items, resolvedSelectedId, setSelectedId]);
  const handleItemAction = useCallback(
    (item) => (detail, _event) => {
      onAction == null ? void 0 : onAction({ actionId: detail.actionId, itemId: item.id, item });
    },
    [onAction]
  );
  const classes = [
    "arvo-nav",
    `arvo-nav--${size}`,
    isCompact && "arvo-nav--compact",
    actionsVisibility === "always" && "arvo-nav--actions-always",
    isDisabled && "is-disabled",
    isLoading && "loading",
    // `--init` suppresses the indicator/highlight transition on the very
    // first paint so they appear AT the active row instead of sliding in
    // from y=0 / h=0. Removed once the first measurement has flushed.
    !hasMeasured && "arvo-nav--init",
    // `--no-active` collapses the indicator/highlight to opacity 0 when
    // no row is selected (e.g. the active row was removed from items).
    !resolvedSelectedId && "arvo-nav--no-active",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx(
    "nav",
    {
      ...rest,
      ref,
      className: classes,
      "aria-label": ariaLabel,
      "aria-busy": isLoading || void 0,
      onKeyDown: handleKeyDown,
      children: /* @__PURE__ */ jsxs("ul", { className: "arvo-nav__list", role: "list", ref: listRef, children: [
        /* @__PURE__ */ jsx("span", { className: "arvo-nav__highlight", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { className: "arvo-nav__indicator", "aria-hidden": "true" }),
        displayOrder.map((item) => {
          const pinToggle = buildPinToggle(item);
          const isItemSelected = item.id === resolvedSelectedId;
          const tabIndex = item.id === tabStopId ? 0 : -1;
          return /* @__PURE__ */ jsx("li", { role: "listitem", style: { display: "contents" }, children: /* @__PURE__ */ jsx(
            ArvoNavItem,
            {
              ref: (el) => {
                if (el) itemRefs.current.set(item.id, el);
                else itemRefs.current.delete(item.id);
              },
              id: item.id,
              label: item.label,
              size,
              isCompact,
              href: item.href,
              target: item.target,
              rel: item.rel,
              icon: item.icon,
              avatar: item.avatar,
              status: item.status,
              badge: item.badge,
              actions: item.actions,
              menuItems: item.menuItems,
              pinToggle,
              isPinned: item.isPinned,
              isSelected: isItemSelected,
              isDisabled: isDisabled || item.isDisabled,
              isLoading: isLoading || item.isLoading,
              tooltip: item.tooltip,
              actionsVisibility,
              avatarProps: item.avatarProps,
              statusProps: item.statusProps,
              badgeProps: item.badgeProps,
              menuProps: item.menuProps ?? menuProps,
              tabIndex,
              onSelect: () => handleItemSelect(item),
              onAction: handleItemAction(item)
            }
          ) }, item.id);
        })
      ] })
    }
  );
});
export {
  ArvoNav,
  NAV_ITEM_MAX_INLINE_ACTIONS,
  ArvoNav as default
};
//# sourceMappingURL=index38.js.map
