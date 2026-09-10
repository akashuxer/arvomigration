import { RefObject } from 'react';
import { ArvoCalendarProps, ArvoCalendarViewMode } from '../Calendar/Calendar';
export interface CalendarDropdownPopoverProps {
    width?: string;
    offset?: number;
    zIndex?: number;
}
export type CalendarDropdownCalendarProps = Pick<ArvoCalendarProps, 'hasOutsideDays' | 'isKeyboardEnabled' | 'size'>;
export interface MemberItemLike {
    key: string;
    name: string;
    displayName: string;
    index?: number;
}
export interface ArvoCalendarDropdownProps {
    triggerRef: RefObject<HTMLElement | null>;
    value?: Date | string | null;
    defaultValue?: Date | string | null;
    format?: string | null;
    locale?: string | null;
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    hasWeeks?: boolean;
    minDate?: Date | string | null;
    maxDate?: Date | string | null;
    frequency?: 'day' | 'week' | 'month' | 'quarter' | 'year' | null;
    memberData?: MemberItemLike[] | null;
    currentMemberIndex?: number | null;
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    isAutoClose?: boolean;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    ariaLabel?: string;
    calendarProps?: CalendarDropdownCalendarProps;
    popoverProps?: CalendarDropdownPopoverProps;
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
export interface ArvoCalendarDropdownRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    isOpen: () => boolean;
    value(): Date | null;
    value(v: Date | string | null): void;
    formattedValue: () => string;
    disabled(): boolean;
    disabled(state: boolean): void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoCalendarDropdown: import('react').ForwardRefExoticComponent<ArvoCalendarDropdownProps & import('react').RefAttributes<ArvoCalendarDropdownRef>>;
export default ArvoCalendarDropdown;
export { ArvoCalendarDropdown };
//# sourceMappingURL=CalendarDropdown.d.ts.map