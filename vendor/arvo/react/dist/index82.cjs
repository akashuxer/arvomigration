"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const core = require("@arvo/core");
const useOverlaySurface = require("./index92.cjs");
const useArvoLocale = require("./index11.cjs");
const IconButton = require("./index17.cjs");
const Button = require("./index16.cjs");
const ButtonGroup = require("./index30.cjs");
const Switch = require("./index26.cjs");
const FormLabel = require("./index12.cjs");
const MessageAlert = require("./index13.cjs");
const NumberInput = require("./index21.cjs");
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
function sameRange(a, b) {
  return sameDay(a.start, b.start) && sameDay(a.end, b.end);
}
function clampToBounds(v, min, max) {
  if (v == null) return null;
  if (min && v.getTime() < min.getTime()) return new Date(min.getTime());
  if (max && v.getTime() > max.getTime()) return new Date(max.getTime());
  return v;
}
function orderedRange(a, b) {
  return core.isAfterDay(a, b) ? [b, a] : [a, b];
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
const ZERO_ROLLING = { startOffset: 0, endOffset: 0 };
function sameRolling(a, b) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.startOffset === b.startOffset && a.endOffset === b.endOffset;
}
const RIGHT_ARROW = "→";
const noop = () => {
};
const ArvoDateRangePicker = React.forwardRef(
  function ArvoDateRangePicker2({
    startValue,
    endValue,
    format,
    locale,
    weekStart = 0,
    hasWeeks = true,
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
    frequency = null,
    memberData = null,
    currentMemberIndex = null,
    hasModeToggle = true,
    hasRolling = false,
    rollingPrefix = null,
    rollingValue = null,
    anchor = false,
    placement = "bottom-end",
    calendarProps,
    popoverProps,
    onChange,
    onModeChange,
    onOpen,
    onClose,
    onCancel,
    onSave,
    className,
    id
  }, ref) {
    var _a, _b, _c, _d;
    const uid = React.useId();
    const drpId = id ?? `arvo-drp-${uid}`;
    const inputId = `${drpId}-input`;
    const labelId = `${drpId}-lbl`;
    const errorId = `${drpId}-err`;
    const popoverId = `${drpId}-popover`;
    const contextLocale = useArvoLocale.useArvoLocale();
    const effLocale = React.useMemo(
      () => core.getUserLocale(locale ?? contextLocale),
      [locale, contextLocale]
    );
    const effFormat = React.useMemo(
      () => format && format.length > 0 ? format : core.getLocaleDateFormat(effLocale),
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
    const hasMemberCapability = Boolean(
      memberData && memberData.length > 0 && frequency
    );
    const hasRollingCapability = Boolean(hasRolling && hasMemberCapability);
    const memberIndex = React.useMemo(() => {
      if (!hasMemberCapability || !memberData || !frequency) return null;
      return core.buildMemberIndex(memberData, {
        frequency,
        currentMemberIndex: currentMemberIndex ?? null
      });
    }, [hasMemberCapability, memberData, frequency, currentMemberIndex]);
    const effMinDate = React.useMemo(() => {
      const userMin = minDateResolved;
      const memberMin = (memberIndex == null ? void 0 : memberIndex.minDate) ?? null;
      if (memberMin && userMin)
        return userMin.getTime() > memberMin.getTime() ? userMin : memberMin;
      return memberMin ?? userMin;
    }, [minDateResolved, memberIndex]);
    const effMaxDate = React.useMemo(() => {
      const userMax = maxDateResolved;
      const memberMax = (memberIndex == null ? void 0 : memberIndex.maxDate) ?? null;
      if (memberMax && userMax)
        return userMax.getTime() < memberMax.getTime() ? userMax : memberMax;
      return memberMax ?? userMax;
    }, [maxDateResolved, memberIndex]);
    const findMemberFor = React.useCallback(
      (date) => {
        if (!date || !memberIndex) return null;
        return core.findMemberForDate(memberIndex, date);
      },
      [memberIndex]
    );
    const snapDateToMember = React.useCallback(
      (date, edge) => {
        const m = findMemberFor(date);
        if (!m) return null;
        return edge === "start" ? m.keyDate : m.endDate;
      },
      [findMemberFor]
    );
    const enforceDistinctMembers = React.useCallback(
      (startMember, endMember) => {
        if (!memberIndex || startMember.key !== endMember.key) {
          return { start: startMember, end: endMember };
        }
        const next = core.getAdjacentMember(memberIndex, startMember, "next");
        if (next) return { start: startMember, end: next };
        const prev = core.getAdjacentMember(memberIndex, startMember, "prev");
        if (prev) return { start: prev, end: endMember };
        return { start: startMember, end: endMember };
      },
      [memberIndex]
    );
    const isStartControlled = startValue !== void 0;
    const isEndControlled = endValue !== void 0;
    const [appliedRange, setAppliedRange] = React.useState(() => ({
      start: clampToBounds(
        coerceDate(startValue ?? null, effFormat, effLocale),
        effMinDate,
        effMaxDate
      ),
      end: clampToBounds(
        coerceDate(endValue ?? null, effFormat, effLocale),
        effMinDate,
        effMaxDate
      )
    }));
    const appliedRangeRef = React.useRef(appliedRange);
    React.useEffect(() => {
      appliedRangeRef.current = appliedRange;
    }, [appliedRange]);
    React.useEffect(() => {
      if (!isStartControlled && !isEndControlled) return;
      const next = {
        start: isStartControlled ? clampToBounds(
          coerceDate(startValue, effFormat, effLocale),
          effMinDate,
          effMaxDate
        ) : appliedRangeRef.current.start,
        end: isEndControlled ? clampToBounds(
          coerceDate(endValue, effFormat, effLocale),
          effMinDate,
          effMaxDate
        ) : appliedRangeRef.current.end
      };
      if (!sameRange(next, appliedRangeRef.current)) {
        setAppliedRange(next);
        appliedRangeRef.current = next;
      }
    }, [startValue, endValue, effFormat, effLocale, isStartControlled, isEndControlled]);
    const [draftRange, setDraftRange] = React.useState(appliedRange);
    const draftRangeRef = React.useRef(draftRange);
    React.useEffect(() => {
      draftRangeRef.current = draftRange;
    }, [draftRange]);
    const [draftFirstSet, setDraftFirstSet] = React.useState(false);
    const [hoverDate, setHoverDate] = React.useState(null);
    const [memberToggle, setMemberToggle] = React.useState(hasMemberCapability);
    const [tab, setTab] = React.useState(
      hasRollingCapability && rollingValue ? "rolling" : "absolute"
    );
    const activeMode = (() => {
      if (hasRollingCapability && tab === "rolling") return "rolling";
      if (hasMemberCapability && memberToggle) return "member";
      return "absolute";
    })();
    const [appliedRolling, setAppliedRolling] = React.useState(
      rollingValue ?? null
    );
    const appliedRollingRef = React.useRef(appliedRolling);
    React.useEffect(() => {
      appliedRollingRef.current = appliedRolling;
    }, [appliedRolling]);
    const [draftRolling, setDraftRolling] = React.useState(
      rollingValue ?? ZERO_ROLLING
    );
    React.useEffect(() => {
      if (rollingValue === void 0) return;
      setAppliedRolling(rollingValue ?? null);
      appliedRollingRef.current = rollingValue ?? null;
      if (rollingValue) {
        setDraftRolling(rollingValue);
      }
    }, [rollingValue]);
    const initialVisible = React.useMemo(() => {
      const base = core.pickAnchorDate(
        appliedRange.start ?? appliedRange.end,
        effMinDate,
        effMaxDate
      );
      return { year: base.getFullYear(), month: base.getMonth() };
    }, []);
    const [visibleYear, setVisibleYear] = React.useState(initialVisible.year);
    const [visibleMonth, setVisibleMonth] = React.useState(initialVisible.month);
    const [viewMode, setViewMode] = React.useState("days");
    const [errorOverride, setErrorOverride] = React.useState(null);
    const [loadingOverride, setLoadingOverride] = React.useState(null);
    const rootRef = React.useRef(null);
    const fieldRef = React.useRef(null);
    const startInputRef = React.useRef(null);
    const endInputRef = React.useRef(null);
    const startCtrlRef = React.useRef(null);
    const endCtrlRef = React.useRef(null);
    const focusedSideRef = React.useRef(null);
    const actionsRef = React.useRef(null);
    const popoverRef = React.useRef(null);
    const anchorElementRef = React.useRef(null);
    const tilePanelScrollRef = React.useRef(null);
    const isOpenRef = React.useRef(false);
    const surfaceRef = React.useRef(null);
    const engineTriggerRef = React.useRef(null);
    const [startDisplay, setStartDisplay] = React.useState("");
    const [endDisplay, setEndDisplay] = React.useState("");
    const [focusedSide, setFocusedSide] = React.useState(null);
    const [caretTick, setCaretTick] = React.useState(0);
    const [firstVisibleMember, setFirstVisibleMember] = React.useState(null);
    const [lastVisibleMember, setLastVisibleMember] = React.useState(null);
    const isLoading = isLoadingProp === true;
    const effIsDisabled = isDisabled;
    const effIsLoading = (loadingOverride ?? isLoading) === true;
    const effError = errorOverride ?? (isInvalid ? errorMsg ?? null : null);
    const hasError = effError != null;
    const hasValue = appliedRange.start != null || appliedRange.end != null;
    const isAbsoluteEditable = isSegmented && activeMode === "absolute" && !isReadOnly && !effIsDisabled;
    const isAnchorMode = anchor !== false && anchor != null;
    const isAnchorFallback = anchor === true;
    const warnedAnchorTrueRef = React.useRef(false);
    if (isAnchorFallback && !warnedAnchorTrueRef.current) {
      console.warn(
        "[ArvoDateRangePicker] anchor={true} requires a host element in React; falling back to input mode."
      );
      warnedAnchorTrueRef.current = true;
    }
    const useAnchorRender = isAnchorMode && !isAnchorFallback;
    const formatSideDate = React.useCallback(
      (d) => {
        if (!d) return "";
        if (hasMemberCapability) {
          const m = findMemberFor(d);
          if (m) return m.displayName;
        }
        return core.formatDate(d, effFormat, effLocale);
      },
      [effFormat, effLocale, hasMemberCapability, findMemberFor]
    );
    const formatRollingSide = React.useCallback(
      (offset) => {
        const prefix = rollingPrefix ?? "";
        return offset > 0 ? `${prefix} +${offset}` : `${prefix} ${offset}`;
      },
      [rollingPrefix]
    );
    const baseStartText = React.useMemo(() => {
      if (appliedRolling && !appliedRange.start && !appliedRange.end) {
        return formatRollingSide(appliedRolling.startOffset);
      }
      return formatSideDate(appliedRange.start);
    }, [appliedRange, appliedRolling, formatSideDate, formatRollingSide]);
    const baseEndText = React.useMemo(() => {
      if (appliedRolling && !appliedRange.start && !appliedRange.end) {
        return formatRollingSide(appliedRolling.endOffset);
      }
      return formatSideDate(appliedRange.end);
    }, [appliedRange, appliedRolling, formatSideDate, formatRollingSide]);
    const handleOpen = React.useCallback(() => {
      var _a2, _b2;
      if (isOpenRef.current) return;
      if (effIsDisabled || effIsLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const evt = new CustomEvent("drp:open", { bubbles: true, cancelable: true });
      (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      if (hasRollingCapability && appliedRollingRef.current) {
        setTab("rolling");
        setDraftRolling(appliedRollingRef.current);
      } else if (!hasRollingCapability || appliedRollingRef.current == null) {
        setTab("absolute");
      }
      const center = core.pickAnchorDate(
        appliedRangeRef.current.start ?? appliedRangeRef.current.end,
        effMinDate,
        effMaxDate
      );
      setVisibleYear(center.getFullYear());
      setVisibleMonth(center.getMonth());
      setViewMode("days");
      setDraftRange(appliedRangeRef.current);
      draftRangeRef.current = appliedRangeRef.current;
      setDraftFirstSet(false);
      setHoverDate(null);
      (_b2 = surfaceRef.current) == null ? void 0 : _b2.open();
    }, [
      effIsDisabled,
      effIsLoading,
      isReadOnly,
      onOpen,
      hasRollingCapability,
      effMinDate,
      effMaxDate
    ]);
    const handleClose = React.useCallback(() => {
      var _a2, _b2;
      if (!isOpenRef.current) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const evt = new CustomEvent("drp:close", { bubbles: true, cancelable: true });
      (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(evt);
      if (evt.defaultPrevented) return;
      setDraftRange(appliedRangeRef.current);
      draftRangeRef.current = appliedRangeRef.current;
      setDraftFirstSet(false);
      setHoverDate(null);
      (_b2 = surfaceRef.current) == null ? void 0 : _b2.close();
    }, [onClose]);
    const handleEngineClose = React.useCallback(() => {
      requestAnimationFrame(() => {
        const focusTarget = anchorElementRef.current ?? startInputRef.current;
        focusTarget == null ? void 0 : focusTarget.focus({ preventScroll: true });
      });
    }, []);
    React.useEffect(() => {
      if (effIsLoading && isOpenRef.current) handleClose();
    }, [effIsLoading, handleClose]);
    const commitRange = React.useCallback(
      (next, mode) => {
        var _a2;
        const clamped = {
          start: clampToBounds(next.start, effMinDate, effMaxDate),
          end: clampToBounds(next.end, effMinDate, effMaxDate)
        };
        if (clamped.start && clamped.end && core.isAfterDay(clamped.start, clamped.end)) {
          const [s, e] = orderedRange(clamped.start, clamped.end);
          clamped.start = s;
          clamped.end = e;
        }
        const changed = !sameRange(clamped, appliedRangeRef.current);
        const previouslyRolling = appliedRollingRef.current;
        if (mode !== "rolling") {
          setAppliedRolling(null);
          appliedRollingRef.current = null;
        }
        if (!changed && !previouslyRolling) return false;
        if (!isStartControlled && !isEndControlled) {
          setAppliedRange(clamped);
        }
        appliedRangeRef.current = clamped;
        const formattedStart = clamped.start ? core.formatDate(clamped.start, effFormat, effLocale) : "";
        const formattedEnd = clamped.end ? core.formatDate(clamped.end, effFormat, effLocale) : "";
        const memberRange = hasMemberCapability && memberIndex ? {
          start: findMemberFor(clamped.start),
          end: findMemberFor(clamped.end)
        } : void 0;
        const payload = {
          start: clamped.start,
          end: clamped.end,
          formatted: { start: formattedStart, end: formattedEnd },
          mode,
          memberRange
        };
        onChange == null ? void 0 : onChange(payload);
        (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(
          new CustomEvent("drp:change", { bubbles: true, detail: payload })
        );
        return true;
      },
      [
        effMinDate,
        effMaxDate,
        isStartControlled,
        isEndControlled,
        effFormat,
        effLocale,
        hasMemberCapability,
        memberIndex,
        findMemberFor,
        onChange
      ]
    );
    const commitRolling = React.useCallback(
      (range) => {
        var _a2, _b2, _c2;
        if (!memberIndex) return false;
        const resolved = core.rollingRangeToMembers(memberIndex, range);
        const next = {
          start: ((_a2 = resolved.start) == null ? void 0 : _a2.keyDate) ?? null,
          end: ((_b2 = resolved.end) == null ? void 0 : _b2.keyDate) ?? null
        };
        const changed = !sameRange(next, appliedRangeRef.current) || !sameRolling(range, appliedRollingRef.current);
        if (!isStartControlled && !isEndControlled) setAppliedRange(next);
        appliedRangeRef.current = next;
        setAppliedRolling(range);
        appliedRollingRef.current = range;
        const memberRange = {
          start: resolved.start,
          end: resolved.end
        };
        const payload = {
          start: next.start,
          end: next.end,
          formatted: {
            start: next.start ? core.formatDate(next.start, effFormat, effLocale) : "",
            end: next.end ? core.formatDate(next.end, effFormat, effLocale) : ""
          },
          mode: "rolling",
          memberRange,
          rollingValue: range
        };
        if (changed) {
          onChange == null ? void 0 : onChange(payload);
          (_c2 = rootRef.current) == null ? void 0 : _c2.dispatchEvent(
            new CustomEvent("drp:change", { bubbles: true, detail: payload })
          );
        }
        return changed;
      },
      [
        memberIndex,
        isStartControlled,
        isEndControlled,
        effFormat,
        effLocale,
        onChange
      ]
    );
    const refreshStartDisplay = React.useCallback(() => {
      const ctrl = startCtrlRef.current;
      if (ctrl) setStartDisplay(ctrl.getFormattedDisplay(focusedSideRef.current === "start"));
    }, []);
    const refreshEndDisplay = React.useCallback(() => {
      const ctrl = endCtrlRef.current;
      if (ctrl) setEndDisplay(ctrl.getFormattedDisplay(focusedSideRef.current === "end"));
    }, []);
    const commitSide = React.useCallback(
      (side, date) => {
        const cur = appliedRangeRef.current;
        let resolved = date;
        if (hasMemberCapability && date != null) {
          const snapped = snapDateToMember(date, side);
          if (snapped == null) {
            const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
            const reverted = side === "start" ? cur.start : cur.end;
            if (ctrl) ctrl.setValue(reverted, { silent: true });
            const refresh = side === "start" ? refreshStartDisplay : refreshEndDisplay;
            refresh();
            return;
          }
          resolved = snapped;
        }
        const next = side === "start" ? { start: resolved, end: cur.end } : { start: cur.start, end: resolved };
        commitRange(next, "absolute");
      },
      [
        commitRange,
        hasMemberCapability,
        snapDateToMember,
        refreshStartDisplay,
        refreshEndDisplay
      ]
    );
    React.useEffect(() => {
      var _a2, _b2;
      if (!isAbsoluteEditable) {
        (_a2 = startCtrlRef.current) == null ? void 0 : _a2.destroy();
        (_b2 = endCtrlRef.current) == null ? void 0 : _b2.destroy();
        startCtrlRef.current = null;
        endCtrlRef.current = null;
        return;
      }
      const make = (side) => {
        const ctrl = core.createSegmentController({
          format: effFormat,
          locale: effLocale,
          value: side === "start" ? appliedRangeRef.current.start : appliedRangeRef.current.end,
          min: effMinDate,
          max: effMaxDate,
          commit: "blur"
        });
        const refresh = side === "start" ? refreshStartDisplay : refreshEndDisplay;
        const offCommit = ctrl.on("commit", (p) => {
          commitSide(side, p.date);
        });
        const offSegment = ctrl.on("segment", () => {
          setFocusedSide(focusedSideRef.current);
          setCaretTick((t) => t + 1);
        });
        const offChange = ctrl.on("change", () => refresh());
        return {
          ctrl,
          off: () => {
            offCommit();
            offSegment();
            offChange();
            ctrl.destroy();
          }
        };
      };
      const s = make("start");
      const e = make("end");
      startCtrlRef.current = s.ctrl;
      endCtrlRef.current = e.ctrl;
      refreshStartDisplay();
      refreshEndDisplay();
      return () => {
        s.off();
        e.off();
        startCtrlRef.current = null;
        endCtrlRef.current = null;
      };
    }, [
      isAbsoluteEditable,
      effFormat,
      effLocale,
      effMinDate == null ? void 0 : effMinDate.getTime(),
      effMaxDate == null ? void 0 : effMaxDate.getTime()
    ]);
    React.useEffect(() => {
      var _a2, _b2;
      const overrideDisplay = hasMemberCapability;
      if (isAbsoluteEditable) {
        (_a2 = startCtrlRef.current) == null ? void 0 : _a2.setValue(appliedRange.start, { silent: true });
        (_b2 = endCtrlRef.current) == null ? void 0 : _b2.setValue(appliedRange.end, { silent: true });
      }
      if (overrideDisplay) {
        if (focusedSideRef.current !== "start") setStartDisplay(baseStartText);
        if (focusedSideRef.current !== "end") setEndDisplay(baseEndText);
      } else if (isAbsoluteEditable) {
        if (focusedSideRef.current !== "start") refreshStartDisplay();
        if (focusedSideRef.current !== "end") refreshEndDisplay();
      } else {
        setStartDisplay(baseStartText);
        setEndDisplay(baseEndText);
      }
    }, [
      isAbsoluteEditable,
      hasMemberCapability,
      baseStartText,
      baseEndText,
      (_a = appliedRange.start) == null ? void 0 : _a.getTime(),
      (_b = appliedRange.end) == null ? void 0 : _b.getTime()
    ]);
    const focusEndFirst = React.useCallback(() => {
      var _a2, _b2;
      (_a2 = endInputRef.current) == null ? void 0 : _a2.focus();
      (_b2 = endCtrlRef.current) == null ? void 0 : _b2.focusSegment(0);
    }, []);
    const focusStartLast = React.useCallback(() => {
      var _a2, _b2, _c2;
      (_a2 = startInputRef.current) == null ? void 0 : _a2.focus();
      const segs = ((_b2 = startCtrlRef.current) == null ? void 0 : _b2.getValue().segments) ?? [];
      (_c2 = startCtrlRef.current) == null ? void 0 : _c2.focusSegment(Math.max(0, segs.length - 1));
    }, []);
    const handleSegFocus = React.useCallback(
      (side) => () => {
        focusedSideRef.current = side;
        if (!isAbsoluteEditable) return;
        const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
        if (!ctrl) return;
        const setter = side === "start" ? setStartDisplay : setEndDisplay;
        setter(ctrl.getFormattedDisplay(true));
        ctrl.focusSegment(0);
      },
      [isAbsoluteEditable]
    );
    const handleSegMouseDown = React.useCallback(
      (side) => () => {
        if (!isAbsoluteEditable) return;
        const input = side === "start" ? startInputRef.current : endInputRef.current;
        if (!input) return;
        requestAnimationFrame(() => {
          if (document.activeElement !== input) return;
          const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
          if (!ctrl) return;
          const offset = input.selectionStart ?? null;
          if (offset === null) return;
          const idx = ctrl.findSegmentForOffset(offset);
          if (idx !== null) ctrl.focusSegment(idx);
        });
      },
      [isAbsoluteEditable]
    );
    const handleSegBlur = React.useCallback(
      (side) => () => {
        if (focusedSideRef.current === side) focusedSideRef.current = null;
        const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
        const setter = side === "start" ? setStartDisplay : setEndDisplay;
        if (hasMemberCapability) {
          setter(side === "start" ? baseStartText : baseEndText);
        } else if (isAbsoluteEditable && ctrl) {
          setter(ctrl.getFormattedDisplay(false));
        }
        setFocusedSide(null);
      },
      [isAbsoluteEditable, hasMemberCapability, baseStartText, baseEndText]
    );
    const handleSegPaste = React.useCallback(
      (side) => (e) => {
        const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
        if (!isAbsoluteEditable || !ctrl) return;
        const res = ctrl.handlePaste(e.clipboardData.getData("text"));
        if (res.consumed) e.preventDefault();
      },
      [isAbsoluteEditable]
    );
    const handleSegKeyDown = React.useCallback(
      (side) => (e) => {
        if (e.altKey && e.key === "ArrowDown") {
          e.preventDefault();
          if (!isOpenRef.current) handleOpen();
          return;
        }
        if (e.altKey && e.key === "ArrowUp") {
          e.preventDefault();
          if (isOpenRef.current) handleClose();
          return;
        }
        if (!isAbsoluteEditable) {
          if (e.key === "Escape" && isOpenRef.current) {
            e.preventDefault();
            handleClose();
          }
          return;
        }
        const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
        if (!ctrl) return;
        const key = e.key;
        const segs = ctrl.getValue().segments;
        const focused = ctrl.getFocusedSegment();
        const lastIdx = segs.length - 1;
        if (key === "Escape") {
          e.preventDefault();
          ctrl.handleKey({ key: "Escape" });
          if (focusedSideRef.current === side) {
            const setter = side === "start" ? setStartDisplay : setEndDisplay;
            setter(ctrl.getFormattedDisplay(true));
            ctrl.focusSegment(0);
          }
          if (isOpen) handleClose();
          return;
        }
        if (key === "ArrowRight" && side === "start" && focused && focused.index === lastIdx) {
          e.preventDefault();
          focusEndFirst();
          return;
        }
        if (key === "ArrowLeft" && side === "end" && focused && focused.index === 0) {
          e.preventDefault();
          focusStartLast();
          return;
        }
        if (key === "Tab") {
          const res = ctrl.handleKey({ key: "Tab", shiftKey: e.shiftKey });
          if (res.consumed) e.preventDefault();
          return;
        }
        if (key === "Enter") {
          e.preventDefault();
          ctrl.handleKey({ key: "Enter" });
          if (isOpenRef.current && isAutoClose) handleClose();
          return;
        }
        if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown" || key === "Home" || key === "End" || key === "Backspace" || key === "Delete") {
          const res = ctrl.handleKey({ key });
          if (res.consumed) e.preventDefault();
          return;
        }
        if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
          if (/^[0-9]$/.test(key)) {
            const wasLast = side === "start" && focused != null && focused.index === lastIdx;
            const res = ctrl.handleDigit(key);
            if (res.consumed) e.preventDefault();
            if (res.advance && wasLast) focusEndFirst();
            return;
          }
          if (/^[A-Za-z]$/.test(key)) {
            const res = ctrl.handleLetter(key);
            if (res.consumed) e.preventDefault();
            return;
          }
        }
      },
      [
        isAbsoluteEditable,
        isAutoClose,
        handleOpen,
        handleClose,
        focusEndFirst,
        focusStartLast
      ]
    );
    React.useLayoutEffect(() => {
      if (!isAbsoluteEditable) return;
      const side = focusedSideRef.current;
      if (!side) return;
      const ctrl = side === "start" ? startCtrlRef.current : endCtrlRef.current;
      const input = side === "start" ? startInputRef.current : endInputRef.current;
      if (!ctrl || !input) return;
      const seg = ctrl.getFocusedSegment();
      if (!seg) return;
      try {
        input.setSelectionRange(seg.startOffset, seg.endOffset);
      } catch {
      }
    }, [caretTick, startDisplay, endDisplay, isAbsoluteEditable]);
    const handleTriggerClick = React.useCallback(() => {
      if (effIsLoading) return;
      if (effIsDisabled || isReadOnly) return;
      if (isOpenRef.current) handleClose();
      else handleOpen();
    }, [effIsLoading, effIsDisabled, isReadOnly, handleOpen, handleClose]);
    const handleClearClick = React.useCallback(
      (e) => {
        e.stopPropagation();
        commitRange({ start: null, end: null }, activeMode);
      },
      [commitRange, activeMode]
    );
    const handleMemberToggle = React.useCallback(
      (checked) => {
        var _a2;
        setMemberToggle(checked);
        setDraftFirstSet(false);
        setHoverDate(null);
        setDraftRange(appliedRangeRef.current);
        draftRangeRef.current = appliedRangeRef.current;
        const newMode = checked ? "member" : "absolute";
        onModeChange == null ? void 0 : onModeChange({ mode: newMode });
        const evt = new CustomEvent("drp:mode-change", {
          bubbles: true,
          cancelable: true,
          detail: { mode: newMode }
        });
        (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(evt);
      },
      [onModeChange]
    );
    const handleTabChange = React.useCallback(
      (next) => {
        var _a2;
        if (next === tab) return;
        setTab(next);
        if (next === "rolling") {
          setDraftRolling(appliedRollingRef.current ?? ZERO_ROLLING);
        } else {
          setDraftRange(appliedRangeRef.current);
          draftRangeRef.current = appliedRangeRef.current;
          setMemberToggle(false);
        }
        setDraftFirstSet(false);
        setHoverDate(null);
        const newMode = next === "rolling" ? "rolling" : next === "absolute" ? "absolute" : memberToggle ? "member" : "absolute";
        onModeChange == null ? void 0 : onModeChange({ mode: newMode });
        const evt = new CustomEvent("drp:mode-change", {
          bubbles: true,
          cancelable: true,
          detail: { mode: newMode }
        });
        (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(evt);
      },
      [tab, memberToggle, onModeChange]
    );
    const handleCalendarCellSelect = React.useCallback(
      (payload) => {
        const { date, mode } = payload;
        if (!date) return;
        if (mode !== "days") {
          setVisibleYear(date.getFullYear());
          setVisibleMonth(date.getMonth());
          if (mode === "months") setViewMode("days");
          else if (mode === "years") setViewMode("months");
          return;
        }
        const memberCapable = hasMemberCapability && memberIndex != null;
        if (!draftFirstSet) {
          const startDate = memberCapable ? snapDateToMember(date, "start") ?? date : date;
          setDraftRange({ start: startDate, end: null });
          draftRangeRef.current = { start: startDate, end: null };
          setDraftFirstSet(true);
          setHoverDate(startDate);
          return;
        }
        const first = draftRangeRef.current.start ?? date;
        let next;
        if (memberCapable) {
          const firstMember = findMemberFor(first);
          const clickMember = findMemberFor(date);
          if (!firstMember || !clickMember) return;
          let startMember;
          let endMember;
          if (firstMember.keyDate.getTime() <= clickMember.keyDate.getTime()) {
            startMember = firstMember;
            endMember = clickMember;
          } else {
            startMember = clickMember;
            endMember = firstMember;
          }
          const corrected = enforceDistinctMembers(startMember, endMember);
          next = {
            start: corrected.start.keyDate,
            end: corrected.end.endDate
          };
        } else {
          const [s, e] = orderedRange(first, date);
          next = { start: s, end: e };
        }
        setDraftRange(next);
        draftRangeRef.current = next;
        setDraftFirstSet(false);
        setHoverDate(null);
        commitRange(next, activeMode);
        if (isAutoClose && activeMode !== "rolling") handleClose();
      },
      [
        draftFirstSet,
        commitRange,
        activeMode,
        isAutoClose,
        handleClose,
        hasMemberCapability,
        memberIndex,
        snapDateToMember,
        findMemberFor,
        enforceDistinctMembers
      ]
    );
    const handleCalendarCellHover = React.useCallback(
      (payload) => {
        if (!draftFirstSet) return;
        setHoverDate(payload.date ?? null);
      },
      [draftFirstSet]
    );
    const handleTileClick = React.useCallback(
      (member) => {
        if (activeMode === "rolling") return;
        if (!draftFirstSet) {
          setDraftRange({ start: member.keyDate, end: null });
          draftRangeRef.current = { start: member.keyDate, end: null };
          setDraftFirstSet(true);
          setHoverDate(member.keyDate);
          return;
        }
        const firstStart = draftRangeRef.current.start;
        const firstMember = firstStart ? findMemberFor(firstStart) : null;
        if (!firstMember) {
          setDraftRange({ start: member.keyDate, end: null });
          draftRangeRef.current = { start: member.keyDate, end: null };
          setDraftFirstSet(true);
          setHoverDate(member.keyDate);
          return;
        }
        let startMember;
        let endMember;
        if (firstMember.keyDate.getTime() <= member.keyDate.getTime()) {
          startMember = firstMember;
          endMember = member;
        } else {
          startMember = member;
          endMember = firstMember;
        }
        const corrected = enforceDistinctMembers(startMember, endMember);
        const next = {
          start: corrected.start.keyDate,
          end: corrected.end.endDate
        };
        setDraftRange(next);
        draftRangeRef.current = next;
        setDraftFirstSet(false);
        setHoverDate(null);
        commitRange(next, "member");
        if (isAutoClose) handleClose();
      },
      [
        activeMode,
        draftFirstSet,
        commitRange,
        isAutoClose,
        handleClose,
        findMemberFor,
        enforceDistinctMembers
      ]
    );
    const handleTileHover = React.useCallback((member) => {
      if (!draftFirstSetRefCurrent()) return;
      setHoverDate((member == null ? void 0 : member.keyDate) ?? null);
    }, []);
    const draftFirstSetRef = React.useRef(draftFirstSet);
    React.useEffect(() => {
      draftFirstSetRef.current = draftFirstSet;
    }, [draftFirstSet]);
    function draftFirstSetRefCurrent() {
      return draftFirstSetRef.current;
    }
    const parseOffset = (e) => {
      const raw = e.target.value;
      if (!raw) return 0;
      const n = Number.parseInt(raw, 10);
      return Number.isFinite(n) ? n : 0;
    };
    const handleRollingStartChange = React.useCallback(
      (e) => {
        const v = parseOffset(e);
        setDraftRolling((prev) => {
          let next = { ...prev, startOffset: v };
          if (next.startOffset > next.endOffset) {
            next = { ...next, endOffset: v };
          }
          return next;
        });
      },
      []
    );
    const handleRollingEndChange = React.useCallback(
      (e) => {
        const v = parseOffset(e);
        setDraftRolling((prev) => {
          let next = { ...prev, endOffset: v };
          if (next.endOffset < next.startOffset) {
            next = { ...next, startOffset: v };
          }
          return next;
        });
      },
      []
    );
    const rollingDirty = !sameRolling(draftRolling, appliedRolling);
    const handleSaveRolling = React.useCallback(() => {
      var _a2;
      if (!hasRollingCapability) return;
      commitRolling(draftRolling);
      onSave == null ? void 0 : onSave();
      (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(
        new CustomEvent("drp:save", { bubbles: true, detail: {} })
      );
      handleClose();
    }, [hasRollingCapability, commitRolling, draftRolling, onSave, handleClose]);
    const handleCancelRolling = React.useCallback(() => {
      var _a2;
      onCancel == null ? void 0 : onCancel();
      (_a2 = rootRef.current) == null ? void 0 : _a2.dispatchEvent(
        new CustomEvent("drp:cancel", { bubbles: true, detail: {} })
      );
      setDraftRolling(appliedRolling ?? ZERO_ROLLING);
      handleClose();
    }, [onCancel, appliedRolling, handleClose]);
    const scrollTilePanelByPage = React.useCallback(
      (direction) => {
        const scroller = tilePanelScrollRef.current;
        if (!scroller) return false;
        const page = scroller.clientHeight || 240;
        const delta = direction === "prev" ? -page : page;
        scroller.scrollBy({ top: delta, behavior: "smooth" });
        return true;
      },
      []
    );
    const handleHeaderPrev = React.useCallback(() => {
      if ((activeMode === "member" || activeMode === "rolling") && scrollTilePanelByPage("prev")) {
        return;
      }
      if (viewMode === "days") {
        const next = core.addMonths(new Date(visibleYear, visibleMonth, 1), -1);
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      } else if (viewMode === "months") {
        setVisibleYear((y) => y - 1);
      } else {
        setVisibleYear((y) => y - 10);
      }
    }, [viewMode, visibleYear, visibleMonth, activeMode, scrollTilePanelByPage]);
    const handleHeaderNext = React.useCallback(() => {
      if ((activeMode === "member" || activeMode === "rolling") && scrollTilePanelByPage("next")) {
        return;
      }
      if (viewMode === "days") {
        const next = core.addMonths(new Date(visibleYear, visibleMonth, 1), 1);
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      } else if (viewMode === "months") {
        setVisibleYear((y) => y + 1);
      } else {
        setVisibleYear((y) => y + 10);
      }
    }, [viewMode, visibleYear, visibleMonth, activeMode, scrollTilePanelByPage]);
    const handleHeaderToday = React.useCallback(() => {
      const today = /* @__PURE__ */ new Date();
      setVisibleYear(today.getFullYear());
      setVisibleMonth(today.getMonth());
    }, []);
    const rightVisible = React.useMemo(() => {
      if (viewMode === "months" || viewMode === "quarters") {
        return { year: visibleYear + 1, month: visibleMonth };
      }
      if (viewMode === "years") {
        return { year: visibleYear + 10, month: visibleMonth };
      }
      const d = core.addMonths(new Date(visibleYear, visibleMonth, 1), 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    }, [visibleYear, visibleMonth, viewMode]);
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
        if (isOpenRef.current) handleClose();
        else handleOpen();
      };
      const onKeyDown = (ev) => {
        if (ev.altKey && ev.key === "ArrowDown") {
          ev.preventDefault();
          if (!isOpenRef.current) handleOpen();
        } else if (ev.altKey && ev.key === "ArrowUp") {
          ev.preventDefault();
          if (isOpenRef.current) handleClose();
        } else if (ev.key === "Escape") {
          if (isOpenRef.current) {
            ev.preventDefault();
            handleClose();
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
      handleOpen,
      handleClose
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
    const getOrderedPopoverElements = React.useCallback(() => {
      const root = popoverRef.current;
      if (!root) return [];
      const calendarCells = Array.from(
        root.querySelectorAll('.arvo-cal__cell[tabindex="0"]')
      );
      const firstTile = root.querySelector(
        '.arvo-drp__mtg-tile[tabindex="0"]'
      );
      const monthBtns = Array.from(
        root.querySelectorAll(".arvo-cal-nav__month-btn")
      );
      const yearBtns = Array.from(
        root.querySelectorAll(".arvo-cal-nav__year-btn")
      );
      const interleavedMY = [];
      const monthYearPairs = Math.max(monthBtns.length, yearBtns.length);
      for (let i = 0; i < monthYearPairs; i += 1) {
        if (monthBtns[i]) interleavedMY.push(monthBtns[i]);
        if (yearBtns[i]) interleavedMY.push(yearBtns[i]);
      }
      const prev = root.querySelector(".arvo-cal-nav__prev");
      const next = root.querySelector(".arvo-cal-nav__next");
      const today = root.querySelector(".arvo-cal-nav__today");
      const switchEl = root.querySelector(
        ".arvo-drp__hdr-switch input"
      );
      const tabBtns = Array.from(
        root.querySelectorAll(".arvo-drp__hdr-tabs button[data-value]")
      );
      const rollingInputs = Array.from(
        root.querySelectorAll(".arvo-drp__rolling-block input")
      );
      const footerCancel = root.querySelector(".arvo-drp__footer-cancel");
      const footerSave = root.querySelector(".arvo-drp__footer-save");
      let raw;
      if (rollingInputs.length > 0) {
        raw = [
          ...tabBtns,
          ...rollingInputs,
          footerCancel,
          footerSave
        ];
      } else if (firstTile) {
        raw = [firstTile, switchEl, prev, next, ...tabBtns];
      } else {
        raw = [
          ...calendarCells,
          prev,
          ...interleavedMY,
          next,
          today,
          switchEl,
          ...tabBtns
        ];
      }
      return raw.filter((el) => {
        if (!el) return false;
        const native = el;
        if (native.disabled === true) return false;
        if (el.hasAttribute("disabled")) return false;
        if (el.getAttribute("aria-disabled") === "true") return false;
        return true;
      });
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
      getOrderedElements: getOrderedPopoverElements,
      returnFocus: false,
      closeOnOutside: true,
      closeOnEscape: false,
      transition: "fade",
      transitionDuration: 150,
      haspopup: "dialog",
      controlsId: popoverId,
      emitStyle: true
    });
    const {
      isOpen,
      isMounted,
      positioned: _positioned,
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
    React.useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        if (activeMode === "rolling") {
          handleCancelRolling();
        } else {
          handleClose();
        }
      };
      const pop = popoverRef.current;
      pop == null ? void 0 : pop.addEventListener("keydown", onKeyDown);
      return () => pop == null ? void 0 : pop.removeEventListener("keydown", onKeyDown);
    }, [isOpen, activeMode, handleClose, handleCancelRolling]);
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
    React.useEffect(() => {
      if (!isOpen || activeMode !== "member" && activeMode !== "rolling") {
        return;
      }
      const scroller = tilePanelScrollRef.current;
      if (!scroller || !memberIndex) return;
      let rafId = null;
      const recompute = () => {
        rafId = null;
        const tiles = scroller.querySelectorAll(".arvo-drp__mtg-tile");
        if (tiles.length === 0) return;
        const containerRect = scroller.getBoundingClientRect();
        let firstIdx = -1;
        let lastIdx = -1;
        for (let i = 0; i < tiles.length; i += 1) {
          const tileRect = tiles[i].getBoundingClientRect();
          if (tileRect.top >= containerRect.top - 1 && tileRect.bottom <= containerRect.bottom + 1) {
            if (firstIdx === -1) firstIdx = i;
            lastIdx = i;
          }
        }
        if (firstIdx === -1) {
          for (let i = 0; i < tiles.length; i += 1) {
            const tileRect = tiles[i].getBoundingClientRect();
            if (tileRect.bottom > containerRect.top) {
              firstIdx = i;
              break;
            }
          }
          lastIdx = firstIdx;
        }
        const members = memberIndex.members;
        const first = firstIdx >= 0 ? members[firstIdx] ?? null : null;
        const last = lastIdx >= 0 ? members[lastIdx] ?? null : null;
        setFirstVisibleMember((prev) => (prev == null ? void 0 : prev.key) === (first == null ? void 0 : first.key) ? prev : first);
        setLastVisibleMember((prev) => (prev == null ? void 0 : prev.key) === (last == null ? void 0 : last.key) ? prev : last);
      };
      const onScroll = () => {
        if (rafId != null) return;
        rafId = requestAnimationFrame(recompute);
      };
      scroller.addEventListener("scroll", onScroll, { passive: true });
      const ro = new ResizeObserver(() => {
        if (rafId != null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(recompute);
      });
      ro.observe(scroller);
      rafId = requestAnimationFrame(recompute);
      return () => {
        scroller.removeEventListener("scroll", onScroll);
        ro.disconnect();
        if (rafId != null) cancelAnimationFrame(rafId);
      };
    }, [isOpen, activeMode, memberIndex]);
    React.useImperativeHandle(
      ref,
      () => {
        const NO_ARG = Symbol("NO_ARG");
        const handle = {
          open: () => handleOpen(),
          close: () => handleClose(),
          toggle: (force) => {
            var _a2;
            const next = force === void 0 ? !isOpenRef.current : force;
            (_a2 = surfaceRef.current) == null ? void 0 : _a2.setOpen(next);
          },
          range: ((v = NO_ARG) => {
            if (v === NO_ARG) return appliedRangeRef.current;
            const next = {
              start: clampToBounds(v.start, effMinDate, effMaxDate),
              end: clampToBounds(v.end, effMinDate, effMaxDate)
            };
            if (!isStartControlled && !isEndControlled) setAppliedRange(next);
            appliedRangeRef.current = next;
            return void 0;
          }),
          memberRange: ((v = NO_ARG) => {
            var _a2, _b2;
            if (v === NO_ARG) {
              return {
                start: findMemberFor(appliedRangeRef.current.start),
                end: findMemberFor(appliedRangeRef.current.end)
              };
            }
            const r = v;
            const next = {
              start: ((_a2 = r.start) == null ? void 0 : _a2.keyDate) ?? null,
              end: ((_b2 = r.end) == null ? void 0 : _b2.keyDate) ?? null
            };
            if (!isStartControlled && !isEndControlled) setAppliedRange(next);
            appliedRangeRef.current = next;
            return void 0;
          }),
          rolling: ((v = NO_ARG) => {
            var _a2, _b2;
            if (v === NO_ARG) return appliedRollingRef.current;
            const r = v;
            setAppliedRolling(r);
            appliedRollingRef.current = r;
            setDraftRolling(r);
            if (memberIndex) {
              const resolved = core.rollingRangeToMembers(memberIndex, r);
              const next = {
                start: ((_a2 = resolved.start) == null ? void 0 : _a2.keyDate) ?? null,
                end: ((_b2 = resolved.end) == null ? void 0 : _b2.keyDate) ?? null
              };
              if (!isStartControlled && !isEndControlled) setAppliedRange(next);
              appliedRangeRef.current = next;
            }
            return void 0;
          }),
          mode: ((m = NO_ARG) => {
            if (m === NO_ARG) return activeMode;
            if (m === "rolling") {
              if (hasRollingCapability) setTab("rolling");
            } else {
              setTab("absolute");
              setMemberToggle(m === "member" && hasMemberCapability);
            }
            return void 0;
          }),
          memberToggle: ((v = NO_ARG) => {
            if (v === NO_ARG) return memberToggle;
            setMemberToggle(Boolean(v));
            return void 0;
          }),
          clear: () => {
            commitRange({ start: null, end: null }, activeMode);
            setAppliedRolling(null);
            appliedRollingRef.current = null;
          },
          disabled: ((state = NO_ARG) => {
            if (state === NO_ARG) return effIsDisabled;
            console.warn(
              "[ArvoDateRangePicker] disabled() setter is a noop in React; pass isDisabled prop."
            );
            return void 0;
          }),
          setError: (message) => {
            setErrorOverride(message === false ? null : message);
          },
          setLoading: (loading) => setLoadingOverride(loading),
          focus: () => {
            var _a2;
            (_a2 = startInputRef.current) == null ? void 0 : _a2.focus();
          },
          destroy: () => {
          }
        };
        return handle;
      },
      // appliedRange / appliedRolling are intentionally accessed via ref
      // (appliedRangeRef / appliedRollingRef) inside the handle so the
      // imperative callbacks always see the latest value without forcing a
      // new handle identity on every commit. Listed only the deps that
      // actually flow into the closures directly.
      [
        handleOpen,
        handleClose,
        memberToggle,
        activeMode,
        hasMemberCapability,
        hasRollingCapability,
        memberIndex,
        findMemberFor,
        effMinDate,
        effMaxDate,
        isStartControlled,
        isEndControlled,
        commitRange,
        effIsDisabled
      ]
    );
    const classes = [
      "arvo-drp",
      `arvo-drp--${size}`,
      `arvo-drp--surface-${surfaceProp}`,
      `arvo-drp--${activeMode}`,
      isFullWidth && "arvo-drp--full-width",
      hasWeeks && "arvo-drp--show-weeks",
      useAnchorRender && "arvo-drp--anchor-mode",
      effIsDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      hasError && "has-error",
      hasError && errorDisplay === "tooltip" && "error-tooltip",
      hasValue && "has-value",
      focusedSide && "has-text-selected",
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
    const segPlaceholder = placeholder ?? effFormat;
    const fieldLabel = label ?? "Date range";
    const liveStart = draftRange.start;
    const liveEnd = draftRange.end ?? (draftFirstSet ? hoverDate : null);
    const rollingResolved = React.useMemo(() => {
      if (activeMode !== "rolling" || !memberIndex) return null;
      return core.rollingRangeToMembers(memberIndex, draftRolling);
    }, [activeMode, memberIndex, draftRolling]);
    const rollingStart = ((_c = rollingResolved == null ? void 0 : rollingResolved.start) == null ? void 0 : _c.keyDate) ?? null;
    const rollingEnd = ((_d = rollingResolved == null ? void 0 : rollingResolved.end) == null ? void 0 : _d.keyDate) ?? null;
    const rangeCountMessage = React.useMemo(() => {
      if (!memberIndex || activeMode !== "rolling") return null;
      return core.rollingIncludedMessage(memberIndex, draftRolling, void 0, effLocale);
    }, [activeMode, memberIndex, draftRolling, effLocale]);
    const currentMemberLabel = React.useMemo(() => {
      if (!memberIndex || !hasRollingCapability) return null;
      const current = core.resolveCurrentMember(memberIndex);
      if (!current) return null;
      const periodWord = frequency === "day" ? "Day" : frequency === "week" ? "Week" : frequency === "month" ? "Month" : frequency === "quarter" ? "Quarter" : "Year";
      const prefix = rollingPrefix ? ` (${rollingPrefix})` : "";
      return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        "Current ",
        periodWord,
        prefix,
        ":",
        " ",
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-drp__current-ind-value", children: current.displayName })
      ] });
    }, [memberIndex, hasRollingCapability, frequency, rollingPrefix]);
    const tabItems = React.useMemo(
      () => [
        { value: "absolute", label: "Absolute" },
        { value: "rolling", label: "Rolling" }
      ],
      []
    );
    const popoverBody = (() => {
      var _a2, _b2;
      if (activeMode === "absolute") {
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__body", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__cal", children: /* @__PURE__ */ jsxRuntime.jsx(
            Calendar.default,
            {
              ...calendarProps,
              visibleYear,
              visibleMonth,
              viewMode,
              locale: effLocale,
              weekStart,
              hasWeeks,
              rangeStart: liveStart,
              rangeEnd: liveEnd,
              hoverDate,
              isRangeComplete: !draftFirstSet,
              minDate: effMinDate,
              maxDate: effMaxDate,
              memberIndex,
              frequency: frequency ?? void 0,
              onCellSelect: handleCalendarCellSelect,
              onCellHover: handleCalendarCellHover,
              onMonthChange: (p) => {
                setVisibleYear(p.year);
                setVisibleMonth(p.month);
              },
              onViewModeChange: (p) => setViewMode(p.mode),
              onDismiss: handleClose
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__cal", children: /* @__PURE__ */ jsxRuntime.jsx(
            Calendar.default,
            {
              ...calendarProps,
              visibleYear: rightVisible.year,
              visibleMonth: rightVisible.month,
              viewMode,
              locale: effLocale,
              weekStart,
              hasWeeks,
              rangeStart: liveStart,
              rangeEnd: liveEnd,
              hoverDate,
              isRangeComplete: !draftFirstSet,
              minDate: effMinDate,
              maxDate: effMaxDate,
              memberIndex,
              frequency: frequency ?? void 0,
              onCellSelect: handleCalendarCellSelect,
              onCellHover: handleCalendarCellHover,
              onMonthChange: (p) => {
                if (viewMode === "months" || viewMode === "quarters") {
                  setVisibleYear(p.year - 1);
                  setVisibleMonth(p.month);
                } else if (viewMode === "years") {
                  setVisibleYear(p.year - 10);
                  setVisibleMonth(p.month);
                } else {
                  const d = core.addMonths(new Date(p.year, p.month, 1), -1);
                  setVisibleYear(d.getFullYear());
                  setVisibleMonth(d.getMonth());
                }
              },
              onViewModeChange: (p) => setViewMode(p.mode),
              onDismiss: handleClose
            }
          ) })
        ] });
      }
      const startMemberCmp = liveStart ? findMemberFor(liveStart) : null;
      const endMemberCmp = liveEnd ? findMemberFor(liveEnd) : null;
      const startKeyCmp = activeMode === "rolling" ? ((_a2 = rollingResolved == null ? void 0 : rollingResolved.start) == null ? void 0 : _a2.key) ?? null : (startMemberCmp == null ? void 0 : startMemberCmp.key) ?? null;
      const endKeyCmp = activeMode === "rolling" ? ((_b2 = rollingResolved == null ? void 0 : rollingResolved.end) == null ? void 0 : _b2.key) ?? null : (endMemberCmp == null ? void 0 : endMemberCmp.key) ?? null;
      const tilePanel = memberIndex ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__tile-panel", children: /* @__PURE__ */ jsxRuntime.jsx("div", { ref: tilePanelScrollRef, className: "arvo-drp__mtg-scroll", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__mtg-grid", role: "grid", children: memberIndex.members.map((m) => {
        const startCmp = activeMode === "rolling" ? rollingStart : liveStart;
        const endCmp = activeMode === "rolling" ? rollingEnd : liveEnd;
        const inRange = startCmp && endCmp ? !core.isBeforeDay(m.keyDate, startCmp) && !core.isAfterDay(m.keyDate, endCmp) : false;
        const isSelStart = startKeyCmp != null && m.key === startKeyCmp;
        const isSelEnd = endKeyCmp != null && m.key === endKeyCmp;
        const isCurrent = memberIndex.currentIndex != null && m.index === memberIndex.currentIndex;
        const tileClass = [
          "arvo-drp__mtg-tile",
          inRange && "in-range",
          (isSelStart || isSelEnd) && "selected",
          isCurrent && "current-member"
        ].filter(Boolean).join(" ");
        const tooltipContent = m.displayName;
        return /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            role: "gridcell",
            tabIndex: isCurrent ? 0 : -1,
            "aria-selected": isSelStart || isSelEnd,
            "aria-label": m.displayName,
            "data-arvo-tooltip": tooltipContent,
            className: tileClass,
            onClick: () => handleTileClick(m),
            onPointerEnter: () => handleTileHover(m),
            onPointerLeave: () => handleTileHover(null),
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-drp__mtg-tile-label", children: m.displayName })
          },
          m.key
        );
      }) }) }) }) : null;
      if (activeMode === "member") {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__body", children: tilePanel });
      }
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__body", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__rolling-setting", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__rolling-row", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__rolling-block", children: [
            /* @__PURE__ */ jsxRuntime.jsx("label", { className: "arvo-drp__rolling-lbl", htmlFor: `${drpId}-rolling-start`, children: "Start" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              NumberInput.default,
              {
                id: `${drpId}-rolling-start`,
                value: draftRolling.startOffset,
                prefix: rollingPrefix ?? void 0,
                prefixTooltip: rollingPrefix ?? void 0,
                isDisabled: effIsDisabled || isReadOnly,
                onChange: handleRollingStartChange
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__rolling-block", children: [
            /* @__PURE__ */ jsxRuntime.jsx("label", { className: "arvo-drp__rolling-lbl", htmlFor: `${drpId}-rolling-end`, children: "End" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              NumberInput.default,
              {
                id: `${drpId}-rolling-end`,
                value: draftRolling.endOffset,
                prefix: rollingPrefix ?? void 0,
                prefixTooltip: rollingPrefix ?? void 0,
                isDisabled: effIsDisabled || isReadOnly,
                onChange: handleRollingEndChange
              }
            )
          ] })
        ] }) }),
        rangeCountMessage && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__info-alert", "aria-live": "polite", children: /* @__PURE__ */ jsxRuntime.jsx(MessageAlert.ArvoMessageAlert, { type: "info", message: rangeCountMessage }) }),
        tilePanel
      ] });
    })();
    const memberRightZone = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      hasMemberCapability && hasModeToggle && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          Switch.default,
          {
            label: "Member",
            isChecked: memberToggle,
            onChange: (p) => handleMemberToggle(p.isChecked),
            className: "arvo-drp__hdr-switch"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-cal-nav__divider", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        IconButton.ArvoIconButton,
        {
          icon: "angle-up",
          size: "md",
          variant: "tertiary",
          tooltip: "Previous",
          isDisabled: effIsDisabled,
          onClick: handleHeaderPrev,
          className: "arvo-cal-nav__prev"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        IconButton.ArvoIconButton,
        {
          icon: "angle-down",
          size: "md",
          variant: "tertiary",
          tooltip: "Next",
          isDisabled: effIsDisabled,
          onClick: handleHeaderNext,
          className: "arvo-cal-nav__next"
        }
      ),
      hasRollingCapability && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-cal-nav__divider", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ButtonGroup.default,
          {
            size: "lg",
            items: tabItems,
            value: tab,
            ariaLabel: "Absolute or Rolling range",
            onChange: (p) => {
              const v = Array.isArray(p.value) ? p.value[0] : p.value;
              if (v === "absolute" || v === "rolling") handleTabChange(v);
            },
            className: "arvo-drp__hdr-tabs"
          }
        )
      ] })
    ] });
    const renderHeader = () => {
      var _a2, _b2;
      if (activeMode === "absolute") {
        if (hasMemberCapability) {
          return /* @__PURE__ */ jsxRuntime.jsx(
            CalendarNav.CalendarNav,
            {
              className: "arvo-drp__header arvo-drp__header--member-absolute",
              variant: "range",
              visibleYear,
              visibleMonth,
              rangeEndYear: rightVisible.year,
              rangeEndMonth: rightVisible.month,
              viewMode: viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days",
              locale: effLocale,
              minDate: effMinDate,
              maxDate: effMaxDate,
              isDisabled: effIsDisabled,
              onMonthButtonClick: () => setViewMode(viewMode === "months" ? "days" : "months"),
              onYearButtonClick: () => setViewMode(viewMode === "years" ? "days" : "years"),
              rightExtra: memberRightZone
            }
          );
        }
        return /* @__PURE__ */ jsxRuntime.jsx(
          CalendarNav.CalendarNav,
          {
            className: "arvo-drp__header",
            variant: "range",
            visibleYear,
            visibleMonth,
            rangeEndYear: rightVisible.year,
            rangeEndMonth: rightVisible.month,
            viewMode: viewMode === "days" || viewMode === "months" || viewMode === "years" ? viewMode : "days",
            locale: effLocale,
            minDate: effMinDate,
            maxDate: effMaxDate,
            isDisabled: effIsDisabled,
            onPrev: handleHeaderPrev,
            onNext: handleHeaderNext,
            onToday: handleHeaderToday,
            onMonthButtonClick: () => setViewMode(viewMode === "months" ? "days" : "months"),
            onYearButtonClick: () => setViewMode(viewMode === "years" ? "days" : "years")
          }
        );
      }
      if (activeMode === "member") {
        return /* @__PURE__ */ jsxRuntime.jsx(
          CalendarNav.CalendarNav,
          {
            className: "arvo-drp__header",
            variant: "member",
            visibleYear,
            visibleMonth,
            leftPrimaryLabel: (firstVisibleMember == null ? void 0 : firstVisibleMember.displayName) ?? "",
            leftSecondaryLabel: (lastVisibleMember == null ? void 0 : lastVisibleMember.displayName) ?? "",
            locale: effLocale,
            isDisabled: effIsDisabled,
            rightExtra: memberRightZone
          }
        );
      }
      const rollingStartLabel = (firstVisibleMember == null ? void 0 : firstVisibleMember.displayName) ?? ((_a2 = rollingResolved == null ? void 0 : rollingResolved.start) == null ? void 0 : _a2.displayName) ?? "";
      const rollingEndLabel = (lastVisibleMember == null ? void 0 : lastVisibleMember.displayName) ?? ((_b2 = rollingResolved == null ? void 0 : rollingResolved.end) == null ? void 0 : _b2.displayName) ?? "";
      const rollingRightExtra = hasRollingCapability ? /* @__PURE__ */ jsxRuntime.jsx(
        ButtonGroup.default,
        {
          size: "lg",
          items: tabItems,
          value: tab,
          ariaLabel: "Absolute or Rolling range",
          onChange: (p) => {
            const v = Array.isArray(p.value) ? p.value[0] : p.value;
            if (v === "absolute" || v === "rolling") handleTabChange(v);
          },
          className: "arvo-drp__hdr-tabs"
        }
      ) : null;
      return /* @__PURE__ */ jsxRuntime.jsx(
        CalendarNav.CalendarNav,
        {
          className: "arvo-drp__header",
          variant: "member",
          visibleYear,
          visibleMonth,
          leftPrimaryLabel: rollingStartLabel,
          leftSecondaryLabel: rollingEndLabel,
          locale: effLocale,
          isDisabled: effIsDisabled,
          rightExtra: rollingRightExtra
        }
      );
    };
    const footer = activeMode === "rolling" ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__footer", children: [
      currentMemberLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-drp__current-ind", children: currentMemberLabel }),
      /* @__PURE__ */ jsxRuntime.jsx(
        Button.ArvoButton,
        {
          size: "md",
          variant: "tertiary",
          label: "Cancel",
          onClick: handleCancelRolling,
          className: "arvo-drp__footer-cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        Button.ArvoButton,
        {
          size: "md",
          variant: "primary",
          label: "Save",
          isDisabled: !rollingDirty,
          onClick: handleSaveRolling,
          className: "arvo-drp__footer-save"
        }
      )
    ] }) : null;
    const popoverRootClass = [
      "arvo-drp",
      `arvo-drp--${size}`,
      `arvo-drp--${activeMode}`,
      isFullWidth && "arvo-drp--full-width",
      hasWeeks && "arvo-drp--show-weeks",
      effIsLoading && "loading"
    ].filter(Boolean).join(" ");
    const ariaLabel = activeMode === "rolling" ? "Choose a rolling time range" : activeMode === "member" ? "Choose a time period range" : "Choose a date range";
    const modeAnnouncement = activeMode === "rolling" ? "Rolling time range mode" : activeMode === "member" ? "Time period range mode" : "Date range mode";
    const popover = isMounted ? require$$0.createPortal(
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: popoverRootClass, style: { display: "contents" }, children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          ref: popoverRef,
          id: popoverId,
          className: "arvo-drp__popover",
          role: "dialog",
          "aria-label": ariaLabel,
          "aria-modal": false,
          "data-arvo-side": panelSide,
          style: popoverStyle,
          tabIndex: -1,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: "arvo-sr-only",
                "aria-live": "polite",
                "aria-atomic": "true",
                children: modeAnnouncement
              }
            ),
            renderHeader(),
            popoverBody,
            footer
          ]
        }
      ) }),
      document.body
    ) : null;
    if (useAnchorRender) {
      return /* @__PURE__ */ jsxRuntime.jsx("div", { ref: rootRef, id: drpId, className: classes, style: rootStyle, children: popover });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: rootRef, id: drpId, className: classes, style: rootStyle, children: [
      label && /* @__PURE__ */ jsxRuntime.jsx(
        FormLabel.ArvoFormLabel,
        {
          htmlFor: `${inputId}-start`,
          id: labelId,
          isRequired,
          isDisabled: effIsDisabled,
          isInvalid: hasError,
          contextHelp,
          className: "arvo-drp__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: fieldRef, className: "arvo-drp__field", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-drp__value", children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              ref: startInputRef,
              id: `${inputId}-start`,
              type: "text",
              className: "arvo-drp__seg arvo-drp__seg--start",
              role: "combobox",
              value: startDisplay,
              placeholder: segPlaceholder,
              disabled: effIsDisabled,
              readOnly: !isAbsoluteEditable,
              autoComplete: "off",
              "aria-haspopup": "dialog",
              "aria-expanded": isOpen,
              "aria-controls": popoverId,
              "aria-required": isRequired || void 0,
              "aria-invalid": isInvalid || hasError || void 0,
              "aria-disabled": effIsDisabled || void 0,
              "aria-busy": effIsLoading || void 0,
              "aria-label": `${fieldLabel} start`,
              "aria-describedby": showInlineAlert ? errorId : void 0,
              onChange: noop,
              onKeyDown: handleSegKeyDown("start"),
              onFocus: handleSegFocus("start"),
              onBlur: handleSegBlur("start"),
              onMouseDown: isAbsoluteEditable ? handleSegMouseDown("start") : void 0,
              onPaste: isAbsoluteEditable ? handleSegPaste("start") : void 0
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-drp__arrow", "aria-hidden": "true", children: RIGHT_ARROW }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              ref: endInputRef,
              id: `${inputId}-end`,
              type: "text",
              className: "arvo-drp__seg arvo-drp__seg--end",
              role: "combobox",
              value: endDisplay,
              placeholder: segPlaceholder,
              disabled: effIsDisabled,
              readOnly: !isAbsoluteEditable,
              autoComplete: "off",
              "aria-haspopup": "dialog",
              "aria-expanded": isOpen,
              "aria-controls": popoverId,
              "aria-required": isRequired || void 0,
              "aria-invalid": isInvalid || hasError || void 0,
              "aria-disabled": effIsDisabled || void 0,
              "aria-busy": effIsLoading || void 0,
              "aria-label": `${fieldLabel} end`,
              "aria-describedby": showInlineAlert ? errorId : void 0,
              onChange: noop,
              onKeyDown: handleSegKeyDown("end"),
              onFocus: handleSegFocus("end"),
              onBlur: handleSegBlur("end"),
              onMouseDown: isAbsoluteEditable ? handleSegMouseDown("end") : void 0,
              onPaste: isAbsoluteEditable ? handleSegPaste("end") : void 0
            }
          )
        ] }),
        /* @__PURE__ */ (() => {
          const showClear = isClearable && hasValue && !effIsDisabled && !isReadOnly && !effIsLoading && !showTooltipIcon;
          const showSep = !effIsLoading && (showClear || showTooltipIcon);
          return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: actionsRef, className: "arvo-drp__actions", children: [
            showClear && /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "close",
                tooltip: "Clear",
                tabIndex: -1,
                onClick: handleClearClick,
                className: "arvo-drp__clear-btn"
              }
            ),
            showTooltipIcon && /* @__PURE__ */ jsxRuntime.jsx(
              MessageAlert.ArvoMessageAlert,
              {
                type: "negative",
                isInline: true,
                message: effError ?? "",
                className: "arvo-drp__err-ico"
              }
            ),
            showSep && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-drp__seg-divider", "aria-hidden": "true" }),
            !effIsLoading && /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                size: "sm",
                variant: "tertiary",
                icon: "calendar-o",
                tooltip: "Select start and end date",
                isDisabled: effIsDisabled || isReadOnly,
                isSelected: isOpen,
                onClick: handleTriggerClick,
                className: "arvo-drp__trigger-btn",
                "aria-haspopup": "dialog",
                "aria-expanded": isOpen,
                "aria-controls": popoverId
              }
            )
          ] });
        })(),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-drp__border" })
      ] }),
      showInlineAlert && /* @__PURE__ */ jsxRuntime.jsx(
        MessageAlert.ArvoMessageAlert,
        {
          type: "negative",
          id: errorId,
          message: effError,
          className: "arvo-drp__err-msg"
        }
      ),
      popover
    ] });
  }
);
ArvoDateRangePicker.displayName = "ArvoDateRangePicker";
exports.ArvoDateRangePicker = ArvoDateRangePicker;
exports.default = ArvoDateRangePicker;
//# sourceMappingURL=index82.cjs.map
