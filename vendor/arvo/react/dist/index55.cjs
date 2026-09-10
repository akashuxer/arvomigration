"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const FormLabel = require("./index12.cjs");
const MessageAlert = require("./index13.cjs");
const IconButton = require("./index17.cjs");
const OptionList = require("./index62.cjs");
const useTooltip = require("./index10.cjs");
const useControllableState = require("./index90.cjs");
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) return items.flatMap((g) => g.items);
  return items;
}
function applyFilter(items, query, filterFn) {
  if (!query) return items;
  if (filterFn) {
    if (isGrouped(items)) {
      const result = [];
      for (const group of items) {
        const filtered = group.items.filter((item) => filterFn(item, query));
        if (filtered.length > 0) result.push({ ...group, items: filtered });
      }
      return result;
    }
    return items.filter((item) => filterFn(item, query));
  }
  if (isGrouped(items)) return core.filterGroups(items, { query });
  return core.filterItems(items, { query });
}
const ArvoCombobox = React.forwardRef(
  function ArvoCombobox2({
    items,
    value,
    defaultValue,
    inputValue: inputValueProp,
    placeholder,
    icon,
    prefix,
    prefixTooltip,
    label,
    contextHelp,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    errorMsg,
    errorDisplay = "inline",
    size = "lg",
    surface = "filled",
    isClearable = true,
    isLoading: isLoadingProp = false,
    isReadOnly = false,
    isFullWidth = false,
    width,
    placement = "bottom-start",
    maxHeight,
    hasGroupDividers = true,
    filterFn,
    closeOnSelect = true,
    isOpen: openProp,
    defaultOpen = false,
    onChange,
    onInputChange,
    onOpen,
    onClose,
    onClear,
    onOpenChange,
    optionListProps,
    className
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = React.useId();
    const comboId = `arvo-combobox-${uid.replace(/[:]/g, "")}`;
    const labelId = `${comboId}-lbl`;
    const inputId = `${comboId}-input`;
    const errorId = `${comboId}-err`;
    const rootRef = React.useRef(null);
    const fieldRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const actionsRef = React.useRef(null);
    const errIcoRef = React.useRef(null);
    const prefixRef = React.useRef(null);
    React.useImperativeHandle(ref, () => rootRef.current, []);
    const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
    const showInlineAlert = isInvalid && errorDisplay === "inline";
    const hasPrefix = typeof prefix === "string" && prefix.length > 0;
    useTooltip.useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon && errorMsg ? errorMsg : void 0
    });
    useTooltip.useTooltip({
      triggerRef: prefixRef,
      tooltip: hasPrefix && prefixTooltip ? prefixTooltip : void 0
    });
    const dispatchCombobox = React.useCallback(
      (name, detail, cancelable = true) => {
        var _a;
        const ev = new CustomEvent(name, {
          bubbles: true,
          cancelable,
          detail
        });
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(ev);
        return ev;
      },
      []
    );
    const [isOpen, setOpenInternal] = useControllableState.useControllableState(
      openProp,
      defaultOpen
    );
    const setOpen = React.useCallback(
      (next) => {
        setOpenInternal(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [setOpenInternal, onOpenChange]
    );
    const [currentValue, setValueState] = useControllableState.useControllableState(
      value,
      defaultValue ?? null
    );
    const isValueControlled = value !== void 0;
    const selectedItem = React.useMemo(() => {
      if (currentValue == null) return null;
      return flattenItems(items).find((i) => i.value === currentValue) ?? null;
    }, [currentValue, items]);
    const initialInputText = React.useMemo(() => {
      if (inputValueProp !== void 0) return inputValueProp;
      const initValue = value ?? defaultValue ?? null;
      if (initValue == null) return "";
      const found = flattenItems(items).find((i) => i.value === initValue);
      return (found == null ? void 0 : found.label) ?? "";
    }, []);
    const [currentInputValue, setInputValueState] = useControllableState.useControllableState(
      inputValueProp,
      initialInputText
    );
    const isInputControlled = inputValueProp !== void 0;
    React.useEffect(() => {
      if (isInputControlled || !isValueControlled) return;
      const allFlat = flattenItems(items);
      const found = allFlat.find((i) => i.value === value);
      setInputValueState((found == null ? void 0 : found.label) ?? "");
    }, [value, items, isValueControlled, isInputControlled, setInputValueState]);
    const requestOpen = React.useCallback(() => {
      if (isOpen || isDisabled || isLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const ev = dispatchCombobox("combobox:open", void 0, true);
      if (ev.defaultPrevented) return;
      setOpen(true);
    }, [
      isOpen,
      isDisabled,
      isLoading,
      isReadOnly,
      onOpen,
      setOpen,
      dispatchCombobox
    ]);
    const requestClose = React.useCallback(() => {
      if (!isOpen) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const ev = dispatchCombobox("combobox:close", void 0, true);
      if (ev.defaultPrevented) return;
      setOpen(false);
    }, [isOpen, onClose, setOpen, dispatchCombobox]);
    const filteredItems = React.useMemo(() => {
      if (selectedItem != null && selectedItem.label === currentInputValue) {
        return items;
      }
      return applyFilter(items, currentInputValue, filterFn);
    }, [items, currentInputValue, filterFn, selectedItem]);
    const handleOptionChange = React.useCallback(
      (nextValue, item) => {
        const allFlat = flattenItems(items);
        const index = allFlat.findIndex((i) => i.id === item.id);
        if (!isValueControlled) setValueState(nextValue);
        if (!isInputControlled) setInputValueState(item.label);
        const result = onChange == null ? void 0 : onChange(item, index);
        dispatchCombobox("combobox:change", { item, index }, true);
        if (result !== false && closeOnSelect) requestClose();
      },
      [
        items,
        isValueControlled,
        isInputControlled,
        setValueState,
        setInputValueState,
        onChange,
        dispatchCombobox,
        closeOnSelect,
        requestClose
      ]
    );
    const handleListOpenChange = React.useCallback(
      (next) => {
        if (next) return;
        if (!isOpen) return;
        setOpen(false);
      },
      [isOpen, setOpen]
    );
    const handleInputChange = React.useCallback(
      (e) => {
        if (isDisabled || isLoading || isReadOnly) return;
        const text = e.target.value;
        if (!isInputControlled) setInputValueState(text);
        onInputChange == null ? void 0 : onInputChange(text);
        if (currentValue != null && !isValueControlled) {
          const matches = (selectedItem == null ? void 0 : selectedItem.label) === text;
          if (!matches) setValueState(null);
        }
        dispatchCombobox("combobox:input", { value: text }, false);
        if (text.length > 0 && !isOpen) requestOpen();
      },
      [
        isDisabled,
        isLoading,
        isReadOnly,
        isInputControlled,
        setInputValueState,
        onInputChange,
        currentValue,
        isValueControlled,
        selectedItem,
        setValueState,
        dispatchCombobox,
        isOpen,
        requestOpen
      ]
    );
    const handleInputKeyDown = React.useCallback(
      (e) => {
        if (isDisabled || isLoading || isReadOnly) return;
        if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          requestOpen();
          return;
        }
        if (e.key === "Escape" && !isOpen) {
          if (currentInputValue.length === 0 && currentValue == null) return;
          e.preventDefault();
          if (!isInputControlled) setInputValueState("");
          if (!isValueControlled) setValueState(null);
        }
      },
      [
        isDisabled,
        isLoading,
        isReadOnly,
        isOpen,
        requestOpen,
        currentInputValue,
        currentValue,
        isInputControlled,
        setInputValueState,
        isValueControlled,
        setValueState
      ]
    );
    const handleClear = React.useCallback(
      (e) => {
        var _a;
        e.stopPropagation();
        if (isDisabled || isLoading || isReadOnly) return;
        const previousValue = currentValue;
        if (!isValueControlled) setValueState(null);
        if (!isInputControlled) setInputValueState("");
        onClear == null ? void 0 : onClear({ previousValue });
        dispatchCombobox("combobox:clear", { previousValue }, false);
        (_a = inputRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
      },
      [
        isDisabled,
        isLoading,
        isReadOnly,
        currentValue,
        isValueControlled,
        setValueState,
        isInputControlled,
        setInputValueState,
        onClear,
        dispatchCombobox
      ]
    );
    const handleChevronClick = React.useCallback(
      (e) => {
        e.stopPropagation();
        if (isDisabled || isLoading || isReadOnly) return;
        if (isOpen) requestClose();
        else {
          requestOpen();
          requestAnimationFrame(() => {
            var _a;
            (_a = inputRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
          });
        }
      },
      [isDisabled, isLoading, isReadOnly, isOpen, requestOpen, requestClose]
    );
    const handleFieldMouseDown = React.useCallback(
      (e) => {
        if (isDisabled || isLoading || isReadOnly) return;
        const target = e.target;
        if (!target) return;
        if (target === inputRef.current) return;
        if (target.tagName === "INPUT") return;
        e.preventDefault();
      },
      [isDisabled, isLoading, isReadOnly]
    );
    const updatePadding = React.useCallback(() => {
      if (!actionsRef.current || !fieldRef.current) return;
      const w = actionsRef.current.offsetWidth;
      const pad = w > 0 ? w + 4 : 0;
      fieldRef.current.style.setProperty("--arvo-combobox-pad-r", `${pad}px`);
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
    const hasValue = currentValue != null || currentInputValue.length > 0;
    const classes = [
      "arvo-combobox",
      `arvo-combobox--${size}`,
      `arvo-combobox--surface-${surface}`,
      isFullWidth && "arvo-combobox--full-width",
      isClearable && "arvo-combobox--clearable",
      hasPrefix && "arvo-combobox--has-prefix",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      isOpen && "open",
      hasValue && "has-value",
      className
    ].filter(Boolean).join(" ");
    const rootStyle = (() => {
      const effectiveWidth = isFullWidth ? "100%" : width;
      if (!effectiveWidth) return void 0;
      return { "--arvo-form-input-width": effectiveWidth };
    })();
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: rootRef, className: classes, style: rootStyle, children: [
      label && /* @__PURE__ */ jsxRuntime.jsx(
        FormLabel.FormLabel,
        {
          htmlFor: inputId,
          id: labelId,
          isRequired,
          isDisabled,
          isInvalid,
          contextHelp,
          className: "arvo-combobox__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: fieldRef,
          className: "arvo-combobox__field",
          onMouseDown: handleFieldMouseDown,
          children: [
            icon && /* @__PURE__ */ jsxRuntime.jsx(
              "i",
              {
                className: `arvo-combobox__ico o9con o9con-${icon}`,
                "aria-hidden": "true",
                onMouseDown: () => {
                  var _a;
                  (_a = inputRef.current) == null ? void 0 : _a.focus();
                }
              }
            ),
            hasPrefix && /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                ref: prefixRef,
                className: "arvo-combobox__prefix",
                "aria-hidden": "true",
                onMouseDown: () => {
                  var _a;
                  (_a = inputRef.current) == null ? void 0 : _a.focus();
                },
                children: prefix
              }
            ),
            hasPrefix && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-combobox__prefix-sep", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                ref: inputRef,
                id: inputId,
                type: "text",
                className: "arvo-combobox__input",
                role: "combobox",
                value: currentInputValue,
                placeholder,
                disabled: isDisabled,
                readOnly: isReadOnly,
                autoComplete: "off",
                "aria-autocomplete": "list",
                "aria-required": isRequired || void 0,
                "aria-invalid": isInvalid || void 0,
                "aria-busy": isLoading || void 0,
                "aria-labelledby": label ? labelId : void 0,
                "aria-label": label ? void 0 : placeholder ?? "Combobox",
                "aria-describedby": showInlineAlert && errorMsg ? errorId : void 0,
                onChange: handleInputChange,
                onKeyDown: handleInputKeyDown
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: actionsRef, className: "arvo-combobox__actions", children: [
              isClearable && /* @__PURE__ */ jsxRuntime.jsx(
                IconButton.ArvoIconButton,
                {
                  size: "xs",
                  variant: "tertiary",
                  icon: "close",
                  tooltip: "Clear",
                  tabIndex: -1,
                  isDisabled,
                  onClick: handleClear,
                  className: "arvo-combobox__clear"
                }
              ),
              isClearable && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-combobox__sep", "aria-hidden": "true" }),
              showTooltipIcon && /* @__PURE__ */ jsxRuntime.jsx(
                MessageAlert.ArvoMessageAlert,
                {
                  ref: errIcoRef,
                  type: "negative",
                  isInline: true,
                  message: errorMsg,
                  className: "arvo-combobox__err-ico"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "angle-down",
                tooltip: "Toggle menu",
                tabIndex: -1,
                isDisabled,
                onClick: handleChevronClick,
                className: "arvo-combobox__chevron"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-combobox__border" })
          ]
        }
      ),
      showInlineAlert && errorMsg && /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "negative", id: errorId, message: errorMsg }),
      /* @__PURE__ */ jsxRuntime.jsx(
        OptionList.ArvoOptionList,
        {
          ...optionListProps,
          triggerRef: fieldRef,
          triggerAriaRef: inputRef,
          activeDescendantRef: inputRef,
          items: filteredItems,
          value: currentValue,
          isOpen,
          placement,
          maxHeight,
          hasGroupDividers,
          isDisabled,
          ariaLabel: label,
          closeOnSelect: false,
          onChange: handleOptionChange,
          onOpenChange: handleListOpenChange
        }
      )
    ] });
  }
);
exports.ArvoCombobox = ArvoCombobox;
exports.default = ArvoCombobox;
//# sourceMappingURL=index55.cjs.map
