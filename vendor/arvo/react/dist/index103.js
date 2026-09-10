import { jsx, jsxs } from "react/jsx-runtime";
import { useId, useMemo, useRef, useCallback, useState, useEffect } from "react";
import { createArrowNav } from "@arvo/core";
import { MenuItemRow } from "./index109.js";
import { Submenu } from "./index110.js";
import { flattenContextMenuItems, isContextMenuFocusable, isContextMenuGrouped } from "./index111.js";
const DEFAULT_SUBMENU_HOVER_DELAY = 200;
function MenuContent(props) {
  const {
    items,
    context,
    surfaceId,
    parentSurfaceId,
    submenuHoverDelayMs = DEFAULT_SUBMENU_HOVER_DELAY,
    hasGroupDividers = true,
    onSelect,
    onRequestClose,
    autoFocusFirst = true
  } = props;
  const uid = useId();
  const rowIdPrefix = `${surfaceId}-${uid.replace(/[:]/g, "")}`;
  const flatItems = useMemo(() => flattenContextMenuItems(items), [items]);
  const rowRefs = useRef(/* @__PURE__ */ new Map());
  const setRowRef = useCallback((id, node) => {
    if (node) rowRefs.current.set(id, node);
    else rowRefs.current.delete(id);
  }, []);
  const [activeIndex, setActiveIndex] = useState(() => {
    return flatItems.findIndex((i) => isContextMenuFocusable(i));
  });
  const [openSubmenuId, setOpenSubmenuId] = useState(null);
  const hoverTimerRef = useRef(
    void 0
  );
  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== void 0) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = void 0;
    }
  }, []);
  useEffect(() => () => clearHoverTimer(), [clearHoverTimer]);
  useEffect(() => {
    const firstFocusable = flatItems.findIndex((i) => isContextMenuFocusable(i));
    setActiveIndex(firstFocusable >= 0 ? firstFocusable : 0);
    setOpenSubmenuId(null);
  }, [flatItems]);
  useEffect(() => {
    if (!autoFocusFirst) return;
    const first = flatItems[activeIndex];
    if (!first) return;
    const node = rowRefs.current.get(first.id);
    node == null ? void 0 : node.focus({ preventScroll: true });
  }, []);
  const arrowRef = useRef(null);
  useEffect(() => {
    const items2 = flatItems.map((it) => {
      const el = rowRefs.current.get(it.id);
      return el ?? null;
    }).filter(Boolean);
    arrowRef.current = createArrowNav({
      items: items2,
      orientation: "vertical",
      wrap: true,
      onNavigate: (_el, idx) => {
        setActiveIndex(idx);
        const it = flatItems[idx];
        const node = it ? rowRefs.current.get(it.id) : null;
        node == null ? void 0 : node.focus({ preventScroll: true });
      },
      skipDisabled: (idx) => {
        const it = flatItems[idx];
        if (!it) return true;
        return !isContextMenuFocusable(it);
      },
      typeAhead: {
        getLabel: (idx) => {
          const it = flatItems[idx];
          return it && it.kind !== "separator" ? it.label : "";
        }
      }
    });
    arrowRef.current.setIndex(activeIndex);
    return () => {
      var _a;
      (_a = arrowRef.current) == null ? void 0 : _a.destroy();
      arrowRef.current = null;
    };
  }, [flatItems]);
  const invokeItem = useCallback(
    (item, index) => {
      var _a, _b, _c;
      if (item.kind === "separator" || item.isDisabled) return;
      const hasSubmenu = "submenu" in item && Array.isArray(item.submenu) && item.submenu.length > 0;
      if (hasSubmenu) {
        setOpenSubmenuId(item.id);
        return;
      }
      if (item.kind === "checkbox") {
        (_a = item.onChange) == null ? void 0 : _a.call(item, !item.checked, context);
        onSelect({ item, index, context, closeOnSelect: false });
        return;
      }
      if (item.kind === "radio") {
        if (!item.checked) (_b = item.onChange) == null ? void 0 : _b.call(item, context);
        onSelect({ item, index, context, closeOnSelect: false });
        return;
      }
      const ret = (_c = item.onSelect) == null ? void 0 : _c.call(item, context);
      onSelect({
        item,
        index,
        context,
        closeOnSelect: ret !== false
      });
    },
    [context, onSelect]
  );
  const handleKeyDown = useCallback(
    (e) => {
      var _a;
      const ctl = arrowRef.current;
      if (!ctl) return;
      if (e.key === "ArrowRight") {
        const item = flatItems[activeIndex];
        const hasSubmenu = item && item.kind !== "separator" && "submenu" in item && !!((_a = item.submenu) == null ? void 0 : _a.length);
        if (hasSubmenu) {
          e.preventDefault();
          e.stopPropagation();
          setOpenSubmenuId(item.id);
          return;
        }
      }
      if (e.key === "ArrowLeft" && openSubmenuId) {
        e.preventDefault();
        e.stopPropagation();
        setOpenSubmenuId(null);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (openSubmenuId) {
          setOpenSubmenuId(null);
          return;
        }
        onRequestClose();
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        const item = flatItems[activeIndex];
        if (item) {
          e.preventDefault();
          invokeItem(item, activeIndex);
        }
        return;
      }
      ctl.handleKeyDown(e.nativeEvent);
    },
    [activeIndex, flatItems, openSubmenuId, invokeItem, onRequestClose]
  );
  const handleMouseEnter = useCallback(
    (item, index) => {
      var _a, _b;
      if (item.kind === "separator" || item.isDisabled) return;
      setActiveIndex(index);
      (_a = arrowRef.current) == null ? void 0 : _a.setIndex(index);
      const hasSubmenu = "submenu" in item && !!((_b = item.submenu) == null ? void 0 : _b.length);
      if (hasSubmenu) {
        clearHoverTimer();
        if (submenuHoverDelayMs <= 0) {
          setOpenSubmenuId(item.id);
        } else {
          hoverTimerRef.current = setTimeout(() => {
            setOpenSubmenuId(item.id);
          }, submenuHoverDelayMs);
        }
      } else if (openSubmenuId) {
        clearHoverTimer();
        hoverTimerRef.current = setTimeout(() => {
          setOpenSubmenuId(null);
        }, submenuHoverDelayMs);
      }
    },
    [clearHoverTimer, openSubmenuId, submenuHoverDelayMs]
  );
  const handleMouseLeave = useCallback(() => {
  }, []);
  let flatIndex = 0;
  const renderRow = (item) => {
    var _a;
    const idx = flatIndex++;
    const rowId = `${rowIdPrefix}-row-${idx}`;
    const hasSubmenu = item.kind !== "separator" && "submenu" in item && !!((_a = item.submenu) == null ? void 0 : _a.length);
    const isActive = idx === activeIndex && isContextMenuFocusable(item);
    const isSubmenuOpen = hasSubmenu && openSubmenuId === item.id;
    const rowProps = {
      item,
      id: rowId,
      index: idx,
      isActive,
      isSubmenuOpen,
      hasSubmenu,
      rowRef: (node) => setRowRef(item.id, node),
      onClick: (e) => {
        e.stopPropagation();
        invokeItem(item, idx);
      },
      onMouseEnter: () => handleMouseEnter(item, idx),
      onMouseLeave: handleMouseLeave,
      onFocus: () => {
        var _a2;
        if (isContextMenuFocusable(item)) {
          setActiveIndex(idx);
          (_a2 = arrowRef.current) == null ? void 0 : _a2.setIndex(idx);
        }
      }
    };
    if (!hasSubmenu) {
      return /* @__PURE__ */ jsx(MenuItemRow, { ...rowProps }, item.id);
    }
    return /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsx(MenuItemRow, { ...rowProps }),
      isSubmenuOpen && /* @__PURE__ */ jsx(
        Submenu,
        {
          items: item.submenu,
          context,
          parentId: parentSurfaceId,
          ariaLabel: "label" in item ? item.label : void 0,
          anchorRef: { current: rowRefs.current.get(item.id) ?? null },
          isOpen: true,
          onClose: () => {
            setOpenSubmenuId(null);
            const row = rowRefs.current.get(item.id);
            row == null ? void 0 : row.focus({ preventScroll: true });
          },
          onSelect: (info) => onSelect(info)
        }
      )
    ] }, item.id);
  };
  const grouped = isContextMenuGrouped(items);
  return /* @__PURE__ */ jsx("div", { onKeyDown: handleKeyDown, children: grouped ? items.map((group, gi) => /* @__PURE__ */ jsxs("div", { role: "group", "aria-label": group.label, children: [
    gi > 0 && hasGroupDividers && /* @__PURE__ */ jsx("div", { className: "arvo-context-menu__divider", role: "separator" }),
    group.label && /* @__PURE__ */ jsx("div", { className: "arvo-context-menu__hdr", children: group.label }),
    group.items.map(renderRow)
  ] }, group.id)) : items.map(renderRow) });
}
export {
  MenuContent
};
//# sourceMappingURL=index103.js.map
