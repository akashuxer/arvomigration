import { useContext } from "react";
import { overlayHub } from "@arvo/core";
import { OverlayContext } from "./index3.js";
function useOverlay() {
  const hub = useContext(OverlayContext) ?? overlayHub;
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
export {
  useOverlay
};
//# sourceMappingURL=index6.js.map
