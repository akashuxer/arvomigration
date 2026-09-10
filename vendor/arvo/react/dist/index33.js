import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef } from "react";
const ArvoButtonLink = forwardRef(
  function ArvoButtonLink2({
    variant = "primary",
    size = "md",
    label,
    href,
    icon,
    hasExternalLink = false,
    isDisabled = false,
    isFullWidth = false,
    isLoading: isLoadingProp = false,
    ariaLabel,
    target,
    rel,
    className,
    onClick,
    ...rest
  }, ref) {
    const internalRef = useRef(null);
    const isLoading = isLoadingProp === true;
    const needsRel = target === "_blank";
    const effectiveRel = needsRel ? rel ?? "noopener noreferrer" : rel;
    const classes = [
      "arvo-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`,
      isFullWidth ? "arvo-btn--full-width" : "",
      isDisabled ? "is-disabled" : "",
      isLoading ? "loading" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const blocked = isDisabled || isLoading;
    const handleClick = (e) => {
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick == null ? void 0 : onClick(e);
    };
    const mergeRefs = (node) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    return /* @__PURE__ */ jsxs(
      "a",
      {
        ref: mergeRefs,
        href: isDisabled ? void 0 : href,
        target: isDisabled ? void 0 : target,
        rel: isDisabled ? void 0 : effectiveRel,
        className: classes,
        "aria-label": ariaLabel,
        "aria-disabled": isDisabled ? true : void 0,
        "aria-busy": isLoading ? true : void 0,
        tabIndex: isDisabled ? 0 : void 0,
        onClick: handleClick,
        ...rest,
        children: [
          icon && /* @__PURE__ */ jsx(
            "span",
            {
              className: `arvo-btn__ico o9con o9con-${icon}`,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "arvo-btn__lbl", children: label }),
          hasExternalLink && /* @__PURE__ */ jsx(
            "span",
            {
              className: "arvo-btn__ico o9con o9con-external-link",
              "aria-hidden": "true"
            }
          )
        ]
      }
    );
  }
);
export {
  ArvoButtonLink as default
};
//# sourceMappingURL=index33.js.map
