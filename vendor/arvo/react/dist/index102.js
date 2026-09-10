import { createContext, useContext } from "react";
const defaultValue = {
  size: "lg",
  align: "end",
  variant: "surface",
  expandMode: "single",
  isCollapsible: true,
  isDisabled: false,
  isLoading: false,
  expandedValues: /* @__PURE__ */ new Set(),
  toggle: () => false,
  hasProvider: false
};
const AccordionContext = createContext(defaultValue);
function useAccordionContext() {
  return useContext(AccordionContext);
}
export {
  AccordionContext,
  useAccordionContext
};
//# sourceMappingURL=index102.js.map
