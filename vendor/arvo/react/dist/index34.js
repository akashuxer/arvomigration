import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useControllableState } from "./index90.js";
const ArvoDisclosureButton = forwardRef(
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
    const [isExpanded, setExpanded] = useControllableState(
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
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ...rest,
        ref,
        type: "button",
        className: classes,
        "aria-expanded": isExpanded,
        onClick: handleClick,
        children: [
          /* @__PURE__ */ jsx("span", { className: "arvo-disc-btn__lbl", children: label }),
          hasChevron && /* @__PURE__ */ jsx(
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
export {
  ArvoDisclosureButton as default
};
//# sourceMappingURL=index34.js.map
