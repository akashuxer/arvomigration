import { RefObject } from 'react';
import { Frequency, MemberItem, NormalizedMember, RollingRange } from '../../../../core/src';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
import { ArvoCalendarProps } from '../Calendar/Calendar';
export type ArvoDateRangePickerMode = 'absolute' | 'member' | 'rolling';
export interface DateRangeValue {
    start: Date | null;
    end: Date | null;
}
export interface MemberRangeValue {
    start: NormalizedMember | null;
    end: NormalizedMember | null;
}
/**
 * Scoped escape-hatch bag for inner `ArvoCalendar` config the parent
 * does not curate as a flat prop. Applies to both absolute-mode
 * calendars (the member-mode tile panel is parent-owned and not
 * affected). Mirrors the JS twin -- drift checker enforces parity.
 */
export type DateRangePickerCalendarProps = Pick<ArvoCalendarProps, 'hasOutsideDays' | 'isKeyboardEnabled' | 'size'>;
/**
 * Scoped escape-hatch bag for popover surface options. DateRangePicker
 * portals a custom overlay (not `ArvoPopover`). Mirrors the JS twin.
 */
export interface DateRangePickerPopoverProps {
    /** CSS width override on the popover surface. */
    width?: string;
    /** Pixel offset between the trigger and the popover. Default: 4. */
    offset?: number;
}
export interface ArvoDateRangePickerProps {
    /** Range start. Parsed via parseDate(value, format, locale). */
    startValue?: Date | string | null;
    /** Range end. Parsed via parseDate(value, format, locale). */
    endValue?: Date | string | null;
    /** .NET / Kendo date format. Empty resolves to locale default. */
    format?: string | null;
    /** BCP-47 locale. */
    locale?: string | null;
    /** First day of week. 0=Sunday, 1=Monday, ... 6=Saturday. */
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** Show ISO week numbers column. Defaults to true for range picker. */
    hasWeeks?: boolean;
    /** Min selectable date (inclusive). */
    minDate?: Date | string | null;
    /** Max selectable date (inclusive). */
    maxDate?: Date | string | null;
    /** Placeholder text shown when no range is set. */
    placeholder?: string | null;
    /** Form label text. Uses form-label shared pattern. */
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the field label. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned
     * to the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    /** Trigger size. Applies arvo-drp--sm or arvo-drp--lg modifier. */
    size?: 'sm' | 'lg';
    /**
     * Visual fill of the trigger field. `'filled'` (default) renders the
     * tinted field background. `'base'` swaps to the host surface color so
     * the trigger reads as a flat extension of its parent (toolbars, side
     * panels, table cells, inline-edit rows). Only the at-rest trigger
     * background changes; hover, focus, disabled, readonly, error, text,
     * border, and icon colors are identical across both surfaces.
     */
    surface?: 'filled' | 'base';
    /** CSS width on the trigger (e.g. "200px", "50%"). Defaults to 300px. */
    width?: string | null;
    /** Shorthand for width="100%". Applies arvo-drp--full-width modifier. */
    isFullWidth?: boolean;
    /** Disabled state. Applies is-disabled class and aria-disabled. */
    isDisabled?: boolean;
    /** Read-only. Applies is-readonly class. */
    isReadOnly?: boolean;
    /** Required for forms. Applies aria-required. */
    isRequired?: boolean;
    /** Validation invalid. Applies has-error class and aria-invalid. */
    isInvalid?: boolean;
    /** Error message text. Used by msg-alert shared pattern. */
    errorMsg?: string | null;
    /** How to render error feedback. */
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    /** Loading state (Pattern C). Applies loading class and aria-busy. */
    isLoading?: boolean;
    /**
     * When true and a range is set, renders a clear icon button in the action
     * overlay to clear both start and end. Defaults to `false`.
     */
    isClearable?: boolean;
    /**
     * Auto-close on commit. Applies to absolute / member modes only; rolling is
     * always footer-controlled regardless of this flag.
     */
    isAutoClose?: boolean;
    /** Reject partial format parses (reserved for future engine pass). */
    isStrictParsing?: boolean;
    /** Use isSegmented input editing in the trigger (dual-range segments). */
    isSegmented?: boolean;
    /**
     * Frequency for member data. With memberData provided, enables the member
     * capability (toggle + tile panel).
     */
    frequency?: Frequency | null;
    /** Generic member data (key/name/displayName/index). */
    memberData?: MemberItem[] | null;
    /**
     * Index of the current member in the timeline. Consumer maps platform-
     * specific IsCurrentBucketIndex (ADR-5). Required for rolling math; the
     * member-tile panel uses it to draw the current-member highlight.
     */
    currentMemberIndex?: number | null;
    /** Show the member-mode switch when member capability is active. */
    hasModeToggle?: boolean;
    /** Enable the Rolling tab and rolling popover layer. */
    hasRolling?: boolean;
    /**
     * Prefix label shown on the rolling stepper (e.g. "CW", "CY", "FY", "CM").
     * Required when rolling=true.
     */
    rollingPrefix?: string | null;
    /** Current rolling offsets {startOffset, endOffset}. */
    rollingValue?: RollingRange | null;
    /** Overlay-only mode (ADR-10). */
    anchor?: false | true | HTMLElement | RefObject<HTMLElement> | string;
    /** Popover placement relative to the trigger. */
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    /**
     * Escape hatch for inner `ArvoCalendar` config the parent doesn't
     * expose flat. Applies to BOTH absolute-mode calendars (member-mode
     * tile panel is parent-owned and not affected). Bag-only knobs
     * (`hasOutsideDays`, `isKeyboardEnabled`, `size`) flow through. Flat
     * props always win on overlap. See
     * `apps/docs/docs/usage/composition.mdx` (Scoped configuration props).
     */
    calendarProps?: DateRangePickerCalendarProps;
    /**
     * Escape hatch for popover surface options the parent doesn't expose
     * flat. DateRangePicker portals a custom overlay (not `ArvoPopover`).
     * Bag-only knobs (`width`, `offset`) flow through; flat options
     * (`placement`) always win on overlap. Z-index is owned by the overlay
     * hub (`OverlayProvider`'s `zIndexBase`).
     */
    popoverProps?: DateRangePickerPopoverProps;
    /** Called when the committed range or rolling value changes. */
    onChange?: (payload: {
        start: Date | null;
        end: Date | null;
        formatted: {
            start: string;
            end: string;
        };
        mode: ArvoDateRangePickerMode;
        memberRange?: {
            start: NormalizedMember | null;
            end: NormalizedMember | null;
        };
        rollingValue?: RollingRange;
    }) => void;
    /** Called when active mode changes (switch or tab). */
    onModeChange?: (payload: {
        mode: ArvoDateRangePickerMode;
    }) => void;
    /** Called when popover is about to open. Return false to cancel. */
    onOpen?: () => boolean | void;
    /** Called when popover is about to close. Return false to cancel. */
    onClose?: () => boolean | void;
    /** Called when rolling Cancel is activated. */
    onCancel?: () => void;
    /** Called when rolling Save is activated. */
    onSave?: () => void;
    className?: string;
    id?: string;
}
export interface ArvoDateRangePickerRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    range(): DateRangeValue;
    range(v: DateRangeValue): void;
    memberRange(): MemberRangeValue;
    memberRange(v: MemberRangeValue): void;
    rolling(): RollingRange | null;
    rolling(v: RollingRange): void;
    mode(): ArvoDateRangePickerMode;
    mode(m: ArvoDateRangePickerMode): void;
    memberToggle(): boolean;
    memberToggle(v: boolean): void;
    clear: () => void;
    disabled(): boolean;
    disabled(state: boolean): void;
    setError: (message: string | false) => void;
    setLoading: (loading: boolean) => void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoDateRangePicker: import('react').ForwardRefExoticComponent<ArvoDateRangePickerProps & import('react').RefAttributes<ArvoDateRangePickerRef>>;
export { ArvoDateRangePicker };
export default ArvoDateRangePicker;
//# sourceMappingURL=DateRangePicker.d.ts.map