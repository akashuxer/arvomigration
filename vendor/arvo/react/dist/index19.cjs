"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const utils = require("@arvo/utils");
const useTooltip = require("./index10.cjs");
const useControllableState = require("./index90.cjs");
const FormLabel = require("./index12.cjs");
const IconButton = require("./index17.cjs");
const MessageAlert = require("./index13.cjs");
function resolveLeadingIcon(type, userIcon) {
  if (type === "password") return void 0;
  if (type === "email") return "envelope-o";
  if (type === "url") return "desktop";
  return userIcon;
}
const ArvoTextbox = React.forwardRef(
  function ArvoTextbox2({
    value,
    placeholder,
    isDisabled = false,
    isReadOnly = false,
    label,
    contextHelp,
    isRequired = false,
    isInvalid = false,
    size = "lg",
    surface = "filled",
    type = "text",
    maxLength,
    hasCounter = false,
    errorMsg,
    errorDisplay = "inline",
    isClearable = false,
    isLoading: isLoadingProp = false,
    isFullWidth = false,
    width,
    icon,
    prefix,
    prefixTooltip,
    suffix,
    suffixTooltip,
    isPasswordVisible: isPasswordVisibleProp,
    defaultPasswordVisible = false,
    onPasswordVisibilityChange,
    onInput,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    className,
    ...rest
  }, ref) {
    const uid = React.useId();
    const inputId = `arvo-textbox-${uid}`;
    const errorId = `arvo-textbox-err-${uid}`;
    const inputRef = React.useRef(null);
    const rootRef = React.useRef(null);
    const fieldRef = React.useRef(null);
    const actionsRef = React.useRef(null);
    const errIcoRef = React.useRef(null);
    const prefixRef = React.useRef(null);
    const suffixRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const isPassword = type === "password";
    const isControlled = value !== void 0;
    const [internalValue, setInternalValue] = React.useState("");
    const currentValue = isControlled ? value : internalValue;
    const previousValueRef = React.useRef(currentValue ?? "");
    const errorMessage = errorMsg ?? MessageAlert.ARVO_MSG_ALERT_DEFAULT_ERROR;
    const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
    const showInlineAlert = isInvalid && errorDisplay === "inline";
    const [isPasswordVisible, setPasswordVisible] = useControllableState.useControllableState(
      isPasswordVisibleProp,
      defaultPasswordVisible
    );
    const effectiveIcon = resolveLeadingIcon(type, icon);
    const effectivePrefix = isPassword ? void 0 : prefix;
    const effectivePrefixTooltip = isPassword ? void 0 : prefixTooltip;
    const effectiveSuffix = isPassword ? void 0 : suffix;
    const effectiveSuffixTooltip = isPassword ? void 0 : suffixTooltip;
    const effectiveIsClearable = isPassword ? false : isClearable;
    const hasPrefix = typeof effectivePrefix === "string" && effectivePrefix.length > 0;
    const hasSuffix = typeof effectiveSuffix === "string" && effectiveSuffix.length > 0;
    const inputElementType = isPassword && isPasswordVisible ? "text" : type;
    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if ((type === "email" || type === "url" || type === "password") && icon) {
        console.warn(
          `[ArvoTextbox] The "icon" prop is ignored when type="${type}". ${type === "password" ? "Password inputs render no leading icon." : `The leading icon is locked to "${type === "email" ? "envelope-o" : "desktop"}".`}`
        );
      }
      if (isPassword) {
        const ignored = [];
        if (prefix) ignored.push("prefix");
        if (prefixTooltip) ignored.push("prefixTooltip");
        if (suffix) ignored.push("suffix");
        if (suffixTooltip) ignored.push("suffixTooltip");
        if (isClearable) ignored.push("isClearable");
        if (ignored.length > 0) {
          console.warn(
            `[ArvoTextbox] The following props are ignored when type="password": ${ignored.join(", ")}.`
          );
        }
      }
    }, [type, icon, prefix, prefixTooltip, suffix, suffixTooltip, isClearable, isPassword]);
    useTooltip.useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon ? errorMessage : void 0
    });
    useTooltip.useTooltip({
      triggerRef: prefixRef,
      tooltip: hasPrefix && effectivePrefixTooltip ? effectivePrefixTooltip : void 0
    });
    useTooltip.useTooltip({
      triggerRef: suffixRef,
      tooltip: hasSuffix && effectiveSuffixTooltip ? effectiveSuffixTooltip : void 0
    });
    const updatePadding = React.useCallback(() => {
      if (!actionsRef.current || !fieldRef.current) return;
      const w = actionsRef.current.offsetWidth;
      const pad = w > 0 ? w + 4 : 0;
      fieldRef.current.style.setProperty("--arvo-form-input-pad-r", `${pad}px`);
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
    const classes = [
      "arvo-textbox",
      `arvo-textbox--${size}`,
      `arvo-textbox--surface-${surface}`,
      isFullWidth && "arvo-textbox--full-width",
      hasPrefix && "arvo-textbox--has-prefix",
      hasSuffix && "arvo-textbox--has-suffix",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      currentValue.length > 0 && "has-value",
      className
    ].filter(Boolean).join(" ");
    function handleInput(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
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
      onChange == null ? void 0 : onChange(e);
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("textbox:change", {
          bubbles: true,
          cancelable: true,
          detail: { value: newValue, previousValue: prev }
        })
      );
    }
    function setRefs(node) {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
    function handleFocus(e) {
      onFocus == null ? void 0 : onFocus(e);
    }
    function handleBlur(e) {
      onBlur == null ? void 0 : onBlur(e);
    }
    function handleKeyDown(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === "Escape" && effectiveIsClearable && currentValue.length > 0) {
        clearValue();
        return;
      }
      onKeyDown == null ? void 0 : onKeyDown(e);
    }
    function clearValue() {
      var _a, _b, _c;
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("textbox:clear", {
          bubbles: true,
          cancelable: true,
          detail: {}
        })
      );
      if (!isControlled) {
        setInternalValue("");
      }
      (_b = inputRef.current) == null ? void 0 : _b.focus();
      if (onChange) {
        const nativeInput = inputRef.current;
        if (nativeInput) {
          const nativeInputValueSetter = (_c = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )) == null ? void 0 : _c.set;
          nativeInputValueSetter == null ? void 0 : nativeInputValueSetter.call(nativeInput, "");
          nativeInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }
    function handleClear() {
      clearValue();
    }
    function handlePasswordVisibilityToggle() {
      var _a;
      if (isDisabled || isLoading) return;
      const next = !isPasswordVisible;
      setPasswordVisible(next);
      onPasswordVisibilityChange == null ? void 0 : onPasswordVisibilityChange(next);
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("textbox:password-visibility", {
          bubbles: true,
          cancelable: true,
          detail: { visible: next }
        })
      );
    }
    const rootStyle = (() => {
      const effectiveWidth = isFullWidth ? "100%" : width;
      if (!effectiveWidth) return void 0;
      return { "--arvo-form-input-width": effectiveWidth };
    })();
    const passwordToggleLabel = isPasswordVisible ? "Hide password" : "Show password";
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: setRefs, className: classes, style: rootStyle, role: "group", "aria-busy": isLoading || void 0, children: [
      label && /* @__PURE__ */ jsxRuntime.jsx(
        FormLabel.FormLabel,
        {
          htmlFor: inputId,
          size: "sm",
          isRequired,
          isDisabled,
          isInvalid,
          contextHelp,
          className: "arvo-textbox__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: fieldRef, className: "arvo-textbox__field", children: [
        effectiveIcon && /* @__PURE__ */ jsxRuntime.jsx(
          "i",
          {
            className: `arvo-textbox__ico o9con o9con-${effectiveIcon}`,
            "aria-hidden": "true",
            onMouseDown: (e) => {
              var _a;
              e.preventDefault();
              (_a = inputRef.current) == null ? void 0 : _a.focus();
            }
          }
        ),
        hasPrefix && /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            ref: prefixRef,
            className: "arvo-textbox__prefix",
            "aria-hidden": "true",
            onMouseDown: (e) => {
              var _a;
              e.preventDefault();
              (_a = inputRef.current) == null ? void 0 : _a.focus();
            },
            children: effectivePrefix
          }
        ),
        hasPrefix && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-textbox__prefix-sep", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref: inputRef,
            id: inputId,
            type: inputElementType,
            className: "arvo-textbox__input",
            value: currentValue,
            placeholder,
            disabled: isDisabled,
            readOnly: isReadOnly,
            required: isRequired,
            maxLength,
            "aria-invalid": isInvalid || void 0,
            "aria-required": isRequired || void 0,
            "aria-describedby": showInlineAlert ? errorId : void 0,
            onInput: handleInput,
            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            ...rest
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: actionsRef, className: "arvo-textbox__actions", children: [
          effectiveIsClearable && currentValue.length > 0 && !isDisabled && !isReadOnly && !isLoading && /* @__PURE__ */ jsxRuntime.jsx(
            IconButton.ArvoIconButton,
            {
              size: "xs",
              tooltip: "Clear",
              variant: "tertiary",
              icon: "close",
              "aria-label": "Clear",
              onClick: handleClear,
              className: "arvo-textbox__clear"
            }
          ),
          isPassword && /* @__PURE__ */ jsxRuntime.jsx(
            IconButton.ArvoIconButton,
            {
              size: "sm",
              tooltip: passwordToggleLabel,
              variant: "tertiary",
              icon: isPasswordVisible ? "eye-slash" : "eye",
              "aria-label": passwordToggleLabel,
              "aria-pressed": isPasswordVisible,
              isDisabled: isDisabled || isLoading,
              onClick: handlePasswordVisibilityToggle,
              className: "arvo-textbox__pw-toggle"
            }
          ),
          showTooltipIcon && /* @__PURE__ */ jsxRuntime.jsx(
            MessageAlert.ArvoMessageAlert,
            {
              ref: errIcoRef,
              type: "negative",
              isInline: true,
              message: errorMessage,
              className: "arvo-textbox__err-ico"
            }
          )
        ] }),
        hasSuffix && /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            ref: suffixRef,
            className: "arvo-textbox__suffix",
            "aria-hidden": "true",
            onMouseDown: (e) => {
              var _a;
              e.preventDefault();
              (_a = inputRef.current) == null ? void 0 : _a.focus();
            },
            children: effectiveSuffix
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-textbox__border" })
      ] }),
      hasCounter && !showInlineAlert && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-textbox__counter", children: utils.formatCharCount(currentValue.length, maxLength ?? null) }),
      showInlineAlert && /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "negative", id: errorId, message: errorMessage })
    ] });
  }
);
exports.default = ArvoTextbox;
//# sourceMappingURL=index19.cjs.map
