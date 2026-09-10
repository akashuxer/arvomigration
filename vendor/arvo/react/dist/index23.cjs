"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const CheckboxGroup = require("./index24.cjs");
const useControllableState = require("./index90.cjs");
const FormLabel = require("./index12.cjs");
const MessageAlert = require("./index13.cjs");
const ArvoCheckbox = React.forwardRef(
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
    const uid = React.useId();
    const inputId = `arvo-cb-${uid}`;
    const errorId = `arvo-cb-err-${uid}`;
    const inputRef = React.useRef(null);
    const [isChecked, setChecked] = useControllableState.useControllableState(checkedProp, defaultChecked);
    const isLoading = isLoadingProp === true;
    const group = React.useContext(CheckboxGroup.CheckboxGroupContext);
    const resolvedSize = group ? group.size : size;
    const resolvedDisabled = isDisabled || (group ? group.isDisabled : false);
    const resolvedReadonly = isReadOnly || (group ? group.isReadOnly : false);
    const resolvedLoading = isLoading || (group ? group.isLoading : false);
    const resolvedName = name ?? (group == null ? void 0 : group.name);
    React.useEffect(() => {
      if (!group || value === "on") return;
      group.registerCheckbox(value, isChecked);
      return () => {
        group.unregisterCheckbox(value);
      };
    }, [value, group == null ? void 0 : group.registerCheckbox, group == null ? void 0 : group.unregisterCheckbox]);
    React.useEffect(() => {
      if (!group || value === "on") return;
      group.registerCheckbox(value, isChecked);
    }, [isChecked]);
    React.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: classes,
        "aria-busy": resolvedLoading || void 0,
        "data-excluded": isExcluded || void 0,
        "data-indeterminate": isIndeterminate || void 0,
        ...rest,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "arvo-cb__field", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-cb__input-wrapper", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
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
              /* @__PURE__ */ jsxRuntime.jsx(
                "svg",
                {
                  className: "arvo-cb__icon arvo-cb__icon--check",
                  viewBox: "0 0 16 16",
                  "aria-hidden": "true",
                  focusable: "false",
                  children: /* @__PURE__ */ jsxRuntime.jsx(
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
              /* @__PURE__ */ jsxRuntime.jsx(
                "svg",
                {
                  className: "arvo-cb__icon arvo-cb__icon--dash",
                  viewBox: "0 0 16 16",
                  "aria-hidden": "true",
                  focusable: "false",
                  children: /* @__PURE__ */ jsxRuntime.jsx(
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
            showTextContainer && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-cb__text-container", children: [
              label && /* @__PURE__ */ jsxRuntime.jsx(
                FormLabel.ArvoFormLabelText,
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
              showDescription && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-cb__desc", children: description })
            ] })
          ] }),
          showAlert && /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "negative", id: errorId, message: errorMessage })
        ]
      }
    );
  }
);
exports.default = ArvoCheckbox;
//# sourceMappingURL=index23.cjs.map
