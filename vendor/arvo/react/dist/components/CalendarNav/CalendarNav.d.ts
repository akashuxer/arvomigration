export interface CalendarNavProps {
    /** Year currently shown in the calendar header. */
    visibleYear: number;
    /** Month currently shown (0-based: 0=January, 11=December). */
    visibleMonth: number;
    /** Current calendar zoom level. Drives which buttons are active/highlighted. */
    viewMode?: 'days' | 'months' | 'years';
    /**
     * 'single' renders one month/year label group (DatePicker, DateTimePicker).
     * 'range' renders two label groups joined by an em-dash for the dual-calendar
     * DateRangePicker header (e.g. "June 2026 - July 2026").
     * 'member' renders a non-interactive label pair joined by an em-dash. The
     * caller supplies `leftPrimaryLabel` and `leftSecondaryLabel` directly --
     * typically the display names of the first/last visible member tiles in
     * the body. Used by DateRangePicker member + rolling modes.
     */
    variant?: 'single' | 'range' | 'member';
    /** Range variant: year shown by the right (end) calendar. */
    rangeEndYear?: number;
    /** Range variant: month shown by the right (end) calendar (0-based). */
    rangeEndMonth?: number;
    /**
     * Member variant: primary (left) period label. Rendered as a non-interactive
     * span styled like the month/year zoom buttons but with cursor: not-allowed.
     */
    leftPrimaryLabel?: string;
    /**
     * Member variant: secondary (right) period label. Rendered to the right of
     * `__range-sep`. When omitted, only the primary label is shown.
     */
    leftSecondaryLabel?: string;
    /**
     * Extra content appended to the right zone after the today button (preceded
     * by a divider) -- e.g. the member-mode switch or Absolute/Rolling tab group.
     */
    rightExtra?: JSX.Element | null;
    /** BCP-47 locale. Drives month/year label formatting. */
    locale?: string;
    /** Min selectable date; used to compute prev-button disabled state. */
    minDate?: Date | null;
    /** Max selectable date; used to compute next-button disabled state. */
    maxDate?: Date | null;
    /** When true, all interactive elements are non-interactive. */
    isDisabled?: boolean;
    /** Called when the prev-period button is activated. */
    onPrev?: () => void;
    /** Called when the next-period button is activated. */
    onNext?: () => void;
    /** Called when the today button is activated. */
    onToday?: () => void;
    /** Called when the month label button is activated (zoom to months view). */
    onMonthButtonClick?: () => void;
    /** Called when the year label button is activated (zoom to years view). */
    onYearButtonClick?: () => void;
    /** Tooltip for the prev button. Defaults to 'Previous'. */
    prevTooltip?: string;
    /** Tooltip for the next button. Defaults to 'Next'. */
    nextTooltip?: string;
    /** Tooltip for the today button. Defaults to 'Select today'. */
    todayTooltip?: string;
    /** Tooltip for the month label button. Defaults to 'Choose month'. */
    monthTooltip?: string;
    /** Tooltip for the year label button. Defaults to 'Choose year'. */
    yearTooltip?: string;
    className?: string;
    id?: string;
}
declare const CalendarNav: import('react').ForwardRefExoticComponent<CalendarNavProps & import('react').RefAttributes<HTMLDivElement>>;
export { CalendarNav };
export default CalendarNav;
//# sourceMappingURL=CalendarNav.d.ts.map