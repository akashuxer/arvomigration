import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useId, useMemo, useState, useRef, useCallback, useImperativeHandle, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUserLocale, getLocaleDateFormat, pickAnchorDate, buildMemberIndex, formatDate, findMemberForDate, addMonths, parseDate, isSameDay } from "@arvo/core";
import { useOverlaySurface } from "./index92.js";
import ArvoCalendar from "./index78.js";
import { CalendarNav } from "./index101.js";
function coerceDate(v, format, locale) {
  if (v == null) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string") return v.length === 0 ? null : parseDate(v, format, locale);
  return null;
}
function asDate(v, format, locale) {
  return coerceDate(v, format, locale);
}
function sameDay(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return isSameDay(a, b);
}
function clampToRange(v, min, max) {
  if (v == null) return null;
  if (min && v.getTime() < min.getTime()) return new Date(min.getTime());
  if (max && v.getTime() > max.getTime()) return new Date(max.getTime());
  return v;
}
const ArvoCalendarDropdown = forwardRef(function ArvoCalendarDropdown2({
  triggerRef,
  value,
  defaultValue,
  format,
  locale,
  weekStart = 0,
  hasWeeks = false,
  minDate,
  maxDate,
  frequency,
  memberData,
  currentMemberIndex,
  isOpen: isOpenProp,
  defaultOpen = false,
  isDisabled = false,
  isAutoClose = true,
  placement = "bottom-end",
  ariaLabel = "Choose a date",
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
  const uid = useId();
  const dropdownId = id ?? `arvo-cal-drop-${uid.replace(/[:]/g, "")}`;
  const popoverId = `${dropdownId}-popover`;
  const effLocale = locale ?? getUserLocale();
  const effFormat = format ?? getLocaleDateFormat(effLocale);
  const minDateResolved = useMemo(
    () => asDate(minDate, effFormat, effLocale),
    [minDate, effFormat, effLocale]
  );
  const maxDateResolved = useMemo(
    () => asDate(maxDate, effFormat, effLocale),
    [maxDate, effFormat, effLocale]
  );
  const isControlled = value !== void 0;
  const initialValue = useMemo(() => {
    const raw = value !== void 0 ? value : defaultValue ?? null;
    return clampToRange(
      coerceDate(raw, effFormat, effLocale),
      minDateResolved,
      maxDateResolved
    );
  }, []);
  const [internalValue, setInternalValue] = useState(initialValue);
  const committedValue = isControlled ? clampToRange(
    coerceDate(value ?? null, effFormat, effLocale),
    minDateResolved,
    maxDateResolved
  ) : internalValue;
  const [disabledOverride, setDisabledOverride] = useState(null);
  const effDisabled = disabledOverride ?? isDisabled;
  const anchorDate = pickAnchorDate(committedValue, minDateResolved, maxDateResolved);
  const [visibleYear, setVisibleYear] = useState(anchorDate.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(anchorDate.getMonth());
  const [viewMode, setViewMode] = useState("days");
  const memberIndex = useMemo(() => {
    if (!memberData || !frequency) return null;
    try {
      return buildMemberIndex(memberData, {
        frequency,
        currentMemberIndex: currentMemberIndex ?? null
      });
    } catch {
      return null;
    }
  }, [memberData, frequency, currentMemberIndex]);
  const popoverRef = useRef(null);
  const calendarRef = useRef(null);
  const dispatchTrigger = useCallback(
    (name, detail = {}) => {
      const el = triggerRef.current;
      if (!el) return true;
      const ev = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
      return el.dispatchEvent(ev);
    },
    [triggerRef]
  );
  const getOrderedPopoverElements = useCallback(() => {
    const root = popoverRef.current;
    if (!root) return [];
    const cell = root.querySelector('.arvo-cal__cell[tabindex="0"]');
    const prev = root.querySelector(".arvo-cal-nav__prev");
    const month = root.querySelector(".arvo-cal-nav__month-btn");
    const year = root.querySelector(".arvo-cal-nav__year-btn");
    const next = root.querySelector(".arvo-cal-nav__next");
    const today = root.querySelector(".arvo-cal-nav__today");
    return [cell, prev, month, year, next, today];
  }, []);
  const surface = useOverlaySurface({
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
  const handleProgrammaticOpen = useCallback(() => {
    if (effDisabled) return;
    if (isOpen) return;
    if ((onOpen == null ? void 0 : onOpen()) === false) return;
    if (!dispatchTrigger("cal-drop:open")) return;
    openSurface();
  }, [effDisabled, isOpen, onOpen, dispatchTrigger, openSurface]);
  const handleProgrammaticClose = useCallback(() => {
    if (!isOpen) return;
    if ((onClose == null ? void 0 : onClose()) === false) return;
    if (!dispatchTrigger("cal-drop:close")) return;
    closeSurface();
  }, [isOpen, onClose, dispatchTrigger, closeSurface]);
  const commitValue = useCallback(
    (next) => {
      const clamped = clampToRange(next, minDateResolved, maxDateResolved);
      if (sameDay(clamped, committedValue)) return false;
      if (!isControlled) setInternalValue(clamped);
      if (clamped) {
        setVisibleYear(clamped.getFullYear());
        setVisibleMonth(clamped.getMonth());
      }
      const formatted = clamped ? formatDate(clamped, effFormat, effLocale) : "";
      onChange == null ? void 0 : onChange({ value: clamped, formattedValue: formatted });
      dispatchTrigger("cal-drop:change", { value: clamped, formattedValue: formatted });
      return true;
    },
    [
      minDateResolved,
      maxDateResolved,
      committedValue,
      isControlled,
      effFormat,
      effLocale,
      onChange,
      dispatchTrigger
    ]
  );
  const handleCalendarCellSelect = useCallback(
    (payload) => {
      if (!payload.date) return;
      if (payload.mode === "days") {
        let next = payload.date;
        if (memberIndex) {
          const matched = findMemberForDate(memberIndex, payload.date);
          if (matched == null ? void 0 : matched.keyDate) next = matched.keyDate;
        }
        const changed = commitValue(next);
        if (isAutoClose && changed) handleProgrammaticClose();
        return;
      }
      setVisibleYear(payload.date.getFullYear());
      setVisibleMonth(payload.date.getMonth());
      if (payload.mode === "months") setViewMode("days");
      else if (payload.mode === "years") setViewMode("months");
    },
    [memberIndex, commitValue, isAutoClose, handleProgrammaticClose]
  );
  const handleHeaderPrev = useCallback(() => {
    if (viewMode === "days") {
      const d = addMonths(new Date(visibleYear, visibleMonth, 1), -1);
      setVisibleYear(d.getFullYear());
      setVisibleMonth(d.getMonth());
    } else if (viewMode === "months") {
      setVisibleYear(visibleYear - 1);
    } else if (viewMode === "years") {
      setVisibleYear(visibleYear - 10);
    }
    onMonthChange == null ? void 0 : onMonthChange({ year: visibleYear, month: visibleMonth });
    dispatchTrigger("cal-drop:month-change", { year: visibleYear, month: visibleMonth });
  }, [viewMode, visibleYear, visibleMonth, onMonthChange, dispatchTrigger]);
  const handleHeaderNext = useCallback(() => {
    if (viewMode === "days") {
      const d = addMonths(new Date(visibleYear, visibleMonth, 1), 1);
      setVisibleYear(d.getFullYear());
      setVisibleMonth(d.getMonth());
    } else if (viewMode === "months") {
      setVisibleYear(visibleYear + 1);
    } else if (viewMode === "years") {
      setVisibleYear(visibleYear + 10);
    }
    onMonthChange == null ? void 0 : onMonthChange({ year: visibleYear, month: visibleMonth });
    dispatchTrigger("cal-drop:month-change", { year: visibleYear, month: visibleMonth });
  }, [viewMode, visibleYear, visibleMonth, onMonthChange, dispatchTrigger]);
  const handleHeaderToday = useCallback(() => {
    const today = /* @__PURE__ */ new Date();
    setVisibleYear(today.getFullYear());
    setVisibleMonth(today.getMonth());
    onMonthChange == null ? void 0 : onMonthChange({ year: today.getFullYear(), month: today.getMonth() });
    dispatchTrigger("cal-drop:month-change", {
      year: today.getFullYear(),
      month: today.getMonth()
    });
  }, [onMonthChange, dispatchTrigger]);
  useImperativeHandle(
    ref,
    () => {
      const valueAccessor = ((newValue) => {
        if (newValue === void 0) return committedValue;
        const coerced = clampToRange(
          coerceDate(newValue, effFormat, effLocale),
          minDateResolved,
          maxDateResolved
        );
        if (!isControlled) setInternalValue(coerced);
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
        formattedValue: () => committedValue ? formatDate(committedValue, effFormat, effLocale) : "",
        disabled: disabledAccessor,
        focus: () => {
          var _a;
          if (!isOpen) return;
          const target = pickAnchorDate(
            committedValue,
            minDateResolved,
            maxDateResolved
          );
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
      effDisabled,
      effFormat,
      effLocale,
      minDateResolved,
      maxDateResolved,
      isControlled,
      closeSurface,
      setSurfaceOpen
    ]
  );
  useEffect(() => {
    if (!isOpen || !positioned) return;
    requestAnimationFrame(() => {
      var _a;
      const target = pickAnchorDate(
        committedValue,
        minDateResolved,
        maxDateResolved
      );
      (_a = calendarRef.current) == null ? void 0 : _a.focusCell(target);
    });
  }, [isOpen, positioned]);
  const isOpenRef = useRef(false);
  isOpenRef.current = isOpen;
  useEffect(() => {
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
  const popoverStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    ...(popoverProps == null ? void 0 : popoverProps.width) ? { width: popoverProps.width } : {},
    ...panelStyle ?? {}
  };
  const classes = [
    "arvo-cal-drop",
    hasWeeks && "arvo-cal-drop--show-weeks",
    className
  ].filter(Boolean).join(" ");
  if (!isMounted) return null;
  return createPortal(
    /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx("div", { className: "arvo-cal-drop__header", children: /* @__PURE__ */ jsx(
            CalendarNav,
            {
              visibleYear,
              visibleMonth,
              viewMode: viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days",
              locale: effLocale,
              minDate: minDateResolved,
              maxDate: maxDateResolved,
              isDisabled: effDisabled,
              onPrev: handleHeaderPrev,
              onNext: handleHeaderNext,
              onToday: handleHeaderToday,
              onMonthButtonClick: () => setViewMode(viewMode === "months" ? "days" : "months"),
              onYearButtonClick: () => setViewMode(viewMode === "years" ? "days" : "years")
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "arvo-cal-drop__body", children: /* @__PURE__ */ jsx(
            ArvoCalendar,
            {
              ...calendarProps ?? {},
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
              frequency: frequency ?? void 0,
              memberIndex,
              currentMemberIndex: currentMemberIndex ?? null,
              onCellSelect: handleCalendarCellSelect,
              onMonthChange: (p) => {
                setVisibleYear(p.year);
                setVisibleMonth(p.month);
                onMonthChange == null ? void 0 : onMonthChange({ year: p.year, month: p.month });
                dispatchTrigger("cal-drop:month-change", { year: p.year, month: p.month });
              },
              onViewModeChange: (p) => {
                setViewMode(p.mode);
                onViewModeChange == null ? void 0 : onViewModeChange({ mode: p.mode });
              },
              onDismiss: handleProgrammaticClose
            }
          ) })
        ]
      }
    ),
    document.body
  );
});
export {
  ArvoCalendarDropdown,
  ArvoCalendarDropdown as default
};
//# sourceMappingURL=index85.js.map
