import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from "react";
import { getUserLocale, tooltipManager, getMonthNames, getWeekdayHeaders, formatWeekNumber, getWeekNumber, getMonthMatrix, inDateRange, isSameDay, isAfterDay, isBeforeDay, findMemberForDate, formatDate, monthOverlapsRange, isSameMonth, isSameYear, isSameQuarter, yearOverlapsRange, getMembersForYear, getMembersForDecade, getMembersForMonth, isMemberInRange, normalizeDate, findMemberByIndex, addMonths } from "@arvo/core";
import { useTooltipManager } from "./index5.js";
function quarterOf(monthIdx) {
  return Math.floor(monthIdx / 3) + 1;
}
function decadeStart(year) {
  return year - (year % 10 + 10) % 10;
}
function dayCompare(a, b) {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() - b.getFullYear();
  if (a.getMonth() !== b.getMonth()) return a.getMonth() - b.getMonth();
  return a.getDate() - b.getDate();
}
function dayKey(date) {
  const y = String(date.getFullYear()).padStart(4, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function orderedRange(a, b) {
  return dayCompare(a, b) <= 0 ? [a, b] : [b, a];
}
function colsForView(mode) {
  switch (mode) {
    case "days":
      return 7;
    case "months":
    case "years":
      return 4;
    case "quarters":
      return 4;
    case "members":
      return 8;
  }
}
function isTypeaheadKey(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return false;
  return e.key.length === 1 && /\S/.test(e.key);
}
const ArvoCalendar = forwardRef(
  function ArvoCalendar2({
    locale,
    visibleYear,
    visibleMonth,
    viewMode = "days",
    weekStart = 0,
    hasWeeks = false,
    hasOutsideDays = false,
    frequency,
    memberIndex = null,
    currentMemberIndex = null,
    selectedDate = null,
    selectedMember = null,
    rangeStart = null,
    rangeEnd = null,
    hoverDate = null,
    isRangeComplete = false,
    minDate = null,
    maxDate = null,
    isKeyboardEnabled = true,
    size: _size = "md",
    className,
    style,
    id,
    onCellSelect,
    onCellHover,
    onViewModeChange,
    onMonthChange,
    onDismiss
  }, ref) {
    const hostRef = useRef(null);
    const gridRef = useRef(null);
    const focusedCellRef = useRef(null);
    const effLocale = useMemo(() => getUserLocale(locale), [locale]);
    const now = useMemo(() => /* @__PURE__ */ new Date(), [visibleYear, visibleMonth, viewMode]);
    const rangeMode = rangeStart != null || rangeEnd != null || hoverDate != null;
    const initialFocusKeyRef = useRef(null);
    if (initialFocusKeyRef.current === null) {
      initialFocusKeyRef.current = computeInitialFocusKey({
        viewMode,
        visibleYear,
        visibleMonth,
        weekStart,
        selectedDate,
        selectedMember,
        memberIndex,
        minDate,
        maxDate,
        now
      });
    }
    const [focusedKey, setFocusedKey] = useState(
      initialFocusKeyRef.current
    );
    const typeAheadBufRef = useRef("");
    const typeAheadTimerRef = useRef(null);
    const warnedRef = useRef(false);
    const cells = useMemo(() => {
      switch (viewMode) {
        case "days":
          return buildDaysCells({
            visibleYear,
            visibleMonth,
            weekStart,
            hasOutsideDays,
            locale: effLocale,
            selectedDate,
            rangeStart,
            rangeEnd,
            hoverDate,
            isRangeComplete,
            minDate,
            maxDate,
            memberIndex,
            now
          });
        case "months":
          return buildMonthsCells({
            visibleYear,
            locale: effLocale,
            selectedDate,
            minDate,
            maxDate,
            memberIndex,
            frequency,
            now
          });
        case "quarters":
          return buildQuartersCells({
            visibleYear,
            selectedDate,
            minDate,
            maxDate,
            now
          });
        case "years":
          return buildYearsCells({
            visibleYear,
            hasOutsideDays,
            selectedDate,
            minDate,
            maxDate,
            now
          });
        case "members": {
          if (!memberIndex || !frequency) {
            if (!warnedRef.current && typeof console !== "undefined") {
              console.warn(
                "[ArvoCalendar] members view requires memberIndex + frequency props."
              );
              warnedRef.current = true;
            }
            return [];
          }
          return buildMembersCells({
            visibleYear,
            visibleMonth,
            frequency,
            memberIndex,
            currentMemberIndex,
            selectedMember,
            locale: effLocale,
            minDate,
            maxDate
          });
        }
      }
    }, [
      viewMode,
      visibleYear,
      visibleMonth,
      weekStart,
      hasOutsideDays,
      effLocale,
      selectedDate,
      selectedMember,
      rangeStart,
      rangeEnd,
      hoverDate,
      isRangeComplete,
      minDate,
      maxDate,
      memberIndex,
      currentMemberIndex,
      frequency,
      now
    ]);
    const preferredDayRef = useRef(null);
    const forceFocusOnNextRenderRef = useRef(false);
    useEffect(() => {
      const selectable = cells.filter((c) => !c.placeholder && !c.isDisabled);
      if (selectable.length === 0) return;
      const inList = selectable.some((c) => c.key === focusedKey);
      if (inList) return;
      const preferDay = preferredDayRef.current;
      preferredDayRef.current = null;
      if (preferDay != null) {
        const sameDay = selectable.find(
          (c) => c.date && c.date.getDate() === preferDay
        );
        if (sameDay) {
          setFocusedKey(sameDay.key);
          return;
        }
      }
      const fallback = pickFallbackFocusKey({ cells: selectable });
      if (fallback != null) setFocusedKey(fallback);
    }, [cells, focusedKey, now, viewMode]);
    useEffect(() => {
      if (!focusedCellRef.current) return;
      const host = hostRef.current;
      if (!host) return;
      const force = forceFocusOnNextRenderRef.current;
      forceFocusOnNextRenderRef.current = false;
      if (!force && !host.contains(document.activeElement)) return;
      focusedCellRef.current.focus();
    }, [focusedKey]);
    const ariaLabel = useMemo(() => {
      return buildRootAriaLabel({
        viewMode,
        visibleYear,
        visibleMonth,
        locale: effLocale
      });
    }, [viewMode, visibleYear, visibleMonth, effLocale]);
    const ctxManager = useTooltipManager();
    const manager = ctxManager ?? tooltipManager;
    useEffect(() => {
      const grid = gridRef.current;
      if (!grid) return;
      function resolveTooltipAnchor(target) {
        if (!(target instanceof Element)) return null;
        const cellEl = target.closest(
          ".arvo-cal__cell[data-arvo-tooltip]"
        );
        if (!cellEl) return null;
        const content = cellEl.getAttribute("data-arvo-tooltip");
        if (!content) return null;
        return { anchor: cellEl, content };
      }
      function onPointerOver(e) {
        const resolved = resolveTooltipAnchor(e.target);
        if (!resolved) return;
        manager.show({
          anchor: resolved.anchor,
          content: resolved.content,
          trigger: "hover"
        });
      }
      function onPointerOut(e) {
        var _a;
        const related = e.relatedTarget ?? null;
        const cellEl = (_a = e.target) == null ? void 0 : _a.closest(
          ".arvo-cal__cell[data-arvo-tooltip]"
        );
        if (!cellEl) return;
        if (related && cellEl.contains(related)) return;
        manager.hide();
      }
      function onFocusIn(e) {
        const resolved = resolveTooltipAnchor(e.target);
        if (!resolved) return;
        manager.show({
          anchor: resolved.anchor,
          content: resolved.content,
          trigger: "focus"
        });
      }
      function onFocusOut() {
        manager.hide(true);
      }
      grid.addEventListener("pointerover", onPointerOver);
      grid.addEventListener("pointerout", onPointerOut);
      grid.addEventListener("focusin", onFocusIn);
      grid.addEventListener("focusout", onFocusOut);
      return () => {
        grid.removeEventListener("pointerover", onPointerOver);
        grid.removeEventListener("pointerout", onPointerOut);
        grid.removeEventListener("focusin", onFocusIn);
        grid.removeEventListener("focusout", onFocusOut);
        manager.hide(true);
      };
    }, [manager]);
    const focusFn = useCallback((target) => {
      const key = target instanceof Date ? keyForDateInView(viewMode, target, memberIndex) : target.key;
      setFocusedKey(key);
      requestAnimationFrame(() => {
        var _a;
        (_a = focusedCellRef.current) == null ? void 0 : _a.focus();
      });
    }, [viewMode, memberIndex]);
    const restoreFocusFn = useCallback(() => {
      var _a;
      (_a = focusedCellRef.current) == null ? void 0 : _a.focus();
    }, []);
    const setViewModeFn = useCallback((mode) => {
      onViewModeChange == null ? void 0 : onViewModeChange({ mode });
    }, [onViewModeChange]);
    const nextFn = useCallback(() => {
      const next = stepVisiblePeriod({
        viewMode,
        visibleYear,
        visibleMonth,
        direction: 1
      });
      onMonthChange == null ? void 0 : onMonthChange(next);
    }, [viewMode, visibleYear, visibleMonth, onMonthChange]);
    const prevFn = useCallback(() => {
      const next = stepVisiblePeriod({
        viewMode,
        visibleYear,
        visibleMonth,
        direction: -1
      });
      onMonthChange == null ? void 0 : onMonthChange(next);
    }, [viewMode, visibleYear, visibleMonth, onMonthChange]);
    const todayFn = useCallback(() => {
      const today = /* @__PURE__ */ new Date();
      onMonthChange == null ? void 0 : onMonthChange({
        year: today.getFullYear(),
        month: today.getMonth()
      });
    }, [onMonthChange]);
    useImperativeHandle(
      ref,
      () => ({
        focusCell: focusFn,
        restoreFocus: restoreFocusFn,
        setViewMode: setViewModeFn,
        next: nextFn,
        prev: prevFn,
        today: todayFn
      }),
      [focusFn, restoreFocusFn, setViewModeFn, nextFn, prevFn, todayFn]
    );
    const handleCellClick = useCallback(
      (cell) => {
        if (cell.placeholder || cell.isDisabled) return;
        setFocusedKey(cell.key);
        if (cell.member) {
          onCellSelect == null ? void 0 : onCellSelect({ member: cell.member, mode: viewMode });
        } else if (cell.date) {
          onCellSelect == null ? void 0 : onCellSelect({ date: cell.date, mode: viewMode });
        }
      },
      [onCellSelect, viewMode]
    );
    const handleCellPointerEnter = useCallback(
      (cell) => {
        if (!rangeMode || isRangeComplete) return;
        if (cell.placeholder || cell.isDisabled || !cell.date) return;
        onCellHover == null ? void 0 : onCellHover({ date: cell.date });
      },
      [rangeMode, isRangeComplete, onCellHover]
    );
    const handleGridPointerLeave = useCallback(() => {
      if (!rangeMode || isRangeComplete) return;
      onCellHover == null ? void 0 : onCellHover({ date: void 0 });
    }, [rangeMode, isRangeComplete, onCellHover]);
    const handleKeyDown = useCallback(
      (e) => {
        var _a;
        if (!isKeyboardEnabled) return;
        if (e.key === "Escape") {
          e.preventDefault();
          onDismiss == null ? void 0 : onDismiss();
          return;
        }
        if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          const mode = zoomViewMode(viewMode, e.key === "ArrowDown" ? "in" : "out");
          if (mode) {
            e.preventDefault();
            onViewModeChange == null ? void 0 : onViewModeChange({ mode });
          }
          return;
        }
        if (viewMode === "months" && isTypeaheadKey(e)) {
          e.preventDefault();
          const ch = e.key.toLowerCase();
          typeAheadBufRef.current = `${typeAheadBufRef.current}${ch}`;
          if (typeAheadTimerRef.current) {
            clearTimeout(typeAheadTimerRef.current);
          }
          typeAheadTimerRef.current = setTimeout(() => {
            typeAheadBufRef.current = "";
            typeAheadTimerRef.current = null;
          }, 500);
          const names = getMonthNames(effLocale, "full");
          const match = names.findIndex(
            (n) => n.toLowerCase().startsWith(typeAheadBufRef.current)
          );
          if (match >= 0) {
            const target = cells.find(
              (c) => c.key === `${visibleYear}-${match}` && !c.isDisabled
            );
            if (target) setFocusedKey(target.key);
          }
          return;
        }
        const currentIdx = cells.findIndex((c) => c.key === focusedKey);
        if (currentIdx < 0) return;
        const cols2 = colsForView(viewMode);
        const findSelectable = (start, step) => {
          let i = start;
          while (i >= 0 && i < cells.length) {
            const c = cells[i];
            if (!c.placeholder && !c.isDisabled) return i;
            i += step;
          }
          return -1;
        };
        const moveBy = (offset) => {
          if (offset === 0 || cells.length === 0) return null;
          const step = offset > 0 ? 1 : -1;
          const target = currentIdx + offset;
          if (target < 0 || target >= cells.length) return null;
          const landed = findSelectable(target, step);
          if (landed < 0) return null;
          const cell = cells[landed];
          setFocusedKey(cell.key);
          return cell;
        };
        const extendIfShift = (cell) => {
          if (!cell || !rangeMode || !e.shiftKey) return;
          if (cell.member) onCellSelect == null ? void 0 : onCellSelect({ member: cell.member, mode: viewMode });
          else if (cell.date) onCellSelect == null ? void 0 : onCellSelect({ date: cell.date, mode: viewMode });
        };
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            extendIfShift(moveBy(-1));
            return;
          case "ArrowRight":
            e.preventDefault();
            extendIfShift(moveBy(1));
            return;
          case "ArrowUp":
            e.preventDefault();
            extendIfShift(moveBy(-cols2));
            return;
          case "ArrowDown":
            e.preventDefault();
            extendIfShift(moveBy(cols2));
            return;
          case "Home": {
            e.preventDefault();
            const rowStart = Math.floor(currentIdx / cols2) * cols2;
            const landed = findSelectable(rowStart, 1);
            if (landed >= 0 && landed < rowStart + cols2 && landed < cells.length) {
              setFocusedKey(cells[landed].key);
            }
            return;
          }
          case "End": {
            e.preventDefault();
            const rowStart = Math.floor(currentIdx / cols2) * cols2;
            const rowEnd = Math.min(rowStart + cols2 - 1, cells.length - 1);
            const landed = findSelectable(rowEnd, -1);
            if (landed >= rowStart) setFocusedKey(cells[landed].key);
            return;
          }
          case "PageUp":
          case "PageDown": {
            e.preventDefault();
            const direction = e.key === "PageDown" ? 1 : -1;
            const useYearStep = viewMode === "days" && e.shiftKey;
            const next = useYearStep ? { year: visibleYear + direction, month: visibleMonth } : stepVisiblePeriod({
              viewMode,
              visibleYear,
              visibleMonth,
              direction
            });
            const currentDate = ((_a = cells[currentIdx]) == null ? void 0 : _a.date) ?? null;
            if (currentDate && viewMode === "days") {
              preferredDayRef.current = currentDate.getDate();
            }
            forceFocusOnNextRenderRef.current = true;
            onMonthChange == null ? void 0 : onMonthChange(next);
            return;
          }
          case "Enter":
          case " ":
          case "Spacebar": {
            e.preventDefault();
            const cell = cells[currentIdx];
            if (!cell || cell.placeholder || cell.isDisabled) return;
            if (cell.member) {
              onCellSelect == null ? void 0 : onCellSelect({ member: cell.member, mode: viewMode });
            } else if (cell.date) {
              onCellSelect == null ? void 0 : onCellSelect({ date: cell.date, mode: viewMode });
            }
            return;
          }
        }
      },
      [
        isKeyboardEnabled,
        focusedKey,
        cells,
        viewMode,
        visibleYear,
        visibleMonth,
        rangeMode,
        effLocale,
        onCellSelect,
        onMonthChange,
        onViewModeChange,
        onDismiss
      ]
    );
    useEffect(() => {
      return () => {
        if (typeAheadTimerRef.current) {
          clearTimeout(typeAheadTimerRef.current);
          typeAheadTimerRef.current = null;
        }
      };
    }, []);
    const rootClass = [
      "arvo-cal",
      `arvo-cal--${viewMode}`,
      hasWeeks ? "arvo-cal--show-weeks" : "",
      rangeMode ? "arvo-cal--range" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const weekdayHeaders = viewMode === "days" ? getWeekdayHeaders(effLocale, weekStart, "min") : null;
    const cols = colsForView(viewMode);
    const totalSelectable = cells.filter((c) => !c.placeholder).length;
    const dataRows = totalSelectable === 0 ? 0 : Math.ceil(cells.length / cols);
    const rowCount = viewMode === "days" ? dataRows + 1 : dataRows;
    const colCount = viewMode === "days" && hasWeeks ? cols + 1 : cols;
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: hostRef,
        id,
        className: rootClass,
        style,
        role: "application",
        "aria-label": ariaLabel,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: gridRef,
            className: "arvo-cal__grid",
            role: "grid",
            "aria-rowcount": rowCount || void 0,
            "aria-colcount": colCount || void 0,
            onKeyDown: handleKeyDown,
            onPointerLeave: handleGridPointerLeave,
            children: [
              viewMode === "days" && weekdayHeaders && /* @__PURE__ */ jsxs("div", { role: "row", className: "arvo-cal__row", children: [
                hasWeeks && /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "columnheader",
                    className: "arvo-cal__week arvo-cal__week--hdr",
                    children: "Week"
                  }
                ),
                weekdayHeaders.map((label, i) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "columnheader",
                    className: "arvo-cal__weekday-hdr",
                    children: label
                  },
                  `hdr-${i}`
                ))
              ] }),
              viewMode === "days" ? renderDayRows({
                cells,
                hasWeeks,
                focusedKey,
                focusedCellRef,
                handleCellClick,
                handleCellPointerEnter
              }) : renderRows({
                cells,
                cols,
                focusedKey,
                focusedCellRef,
                handleCellClick,
                handleCellPointerEnter,
                viewMode
              })
            ]
          }
        )
      }
    );
  }
);
ArvoCalendar.displayName = "ArvoCalendar";
function renderDayRows(args) {
  var _a;
  const { cells, hasWeeks, focusedKey, focusedCellRef, handleCellClick, handleCellPointerEnter } = args;
  const rows = [];
  for (let w = 0; w < 6; w += 1) {
    const slice = cells.slice(w * 7, w * 7 + 7);
    if (slice.length === 0) break;
    const firstDate = ((_a = slice.find((c) => c.date)) == null ? void 0 : _a.date) ?? null;
    rows.push(
      /* @__PURE__ */ jsxs("div", { role: "row", className: "arvo-cal__row", children: [
        hasWeeks && /* @__PURE__ */ jsx("div", { className: "arvo-cal__week", "aria-hidden": "true", children: firstDate ? formatWeekNumber(getWeekNumber(firstDate)) : "" }),
        slice.map(
          (cell) => renderCell({
            cell,
            focusedKey,
            focusedCellRef,
            handleCellClick,
            handleCellPointerEnter,
            viewMode: "days"
          })
        )
      ] }, `row-${w}`)
    );
  }
  return rows;
}
function renderRows(args) {
  const { cells, cols, viewMode, focusedKey, focusedCellRef, handleCellClick, handleCellPointerEnter } = args;
  const rows = [];
  for (let r = 0; r * cols < cells.length; r += 1) {
    const slice = cells.slice(r * cols, r * cols + cols);
    rows.push(
      /* @__PURE__ */ jsx("div", { role: "row", className: "arvo-cal__row", children: slice.map(
        (cell) => renderCell({
          cell,
          focusedKey,
          focusedCellRef,
          handleCellClick,
          handleCellPointerEnter,
          viewMode
        })
      ) }, `row-${r}`)
    );
  }
  return rows;
}
function renderCell(args) {
  const { cell, focusedKey, focusedCellRef, handleCellClick, handleCellPointerEnter, viewMode } = args;
  if (cell.placeholder) {
    return /* @__PURE__ */ jsx("div", { className: "arvo-cal__cell", "aria-hidden": "true" }, cell.key);
  }
  const isFocused = cell.key === focusedKey;
  const cellClass = [
    "arvo-cal__cell",
    cell.isSelected ? "selected" : "",
    cell.isInRange ? "in-range" : "",
    cell.isRangeStart ? "range-start" : "",
    cell.isRangeEnd ? "range-end" : "",
    cell.isOutside ? "outside-month" : "",
    cell.isToday ? "today" : "",
    cell.isCurrentMember ? "current-member" : "",
    cell.isKeyHighlight ? "key-highlight" : "",
    cell.isDisabled ? "is-disabled" : "",
    cell.isPreview ? "preview" : ""
  ].filter(Boolean).join(" ");
  const ariaCurrent = cell.isToday ? viewMode === "days" ? "date" : "true" : cell.isCurrentMember ? "true" : void 0;
  const onClick = () => handleCellClick(cell);
  const onPointerEnter = (_e) => handleCellPointerEnter(cell);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "gridcell",
      className: cellClass,
      tabIndex: isFocused ? 0 : -1,
      "aria-selected": cell.isSelected || void 0,
      "aria-disabled": cell.isDisabled || void 0,
      "aria-current": ariaCurrent,
      "aria-label": cell.ariaLabel,
      "data-arvo-tooltip": cell.tooltip ?? void 0,
      onClick,
      onPointerEnter,
      ref: isFocused ? focusedCellRef : void 0,
      children: [
        /* @__PURE__ */ jsx("span", { className: "arvo-cal__cell-label", children: cell.label }),
        cell.subLabel && /* @__PURE__ */ jsx("span", { className: "arvo-cal__cell-sublabel", children: cell.subLabel })
      ]
    },
    cell.key
  );
}
function buildDaysCells(args) {
  const {
    visibleYear,
    visibleMonth,
    weekStart,
    hasOutsideDays,
    locale,
    selectedDate,
    rangeStart,
    rangeEnd,
    hoverDate,
    isRangeComplete,
    minDate,
    maxDate,
    memberIndex,
    now
  } = args;
  const matrix = getMonthMatrix(visibleYear, visibleMonth, { weekStart });
  const cells = [];
  const previewBounds = (() => {
    if (isRangeComplete) return null;
    if (!rangeStart || !hoverDate) return null;
    return orderedRange(rangeStart, hoverDate);
  })();
  const rangeBounds = (() => {
    if (!rangeStart || !rangeEnd) return null;
    return orderedRange(rangeStart, rangeEnd);
  })();
  for (const week of matrix.weeks) {
    for (const day of week.days) {
      const isOutside = !day.inMonth;
      if (!hasOutsideDays && isOutside) {
        cells.push(makePlaceholder(`p-${dayKey(day.date)}`));
        continue;
      }
      const isDisabled = !inDateRange(day.date, minDate, maxDate);
      const isToday = isSameDay(day.date, now);
      const isSelected = !!selectedDate && isSameDay(day.date, selectedDate) || !!rangeStart && isSameDay(day.date, rangeStart) || !!rangeEnd && isSameDay(day.date, rangeEnd);
      const isRangeStart = !!rangeStart && isSameDay(day.date, rangeBounds ? rangeBounds[0] : rangeStart);
      const isRangeEnd = !!rangeEnd && isSameDay(day.date, rangeBounds ? rangeBounds[1] : rangeEnd);
      const isInRange = !!rangeBounds && isAfterDay(day.date, rangeBounds[0]) && isBeforeDay(day.date, rangeBounds[1]);
      const isPreview = !!previewBounds && isAfterDay(day.date, previewBounds[0]) && !isAfterDay(day.date, previewBounds[1]);
      let tooltip;
      let isKeyHighlight = false;
      if (memberIndex) {
        const member = findMemberForDate(memberIndex, day.date);
        if (member) {
          tooltip = isToday ? `${member.displayName} - Today` : member.displayName;
          if (isSameDay(day.date, member.keyDate)) {
            isKeyHighlight = true;
          }
        }
      }
      cells.push({
        key: dayKey(day.date),
        label: String(day.date.getDate()),
        ariaLabel: formatDate(day.date, "dddd, MMMM d, yyyy", locale),
        date: day.date,
        tooltip,
        isOutside,
        isToday,
        isCurrentMember: false,
        isSelected,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isPreview,
        isDisabled,
        isKeyHighlight,
        placeholder: false
      });
    }
  }
  return cells;
}
function buildMonthsCells(args) {
  const {
    visibleYear,
    locale,
    selectedDate,
    minDate,
    maxDate,
    memberIndex,
    frequency,
    now
  } = args;
  const short = getMonthNames(locale, "abbrev");
  const full = getMonthNames(locale, "full");
  const cells = [];
  const keyHighlightMonths = /* @__PURE__ */ new Set();
  if (memberIndex && (frequency === "quarter" || frequency === "year")) {
    for (const member of memberIndex.members) {
      if (member.keyDate.getFullYear() === visibleYear) {
        keyHighlightMonths.add(member.keyDate.getMonth());
      }
    }
  }
  for (let m = 0; m < 12; m += 1) {
    const date = new Date(visibleYear, m, 1);
    const isDisabled = !monthOverlapsRange(visibleYear, m, minDate, maxDate);
    const isToday = isSameMonth(date, now);
    const isSelected = !!selectedDate && isSameYear(selectedDate, date) && selectedDate.getMonth() === m;
    cells.push({
      key: `${visibleYear}-${m}`,
      label: short[m],
      ariaLabel: `${full[m]} ${visibleYear}`,
      date,
      isOutside: false,
      isToday,
      isCurrentMember: false,
      isSelected,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
      isPreview: false,
      isDisabled,
      isKeyHighlight: keyHighlightMonths.has(m),
      placeholder: false
    });
  }
  return cells;
}
function buildQuartersCells(args) {
  const { visibleYear, selectedDate, minDate, maxDate, now } = args;
  const cells = [];
  for (let q = 1; q <= 4; q += 1) {
    const startMonth = (q - 1) * 3;
    const date = new Date(visibleYear, startMonth, 1);
    const isDisabled = ![0, 1, 2].some(
      (offset) => monthOverlapsRange(visibleYear, startMonth + offset, minDate, maxDate)
    );
    const isToday = isSameQuarter(now, date);
    const isSelected = !!selectedDate && isSameYear(selectedDate, date) && quarterOf(selectedDate.getMonth()) === q;
    cells.push({
      key: `${visibleYear}-Q${q}`,
      label: `Q${q}`,
      ariaLabel: `Q${q} ${visibleYear}`,
      date,
      isOutside: false,
      isToday,
      isCurrentMember: false,
      isSelected,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
      isPreview: false,
      isDisabled,
      isKeyHighlight: false,
      placeholder: false
    });
  }
  return cells;
}
function buildYearsCells(args) {
  const { visibleYear, hasOutsideDays, selectedDate, minDate, maxDate, now } = args;
  const start = decadeStart(visibleYear);
  const cells = [];
  for (let i = -1; i <= 10; i += 1) {
    const year = start + i;
    const isOutside = i === -1 || i === 10;
    if (!hasOutsideDays && isOutside) {
      cells.push(makePlaceholder(`p-y-${year}`));
      continue;
    }
    const date = new Date(year, 0, 1);
    const isDisabled = !yearOverlapsRange(year, minDate, maxDate);
    const isToday = year === now.getFullYear();
    const isSelected = !!selectedDate && selectedDate.getFullYear() === year;
    cells.push({
      key: `y-${year}`,
      label: String(year),
      ariaLabel: `${year}`,
      date,
      isOutside,
      isToday,
      isCurrentMember: false,
      isSelected,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
      isPreview: false,
      isDisabled,
      isKeyHighlight: false,
      placeholder: false
    });
  }
  return cells;
}
function buildMembersCells(args) {
  const {
    visibleYear,
    visibleMonth,
    frequency,
    memberIndex,
    currentMemberIndex,
    selectedMember,
    locale,
    minDate,
    maxDate
  } = args;
  let members;
  switch (frequency) {
    case "day":
      members = getMembersForMonth(memberIndex, visibleYear, visibleMonth);
      break;
    case "year":
      members = getMembersForDecade(memberIndex, decadeStart(visibleYear));
      break;
    default:
      members = getMembersForYear(memberIndex, visibleYear);
      break;
  }
  return members.map((member) => {
    const isDisabled = !isMemberInRange(member, minDate, maxDate);
    const isCurrentMember = currentMemberIndex != null && member.index === currentMemberIndex;
    const isSelected = !!selectedMember && member.index === selectedMember.index;
    return {
      key: member.key,
      label: member.displayName,
      subLabel: formatMemberRange(member, frequency, locale),
      ariaLabel: member.displayName,
      member,
      tooltip: member.displayName,
      isOutside: false,
      isToday: false,
      isCurrentMember,
      isSelected,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
      isPreview: false,
      isDisabled,
      isKeyHighlight: false,
      placeholder: false
    };
  });
}
function makePlaceholder(key) {
  return {
    key,
    label: "",
    ariaLabel: "",
    placeholder: true,
    isOutside: false,
    isToday: false,
    isCurrentMember: false,
    isSelected: false,
    isInRange: false,
    isRangeStart: false,
    isRangeEnd: false,
    isPreview: false,
    isDisabled: false,
    isKeyHighlight: false
  };
}
function buildRootAriaLabel(args) {
  const { viewMode, visibleYear, visibleMonth, locale } = args;
  switch (viewMode) {
    case "days": {
      const label = formatDate(new Date(visibleYear, visibleMonth, 1), "MMMM yyyy", locale);
      return `${label} calendar`;
    }
    case "months":
      return `${visibleYear} calendar`;
    case "quarters":
      return `${visibleYear} calendar`;
    case "years": {
      const start = decadeStart(visibleYear);
      return `Years ${start}-${start + 9} calendar`;
    }
    case "members":
      return "Member calendar";
  }
}
function keyForDateInView(mode, date, memberIndex) {
  switch (mode) {
    case "days":
      return dayKey(normalizeDate(date));
    case "months":
      return `${date.getFullYear()}-${date.getMonth()}`;
    case "quarters":
      return `${date.getFullYear()}-Q${quarterOf(date.getMonth())}`;
    case "years":
      return `y-${date.getFullYear()}`;
    case "members": {
      if (memberIndex) {
        const member = findMemberForDate(memberIndex, date);
        if (member) return member.key;
      }
      return dayKey(normalizeDate(date));
    }
  }
}
function computeInitialFocusKey(args) {
  var _a;
  const {
    viewMode,
    visibleYear,
    visibleMonth,
    weekStart,
    selectedDate,
    selectedMember,
    memberIndex,
    minDate,
    maxDate,
    now
  } = args;
  switch (viewMode) {
    case "days": {
      if (selectedDate && selectedDate.getFullYear() === visibleYear && selectedDate.getMonth() === visibleMonth && inDateRange(selectedDate, minDate, maxDate)) {
        return keyForDateInView("days", selectedDate, memberIndex);
      }
      if (now.getFullYear() === visibleYear && now.getMonth() === visibleMonth && inDateRange(now, minDate, maxDate)) {
        return keyForDateInView("days", now, memberIndex);
      }
      const matrix = getMonthMatrix(visibleYear, visibleMonth, { weekStart });
      for (const wk of matrix.weeks) {
        for (const d of wk.days) {
          if (d.inMonth && inDateRange(d.date, minDate, maxDate)) {
            return keyForDateInView("days", d.date, memberIndex);
          }
        }
      }
      return keyForDateInView("days", new Date(visibleYear, visibleMonth, 1), memberIndex);
    }
    case "months": {
      if (selectedDate && selectedDate.getFullYear() === visibleYear) {
        return `${visibleYear}-${selectedDate.getMonth()}`;
      }
      if (now.getFullYear() === visibleYear) {
        return `${visibleYear}-${now.getMonth()}`;
      }
      return `${visibleYear}-0`;
    }
    case "quarters": {
      if (selectedDate && selectedDate.getFullYear() === visibleYear) {
        return `${visibleYear}-Q${quarterOf(selectedDate.getMonth())}`;
      }
      if (now.getFullYear() === visibleYear) {
        return `${visibleYear}-Q${quarterOf(now.getMonth())}`;
      }
      return `${visibleYear}-Q1`;
    }
    case "years": {
      const start = decadeStart(visibleYear);
      if (selectedDate && selectedDate.getFullYear() >= start && selectedDate.getFullYear() < start + 10) {
        return `y-${selectedDate.getFullYear()}`;
      }
      if (now.getFullYear() >= start && now.getFullYear() < start + 10) {
        return `y-${now.getFullYear()}`;
      }
      return `y-${start}`;
    }
    case "members": {
      if (selectedMember) return selectedMember.key;
      if (memberIndex && memberIndex.currentIndex != null) {
        const m = findMemberByIndex(memberIndex, memberIndex.currentIndex);
        if (m) return m.key;
      }
      return ((_a = memberIndex == null ? void 0 : memberIndex.members[0]) == null ? void 0 : _a.key) ?? "";
    }
  }
}
function pickFallbackFocusKey(args) {
  const { cells } = args;
  const todayCell = cells.find((c) => c.isToday);
  if (todayCell) return todayCell.key;
  if (cells.length > 0) return cells[0].key;
  return null;
}
function stepVisiblePeriod(args) {
  const { viewMode, visibleYear, visibleMonth, direction } = args;
  switch (viewMode) {
    case "days": {
      const next = addMonths(new Date(visibleYear, visibleMonth, 1), direction);
      return { year: next.getFullYear(), month: next.getMonth() };
    }
    case "months":
    case "quarters":
      return { year: visibleYear + direction, month: visibleMonth };
    case "years":
      return { year: visibleYear + direction * 10, month: visibleMonth };
    case "members":
      return { year: visibleYear + direction, month: visibleMonth };
  }
}
function zoomViewMode(current, direction) {
  const chain = ["days", "months", "years"];
  const idx = chain.indexOf(current);
  if (idx < 0) return null;
  const next = direction === "in" ? idx + 1 : idx - 1;
  if (next < 0 || next >= chain.length) return null;
  return chain[next];
}
function formatMemberRange(member, frequency, locale) {
  if (frequency === "day") return void 0;
  const start = formatDate(member.keyDate, "MMM d", locale);
  const end = formatDate(member.endDate, "MMM d", locale);
  return `${start} - ${end}`;
}
export {
  ArvoCalendar as default
};
//# sourceMappingURL=index78.js.map
