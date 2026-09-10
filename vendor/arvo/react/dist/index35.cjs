"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useTooltip = require("./index10.cjs");
const ArvoIconButtonLink = React.forwardRef(
  function ArvoIconButtonLink2({
    variant = "tertiary",
    size = "md",
    icon,
    href,
    tooltip,
    hasExternalLink = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    target,
    rel,
    className,
    onClick,
    ...rest
  }, ref) {
    const internalRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const tooltipContent = typeof tooltip === "string" ? tooltip : tooltip.content;
    useTooltip.useTooltip({ triggerRef: internalRef, tooltip });
    const effectiveTarget = hasExternalLink && !target ? "_blank" : target;
    const needsRel = effectiveTarget === "_blank";
    const effectiveRel = needsRel ? rel ?? "noopener noreferrer" : rel;
    const classes = [
      "arvo-icon-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`,
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
    return /* @__PURE__ */ jsxRuntime.jsx(
      "a",
      {
        ref: mergeRefs,
        href: isDisabled ? void 0 : href,
        target: isDisabled ? void 0 : effectiveTarget,
        rel: isDisabled ? void 0 : effectiveRel,
        className: classes,
        "aria-label": tooltipContent,
        "aria-disabled": isDisabled ? true : void 0,
        "aria-busy": isLoading ? true : void 0,
        tabIndex: isDisabled ? 0 : void 0,
        onClick: handleClick,
        ...rest,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: `arvo-btn__ico o9con o9con-${icon}`,
            "aria-hidden": "true"
          }
        )
      }
    );
  }
);
exports.default = ArvoIconButtonLink;
//# sourceMappingURL=index35.cjs.map
