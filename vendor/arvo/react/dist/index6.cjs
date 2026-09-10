"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
const OverlayContext = require("./index3.cjs");
function useOverlay() {
  const hub = React.useContext(OverlayContext.OverlayContext) ?? core.overlayHub;
  return {
    open: (entry) => hub.open(entry),
    close: (id) => hub.close(id),
    closeAll: (opts) => hub.closeAll(opts),
    isOpen: (id) => hub.isOpen(id),
    getContainer: () => hub.getContainer(),
    getZIndex: (id) => hub.getZIndex(id),
    attachWrapperElement: (id, el) => hub.attachWrapperElement(id, el),
    isOverlayClickInside: (root, target) => hub.isOverlayClickInside(root, target)
  };
}
exports.useOverlay = useOverlay;
//# sourceMappingURL=index6.cjs.map
