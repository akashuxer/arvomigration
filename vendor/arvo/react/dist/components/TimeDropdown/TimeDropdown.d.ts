import { CSSProperties } from 'react';
import { TimeObject } from '../../../../core/src';
export interface ArvoTimeDropdownProps {
    /** Selected time. null means no selection. */
    value?: TimeObject | null;
    /**
     * .NET / Kendo time format string. Determines 12 vs 24-hour mode via
     * shouldUse12Hour({ format, locale }). Required -- drives rendering mode
     * and the visible label for each option.
     */
    format: string;
    /**
     * BCP-47 locale. Used as the fallback 12/24-hour determinator when the
     * format omits an hour-cycle signal and for localized AM/PM tab labels.
     */
    locale?: string;
    /** Minutes between generated time options. Default: 15. */
    interval?: number;
    /** Inclusive lower bound. Options before minTime are HIDDEN (not disabled). */
    minTime?: TimeObject | null;
    /** Inclusive upper bound. Options after maxTime are HIDDEN (not disabled). */
    maxTime?: TimeObject | null;
    /** When true, the whole component is non-interactive. */
    isDisabled?: boolean;
    /** Called when the user selects a time option. */
    onChange?: (time: TimeObject) => void;
    /** Called when Escape is pressed. */
    onDismiss?: () => void;
    className?: string;
    style?: CSSProperties;
    id?: string;
}
declare const ArvoTimeDropdown: import('react').ForwardRefExoticComponent<ArvoTimeDropdownProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoTimeDropdown };
export default ArvoTimeDropdown;
//# sourceMappingURL=TimeDropdown.d.ts.map