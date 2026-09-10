import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";
import { getUserLocale, inDateRange, addMonths, monthOverlapsRange, yearOverlapsRange, formatDate } from "@arvo/core";
import { ArvoButton } from "./index16.js";
import { ArvoIconButton } from "./index17.js";
const DEFAULT_PREV_TOOLTIP = "Previous";
const DEFAULT_NEXT_TOOLTIP = "Next";
const DEFAULT_TODAY_TOOLTIP = "Select today";
const DEFAULT_MONTH_TOOLTIP = "Choose month";
const DEFAULT_YEAR_TOOLTIP = "Choose year";
const EM_DASH = "—";
function previousPeriod(viewMode, year, month) {
  if (viewMode === "days") {
    const d = addMonths(new Date(year, month, 1), -1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }
  if (viewMode === "months") return { year: year - 1, month };
  return { year: year - 10, month };
}
function nextPeriod(viewMode, year, month) {
  if (viewMode === "days") {
    const d = addMonths(new Date(year, month, 1), 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }
  if (viewMode === "months") return { year: year + 1, month };
  return { year: year + 10, month };
}
function periodOverlapsRange(viewMode, year, month, minDate, maxDate) {
  if (viewMode === "days") return monthOverlapsRange(year, month, minDate, maxDate);
  if (viewMode === "months") {
    for (let m = 0; m < 12; m += 1) {
      if (monthOverlapsRange(year, m, minDate, maxDate)) return true;
    }
    return false;
  }
  const start = year - (year % 10 + 10) % 10;
  for (let i = 0; i < 10; i += 1) {
    if (yearOverlapsRange(start + i, minDate, maxDate)) return true;
  }
  return false;
}
const CalendarNav = forwardRef(
  function CalendarNav2({
    visibleYear,
    visibleMonth,
    viewMode = "days",
    variant = "single",
    rangeEndYear,
    rangeEndMonth,
    leftPrimaryLabel,
    leftSecondaryLabel,
    rightExtra = null,
    locale,
    minDate = null,
    maxDate = null,
    isDisabled = false,
    onPrev,
    onNext,
    onToday,
    onMonthButtonClick,
    onYearButtonClick,
    prevTooltip = DEFAULT_PREV_TOOLTIP,
    nextTooltip = DEFAULT_NEXT_TOOLTIP,
    todayTooltip = DEFAULT_TODAY_TOOLTIP,
    monthTooltip = DEFAULT_MONTH_TOOLTIP,
    yearTooltip = DEFAULT_YEAR_TOOLTIP,
    className,
    id
  }, ref) {
    const effLocale = useMemo(() => getUserLocale(locale), [locale]);
    const monthLabelFor = (year, month) => formatDate(new Date(year, month, 1), "MMMM", effLocale);
    const decadeLabelFor = (year) => {
      const start = year - (year % 10 + 10) % 10;
      return `${start} - ${start + 9}`;
    };
    const canGoPrev = useMemo(() => {
      if (!minDate && !maxDate) return true;
      const { year, month } = previousPeriod(viewMode, visibleYear, visibleMonth);
      return periodOverlapsRange(viewMode, year, month, minDate ?? null, maxDate ?? null);
    }, [viewMode, visibleYear, visibleMonth, minDate, maxDate]);
    const canGoNext = useMemo(() => {
      if (!minDate && !maxDate) return true;
      const { year, month } = nextPeriod(viewMode, visibleYear, visibleMonth);
      return periodOverlapsRange(viewMode, year, month, minDate ?? null, maxDate ?? null);
    }, [viewMode, visibleYear, visibleMonth, minDate, maxDate]);
    const canGoToday = useMemo(() => {
      if (!minDate && !maxDate) return true;
      return inDateRange(/* @__PURE__ */ new Date(), minDate ?? null, maxDate ?? null);
    }, [minDate, maxDate]);
    const rootClass = [
      "arvo-cal-nav",
      `arvo-cal-nav--${viewMode}`,
      variant === "range" && "arvo-cal-nav--range",
      variant === "member" && "arvo-cal-nav--member",
      isDisabled && "is-disabled",
      className
    ].filter(Boolean).join(" ");
    const renderLeftFor = (year, month) => {
      if (viewMode === "years") {
        return /* @__PURE__ */ jsx(
          "span",
          {
            className: "arvo-cal-nav__decade-lbl",
            "aria-label": decadeLabelFor(year),
            "aria-disabled": "true",
            children: decadeLabelFor(year)
          }
        );
      }
      if (viewMode === "months") {
        return /* @__PURE__ */ jsx(
          ArvoButton,
          {
            variant: "tertiary",
            size: "sm",
            className: "arvo-cal-nav__year-btn",
            isDisabled,
            onClick: onYearButtonClick,
            label: String(year),
            "aria-label": yearTooltip,
            "aria-pressed": true
          }
        );
      }
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          ArvoButton,
          {
            variant: "tertiary",
            size: "md",
            className: "arvo-cal-nav__month-btn",
            isDisabled,
            onClick: onMonthButtonClick,
            label: monthLabelFor(year, month),
            "aria-label": monthTooltip,
            "aria-pressed": false
          }
        ),
        /* @__PURE__ */ jsx(
          ArvoButton,
          {
            variant: "tertiary",
            size: "md",
            className: "arvo-cal-nav__year-btn",
            isDisabled,
            onClick: onYearButtonClick,
            label: String(year),
            "aria-label": yearTooltip,
            "aria-pressed": false
          }
        )
      ] });
    };
    const renderLeft = () => {
      if (variant === "member") {
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "arvo-cal-nav__period-lbl",
              "aria-label": leftPrimaryLabel ?? "",
              "aria-disabled": "true",
              children: leftPrimaryLabel ?? ""
            }
          ),
          leftSecondaryLabel != null && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "arvo-cal-nav__range-sep", "aria-hidden": "true", children: EM_DASH }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "arvo-cal-nav__period-lbl",
                "aria-label": leftSecondaryLabel,
                "aria-disabled": "true",
                children: leftSecondaryLabel
              }
            )
          ] })
        ] });
      }
      if (variant === "range") {
        const endYear = rangeEndYear ?? visibleYear;
        const endMonth = rangeEndMonth ?? visibleMonth;
        if (viewMode === "years") {
          const leftDecade = visibleYear - (visibleYear % 10 + 10) % 10;
          const rightDecade = endYear - (endYear % 10 + 10) % 10;
          const firstYear = Math.min(leftDecade, rightDecade);
          const lastYear = Math.max(leftDecade, rightDecade) + 9;
          const continuousLabel = `${firstYear} - ${lastYear}`;
          return /* @__PURE__ */ jsx(
            "span",
            {
              className: "arvo-cal-nav__decade-lbl",
              "aria-label": continuousLabel,
              "aria-disabled": "true",
              children: continuousLabel
            }
          );
        }
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          renderLeftFor(visibleYear, visibleMonth),
          /* @__PURE__ */ jsx("span", { className: "arvo-cal-nav__range-sep", "aria-hidden": "true", children: EM_DASH }),
          renderLeftFor(endYear, endMonth)
        ] });
      }
      return renderLeftFor(visibleYear, visibleMonth);
    };
    const showPrev = onPrev != null;
    const showNext = onNext != null;
    const showToday = onToday != null;
    const hasBuiltInNav = showPrev || showNext || showToday;
    return /* @__PURE__ */ jsxs("div", { ref, id, className: rootClass, children: [
      /* @__PURE__ */ jsx("div", { className: "arvo-cal-nav__left", children: renderLeft() }),
      /* @__PURE__ */ jsxs("div", { className: "arvo-cal-nav__right", children: [
        showPrev && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            icon: "angle-up",
            tooltip: prevTooltip,
            size: "md",
            variant: "tertiary",
            className: "arvo-cal-nav__prev",
            isDisabled: isDisabled || !canGoPrev,
            onClick: onPrev
          }
        ),
        showNext && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            icon: "angle-down",
            tooltip: nextTooltip,
            size: "md",
            variant: "tertiary",
            className: "arvo-cal-nav__next",
            isDisabled: isDisabled || !canGoNext,
            onClick: onNext
          }
        ),
        showToday && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            icon: "calendar-date-selected",
            tooltip: todayTooltip,
            size: "md",
            variant: "tertiary",
            className: "arvo-cal-nav__today",
            isDisabled: isDisabled || !canGoToday,
            onClick: onToday
          }
        ),
        rightExtra && /* @__PURE__ */ jsxs(Fragment, { children: [
          hasBuiltInNav && /* @__PURE__ */ jsx("span", { className: "arvo-cal-nav__divider", "aria-hidden": "true" }),
          rightExtra
        ] })
      ] })
    ] });
  }
);
CalendarNav.displayName = "CalendarNav";
export {
  CalendarNav,
  CalendarNav as default
};
//# sourceMappingURL=index101.js.map
