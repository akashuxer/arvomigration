import { RefObject } from 'react';
import { TimeObject } from '../../../../core/src';
export type { TimeObject } from '../../../../core/src';
/**
 * Scoped escape-hatch bag for popover surface options. Bag-only keys
 * (`width`, `offset`, `zIndex`) flow through; flat options (`placement`)
 * always win on overlap.
 *
 * `zIndex` is a per-overlay override -- the overlay hub honors it while
 * still clamping to `parent.z + 10` for any nested overlays. Prefer
 * `OverlayProvider`'s `zIndexBase` for app-wide tuning; use this when a
 * specific surface must escape a higher stacking context in the consumer
 * app.
 */
export interface TimePickerDropdownPopoverProps {
    width?: string;
    offset?: number;
    zIndex?: number;
}
export interface ArvoTimePickerDropdownProps {
    /**
     * The consumer-owned trigger element ref. Required. The dropdown
     * positions against this element and wires `aria-haspopup="dialog"`,
     * `aria-controls`, and `aria-expanded` on it. The element is also the
     * return-focus target when the dropdown closes.
     */
    triggerRef: RefObject<HTMLElement | null>;
    value?: TimeObject | Date | string | null;
    defaultValue?: TimeObject | Date | string | null;
    format?: string | null;
    locale?: string | null;
    interval?: number;
    minTime?: TimeObject | string | null;
    maxTime?: TimeObject | string | null;
    /** Controlled open state. Pair with `onOpenChange`. */
    isOpen?: boolean;
    /** Initial open state for uncontrolled mode. */
    defaultOpen?: boolean;
    isDisabled?: boolean;
    /** Close the dropdown when an option is selected. Default true. */
    isAutoClose?: boolean;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    /** Accessible name for the dialog panel. Defaults to 'Choose a time'. */
    ariaLabel?: string;
    popoverProps?: TimePickerDropdownPopoverProps;
    onChange?: (payload: {
        value: TimeObject | null;
        formattedValue: string;
    }) => void;
    /** Cancellable programmatic open. Return false to prevent. */
    onOpen?: () => boolean | void;
    /** Cancellable programmatic close. Return false to prevent. */
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
    className?: string;
    id?: string;
}
export interface ArvoTimePickerDropdownRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    isOpen: () => boolean;
    value(): TimeObject | null;
    value(v: TimeObject | Date | string | null): void;
    formattedValue: () => string;
    disabled(): boolean;
    disabled(state: boolean): void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoTimePickerDropdown: import('react').ForwardRefExoticComponent<ArvoTimePickerDropdownProps & import('react').RefAttributes<ArvoTimePickerDropdownRef>>;
export default ArvoTimePickerDropdown;
export { ArvoTimePickerDropdown };
//# sourceMappingURL=TimePickerDropdown.d.ts.map