"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useTooltip = require("./index10.cjs");
const ArvoContextHelp = React.forwardRef(
  function ArvoContextHelp2({
    content,
    variant = "info",
    size = "sm",
    placement = "bottom-center",
    ariaLabel,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    className,
    onClick,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  }, ref) {
    const internalRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const blocked = isDisabled || isLoading;
    const [isHover, setHover] = React.useState(false);
    const [isFocused, setFocused] = React.useState(false);
    const isActive = (isHover || isFocused) && !blocked;
    const glyphClass = variant === "question" ? isActive ? "o9con-question" : "o9con-question-circle" : isActive ? "o9con-info-circle-filled" : "o9con-info-circle";
    useTooltip.useTooltip({
      triggerRef: internalRef,
      tooltip: blocked ? void 0 : { content, placement }
    });
    const classes = [
      "arvo-ctx-help",
      `arvo-ctx-help--${variant}`,
      `arvo-ctx-help--${size}`,
      isLoading ? "loading" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const mergeRefs = (node) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    const handleMouseEnter = (e) => {
      setHover(true);
      onMouseEnter == null ? void 0 : onMouseEnter(e);
    };
    const handleMouseLeave = (e) => {
      setHover(false);
      onMouseLeave == null ? void 0 : onMouseLeave(e);
    };
    const handleFocus = (e) => {
      setFocused(true);
      onFocus == null ? void 0 : onFocus(e);
    };
    const handleBlur = (e) => {
      setFocused(false);
      onBlur == null ? void 0 : onBlur(e);
    };
    const handleClick = (e) => {
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick == null ? void 0 : onClick(e);
    };
    const handleKeyDown = (e) => {
      if (blocked && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onKeyDown == null ? void 0 : onKeyDown(e);
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        ref: mergeRefs,
        type: "button",
        disabled: isDisabled,
        ...rest,
        className: classes,
        "aria-label": ariaLabel ?? content,
        "aria-busy": isLoading ? true : void 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: `arvo-ctx-help__ico o9con ${glyphClass}`,
            "aria-hidden": "true"
          }
        )
      }
    );
  }
);
exports.ArvoContextHelp = ArvoContextHelp;
//# sourceMappingURL=index44.cjs.map
