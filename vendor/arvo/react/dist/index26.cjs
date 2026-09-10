"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useControllableState = require("./index90.cjs");
const FormLabel = require("./index12.cjs");
const ArvoSwitch = React.forwardRef(
  function ArvoSwitch2({
    label = null,
    contextHelp,
    isChecked: checkedProp,
    defaultChecked = false,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    value = "on",
    name,
    labelPosition = "end",
    size = "lg",
    isLoading: isLoadingProp = false,
    onChange,
    onFocus,
    onBlur,
    className,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = React.useId();
    const inputId = `arvo-sw-${uid}`;
    const labelId = label ? `arvo-sw-lbl-${uid}` : void 0;
    const inputRef = React.useRef(null);
    const [isChecked, setChecked] = useControllableState.useControllableState(checkedProp, defaultChecked);
    const classes = [
      "arvo-sw",
      `arvo-sw--${size}`,
      labelPosition === "start" && "arvo-sw--label-start",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      className
    ].filter(Boolean).join(" ");
    const handleChange = React.useCallback(() => {
      if (isDisabled || isLoading || isReadOnly) return;
      const next = !isChecked;
      setChecked(next);
      onChange == null ? void 0 : onChange({ isChecked: next, value });
    }, [isDisabled, isLoading, isReadOnly, onChange, isChecked, value, setChecked]);
    const handleKeyDown = React.useCallback(
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (isDisabled || isLoading || isReadOnly) return;
          const next = !isChecked;
          setChecked(next);
          onChange == null ? void 0 : onChange({ isChecked: next, value });
        }
      },
      [isDisabled, isLoading, isReadOnly, onChange, isChecked, value, setChecked]
    );
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: classes,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "arvo-sw__field", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              ref: inputRef,
              id: inputId,
              className: "arvo-sw__input",
              type: "checkbox",
              role: "switch",
              name,
              value,
              checked: isChecked,
              disabled: isDisabled,
              required: isRequired,
              "aria-checked": isChecked,
              "aria-required": isRequired || void 0,
              "aria-labelledby": labelId,
              onChange: handleChange,
              onKeyDown: handleKeyDown,
              onFocus,
              onBlur
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-sw__track", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-sw__thumb" }) }),
          label && /* @__PURE__ */ jsxRuntime.jsx(
            FormLabel.ArvoFormLabelText,
            {
              id: labelId,
              className: "arvo-sw__lbl",
              size: "sm",
              isDisabled,
              isRequired,
              contextHelp,
              children: label
            }
          )
        ] })
      }
    );
  }
);
exports.default = ArvoSwitch;
//# sourceMappingURL=index26.cjs.map
