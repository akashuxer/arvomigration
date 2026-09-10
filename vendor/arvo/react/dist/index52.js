import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useState, useCallback, useMemo, useEffect, useImperativeHandle } from "react";
import { parseShortcut, matchesShortcut, formatShortcutDisplay } from "@arvo/utils";
import { useControllableState } from "./index90.js";
import { useTooltip } from "./index10.js";
import { ArvoBadge } from "./index45.js";
import { ArvoButton } from "./index16.js";
import { ArvoIconButton } from "./index17.js";
import { ARVO_MSG_ALERT_DEFAULT_ERROR, ArvoMessageAlert } from "./index13.js";
import { ArvoOptionList } from "./index62.js";
import { ArvoPopover } from "./index27.js";
import { ArvoHybridPopover } from "./index28.js";
import { ArvoDatePicker } from "./index79.js";
import { ArvoDateRangePicker } from "./index82.js";
import { ArvoTimePicker } from "./index81.js";
import { ArvoDateTimePicker } from "./index80.js";
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
const ArvoAdvanceSearch = forwardRef(function ArvoAdvanceSearch2({
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
  const uid = useId();
  const inputId = `arvo-adv-search-input-${uid}`;
  const errorId = `arvo-adv-search-err-${uid}`;
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const errIcoRef = useRef(null);
  const isValueControlled = valueProp !== void 0;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isValueControlled ? valueProp : internalValue;
  const hasValue = currentValue.length > 0;
  const previousValueRef = useRef(currentValue);
  const valueOnFocusRef = useRef(currentValue);
  const [isOpen, setIsOpen] = useControllableState(isOpenProp, defaultOpen);
  const handleOpenChange = useCallback(
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
  const initialScope = useMemo(() => {
    if (defaultSelectedScope !== void 0) return defaultSelectedScope;
    return selectionMode === "multiple" ? [] : null;
  }, [defaultSelectedScope, selectionMode]);
  const [internalScope, setInternalScope] = useState(
    initialScope
  );
  const currentScope = isScopeControlled ? selectedScopeProp ?? null : internalScope;
  const isFilterControlled = selectedFilterProp !== void 0;
  const [internalFilter, setInternalFilter] = useState(
    defaultSelectedFilter ?? null
  );
  const currentFilter = isFilterControlled ? selectedFilterProp : internalFilter;
  const [isFocused, setIsFocused] = useState(false);
  const resolvedErrorMessage = errorMessage ?? ARVO_MSG_ALERT_DEFAULT_ERROR;
  const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
  const showInlineAlert = isInvalid && errorDisplay === "inline";
  useTooltip({
    triggerRef: errIcoRef,
    tooltip: showTooltipIcon ? resolvedErrorMessage : void 0
  });
  const dispatch = useCallback(
    (name, detail) => {
      var _a;
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent(name, { bubbles: true, cancelable: true, detail })
      );
    },
    []
  );
  const debounceTimerRef = useRef(null);
  const cancelDebounce = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);
  useEffect(() => () => cancelDebounce(), [cancelDebounce]);
  const fireSearch = useCallback(
    (val) => {
      dispatch("adv-search:search", { value: val });
      onSearch == null ? void 0 : onSearch(val);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSearch]
  );
  const programmaticClear = useCallback(() => {
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
  const programmaticSearch = useCallback(() => {
    cancelDebounce();
    fireSearch(currentValue);
  }, [cancelDebounce, currentValue, fireSearch]);
  const programmaticSetValue = useCallback(
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
  useEffect(() => {
    var _a;
    if ((isLoading || isDisabled) && document.activeElement === inputRef.current) {
      (_a = inputRef.current) == null ? void 0 : _a.blur();
    }
  }, [isLoading, isDisabled]);
  useEffect(() => {
    if (!shortcut || isDisabled || isLoading) return;
    const combo = parseShortcut(shortcut);
    const handler = (e) => {
      var _a, _b;
      const t = e.target;
      if (t !== inputRef.current && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable))
        return;
      if (document.activeElement === inputRef.current) return;
      if (matchesShortcut(e, combo)) {
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
  const commitScope = useCallback(
    (next) => {
      if (!isScopeControlled) setInternalScope(next);
      dispatch("adv-search:scope-change", { value: next });
      onScopeChange == null ? void 0 : onScopeChange(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isScopeControlled, onScopeChange]
  );
  const commitFilterChange = useCallback(
    (next) => {
      if (!isFilterControlled) setInternalFilter(next);
      dispatch("adv-search:filter-change", { value: next });
      onFilterChange == null ? void 0 : onFilterChange(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFilterControlled, onFilterChange]
  );
  const commitFilterApply = useCallback(
    (next) => {
      if (!isFilterControlled) setInternalFilter(next);
      dispatch("adv-search:filter-apply", { value: next });
      onFilterApply == null ? void 0 : onFilterApply(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFilterControlled, onFilterApply]
  );
  const handleFilterReset = useCallback(() => {
    dispatch("adv-search:filter-reset", {});
    onFilterReset == null ? void 0 : onFilterReset();
  }, [onFilterReset]);
  const submitDisabled = isDisabled || isLoading || isReadOnly || currentValue.length < Math.max(minChars, 1);
  const resolvedScopeLabel = useMemo(() => {
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
  useImperativeHandle(
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
  const rootStyle = useMemo(() => {
    if (isFullWidth || !width) return void 0;
    return { ["--arvo-form-input-width"]: width };
  }, [isFullWidth, width]);
  const renderLeadingIcon = () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "arvo-adv-search__ico o9con-search",
      "aria-hidden": "true"
    }
  );
  const renderInput = () => /* @__PURE__ */ jsx(
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
    return /* @__PURE__ */ jsx("span", { className: "arvo-adv-search__shortcut", children: formatShortcutDisplay(shortcut) });
  };
  const renderCounter = () => {
    if (!counter || !hasValue || isDisabled) return null;
    return /* @__PURE__ */ jsx(
      ArvoBadge,
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
    return /* @__PURE__ */ jsx(
      ArvoIconButton,
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
    return /* @__PURE__ */ jsx(
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
    return /* @__PURE__ */ jsx(
      ArvoButton,
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
  const renderSeparator = () => /* @__PURE__ */ jsx("span", { className: "arvo-adv-search__sep", "aria-hidden": "true" });
  const renderInputGroup = () => /* @__PURE__ */ jsxs("div", { className: "arvo-adv-search__input-group", children: [
    renderLeadingIcon(),
    renderInput()
  ] });
  const isOverlayOwnedTrigger = variant === "customFilter" || variant === "filterBy" && filterContentType !== "optionList";
  const handleTriggerClick = isOverlayOwnedTrigger ? void 0 : () => {
    if (isDisabled || isLoading) return;
    handleOpenChange(!isOpen);
  };
  const renderDdTrigger = () => /* @__PURE__ */ jsxs(
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
        /* @__PURE__ */ jsx("span", { className: "arvo-btn__txt", children: resolvedScopeLabel }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `arvo-btn__ico arvo-btn__ico--end ${isOpen ? "o9con-angle-up" : "o9con-angle-down"}`,
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
  const renderIconTrigger = () => /* @__PURE__ */ jsx(
    ArvoIconButton,
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
      return /* @__PURE__ */ jsx(
        ArvoDatePicker,
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
      return /* @__PURE__ */ jsx(
        ArvoDateRangePicker,
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
      return /* @__PURE__ */ jsx(
        ArvoTimePicker,
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
    return /* @__PURE__ */ jsx(
      ArvoDateTimePicker,
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
    return /* @__PURE__ */ jsx(
      ArvoOptionList,
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
    return /* @__PURE__ */ jsx(
      ArvoPopover,
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
    return /* @__PURE__ */ jsx(
      ArvoHybridPopover,
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: rootRef,
      role: "search",
      className: rootClass,
      style: rootStyle,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "arvo-adv-search__field", children: [
          variant === "scopedSearch" && /* @__PURE__ */ jsxs("div", { className: "arvo-adv-search__lead", children: [
            renderDdTrigger(),
            renderSeparator()
          ] }),
          renderInputGroup(),
          /* @__PURE__ */ jsxs("div", { className: "arvo-adv-search__actions", children: [
            renderShortcut(),
            renderCounter(),
            renderClear(),
            renderErrorIcon(),
            variant !== "scopedSearch" && /* @__PURE__ */ jsxs(Fragment, { children: [
              renderSubmit(),
              renderSeparator(),
              variant === "customFilter" ? renderIconTrigger() : renderDdTrigger()
            ] }),
            variant === "scopedSearch" && renderSubmit()
          ] }),
          /* @__PURE__ */ jsx("span", { className: "arvo-adv-search__underline", "aria-hidden": "true" })
        ] }),
        showInlineAlert && /* @__PURE__ */ jsx(
          ArvoMessageAlert,
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
export {
  ArvoAdvanceSearch,
  ArvoAdvanceSearch as default,
  isWildcardQuery
};
//# sourceMappingURL=index52.js.map
