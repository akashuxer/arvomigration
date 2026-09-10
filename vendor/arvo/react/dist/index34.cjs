"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useControllableState = require("./index90.cjs");
const ArvoDisclosureButton = React.forwardRef(
  function ArvoDisclosureButton2({
    label,
    size = "md",
    isExpanded: isExpandedProp,
    defaultExpanded = false,
    hasChevron = true,
    onExpandedChange,
    className,
    onClick,
    ...rest
  }, ref) {
    const [isExpanded, setExpanded] = useControllableState.useControllableState(
      isExpandedProp,
      defaultExpanded
    );
    const classes = [
      "arvo-disc-btn",
      `arvo-disc-btn--${size}`,
      className ?? ""
    ].filter(Boolean).join(" ");
    const handleClick = (event) => {
      const next = !isExpanded;
      setExpanded(next);
      onExpandedChange == null ? void 0 : onExpandedChange(next);
      onClick == null ? void 0 : onClick(event);
    };
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        ...rest,
        ref,
        type: "button",
        className: classes,
        "aria-expanded": isExpanded,
        onClick: handleClick,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-disc-btn__lbl", children: label }),
          hasChevron && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "arvo-disc-btn__chev o9con o9con-angle-down",
              "aria-hidden": "true"
            }
          )
        ]
      }
    );
  }
);
exports.default = ArvoDisclosureButton;
//# sourceMappingURL=index34.cjs.map
