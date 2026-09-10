import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useMemo, useState, useRef, useEffect, useCallback, useLayoutEffect, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { getUserLocale, getLocaleDateFormat, getLocaleTimeFormat, splitDateTimeFormat, pickAnchorDate, formatDateTime, createSegmentController, parseDateTime, addMonths, parseTime, isSameDay } from "@arvo/core";
import { useOverlaySurface } from "./index92.js";
import { useArvoLocale } from "./index11.js";
import { ArvoIconButton } from "./index17.js";
import { ArvoFormLabel } from "./index12.js";
import { ArvoMessageAlert } from "./index13.js";
import ArvoCalendar from "./index78.js";
import { ArvoTimeDropdown } from "./index83.js";
import { CalendarNav } from "./index101.js";
const ZERO_TIME = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
function coerceDateTime(v, format, locale) {
  if (v == null) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string") {
    if (v.length === 0) return null;
    return parseDateTime(v, format, locale);
  }
  return null;
}
function normalizeTime(v) {
  const hours = Math.trunc(v.hours);
  const minutes = Math.trunc(v.minutes);
  const seconds = v.seconds == null ? 0 : Math.trunc(v.seconds);
  const milliseconds = v.milliseconds == null ? 0 : Math.trunc(v.milliseconds);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;
  if (milliseconds < 0 || milliseconds > 999) return null;
  return { hours, minutes, seconds, milliseconds };
}
function coerceTime(v, timeFormat) {
  if (v == null) return null;
  if (typeof v === "string") {
    if (v.length === 0) return null;
    return parseTime(v, timeFormat);
  }
  return normalizeTime(v);
}
function sameInstant(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.getTime() === b.getTime();
}
function getTimePart(d) {
  if (!d || Number.isNaN(d.getTime())) return null;
  return {
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: d.getMilliseconds()
  };
}
function mergeDateAndTime(d, t) {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    t.hours,
    t.minutes,
    t.seconds ?? 0,
    t.milliseconds ?? 0
  );
}
function dayOf(d) {
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function totalMillis(t) {
  return ((t.hours * 60 + t.minutes) * 60 + (t.seconds ?? 0)) * 1e3 + (t.milliseconds ?? 0);
}
function laterTime(a, b) {
  if (!a) return b;
  if (!b) return a;
  return totalMillis(a) >= totalMillis(b) ? a : b;
}
function earlierTime(a, b) {
  if (!a) return b;
  if (!b) return a;
  return totalMillis(a) <= totalMillis(b) ? a : b;
}
function getEffectiveMinTimeForDate(date, min, startTime) {
  const onMinDay = date && min && isSameDay(date, min);
  const minPart = onMinDay ? getTimePart(min) : null;
  return laterTime(minPart, startTime);
}
function getEffectiveMaxTimeForDate(date, max, endTime) {
  const onMaxDay = date && max && isSameDay(date, max);
  const maxPart = onMaxDay ? getTimePart(max) : null;
  return earlierTime(maxPart, endTime);
}
function clampToBounds(v, min, max, startTime, endTime) {
  if (!v) return null;
  let result = new Date(v.getTime());
  if (min && result.getTime() < min.getTime()) result = new Date(min.getTime());
  if (max && result.getTime() > max.getTime()) result = new Date(max.getTime());
  const effMin = getEffectiveMinTimeForDate(result, min, startTime);
  const effMax = getEffectiveMaxTimeForDate(result, max, endTime);
  const tPart = getTimePart(result);
  if (effMin && tPart && totalMillis(tPart) < totalMillis(effMin)) {
    result = mergeDateAndTime(result, effMin);
  }
  if (effMax && tPart && totalMillis(tPart) > totalMillis(effMax)) {
    result = mergeDateAndTime(result, effMax);
  }
  if (min && result.getTime() < min.getTime()) result = new Date(min.getTime());
  if (max && result.getTime() > max.getTime()) result = new Date(max.getTime());
  return result;
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
const ArvoDateTimePicker = forwardRef(
  function ArvoDateTimePicker2({
    value,
    defaultValue,
    format,
    locale,
    weekStart = 0,
    hasWeeks = false,
    interval = 15,
    min,
    max,
    startTime,
    endTime,
    placeholder,
    label,
    contextHelp,
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
    isAutoClose = false,
    // NOTE: defaults FALSE for DateTimePicker
    // _isStrictParsing: prop accepted for parity with the JS engine; the v1
    // parseDateTime() core has no strict flag yet (planned).
    isStrictParsing: _isStrictParsing = false,
    isSegmented = true,
    anchor = false,
    placement = "bottom-end",
    calendarProps,
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
    const dtpId = id ?? `arvo-dtp-${uid}`;
    const inputId = `${dtpId}-input`;
    const labelId = `${dtpId}-lbl`;
    const errorId = `${dtpId}-err`;
    const popoverId = `${dtpId}-popover`;
    const contextLocale = useArvoLocale();
    const effLocale = useMemo(
      () => getUserLocale(locale ?? contextLocale),
      [locale, contextLocale]
    );
    const effFormat = useMemo(
      () => format && format.length > 0 ? format : `${getLocaleDateFormat(effLocale)} ${getLocaleTimeFormat(effLocale)}`,
      [format, effLocale]
    );
    const timeFormat = useMemo(() => {
      const split = splitDateTimeFormat(effFormat);
      return split.timePart && split.timePart.length > 0 ? split.timePart : getLocaleTimeFormat(effLocale);
    }, [effFormat, effLocale]);
    const minResolved = useMemo(
      () => coerceDateTime(min, effFormat, effLocale),
      [min, effFormat, effLocale]
    );
    const maxResolved = useMemo(
      () => coerceDateTime(max, effFormat, effLocale),
      [max, effFormat, effLocale]
    );
    const startTimeResolved = useMemo(
      () => coerceTime(startTime, timeFormat),
      [startTime, timeFormat]
    );
    const endTimeResolved = useMemo(
      () => coerceTime(endTime, timeFormat),
      [endTime, timeFormat]
    );
    const minDate = useMemo(() => dayOf(minResolved), [minResolved]);
    const maxDate = useMemo(() => dayOf(maxResolved), [maxResolved]);
    const isValueControlled = value !== void 0;
    const [committedValue, setCommittedValue] = useState(
      () => clampToBounds(
        coerceDateTime(value ?? defaultValue ?? null, effFormat, effLocale),
        minResolved,
        maxResolved,
        startTimeResolved,
        endTimeResolved
      )
    );
    const initialVisible = useMemo(() => {
      const base = pickAnchorDate(committedValue, minDate, maxDate);
      return { year: base.getFullYear(), month: base.getMonth() };
    }, []);
    const [visibleYear, setVisibleYear] = useState(initialVisible.year);
    const [visibleMonth, setVisibleMonth] = useState(initialVisible.month);
    const [viewMode, setViewMode] = useState("days");
    const [errorOverride, setErrorOverride] = useState(null);
    const [loadingOverride, setLoadingOverride] = useState(null);
    const [hasTextSelected, setHasTextSelected] = useState(false);
    const [previewValue, setPreviewValue] = useState(null);
    const [displayValue, setDisplayValue] = useState(
      () => committedValue ? formatDateTime(committedValue, effFormat, effLocale) : ""
    );
    const [caretTick, setCaretTick] = useState(0);
    const rootRef = useRef(null);
    const fieldRef = useRef(null);
    const inputRef = useRef(null);
    const actionsRef = useRef(null);
    const popoverRef = useRef(null);
    const calendarRef = useRef(null);
    const controllerRef = useRef(null);
    const anchorElementRef = useRef(null);
    const preFocusValueRef = useRef(null);
    const inputFocusedRef = useRef(false);
    const committedValueRef = useRef(committedValue);
    useEffect(() => {
      committedValueRef.current = committedValue;
    }, [committedValue]);
    const isOpenRef = useRef(false);
    const surfaceRef = useRef(null);
    const engineTriggerRef = useRef(null);
    const dateTouchedRef = useRef(false);
    const timeTouchedRef = useRef(false);
    const isLoading = isLoadingProp === true;
    const effIsDisabled = isDisabled;
    const effIsLoading = (loadingOverride ?? isLoading) === true;
    const effError = errorOverride ?? (isInvalid ? errorMsg ?? null : null);
    const hasError = effError != null;
    const hasValue = committedValue != null;
    const isAnchorMode = anchor !== false && anchor != null;
    const isAnchorFallback = anchor === true;
    const warnedAnchorTrueRef = useRef(false);
    if (isAnchorFallback && !warnedAnchorTrueRef.current) {
      console.warn(
        "[ArvoDateTimePicker] anchor={true} requires a host element in React; falling back to input mode."
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
        committedValueRef.current ? formatDateTime(committedValueRef.current, effFormat, effLocale) : ""
      );
    }, [isSegmented, effFormat, effLocale]);
    const commitValue = useCallback(
      (next) => {
        var _a;
        const clamped = clampToBounds(
          next,
          minResolved,
          maxResolved,
          startTimeResolved,
          endTimeResolved
        );
        setPreviewValue(null);
        if (sameInstant(clamped, committedValueRef.current)) return false;
        if (!isValueControlled) setCommittedValue(clamped);
        committedValueRef.current = clamped;
        const formattedValue = clamped ? formatDateTime(clamped, effFormat, effLocale) : "";
        onChange == null ? void 0 : onChange({ value: clamped, formattedValue });
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("dtp:change", {
            bubbles: true,
            detail: { value: clamped, formattedValue }
          })
        );
        return true;
      },
      [
        isValueControlled,
        minResolved,
        maxResolved,
        startTimeResolved,
        endTimeResolved,
        onChange,
        effFormat,
        effLocale
      ]
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
        value: committedValueRef.current,
        min: minResolved,
        max: maxResolved,
        commit: "blur",
        minuteInterval: interval
      });
      controllerRef.current = ctrl;
      const offCommit = ctrl.on("commit", (payload) => {
        const next = payload.date;
        setPreviewValue(null);
        commitValue(next);
        refreshDisplay();
      });
      const offSegment = ctrl.on("segment", () => {
        setHasTextSelected(ctrl.getFocusedSegment() != null);
        setCaretTick((t) => t + 1);
      });
      const offChange = ctrl.on("change", () => {
        const next = ctrl.getValue().date;
        if (next) {
          setPreviewValue(
            clampToBounds(
              next,
              minResolved,
              maxResolved,
              startTimeResolved,
              endTimeResolved
            )
          );
        } else {
          setPreviewValue(null);
        }
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
    }, [
      isSegmented,
      effFormat,
      effLocale,
      minResolved == null ? void 0 : minResolved.getTime(),
      maxResolved == null ? void 0 : maxResolved.getTime(),
      interval
    ]);
    useEffect(() => {
      var _a;
      if (!isValueControlled) return;
      const coerced = clampToBounds(
        coerceDateTime(value, effFormat, effLocale),
        minResolved,
        maxResolved,
        startTimeResolved,
        endTimeResolved
      );
      setCommittedValue(coerced);
      committedValueRef.current = coerced;
      setPreviewValue(null);
      (_a = controllerRef.current) == null ? void 0 : _a.setValue(coerced, { silent: true });
      refreshDisplay();
    }, [value, effFormat, effLocale, isValueControlled]);
    const liveValue = previewValue ?? committedValue;
    const liveDate = liveValue ?? new Date(visibleYear, visibleMonth, 1);
    const timeDropdownValue = getTimePart(liveValue);
    const tdMinTime = getEffectiveMinTimeForDate(liveDate, minResolved, startTimeResolved);
    const tdMaxTime = getEffectiveMaxTimeForDate(liveDate, maxResolved, endTimeResolved);
    useEffect(() => {
      const target = liveValue;
      if (!target) return;
      if (target.getFullYear() === visibleYear && target.getMonth() === visibleMonth) {
        return;
      }
      setVisibleYear(target.getFullYear());
      setVisibleMonth(target.getMonth());
    }, [liveValue == null ? void 0 : liveValue.getTime()]);
    const handleProgrammaticOpen = useCallback(() => {
      var _a, _b;
      if (isOpenRef.current) return;
      if (effIsDisabled || effIsLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const evt = new CustomEvent("dtp:open", { bubbles: true, cancelable: true });
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      const center = pickAnchorDate(committedValueRef.current, minDate, maxDate);
      setVisibleYear(center.getFullYear());
      setVisibleMonth(center.getMonth());
      setViewMode("days");
      dateTouchedRef.current = false;
      timeTouchedRef.current = false;
      (_b = surfaceRef.current) == null ? void 0 : _b.open();
    }, [effIsDisabled, effIsLoading, isReadOnly, minDate, maxDate, onOpen]);
    const handleProgrammaticClose = useCallback(() => {
      var _a, _b;
      if (!isOpenRef.current) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const evt = new CustomEvent("dtp:close", { bubbles: true, cancelable: true });
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
    useEffect(() => {
      if (effIsLoading && isOpenRef.current) handleProgrammaticClose();
    }, [effIsLoading, handleProgrammaticClose]);
    const handleTriggerClick = useCallback(() => {
      if (effIsLoading) return;
      if (effIsDisabled || isReadOnly) return;
      if (isOpenRef.current) handleProgrammaticClose();
      else handleProgrammaticOpen();
    }, [effIsLoading, effIsDisabled, isReadOnly, handleProgrammaticOpen, handleProgrammaticClose]);
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
      (e) => {
        setDisplayValue(e.target.value);
      },
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
        const parsed = parseDateTime(displayValue, effFormat, effLocale);
        if (parsed) commitValue(parsed);
        refreshDisplay();
      }
      setHasTextSelected(false);
      onBlur == null ? void 0 : onBlur();
    }, [isSegmented, displayValue, effFormat, effLocale, commitValue, refreshDisplay, onBlur]);
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
            const changed = !sameInstant(before, committedValueRef.current);
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
              return;
            }
          }
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const parsed = parseDateTime(displayValue, effFormat, effLocale);
          if (parsed) {
            const before = committedValueRef.current;
            const changed = commitValue(parsed);
            if (isOpenRef.current && isAutoClose && changed && !sameInstant(before, committedValueRef.current)) {
              handleProgrammaticClose();
            }
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (preFocusValueRef.current !== committedValueRef.current) {
            if (!isValueControlled) setCommittedValue(preFocusValueRef.current);
            committedValueRef.current = preFocusValueRef.current;
          }
          refreshDisplay();
          if (isOpenRef.current) handleProgrammaticClose();
        }
      },
      [
        isSegmented,
        isAutoClose,
        handleProgrammaticOpen,
        handleProgrammaticClose,
        displayValue,
        effFormat,
        effLocale,
        commitValue,
        refreshDisplay,
        isValueControlled
      ]
    );
    const handleInputPaste = useCallback(
      (e) => {
        const ctrl = controllerRef.current;
        if (!isSegmented || !ctrl) return;
        const text = e.clipboardData.getData("text");
        const res = ctrl.handlePaste(text);
        if (res.consumed) e.preventDefault();
      },
      [isSegmented]
    );
    const handleCalendarCellSelect = useCallback(
      (payload) => {
        var _a;
        const { date, mode } = payload;
        if (!date) return;
        if (mode === "days") {
          const currentTime = getTimePart(committedValueRef.current) ?? startTimeResolved ?? ZERO_TIME;
          const merged = mergeDateAndTime(date, currentTime);
          const clamped = clampToBounds(
            merged,
            minResolved,
            maxResolved,
            startTimeResolved,
            endTimeResolved
          );
          if (clamped) {
            (_a = controllerRef.current) == null ? void 0 : _a.setValue(clamped, { silent: true });
            commitValue(clamped);
            refreshDisplay();
          }
          dateTouchedRef.current = true;
          if (isAutoClose && timeTouchedRef.current) handleProgrammaticClose();
          return;
        }
        setVisibleYear(date.getFullYear());
        setVisibleMonth(date.getMonth());
        if (mode === "months") setViewMode("days");
        else if (mode === "years") setViewMode("months");
      },
      [
        minResolved,
        maxResolved,
        startTimeResolved,
        endTimeResolved,
        commitValue,
        refreshDisplay,
        isAutoClose,
        handleProgrammaticClose
      ]
    );
    const handleTimeChange = useCallback(
      (time) => {
        var _a;
        const baseDate = committedValueRef.current ?? /* @__PURE__ */ new Date();
        const merged = mergeDateAndTime(baseDate, time);
        const clamped = clampToBounds(
          merged,
          minResolved,
          maxResolved,
          startTimeResolved,
          endTimeResolved
        );
        if (clamped) {
          (_a = controllerRef.current) == null ? void 0 : _a.setValue(clamped, { silent: true });
          commitValue(clamped);
          refreshDisplay();
        }
        timeTouchedRef.current = true;
        if (isAutoClose && dateTouchedRef.current) handleProgrammaticClose();
      },
      [
        minResolved,
        maxResolved,
        startTimeResolved,
        endTimeResolved,
        commitValue,
        refreshDisplay,
        isAutoClose,
        handleProgrammaticClose
      ]
    );
    const handleHeaderPrev = useCallback(() => {
      if (viewMode === "days") {
        const next = addMonths(new Date(visibleYear, visibleMonth, 1), -1);
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      } else if (viewMode === "months") {
        setVisibleYear((y) => y - 1);
      } else {
        setVisibleYear((y) => y - 10);
      }
    }, [viewMode, visibleYear, visibleMonth]);
    const handleHeaderNext = useCallback(() => {
      if (viewMode === "days") {
        const next = addMonths(new Date(visibleYear, visibleMonth, 1), 1);
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      } else if (viewMode === "months") {
        setVisibleYear((y) => y + 1);
      } else {
        setVisibleYear((y) => y + 10);
      }
    }, [viewMode, visibleYear, visibleMonth]);
    const handleHeaderToday = useCallback(() => {
      const today = /* @__PURE__ */ new Date();
      setVisibleYear(today.getFullYear());
      setVisibleMonth(today.getMonth());
    }, []);
    const getOrderedPopoverElements = useCallback(() => {
      const root = popoverRef.current;
      if (!root) return [];
      const calendarCell = root.querySelector(
        '.arvo-cal__cell[tabindex="0"]'
      );
      const timeOption = root.querySelector(
        '.arvo-tdrop__opt[tabindex="0"]'
      );
      const prev = root.querySelector(".arvo-cal-nav__prev");
      const monthBtn = root.querySelector(".arvo-cal-nav__month-btn");
      const yearBtn = root.querySelector(".arvo-cal-nav__year-btn");
      const next = root.querySelector(".arvo-cal-nav__next");
      const today = root.querySelector(".arvo-cal-nav__today");
      return [calendarCell, timeOption, prev, monthBtn, yearBtn, next, today];
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
      // picker owns Escape (segment input + calendar)
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
        if (effIsDisabled || effIsLoading || isReadOnly) return;
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
      effIsDisabled,
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
      const target = pickAnchorDate(committedValueRef.current, minDate, maxDate);
      const id2 = requestAnimationFrame(() => {
        var _a;
        (_a = calendarRef.current) == null ? void 0 : _a.focusCell(target);
      });
      return () => cancelAnimationFrame(id2);
    }, [isOpen, positioned, minDate, maxDate]);
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
    useImperativeHandle(
      ref,
      () => {
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
            var _a;
            if (v === NO_ARG) {
              return committedValueRef.current;
            }
            const coerced = coerceDateTime(
              v,
              effFormat,
              effLocale
            );
            const clamped = clampToBounds(
              coerced,
              minResolved,
              maxResolved,
              startTimeResolved,
              endTimeResolved
            );
            (_a = controllerRef.current) == null ? void 0 : _a.setValue(clamped, { silent: true });
            commitValue(clamped);
            refreshDisplay();
            return void 0;
          }),
          formattedValue: () => committedValueRef.current ? formatDateTime(committedValueRef.current, effFormat, effLocale) : "",
          clear: () => doClear(),
          disabled: ((state = NO_ARG) => {
            if (state === NO_ARG) {
              return effIsDisabled;
            }
            console.warn(
              "[ArvoDateTimePicker] disabled() setter is a noop in React; pass isDisabled prop."
            );
            return void 0;
          }),
          setError: (message) => {
            setErrorOverride(message === false ? null : message);
          },
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
      },
      [
        effIsDisabled,
        effFormat,
        effLocale,
        handleProgrammaticOpen,
        handleProgrammaticClose,
        isValueControlled,
        minResolved,
        maxResolved,
        startTimeResolved,
        endTimeResolved,
        onChange,
        refreshDisplay,
        commitValue,
        doClear
      ]
    );
    const classes = [
      "arvo-dtp",
      `arvo-dtp--${size}`,
      `arvo-dtp--surface-${surfaceProp}`,
      isFullWidth && "arvo-dtp--full-width",
      hasWeeks && "arvo-dtp--show-weeks",
      useAnchorRender && "arvo-dtp--anchor-mode",
      effIsDisabled && "is-disabled",
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
    const showInlineAlert = hasError && errorDisplay === "inline" && effError != null;
    const showTooltipIcon = hasError && errorDisplay === "tooltip" && effError != null;
    const popoverRootClass = [
      "arvo-dtp",
      `arvo-dtp--${size}`,
      isFullWidth && "arvo-dtp--full-width",
      hasWeeks && "arvo-dtp--show-weeks",
      effIsLoading && "loading"
    ].filter(Boolean).join(" ");
    const popover = isMounted ? createPortal(
      /* @__PURE__ */ jsx("div", { className: popoverRootClass, style: { display: "contents" }, children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: popoverRef,
          id: popoverId,
          className: "arvo-dtp__popover",
          role: "dialog",
          "aria-label": "Choose a date and time",
          "aria-modal": false,
          "data-arvo-side": panelSide,
          style: popoverStyle,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "arvo-dtp__cal", children: [
              /* @__PURE__ */ jsx("div", { className: "arvo-dtp__header", children: /* @__PURE__ */ jsx(
                CalendarNav,
                {
                  visibleYear,
                  visibleMonth,
                  viewMode: viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days",
                  locale: effLocale,
                  minDate,
                  maxDate,
                  isDisabled: effIsDisabled,
                  onPrev: handleHeaderPrev,
                  onNext: handleHeaderNext,
                  onToday: handleHeaderToday,
                  onMonthButtonClick: () => setViewMode(viewMode === "months" ? "days" : "months"),
                  onYearButtonClick: () => setViewMode(viewMode === "years" ? "days" : "years")
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "arvo-dtp__cal-grid", children: /* @__PURE__ */ jsx(
                ArvoCalendar,
                {
                  ...calendarProps,
                  ref: calendarRef,
                  visibleYear,
                  visibleMonth,
                  viewMode,
                  locale: effLocale,
                  weekStart,
                  hasWeeks,
                  selectedDate: liveValue,
                  minDate,
                  maxDate,
                  onCellSelect: handleCalendarCellSelect,
                  onMonthChange: (p) => {
                    setVisibleYear(p.year);
                    setVisibleMonth(p.month);
                  },
                  onViewModeChange: (p) => setViewMode(p.mode),
                  onDismiss: handleProgrammaticClose
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "arvo-dtp__time", children: /* @__PURE__ */ jsx(
              ArvoTimeDropdown,
              {
                value: timeDropdownValue,
                format: timeFormat,
                locale: effLocale,
                interval,
                minTime: tdMinTime,
                maxTime: tdMaxTime,
                isDisabled: effIsDisabled || isReadOnly || effIsLoading,
                onChange: handleTimeChange,
                onDismiss: handleProgrammaticClose
              }
            ) })
          ]
        }
      ) }),
      document.body
    ) : null;
    if (useAnchorRender) {
      return /* @__PURE__ */ jsx("div", { ...rest, ref: rootRef, id: dtpId, className: classes, style: rootStyle, children: popover });
    }
    return /* @__PURE__ */ jsxs("div", { ...rest, ref: rootRef, id: dtpId, className: classes, style: rootStyle, children: [
      label && /* @__PURE__ */ jsx(
        ArvoFormLabel,
        {
          htmlFor: inputId,
          id: labelId,
          isRequired,
          isDisabled: effIsDisabled,
          isInvalid: hasError,
          contextHelp,
          className: "arvo-dtp__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxs("div", { ref: fieldRef, className: "arvo-dtp__field", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            id: inputId,
            type: "text",
            className: "arvo-dtp__input",
            role: "combobox",
            value: displayValue,
            placeholder: placeholder ?? void 0,
            disabled: effIsDisabled,
            readOnly: isReadOnly || isSegmented,
            autoComplete: "off",
            "aria-haspopup": "dialog",
            "aria-expanded": isOpen,
            "aria-controls": popoverId,
            "aria-required": isRequired || void 0,
            "aria-invalid": isInvalid || hasError || void 0,
            "aria-disabled": effIsDisabled || void 0,
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
          const showClear = isClearable && hasValue && !effIsDisabled && !isReadOnly && !effIsLoading && !showTooltipIcon;
          const showSep = !effIsLoading && (showClear || showTooltipIcon);
          return /* @__PURE__ */ jsxs("div", { ref: actionsRef, className: "arvo-dtp__actions", children: [
            showClear && /* @__PURE__ */ jsx(
              ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "close",
                tooltip: "Clear",
                tabIndex: -1,
                onClick: handleClearClick,
                className: "arvo-dtp__clear-btn"
              }
            ),
            showTooltipIcon && /* @__PURE__ */ jsx(
              ArvoMessageAlert,
              {
                type: "negative",
                isInline: true,
                message: effError ?? "",
                className: "arvo-dtp__err-ico"
              }
            ),
            showSep && /* @__PURE__ */ jsx("span", { className: "arvo-dtp__sep", "aria-hidden": "true" }),
            !effIsLoading && /* @__PURE__ */ jsx(
              ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "calendar-o",
                tooltip: "Select date and time",
                isDisabled: effIsDisabled || isReadOnly,
                isSelected: isOpen,
                onClick: handleTriggerClick,
                className: "arvo-dtp__trigger-btn",
                "aria-haspopup": "dialog",
                "aria-expanded": isOpen,
                "aria-controls": popoverId
              }
            )
          ] });
        })(),
        /* @__PURE__ */ jsx("div", { className: "arvo-dtp__border" })
      ] }),
      showInlineAlert && /* @__PURE__ */ jsx(
        ArvoMessageAlert,
        {
          type: "negative",
          id: errorId,
          message: effError,
          className: "arvo-dtp__err-msg"
        }
      ),
      popover
    ] });
  }
);
ArvoDateTimePicker.displayName = "ArvoDateTimePicker";
export {
  ArvoDateTimePicker,
  ArvoDateTimePicker as default
};
//# sourceMappingURL=index80.js.map
