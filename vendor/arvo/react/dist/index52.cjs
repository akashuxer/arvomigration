"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const utils = require("@arvo/utils");
const useControllableState = require("./index90.cjs");
const useTooltip = require("./index10.cjs");
const Badge = require("./index45.cjs");
const Button = require("./index16.cjs");
const IconButton = require("./index17.cjs");
const MessageAlert = require("./index13.cjs");
const OptionList = require("./index62.cjs");
const Popover = require("./index27.cjs");
const HybridPopover = require("./index28.cjs");
const DatePicker = require("./index79.cjs");
const DateRangePicker = require("./index82.cjs");
const TimePicker = require("./index81.cjs");
const DateTimePicker = require("./index80.cjs");
const VARIANT_CLASS = {
  scopedSearch: "arvo-adv-search--scoped-search",
  customFilter: "arvo-adv-search--custom-filter",
  filterBy: "arvo-adv-search--filter-by"
};
const WILDCARD_PREFIX = ":";
function isWildcardQuery(value) {
  return typeof value === "string" && value.startsWith(WILDCARD_PREFIX);
}
function findScopeLabel(options, selected) {
  var _a;
  if (!options || !selected) return null;
  if (Array.isArray(selected)) {
    if (selected.length === 0) return null;
    const first = options.find((o) => o.key === selected[0]);
    if (!first) return null;
    return selected.length === 1 ? first.label : `${first.label} +${selected.length - 1}`;
  }
  return ((_a = options.find((o) => o.key === selected)) == null ? void 0 : _a.label) ?? null;
}
const ArvoAdvanceSearch = React.forwardRef(function ArvoAdvanceSearch2({
  variant = "filterBy",
  size = "md",
  searchMode = "input",
  value: valueProp,
  defaultValue = "",
  placeholder = "Search",
  minChars = 1,
  debounceMs = 200,
  hasWildcardSupport: _hasWildcardSupport = true,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isLoading: isLoadingProp = false,
  isClearable = true,
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = null,
  counter = null,
  errorDisplay = "inline",
  errorMessage,
  triggerLabel,
  triggerProps,
  selectionMode = "single",
  scopeOptions,
  selectedScope: selectedScopeProp,
  defaultSelectedScope,
  onScopeChange,
  hasPopoverHeader = false,
  popoverTitle,
  popoverFooter,
  customFilterContent,
  popoverProps,
  filterContentType = "hybridPopover",
  filterSelectionMode = "multiple",
  selectedFilter: selectedFilterProp,
  defaultSelectedFilter,
  onFilterChange,
  onFilterApply,
  onFilterReset,
  hybridPopoverProps,
  optionListProps,
  calendarProps,
  dateRangeProps,
  timeProps,
  dateTimeProps,
  width,
  isFullWidth = false,
  ariaLabel = "Search",
  ariaDescribedBy,
  className,
  onChange,
  onSearch,
  onClear,
  onBack,
  onClose
}, ref) {
  const isLoading = isLoadingProp === true;
  const uid = React.useId();
  const inputId = `arvo-adv-search-input-${uid}`;
  const errorId = `arvo-adv-search-err-${uid}`;
  const rootRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const errIcoRef = React.useRef(null);
  const isValueControlled = valueProp !== void 0;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = isValueControlled ? valueProp : internalValue;
  const hasValue = currentValue.length > 0;
  const previousValueRef = React.useRef(currentValue);
  const valueOnFocusRef = React.useRef(currentValue);
  const [isOpen, setIsOpen] = useControllableState.useControllableState(isOpenProp, defaultOpen);
  const handleOpenChange = React.useCallback(
    (next) => {
      setIsOpen(next);
      onOpenChange == null ? void 0 : onOpenChange(next);
      if (next) {
        dispatch("adv-search:open", {});
      } else {
        dispatch("adv-search:close", {});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setIsOpen, onOpenChange]
  );
  const isScopeControlled = selectedScopeProp !== void 0;
  const initialScope = React.useMemo(() => {
    if (defaultSelectedScope !== void 0) return defaultSelectedScope;
    return selectionMode === "multiple" ? [] : null;
  }, [defaultSelectedScope, selectionMode]);
  const [internalScope, setInternalScope] = React.useState(
    initialScope
  );
  const currentScope = isScopeControlled ? selectedScopeProp ?? null : internalScope;
  const isFilterControlled = selectedFilterProp !== void 0;
  const [internalFilter, setInternalFilter] = React.useState(
    defaultSelectedFilter ?? null
  );
  const currentFilter = isFilterControlled ? selectedFilterProp : internalFilter;
  const [isFocused, setIsFocused] = React.useState(false);
  const resolvedErrorMessage = errorMessage ?? MessageAlert.ARVO_MSG_ALERT_DEFAULT_ERROR;
  const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
  const showInlineAlert = isInvalid && errorDisplay === "inline";
  useTooltip.useTooltip({
    triggerRef: errIcoRef,
    tooltip: showTooltipIcon ? resolvedErrorMessage : void 0
  });
  const dispatch = React.useCallback(
    (name, detail) => {
      var _a;
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent(name, { bubbles: true, cancelable: true, detail })
      );
    },
    []
  );
  const debounceTimerRef = React.useRef(null);
  const cancelDebounce = React.useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);
  React.useEffect(() => () => cancelDebounce(), [cancelDebounce]);
  const fireSearch = React.useCallback(
    (val) => {
      dispatch("adv-search:search", { value: val });
      onSearch == null ? void 0 : onSearch(val);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSearch]
  );
  const programmaticClear = React.useCallback(() => {
    var _a;
    cancelDebounce();
    if (!isValueControlled) setInternalValue("");
    dispatch("adv-search:clear", {});
    onClear == null ? void 0 : onClear();
    (_a = inputRef.current) == null ? void 0 : _a.focus();
    if (searchMode === "input") {
      fireSearch("");
    }
  }, [isValueControlled, cancelDebounce, onClear, searchMode, fireSearch]);
  const programmaticSearch = React.useCallback(() => {
    cancelDebounce();
    fireSearch(currentValue);
  }, [cancelDebounce, currentValue, fireSearch]);
  const programmaticSetValue = React.useCallback(
    (next) => {
      cancelDebounce();
      const prev = currentValue;
      if (!isValueControlled) setInternalValue(next);
      if (next !== prev) {
        dispatch("adv-search:change", { value: next, previousValue: prev });
        onChange == null ? void 0 : onChange(next);
      }
      previousValueRef.current = next;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancelDebounce, currentValue, isValueControlled, onChange]
  );
  React.useEffect(() => {
    var _a;
    if ((isLoading || isDisabled) && document.activeElement === inputRef.current) {
      (_a = inputRef.current) == null ? void 0 : _a.blur();
    }
  }, [isLoading, isDisabled]);
  React.useEffect(() => {
    if (!shortcut || isDisabled || isLoading) return;
    const combo = utils.parseShortcut(shortcut);
    const handler = (e) => {
      var _a, _b;
      const t = e.target;
      if (t !== inputRef.current && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable))
        return;
      if (document.activeElement === inputRef.current) return;
      if (utils.matchesShortcut(e, combo)) {
        e.preventDefault();
        e.stopPropagation();
        (_a = inputRef.current) == null ? void 0 : _a.focus();
        (_b = inputRef.current) == null ? void 0 : _b.select();
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [shortcut, isDisabled, isLoading]);
  const handleInputChange = (e) => {
    if (isDisabled || isLoading || isReadOnly) {
      e.preventDefault();
      return;
    }
    const v = e.target.value;
    if (!isValueControlled) setInternalValue(v);
    dispatch("adv-search:input", { value: v });
    onChange == null ? void 0 : onChange(v);
    if (searchMode === "input" && v.length >= minChars) {
      if (debounceMs > 0) {
        cancelDebounce();
        debounceTimerRef.current = window.setTimeout(() => {
          fireSearch(v);
        }, debounceMs);
      } else {
        fireSearch(v);
      }
    }
  };
  const handleInputKeyDown = (e) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.key === "Escape") {
      if (isOpen) {
        return;
      }
      if (isClearable && !isReadOnly && hasValue) {
        e.preventDefault();
        programmaticClear();
        return;
      }
      e.target.blur();
      return;
    }
    if (e.key === "Enter") {
      if (searchMode === "submit" && !isReadOnly && hasValue) {
        e.preventDefault();
        cancelDebounce();
        fireSearch(currentValue);
      }
    }
  };
  const handleInputFocus = () => {
    setIsFocused(true);
    valueOnFocusRef.current = currentValue;
    previousValueRef.current = currentValue;
  };
  const handleInputBlur = () => {
    setIsFocused(false);
    if (currentValue !== valueOnFocusRef.current) {
      dispatch("adv-search:change", {
        value: currentValue,
        previousValue: previousValueRef.current
      });
      previousValueRef.current = currentValue;
    }
  };
  const commitScope = React.useCallback(
    (next) => {
      if (!isScopeControlled) setInternalScope(next);
      dispatch("adv-search:scope-change", { value: next });
      onScopeChange == null ? void 0 : onScopeChange(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isScopeControlled, onScopeChange]
  );
  const commitFilterChange = React.useCallback(
    (next) => {
      if (!isFilterControlled) setInternalFilter(next);
      dispatch("adv-search:filter-change", { value: next });
      onFilterChange == null ? void 0 : onFilterChange(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFilterControlled, onFilterChange]
  );
  const commitFilterApply = React.useCallback(
    (next) => {
      if (!isFilterControlled) setInternalFilter(next);
      dispatch("adv-search:filter-apply", { value: next });
      onFilterApply == null ? void 0 : onFilterApply(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFilterControlled, onFilterApply]
  );
  const handleFilterReset = React.useCallback(() => {
    dispatch("adv-search:filter-reset", {});
    onFilterReset == null ? void 0 : onFilterReset();
  }, [onFilterReset]);
  const submitDisabled = isDisabled || isLoading || isReadOnly || currentValue.length < Math.max(minChars, 1);
  const resolvedScopeLabel = React.useMemo(() => {
    if (triggerLabel != null) return triggerLabel;
    if (variant === "scopedSearch") {
      const fallback = selectionMode === "multiple" ? "Scopes" : "Scope";
      return findScopeLabel(scopeOptions, currentScope) ?? fallback;
    }
    if (variant === "filterBy") return "Filter";
    return void 0;
  }, [
    triggerLabel,
    variant,
    selectionMode,
    scopeOptions,
    currentScope
  ]);
  React.useImperativeHandle(
    ref,
    () => {
      const NO_ARG = Symbol("NO_ARG");
      const handle = {
        get element() {
          return rootRef.current;
        },
        focus: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.focus();
        },
        clear: programmaticClear,
        search: programmaticSearch,
        value: ((next = NO_ARG) => {
          if (next === NO_ARG) return currentValue;
          programmaticSetValue(next);
        }),
        open: () => handleOpenChange(true),
        close: () => handleOpenChange(false),
        toggle: (force) => {
          const next = force === void 0 ? !isOpen : force;
          handleOpenChange(next);
        },
        isOpen: () => isOpen,
        setError: (_message) => {
        },
        setLoading: (_loading) => {
        }
      };
      return handle;
    },
    [
      currentValue,
      handleOpenChange,
      isOpen,
      programmaticClear,
      programmaticSearch,
      programmaticSetValue
    ]
  );
  const rootClass = [
    "arvo-adv-search",
    VARIANT_CLASS[variant],
    `arvo-adv-search--${size}`,
    isFullWidth && "arvo-adv-search--full-width",
    hasValue && "has-value",
    isFocused && "is-focused",
    isOpen && "is-open",
    isInvalid && "has-error",
    showTooltipIcon && "error-tooltip",
    isDisabled && "is-disabled",
    isReadOnly && !isDisabled && "is-readonly",
    isLoading && "loading",
    className
  ].filter(Boolean).join(" ");
  const rootStyle = React.useMemo(() => {
    if (isFullWidth || !width) return void 0;
    return { ["--arvo-form-input-width"]: width };
  }, [isFullWidth, width]);
  const renderLeadingIcon = () => /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: "arvo-adv-search__ico o9con-search",
      "aria-hidden": "true"
    }
  );
  const renderInput = () => /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      id: inputId,
      ref: inputRef,
      className: "arvo-adv-search__input",
      type: "search",
      role: "searchbox",
      placeholder,
      value: currentValue,
      disabled: isDisabled,
      readOnly: isReadOnly,
      "aria-label": ariaLabel,
      "aria-invalid": isInvalid || void 0,
      "aria-disabled": isDisabled || void 0,
      "aria-readonly": isReadOnly || void 0,
      "aria-busy": isLoading || void 0,
      "aria-describedby": [showInlineAlert ? errorId : null, ariaDescribedBy].filter(Boolean).join(" ") || void 0,
      onChange: handleInputChange,
      onKeyDown: handleInputKeyDown,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur
    }
  );
  const renderShortcut = () => {
    if (!shortcut || hasValue || isFocused) return null;
    return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-adv-search__shortcut", children: utils.formatShortcutDisplay(shortcut) });
  };
  const renderCounter = () => {
    if (!counter || !hasValue || isDisabled) return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      Badge.ArvoBadge,
      {
        className: "arvo-adv-search__counter",
        variant: "counter",
        appearance: "outline",
        size: "md",
        semanticType: "neutral",
        counterMode: "ratio",
        hasBadgeIcon: false,
        count: counter.current,
        total: counter.total,
        "aria-live": "polite"
      }
    );
  };
  const renderClear = () => {
    if (!isClearable || !hasValue || isDisabled || isReadOnly || isLoading)
      return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      IconButton.ArvoIconButton,
      {
        className: "arvo-adv-search__clear",
        variant: "tertiary",
        size: "xs",
        icon: "close",
        tooltip: "Clear search",
        onClick: programmaticClear
      }
    );
  };
  const renderErrorIcon = () => {
    if (!showTooltipIcon) return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: errIcoRef,
        className: "arvo-adv-search__err-ico o9con-status-error-filled",
        role: "img",
        "aria-label": resolvedErrorMessage
      }
    );
  };
  const renderSubmit = () => {
    if (searchMode !== "submit") return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      Button.ArvoButton,
      {
        className: "arvo-adv-search__submit",
        variant: "primary",
        size: "sm",
        label: "Search",
        isDisabled: submitDisabled,
        onClick: () => fireSearch(currentValue)
      }
    );
  };
  const renderSeparator = () => /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-adv-search__sep", "aria-hidden": "true" });
  const renderInputGroup = () => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-adv-search__input-group", children: [
    renderLeadingIcon(),
    renderInput()
  ] });
  const isOverlayOwnedTrigger = variant === "customFilter" || variant === "filterBy" && filterContentType !== "optionList";
  const handleTriggerClick = isOverlayOwnedTrigger ? void 0 : () => {
    if (isDisabled || isLoading) return;
    handleOpenChange(!isOpen);
  };
  const renderDdTrigger = () => /* @__PURE__ */ jsxRuntime.jsxs(
    "button",
    {
      ref: triggerRef,
      type: "button",
      className: [
        "arvo-adv-search__trigger",
        "arvo-btn",
        "arvo-btn--tertiary",
        "arvo-btn--md",
        "arvo-dd-btn",
        isOpen && "open",
        (triggerProps == null ? void 0 : triggerProps.className) || ""
      ].filter(Boolean).join(" "),
      disabled: isDisabled || isLoading,
      onClick: handleTriggerClick,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-btn__txt", children: resolvedScopeLabel }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: `arvo-btn__ico arvo-btn__ico--end ${isOpen ? "o9con-angle-up" : "o9con-angle-down"}`,
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
  const renderIconTrigger = () => /* @__PURE__ */ jsxRuntime.jsx(
    IconButton.ArvoIconButton,
    {
      ref: triggerRef,
      className: [
        "arvo-adv-search__trigger",
        isOpen && "open",
        (triggerProps == null ? void 0 : triggerProps.className) || ""
      ].filter(Boolean).join(" "),
      variant: "tertiary",
      size: "md",
      icon: "sliders",
      tooltip: (triggerProps == null ? void 0 : triggerProps.tooltip) || "Open advanced filters",
      isDisabled: isDisabled || isLoading
    }
  );
  const pickerOpenHandlers = {
    onOpen: () => {
      handleOpenChange(true);
    },
    onClose: () => {
      handleOpenChange(false);
    }
  };
  const renderPickerForFilterBy = () => {
    if (variant !== "filterBy") return null;
    if (filterContentType !== "calendar" && filterContentType !== "dateRange" && filterContentType !== "time" && filterContentType !== "dateTime")
      return null;
    const commonAnchor = {
      anchor: triggerRef
    };
    if (filterContentType === "calendar") {
      return /* @__PURE__ */ jsxRuntime.jsx(
        DatePicker.ArvoDatePicker,
        {
          placement: "bottom-end",
          ...calendarProps,
          ...commonAnchor,
          value: currentFilter ?? null,
          defaultValue: void 0,
          ...pickerOpenHandlers,
          onChange: (payload) => {
            commitFilterChange(payload.value);
          }
        }
      );
    }
    if (filterContentType === "dateRange") {
      const rangeValue = currentFilter;
      return /* @__PURE__ */ jsxRuntime.jsx(
        DateRangePicker.ArvoDateRangePicker,
        {
          placement: "bottom-end",
          ...dateRangeProps,
          ...commonAnchor,
          startValue: (rangeValue == null ? void 0 : rangeValue.start) ?? null,
          endValue: (rangeValue == null ? void 0 : rangeValue.end) ?? null,
          ...pickerOpenHandlers,
          onChange: (payload) => {
            commitFilterChange({
              start: payload.start,
              end: payload.end,
              formatted: payload.formatted,
              mode: payload.mode
            });
          }
        }
      );
    }
    if (filterContentType === "time") {
      return /* @__PURE__ */ jsxRuntime.jsx(
        TimePicker.ArvoTimePicker,
        {
          placement: "bottom-end",
          ...timeProps,
          ...commonAnchor,
          value: currentFilter ?? null,
          defaultValue: void 0,
          ...pickerOpenHandlers,
          onChange: (payload) => {
            commitFilterChange(payload.value);
          }
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      DateTimePicker.ArvoDateTimePicker,
      {
        placement: "bottom-end",
        ...dateTimeProps,
        ...commonAnchor,
        value: currentFilter ?? null,
        defaultValue: void 0,
        ...pickerOpenHandlers,
        onChange: (payload) => {
          commitFilterChange(payload.value);
        }
      }
    );
  };
  const renderOptionListOverlay = () => {
    const isScopedVariant = variant === "scopedSearch";
    const isFilterOptionList = variant === "filterBy" && filterContentType === "optionList";
    if (!isScopedVariant && !isFilterOptionList) return null;
    const isMultiple = isScopedVariant ? selectionMode === "multiple" : filterSelectionMode === "multiple";
    const items = isScopedVariant ? (scopeOptions ?? []).map((opt) => ({
      id: opt.key,
      label: opt.label,
      icon: opt.icon,
      isDisabled: opt.isDisabled,
      value: opt.key
    })) : (hybridPopoverProps == null ? void 0 : hybridPopoverProps.items) ?? (optionListProps == null ? void 0 : optionListProps.items) ?? [];
    const selectedValue = isScopedVariant ? currentScope : currentFilter;
    const defaultPlacement = isScopedVariant ? "bottom-start" : "bottom-end";
    return /* @__PURE__ */ jsxRuntime.jsx(
      OptionList.ArvoOptionList,
      {
        placement: defaultPlacement,
        ...optionListProps,
        items,
        triggerRef,
        isOpen,
        onOpenChange: handleOpenChange,
        isMultiple,
        value: selectedValue ?? (isMultiple ? [] : void 0),
        closeOnSelect: !isMultiple,
        onChange: (nextValue, _item, _isSelected) => {
          if (isScopedVariant) {
            commitScope(
              isMultiple ? nextValue : nextValue
            );
          } else {
            commitFilterChange(nextValue);
          }
        }
      }
    );
  };
  const renderPopoverOverlay = () => {
    if (variant !== "customFilter") return null;
    const footer = popoverFooter === false ? null : popoverFooter ?? {};
    const actions = (() => {
      if (!footer) return [];
      const out = [];
      const hasReset = footer.hasReset ?? true;
      const secondaryLabel = footer.secondaryLabel ?? "Cancel";
      const primaryLabel = footer.primaryLabel ?? "Apply";
      if (hasReset) {
        out.push({
          id: "adv-search-reset",
          icon: "rotate-left",
          variant: "tertiary",
          action: () => {
            handleFilterReset();
            return false;
          }
        });
      }
      if (secondaryLabel) {
        out.push({
          id: "adv-search-cancel",
          label: secondaryLabel,
          variant: "secondary",
          action: () => {
            onClose == null ? void 0 : onClose();
            handleOpenChange(false);
          }
        });
      }
      if (primaryLabel) {
        out.push({
          id: "adv-search-apply",
          label: primaryLabel,
          variant: "primary",
          action: () => {
            commitFilterApply(currentFilter);
            handleOpenChange(false);
          }
        });
      }
      return out;
    })();
    const headerExtras = hasPopoverHeader ? {
      placement: "bottom-end",
      hasHeader: true,
      title: popoverTitle ?? "",
      ...popoverProps
    } : {
      placement: "bottom-end",
      hasHeader: false,
      isClosable: false,
      hasBackButton: false,
      ...popoverProps
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      Popover.ArvoPopover,
      {
        ...headerExtras,
        triggerRef,
        isOpen,
        onOpenChange: handleOpenChange,
        actions,
        footerLeftSlot: footer ? footer.leftSlot ?? null : null,
        hasFooter: !!footer,
        onBack: () => {
          dispatch("adv-search:back", {});
          onBack == null ? void 0 : onBack();
        },
        onClose: () => {
          onClose == null ? void 0 : onClose();
        },
        children: customFilterContent
      }
    );
  };
  const renderHybridPopoverOverlay = () => {
    if (variant !== "filterBy" || filterContentType !== "hybridPopover")
      return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      HybridPopover.ArvoHybridPopover,
      {
        placement: "bottom-end",
        ...hybridPopoverProps,
        selectionMode: filterSelectionMode === "multiple" ? "multi" : "single",
        variant: filterSelectionMode === "multiple" ? "multi" : "single",
        triggerRef,
        isOpen,
        onOpenChange: handleOpenChange,
        value: currentFilter,
        onChange: (next) => commitFilterChange(next),
        onApply: (next) => {
          commitFilterApply(next);
        },
        onReset: () => {
          handleFilterReset();
        },
        onCancel: () => {
          onClose == null ? void 0 : onClose();
        }
      }
    );
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref: rootRef,
      role: "search",
      className: rootClass,
      style: rootStyle,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-adv-search__field", children: [
          variant === "scopedSearch" && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-adv-search__lead", children: [
            renderDdTrigger(),
            renderSeparator()
          ] }),
          renderInputGroup(),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-adv-search__actions", children: [
            renderShortcut(),
            renderCounter(),
            renderClear(),
            renderErrorIcon(),
            variant !== "scopedSearch" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              renderSubmit(),
              renderSeparator(),
              variant === "customFilter" ? renderIconTrigger() : renderDdTrigger()
            ] }),
            variant === "scopedSearch" && renderSubmit()
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-adv-search__underline", "aria-hidden": "true" })
        ] }),
        showInlineAlert && /* @__PURE__ */ jsxRuntime.jsx(
          MessageAlert.ArvoMessageAlert,
          {
            id: errorId,
            className: "arvo-adv-search__message",
            type: "negative",
            message: resolvedErrorMessage,
            isDismissable: false
          }
        ),
        renderOptionListOverlay(),
        renderPopoverOverlay(),
        renderHybridPopoverOverlay(),
        renderPickerForFilterBy()
      ]
    }
  );
});
exports.ArvoAdvanceSearch = ArvoAdvanceSearch;
exports.default = ArvoAdvanceSearch;
exports.isWildcardQuery = isWildcardQuery;
//# sourceMappingURL=index52.cjs.map
