import { RefObject } from 'react';
import { TimeObject } from '../../../../core/src';
import { ArvoCalendarProps, ArvoCalendarViewMode } from '../Calendar/Calendar';
export type { TimeObject } from '../../../../core/src';
export interface DateTimeDropdownPopoverProps {
    width?: string;
    offset?: number;
    zIndex?: number;
}
export type DateTimeDropdownCalendarProps = Pick<ArvoCalendarProps, 'hasOutsideDays' | 'isKeyboardEnabled' | 'size'>;
export interface ArvoDateTimeDropdownProps {
    triggerRef: RefObject<HTMLElement | null>;
    value?: Date | string | null;
    defaultValue?: Date | string | null;
    format?: string | null;
    locale?: string | null;
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    hasWeeks?: boolean;
    interval?: number;
    min?: Date | string | null;
    max?: Date | string | null;
    startTime?: TimeObject | string | null;
    endTime?: TimeObject | string | null;
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    isAutoClose?: boolean;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    ariaLabel?: string;
    calendarProps?: DateTimeDropdownCalendarProps;
    popoverProps?: DateTimeDropdownPopoverProps;
    onChange?: (payload: {
        value: Date | null;
        formattedValue: string;
    }) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (open: boolean) => void;
    onMonthChange?: (payload: {
        year: number;
        month: number;
    }) => void;
    onViewModeChange?: (payload: {
        mode: ArvoCalendarViewMode;
    }) => void;
    className?: string;
    id?: string;
}
export interface ArvoDateTimeDropdownRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    isOpen: () => boolean;
    value(): Date | null;
    value(v: Date | string | null): void;
    setPreview: (v: Date | null) => void;
    formattedValue: () => string;
    disabled(): boolean;
    disabled(state: boolean): void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoDateTimeDropdown: import('react').ForwardRefExoticComponent<ArvoDateTimeDropdownProps & import('react').RefAttributes<ArvoDateTimeDropdownRef>>;
export default ArvoDateTimeDropdown;
export { ArvoDateTimeDropdown };
//# sourceMappingURL=DateTimeDropdown.d.ts.map