"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const core = require("@arvo/core");
const useOverlaySurface = require("./index92.cjs");
const Calendar = require("./index78.cjs");
const CalendarNav = require("./index101.cjs");
function coerceDate(v, format, locale) {
  if (v == null) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string") return v.length === 0 ? null : core.parseDate(v, format, locale);
  return null;
}
function clampDate(v, min, max) {
  if (v == null) return null;
  if (min && v.getTime() < min.getTime()) return new Date(min.getTime());
  if (max && v.getTime() > max.getTime()) return new Date(max.getTime());
  return v;
}
function asDate(v, format, locale) {
  return coerceDate(v, format, locale);
}
const ArvoCalendarRangeDropdown = React.forwardRef(function ArvoCalendarRangeDropdown2({
  triggerRef,
  startValue,
  endValue,
  format,
  locale,
  weekStart = 0,
  hasWeeks = true,
  minDate,
  maxDate,
  calendarProps,
  isOpen: isOpenProp,
  defaultOpen = false,
  isDisabled = false,
  isAutoClose = true,
  placement = "bottom-end",
  ariaLabel,
  popoverProps,
  onChange,
  onOpen,
  onClose,
  onOpenChange,
  className,
  id
}, ref) {
  const uid = React.useId();
  const dropdownId = id ?? `arvo-cal-rng-drop-${uid.replace(/[:]/g, "")}`;
  const popoverId = `${dropdownId}-popover`;
  const effLocale = locale ?? core.getUserLocale();
  const effFormat = format ?? core.getLocaleDateFormat(effLocale);
  const minDateResolved = React.useMemo(
    () => asDate(minDate, effFormat, effLocale),
    [minDate, effFormat, effLocale]
  );
  const maxDateResolved = React.useMemo(
    () => asDate(maxDate, effFormat, effLocale),
    [maxDate, effFormat, effLocale]
  );
  const initialRange = React.useMemo(() => {
    return {
      start: clampDate(
        coerceDate(startValue, effFormat, effLocale),
        minDateResolved,
        maxDateResolved
      ),
      end: clampDate(
        coerceDate(endValue, effFormat, effLocale),
        minDateResolved,
        maxDateResolved
      )
    };
  }, []);
  const [appliedRange, setAppliedRange] = React.useState(initialRange);
  const [draftRange, setDraftRange] = React.useState(initialRange);
  const [draftFirstSet, setDraftFirstSet] = React.useState(
    !!(initialRange.start && !initialRange.end)
  );
  const [activeSide, setActiveSide] = React.useState(
    initialRange.start && !initialRange.end ? "end" : "start"
  );
  const [hoverDate, setHoverDate] = React.useState(null);
  const [disabledOverride, setDisabledOverride] = React.useState(null);
  const effDisabled = disabledOverride ?? isDisabled;
  const anchor = core.pickAnchorDate(
    appliedRange.start ?? appliedRange.end,
    minDateResolved,
    maxDateResolved
  );
  const [leftYear, setLeftYear] = React.useState(anchor.getFullYear());
  const [leftMonth, setLeftMonth] = React.useState(anchor.getMonth());
  const [viewMode, setViewMode] = React.useState("days");
  const rightVisible = React.useMemo(() => {
    if (viewMode === "months" || viewMode === "quarters") {
      return { year: leftYear + 1, month: leftMonth };
    }
    if (viewMode === "years") {
      return { year: leftYear + 10, month: leftMonth };
    }
    const d = core.addMonths(new Date(leftYear, leftMonth, 1), 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [leftYear, leftMonth, viewMode]);
  const popoverRef = React.useRef(null);
  const calLeftRef = React.useRef(null);
  const calRightRef = React.useRef(null);
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
    return Array.from(
      root.querySelectorAll(
        '.arvo-cal__cell[tabindex="0"], .arvo-cal-nav__prev, .arvo-cal-nav__month-btn, .arvo-cal-nav__year-btn, .arvo-cal-nav__next, .arvo-cal-nav__today'
      )
    );
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
    if (!dispatchTrigger("cal-rng-drop:open")) return;
    setDraftRange(appliedRange);
    setDraftFirstSet(!!(appliedRange.start && !appliedRange.end));
    setActiveSide(appliedRange.start && !appliedRange.end ? "end" : "start");
    setHoverDate(null);
    const center = core.pickAnchorDate(
      appliedRange.start ?? appliedRange.end,
      minDateResolved,
      maxDateResolved
    );
    setLeftYear(center.getFullYear());
    setLeftMonth(center.getMonth());
    setViewMode("days");
    openSurface();
  }, [
    effDisabled,
    isOpen,
    onOpen,
    dispatchTrigger,
    appliedRange,
    minDateResolved,
    maxDateResolved,
    openSurface
  ]);
  const handleProgrammaticClose = React.useCallback(() => {
    if (!isOpen) return;
    if ((onClose == null ? void 0 : onClose()) === false) return;
    if (!dispatchTrigger("cal-rng-drop:close")) return;
    closeSurface();
  }, [isOpen, onClose, dispatchTrigger, closeSurface]);
  const commitRange = React.useCallback(
    (start, end) => {
      setAppliedRange({ start, end });
      const formatted = {
        start: core.formatDate(start, effFormat, effLocale),
        end: core.formatDate(end, effFormat, effLocale)
      };
      onChange == null ? void 0 : onChange({ start, end, formatted, mode: "absolute" });
      dispatchTrigger("cal-rng-drop:change", {
        start,
        end,
        formatted,
        mode: "absolute"
      });
    },
    [effFormat, effLocale, onChange, dispatchTrigger]
  );
  const handleCellSelect = React.useCallback(
    (payload) => {
      if (!payload.date) return;
      if (payload.mode !== "days") {
        setLeftYear(payload.date.getFullYear());
        setLeftMonth(payload.date.getMonth());
        if (payload.mode === "months") setViewMode("days");
        else if (payload.mode === "years") setViewMode("months");
        return;
      }
      const date = payload.date;
      if (!draftFirstSet) {
        setDraftRange({ start: date, end: null });
        setDraftFirstSet(true);
        setActiveSide("end");
        return;
      }
      let start;
      let end;
      if (draftRange.start && date.getTime() < draftRange.start.getTime()) {
        start = date;
        end = draftRange.start;
      } else {
        start = draftRange.start ?? date;
        end = date;
      }
      setDraftRange({ start, end });
      setDraftFirstSet(false);
      setActiveSide("start");
      setHoverDate(null);
      commitRange(start, end);
      if (isAutoClose) handleProgrammaticClose();
    },
    [draftRange, draftFirstSet, commitRange, isAutoClose, handleProgrammaticClose]
  );
  const handleCellHover = React.useCallback(
    (payload) => {
      if (!draftFirstSet) return;
      setHoverDate(payload.date ?? null);
    },
    [draftFirstSet]
  );
  const handleHeaderPrev = React.useCallback(() => {
    if (viewMode === "days") {
      const d = core.addMonths(new Date(leftYear, leftMonth, 1), -1);
      setLeftYear(d.getFullYear());
      setLeftMonth(d.getMonth());
    } else if (viewMode === "months") {
      setLeftYear((y) => y - 1);
    } else {
      setLeftYear((y) => y - 10);
    }
  }, [viewMode, leftYear, leftMonth]);
  const handleHeaderNext = React.useCallback(() => {
    if (viewMode === "days") {
      const d = core.addMonths(new Date(leftYear, leftMonth, 1), 1);
      setLeftYear(d.getFullYear());
      setLeftMonth(d.getMonth());
    } else if (viewMode === "months") {
      setLeftYear((y) => y + 1);
    } else {
      setLeftYear((y) => y + 10);
    }
  }, [viewMode, leftYear, leftMonth]);
  const handleHeaderToday = React.useCallback(() => {
    const today = /* @__PURE__ */ new Date();
    setLeftYear(today.getFullYear());
    setLeftMonth(today.getMonth());
  }, []);
  React.useImperativeHandle(
    ref,
    () => {
      const rangeAccessor = ((v) => {
        if (v === void 0) return { ...appliedRange };
        const next = {
          start: clampDate(v.start, minDateResolved, maxDateResolved),
          end: clampDate(v.end, minDateResolved, maxDateResolved)
        };
        setAppliedRange(next);
        setDraftRange(next);
        setDraftFirstSet(false);
        setActiveSide("start");
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
        range: rangeAccessor,
        setActiveSide: (side) => setActiveSide(side),
        disabled: disabledAccessor,
        focus: () => {
          var _a;
          if (!isOpen) return;
          const target = core.pickAnchorDate(
            appliedRange.start,
            minDateResolved,
            maxDateResolved
          );
          (_a = calLeftRef.current) == null ? void 0 : _a.focusCell(target);
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
      appliedRange,
      effDisabled,
      minDateResolved,
      maxDateResolved,
      closeSurface,
      setSurfaceOpen
    ]
  );
  React.useEffect(() => {
    if (!isOpen || !positioned) return;
    requestAnimationFrame(() => {
      var _a;
      const target = core.pickAnchorDate(
        appliedRange.start,
        minDateResolved,
        maxDateResolved
      );
      (_a = calLeftRef.current) == null ? void 0 : _a.focusCell(target);
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
  const popoverStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    ...(popoverProps == null ? void 0 : popoverProps.width) ? { width: popoverProps.width } : {},
    ...panelStyle ?? {}
  };
  const classes = [
    "arvo-cal-rng-drop",
    "arvo-cal-rng-drop--absolute",
    hasWeeks && "arvo-cal-rng-drop--show-weeks",
    className
  ].filter(Boolean).join(" ");
  if (!isMounted) return null;
  const isRangeComplete = !!(draftRange.start && draftRange.end);
  const navViewMode = viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days";
  return require$$0.createPortal(
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: popoverRef,
        id: popoverId,
        className: classes,
        role: "dialog",
        "aria-label": ariaLabel ?? "Choose a date range",
        "aria-modal": false,
        "data-arvo-side": panelSide,
        style: popoverStyle,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            CalendarNav.CalendarNav,
            {
              className: "arvo-cal-rng-drop__header",
              variant: "range",
              visibleYear: leftYear,
              visibleMonth: leftMonth,
              rangeEndYear: rightVisible.year,
              rangeEndMonth: rightVisible.month,
              viewMode: navViewMode,
              locale: effLocale,
              minDate: minDateResolved,
              maxDate: maxDateResolved,
              isDisabled: effDisabled,
              onPrev: handleHeaderPrev,
              onNext: handleHeaderNext,
              onToday: handleHeaderToday,
              onMonthButtonClick: () => setViewMode((m) => m === "months" ? "days" : "months"),
              onYearButtonClick: () => setViewMode((m) => m === "years" ? "days" : "years")
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-cal-rng-drop__body", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-cal-rng-drop__cal", children: /* @__PURE__ */ jsxRuntime.jsx(
              Calendar.default,
              {
                ...calendarProps ?? {},
                ref: calLeftRef,
                visibleYear: leftYear,
                visibleMonth: leftMonth,
                viewMode,
                locale: effLocale,
                weekStart,
                hasWeeks,
                rangeStart: draftRange.start,
                rangeEnd: draftRange.end,
                hoverDate,
                isRangeComplete,
                minDate: minDateResolved,
                maxDate: maxDateResolved,
                onCellSelect: handleCellSelect,
                onCellHover: handleCellHover,
                onMonthChange: (p) => {
                  setLeftYear(p.year);
                  setLeftMonth(p.month);
                },
                onViewModeChange: (p) => setViewMode(p.mode),
                onDismiss: handleProgrammaticClose
              }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-cal-rng-drop__cal", children: /* @__PURE__ */ jsxRuntime.jsx(
              Calendar.default,
              {
                ...calendarProps ?? {},
                ref: calRightRef,
                visibleYear: rightVisible.year,
                visibleMonth: rightVisible.month,
                viewMode,
                locale: effLocale,
                weekStart,
                hasWeeks,
                rangeStart: draftRange.start,
                rangeEnd: draftRange.end,
                hoverDate,
                isRangeComplete,
                minDate: minDateResolved,
                maxDate: maxDateResolved,
                onCellSelect: handleCellSelect,
                onCellHover: handleCellHover,
                onMonthChange: (p) => {
                  if (viewMode === "months" || viewMode === "quarters") {
                    setLeftYear(p.year - 1);
                    setLeftMonth(p.month);
                  } else if (viewMode === "years") {
                    setLeftYear(p.year - 10);
                    setLeftMonth(p.month);
                  } else {
                    const d = core.addMonths(new Date(p.year, p.month, 1), -1);
                    setLeftYear(d.getFullYear());
                    setLeftMonth(d.getMonth());
                  }
                },
                onViewModeChange: (p) => setViewMode(p.mode),
                onDismiss: handleProgrammaticClose
              }
            ) })
          ] })
        ]
      }
    ),
    document.body
  );
});
exports.ArvoCalendarRangeDropdown = ArvoCalendarRangeDropdown;
exports.default = ArvoCalendarRangeDropdown;
//# sourceMappingURL=index87.cjs.map
