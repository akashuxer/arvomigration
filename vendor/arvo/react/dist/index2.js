import { jsx } from "react/jsx-runtime";
import { useMemo, useEffect } from "react";
import { createOverlayHub } from "@arvo/core";
import { OverlayContext } from "./index3.js";
function OverlayProvider({
  config,
  children
}) {
  const hub = useMemo(() => {
    const h = createOverlayHub();
    if (config) h.configure(config);
    return h;
  }, []);
  useEffect(() => {
    if (config) hub.configure(config);
  }, [hub, config]);
  return /* @__PURE__ */ jsx(OverlayContext.Provider, { value: hub, children });
}
export {
  OverlayProvider
};
//# sourceMappingURL=index2.js.map
