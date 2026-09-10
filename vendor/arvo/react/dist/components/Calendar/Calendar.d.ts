import { CSSProperties } from 'react';
import { MemberIndex, NormalizedMember } from '../../../../core/src';
export type ArvoCalendarViewMode = 'days' | 'months' | 'quarters' | 'years' | 'members';
export interface ArvoCalendarRef {
    focusCell: (target: Date | NormalizedMember) => void;
    restoreFocus: () => void;
    setViewMode: (mode: ArvoCalendarViewMode) => void;
    next: () => void;
    prev: () => void;
    today: () => void;
}
export interface ArvoCalendarProps {
    locale?: string;
    visibleYear: number;
    visibleMonth: number;
    viewMode?: ArvoCalendarViewMode;
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    hasWeeks?: boolean;
    hasOutsideDays?: boolean;
    frequency?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    memberIndex?: MemberIndex | null;
    currentMemberIndex?: number | null;
    selectedDate?: Date | null;
    selectedMember?: NormalizedMember | null;
    rangeStart?: Date | null;
    rangeEnd?: Date | null;
    hoverDate?: Date | null;
    isRangeComplete?: boolean;
    minDate?: Date | null;
    maxDate?: Date | null;
    isKeyboardEnabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: CSSProperties;
    id?: string;
    onCellSelect?: (payload: {
        date?: Date;
        member?: NormalizedMember;
        mode: ArvoCalendarViewMode;
    }) => void;
    onCellHover?: (payload: {
        date?: Date;
        member?: NormalizedMember;
    }) => void;
    onViewModeChange?: (payload: {
        mode: ArvoCalendarViewMode;
    }) => void;
    onMonthChange?: (payload: {
        year: number;
        month: number;
    }) => void;
    onDismiss?: () => void;
}
declare const ArvoCalendar: import('react').ForwardRefExoticComponent<ArvoCalendarProps & import('react').RefAttributes<ArvoCalendarRef>>;
export default ArvoCalendar;
//# sourceMappingURL=Calendar.d.ts.map