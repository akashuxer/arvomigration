"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const TooltipContext = require("./index5.cjs");
function TooltipProvider({
  config,
  children
}) {
  const manager = React.useMemo(() => {
    const m = core.createTooltipManager();
    if (config) m.configure(config);
    return m;
  }, []);
  React.useEffect(() => {
    if (config) manager.configure(config);
  }, [manager, config]);
  React.useEffect(() => {
    return () => manager.destroy();
  }, [manager]);
  return /* @__PURE__ */ jsxRuntime.jsx(TooltipContext.TooltipContext.Provider, { value: manager, children });
}
exports.TooltipProvider = TooltipProvider;
//# sourceMappingURL=index4.cjs.map
