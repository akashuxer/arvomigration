import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useContext, useEffect } from "react";
import { CheckboxGroupContext } from "./index24.js";
import { useControllableState } from "./index90.js";
import { ArvoFormLabelText } from "./index12.js";
import { ArvoMessageAlert } from "./index13.js";
const ArvoCheckbox = forwardRef(
  function ArvoCheckbox2({
    label = null,
    contextHelp,
    isChecked: checkedProp,
    defaultChecked = false,
    isIndeterminate = false,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isInvalid = false,
    isExcluded = false,
    size = "lg",
    value = "on",
    name,
    hasDescription = false,
    description = null,
    errorMsg = null,
    errorDisplay = "inline",
    isLoading: isLoadingProp = false,
    onChange,
    onFocus,
    onBlur,
    className,
    ...rest
  }, ref) {
    const uid = useId();
    const inputId = `arvo-cb-${uid}`;
    const errorId = `arvo-cb-err-${uid}`;
    const inputRef = useRef(null);
    const [isChecked, setChecked] = useControllableState(checkedProp, defaultChecked);
    const isLoading = isLoadingProp === true;
    const group = useContext(CheckboxGroupContext);
    const resolvedSize = group ? group.size : size;
    const resolvedDisabled = isDisabled || (group ? group.isDisabled : false);
    const resolvedReadonly = isReadOnly || (group ? group.isReadOnly : false);
    const resolvedLoading = isLoading || (group ? group.isLoading : false);
    const resolvedName = name ?? (group == null ? void 0 : group.name);
    useEffect(() => {
      if (!group || value === "on") return;
      group.registerCheckbox(value, isChecked);
      return () => {
        group.unregisterCheckbox(value);
      };
    }, [value, group == null ? void 0 : group.registerCheckbox, group == null ? void 0 : group.unregisterCheckbox]);
    useEffect(() => {
      if (!group || value === "on") return;
      group.registerCheckbox(value, isChecked);
    }, [isChecked]);
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = isIndeterminate;
        if (isIndeterminate) {
          inputRef.current.setAttribute("data-indeterminate", "true");
        } else {
          inputRef.current.removeAttribute("data-indeterminate");
        }
      }
    }, [isIndeterminate]);
    const classes = [
      "arvo-cb",
      `arvo-cb--${resolvedSize}`,
      resolvedLoading && "loading",
      resolvedDisabled && "is-disabled",
      resolvedReadonly && "is-readonly",
      isInvalid && "has-error",
      className
    ].filter(Boolean).join(" ");
    function handleChange() {
      if (resolvedDisabled || resolvedLoading || resolvedReadonly) return;
      const nextChecked = isIndeterminate ? true : !isChecked;
      setChecked(nextChecked);
      onChange == null ? void 0 : onChange({ isChecked: nextChecked, value });
      group == null ? void 0 : group.onChildChange(value, nextChecked);
    }
    const showAlert = isInvalid && errorDisplay === "inline";
    const errorMessage = errorMsg || "Error";
    const showDescription = hasDescription && !!description;
    const showTextContainer = !!label || showDescription;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: classes,
        "aria-busy": resolvedLoading || void 0,
        "data-excluded": isExcluded || void 0,
        "data-indeterminate": isIndeterminate || void 0,
        ...rest,
        children: [
          /* @__PURE__ */ jsxs("label", { className: "arvo-cb__field", children: [
            /* @__PURE__ */ jsxs("span", { className: "arvo-cb__input-wrapper", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  id: inputId,
                  className: "arvo-cb__input",
                  type: "checkbox",
                  name: resolvedName,
                  value,
                  checked: isChecked,
                  disabled: resolvedDisabled,
                  required: isRequired,
                  "aria-invalid": isInvalid || void 0,
                  "aria-required": isRequired || void 0,
                  "aria-describedby": showAlert ? errorId : void 0,
                  onChange: handleChange,
                  onFocus,
                  onBlur
                }
              ),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "arvo-cb__icon arvo-cb__icon--check",
                  viewBox: "0 0 16 16",
                  "aria-hidden": "true",
                  focusable: "false",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M3.5 8.5L6.5 11.5L12.5 4.5",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "arvo-cb__icon arvo-cb__icon--dash",
                  viewBox: "0 0 16 16",
                  "aria-hidden": "true",
                  focusable: "false",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M4 8H12",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round"
                    }
                  )
                }
              )
            ] }),
            showTextContainer && /* @__PURE__ */ jsxs("span", { className: "arvo-cb__text-container", children: [
              label && /* @__PURE__ */ jsx(
                ArvoFormLabelText,
                {
                  className: "arvo-cb__lbl",
                  size: resolvedSize,
                  isDisabled: resolvedDisabled,
                  isInvalid,
                  isRequired,
                  contextHelp,
                  children: label
                }
              ),
              showDescription && /* @__PURE__ */ jsx("span", { className: "arvo-cb__desc", children: description })
            ] })
          ] }),
          showAlert && /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "negative", id: errorId, message: errorMessage })
        ]
      }
    );
  }
);
export {
  ArvoCheckbox as default
};
//# sourceMappingURL=index23.js.map
