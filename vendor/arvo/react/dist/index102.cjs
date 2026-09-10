"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
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
const AccordionContext = React.createContext(defaultValue);
function useAccordionContext() {
  return React.useContext(AccordionContext);
}
exports.AccordionContext = AccordionContext;
exports.useAccordionContext = useAccordionContext;
//# sourceMappingURL=index102.cjs.map
