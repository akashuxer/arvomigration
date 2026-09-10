"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const PanelBase = require("./index99.cjs");
const ArvoPanel = React.forwardRef(function ArvoPanel2(props, ref) {
  const { children, ...rest } = props;
  const body = React.useMemo(() => {
    if (typeof children === "function") {
      return (ctx) => children({
        searchQuery: ctx.searchQuery
      });
    }
    return children ?? null;
  }, [children]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    PanelBase.default,
    {
      ...rest,
      ref,
      panelType: "custom",
      body
    }
  );
});
exports.default = ArvoPanel;
//# sourceMappingURL=index73.cjs.map
