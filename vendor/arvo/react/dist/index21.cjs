"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useTooltip = require("./index10.cjs");
const FormLabel = require("./index12.cjs");
const IconButton = require("./index17.cjs");
const MessageAlert = require("./index13.cjs");
function getStepPrecision(step) {
  const str = String(step);
  const dotIndex = str.indexOf(".");
  return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
}
function clampAndRound(val, min, max, step) {
  if (min !== void 0 && val < min) val = min;
  if (max !== void 0 && val > max) val = max;
  const precision = step !== void 0 ? getStepPrecision(step) : 0;
  return precision > 0 ? parseFloat(val.toFixed(precision)) : val;
}
const LONG_PRESS_DELAY = 400;
const LONG_PRESS_INTERVAL = 200;
const LONG_PRESS_FAST_INTERVAL = 50;
const LONG_PRESS_FAST_THRESHOLD = 10;
const ArvoNumberInput = React.forwardRef(
  function ArvoNumberInput2({
    value,
    defaultValue: defaultValueProp,
    min,
    max,
    step = 1,
    placeholder,
    isDisabled = false,
    isReadOnly = false,
    label,
    contextHelp,
    isRequired = false,
    isInvalid = false,
    size = "lg",
    surface = "filled",
    errorMsg,
    errorDisplay = "inline",
    isLoading: isLoadingProp = false,
    isFullWidth = false,
    width,
    prefix,
    prefixTooltip,
    suffix,
    suffixTooltip,
    onInput,
    onChange,
    onFocus,
    onBlur,
    className,
    ...rest
  }, ref) {
    const uid = React.useId();
    const inputId = `arvo-num-${uid}`;
    const errorId = `arvo-num-err-${uid}`;
    const inputRef = React.useRef(null);
    const rootRef = React.useRef(null);
    const fieldRef = React.useRef(null);
    const actionsRef = React.useRef(null);
    const errIcoRef = React.useRef(null);
    const prefixRef = React.useRef(null);
    const suffixRef = React.useRef(null);
    const hasPrefix = typeof prefix === "string" && prefix.length > 0;
    const hasSuffix = typeof suffix === "string" && suffix.length > 0;
    const isLoading = isLoadingProp === true;
    const isControlled = value !== void 0;
    const [internalValue, setInternalValue] = React.useState(defaultValueProp ?? null);
    const currentValue = isControlled ? value : internalValue;
    const errorMessage = errorMsg ?? MessageAlert.ARVO_MSG_ALERT_DEFAULT_ERROR;
    const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
    const showInlineAlert = isInvalid && errorDisplay === "inline";
    useTooltip.useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon ? errorMessage : void 0
    });
    useTooltip.useTooltip({
      triggerRef: prefixRef,
      tooltip: hasPrefix && prefixTooltip ? prefixTooltip : void 0
    });
    useTooltip.useTooltip({
      triggerRef: suffixRef,
      tooltip: hasSuffix && suffixTooltip ? suffixTooltip : void 0
    });
    const updatePadding = React.useCallback(() => {
      if (!actionsRef.current || !fieldRef.current) return;
      const w = actionsRef.current.offsetWidth;
      const pad = w > 0 ? w + 4 : 0;
      fieldRef.current.style.setProperty("--arvo-form-input-pad-r", `${pad}px`);
      const steppers = fieldRef.current.querySelector(".arvo-number-input__steppers");
      const steppersWidth = steppers ? steppers.offsetWidth : 0;
      actionsRef.current.style.setProperty("inset-inline-end", `${steppersWidth}px`);
    }, []);
    React.useEffect(() => {
      updatePadding();
    });
    React.useEffect(() => {
      const el = actionsRef.current;
      if (!el) return;
      const obs = new ResizeObserver(updatePadding);
      obs.observe(el);
      return () => obs.disconnect();
    }, [updatePadding]);
    const atMin = min !== void 0 && currentValue !== null && currentValue !== void 0 && currentValue <= min;
    const atMax = max !== void 0 && currentValue !== null && currentValue !== void 0 && currentValue >= max;
    const classes = [
      "arvo-number-input",
      `arvo-number-input--${size}`,
      `arvo-number-input--surface-${surface}`,
      isFullWidth && "arvo-number-input--full-width",
      hasPrefix && "arvo-number-input--has-prefix",
      hasSuffix && "arvo-number-input--has-suffix",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      atMin && "at-min",
      atMax && "at-max",
      className
    ].filter(Boolean).join(" ");
    const dispatchCustomChange = React.useCallback(
      (newValue, previousValue) => {
        const rootEl = (ref == null ? void 0 : ref.current) ?? rootRef.current;
        if (rootEl) {
          rootEl.dispatchEvent(
            new CustomEvent("number-input:change", {
              bubbles: true,
              detail: { value: newValue, previousValue }
            })
          );
        }
      },
      [ref]
    );
    function applyValue(newValue) {
      var _a;
      const previous = currentValue ?? null;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      dispatchCustomChange(newValue, previous);
      const input = inputRef.current;
      if (input && onChange) {
        const nativeValueSetter = (_a = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )) == null ? void 0 : _a.set;
        const strVal = newValue === null ? "" : String(newValue);
        nativeValueSetter == null ? void 0 : nativeValueSetter.call(input, strVal);
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    function increment(multiplier = 1) {
      const effectiveStep = step * multiplier;
      if (currentValue === null || currentValue === void 0) {
        const startVal = min ?? 0;
        applyValue(clampAndRound(startVal, min, max, step));
      } else {
        applyValue(clampAndRound(currentValue + effectiveStep, min, max, step));
      }
    }
    function decrement(multiplier = 1) {
      const effectiveStep = step * multiplier;
      if (currentValue === null || currentValue === void 0) {
        const startVal = max ?? 0;
        applyValue(clampAndRound(startVal, min, max, step));
      } else {
        applyValue(clampAndRound(currentValue - effectiveStep, min, max, step));
      }
    }
    const longPressRef = React.useRef({ timeout: null, interval: null, repeatCount: 0 });
    function clearLongPress() {
      const lp = longPressRef.current;
      if (lp.timeout) clearTimeout(lp.timeout);
      if (lp.interval) clearInterval(lp.interval);
      lp.timeout = null;
      lp.interval = null;
      lp.repeatCount = 0;
    }
    function startLongPress(action) {
      if (isDisabled || isLoading || isReadOnly) return;
      action();
      const lp = longPressRef.current;
      lp.timeout = setTimeout(() => {
        lp.interval = setInterval(() => {
          lp.repeatCount++;
          action();
          if (lp.repeatCount >= LONG_PRESS_FAST_THRESHOLD && lp.interval) {
            clearInterval(lp.interval);
            lp.interval = setInterval(action, LONG_PRESS_FAST_INTERVAL);
          }
        }, LONG_PRESS_INTERVAL);
      }, LONG_PRESS_DELAY);
    }
    React.useEffect(() => {
      return () => clearLongPress();
    }, []);
    function handleIncrementMouseDown(e) {
      if (e.button !== 0) return;
      startLongPress(() => increment());
    }
    function handleDecrementMouseDown(e) {
      if (e.button !== 0) return;
      startLongPress(() => decrement());
    }
    function handleStepperMouseUp() {
      var _a;
      clearLongPress();
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }
    function handleStepperMouseLeave() {
      clearLongPress();
    }
    function handleIncrementTouchStart(e) {
      e.preventDefault();
      startLongPress(() => increment());
    }
    function handleDecrementTouchStart(e) {
      e.preventDefault();
      startLongPress(() => decrement());
    }
    function handleStepperTouchEnd() {
      var _a;
      clearLongPress();
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }
    function handleInput(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      onInput == null ? void 0 : onInput(e);
    }
    function handleChange(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      const raw = e.target.value;
      const parsed = raw === "" ? null : parseFloat(raw);
      const newValue = parsed === null ? null : isNaN(parsed) ? null : parsed;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      dispatchCustomChange(newValue, currentValue ?? null);
      onChange == null ? void 0 : onChange(e);
    }
    function handleFocus(e) {
      onFocus == null ? void 0 : onFocus(e);
    }
    function handleBlur(e) {
      var _a;
      if (!isDisabled && !isLoading && !isReadOnly) {
        const raw = e.target.value;
        if (raw !== "") {
          const parsed = parseFloat(raw);
          if (!isNaN(parsed)) {
            const clamped = clampAndRound(parsed, min, max, step);
            if (clamped !== parsed || raw !== String(clamped)) {
              e.target.value = String(clamped);
              if (!isControlled) {
                setInternalValue(clamped);
              }
              dispatchCustomChange(clamped, currentValue ?? null);
              if (onChange) {
                const nativeValueSetter = (_a = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  "value"
                )) == null ? void 0 : _a.set;
                nativeValueSetter == null ? void 0 : nativeValueSetter.call(e.target, String(clamped));
                e.target.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }
          }
        }
      }
      onBlur == null ? void 0 : onBlur(e);
    }
    function handlePaste(e) {
      var _a;
      if (isDisabled || isLoading || isReadOnly) return;
      const text = e.clipboardData.getData("text/plain");
      const parsed = parseFloat(text);
      if (isNaN(parsed)) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const clamped = clampAndRound(parsed, min, max, step);
      const input = e.currentTarget;
      input.value = String(clamped);
      if (!isControlled) {
        setInternalValue(clamped);
      }
      dispatchCustomChange(clamped, currentValue ?? null);
      if (onChange) {
        const nativeValueSetter = (_a = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )) == null ? void 0 : _a.set;
        nativeValueSetter == null ? void 0 : nativeValueSetter.call(input, String(clamped));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    function handleKeyDown(e) {
      if (isDisabled || isLoading || isReadOnly) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const isShift = e.shiftKey;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          increment(isShift ? 10 : 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          decrement(isShift ? 10 : 1);
          break;
        case "Home":
          if (min !== void 0) {
            e.preventDefault();
            applyValue(min);
          }
          break;
        case "End":
          if (max !== void 0) {
            e.preventDefault();
            applyValue(max);
          }
          break;
      }
    }
    const inputValueStr = currentValue === null || currentValue === void 0 ? "" : String(currentValue);
    const ariaValueNow = currentValue === null || currentValue === void 0 ? void 0 : currentValue;
    const rootStyle = React.useMemo(() => {
      const effectiveWidth = isFullWidth ? "100%" : width;
      if (!effectiveWidth) return void 0;
      return { "--arvo-form-input-width": effectiveWidth };
    }, [isFullWidth, width]);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: (node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        },
        className: classes,
        style: rootStyle,
        role: "group",
        "aria-busy": isLoading || void 0,
        children: [
          label && /* @__PURE__ */ jsxRuntime.jsx(
            FormLabel.FormLabel,
            {
              htmlFor: inputId,
              size: "sm",
              isRequired,
              isDisabled,
              isInvalid,
              contextHelp,
              className: "arvo-number-input__lbl",
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: fieldRef, className: "arvo-number-input__field", children: [
            hasPrefix && /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                ref: prefixRef,
                className: "arvo-number-input__prefix",
                "aria-hidden": "true",
                onMouseDown: (e) => {
                  var _a;
                  e.preventDefault();
                  (_a = inputRef.current) == null ? void 0 : _a.focus();
                },
                children: prefix
              }
            ),
            hasPrefix && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-number-input__prefix-sep", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                ref: inputRef,
                id: inputId,
                type: "number",
                className: "arvo-number-input__input",
                role: "spinbutton",
                value: inputValueStr,
                placeholder,
                disabled: isDisabled,
                readOnly: isReadOnly,
                required: isRequired,
                min,
                max,
                step,
                "aria-valuenow": ariaValueNow,
                "aria-valuemin": min,
                "aria-valuemax": max,
                "aria-invalid": isInvalid || void 0,
                "aria-required": isRequired || void 0,
                "aria-describedby": showInlineAlert ? errorId : void 0,
                onInput: handleInput,
                onChange: handleChange,
                onFocus: handleFocus,
                onBlur: handleBlur,
                onKeyDown: handleKeyDown,
                onPaste: handlePaste,
                ...rest
              }
            ),
            hasSuffix && /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                ref: suffixRef,
                className: "arvo-number-input__suffix",
                "aria-hidden": "true",
                onMouseDown: (e) => {
                  var _a;
                  e.preventDefault();
                  (_a = inputRef.current) == null ? void 0 : _a.focus();
                },
                children: suffix
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("div", { ref: actionsRef, className: "arvo-number-input__actions", children: showTooltipIcon && /* @__PURE__ */ jsxRuntime.jsx(
              MessageAlert.ArvoMessageAlert,
              {
                ref: errIcoRef,
                type: "negative",
                isInline: true,
                message: errorMessage,
                className: "arvo-number-input__err-ico"
              }
            ) }),
            !isReadOnly && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-number-input__steppers", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                IconButton.ArvoIconButton,
                {
                  size: "sm",
                  variant: "tertiary",
                  icon: "angle-up",
                  "aria-label": "Increment",
                  tooltip: "Increment",
                  tabIndex: -1,
                  "aria-disabled": atMax || void 0,
                  isDisabled: isDisabled || isLoading,
                  onMouseDown: handleIncrementMouseDown,
                  onMouseUp: handleStepperMouseUp,
                  onMouseLeave: handleStepperMouseLeave,
                  onTouchStart: handleIncrementTouchStart,
                  onTouchEnd: handleStepperTouchEnd,
                  className: "arvo-number-input__increment-btn"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                IconButton.ArvoIconButton,
                {
                  size: "sm",
                  variant: "tertiary",
                  icon: "angle-down",
                  "aria-label": "Decrement",
                  tooltip: "Decrement",
                  tabIndex: -1,
                  "aria-disabled": atMin || void 0,
                  isDisabled: isDisabled || isLoading,
                  onMouseDown: handleDecrementMouseDown,
                  onMouseUp: handleStepperMouseUp,
                  onMouseLeave: handleStepperMouseLeave,
                  onTouchStart: handleDecrementTouchStart,
                  onTouchEnd: handleStepperTouchEnd,
                  className: "arvo-number-input__decrement-btn"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-number-input__border" })
          ] }),
          showInlineAlert && /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "negative", id: errorId, message: errorMessage })
        ]
      }
    );
  }
);
exports.default = ArvoNumberInput;
//# sourceMappingURL=index21.cjs.map
