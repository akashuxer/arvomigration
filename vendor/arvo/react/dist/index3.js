import { createContext, useContext } from "react";
const OverlayContext = createContext(null);
function useOverlayContext() {
  const hub = useContext(OverlayContext);
  if (!hub) {
    throw new Error("useOverlay must be used inside <OverlayProvider>");
  }
  return hub;
}
export {
  OverlayContext,
  useOverlayContext
};
//# sourceMappingURL=index3.js.map
