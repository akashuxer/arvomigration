import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const ArvoLink = forwardRef(
  function ArvoLink2({
    variant = "primary",
    size = "lg",
    label,
    href,
    icon,
    isExternal = false,
    isDisabled = false,
    isVisited = true,
    isLoading: isLoadingProp = false,
    target,
    rel,
    className,
    onClick,
    onKeyDown,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const effectiveTarget = isExternal && !target ? "_blank" : target;
    const needsRel = effectiveTarget === "_blank";
    const effectiveRel = needsRel ? rel ?? "noopener noreferrer" : rel;
    const classes = [
      "arvo-lnk",
      `arvo-lnk--${variant}`,
      `arvo-lnk--${size}`,
      isVisited ? "visited" : "",
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
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (blocked) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (!e.defaultPrevented) {
          e.preventDefault();
          e.currentTarget.click();
        }
      }
      onKeyDown == null ? void 0 : onKeyDown(e);
    };
    return /* @__PURE__ */ jsxs(
      "a",
      {
        ref,
        href: isDisabled ? void 0 : href,
        target: isDisabled ? void 0 : effectiveTarget,
        rel: isDisabled ? void 0 : effectiveRel,
        className: classes,
        "aria-disabled": isDisabled ? true : void 0,
        "aria-busy": isLoading ? true : void 0,
        tabIndex: isDisabled ? 0 : void 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        ...rest,
        children: [
          icon && /* @__PURE__ */ jsx(
            "span",
            {
              className: `arvo-lnk__ico o9con o9con-${icon}`,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "arvo-lnk__lbl", children: label }),
          isExternal && /* @__PURE__ */ jsx(
            "span",
            {
              className: "arvo-lnk__ext o9con o9con-external-link",
              "aria-hidden": "true"
            }
          )
        ]
      }
    );
  }
);
export {
  ArvoLink as default
};
//# sourceMappingURL=index32.js.map
