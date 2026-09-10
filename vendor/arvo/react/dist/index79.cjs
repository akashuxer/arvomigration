"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const core = require("@arvo/core");
const useOverlaySurface = require("./index92.cjs");
const useArvoLocale = require("./index11.cjs");
const IconButton = require("./index17.cjs");
const FormLabel = require("./index12.cjs");
const MessageAlert = require("./index13.cjs");
const Calendar = require("./index78.cjs");
const CalendarNav = require("./index101.cjs");
function coerceDate(v, format, locale) {
  if (v == null) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string") {
    if (v.length === 0) return null;
    return core.parseDate(v, format, locale);
  }
  return null;
}
function sameDay(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return core.isSameDay(a, b);
}
function clampToRange(v, min, max) {
  if (v == null) return null;
  if (min && v.getTime() < min.getTime()) return new Date(min.getTime());
  if (max && v.getTime() > max.getTime()) return new Date(max.getTime());
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
const ArvoDatePicker = React.forwardRef(
  function ArvoDatePicker2({
    value,
    defaultValue,
    format,
    locale,
    weekStart = 0,
    hasWeeks = false,
    minDate,
    maxDate,
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
    isAutoClose = true,
    isStrictParsing = false,
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
    id
  }, ref) {
    const uid = React.useId();
    const dpId = id ?? `arvo-dp-${uid}`;
    const inputId = `${dpId}-input`;
    const labelId = `${dpId}-lbl`;
    const errorId = `${dpId}-err`;
    const popoverId = `${dpId}-popover`;
    const contextLocale = useArvoLocale.useArvoLocale();
    const effLocale = React.useMemo(
      () => core.getUserLocale(locale ?? contextLocale),
      [locale, contextLocale]
    );
    const effFormat = React.useMemo(
      () => format || core.getLocaleDateFormat(effLocale),
      [format, effLocale]
    );
    const minDateResolved = React.useMemo(
      () => coerceDate(minDate, effFormat, effLocale),
      [minDate, effFormat, effLocale]
    );
    const maxDateResolved = React.useMemo(
      () => coerceDate(maxDate, effFormat, effLocale),
      [maxDate, effFormat, effLocale]
    );
    const isValueControlled = value !== void 0;
    const [committedValue, setCommittedValue] = React.useState(
      () => coerceDate(value ?? defaultValue ?? null, effFormat, effLocale)
    );
    const initialVisible = React.useMemo(() => {
      const base = core.pickAnchorDate(committedValue, minDateResolved, maxDateResolved);
      return { year: base.getFullYear(), month: base.getMonth() };
    }, []);
    const [visibleYear, setVisibleYear] = React.useState(initialVisible.year);
    const [visibleMonth, setVisibleMonth] = React.useState(initialVisible.month);
    const [viewMode, setViewMode] = React.useState("days");
    const [errorOverride, setErrorOverride] = React.useState(null);
    const [loadingOverride, setLoadingOverride] = React.useState(null);
    const [hasTextSelected, setHasTextSelected] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState(
      () => committedValue ? core.formatDate(committedValue, effFormat, effLocale) : ""
    );
    const [caretTick, setCaretTick] = React.useState(0);
    const rootRef = React.useRef(null);
    const fieldRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const actionsRef = React.useRef(null);
    const popoverRef = React.useRef(null);
    const calendarRef = React.useRef(null);
    const controllerRef = React.useRef(null);
    const anchorElementRef = React.useRef(null);
    const preFocusValueRef = React.useRef(null);
    const inputFocusedRef = React.useRef(false);
    const committedValueRef = React.useRef(committedValue);
    React.useEffect(() => {
      committedValueRef.current = committedValue;
    }, [committedValue]);
    const isOpenRef = React.useRef(false);
    const surfaceRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const effIsDisabled = isDisabled;
    const effIsLoading = (loadingOverride ?? isLoading) === true;
    const effError = errorOverride ?? (isInvalid ? errorMsg ?? null : null);
    const hasError = effError != null;
    const hasValue = committedValue != null;
    const isAnchorMode = anchor !== false && anchor != null;
    const isAnchorFallback = anchor === true;
    const warnedAnchorTrueRef = React.useRef(false);
    if (isAnchorFallback && !warnedAnchorTrueRef.current) {
      console.warn(
        "[ArvoDatePicker] anchor={true} requires a host element in React; falling back to input mode."
      );
      warnedAnchorTrueRef.current = true;
    }
    const useAnchorRender = isAnchorMode && !isAnchorFallback;
    const refreshDisplay = React.useCallback(() => {
      const ctrl = controllerRef.current;
      if (isSegmented && ctrl) {
        setDisplayValue(ctrl.getFormattedDisplay(inputFocusedRef.current));
        return;
      }
      setDisplayValue(
        committedValueRef.current ? core.formatDate(committedValueRef.current, effFormat, effLocale) : ""
      );
    }, [isSegmented, effFormat, effLocale]);
    const commitValue = React.useCallback(
      (next) => {
        var _a;
        const clamped = clampToRange(next, minDateResolved, maxDateResolved);
        if (sameDay(clamped, committedValueRef.current)) return false;
        if (!isValueControlled) setCommittedValue(clamped);
        committedValueRef.current = clamped;
        const formattedValue = clamped ? core.formatDate(clamped, effFormat, effLocale) : "";
        onChange == null ? void 0 : onChange({
          value: clamped,
          formattedValue
        });
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("dp:change", {
            bubbles: true,
            cancelable: false,
            detail: { value: clamped, formattedValue }
          })
        );
        return true;
      },
      [
        isValueControlled,
        minDateResolved,
        maxDateResolved,
        onChange,
        effFormat,
        effLocale
      ]
    );
    React.useEffect(() => {
      var _a;
      if (!isSegmented) {
        (_a = controllerRef.current) == null ? void 0 : _a.destroy();
        controllerRef.current = null;
        refreshDisplay();
        return;
      }
      const ctrl = core.createSegmentController({
        format: effFormat,
        locale: effLocale,
        value: committedValueRef.current,
        min: minDateResolved,
        max: maxDateResolved,
        commit: "blur"
      });
      controllerRef.current = ctrl;
      const offCommit = ctrl.on("commit", (payload) => {
        const next = payload.date;
        commitValue(next);
        refreshDisplay();
      });
      const offSegment = ctrl.on("segment", () => {
        setHasTextSelected(ctrl.getFocusedSegment() != null);
        setCaretTick((t) => t + 1);
      });
      const offChange = ctrl.on("change", () => {
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
      minDateResolved == null ? void 0 : minDateResolved.getTime(),
      maxDateResolved == null ? void 0 : maxDateResolved.getTime()
    ]);
    React.useEffect(() => {
      var _a;
      if (!isValueControlled) return;
      const coerced = coerceDate(value, effFormat, effLocale);
      setCommittedValue(coerced);
      committedValueRef.current = coerced;
      (_a = controllerRef.current) == null ? void 0 : _a.setValue(coerced, { silent: true });
      refreshDisplay();
    }, [value, effFormat, effLocale, isValueControlled]);
    React.useEffect(() => {
      if (!committedValue) return;
      if (committedValue.getFullYear() === visibleYear && committedValue.getMonth() === visibleMonth) {
        return;
      }
      setVisibleYear(committedValue.getFullYear());
      setVisibleMonth(committedValue.getMonth());
    }, [committedValue]);
    const handleProgrammaticOpen = React.useCallback(() => {
      var _a, _b;
      if (isOpenRef.current) return;
      if (effIsDisabled || effIsLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const evt = new CustomEvent("dp:open", { bubbles: true, cancelable: true });
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      const center = core.pickAnchorDate(
        committedValueRef.current,
        minDateResolved,
        maxDateResolved
      );
      setVisibleYear(center.getFullYear());
      setVisibleMonth(center.getMonth());
      setViewMode("days");
      (_b = surfaceRef.current) == null ? void 0 : _b.open();
    }, [effIsDisabled, effIsLoading, isReadOnly, minDateResolved, maxDateResolved, onOpen]);
    const handleProgrammaticClose = React.useCallback(() => {
      var _a, _b;
      if (!isOpenRef.current) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const evt = new CustomEvent("dp:close", { bubbles: true, cancelable: true });
      (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      (_b = surfaceRef.current) == null ? void 0 : _b.close();
    }, [onClose]);
    const handleEngineClose = React.useCallback(() => {
      requestAnimationFrame(() => {
        const focusTarget = anchorElementRef.current ?? inputRef.current;
        focusTarget == null ? void 0 : focusTarget.focus({ preventScroll: true });
      });
    }, []);
    const handleTriggerClick = React.useCallback(() => {
      if (effIsLoading) return;
      if (effIsDisabled || isReadOnly) return;
      if (isOpenRef.current) handleProgrammaticClose();
      else handleProgrammaticOpen();
    }, [effIsLoading, effIsDisabled, isReadOnly, handleProgrammaticOpen, handleProgrammaticClose]);
    const doClear = React.useCallback(() => {
      var _a;
      (_a = controllerRef.current) == null ? void 0 : _a.setValue(null, { silent: true });
      const changed = commitValue(null);
      if (changed || committedValueRef.current == null) {
        refreshDisplay();
      }
    }, [commitValue, refreshDisplay]);
    const handleClearClick = React.useCallback(
      (e) => {
        e.stopPropagation();
        doClear();
      },
      [doClear]
    );
    const handleFreeTextChange = React.useCallback(
      (e) => {
        setDisplayValue(e.target.value);
      },
      []
    );
    const pendingClickOffsetRef = React.useRef(null);
    const handleInputMouseDown = React.useCallback(() => {
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
    const handleInputFocus = React.useCallback(() => {
      inputFocusedRef.current = true;
      preFocusValueRef.current = committedValueRef.current;
      const ctrl = controllerRef.current;
      if (isSegmented && ctrl) {
        setDisplayValue(ctrl.getFormattedDisplay(true));
        ctrl.focusSegment(0);
      }
    }, [isSegmented]);
    const handleInputBlur = React.useCallback(() => {
      inputFocusedRef.current = false;
      const ctrl = controllerRef.current;
      if (isSegmented && ctrl) {
        setDisplayValue(ctrl.getFormattedDisplay(false));
      } else if (!isSegmented) {
        const parsed = core.parseDate(displayValue, effFormat, effLocale);
        if (parsed) {
          commitValue(parsed);
        }
        refreshDisplay();
      }
      setHasTextSelected(false);
      onBlur == null ? void 0 : onBlur();
    }, [isSegmented, displayValue, effFormat, effLocale, commitValue, refreshDisplay, onBlur]);
    const handleInputKeyDown = React.useCallback(
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
            if (isOpenRef.current) handleProgrammaticClose();
            return;
          }
          if (key === "Tab") {
            const res = ctrl.handleKey({ key: "Tab", shiftKey: e.shiftKey });
            if (res.consumed) {
              e.preventDefault();
            }
            return;
          }
          if (key === "Enter") {
            e.preventDefault();
            const before = committedValueRef.current;
            ctrl.handleKey({ key: "Enter" });
            const changed = !sameDay(before, committedValueRef.current);
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
          const parsed = core.parseDate(displayValue, effFormat, effLocale);
          if (parsed) {
            const before = committedValueRef.current;
            const changed = commitValue(parsed);
            if (isOpenRef.current && isAutoClose && changed && !sameDay(before, committedValueRef.current)) {
              handleProgrammaticClose();
            }
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (preFocusValueRef.current !== committedValueRef.current) {
            if (!isValueControlled) {
              setCommittedValue(preFocusValueRef.current);
            }
            committedValueRef.current = preFocusValueRef.current;
          }
          refreshDisplay();
          if (isOpenRef.current) handleProgrammaticClose();
          return;
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
    const handleInputPaste = React.useCallback(
      (e) => {
        const ctrl = controllerRef.current;
        if (!isSegmented || !ctrl) return;
        const text = e.clipboardData.getData("text");
        const res = ctrl.handlePaste(text);
        if (res.consumed) e.preventDefault();
      },
      [isSegmented]
    );
    const handleCalendarCellSelect = React.useCallback(
      (payload) => {
        var _a;
        const { date, mode } = payload;
        if (!date) return;
        if (mode === "days") {
          (_a = controllerRef.current) == null ? void 0 : _a.setValue(date, { silent: true });
          commitValue(date);
          refreshDisplay();
          if (isAutoClose) handleProgrammaticClose();
          return;
        }
        setVisibleYear(date.getFullYear());
        setVisibleMonth(date.getMonth());
        if (mode === "months") setViewMode("days");
        else if (mode === "years") setViewMode("months");
      },
      [commitValue, refreshDisplay, isAutoClose, handleProgrammaticClose]
    );
    const handleHeaderPrev = React.useCallback(() => {
      if (viewMode === "days") {
        const next = core.addMonths(new Date(visibleYear, visibleMonth, 1), -1);
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      } else if (viewMode === "months") {
        setVisibleYear((y) => y - 1);
      } else {
        setVisibleYear((y) => y - 10);
      }
    }, [viewMode, visibleYear, visibleMonth]);
    const handleHeaderNext = React.useCallback(() => {
      if (viewMode === "days") {
        const next = core.addMonths(new Date(visibleYear, visibleMonth, 1), 1);
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      } else if (viewMode === "months") {
        setVisibleYear((y) => y + 1);
      } else {
        setVisibleYear((y) => y + 10);
      }
    }, [viewMode, visibleYear, visibleMonth]);
    const handleHeaderToday = React.useCallback(() => {
      const today = /* @__PURE__ */ new Date();
      setVisibleYear(today.getFullYear());
      setVisibleMonth(today.getMonth());
    }, []);
    const engineTriggerRef = React.useRef(null);
    const getOrderedPopoverElements = React.useCallback(() => {
      const root = popoverRef.current;
      if (!root) return [];
      const calendarCell = root.querySelector(
        '.arvo-cal__cell[tabindex="0"]'
      );
      const prev = root.querySelector(".arvo-cal-nav__prev");
      const monthBtn = root.querySelector(".arvo-cal-nav__month-btn");
      const yearBtn = root.querySelector(".arvo-cal-nav__year-btn");
      const next = root.querySelector(".arvo-cal-nav__next");
      const today = root.querySelector(".arvo-cal-nav__today");
      return [calendarCell, prev, monthBtn, yearBtn, next, today];
    }, []);
    const surface = useOverlaySurface.useOverlaySurface({
      type: "dropdown",
      priority: 20,
      triggerRef: engineTriggerRef,
      panelRef: popoverRef,
      onClose: handleEngineClose,
      placement,
      gap: (popoverProps == null ? void 0 : popoverProps.offset) ?? 4,
      focus: "trap",
      initialFocus: "none",
      // initial focus is set imperatively via focusCell
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
    React.useLayoutEffect(() => {
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
    React.useEffect(() => {
      if (useAnchorRender) return;
      engineTriggerRef.current = fieldRef.current;
    });
    React.useEffect(() => {
      if (useAnchorRender) return;
      const el = fieldRef.current;
      if (!el) return;
      el.removeAttribute("aria-haspopup");
      el.removeAttribute("aria-controls");
      el.removeAttribute("aria-expanded");
    });
    React.useEffect(() => {
      if (!isOpen || !positioned) return;
      const target = core.pickAnchorDate(
        committedValueRef.current,
        minDateResolved,
        maxDateResolved
      );
      const id2 = requestAnimationFrame(() => {
        var _a;
        (_a = calendarRef.current) == null ? void 0 : _a.focusCell(target);
      });
      return () => cancelAnimationFrame(id2);
    }, [isOpen, positioned, minDateResolved, maxDateResolved]);
    React.useLayoutEffect(() => {
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
    React.useImperativeHandle(
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
            var _a, _b;
            if (v === NO_ARG) {
              return committedValueRef.current;
            }
            const coerced = coerceDate(v, effFormat, effLocale);
            const clamped = clampToRange(coerced, minDateResolved, maxDateResolved);
            if (!isValueControlled) setCommittedValue(clamped);
            committedValueRef.current = clamped;
            (_a = controllerRef.current) == null ? void 0 : _a.setValue(clamped, { silent: true });
            const formattedValue = clamped ? core.formatDate(clamped, effFormat, effLocale) : "";
            onChange == null ? void 0 : onChange({
              value: clamped,
              formattedValue
            });
            (_b = rootRef.current) == null ? void 0 : _b.dispatchEvent(
              new CustomEvent("dp:change", {
                bubbles: true,
                cancelable: false,
                detail: { value: clamped, formattedValue }
              })
            );
            refreshDisplay();
            return void 0;
          }),
          formattedValue: () => committedValueRef.current ? core.formatDate(committedValueRef.current, effFormat, effLocale) : "",
          clear: () => doClear(),
          disabled: ((state = NO_ARG) => {
            if (state === NO_ARG) {
              return effIsDisabled;
            }
            console.warn(
              "[ArvoDatePicker] disabled() setter is a noop in React; pass isDisabled prop."
            );
            return void 0;
          }),
          setError: (message) => {
            setErrorOverride(message === false ? null : message);
          },
          setLoading: (loading) => {
            setLoadingOverride(loading);
          },
          focus: () => {
            var _a;
            (_a = inputRef.current) == null ? void 0 : _a.focus();
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
        minDateResolved,
        maxDateResolved,
        onChange,
        refreshDisplay,
        doClear
      ]
    );
    const classes = [
      "arvo-dp",
      `arvo-dp--${size}`,
      `arvo-dp--surface-${surfaceProp}`,
      isFullWidth && "arvo-dp--full-width",
      hasWeeks && "arvo-dp--show-weeks",
      useAnchorRender && "arvo-dp--anchor-mode",
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
    const rootStyle = effectiveWidth ? { "--arvo-form-input-width": effectiveWidth } : void 0;
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
      "arvo-dp",
      `arvo-dp--${size}`,
      isFullWidth && "arvo-dp--full-width",
      hasWeeks && "arvo-dp--show-weeks",
      effIsLoading && "loading"
    ].filter(Boolean).join(" ");
    const popover = isMounted ? require$$0.createPortal(
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: popoverRootClass, style: { display: "contents" }, children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: popoverRef,
          id: popoverId,
          className: "arvo-dp__popover",
          role: "dialog",
          "aria-label": "Choose a date",
          "aria-modal": false,
          "data-arvo-side": panelSide,
          style: popoverStyle,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dp__header", children: /* @__PURE__ */ jsxRuntime.jsx(
              CalendarNav.CalendarNav,
              {
                visibleYear,
                visibleMonth,
                viewMode: viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days",
                locale: effLocale,
                minDate: minDateResolved,
                maxDate: maxDateResolved,
                isDisabled: effIsDisabled,
                onPrev: handleHeaderPrev,
                onNext: handleHeaderNext,
                onToday: handleHeaderToday,
                onMonthButtonClick: () => setViewMode(viewMode === "months" ? "days" : "months"),
                onYearButtonClick: () => setViewMode(viewMode === "years" ? "days" : "years")
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dp__body", children: /* @__PURE__ */ jsxRuntime.jsx(
              Calendar.default,
              {
                ...calendarProps,
                ref: calendarRef,
                visibleYear,
                visibleMonth,
                viewMode,
                locale: effLocale,
                weekStart,
                hasWeeks,
                selectedDate: committedValue,
                minDate: minDateResolved,
                maxDate: maxDateResolved,
                onCellSelect: handleCalendarCellSelect,
                onMonthChange: (p) => {
                  setVisibleYear(p.year);
                  setVisibleMonth(p.month);
                },
                onViewModeChange: (p) => setViewMode(p.mode),
                onDismiss: handleProgrammaticClose
              }
            ) })
          ]
        }
      ) }),
      document.body
    ) : null;
    if (useAnchorRender) {
      return /* @__PURE__ */ jsxRuntime.jsx("div", { ref: rootRef, id: dpId, className: classes, style: rootStyle, children: popover });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: rootRef, id: dpId, className: classes, style: rootStyle, children: [
      label && /* @__PURE__ */ jsxRuntime.jsx(
        FormLabel.ArvoFormLabel,
        {
          htmlFor: inputId,
          id: labelId,
          isRequired,
          isDisabled: effIsDisabled,
          isInvalid: hasError,
          contextHelp,
          className: "arvo-dp__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: fieldRef, className: "arvo-dp__field", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref: inputRef,
            id: inputId,
            type: "text",
            className: "arvo-dp__input",
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
          return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: actionsRef, className: "arvo-dp__actions", children: [
            showClear && /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "close",
                tooltip: "Clear",
                tabIndex: -1,
                onClick: handleClearClick,
                className: "arvo-dp__clear-btn"
              }
            ),
            showTooltipIcon && /* @__PURE__ */ jsxRuntime.jsx(
              MessageAlert.ArvoMessageAlert,
              {
                type: "negative",
                isInline: true,
                message: effError ?? "",
                className: "arvo-dp__err-ico"
              }
            ),
            showSep && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-dp__sep", "aria-hidden": "true" }),
            !effIsLoading && /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "calendar-o",
                tooltip: "Select date",
                isDisabled: effIsDisabled || isReadOnly,
                isSelected: isOpen,
                onClick: handleTriggerClick,
                className: "arvo-dp__trigger-btn",
                "aria-haspopup": "dialog",
                "aria-expanded": isOpen,
                "aria-controls": popoverId
              }
            )
          ] });
        })(),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dp__border" })
      ] }),
      showInlineAlert && /* @__PURE__ */ jsxRuntime.jsx(
        MessageAlert.ArvoMessageAlert,
        {
          type: "negative",
          id: errorId,
          message: effError,
          className: "arvo-dp__err-msg"
        }
      ),
      popover
    ] });
  }
);
ArvoDatePicker.displayName = "ArvoDatePicker";
exports.ArvoDatePicker = ArvoDatePicker;
exports.default = ArvoDatePicker;
//# sourceMappingURL=index79.cjs.map
