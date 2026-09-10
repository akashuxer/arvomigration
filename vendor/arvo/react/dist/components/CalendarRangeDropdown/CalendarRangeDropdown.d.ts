import { RefObject } from 'react';
import { ArvoCalendarProps } from '../Calendar/Calendar';
export type CalendarRangeDropdownMode = 'absolute' | 'member' | 'rolling';
export interface DateRangeValue {
    start: Date | null;
    end: Date | null;
}
export interface RollingRangeValue {
    startOffset: number;
    endOffset: number;
}
export interface CalendarRangeDropdownPopoverProps {
    width?: string;
    offset?: number;
    zIndex?: number;
}
export type CalendarRangeDropdownCalendarProps = Pick<ArvoCalendarProps, 'hasOutsideDays' | 'isKeyboardEnabled' | 'size'>;
export interface CalendarRangeMemberItem {
    key: string;
    name: string;
    displayName: string;
    index?: number;
}
export interface ArvoCalendarRangeDropdownProps {
    triggerRef: RefObject<HTMLElement | null>;
    startValue?: Date | string | null;
    endValue?: Date | string | null;
    format?: string | null;
    locale?: string | null;
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    hasWeeks?: boolean;
    minDate?: Date | string | null;
    maxDate?: Date | string | null;
    frequency?: 'day' | 'week' | 'month' | 'quarter' | 'year' | null;
    memberData?: CalendarRangeMemberItem[] | null;
    currentMemberIndex?: number | null;
    hasRolling?: boolean;
    rollingPrefix?: string | null;
    rollingValue?: RollingRangeValue | null;
    hasModeToggle?: boolean;
    mode?: CalendarRangeDropdownMode | null;
    defaultMode?: CalendarRangeDropdownMode | null;
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    isAutoClose?: boolean;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    ariaLabel?: string | null;
    calendarProps?: CalendarRangeDropdownCalendarProps;
    popoverProps?: CalendarRangeDropdownPopoverProps;
    onChange?: (payload: {
        start: Date | null;
        end: Date | null;
        formatted: {
            start: string;
            end: string;
        };
        mode: CalendarRangeDropdownMode;
        memberRange?: unknown;
        rollingValue?: RollingRangeValue;
    }) => void;
    onModeChange?: (payload: {
        mode: CalendarRangeDropdownMode;
    }) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (open: boolean) => void;
    onCancel?: () => void;
    onSave?: () => void;
    className?: string;
    id?: string;
}
export interface ArvoCalendarRangeDropdownRef {
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    isOpen: () => boolean;
    range(): DateRangeValue;
    range(v: DateRangeValue): void;
    setActiveSide: (side: 'start' | 'end') => void;
    disabled(): boolean;
    disabled(state: boolean): void;
    focus: () => void;
    destroy: () => void;
}
declare const ArvoCalendarRangeDropdown: import('react').ForwardRefExoticComponent<ArvoCalendarRangeDropdownProps & import('react').RefAttributes<ArvoCalendarRangeDropdownRef>>;
export default ArvoCalendarRangeDropdown;
export { ArvoCalendarRangeDropdown };
//# sourceMappingURL=CalendarRangeDropdown.d.ts.map