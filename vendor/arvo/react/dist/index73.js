import { jsx } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";
import PanelBase from "./index99.js";
const ArvoPanel = forwardRef(function ArvoPanel2(props, ref) {
  const { children, ...rest } = props;
  const body = useMemo(() => {
    if (typeof children === "function") {
      return (ctx) => children({
        searchQuery: ctx.searchQuery
      });
    }
    return children ?? null;
  }, [children]);
  return /* @__PURE__ */ jsx(
    PanelBase,
    {
      ...rest,
      ref,
      panelType: "custom",
      body
    }
  );
});
export {
  ArvoPanel as default
};
//# sourceMappingURL=index73.js.map
