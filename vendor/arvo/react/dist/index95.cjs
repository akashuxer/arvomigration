"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
function useHorizontalOverflow(options) {
  const {
    containerRef,
    boundaryRef,
    triggerRef,
    getItems,
    enabled = true,
    triggerWidthEstimate,
    isPinned,
    promotedId,
    deps = []
  } = options;
  const [hiddenIds, setHiddenIds] = React.useState(() => /* @__PURE__ */ new Set());
  const managerRef = React.useRef(null);
  const getItemsRef = React.useRef(getItems);
  getItemsRef.current = getItems;
  const isPinnedRef = React.useRef(isPinned);
  isPinnedRef.current = isPinned;
  const promotedIdRef = React.useRef(promotedId);
  promotedIdRef.current = promotedId;
  const triggerRefHandle = triggerRef;
  React.useEffect(() => {
    var _a;
    if (!enabled) {
      (_a = managerRef.current) == null ? void 0 : _a.destroy();
      managerRef.current = null;
      setHiddenIds((prev) => prev.size > 0 ? /* @__PURE__ */ new Set() : prev);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const boundary = (boundaryRef == null ? void 0 : boundaryRef.current) ?? container;
    const manager = core.createOverflowManager({
      container,
      boundary,
      getItems: () => getItemsRef.current(),
      getTriggerWidth: () => {
        var _a2;
        return ((_a2 = triggerRefHandle == null ? void 0 : triggerRefHandle.current) == null ? void 0 : _a2.offsetWidth) ?? 0;
      },
      triggerWidthEstimate,
      isPinned: isPinnedRef.current ? (id) => {
        var _a2;
        return !!((_a2 = isPinnedRef.current) == null ? void 0 : _a2.call(isPinnedRef, id));
      } : void 0,
      getPromotedId: () => promotedIdRef.current ?? null,
      onChange: (next) => setHiddenIds(next)
    });
    managerRef.current = manager;
    return () => {
      manager.destroy();
      if (managerRef.current === manager) managerRef.current = null;
    };
  }, [enabled, triggerWidthEstimate, ...deps]);
  React.useEffect(() => {
    var _a;
    (_a = managerRef.current) == null ? void 0 : _a.refresh();
  }, [promotedId, ...deps]);
  return {
    hiddenIds,
    refresh: () => {
      var _a;
      return (_a = managerRef.current) == null ? void 0 : _a.refresh();
    }
  };
}
exports.useHorizontalOverflow = useHorizontalOverflow;
//# sourceMappingURL=index95.cjs.map
