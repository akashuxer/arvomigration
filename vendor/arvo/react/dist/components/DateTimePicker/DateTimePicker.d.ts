import { CSSProperties, HTMLAttributes, RefObject } from 'react';
import { TimeObject } from '../../../../core/src';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
import { ArvoCalendarProps } from '../Calendar/Calendar';
/**
 * Scoped escape-hatch bag for inner `ArvoCalendar` config the parent
 * does not curate as a flat prop. Mirrors the JS twin.
 */
export type DateTimePickerCalendarProps = Pick<ArvoCalendarProps, 'hasOutsideDays' | 'isKeyboardEnabled' | 'size'>;
/**
 * Scoped escape-hatch bag for popover surface options. DateTimePicker
 * portals a custom overlay (not `ArvoPopover`).
 */
export interface DateTimePickerPopoverProps {
    /** CSS width override on the popover surface. */
    width?: string;
    /** Pixel offset between the trigger and the popover. Default: 4. */
    offset?: number;
}
export interface ArvoDateTimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onBlur' | 'defaultValue' | 'id' | 'className'> {
    /** Current datetime value. Parsed via parseDateTime(value, format, locale). */
    value?: Date | string | null;
    /** Initial value for uncontrolled mode. */
    defaultValue?: Date | string | null;
    /** .NET / Kendo combined date+time format. Empty resolves to locale default. */
    format?: string | null;
    /** BCP-47 locale. */
    locale?: string | null;
    /** First day of week. 0=Sunday, 1=Monday, ... 6=Saturday. */
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** Show weeks column in the calendar. Adds arvo-dtp--show-weeks modifier. */
    hasWeeks?: boolean;
    /** TimeDropdown interval in minutes. Default 15. */
    interval?: number;
    /**
     * Full datetime min (inclusive). The time portion is enforced ONLY on the
     * boundary date; other dates accept any time.
     */
    min?: Date | string | null;
    /** Full datetime max (inclusive). Same boundary semantics as `min`. */
    max?: Date | string | null;
    /** Time-only floor applied across ALL dates (e.g. business hours start). */
    startTime?: TimeObject | string | null;
    /** Time-only ceiling applied across ALL dates (e.g. business hours end). */
    endTime?: TimeObject | string | null;
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
    /** Trigger size. Applies arvo-dtp--sm or arvo-dtp--lg modifier. */
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
    /** Shorthand for width="100%". Applies arvo-dtp--full-width modifier. */
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
     * overlay to clear the current date and time. Defaults to `false`.
     */
    isClearable?: boolean;
    /**
     * Auto-close on selection. Defaults to FALSE for DateTimePicker (different
     * from Date/Time Picker) so users can set both portions before closing.
     * When true, closes ONLY when BOTH date AND time have been touched since
     * the last open.
     */
    isAutoClose?: boolean;
    /** Reject partial format parses. */
    isStrictParsing?: boolean;
    /** Use combined isSegmented input editing in the trigger. */
    isSegmented?: boolean;
    /**
     * Overlay-only mode. Pass a host element / ref / CSS selector to bind
     * without rendering an input. Applies arvo-dtp--anchor-mode modifier.
     */
    anchor?: false | true | HTMLElement | RefObject<HTMLElement> | string;
    /** Popover placement relative to the trigger. */
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    /**
     * Inner `ArvoCalendar` config the parent doesn't expose flat. Bag-only
     * keys (`hasOutsideDays`, `isKeyboardEnabled`, `size`) flow through.
     */
    calendarProps?: DateTimePickerCalendarProps;
    /**
     * Popover surface options (custom portal, not `ArvoPopover`). Bag-only
     * keys (`width`, `offset`) flow through; flat options (`placement`)
     * always win on overlap. Z-index is owned by the overlay hub
     * (`OverlayProvider`'s `zIndexBase`).
     *
     * Note: a `timeProps` bag is intentionally omitted in this pass --
     * `ArvoTimeDropdown` has no parity-safe long-tail option today.
     * Add when a real escape-hatch knob emerges.
     */
    popoverProps?: DateTimePickerPopoverProps;
    /** Called when the committed datetime value changes. */
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
    style?: CSSProperties;
}
export interface ArvoDateTimePickerRef {
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
declare const ArvoDateTimePicker: import('react').ForwardRefExoticComponent<ArvoDateTimePickerProps & import('react').RefAttributes<ArvoDateTimePickerRef>>;
export { ArvoDateTimePicker };
export default ArvoDateTimePicker;
//# sourceMappingURL=DateTimePicker.d.ts.map