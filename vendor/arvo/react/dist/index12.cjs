"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const ContextHelp = require("./index44.cjs");
function buildLabelClassName(base, size, isRequired, isDisabled, isInvalid) {
  return [
    "arvo-form-lbl",
    size === "lg" && "arvo-form-lbl--lg",
    isRequired && "arvo-form-lbl--required",
    isDisabled && "is-disabled",
    isInvalid && "is-invalid",
    base
  ].filter(Boolean).join(" ");
}
function renderRequiredIndicator(isRequired, custom) {
  if (!isRequired) return null;
  return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-form-lbl__req", "aria-hidden": "true", children: custom !== void 0 ? custom : "*" });
}
function renderContextHelp(contextHelp) {
  if (!contextHelp) return null;
  return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-form-lbl__ctx-help", children: /* @__PURE__ */ jsxRuntime.jsx(
    ContextHelp.ArvoContextHelp,
    {
      size: "sm",
      content: contextHelp.content,
      variant: contextHelp.variant,
      ariaLabel: contextHelp.ariaLabel,
      placement: contextHelp.placement
    }
  ) });
}
const ArvoFormLabel = React.forwardRef(
  function ArvoFormLabel2({
    children,
    size = "sm",
    isRequired = false,
    isDisabled = false,
    isInvalid = false,
    requiredIndicator,
    contextHelp,
    className,
    ...rest
  }, ref) {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "label",
      {
        ref,
        className: buildLabelClassName(className, size, isRequired, isDisabled, isInvalid),
        ...rest,
        children: [
          children,
          renderRequiredIndicator(isRequired, requiredIndicator),
          renderContextHelp(contextHelp)
        ]
      }
    );
  }
);
const ArvoFormLabelText = React.forwardRef(
  function ArvoFormLabelText2({
    children,
    size = "sm",
    isRequired = false,
    isDisabled = false,
    isInvalid = false,
    requiredIndicator,
    contextHelp,
    className,
    ...rest
  }, ref) {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "span",
      {
        ref,
        className: buildLabelClassName(className, size, isRequired, isDisabled, isInvalid),
        ...rest,
        children: [
          children,
          renderRequiredIndicator(isRequired, requiredIndicator),
          renderContextHelp(contextHelp)
        ]
      }
    );
  }
);
const FormLabel = ArvoFormLabel;
exports.ArvoFormLabel = ArvoFormLabel;
exports.ArvoFormLabelText = ArvoFormLabelText;
exports.FormLabel = FormLabel;
//# sourceMappingURL=index12.cjs.map
