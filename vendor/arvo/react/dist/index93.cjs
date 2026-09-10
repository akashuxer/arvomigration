"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const navRef = React.useRef(null);
  const onSelectRef = React.useRef(onSelect);
  const onEscapeRef = React.useRef(onEscape);
  const scrollToIndexRef = React.useRef(scrollToIndex);
  const itemsRef = React.useRef(items);
  onSelectRef.current = onSelect;
  onEscapeRef.current = onEscape;
  scrollToIndexRef.current = scrollToIndex;
  itemsRef.current = items;
  const placeholdersRef = React.useRef([]);
  React.useEffect(() => {
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
    const nav = core.createArrowNav({
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
  const handleKeyDown = React.useCallback((event) => {
    var _a;
    (_a = navRef.current) == null ? void 0 : _a.handleKeyDown(event.nativeEvent);
  }, []);
  return { activeIndex, setActiveIndex, handleKeyDown };
}
exports.useListNavigation = useListNavigation;
//# sourceMappingURL=index93.cjs.map
