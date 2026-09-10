import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useCallback } from "react";
import { useControllableState } from "./index90.js";
import { ArvoFormLabelText } from "./index12.js";
const ArvoSwitch = forwardRef(
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
    const uid = useId();
    const inputId = `arvo-sw-${uid}`;
    const labelId = label ? `arvo-sw-lbl-${uid}` : void 0;
    const inputRef = useRef(null);
    const [isChecked, setChecked] = useControllableState(checkedProp, defaultChecked);
    const classes = [
      "arvo-sw",
      `arvo-sw--${size}`,
      labelPosition === "start" && "arvo-sw--label-start",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      className
    ].filter(Boolean).join(" ");
    const handleChange = useCallback(() => {
      if (isDisabled || isLoading || isReadOnly) return;
      const next = !isChecked;
      setChecked(next);
      onChange == null ? void 0 : onChange({ isChecked: next, value });
    }, [isDisabled, isLoading, isReadOnly, onChange, isChecked, value, setChecked]);
    const handleKeyDown = useCallback(
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
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: classes,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: /* @__PURE__ */ jsxs("label", { className: "arvo-sw__field", children: [
          /* @__PURE__ */ jsx(
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
          /* @__PURE__ */ jsx("span", { className: "arvo-sw__track", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "arvo-sw__thumb" }) }),
          label && /* @__PURE__ */ jsx(
            ArvoFormLabelText,
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
export {
  ArvoSwitch as default
};
//# sourceMappingURL=index26.js.map
