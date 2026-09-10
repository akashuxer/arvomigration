import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useState, useCallback, useEffect } from "react";
import { formatCharCount } from "@arvo/utils";
import { useTooltip } from "./index10.js";
import { FormLabel } from "./index12.js";
import { ArvoIconButton } from "./index17.js";
import { ARVO_MSG_ALERT_DEFAULT_ERROR, ArvoMessageAlert } from "./index13.js";
const ArvoTextarea = forwardRef(
  function ArvoTextarea2({
    value,
    placeholder,
    isDisabled = false,
    isReadOnly = false,
    label,
    contextHelp,
    isRequired = false,
    isInvalid = false,
    size = "sm",
    surface = "filled",
    icon,
    rows = 3,
    maxLength,
    hasCounter = false,
    autoResize = false,
    resizable = "none",
    errorMsg,
    errorDisplay = "inline",
    isClearable = false,
    isLoading: isLoadingProp = false,
    width,
    isFullWidth = false,
    onInput,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    className,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = useId();
    const inputId = `arvo-textarea-${uid}`;
    const errorId = `arvo-textarea-err-${uid}`;
    const counterId = `arvo-textarea-counter-${uid}`;
    const textareaRef = useRef(null);
    const rootRef = useRef(null);
    const fieldRef = useRef(null);
    const actionsRef = useRef(null);
    const errIcoRef = useRef(null);
    const previousValueRef = useRef("");
    const isControlled = value !== void 0;
    const [internalValue, setInternalValue] = useState("");
    const currentValue = isControlled ? value : internalValue;
    const errorMessage = errorMsg ?? ARVO_MSG_ALERT_DEFAULT_ERROR;
    const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
    const showInlineAlert = isInvalid && errorDisplay === "inline";
    const showClearButton = isClearable && currentValue.length > 0 && !isDisabled && !isReadOnly && !isLoading && !showTooltipIcon;
    useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon ? errorMessage : void 0
    });
    const classes = [
      "arvo-textarea",
      `arvo-textarea--${size}`,
      `arvo-textarea--surface-${surface}`,
      isFullWidth && "arvo-textarea--full-width",
      autoResize && "arvo-textarea--auto-resize",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      // `has-value` mirrors the JS twin -- it drives the CSS-side
      // visibility gate for the inner clear button (the SCSS hides
      // `__clear` by default and reveals it only under
      // `.has-value:not(.is-disabled):not(.is-readonly):not(.loading):not(.has-error.error-tooltip)`).
      currentValue.length > 0 && "has-value",
      className
    ].filter(Boolean).join(" ");
    const recalcAutoResizeHeight = useCallback(() => {
      const el = textareaRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
      el.style.overflow = el.scrollHeight > el.clientHeight ? "auto" : "hidden";
    }, [autoResize]);
    useEffect(() => {
      previousValueRef.current = currentValue;
    }, [currentValue]);
    useEffect(() => {
      if (autoResize) {
        recalcAutoResizeHeight();
      }
    }, [currentValue, autoResize, recalcAutoResizeHeight]);
    useEffect(() => {
      if (autoResize || resizable === "none") return;
      const ta = textareaRef.current;
      const root = rootRef.current;
      if (!ta || !root) return;
      const h = ta.offsetHeight;
      if (h <= 0) return;
      root.style.setProperty("--arvo-textarea-min-height", `${h}px`);
      return () => {
        root.style.removeProperty("--arvo-textarea-min-height");
      };
    }, [autoResize, resizable, rows]);
    const updatePadding = useCallback(() => {
      if (!actionsRef.current || !fieldRef.current) return;
      const w = actionsRef.current.offsetWidth;
      const pad = w > 0 ? w + 4 : 0;
      fieldRef.current.style.setProperty("--arvo-form-input-pad-r", `${pad}px`);
    }, []);
    useEffect(() => {
      updatePadding();
    });
    useEffect(() => {
      const el = actionsRef.current;
      if (!el) return;
      const obs = new ResizeObserver(updatePadding);
      obs.observe(el);
      return () => obs.disconnect();
    }, [updatePadding]);
    function handleInput(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      if (!isControlled) {
        setInternalValue(e.currentTarget.value);
      }
      onInput == null ? void 0 : onInput(e);
    }
    function handleChange(e) {
      var _a;
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      const newValue = e.target.value;
      const prev = previousValueRef.current;
      previousValueRef.current = newValue;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("textarea:change", {
          bubbles: true,
          cancelable: true,
          detail: { value: newValue, previousValue: prev }
        })
      );
      onChange == null ? void 0 : onChange(e);
    }
    function handleFocus(e) {
      onFocus == null ? void 0 : onFocus(e);
    }
    function handleBlur(e) {
      onBlur == null ? void 0 : onBlur(e);
    }
    function clearValue() {
      var _a, _b, _c;
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("textarea:clear", {
          bubbles: true,
          cancelable: true,
          detail: {}
        })
      );
      const prev = previousValueRef.current;
      previousValueRef.current = "";
      if (!isControlled) {
        setInternalValue("");
      }
      const nativeInput = textareaRef.current;
      if (nativeInput) {
        const nativeSetter = (_b = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )) == null ? void 0 : _b.set;
        nativeSetter == null ? void 0 : nativeSetter.call(nativeInput, "");
        nativeInput.dispatchEvent(new Event("change", { bubbles: true }));
        nativeInput.focus();
      }
      (_c = rootRef.current) == null ? void 0 : _c.dispatchEvent(
        new CustomEvent("textarea:change", {
          bubbles: true,
          cancelable: true,
          detail: { value: "", previousValue: prev }
        })
      );
      if (autoResize) {
        requestAnimationFrame(() => recalcAutoResizeHeight());
      }
    }
    function handleClear() {
      clearValue();
    }
    function handleKeyDown(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === "Escape" && isClearable && !isReadOnly && currentValue.length > 0) {
        clearValue();
        return;
      }
      onKeyDown == null ? void 0 : onKeyDown(e);
    }
    const resizeStyle = autoResize ? "none" : resizable;
    function setRefs(node) {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
    const describedByParts = [];
    if (showInlineAlert) describedByParts.push(errorId);
    if (hasCounter && !showInlineAlert) describedByParts.push(counterId);
    const describedBy = describedByParts.length > 0 ? describedByParts.join(" ") : void 0;
    const effectiveWidth = isFullWidth ? "100%" : width;
    const styleVars = effectiveWidth ? { "--arvo-form-input-width": effectiveWidth } : void 0;
    return /* @__PURE__ */ jsxs("div", { ref: setRefs, className: classes, role: "group", "aria-busy": isLoading || void 0, style: styleVars, children: [
      label && /* @__PURE__ */ jsx(
        FormLabel,
        {
          htmlFor: inputId,
          size: "sm",
          isRequired,
          isDisabled,
          isInvalid,
          contextHelp,
          className: "arvo-textarea__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxs("div", { ref: fieldRef, className: "arvo-textarea__field", children: [
        icon && /* @__PURE__ */ jsx(
          "span",
          {
            className: `arvo-textarea__ico o9con o9con-${icon}`,
            "aria-hidden": "true",
            onMouseDown: (e) => {
              var _a;
              e.preventDefault();
              (_a = textareaRef.current) == null ? void 0 : _a.focus();
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            ref: textareaRef,
            id: inputId,
            className: "arvo-textarea__input",
            value: currentValue,
            placeholder,
            disabled: isDisabled,
            readOnly: isReadOnly,
            required: isRequired,
            rows,
            maxLength,
            style: { resize: resizeStyle },
            "aria-invalid": isInvalid || void 0,
            "aria-required": isRequired || void 0,
            "aria-describedby": describedBy,
            onInput: handleInput,
            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            ...rest
          }
        ),
        /* @__PURE__ */ jsxs("div", { ref: actionsRef, className: "arvo-textarea__actions", children: [
          showClearButton && /* @__PURE__ */ jsx(
            ArvoIconButton,
            {
              size: "xs",
              tooltip: "Clear",
              variant: "tertiary",
              icon: "close",
              "aria-label": "Clear",
              onClick: handleClear,
              className: "arvo-textarea__clear"
            }
          ),
          showTooltipIcon && /* @__PURE__ */ jsx(
            ArvoMessageAlert,
            {
              ref: errIcoRef,
              type: "negative",
              isInline: true,
              message: errorMessage,
              className: "arvo-textarea__err-ico"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "arvo-textarea__border" })
      ] }),
      hasCounter && !showInlineAlert && /* @__PURE__ */ jsx("span", { id: counterId, className: "arvo-textarea__counter", children: formatCharCount(currentValue.length, maxLength ?? null) }),
      showInlineAlert && /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "negative", id: errorId, message: errorMessage })
    ] });
  }
);
export {
  ArvoTextarea as default
};
//# sourceMappingURL=index20.js.map
