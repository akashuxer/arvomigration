import { jsx } from "react/jsx-runtime";
import { useMemo, useEffect } from "react";
import { createTooltipManager } from "@arvo/core";
import { TooltipContext } from "./index5.js";
function TooltipProvider({
  config,
  children
}) {
  const manager = useMemo(() => {
    const m = createTooltipManager();
    if (config) m.configure(config);
    return m;
  }, []);
  useEffect(() => {
    if (config) manager.configure(config);
  }, [manager, config]);
  useEffect(() => {
    return () => manager.destroy();
  }, [manager]);
  return /* @__PURE__ */ jsx(TooltipContext.Provider, { value: manager, children });
}
export {
  TooltipProvider
};
//# sourceMappingURL=index4.js.map
