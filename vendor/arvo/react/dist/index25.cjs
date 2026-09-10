"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useControllableState = require("./index90.cjs");
const FormLabel = require("./index12.cjs");
const MessageAlert = require("./index13.cjs");
const RadioGroupContext = React.createContext(null);
const ArvoRadioGroup = React.forwardRef(
  function ArvoRadioGroup2({
    name,
    label = null,
    contextHelp,
    orientation = "vertical",
    labelPosition = "top",
    size = "lg",
    isDisabled = false,
    isReadOnly: isReadonly = false,
    isRequired = false,
    isInvalid = false,
    errorMsg = null,
    isLoading: isLoadingProp = false,
    value: valueProp,
    defaultValue = null,
    onChange,
    className,
    children,
    ...rest
  }, ref) {
    const uid = React.useId();
    const labelId = `arvo-rb-grp-lbl-${uid}`;
    const errorId = `arvo-rb-grp-err-${uid}`;
    const [selectedValue, setSelectedValue] = useControllableState.useControllableState(
      valueProp,
      defaultValue
    );
    const isLoading = isLoadingProp === true;
    const onChildChange = React.useCallback(
      (childValue) => {
        if (isDisabled || isReadonly || isLoading) return;
        setSelectedValue(childValue);
        onChange == null ? void 0 : onChange({ value: childValue, previousValue: selectedValue });
      },
      [isDisabled, isReadonly, isLoading, onChange, selectedValue, setSelectedValue]
    );
    const [registered, setRegistered] = React.useState([]);
    const registerRadio = React.useCallback(
      (value, childDisabled) => {
        setRegistered((prev) => {
          const next = prev.filter((r) => r.value !== value);
          next.push({ value, isDisabled: childDisabled });
          return next;
        });
        return () => {
          setRegistered((prev) => prev.filter((r) => r.value !== value));
        };
      },
      []
    );
    const tabbableValue = React.useMemo(() => {
      if (selectedValue !== null && selectedValue !== void 0) {
        return selectedValue;
      }
      const firstEnabled = registered.find((r) => !r.isDisabled);
      return (firstEnabled == null ? void 0 : firstEnabled.value) ?? null;
    }, [selectedValue, registered]);
    const contextValue = React.useMemo(
      () => ({
        name,
        size,
        isDisabled,
        isReadOnly: isReadonly,
        isLoading,
        selectedValue,
        onChildChange,
        tabbableValue,
        registerRadio
      }),
      [
        name,
        size,
        isDisabled,
        isReadonly,
        isLoading,
        selectedValue,
        onChildChange,
        tabbableValue,
        registerRadio
      ]
    );
    const showAlert = isInvalid && !!errorMsg;
    const classes = [
      "arvo-rb-grp",
      `arvo-rb-grp--${size}`,
      orientation === "horizontal" && "arvo-rb-grp--horizontal",
      labelPosition === "start" && "arvo-rb-grp--label-start",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadonly && "is-readonly",
      isInvalid && "has-error",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsxRuntime.jsx(RadioGroupContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref,
        className: classes,
        role: "radiogroup",
        "aria-labelledby": label ? labelId : void 0,
        "aria-required": isRequired || void 0,
        "aria-invalid": isInvalid || void 0,
        "aria-describedby": showAlert ? errorId : void 0,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: [
          label && /* @__PURE__ */ jsxRuntime.jsx(
            FormLabel.ArvoFormLabelText,
            {
              id: labelId,
              className: "arvo-rb-grp__lbl",
              size,
              isRequired,
              isDisabled,
              isInvalid,
              contextHelp,
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-rb-grp__bdy", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: "arvo-rb-grp__items",
                "data-arvo-loading": isLoading ? "true" : void 0,
                children
              }
            ),
            showAlert && /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "negative", id: errorId, message: errorMsg })
          ] })
        ]
      }
    ) });
  }
);
exports.RadioGroupContext = RadioGroupContext;
exports.default = ArvoRadioGroup;
//# sourceMappingURL=index25.cjs.map
