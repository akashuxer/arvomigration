import { useState, useRef, useEffect, useCallback } from "react";
import { createArrowNav } from "@arvo/core";
function useListNavigation(options) {
  const {
    items,
    onSelect,
    onEscape,
    wrap = true,
    enabled = true,
    scrollToIndex,
    typeAhead = true
  } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const onEscapeRef = useRef(onEscape);
  const scrollToIndexRef = useRef(scrollToIndex);
  const itemsRef = useRef(items);
  onSelectRef.current = onSelect;
  onEscapeRef.current = onEscape;
  scrollToIndexRef.current = scrollToIndex;
  itemsRef.current = items;
  const placeholdersRef = useRef([]);
  useEffect(() => {
    var _a;
    if (!enabled) {
      (_a = navRef.current) == null ? void 0 : _a.destroy();
      navRef.current = null;
      return;
    }
    const placeholders = items.map(
      () => document.createElement("span")
    );
    placeholdersRef.current = placeholders;
    const nav = createArrowNav({
      items: placeholders,
      orientation: "vertical",
      wrap,
      onNavigate(_item, index) {
        var _a2;
        setActiveIndex(index);
        (_a2 = scrollToIndexRef.current) == null ? void 0 : _a2.call(scrollToIndexRef, index);
      },
      onSelect(_item, index) {
        onSelectRef.current(itemsRef.current[index], index);
      },
      onEscape() {
        var _a2;
        (_a2 = onEscapeRef.current) == null ? void 0 : _a2.call(onEscapeRef);
      },
      skipDisabled(index) {
        var _a2;
        return ((_a2 = itemsRef.current[index]) == null ? void 0 : _a2.isDisabled) === true;
      },
      typeAhead: typeAhead ? {
        getLabel(index) {
          var _a2;
          return ((_a2 = itemsRef.current[index]) == null ? void 0 : _a2.label) ?? "";
        }
      } : void 0
    });
    navRef.current = nav;
    return () => nav.destroy();
  }, [enabled, wrap, items, typeAhead]);
  const handleKeyDown = useCallback((event) => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.handleKeyDown(event.nativeEvent);
  }, []);
  return { activeIndex, setActiveIndex, handleKeyDown };
}
export {
  useListNavigation
};
//# sourceMappingURL=index93.js.map
