import { useState, useRef, useEffect, useCallback } from "react";
import { createArrowNav } from "@arvo/core";
function useKeyboardNav(containerRef, options) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const onNavigateRef = useRef(options.onNavigate);
  const onSelectRef = useRef(options.onSelect);
  const onEscapeRef = useRef(options.onEscape);
  onNavigateRef.current = options.onNavigate;
  onSelectRef.current = options.onSelect;
  onEscapeRef.current = options.onEscape;
  useEffect(() => {
    const nav = createArrowNav({
      items: options.items,
      orientation: options.orientation,
      wrap: options.wrap,
      onNavigate(item, index) {
        setActiveIndex(index);
        onNavigateRef.current(item, index);
      },
      onSelect(item, index) {
        var _a;
        (_a = onSelectRef.current) == null ? void 0 : _a.call(onSelectRef, item, index);
      },
      onEscape() {
        var _a;
        (_a = onEscapeRef.current) == null ? void 0 : _a.call(onEscapeRef);
      }
    });
    navRef.current = nav;
    return () => nav.destroy();
  }, [options.orientation, options.wrap]);
  useEffect(() => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.setItems(options.items);
  }, [options.items]);
  const handleKeyDown = useCallback((event) => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.handleKeyDown(event.nativeEvent);
  }, []);
  return { handleKeyDown, activeIndex };
}
export {
  useKeyboardNav
};
//# sourceMappingURL=index8.js.map
