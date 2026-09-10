import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useMemo, useState, useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { getUserLocale, getLocaleTimeFormat, formatTime, createSegmentController, parseTime } from "@arvo/core";
import { useOverlaySurface } from "./index92.js";
import { useArvoLocale } from "./index11.js";
import { useTooltip } from "./index10.js";
import { ArvoIconButton } from "./index17.js";
import { ArvoFormLabel } from "./index12.js";
import { ArvoMessageAlert } from "./index13.js";
import { ArvoTimeDropdown } from "./index83.js";
function timeKey(v) {
  if (!v) return "";
  return `${v.hours}:${v.minutes}:${v.seconds ?? 0}:${v.milliseconds ?? 0}:${v.timezone ?? ""}`;
}
function sameTime(a, b) {
  return timeKey(a) === timeKey(b);
}
function normalizeTime(v) {
  const hours = Math.trunc(v.hours);
  const minutes = Math.trunc(v.minutes);
  const seconds = v.seconds == null ? void 0 : Math.trunc(v.seconds);
  const milliseconds = v.milliseconds == null ? void 0 : Math.trunc(v.milliseconds);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  if (seconds != null && (seconds < 0 || seconds > 59)) return null;
  if (milliseconds != null && (milliseconds < 0 || milliseconds > 999)) return null;
  const out = { hours, minutes };
  if (seconds != null) out.seconds = seconds;
  if (milliseconds != null) out.milliseconds = milliseconds;
  if (v.timezone != null) out.timezone = v.timezone;
  return out;
}
function timeFromDate(date) {
  if (!date || Number.isNaN(date.getTime())) return null;
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds()
  };
}
function dateFromTime(v) {
  if (!v) return null;
  return new Date(2e3, 0, 1, v.hours, v.minutes, v.seconds ?? 0, v.milliseconds ?? 0);
}
function coerceTime(v, format) {
  if (v == null) return null;
  if (v instanceof Date) return timeFromDate(v);
  if (typeof v === "string") {
    if (v.length === 0) return null;
    return parseTime(v, format);
  }
  return normalizeTime(v);
}
function parseDisplayTime(value, format, strict) {
  const parsed = parseTime(value, format);
  if (!parsed) return null;
  if (strict && formatTime(parsed, format) !== value.trim()) return null;
  return parsed;
}
function totalMilliseconds(v) {
  return ((v.hours * 60 + v.minutes) * 60 + (v.seconds ?? 0)) * 1e3 + (v.milliseconds ?? 0);
}
function clampToRange(v, min, max) {
  if (!v) return null;
  if (min && totalMilliseconds(v) < totalMilliseconds(min)) return { ...min };
  if (max && totalMilliseconds(v) > totalMilliseconds(max)) return { ...max };
  return v;
}
function resolveAnchorElement(anchor) {
  if (anchor === false || anchor == null || anchor === true) return null;
  if (typeof anchor === "string") {
    if (typeof document === "undefined") return null;
    return document.querySelector(anchor);
  }
  if (anchor instanceof HTMLElement) return anchor;
  return anchor.current ?? null;
}
const ArvoTimePicker = forwardRef(
  function ArvoTimePicker2({
    value,
    defaultValue,
    format,
    locale,
    interval = 15,
    minTime,
    maxTime,
    placeholder,
    label,
    contextHelp,
    variant = "default",
    size = "lg",
    surface: surfaceProp = "filled",
    width,
    isFullWidth = false,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isInvalid = false,
    errorMsg,
    errorDisplay = "inline",
    isLoading: isLoadingProp = false,
    isClearable = false,
    isAutoClose = true,
    isStrictParsing = false,
    isSegmented = true,
    anchor = false,
    placement = "bottom-end",
    popoverProps,
    onChange,
    onOpen,
    onClose,
    onBlur,
    className,
    id,
    style,
    ...rest
  }, ref) {
    const uid = useId();
    const tpId = id ?? `arvo-tp-${uid}`;
    const inputId = `${tpId}-input`;
    const labelId = `${tpId}-lbl`;
    const errorId = `${tpId}-err`;
    const popoverId = `${tpId}-popover`;
    const contextLocale = useArvoLocale();
    const effLocale = useMemo(
      () => getUserLocale(locale ?? contextLocale),
      [locale, contextLocale]
    );
    const effFormat = useMemo(
      () => format || getLocaleTimeFormat(effLocale),
      [format, effLocale]
    );
    const minResolved = useMemo(
      () => coerceTime(minTime, effFormat),
      [minTime, effFormat]
    );
    const maxResolved = useMemo(
      () => coerceTime(maxTime, effFormat),
      [maxTime, effFormat]
    );
    const isValueControlled = value !== void 0;
    const [committedValue, setCommittedValue] = useState(
      () => clampToRange(coerceTime(value ?? defaultValue ?? null, effFormat), minResolved, maxResolved)
    );
    const [errorOverride, setErrorOverride] = useState(null);
    const [loadingOverride, setLoadingOverride] = useState(null);
    const [isParentLoading, setIsParentLoading] = useState(false);
    const [hasTextSelected, setHasTextSelected] = useState(false);
    const [displayValue, setDisplayValue] = useState(
      () => committedValue ? formatTime(committedValue, effFormat) : ""
    );
    const [previewValue, setPreviewValue] = useState(null);
    const [caretTick, setCaretTick] = useState(0);
    const rootRef = useRef(null);
    const fieldRef = useRef(null);
    const inputRef = useRef(null);
    const actionsRef = useRef(null);
    const errIcoRef = useRef(null);
    const popoverRef = useRef(null);
    const controllerRef = useRef(null);
    const anchorElementRef = useRef(null);
    const committedValueRef = useRef(committedValue);
    const preFocusValueRef = useRef(null);
    const inputFocusedRef = useRef(false);
    const isOpenRef = useRef(false);
    const surfaceRef = useRef(null);
    const engineTriggerRef = useRef(null);
    useEffect(() => {
      committedValueRef.current = committedValue;
    }, [committedValue]);
    const isLoading = isLoadingProp === true;
    const effIsLoading = ((loadingOverride ?? isLoading) || isParentLoading) === true;
    const effError = errorOverride ?? (isInvalid ? errorMsg ?? null : null);
    const hasError = effError != null;
    const hasValue = committedValue != null;
    const showInlineAlert = hasError && errorDisplay === "inline" && effError != null;
    const showTooltipIcon = hasError && errorDisplay === "tooltip" && effError != null;
    useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon ? effError : void 0
    });
    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const updateParentLoading = () => {
        const loadingHost = root.closest('[data-arvo-loading="true"]');
        const ignoreHost = root.closest('[data-arvo-loading-ignore="true"]');
        setIsParentLoading(Boolean(loadingHost) && !ignoreHost);
      };
      updateParentLoading();
      const observer = new MutationObserver(updateParentLoading);
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-arvo-loading", "data-arvo-loading-ignore"]
      });
      return () => observer.disconnect();
    }, []);
    const isAnchorMode = anchor !== false && anchor != null;
    const isAnchorFallback = anchor === true;
    const warnedAnchorTrueRef = useRef(false);
    if (isAnchorFallback && !warnedAnchorTrueRef.current) {
      console.warn(
        "[ArvoTimePicker] anchor={true} requires a host element in React; falling back to input mode."
      );
      warnedAnchorTrueRef.current = true;
    }
    const useAnchorRender = isAnchorMode && !isAnchorFallback;
    const refreshDisplay = useCallback(() => {
      const ctrl = controllerRef.current;
      if (isSegmented && ctrl) {
        setDisplayValue(ctrl.getFormattedDisplay(inputFocusedRef.current));
        return;
      }
      setDisplayValue(
        committedValueRef.current ? formatTime(committedValueRef.current, effFormat) : ""
      );
    }, [isSegmented, effFormat]);
    const commitValue = useCallback(
      (next) => {
        var _a, _b, _c;
        const clamped = clampToRange(next, minResolved, maxResolved);
        if (sameTime(clamped, committedValueRef.current)) {
          (_a = controllerRef.current) == null ? void 0 : _a.setValue(dateFromTime(clamped), { silent: true });
          setPreviewValue(null);
          return false;
        }
        setPreviewValue(null);
        if (!isValueControlled) setCommittedValue(clamped);
        committedValueRef.current = clamped;
        (_b = controllerRef.current) == null ? void 0 : _b.setValue(dateFromTime(clamped), { silent: true });
        onChange == null ? void 0 : onChange({
          value: clamped,
          formattedValue: clamped ? formatTime(clamped, effFormat) : ""
        });
        (_c = rootRef.current) == null ? void 0 : _c.dispatchEvent(
          new CustomEvent("tp:change", {
            bubbles: true,
            detail: { value: clamped, formattedValue: clamped ? formatTime(clamped, effFormat) : "" }
          })
        );
        return true;
      },
      [isValueControlled, minResolved, maxResolved, onChange, effFormat]
    );
    useEffect(() => {
      var _a;
      if (!isSegmented) {
        (_a = controllerRef.current) == null ? void 0 : _a.destroy();
        controllerRef.current = null;
        refreshDisplay();
        return;
      }
      const ctrl = createSegmentController({
        format: effFormat,
        locale: effLocale,
        value: dateFromTime(committedValueRef.current),
        min: dateFromTime(minResolved),
        max: dateFromTime(maxResolved),
        commit: "blur",
        minuteInterval: interval
      });
      controllerRef.current = ctrl;
      const offCommit = ctrl.on("commit", (payload) => {
        const next = timeFromDate(payload.date);
        setPreviewValue(null);
        commitValue(next);
        refreshDisplay();
      });
      const offSegment = ctrl.on("segment", () => {
        setHasTextSelected(ctrl.getFocusedSegment() != null);
        setCaretTick((t) => t + 1);
      });
      const offChange = ctrl.on("change", () => {
        const next = timeFromDate(ctrl.getValue().date);
        setPreviewValue(clampToRange(next, minResolved, maxResolved));
        refreshDisplay();
      });
      refreshDisplay();
      return () => {
        offCommit();
        offSegment();
        offChange();
        ctrl.destroy();
        controllerRef.current = null;
      };
    }, [isSegmented, effFormat, effLocale, timeKey(minResolved), timeKey(maxResolved), interval]);
    useEffect(() => {
      var _a;
      if (!isValueControlled) return;
      const coerced = clampToRange(coerceTime(value, effFormat), minResolved, maxResolved);
      setCommittedValue(coerced);
      committedValueRef.current = coerced;
      setPreviewValue(null);
      (_a = controllerRef.current) == null ? void 0 : _a.setValue(dateFromTime(coerced), { silent: true });
      refreshDisplay();
    }, [value, effFormat, isValueControlled, timeKey(minResolved), timeKey(maxResolved)]);
    const handleProgrammaticOpen = useCallback(() => {
      var _a, _b;
      if (isOpenRef.current) return;
      if (isDisabled || effIsLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const evt = new CustomEvent("tp:open", { bubbles: true, cancelable: true });
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      (_b = surfaceRef.current) == null ? void 0 : _b.open();
    }, [isDisabled, effIsLoading, isReadOnly, onOpen]);
    const handleProgrammaticClose = useCallback(() => {
      var _a, _b;
      if (!isOpenRef.current) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const evt = new CustomEvent("tp:close", { bubbles: true, cancelable: true });
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      (_b = surfaceRef.current) == null ? void 0 : _b.close();
    }, [onClose]);
    const handleEngineClose = useCallback(() => {
      requestAnimationFrame(() => {
        const focusTarget = anchorElementRef.current ?? inputRef.current;
        focusTarget == null ? void 0 : focusTarget.focus({ preventScroll: true });
      });
    }, []);
    const handleTriggerClick = useCallback(() => {
      if (effIsLoading || isDisabled || isReadOnly) return;
      if (isOpenRef.current) handleProgrammaticClose();
      else handleProgrammaticOpen();
    }, [effIsLoading, isDisabled, isReadOnly, handleProgrammaticOpen, handleProgrammaticClose]);
    const doClear = useCallback(() => {
      var _a;
      (_a = controllerRef.current) == null ? void 0 : _a.setValue(null, { silent: true });
      const changed = commitValue(null);
      if (changed || committedValueRef.current == null) refreshDisplay();
    }, [commitValue, refreshDisplay]);
    const handleClearClick = useCallback(
      (e) => {
        e.stopPropagation();
        doClear();
      },
      [doClear]
    );
    const handleFreeTextChange = useCallback(
      (e) => setDisplayValue(e.target.value),
      []
    );
    const pendingClickOffsetRef = useRef(null);
    const handleInputMouseDown = useCallback(() => {
      const input = inputRef.current;
      if (!input) return;
      requestAnimationFrame(() => {
        if (document.activeElement !== input) return;
        pendingClickOffsetRef.current = input.selectionStart ?? null;
        const ctrl = controllerRef.current;
        if (!ctrl || !isSegmented) return;
        const offset = pendingClickOffsetRef.current;
        pendingClickOffsetRef.current = null;
        if (offset === null) return;
        const idx = ctrl.findSegmentForOffset(offset);
        if (idx !== null) ctrl.focusSegment(idx);
      });
    }, [isSegmented]);
    const handleInputFocus = useCallback(() => {
      inputFocusedRef.current = true;
      preFocusValueRef.current = committedValueRef.current;
      const ctrl = controllerRef.current;
      if (isSegmented && ctrl) {
        setDisplayValue(ctrl.getFormattedDisplay(true));
        ctrl.focusSegment(0);
      }
    }, [isSegmented]);
    const handleInputBlur = useCallback(() => {
      inputFocusedRef.current = false;
      const ctrl = controllerRef.current;
      if (isSegmented && ctrl) {
        setDisplayValue(ctrl.getFormattedDisplay(false));
        setPreviewValue(null);
      } else if (!isSegmented) {
        const parsed = parseDisplayTime(displayValue, effFormat, isStrictParsing);
        if (parsed) commitValue(parsed);
        refreshDisplay();
      }
      setHasTextSelected(false);
      onBlur == null ? void 0 : onBlur();
    }, [isSegmented, displayValue, effFormat, isStrictParsing, commitValue, refreshDisplay, onBlur]);
    const handleInputKeyDown = useCallback(
      (e) => {
        if (e.altKey && e.key === "ArrowDown") {
          e.preventDefault();
          if (!isOpenRef.current) handleProgrammaticOpen();
          return;
        }
        if (e.altKey && e.key === "ArrowUp") {
          e.preventDefault();
          if (isOpenRef.current) handleProgrammaticClose();
          return;
        }
        if (isSegmented) {
          const ctrl = controllerRef.current;
          if (!ctrl) return;
          const key = e.key;
          if (key === "Escape") {
            e.preventDefault();
            ctrl.handleKey({ key: "Escape" });
            if (inputFocusedRef.current) {
              setDisplayValue(ctrl.getFormattedDisplay(true));
              ctrl.focusSegment(0);
            } else {
              refreshDisplay();
            }
            setPreviewValue(null);
            if (isOpenRef.current) handleProgrammaticClose();
            return;
          }
          if (key === "Tab") {
            const res = ctrl.handleKey({ key: "Tab", shiftKey: e.shiftKey });
            if (res.consumed) e.preventDefault();
            return;
          }
          if (key === "Enter") {
            e.preventDefault();
            const before = committedValueRef.current;
            ctrl.handleKey({ key: "Enter" });
            const changed = !sameTime(before, committedValueRef.current);
            if (isOpenRef.current && isAutoClose && changed) handleProgrammaticClose();
            return;
          }
          if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown" || key === "Home" || key === "End" || key === "Backspace" || key === "Delete") {
            const res = ctrl.handleKey({ key });
            if (res.consumed) e.preventDefault();
            return;
          }
          if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
            if (/^[0-9]$/.test(key)) {
              const res = ctrl.handleDigit(key);
              if (res.consumed) e.preventDefault();
              return;
            }
            if (/^[A-Za-z]$/.test(key)) {
              const res = ctrl.handleLetter(key);
              if (res.consumed) e.preventDefault();
            }
          }
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const parsed = parseDisplayTime(displayValue, effFormat, isStrictParsing);
          if (parsed) {
            const changed = commitValue(parsed);
            if (isOpenRef.current && isAutoClose && changed) handleProgrammaticClose();
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (!sameTime(preFocusValueRef.current, committedValueRef.current)) {
            if (!isValueControlled) setCommittedValue(preFocusValueRef.current);
            committedValueRef.current = preFocusValueRef.current;
          }
          refreshDisplay();
          if (isOpenRef.current) handleProgrammaticClose();
        }
      },
      [isSegmented, isAutoClose, handleProgrammaticOpen, handleProgrammaticClose, displayValue, effFormat, isStrictParsing, commitValue, refreshDisplay, isValueControlled]
    );
    const handleInputPaste = useCallback(
      (e) => {
        const ctrl = controllerRef.current;
        if (!isSegmented || !ctrl) return;
        const res = ctrl.handlePaste(e.clipboardData.getData("text"));
        if (res.consumed) e.preventDefault();
      },
      [isSegmented]
    );
    const handleDropdownChange = useCallback(
      (next) => {
        var _a;
        const clamped = clampToRange(next, minResolved, maxResolved);
        (_a = controllerRef.current) == null ? void 0 : _a.setValue(dateFromTime(clamped), { silent: true });
        commitValue(clamped);
        refreshDisplay();
        if (isAutoClose) handleProgrammaticClose();
      },
      [minResolved, maxResolved, commitValue, refreshDisplay, isAutoClose, handleProgrammaticClose]
    );
    const getOrderedPopoverElements = useCallback(() => {
      const root = popoverRef.current;
      if (!root) return [];
      const timeItem = root.querySelector('[tabindex="0"]');
      return [timeItem];
    }, []);
    const surface = useOverlaySurface({
      type: "dropdown",
      priority: 20,
      triggerRef: engineTriggerRef,
      panelRef: popoverRef,
      onClose: handleEngineClose,
      placement,
      gap: (popoverProps == null ? void 0 : popoverProps.offset) ?? 4,
      focus: "trap",
      initialFocus: "none",
      // initial focus is set imperatively via the positioned effect
      getOrderedElements: getOrderedPopoverElements,
      returnFocus: false,
      // picker manages focus return in handleEngineClose
      closeOnOutside: true,
      closeOnEscape: false,
      // picker owns Escape (segment input)
      transition: "fade",
      transitionDuration: 150,
      haspopup: "dialog",
      controlsId: popoverId,
      emitStyle: true
    });
    const {
      isOpen,
      isMounted,
      positioned,
      panelStyle,
      panelSide,
      surfaceId: _surfaceId
    } = surface;
    surfaceRef.current = {
      open: surface.open,
      close: surface.close,
      setOpen: surface.setOpen
    };
    isOpenRef.current = isOpen;
    useLayoutEffect(() => {
      if (!useAnchorRender) {
        anchorElementRef.current = null;
        engineTriggerRef.current = fieldRef.current;
        return;
      }
      const el = resolveAnchorElement(anchor);
      anchorElementRef.current = el;
      engineTriggerRef.current = el;
      if (!el) return;
      const onClick = () => {
        if (isDisabled || effIsLoading || isReadOnly) return;
        if (isOpenRef.current) handleProgrammaticClose();
        else handleProgrammaticOpen();
      };
      const onKeyDown = (ev) => {
        if (ev.altKey && ev.key === "ArrowDown") {
          ev.preventDefault();
          if (!isOpenRef.current) handleProgrammaticOpen();
        } else if (ev.altKey && ev.key === "ArrowUp") {
          ev.preventDefault();
          if (isOpenRef.current) handleProgrammaticClose();
        } else if (ev.key === "Escape") {
          if (isOpenRef.current) {
            ev.preventDefault();
            handleProgrammaticClose();
          }
        } else if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          onClick();
        }
      };
      el.addEventListener("click", onClick);
      el.addEventListener("keydown", onKeyDown);
      return () => {
        el.removeEventListener("click", onClick);
        el.removeEventListener("keydown", onKeyDown);
      };
    }, [
      useAnchorRender,
      anchor,
      isDisabled,
      effIsLoading,
      isReadOnly,
      handleProgrammaticOpen,
      handleProgrammaticClose
    ]);
    useEffect(() => {
      if (useAnchorRender) return;
      engineTriggerRef.current = fieldRef.current;
    });
    useEffect(() => {
      if (useAnchorRender) return;
      const el = fieldRef.current;
      if (!el) return;
      el.removeAttribute("aria-haspopup");
      el.removeAttribute("aria-controls");
      el.removeAttribute("aria-expanded");
    });
    useEffect(() => {
      if (!isOpen || !positioned) return;
      const id2 = requestAnimationFrame(() => {
        var _a;
        const focusTarget = (_a = popoverRef.current) == null ? void 0 : _a.querySelector('[tabindex="0"]');
        focusTarget == null ? void 0 : focusTarget.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(id2);
    }, [isOpen, positioned]);
    useEffect(() => {
      if (effIsLoading && isOpen) handleProgrammaticClose();
    }, [effIsLoading, isOpen, handleProgrammaticClose]);
    useLayoutEffect(() => {
      if (!isSegmented) return;
      if (!inputFocusedRef.current) return;
      const ctrl = controllerRef.current;
      const input = inputRef.current;
      if (!ctrl || !input) return;
      const seg = ctrl.getFocusedSegment();
      if (!seg) return;
      try {
        input.setSelectionRange(seg.startOffset, seg.endOffset);
      } catch {
      }
    }, [caretTick, displayValue, isSegmented]);
    const updatePadding = useCallback(() => {
      if (!actionsRef.current || !fieldRef.current) return;
      const w = actionsRef.current.offsetWidth;
      fieldRef.current.style.setProperty("--arvo-form-input-pad-r", `${w > 0 ? w + 4 : 0}px`);
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
    useImperativeHandle(ref, () => {
      const NO_ARG = Symbol("NO_ARG");
      const handle = {
        open: () => handleProgrammaticOpen(),
        close: () => handleProgrammaticClose(),
        toggle: (force) => {
          var _a;
          const next = force === void 0 ? !isOpenRef.current : force;
          (_a = surfaceRef.current) == null ? void 0 : _a.setOpen(next);
        },
        value: ((v = NO_ARG) => {
          if (v === NO_ARG) return committedValueRef.current;
          const coerced = coerceTime(v, effFormat);
          commitValue(coerced);
          refreshDisplay();
          return void 0;
        }),
        formattedValue: () => committedValueRef.current ? formatTime(committedValueRef.current, effFormat) : "",
        clear: () => doClear(),
        disabled: ((state = NO_ARG) => {
          if (state === NO_ARG) return isDisabled;
          console.warn("[ArvoTimePicker] disabled() setter is a noop in React; pass isDisabled prop.");
          return void 0;
        }),
        setError: (message) => setErrorOverride(message === false ? null : message),
        setLoading: (loading) => {
          setLoadingOverride(loading);
          if (loading) handleProgrammaticClose();
        },
        focus: () => {
          var _a;
          (_a = anchorElementRef.current ?? inputRef.current) == null ? void 0 : _a.focus();
        },
        destroy: () => {
        }
      };
      return handle;
    }, [handleProgrammaticOpen, handleProgrammaticClose, effFormat, commitValue, isDisabled, refreshDisplay, doClear]);
    const classes = [
      "arvo-tp",
      `arvo-tp--${variant}`,
      `arvo-tp--${size}`,
      `arvo-tp--surface-${surfaceProp}`,
      isFullWidth && "arvo-tp--full-width",
      useAnchorRender && "arvo-tp--anchor-mode",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      hasError && "has-error",
      hasError && errorDisplay === "tooltip" && "error-tooltip",
      hasValue && "has-value",
      hasTextSelected && "has-text-selected",
      isOpen && "open",
      effIsLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const effectiveWidth = isFullWidth ? "100%" : width ?? void 0;
    const rootStyle = {
      ...style,
      ...effectiveWidth ? { "--arvo-form-input-width": effectiveWidth } : {}
    };
    const popoverStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      margin: 0,
      ...(popoverProps == null ? void 0 : popoverProps.width) ? { width: popoverProps.width } : {},
      ...panelStyle ?? {}
    };
    const popoverRootClass = [
      "arvo-tp",
      `arvo-tp--${variant}`,
      `arvo-tp--${size}`,
      effIsLoading && "loading"
    ].filter(Boolean).join(" ");
    const popover = isMounted ? createPortal(
      /* @__PURE__ */ jsx("div", { className: popoverRootClass, style: { display: "contents" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          ref: popoverRef,
          id: popoverId,
          className: "arvo-tp__popover",
          role: "dialog",
          "aria-label": "Choose a time",
          "aria-modal": false,
          "data-arvo-side": panelSide,
          style: popoverStyle,
          children: /* @__PURE__ */ jsx("div", { className: "arvo-tp__body", children: /* @__PURE__ */ jsx(
            ArvoTimeDropdown,
            {
              value: previewValue ?? committedValue,
              format: effFormat,
              locale: effLocale,
              interval,
              minTime: minResolved,
              maxTime: maxResolved,
              isDisabled: isDisabled || isReadOnly || effIsLoading,
              onChange: handleDropdownChange,
              onDismiss: handleProgrammaticClose
            }
          ) })
        }
      ) }),
      document.body
    ) : null;
    if (useAnchorRender) {
      return /* @__PURE__ */ jsx("div", { ...rest, ref: rootRef, id: tpId, className: classes, style: rootStyle, children: popover });
    }
    return /* @__PURE__ */ jsxs("div", { ...rest, ref: rootRef, id: tpId, className: classes, style: rootStyle, children: [
      label && /* @__PURE__ */ jsx(
        ArvoFormLabel,
        {
          htmlFor: inputId,
          id: labelId,
          isRequired,
          isDisabled,
          isInvalid: hasError,
          contextHelp,
          className: "arvo-tp__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxs("div", { ref: fieldRef, className: "arvo-tp__field", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            id: inputId,
            type: "text",
            className: "arvo-tp__input",
            role: "combobox",
            value: displayValue,
            placeholder: placeholder ?? void 0,
            disabled: isDisabled,
            readOnly: isReadOnly || isSegmented,
            autoComplete: "off",
            "aria-haspopup": "dialog",
            "aria-expanded": isOpen,
            "aria-controls": popoverId,
            "aria-required": isRequired || void 0,
            "aria-invalid": isInvalid || hasError || void 0,
            "aria-disabled": isDisabled || void 0,
            "aria-busy": effIsLoading || void 0,
            "aria-labelledby": label ? labelId : void 0,
            "aria-describedby": showInlineAlert ? errorId : void 0,
            onKeyDown: handleInputKeyDown,
            onFocus: handleInputFocus,
            onBlur: handleInputBlur,
            onMouseDown: isSegmented ? handleInputMouseDown : void 0,
            onPaste: isSegmented ? handleInputPaste : void 0,
            onChange: isSegmented ? void 0 : handleFreeTextChange
          }
        ),
        /* @__PURE__ */ (() => {
          const showClear = isClearable && hasValue && !isDisabled && !isReadOnly && !effIsLoading && !showTooltipIcon;
          const showSep = !effIsLoading && (showClear || showTooltipIcon);
          return /* @__PURE__ */ jsxs("div", { ref: actionsRef, className: "arvo-tp__actions", children: [
            showClear && /* @__PURE__ */ jsx(
              ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "close",
                tooltip: "Clear",
                tabIndex: -1,
                onClick: handleClearClick,
                className: "arvo-tp__clear-btn"
              }
            ),
            showTooltipIcon && /* @__PURE__ */ jsx(
              ArvoMessageAlert,
              {
                ref: errIcoRef,
                type: "negative",
                isInline: true,
                message: effError ?? "",
                className: "arvo-tp__err-ico"
              }
            ),
            showSep && /* @__PURE__ */ jsx("span", { className: "arvo-tp__sep", "aria-hidden": "true" }),
            !effIsLoading && /* @__PURE__ */ jsx(
              ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "clock-o",
                tooltip: "Select time",
                isDisabled: isDisabled || isReadOnly,
                isSelected: isOpen,
                onClick: handleTriggerClick,
                className: "arvo-tp__trigger-btn",
                "aria-haspopup": "dialog",
                "aria-expanded": isOpen,
                "aria-controls": popoverId
              }
            )
          ] });
        })(),
        /* @__PURE__ */ jsx("div", { className: "arvo-tp__border" })
      ] }),
      showInlineAlert && /* @__PURE__ */ jsx(
        ArvoMessageAlert,
        {
          type: "negative",
          id: errorId,
          message: effError,
          className: "arvo-tp__err-msg"
        }
      ),
      popover
    ] });
  }
);
ArvoTimePicker.displayName = "ArvoTimePicker";
export {
  ArvoTimePicker,
  ArvoTimePicker as default
};
//# sourceMappingURL=index81.js.map
