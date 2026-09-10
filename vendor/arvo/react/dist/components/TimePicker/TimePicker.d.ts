import { HTMLAttributes, RefObject } from 'react';
import { TimeObject } from '../../../../core/src';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
export type { TimeObject } from '../../../../core/src';
/**
 * Scoped escape-hatch bag for popover surface options. TimePicker portals
 * a custom overlay (not `ArvoPopover`). Mirrors the JS twin.
 *
 * A `timeProps` bag is intentionally omitted in this pass -- the inner
 * `ArvoTimeDropdown` has no parity-safe long-tail option today. Add when
 * a real escape-hatch knob emerges.
 */
export interface TimePickerPopoverProps {
    /** CSS width override on the popover surface. */
    width?: string;
    /** Pixel offset between the trigger and the popover. Default: 4. */
    offset?: number;
}
export interface ArvoTimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onBlur' | 'defaultValue' | 'id' | 'className'> {
    value?: TimeObject | Date | string | null;
    defaultValue?: TimeObject | Date | string | null;
    format?: string | null;
    locale?: string | null;
    interval?: number;
    minTime?: TimeObject | string | null;
    maxTime?: TimeObject | string | null;
    placeholder?: string | null;
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the field label. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned
     * to the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    variant?: 'default';
    size?: 'sm' | 'lg';
    surface?: 'filled' | 'base';
    width?: string | null;
    isFullWidth?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMsg?: string | null;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    isLoading?: boolean;
    /**
     * When true and a value is set, renders a clear icon button in the action
     * overlay to clear the current time. Defaults to `false`.
     */
    isClearable?: boolean;
    isAutoClose?: boolean;
    isStrictParsing?: boolean;
    isSegmented?: boolean;
    anchor?: false | true | HTMLElement | RefObject<HTMLElement> | string;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    /**
     * Scoped escape-hatch bag for popover surface options. Bag-only keys
     * (`width`, `offset`) flow through; flat options (`placement`) always
     * win on overlap. Z-index is owned by the overlay hub
     * (`OverlayProvider`'s `zIndexBase`).
     */
    popoverProps?: TimePickerPopoverProps;
    onChange?: (payload: {
        value: TimeObject | null;
        formattedValue: string;
    }) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onBlur?: () => void;
    className?: string;
    id?: string;
}
export interface ArvoTimePickerRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    value(): TimeObject | null;
    value(v: TimeObject | Date | string | null): void;
    formattedValue: () => string;
    clear: () => void;
    disabled(): boolean;
    disabled(state: boolean): void;
    setError: (message: string | false) => void;
    setLoading: (loading: boolean) => void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoTimePicker: import('react').ForwardRefExoticComponent<ArvoTimePickerProps & import('react').RefAttributes<ArvoTimePickerRef>>;
export { ArvoTimePicker };
export default ArvoTimePicker;
//# sourceMappingURL=TimePicker.d.ts.map