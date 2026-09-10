"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const OverlayContext = React.createContext(null);
function useOverlayContext() {
  const hub = React.useContext(OverlayContext);
  if (!hub) {
    throw new Error("useOverlay must be used inside <OverlayProvider>");
  }
  return hub;
}
exports.OverlayContext = OverlayContext;
exports.useOverlayContext = useOverlayContext;
//# sourceMappingURL=index3.cjs.map
