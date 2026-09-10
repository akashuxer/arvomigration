import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useState, useCallback, useEffect } from "react";
import { parseShortcut, formatShortcutDisplay, matchesShortcut } from "@arvo/utils";
import { useControllableState } from "./index90.js";
import { useTooltip } from "./index10.js";
import { ArvoBadge } from "./index45.js";
import { ArvoButton } from "./index16.js";
import { ArvoIconButton } from "./index17.js";
import { ARVO_MSG_ALERT_DEFAULT_ERROR, ArvoMessageAlert } from "./index13.js";
const ML_DEFAULTS = {
  enabled: true,
  minRows: 1,
  maxRows: 5,
  collapseBehavior: "none",
  delimiterBehavior: "comma-to-new-row",
  delimiter: ","
};
const LINE_HEIGHT = 20;
const TEXTAREA_PAD_Y = 12;
const VALID_DELIMITER_BEHAVIORS = [
  "none",
  "comma-to-new-row",
  "comma-and-linebreak",
  "shift+enter"
];
function normalizeMultiLine(prop) {
  if (!prop) return null;
  if (prop === true) return { ...ML_DEFAULTS };
  if (!prop.enabled) return null;
  let delimiterBehavior;
  if (prop.delimiterBehavior != null && VALID_DELIMITER_BEHAVIORS.includes(prop.delimiterBehavior)) {
    delimiterBehavior = prop.delimiterBehavior;
  } else if (prop.delimiter != null) {
    delimiterBehavior = "comma-to-new-row";
  } else {
    delimiterBehavior = ML_DEFAULTS.delimiterBehavior;
  }
  return {
    enabled: true,
    minRows: prop.minRows ?? ML_DEFAULTS.minRows,
    maxRows: prop.maxRows ?? ML_DEFAULTS.maxRows,
    collapseBehavior: prop.collapseBehavior ?? ML_DEFAULTS.collapseBehavior,
    delimiterBehavior,
    delimiter: prop.delimiter ?? ML_DEFAULTS.delimiter
  };
}
function parseValues(value, mlConfig) {
  const lines = value.split("\n");
  const { delimiterBehavior, delimiter } = mlConfig;
  if (delimiterBehavior === "none" || delimiterBehavior === "shift+enter") {
    return lines.map((s) => s.trim()).filter(Boolean);
  }
  return lines.flatMap((line) => line.split(delimiter)).map((s) => s.trim()).filter(Boolean);
}
function normalizeMultilineValue(v) {
  let out = v.replace(/\n[ \t]*\n+/g, "\n").replace(/\n{2,}/g, "\n");
  out = out.replace(/^\n+/, "");
  return out;
}
function isCursorLineEmpty(textarea) {
  const value = textarea.value;
  const cursor = textarea.selectionStart ?? value.length;
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);
  const lineStart = before.lastIndexOf("\n") + 1;
  const afterBreak = after.indexOf("\n");
  const lineEnd = afterBreak === -1 ? after.length : afterBreak;
  const currentLine = before.slice(lineStart) + after.slice(0, lineEnd);
  return currentLine.trim().length === 0;
}
function computeInitialSummary(variant, multiLineProp, value, defaultValue) {
  if (variant !== "filter") return { isSummary: false, summaryText: "", realValue: "" };
  const cfg = normalizeMultiLine(multiLineProp);
  if (!cfg || cfg.collapseBehavior !== "summary") {
    return { isSummary: false, summaryText: "", realValue: "" };
  }
  const initial = value !== void 0 ? value : defaultValue;
  if (!initial) return { isSummary: false, summaryText: "", realValue: "" };
  const values = parseValues(initial, cfg);
  if (values.length <= 1) return { isSummary: false, summaryText: "", realValue: "" };
  return {
    isSummary: true,
    summaryText: `${values[0]}, +${values.length - 1} more`,
    realValue: initial
  };
}
const ArvoSearch = forwardRef(
  function ArvoSearch2({
    variant = "filter",
    value,
    defaultValue = "",
    placeholder = "Search",
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    errorMsg,
    errorDisplay = "inline",
    isClearable = true,
    shortcut,
    counter = null,
    searchMode = "input",
    minChars = 0,
    debounceMs = 0,
    isMultiLine: multiLineProp,
    isLoading: isLoadingProp = false,
    width,
    isFullWidth = false,
    isExpanded: isExpandedProp,
    defaultExpanded = false,
    expandDirection = "end",
    hasPreviousButton = true,
    hasNextButton = true,
    onSearch,
    onInput,
    onChange,
    onClear,
    onFocus,
    onBlur,
    onNext,
    onPrevious,
    onExpandedChange,
    className,
    "aria-label": ariaLabel = "Search"
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = useId();
    const errorId = `arvo-search-err-${uid}`;
    const inputId = `arvo-search-input-${uid}`;
    const inputRef = useRef(null);
    const rootRef = useRef(null);
    const fieldRef = useRef(null);
    const actionsRef = useRef(null);
    const errIcoRef = useRef(null);
    const expandTriggerRef = useRef(null);
    const valueOnFocusRef = useRef(defaultValue);
    const isControlled = value !== void 0;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue.length > 0;
    const previousValueRef = useRef(currentValue);
    const [expanded, setExpanded] = useControllableState(
      isExpandedProp,
      defaultExpanded
    );
    const prevExpandedRef = useRef(expanded);
    const suppressAutoCollapseRef = useRef(false);
    const debounceTimerRef = useRef(null);
    const initialSummary = computeInitialSummary(variant, multiLineProp, value, defaultValue);
    const [isSummary, setIsSummary] = useState(initialSummary.isSummary);
    const [summaryText, setSummaryText] = useState(initialSummary.summaryText);
    const realValueRef = useRef(initialSummary.realValue);
    const dispatch = useCallback(
      (name, detail) => {
        var _a;
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail
          })
        );
      },
      []
    );
    const [isFocusWithin, setIsFocusWithin] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const mlConfig = variant === "filter" ? normalizeMultiLine(multiLineProp) : null;
    const isMultiLine = !!mlConfig;
    const effectiveClearable = isClearable && !isMultiLine && !isReadOnly;
    const isExpandableFilter = variant === "expandable-filter";
    const isCollapsedExpandable = isExpandableFilter && !expanded;
    const effectiveInvalid = isInvalid && !isCollapsedExpandable;
    const errorMessage = errorMsg ?? ARVO_MSG_ALERT_DEFAULT_ERROR;
    const showTooltipIcon = effectiveInvalid && errorDisplay === "tooltip";
    const showInlineAlert = effectiveInvalid && errorDisplay === "inline";
    useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon ? errorMessage : void 0
    });
    const isTouchRef = useRef(
      typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(hover: none), (pointer: coarse)").matches
    );
    const classes = [
      "arvo-search",
      `arvo-search--${variant}`,
      isCollapsedExpandable && "arvo-search--collapsed",
      isExpandableFilter && `arvo-search--expand-${expandDirection}`,
      isMultiLine && "arvo-search--multi-line",
      isMultiLine && isSummary && "arvo-search--summary",
      isFullWidth && "arvo-search--full-width",
      hasValue && "has-value",
      effectiveInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      isDisabled && "is-disabled",
      isReadOnly && !isDisabled && "is-readonly",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const updatePadding = useCallback(() => {
      if (!actionsRef.current || !fieldRef.current) return;
      const w = actionsRef.current.offsetWidth;
      const pad = w > 0 ? w + 4 : 4;
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
    const autoResize = useCallback(() => {
      const el = inputRef.current;
      if (!el || !mlConfig) return;
      el.style.height = "auto";
      const minHeight = mlConfig.minRows * LINE_HEIGHT + TEXTAREA_PAD_Y;
      const maxHeight = mlConfig.maxRows * LINE_HEIGHT + TEXTAREA_PAD_Y;
      const targetHeight = Math.max(el.scrollHeight, minHeight);
      if (targetHeight > maxHeight) {
        el.style.height = `${maxHeight}px`;
        el.style.overflowY = "auto";
      } else {
        el.style.height = `${targetHeight}px`;
        el.style.overflowY = "hidden";
      }
    }, [mlConfig]);
    const displayValue = isSummary ? summaryText : currentValue;
    useEffect(() => {
      if (isMultiLine) autoResize();
    }, [displayValue, isMultiLine, autoResize]);
    useEffect(() => {
      var _a;
      if ((isLoading || isDisabled) && document.activeElement === inputRef.current) {
        (_a = inputRef.current) == null ? void 0 : _a.blur();
      }
    }, [isLoading, isDisabled]);
    useEffect(() => {
      var _a;
      if (isExpandableFilter && expanded && !prevExpandedRef.current) {
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
      prevExpandedRef.current = expanded;
    }, [isExpandableFilter, expanded]);
    useEffect(() => () => cancelDebounce(), []);
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
    const clearVisible = effectiveClearable && hasValue && !isDisabled && !isLoading && (isFocusWithin || isHovered || isTouchRef.current);
    const counterVisible = !!counter && hasValue && !isDisabled;
    const shortcutVisible = !!shortcut && !hasValue && !isFocusWithin;
    const sep1 = clearVisible && (counterVisible || shortcutVisible);
    const sep2 = variant === "find" && !isDisabled && !isLoading && (hasPreviousButton || hasNextButton) && (clearVisible || counterVisible || shortcutVisible);
    const navDisabled = isDisabled || isLoading || isReadOnly || counter != null && counter.total === 0;
    function cancelDebounce() {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
    function fireSearch(val) {
      const detail = { value: val };
      if (mlConfig) {
        const values = parseValues(val, mlConfig);
        detail.values = values;
        dispatch("search:search", detail);
        onSearch == null ? void 0 : onSearch(val, values);
      } else {
        dispatch("search:search", detail);
        onSearch == null ? void 0 : onSearch(val);
      }
    }
    function handleInputEvent(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      const v = e.target.value;
      dispatch("search:input", { value: v });
      onInput == null ? void 0 : onInput(e);
    }
    function handleValueChange(e) {
      if (isDisabled || isLoading || isReadOnly) {
        e.preventDefault();
        return;
      }
      let v = e.target.value;
      if (mlConfig && (mlConfig.delimiterBehavior === "comma-to-new-row" || mlConfig.delimiterBehavior === "comma-and-linebreak") && v.includes(",")) {
        v = v.replace(/,/g, "\n");
      }
      if (mlConfig) {
        v = normalizeMultilineValue(v);
      }
      if (!isControlled) setInternalValue(v);
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
    }
    function handleFocus(e) {
      if (isSummary) {
        setIsSummary(false);
      }
      valueOnFocusRef.current = currentValue;
      previousValueRef.current = currentValue;
      onFocus == null ? void 0 : onFocus(e);
    }
    function handleBlur(e) {
      if (currentValue !== valueOnFocusRef.current) {
        dispatch("search:change", {
          value: currentValue,
          previousValue: previousValueRef.current
        });
        previousValueRef.current = currentValue;
        onChange == null ? void 0 : onChange(currentValue);
      }
      if ((mlConfig == null ? void 0 : mlConfig.collapseBehavior) === "summary" && !isSummary) {
        const values = parseValues(currentValue, mlConfig);
        if (values.length > 1) {
          realValueRef.current = currentValue;
          setSummaryText(`${values[0]}, +${values.length - 1} more`);
          setIsSummary(true);
        }
      }
      onBlur == null ? void 0 : onBlur(e);
    }
    function handleKeyDown(e) {
      if (isDisabled || isLoading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === "Escape") {
        if (isExpandableFilter && expanded && !hasValue) {
          setExpanded(false);
          dispatch("search:collapse", {});
          onExpandedChange == null ? void 0 : onExpandedChange(false);
          requestAnimationFrame(() => {
            var _a, _b;
            (_b = (_a = expandTriggerRef.current) == null ? void 0 : _a.querySelector('button, [role="button"]')) == null ? void 0 : _b.focus();
          });
          return;
        }
        if (effectiveClearable && hasValue) {
          doClear();
        } else {
          e.target.blur();
        }
        return;
      }
      if (e.key === "Enter") {
        if (variant === "find") {
          e.preventDefault();
          if (e.shiftKey) {
            if (hasPreviousButton && !navDisabled) {
              dispatch("search:previous", {});
              onPrevious == null ? void 0 : onPrevious();
            }
          } else {
            if (hasNextButton && !navDisabled) {
              dispatch("search:next", {});
              onNext == null ? void 0 : onNext();
            }
          }
          return;
        }
        if (isReadOnly) return;
        if (isMultiLine) {
          const behavior = mlConfig.delimiterBehavior;
          const ta = e.target;
          if (behavior === "comma-and-linebreak") {
            if (e.shiftKey) {
              e.preventDefault();
              cancelDebounce();
              fireSearch(currentValue);
            } else {
              if (isCursorLineEmpty(ta)) {
                e.preventDefault();
                return;
              }
              requestAnimationFrame(autoResize);
            }
            return;
          }
          if (e.shiftKey) {
            if (isCursorLineEmpty(ta)) {
              e.preventDefault();
              return;
            }
            requestAnimationFrame(autoResize);
            return;
          }
          e.preventDefault();
          cancelDebounce();
          fireSearch(currentValue);
          return;
        }
        e.preventDefault();
        cancelDebounce();
        fireSearch(currentValue);
      }
    }
    function handlePaste() {
      if (isMultiLine) requestAnimationFrame(autoResize);
    }
    function doClear() {
      var _a;
      cancelDebounce();
      dispatch("search:clear", {});
      if (!isControlled) setInternalValue("");
      onClear == null ? void 0 : onClear();
      (_a = inputRef.current) == null ? void 0 : _a.focus();
      if (searchMode === "input") {
        fireSearch("");
      }
    }
    function handleNextClick() {
      if (navDisabled) return;
      dispatch("search:next", {});
      onNext == null ? void 0 : onNext();
    }
    function handlePreviousClick() {
      if (navDisabled) return;
      dispatch("search:previous", {});
      onPrevious == null ? void 0 : onPrevious();
    }
    function setRefs(node) {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        ref.current = node;
    }
    function handleRootFocusCapture() {
      setIsFocusWithin(true);
    }
    function handleRootBlurCapture(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsFocusWithin(false);
        if (isExpandableFilter && expanded && !hasValue && !suppressAutoCollapseRef.current) {
          setExpanded(false);
          dispatch("search:collapse", {});
          onExpandedChange == null ? void 0 : onExpandedChange(false);
        }
      }
    }
    function expandFromTrigger() {
      if (expanded) return;
      suppressAutoCollapseRef.current = true;
      setExpanded(true);
      dispatch("search:expand", {});
      onExpandedChange == null ? void 0 : onExpandedChange(true);
      requestAnimationFrame(() => {
        suppressAutoCollapseRef.current = false;
      });
    }
    const inputAttrs = {
      id: inputId,
      className: "arvo-search__input",
      value: displayValue,
      placeholder,
      disabled: isDisabled,
      readOnly: isReadOnly,
      "aria-label": ariaLabel,
      "aria-invalid": effectiveInvalid || void 0,
      "aria-readonly": isReadOnly || void 0,
      "aria-describedby": showInlineAlert ? errorId : void 0,
      onInput: handleInputEvent,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onPaste: handlePaste
    };
    const rootStyle = (() => {
      const effectiveWidth = isFullWidth ? "100%" : width;
      if (!effectiveWidth) return void 0;
      return { "--arvo-form-input-width": effectiveWidth };
    })();
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: setRefs,
        className: classes,
        style: rootStyle,
        role: "search",
        "aria-busy": isLoading || void 0,
        "aria-disabled": isDisabled || void 0,
        onFocusCapture: handleRootFocusCapture,
        onBlurCapture: handleRootBlurCapture,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        children: [
          isExpandableFilter && /* @__PURE__ */ jsx(
            "div",
            {
              ref: expandTriggerRef,
              className: "arvo-search__expand-trigger",
              ...expanded ? { inert: "" } : {},
              children: /* @__PURE__ */ jsx(
                ArvoIconButton,
                {
                  size: "md",
                  variant: "tertiary",
                  icon: "search",
                  tooltip: "Open search",
                  "aria-expanded": expanded,
                  "aria-controls": inputId,
                  onClick: expandFromTrigger,
                  onFocus: expandFromTrigger
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: fieldRef,
              className: "arvo-search__field",
              ...isCollapsedExpandable ? { inert: "" } : {},
              children: [
                /* @__PURE__ */ jsx(
                  "i",
                  {
                    className: "arvo-search__ico o9con o9con-search",
                    "aria-hidden": "true"
                  }
                ),
                isMultiLine ? /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    ref: inputRef,
                    ...inputAttrs,
                    rows: 1,
                    "aria-multiline": "true",
                    onChange: handleValueChange
                  }
                ) : /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: inputRef,
                    ...inputAttrs,
                    type: "search",
                    onChange: handleValueChange
                  }
                ),
                /* @__PURE__ */ jsxs("div", { ref: actionsRef, className: "arvo-search__actions", children: [
                  effectiveClearable && hasValue && !isDisabled && !isLoading && /* @__PURE__ */ jsx(
                    ArvoIconButton,
                    {
                      size: "xs",
                      variant: "tertiary",
                      icon: "close",
                      tooltip: "Clear",
                      tabIndex: -1,
                      onClick: doClear,
                      className: "arvo-search__clear"
                    }
                  ),
                  sep1 && /* @__PURE__ */ jsx("span", { className: "arvo-search__sep", "aria-hidden": "true" }),
                  shortcut && /* @__PURE__ */ jsx("span", { className: "arvo-search__shortcut", children: formatShortcutDisplay(shortcut) }),
                  counterVisible && /* @__PURE__ */ jsx(
                    ArvoBadge,
                    {
                      className: "arvo-search__counter",
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
                  ),
                  variant === "find" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    sep2 && /* @__PURE__ */ jsx("span", { className: "arvo-search__sep", "aria-hidden": "true" }),
                    hasPreviousButton && /* @__PURE__ */ jsx(
                      ArvoIconButton,
                      {
                        size: "sm",
                        variant: "tertiary",
                        icon: "angle-up",
                        tooltip: "Previous match",
                        isDisabled: navDisabled,
                        onClick: handlePreviousClick,
                        className: "arvo-search__prev"
                      }
                    ),
                    hasNextButton && /* @__PURE__ */ jsx(
                      ArvoIconButton,
                      {
                        size: "sm",
                        variant: "tertiary",
                        icon: "angle-down",
                        tooltip: "Next match",
                        isDisabled: navDisabled,
                        onClick: handleNextClick,
                        className: "arvo-search__next"
                      }
                    )
                  ] }),
                  searchMode === "submit" && /* @__PURE__ */ jsx(
                    ArvoButton,
                    {
                      variant: "primary",
                      size: "sm",
                      label: "Search",
                      className: "arvo-search__submit",
                      isDisabled: isDisabled || isLoading || isReadOnly,
                      onClick: () => {
                        cancelDebounce();
                        fireSearch(currentValue);
                      }
                    }
                  ),
                  showTooltipIcon && /* @__PURE__ */ jsx(
                    ArvoMessageAlert,
                    {
                      ref: errIcoRef,
                      type: "negative",
                      isInline: true,
                      message: errorMessage,
                      className: "arvo-search__err-ico"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "arvo-search__border" })
              ]
            }
          ),
          showInlineAlert && /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "negative", id: errorId, message: errorMessage })
        ]
      }
    );
  }
);
export {
  ArvoSearch as default
};
//# sourceMappingURL=index51.js.map
