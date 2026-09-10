"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
function readAriaExpanded(el) {
  if (!el) return false;
  const attr = el.getAttribute("aria-expanded");
  return attr === "true";
}
function useOpenStateSync(options) {
  const {
    isOpen,
    triggerRef,
    onOpenChange,
    defaultOpen = false,
    enabled = true
  } = options;
  const isControlled = isOpen !== void 0;
  const [observed, setObserved] = React.useState(() => {
    return readAriaExpanded(triggerRef.current) || defaultOpen;
  });
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const prevControlledRef = React.useRef(isOpen);
  React.useEffect(() => {
    var _a;
    if (!enabled) return;
    if (!isControlled) {
      prevControlledRef.current = void 0;
      return;
    }
    if (prevControlledRef.current !== isOpen) {
      prevControlledRef.current = isOpen;
      (_a = onOpenChangeRef.current) == null ? void 0 : _a.call(onOpenChangeRef, isOpen);
    }
  }, [enabled, isControlled, isOpen]);
  React.useEffect(() => {
    if (!enabled || isControlled) return;
    const el = triggerRef.current;
    if (!el || typeof MutationObserver === "undefined") return;
    const initial = readAriaExpanded(el);
    setObserved((prev) => {
      var _a;
      if (prev !== initial) (_a = onOpenChangeRef.current) == null ? void 0 : _a.call(onOpenChangeRef, initial);
      return initial;
    });
    const observer = new MutationObserver(() => {
      const next = readAriaExpanded(el);
      setObserved((prev) => {
        var _a;
        if (prev === next) return prev;
        (_a = onOpenChangeRef.current) == null ? void 0 : _a.call(onOpenChangeRef, next);
        return next;
      });
    });
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["aria-expanded"]
    });
    return () => observer.disconnect();
  }, [enabled, isControlled, triggerRef]);
  if (!enabled) return defaultOpen;
  return isControlled ? isOpen : observed;
}
exports.useOpenStateSync = useOpenStateSync;
//# sourceMappingURL=index91.cjs.map
