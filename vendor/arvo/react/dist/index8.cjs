"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
function useKeyboardNav(containerRef, options) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const navRef = React.useRef(null);
  const onNavigateRef = React.useRef(options.onNavigate);
  const onSelectRef = React.useRef(options.onSelect);
  const onEscapeRef = React.useRef(options.onEscape);
  onNavigateRef.current = options.onNavigate;
  onSelectRef.current = options.onSelect;
  onEscapeRef.current = options.onEscape;
  React.useEffect(() => {
    const nav = core.createArrowNav({
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
  React.useEffect(() => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.setItems(options.items);
  }, [options.items]);
  const handleKeyDown = React.useCallback((event) => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.handleKeyDown(event.nativeEvent);
  }, []);
  return { handleKeyDown, activeIndex };
}
exports.useKeyboardNav = useKeyboardNav;
//# sourceMappingURL=index8.cjs.map
