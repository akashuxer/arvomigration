import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useId, useRef, useState, useCallback } from "react";
import ArvoCheckbox from "./index23.js";
import { ArvoFormLabelText } from "./index12.js";
import { ArvoMessageAlert } from "./index13.js";
const CheckboxGroupContext = createContext(null);
const ArvoCheckboxGroup = forwardRef(
  function ArvoCheckboxGroup2({
    label = null,
    contextHelp,
    hasSelectAll = false,
    orientation = "vertical",
    labelPosition = "top",
    size = "lg",
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isInvalid = false,
    errorMsg = null,
    isLoading: isLoadingProp = false,
    name,
    onChange,
    className,
    children,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = useId();
    const labelId = `arvo-cb-grp-lbl-${uid}`;
    const errorId = `arvo-cb-grp-err-${uid}`;
    const childStateRef = useRef(/* @__PURE__ */ new Map());
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectAllIndeterminate, setSelectAllIndeterminate] = useState(false);
    const recomputeSelectAll = useCallback(() => {
      const states = Array.from(childStateRef.current.values());
      if (states.length === 0) {
        setSelectAllChecked(false);
        setSelectAllIndeterminate(false);
        return;
      }
      const checkedCount = states.filter(Boolean).length;
      setSelectAllChecked(checkedCount === states.length);
      setSelectAllIndeterminate(checkedCount > 0 && checkedCount < states.length);
    }, []);
    const registerCheckbox = useCallback(
      (value, isChecked) => {
        childStateRef.current.set(value, isChecked);
        recomputeSelectAll();
      },
      [recomputeSelectAll]
    );
    const unregisterCheckbox = useCallback(
      (value) => {
        childStateRef.current.delete(value);
        recomputeSelectAll();
      },
      [recomputeSelectAll]
    );
    const fireOnChange = useCallback(() => {
      if (!onChange) return;
      const entries = Array.from(childStateRef.current.entries());
      const values = entries.filter(([, isChecked]) => isChecked).map(([v]) => v);
      const allChecked = entries.length > 0 && entries.every(([, isChecked]) => isChecked);
      onChange({ values, allChecked });
    }, [onChange]);
    const onChildChange = useCallback(
      (value, isChecked) => {
        childStateRef.current.set(value, isChecked);
        recomputeSelectAll();
        fireOnChange();
      },
      [recomputeSelectAll, fireOnChange]
    );
    function handleSelectAllChange({ isChecked }) {
      childStateRef.current.forEach((_, key) => {
        childStateRef.current.set(key, isChecked);
      });
      recomputeSelectAll();
      if (onChange) {
        const entries = Array.from(childStateRef.current.entries());
        const values = entries.filter(([, c]) => c).map(([v]) => v);
        onChange({ values, allChecked: isChecked });
      }
    }
    const contextValue = {
      size,
      isDisabled,
      isReadOnly,
      isLoading,
      name,
      registerCheckbox,
      unregisterCheckbox,
      onChildChange
    };
    const showAlert = isInvalid && !!errorMsg;
    const classes = [
      "arvo-cb-grp",
      `arvo-cb-grp--${size}`,
      orientation === "horizontal" && "arvo-cb-grp--horizontal",
      labelPosition === "start" && "arvo-cb-grp--label-start",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsx(CheckboxGroupContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: classes,
        role: "group",
        "aria-labelledby": label ? labelId : void 0,
        "aria-required": isRequired || void 0,
        "aria-invalid": isInvalid || void 0,
        "aria-describedby": showAlert ? errorId : void 0,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: [
          label && /* @__PURE__ */ jsx(
            ArvoFormLabelText,
            {
              id: labelId,
              className: "arvo-cb-grp__lbl",
              size,
              isRequired,
              isDisabled,
              isInvalid,
              contextHelp,
              children: label
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "arvo-cb-grp__bdy", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "arvo-cb-grp__items",
                "data-arvo-loading": isLoading ? "true" : void 0,
                children: [
                  hasSelectAll && /* @__PURE__ */ jsx(
                    ArvoCheckbox,
                    {
                      label: "Select All",
                      isChecked: selectAllChecked,
                      isIndeterminate: selectAllIndeterminate,
                      size,
                      isDisabled,
                      isReadOnly,
                      isLoading,
                      onChange: handleSelectAllChange
                    }
                  ),
                  children
                ]
              }
            ),
            showAlert && /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "negative", id: errorId, message: errorMsg })
          ] })
        ]
      }
    ) });
  }
);
export {
  CheckboxGroupContext,
  ArvoCheckboxGroup as default
};
//# sourceMappingURL=index24.js.map
