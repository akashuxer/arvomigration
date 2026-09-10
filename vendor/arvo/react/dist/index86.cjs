"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const core = require("@arvo/core");
const useOverlaySurface = require("./index92.cjs");
const Calendar = require("./index78.cjs");
const CalendarNav = require("./index101.cjs");
const TimeDropdown = require("./index83.cjs");
function coerceDate(v, format, locale) {
  if (v == null) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string") return v.length === 0 ? null : core.parseDate(v, format, locale);
  return null;
}
function asDate(v, format, locale) {
  return coerceDate(v, format, locale);
}
function asTime(v, timeFormat) {
  if (v == null) return null;
  if (typeof v === "string")
    return v.length === 0 ? null : core.parseTime(v, timeFormat);
  return v;
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
function totalMs(t) {
  return ((t.hours * 60 + t.minutes) * 60 + (t.seconds ?? 0)) * 1e3 + (t.milliseconds ?? 0);
}
function laterTime(a, b) {
  if (!a) return b;
  if (!b) return a;
  return totalMs(a) >= totalMs(b) ? a : b;
}
function earlierTime(a, b) {
  if (!a) return b;
  if (!b) return a;
  return totalMs(a) <= totalMs(b) ? a : b;
}
function getEffectiveMinTimeForDate(date, min, startTime) {
  const onMinDay = date && min && core.isSameDay(date, min);
  return laterTime(onMinDay ? getTimePart(min) : null, startTime);
}
function getEffectiveMaxTimeForDate(date, max, endTime) {
  const onMaxDay = date && max && core.isSameDay(date, max);
  return earlierTime(onMaxDay ? getTimePart(max) : null, endTime);
}
function clampToBounds(v, min, max, startTime, endTime) {
  if (!v) return null;
  let result = new Date(v.getTime());
  if (min && result.getTime() < min.getTime()) result = new Date(min.getTime());
  if (max && result.getTime() > max.getTime()) result = new Date(max.getTime());
  const effMin = getEffectiveMinTimeForDate(result, min, startTime);
  const effMax = getEffectiveMaxTimeForDate(result, max, endTime);
  const tPart = getTimePart(result);
  if (effMin && tPart && totalMs(tPart) < totalMs(effMin)) {
    result = mergeDateAndTime(result, effMin);
  }
  if (effMax && tPart && totalMs(tPart) > totalMs(effMax)) {
    result = mergeDateAndTime(result, effMax);
  }
  if (min && result.getTime() < min.getTime()) result = new Date(min.getTime());
  if (max && result.getTime() > max.getTime()) result = new Date(max.getTime());
  return result;
}
function sameDateTime(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.getTime() === b.getTime();
}
const ArvoDateTimeDropdown = React.forwardRef(function ArvoDateTimeDropdown2({
  triggerRef,
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
  isOpen: isOpenProp,
  defaultOpen = false,
  isDisabled = false,
  isAutoClose = false,
  placement = "bottom-end",
  ariaLabel = "Choose a date and time",
  calendarProps,
  popoverProps,
  onChange,
  onOpen,
  onClose,
  onOpenChange,
  onMonthChange,
  onViewModeChange,
  className,
  id
}, ref) {
  const uid = React.useId();
  const dropdownId = id ?? `arvo-dt-drop-${uid.replace(/[:]/g, "")}`;
  const popoverId = `${dropdownId}-popover`;
  const effLocale = locale ?? core.getUserLocale();
  const effFormat = format ?? `${core.getLocaleDateFormat(effLocale)} ${core.getLocaleTimeFormat(effLocale)}`;
  const effTimeFormat = React.useMemo(() => {
    const split = core.splitDateTimeFormat(effFormat);
    return split.timePart || core.getLocaleTimeFormat(effLocale);
  }, [effFormat, effLocale]);
  const minDate = React.useMemo(() => asDate(min, effFormat, effLocale), [min, effFormat, effLocale]);
  const maxDate = React.useMemo(() => asDate(max, effFormat, effLocale), [max, effFormat, effLocale]);
  const startTimeObj = React.useMemo(() => asTime(startTime, effTimeFormat), [startTime, effTimeFormat]);
  const endTimeObj = React.useMemo(() => asTime(endTime, effTimeFormat), [endTime, effTimeFormat]);
  const isControlled = value !== void 0;
  const initialValue = React.useMemo(() => {
    const raw = value !== void 0 ? value : defaultValue ?? null;
    return clampToBounds(
      coerceDate(raw, effFormat, effLocale),
      minDate,
      maxDate,
      startTimeObj,
      endTimeObj
    );
  }, []);
  const [internalValue, setInternalValue] = React.useState(initialValue);
  const committedValue = isControlled ? clampToBounds(
    coerceDate(value ?? null, effFormat, effLocale),
    minDate,
    maxDate,
    startTimeObj,
    endTimeObj
  ) : internalValue;
  const [previewValue, setPreviewValue] = React.useState(null);
  const liveValue = previewValue ?? committedValue;
  const [disabledOverride, setDisabledOverride] = React.useState(null);
  const effDisabled = disabledOverride ?? isDisabled;
  const anchor = core.pickAnchorDate(committedValue, minDate, maxDate);
  const [visibleYear, setVisibleYear] = React.useState(anchor.getFullYear());
  const [visibleMonth, setVisibleMonth] = React.useState(anchor.getMonth());
  const [viewMode, setViewMode] = React.useState("days");
  const popoverRef = React.useRef(null);
  const calendarRef = React.useRef(null);
  const dispatchTrigger = React.useCallback(
    (name, detail = {}) => {
      const el = triggerRef.current;
      if (!el) return true;
      const ev = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
      return el.dispatchEvent(ev);
    },
    [triggerRef]
  );
  const getOrderedPopoverElements = React.useCallback(() => {
    const root = popoverRef.current;
    if (!root) return [];
    const cell = root.querySelector('.arvo-cal__cell[tabindex="0"]');
    const timeItem = root.querySelector('.arvo-tdrop [tabindex="0"]');
    const prev = root.querySelector(".arvo-cal-nav__prev");
    const month = root.querySelector(".arvo-cal-nav__month-btn");
    const year = root.querySelector(".arvo-cal-nav__year-btn");
    const next = root.querySelector(".arvo-cal-nav__next");
    const today = root.querySelector(".arvo-cal-nav__today");
    return [cell, timeItem, prev, month, year, next, today];
  }, []);
  const surface = useOverlaySurface.useOverlaySurface({
    type: "dropdown",
    priority: 20,
    zIndex: popoverProps == null ? void 0 : popoverProps.zIndex,
    triggerRef,
    panelRef: popoverRef,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    placement,
    gap: (popoverProps == null ? void 0 : popoverProps.offset) ?? 4,
    focus: "trap",
    initialFocus: "none",
    getOrderedElements: getOrderedPopoverElements,
    returnFocus: true,
    closeOnOutside: true,
    closeOnEscape: true,
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
    open: openSurface,
    close: closeSurface,
    setOpen: setSurfaceOpen
  } = surface;
  const handleProgrammaticOpen = React.useCallback(() => {
    if (effDisabled) return;
    if (isOpen) return;
    if ((onOpen == null ? void 0 : onOpen()) === false) return;
    if (!dispatchTrigger("dt-drop:open")) return;
    openSurface();
  }, [effDisabled, isOpen, onOpen, dispatchTrigger, openSurface]);
  const handleProgrammaticClose = React.useCallback(() => {
    if (!isOpen) return;
    if ((onClose == null ? void 0 : onClose()) === false) return;
    if (!dispatchTrigger("dt-drop:close")) return;
    closeSurface();
  }, [isOpen, onClose, dispatchTrigger, closeSurface]);
  const commitValue = React.useCallback(
    (next) => {
      const clamped = clampToBounds(next, minDate, maxDate, startTimeObj, endTimeObj);
      if (sameDateTime(clamped, committedValue)) return false;
      if (!isControlled) setInternalValue(clamped);
      setPreviewValue(null);
      if (clamped) {
        setVisibleYear(clamped.getFullYear());
        setVisibleMonth(clamped.getMonth());
      }
      const formatted = clamped ? core.formatDate(clamped, effFormat, effLocale) : "";
      onChange == null ? void 0 : onChange({ value: clamped, formattedValue: formatted });
      dispatchTrigger("dt-drop:change", { value: clamped, formattedValue: formatted });
      return true;
    },
    [
      minDate,
      maxDate,
      startTimeObj,
      endTimeObj,
      committedValue,
      isControlled,
      effFormat,
      effLocale,
      onChange,
      dispatchTrigger
    ]
  );
  const handleCalendarCellSelect = React.useCallback(
    (payload) => {
      if (!payload.date) return;
      if (payload.mode === "days") {
        const tPart = getTimePart(liveValue);
        const next = tPart ? mergeDateAndTime(payload.date, tPart) : payload.date;
        commitValue(next);
        return;
      }
      setVisibleYear(payload.date.getFullYear());
      setVisibleMonth(payload.date.getMonth());
      if (payload.mode === "months") setViewMode("days");
      else if (payload.mode === "years") setViewMode("months");
    },
    [liveValue, commitValue]
  );
  const handleTimeChange = React.useCallback(
    (time) => {
      const base = liveValue ?? /* @__PURE__ */ new Date();
      const next = mergeDateAndTime(base, time);
      const changed = commitValue(next);
      if (isAutoClose && changed) handleProgrammaticClose();
    },
    [liveValue, commitValue, isAutoClose, handleProgrammaticClose]
  );
  const handleHeaderPrev = React.useCallback(() => {
    if (viewMode === "days") {
      const d = core.addMonths(new Date(visibleYear, visibleMonth, 1), -1);
      setVisibleYear(d.getFullYear());
      setVisibleMonth(d.getMonth());
    } else if (viewMode === "months") {
      setVisibleYear(visibleYear - 1);
    } else if (viewMode === "years") {
      setVisibleYear(visibleYear - 10);
    }
  }, [viewMode, visibleYear, visibleMonth]);
  const handleHeaderNext = React.useCallback(() => {
    if (viewMode === "days") {
      const d = core.addMonths(new Date(visibleYear, visibleMonth, 1), 1);
      setVisibleYear(d.getFullYear());
      setVisibleMonth(d.getMonth());
    } else if (viewMode === "months") {
      setVisibleYear(visibleYear + 1);
    } else if (viewMode === "years") {
      setVisibleYear(visibleYear + 10);
    }
  }, [viewMode, visibleYear, visibleMonth]);
  const handleHeaderToday = React.useCallback(() => {
    const today = /* @__PURE__ */ new Date();
    setVisibleYear(today.getFullYear());
    setVisibleMonth(today.getMonth());
  }, []);
  React.useImperativeHandle(
    ref,
    () => {
      const valueAccessor = ((newValue) => {
        if (newValue === void 0) return committedValue;
        const coerced = clampToBounds(
          coerceDate(newValue, effFormat, effLocale),
          minDate,
          maxDate,
          startTimeObj,
          endTimeObj
        );
        if (!isControlled) setInternalValue(coerced);
        setPreviewValue(null);
        if (coerced) {
          setVisibleYear(coerced.getFullYear());
          setVisibleMonth(coerced.getMonth());
        }
        return void 0;
      });
      const disabledAccessor = ((next) => {
        if (next === void 0) return effDisabled;
        setDisabledOverride(next);
        if (next && isOpen) closeSurface();
        return void 0;
      });
      return {
        open: handleProgrammaticOpen,
        close: handleProgrammaticClose,
        toggle: (force) => {
          const next = force === void 0 ? !isOpen : force;
          if (next) handleProgrammaticOpen();
          else handleProgrammaticClose();
        },
        isOpen: () => isOpen,
        value: valueAccessor,
        setPreview: (v) => setPreviewValue(v),
        formattedValue: () => committedValue ? core.formatDate(committedValue, effFormat, effLocale) : "",
        disabled: disabledAccessor,
        focus: () => {
          var _a;
          if (!isOpen) return;
          const target = core.pickAnchorDate(liveValue, minDate, maxDate);
          (_a = calendarRef.current) == null ? void 0 : _a.focusCell(target);
        },
        destroy: () => {
          if (isOpen) setSurfaceOpen(false);
        }
      };
    },
    [
      handleProgrammaticOpen,
      handleProgrammaticClose,
      isOpen,
      committedValue,
      liveValue,
      effDisabled,
      effFormat,
      effLocale,
      minDate,
      maxDate,
      startTimeObj,
      endTimeObj,
      isControlled,
      closeSurface,
      setSurfaceOpen
    ]
  );
  React.useEffect(() => {
    if (!isOpen || !positioned) return;
    requestAnimationFrame(() => {
      var _a;
      const target = core.pickAnchorDate(liveValue, minDate, maxDate);
      (_a = calendarRef.current) == null ? void 0 : _a.focusCell(target);
    });
  }, [isOpen, positioned]);
  const isOpenRef = React.useRef(false);
  isOpenRef.current = isOpen;
  React.useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const handleClick = (e) => {
      if (e.defaultPrevented) return;
      if (isOpenRef.current) handleProgrammaticClose();
      else handleProgrammaticOpen();
    };
    const handleKeyDown = (e) => {
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
      if (e.key === "Escape") {
        if (isOpenRef.current) {
          e.preventDefault();
          handleProgrammaticClose();
        }
      }
    };
    el.addEventListener("click", handleClick);
    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("click", handleClick);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerRef, handleProgrammaticOpen, handleProgrammaticClose]);
  const tdMinTime = getEffectiveMinTimeForDate(liveValue, minDate, startTimeObj);
  const tdMaxTime = getEffectiveMaxTimeForDate(liveValue, maxDate, endTimeObj);
  const timeValue = liveValue ? getTimePart(liveValue) : null;
  const popoverStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    ...(popoverProps == null ? void 0 : popoverProps.width) ? { width: popoverProps.width } : {},
    ...panelStyle ?? {}
  };
  const classes = [
    "arvo-dt-drop",
    hasWeeks && "arvo-dt-drop--show-weeks",
    className
  ].filter(Boolean).join(" ");
  if (!isMounted) return null;
  return require$$0.createPortal(
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: popoverRef,
        id: popoverId,
        className: classes,
        role: "dialog",
        "aria-label": ariaLabel,
        "aria-modal": false,
        "data-arvo-side": panelSide,
        style: popoverStyle,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-dt-drop__cal", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dt-drop__header", children: /* @__PURE__ */ jsxRuntime.jsx(
              CalendarNav.CalendarNav,
              {
                visibleYear,
                visibleMonth,
                viewMode: viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days",
                locale: effLocale,
                minDate,
                maxDate,
                isDisabled: effDisabled,
                onPrev: handleHeaderPrev,
                onNext: handleHeaderNext,
                onToday: handleHeaderToday,
                onMonthButtonClick: () => setViewMode(viewMode === "months" ? "days" : "months"),
                onYearButtonClick: () => setViewMode(viewMode === "years" ? "days" : "years")
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dt-drop__cal-grid", children: /* @__PURE__ */ jsxRuntime.jsx(
              Calendar.default,
              {
                ...calendarProps ?? {},
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
                  onMonthChange == null ? void 0 : onMonthChange({ year: p.year, month: p.month });
                  dispatchTrigger("dt-drop:month-change", { year: p.year, month: p.month });
                },
                onViewModeChange: (p) => {
                  setViewMode(p.mode);
                  onViewModeChange == null ? void 0 : onViewModeChange({ mode: p.mode });
                },
                onDismiss: handleProgrammaticClose
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dt-drop__sep" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-dt-drop__time", children: /* @__PURE__ */ jsxRuntime.jsx(
            TimeDropdown.ArvoTimeDropdown,
            {
              value: timeValue,
              format: effTimeFormat,
              locale: effLocale,
              interval,
              minTime: tdMinTime,
              maxTime: tdMaxTime,
              isDisabled: effDisabled,
              onChange: handleTimeChange,
              onDismiss: handleProgrammaticClose
            }
          ) })
        ]
      }
    ),
    document.body
  );
});
exports.ArvoDateTimeDropdown = ArvoDateTimeDropdown;
exports.default = ArvoDateTimeDropdown;
//# sourceMappingURL=index86.cjs.map
