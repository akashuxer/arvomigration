import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useId, useContext, useEffect } from "react";
import { RadioGroupContext } from "./index25.js";
import { useControllableState } from "./index90.js";
import { ArvoFormLabelText } from "./index12.js";
import { ArvoMessageAlert } from "./index13.js";
const ArvoRadio = forwardRef(
  function ArvoRadio2({
    value,
    name,
    label = null,
    contextHelp,
    isChecked: checkedProp,
    defaultChecked = false,
    isDisabled = false,
    isRequired = false,
    isReadOnly = false,
    isInvalid = false,
    isLoading: isLoadingProp = false,
    size = "lg",
    hasDescription = false,
    description = null,
    errorMsg = null,
    onChange,
    onFocus,
    onBlur,
    className,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = useId();
    const inputId = `arvo-radio-${uid}`;
    const errorId = `arvo-radio-err-${uid}`;
    const [ownChecked, setOwnChecked] = useControllableState(checkedProp, defaultChecked);
    const group = useContext(RadioGroupContext);
    const resolvedName = name ?? (group == null ? void 0 : group.name) ?? "";
    const resolvedSize = group ? group.size : size;
    const resolvedDisabled = isDisabled || (group ? group.isDisabled : false);
    const resolvedReadonly = isReadOnly || (group ? group.isReadOnly : false);
    const resolvedLoading = isLoading || (group ? group.isLoading : false);
    const resolvedChecked = group ? group.selectedValue === value : ownChecked;
    const registerRadio = group == null ? void 0 : group.registerRadio;
    useEffect(() => {
      if (!registerRadio) return;
      return registerRadio(value, resolvedDisabled);
    }, [registerRadio, value, resolvedDisabled]);
    const isInRovingGroup = group !== null;
    const isTabbable = isInRovingGroup ? group.tabbableValue === value : true;
    const resolvedTabIndex = resolvedReadonly || !isTabbable ? -1 : 0;
    const classes = [
      "arvo-radio",
      `arvo-radio--${resolvedSize}`,
      resolvedLoading && "loading",
      resolvedDisabled && "is-disabled",
      resolvedReadonly && "is-readonly",
      isInvalid && "has-error",
      className
    ].filter(Boolean).join(" ");
    function handleChange() {
      if (resolvedDisabled || resolvedLoading || resolvedReadonly) return;
      if (group) {
        group.onChildChange(value);
      } else {
        setOwnChecked(true);
      }
      onChange == null ? void 0 : onChange({ value, name: resolvedName });
    }
    const showDescription = hasDescription && !!description;
    const showTextContainer = !!label || showDescription;
    return /* @__PURE__ */ jsxs("div", { ref, className: classes, "aria-busy": resolvedLoading || void 0, ...rest, children: [
      /* @__PURE__ */ jsxs("label", { className: "arvo-radio__field", htmlFor: inputId, children: [
        /* @__PURE__ */ jsxs("span", { className: "arvo-radio__input-wrapper", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: inputId,
              className: "arvo-radio__input",
              type: "radio",
              name: resolvedName,
              value,
              checked: resolvedChecked,
              disabled: resolvedDisabled,
              readOnly: resolvedReadonly,
              required: isRequired,
              "aria-invalid": isInvalid || void 0,
              "aria-required": isRequired || void 0,
              "aria-describedby": isInvalid && errorMsg ? errorId : void 0,
              tabIndex: resolvedTabIndex,
              onChange: handleChange,
              onFocus,
              onBlur
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "arvo-radio__control", "aria-hidden": "true" })
        ] }),
        showTextContainer && /* @__PURE__ */ jsxs("span", { className: "arvo-radio__text-container", children: [
          label && /* @__PURE__ */ jsx(
            ArvoFormLabelText,
            {
              className: "arvo-radio__text",
              size: resolvedSize,
              isDisabled: resolvedDisabled,
              isInvalid,
              isRequired,
              contextHelp,
              children: label
            }
          ),
          showDescription && /* @__PURE__ */ jsx("span", { className: "arvo-radio__desc", children: description })
        ] })
      ] }),
      isInvalid && errorMsg && /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "negative", id: errorId, message: errorMsg })
    ] });
  }
);
export {
  ArvoRadio as default
};
//# sourceMappingURL=index22.js.map
