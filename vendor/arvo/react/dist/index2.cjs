"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const OverlayContext = require("./index3.cjs");
function OverlayProvider({
  config,
  children
}) {
  const hub = React.useMemo(() => {
    const h = core.createOverlayHub();
    if (config) h.configure(config);
    return h;
  }, []);
  React.useEffect(() => {
    if (config) hub.configure(config);
  }, [hub, config]);
  return /* @__PURE__ */ jsxRuntime.jsx(OverlayContext.OverlayContext.Provider, { value: hub, children });
}
exports.OverlayProvider = OverlayProvider;
//# sourceMappingURL=index2.cjs.map
