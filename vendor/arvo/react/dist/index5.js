import { createContext, useContext } from "react";
const TooltipContext = createContext(null);
function useTooltipManager() {
  return useContext(TooltipContext);
}
export {
  TooltipContext,
  useTooltipManager
};
//# sourceMappingURL=index5.js.map
