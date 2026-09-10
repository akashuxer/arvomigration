import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { ArvoContextHelp } from "./index44.js";
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
  return /* @__PURE__ */ jsx("span", { className: "arvo-form-lbl__req", "aria-hidden": "true", children: custom !== void 0 ? custom : "*" });
}
function renderContextHelp(contextHelp) {
  if (!contextHelp) return null;
  return /* @__PURE__ */ jsx("span", { className: "arvo-form-lbl__ctx-help", children: /* @__PURE__ */ jsx(
    ArvoContextHelp,
    {
      size: "sm",
      content: contextHelp.content,
      variant: contextHelp.variant,
      ariaLabel: contextHelp.ariaLabel,
      placement: contextHelp.placement
    }
  ) });
}
const ArvoFormLabel = forwardRef(
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
    return /* @__PURE__ */ jsxs(
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
const ArvoFormLabelText = forwardRef(
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
    return /* @__PURE__ */ jsxs(
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
export {
  ArvoFormLabel,
  ArvoFormLabelText,
  FormLabel
};
//# sourceMappingURL=index12.js.map
