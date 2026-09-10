"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const FormLabel = require("./index12.cjs");
const MessageAlert = require("./index13.cjs");
const OptionList = require("./index62.cjs");
const useTooltip = require("./index10.cjs");
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) return items.flatMap((g) => g.items);
  return items;
}
const ArvoSelect = React.forwardRef(
  function ArvoSelect2({
    items,
    value,
    defaultValue,
    placeholder,
    icon,
    label,
    contextHelp,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    errorMsg,
    errorDisplay = "inline",
    size = "lg",
    surface = "filled",
    search,
    isLoading: isLoadingProp = false,
    isReadOnly = false,
    width,
    isFullWidth = false,
    placement = "bottom-start",
    maxHeight,
    hasGroupDividers = true,
    closeOnSelect = true,
    isOpen: openProp,
    defaultOpen = false,
    onChange,
    onOpen,
    onClose,
    onOpenChange,
    optionListProps,
    className
  }, ref) {
    const isLoading = isLoadingProp === true;
    const isSearchable = !!search;
    const uid = React.useId();
    const selId = `arvo-sel-${uid.replace(/[:]/g, "")}`;
    const fieldId = `${selId}-field`;
    const labelId = `${selId}-lbl`;
    const errorId = `${selId}-err`;
    const rootRef = React.useRef(null);
    const fieldRef = React.useRef(null);
    const errIcoRef = React.useRef(null);
    React.useImperativeHandle(ref, () => rootRef.current, []);
    const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
    const showInlineAlert = isInvalid && errorDisplay === "inline";
    useTooltip.useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon && errorMsg ? errorMsg : void 0
    });
    const dispatchSel = React.useCallback(
      (name, detail) => {
        var _a;
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent(name, { bubbles: true, cancelable: true, detail })
        );
      },
      []
    );
    const isOpenControlled = openProp !== void 0;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = isOpenControlled ? openProp : internalOpen;
    const setOpen = React.useCallback(
      (next) => {
        if (!isOpenControlled) setInternalOpen(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [isOpenControlled, onOpenChange]
    );
    const isValueControlled = value !== void 0;
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? null
    );
    const currentValue = isValueControlled ? value : internalValue;
    const selectedItem = React.useMemo(() => {
      if (currentValue == null) return null;
      return flattenItems(items).find((i) => i.value === currentValue) ?? null;
    }, [currentValue, items]);
    const requestOpen = React.useCallback(() => {
      if (isOpen || isDisabled || isLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      setOpen(true);
      dispatchSel("sel:open");
    }, [isOpen, isDisabled, isLoading, isReadOnly, onOpen, setOpen, dispatchSel]);
    const requestClose = React.useCallback(() => {
      if (!isOpen) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      setOpen(false);
      dispatchSel("sel:close");
    }, [isOpen, onClose, setOpen, dispatchSel]);
    const handleOptionChange = React.useCallback(
      (nextValue, item) => {
        const index = flattenItems(items).findIndex((i) => i.id === item.id);
        if (!isValueControlled) setInternalValue(nextValue);
        const result = onChange == null ? void 0 : onChange(item, index);
        dispatchSel("sel:change", { item, index });
        if (result !== false && closeOnSelect) requestClose();
      },
      [items, isValueControlled, onChange, closeOnSelect, requestClose, dispatchSel]
    );
    const handleListOpenChange = React.useCallback(
      (next) => {
        if (next) return;
        if (!isOpen) return;
        setOpen(false);
      },
      [isOpen, setOpen]
    );
    const handleFieldClick = React.useCallback(() => {
      if (isDisabled || isLoading || isReadOnly) return;
      if (isOpen) requestClose();
      else requestOpen();
    }, [isDisabled, isLoading, isReadOnly, isOpen, requestOpen, requestClose]);
    const handleFieldKeyDown = React.useCallback(
      (e) => {
        if (isDisabled || isLoading) return;
        if (isOpen) return;
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          requestOpen();
          return;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const allFlat = flattenItems(items);
          const char = e.key.toLowerCase();
          const currentIdx = currentValue != null ? allFlat.findIndex((i) => i.value === currentValue) : -1;
          for (let i = 1; i <= allFlat.length; i++) {
            const idx = (currentIdx + i) % allFlat.length;
            const item = allFlat[idx];
            if (item && !item.isDisabled && item.label.toLowerCase().startsWith(char)) {
              if (!isValueControlled) setInternalValue(item.value);
              onChange == null ? void 0 : onChange(item, idx);
              dispatchSel("sel:change", { item, index: idx });
              break;
            }
          }
        }
      },
      [
        isDisabled,
        isLoading,
        isOpen,
        requestOpen,
        items,
        currentValue,
        isValueControlled,
        onChange,
        dispatchSel
      ]
    );
    const classes = [
      "arvo-sel",
      `arvo-sel--${size}`,
      `arvo-sel--surface-${surface}`,
      isFullWidth && "arvo-sel--full-width",
      isSearchable && "arvo-sel--filterable",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      isOpen && "open",
      currentValue != null && "has-value",
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
          htmlFor: fieldId,
          id: labelId,
          isRequired,
          isDisabled,
          isInvalid,
          contextHelp,
          className: "arvo-sel__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: fieldRef,
          id: fieldId,
          className: "arvo-sel__field",
          role: "combobox",
          tabIndex: isDisabled ? -1 : 0,
          "aria-required": isRequired || void 0,
          "aria-invalid": isInvalid || void 0,
          "aria-disabled": isDisabled || void 0,
          "aria-busy": isLoading || void 0,
          "aria-labelledby": label ? labelId : void 0,
          "aria-label": label ? void 0 : placeholder ?? "Select",
          "aria-describedby": showInlineAlert && errorMsg ? errorId : void 0,
          onClick: handleFieldClick,
          onKeyDown: handleFieldKeyDown,
          children: [
            icon && /* @__PURE__ */ jsxRuntime.jsx(
              "i",
              {
                className: `arvo-sel__ico o9con o9con-${icon}`,
                "aria-hidden": "true"
              }
            ),
            selectedItem ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-sel__input", children: selectedItem.label }) : placeholder ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-sel__placeholder", children: placeholder }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-sel__input" }),
            showTooltipIcon && /* @__PURE__ */ jsxRuntime.jsx(
              MessageAlert.ArvoMessageAlert,
              {
                ref: errIcoRef,
                type: "negative",
                isInline: true,
                message: errorMsg,
                className: "arvo-sel__err-ico"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "arvo-sel__chevron o9con o9con-angle-down",
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-sel__border" })
          ]
        }
      ),
      showInlineAlert && errorMsg && /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "negative", id: errorId, message: errorMsg }),
      /* @__PURE__ */ jsxRuntime.jsx(
        OptionList.ArvoOptionList,
        {
          ...optionListProps,
          triggerRef: fieldRef,
          items,
          value: currentValue,
          isOpen,
          search,
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
exports.ArvoSelect = ArvoSelect;
exports.default = ArvoSelect;
//# sourceMappingURL=index53.cjs.map
