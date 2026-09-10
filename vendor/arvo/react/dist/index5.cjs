"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const TooltipContext = React.createContext(null);
function useTooltipManager() {
  return React.useContext(TooltipContext);
}
exports.TooltipContext = TooltipContext;
exports.useTooltipManager = useTooltipManager;
//# sourceMappingURL=index5.cjs.map
