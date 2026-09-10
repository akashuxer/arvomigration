import { useState, useRef, useCallback, useEffect } from "react";
import { createTreeNav } from "@arvo/core";
function useTreeNavigation(options) {
  const {
    rows,
    onSelect,
    onExpand,
    onCollapse,
    onEscape,
    scrollToIndex,
    enabled = true,
    typeAhead = true
  } = options;
  const [activeIndex, setActiveIndexState] = useState(() => {
    const idx = rows.findIndex((r) => !r.isDisabled);
    return idx === -1 ? 0 : idx;
  });
  const navRef = useRef(null);
  const rowsRef = useRef(rows);
  const onSelectRef = useRef(onSelect);
  const onExpandRef = useRef(onExpand);
  const onCollapseRef = useRef(onCollapse);
  const onEscapeRef = useRef(onEscape);
  const scrollToIndexRef = useRef(scrollToIndex);
  rowsRef.current = rows;
  onSelectRef.current = onSelect;
  onExpandRef.current = onExpand;
  onCollapseRef.current = onCollapse;
  onEscapeRef.current = onEscape;
  scrollToIndexRef.current = scrollToIndex;
  const placeholdersRef = useRef([]);
  const setActiveIndex = useCallback((index) => {
    var _a, _b;
    setActiveIndexState(index);
    (_a = navRef.current) == null ? void 0 : _a.setIndex(index);
    (_b = scrollToIndexRef.current) == null ? void 0 : _b.call(scrollToIndexRef, index);
  }, []);
  useEffect(() => {
    var _a;
    if (!enabled) {
      (_a = navRef.current) == null ? void 0 : _a.destroy();
      navRef.current = null;
      return;
    }
    const placeholders = rows.map(
      () => document.createElement("span")
    );
    placeholdersRef.current = placeholders;
    const nav = createTreeNav({
      items: placeholders,
      getRowMeta(index) {
        const r = rowsRef.current[index];
        return {
          hasChildren: (r == null ? void 0 : r.hasChildren) ?? false,
          isExpanded: (r == null ? void 0 : r.isExpanded) ?? false,
          isDisabled: (r == null ? void 0 : r.isDisabled) ?? false,
          level: (r == null ? void 0 : r.level) ?? 0
        };
      },
      onNavigate(_el, index) {
        var _a2;
        setActiveIndexState(index);
        (_a2 = scrollToIndexRef.current) == null ? void 0 : _a2.call(scrollToIndexRef, index);
      },
      onSelect(_el, index) {
        var _a2;
        const r = rowsRef.current[index];
        if (r) (_a2 = onSelectRef.current) == null ? void 0 : _a2.call(onSelectRef, r, index);
      },
      onEscape() {
        var _a2;
        (_a2 = onEscapeRef.current) == null ? void 0 : _a2.call(onEscapeRef);
      },
      onExpand(index) {
        const r = rowsRef.current[index];
        if (r) onExpandRef.current(r, index);
      },
      onCollapse(index) {
        const r = rowsRef.current[index];
        if (r) onCollapseRef.current(r, index);
      },
      typeAhead: typeAhead ? { getLabel: (index) => {
        var _a2;
        return ((_a2 = rowsRef.current[index]) == null ? void 0 : _a2.label) ?? "";
      } } : void 0
    });
    navRef.current = nav;
    return () => nav.destroy();
  }, [enabled, rows.length, typeAhead]);
  const handleKeyDown = useCallback((event) => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.handleKeyDown(event.nativeEvent);
  }, []);
  useEffect(() => {
    if (rows.length === 0) {
      setActiveIndexState(0);
      return;
    }
    setActiveIndexState((prev) => {
      if (prev >= rows.length) return Math.max(0, rows.length - 1);
      return prev;
    });
  }, [rows.length]);
  return { activeIndex, setActiveIndex, handleKeyDown };
}
export {
  useTreeNavigation
};
//# sourceMappingURL=index94.js.map
