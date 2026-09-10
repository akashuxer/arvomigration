import { RefObject } from 'react';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
import { ArvoCalendarProps } from '../Calendar/Calendar';
/**
 * Scoped escape-hatch bag for inner `ArvoCalendar` config the parent does
 * not curate as a flat prop. See `composition.mdx` (Scoped configuration
 * props) and `.claude/rules/arvo/react.md` (Hybrid prop surface).
 * Key set kept identical to the JS twin -- drift checker enforces parity.
 */
export type DatePickerCalendarProps = Pick<ArvoCalendarProps, 'hasOutsideDays' | 'isKeyboardEnabled' | 'size'>;
/**
 * Scoped escape-hatch bag for inner popover surface options the parent
 * does not curate as a flat prop. DatePicker portals a custom overlay
 * (not `ArvoPopover`); this bag exposes parent-defined visual knobs.
 * Mirrors the JS twin -- drift checker enforces parity.
 */
export interface DatePickerPopoverProps {
    /** CSS width override on the popover surface. */
    width?: string;
    /** Pixel offset between the trigger and the popover. Default: 4. */
    offset?: number;
}
export interface ArvoDatePickerProps {
    /** Current date value. Parsed via parseDate(value, format, locale). */
    value?: Date | string | null;
    /** Initial value for uncontrolled mode. */
    defaultValue?: Date | string | null;
    /** .NET / Kendo date format. Empty resolves to locale default. */
    format?: string | null;
    /** BCP-47 locale. */
    locale?: string | null;
    /** First day of week. 0=Sunday, 1=Monday, ... 6=Saturday. */
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** Show weeks column in calendar. Adds arvo-dp--show-weeks modifier. */
    hasWeeks?: boolean;
    /** Min selectable date (inclusive). */
    minDate?: Date | string | null;
    /** Max selectable date (inclusive). */
    maxDate?: Date | string | null;
    /** Placeholder text shown when value is null. */
    placeholder?: string | null;
    /** Form label text. Uses form-label shared pattern. */
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the field label. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned
     * to the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    /** Trigger size. Applies arvo-dp--sm or arvo-dp--lg modifier. */
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
    /** Shorthand for width="100%". Applies arvo-dp--full-width modifier. */
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
     * When true and a value is set, renders a clear icon button in the action
     * overlay to clear the current date. Defaults to `false` so the field
     * mirrors TextBox-style opt-in clearing. The clear button is hidden when
     * the field is disabled, readOnly, loading, or showing an inline error
     * tooltip icon (the icon occupies the same slot).
     */
    isClearable?: boolean;
    /** Close popover on day select. */
    isAutoClose?: boolean;
    /** Reject partial format parses. */
    isStrictParsing?: boolean;
    /** Use isSegmented input editing in the trigger. */
    isSegmented?: boolean;
    /**
     * Overlay-only mode. Pass a host element / ref / CSS selector to bind
     * without rendering an input. Applies arvo-dp--anchor-mode modifier.
     */
    anchor?: false | true | HTMLElement | RefObject<HTMLElement> | string;
    /** Popover placement relative to the trigger. */
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    /**
     * Escape hatch for inner `ArvoCalendar` config the parent doesn't expose
     * flat. Bag-only knobs (`hasOutsideDays`, `isKeyboardEnabled`, `size`)
     * flow through. On any conflict with a flat prop, the flat prop wins.
     */
    calendarProps?: DatePickerCalendarProps;
    /**
     * Escape hatch for popover surface options the parent doesn't expose
     * flat. Bag-only knobs (`width`, `offset`) flow through. Flat overlay
     * options (`placement`) always win on overlap. Z-index is owned by the
     * overlay hub (`OverlayProvider`'s `zIndexBase`) and is not exposed per
     * component -- consumers needing global tuning should configure the
     * provider once at app boot instead of per-picker.
     */
    popoverProps?: DatePickerPopoverProps;
    /** Called when the committed date value changes. */
    onChange?: (payload: {
        value: Date | null;
        formattedValue: string;
    }) => void;
    /** Called when popover is about to open. Return false to cancel. */
    onOpen?: () => boolean | void;
    /** Called when popover is about to close. Return false to cancel. */
    onClose?: () => boolean | void;
    /** Called on trigger blur. */
    onBlur?: () => void;
    className?: string;
    id?: string;
}
export interface ArvoDatePickerRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    value(): Date | null;
    value(v: Date | string | null): void;
    formattedValue: () => string;
    clear: () => void;
    disabled(): boolean;
    disabled(state: boolean): void;
    setError: (message: string | false) => void;
    setLoading: (loading: boolean) => void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoDatePicker: import('react').ForwardRefExoticComponent<ArvoDatePickerProps & import('react').RefAttributes<ArvoDatePickerRef>>;
export { ArvoDatePicker };
export default ArvoDatePicker;
//# sourceMappingURL=DatePicker.d.ts.map