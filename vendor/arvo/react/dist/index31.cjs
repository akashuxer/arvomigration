"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const Button = require("./index16.cjs");
const IconButton = require("./index17.cjs");
const VALID_VARIANTS = ["primary", "secondary"];
const ArvoFabButton = React.forwardRef(
  function ArvoFabButton2({
    variant = "primary",
    icon = "plus",
    label,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    zIndex,
    tooltip,
    onClick,
    onFocus,
    onBlur
  }, ref) {
    const isLoading = isLoadingProp === true;
    const btnRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
      focus: () => {
        var _a;
        return (_a = btnRef.current) == null ? void 0 : _a.focus();
      },
      buttonElement: btnRef.current
    }));
    const safeVariant = VALID_VARIANTS.includes(variant) ? variant : "primary";
    const isWithLabel = !!label;
    const wrapperClasses = [
      "arvo-fab-btn",
      `arvo-fab-btn--${safeVariant}`,
      isWithLabel ? "arvo-fab-btn--with-label" : "arvo-fab-btn--icon-only",
      isDisabled ? "is-disabled" : "",
      isLoading ? "loading" : ""
    ].filter(Boolean).join(" ");
    const wrapperStyle = zIndex !== void 0 ? { zIndex } : void 0;
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: wrapperClasses,
        style: wrapperStyle,
        "aria-busy": isLoading ? true : void 0,
        children: isWithLabel ? /* @__PURE__ */ jsxRuntime.jsx(
          Button.ArvoButton,
          {
            ref: btnRef,
            variant: safeVariant,
            size: "md",
            icon,
            label,
            isDisabled,
            isLoading,
            onClick,
            onFocus,
            onBlur
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          IconButton.ArvoIconButton,
          {
            ref: btnRef,
            variant: safeVariant,
            size: "lg",
            icon,
            tooltip: tooltip ?? "",
            isDisabled,
            isLoading,
            onClick,
            onFocus,
            onBlur
          }
        )
      }
    );
  }
);
exports.default = ArvoFabButton;
//# sourceMappingURL=index31.cjs.map
