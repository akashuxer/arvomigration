import { ReactNode } from 'react';
import { ArvoOptionListProps } from '../OptionList/OptionList';
import { ArvoPopoverProps } from '../Popover/Popover';
import { ArvoHybridPopoverProps } from '../HybridPopover/HybridPopover';
import { ArvoDatePickerProps } from '../DatePicker/DatePicker';
import { ArvoDateRangePickerProps } from '../DateRangePicker/DateRangePicker';
import { ArvoTimePickerProps } from '../TimePicker/TimePicker';
import { ArvoDateTimePickerProps } from '../DateTimePicker/DateTimePicker';
export type ArvoAdvanceSearchVariant = 'scopedSearch' | 'customFilter' | 'filterBy';
export type ArvoAdvanceSearchSearchMode = 'input' | 'submit';
export type ArvoAdvanceSearchErrorDisplay = 'inline' | 'tooltip' | 'none';
export type ArvoAdvanceSearchSelectionMode = 'single' | 'multiple';
export type ArvoAdvanceSearchFilterContentType = 'hybridPopover' | 'optionList' | 'calendar' | 'dateRange' | 'time' | 'dateTime';
export interface ArvoAdvanceSearchCounter {
    current: number;
    total: number;
}
export interface ArvoAdvanceSearchScopeOption {
    key: string;
    label: string;
    icon?: string;
    isDisabled?: boolean;
}
export interface ArvoAdvanceSearchPopoverFooterConfig {
    hasReset?: boolean;
    secondaryLabel?: string | null;
    primaryLabel?: string | null;
    leftSlot?: ReactNode;
}
/**
 * Imperative handle exposed via `forwardRef`. Mirrors the JS twin's method
 * set so the same patterns work in both libraries.
 */
export interface ArvoAdvanceSearchHandle {
    element: HTMLDivElement | null;
    focus: () => void;
    clear: () => void;
    search: () => void;
    value: {
        (): string;
        (next: string): void;
    };
    open: () => void;
    close: () => void;
    toggle: (force?: boolean) => void;
    isOpen: () => boolean;
    setError: (message: string | false) => void;
    setLoading: (loading: boolean) => void;
}
type PopoverPropsBag = Partial<Pick<ArvoPopoverProps, 'hasBackButton' | 'onBack' | 'hasIcon' | 'icon' | 'hasAlert' | 'alertType' | 'hasStatusIndicator' | 'statusType' | 'badge' | 'headerActions' | 'isClosable' | 'isResizable' | 'onResize' | 'onResizeCommit' | 'variant' | 'placement' | 'offset' | 'closeOnOutside' | 'width' | 'stickyHeader' | 'stickyBody'>>;
type HybridPopoverPropsBag = Partial<Pick<ArvoHybridPopoverProps, 'variant' | 'items' | 'defaultItems' | 'conditional' | 'bannerAlert' | 'hasGlobalSelectAll' | 'enableReorder' | 'crossGroupDrag' | 'listProps' | 'emptyConfig' | 'isResizable' | 'width' | 'height' | 'commitOn' | 'search' | 'title' | 'hasHeader' | 'isClosable' | 'hasBackButton' | 'headerActions' | 'placement' | 'offset'>>;
type OptionListPropsBag = Partial<Pick<ArvoOptionListProps, 'placement' | 'width' | 'maxHeight' | 'search' | 'hasGroupDividers' | 'emptyConfig' | 'ariaLabel' | 'variant'>>;
type DatePickerPropsBag = Partial<Pick<ArvoDatePickerProps, 'minDate' | 'maxDate' | 'placement' | 'calendarProps' | 'isSegmented' | 'isAutoClose' | 'format' | 'locale' | 'isClearable'>>;
type DateRangePropsBag = Partial<Pick<ArvoDateRangePickerProps, 'minDate' | 'maxDate' | 'placement' | 'calendarProps' | 'format' | 'locale'>>;
type TimePropsBag = Partial<Pick<ArvoTimePickerProps, 'format' | 'minTime' | 'maxTime' | 'placement' | 'popoverProps' | 'locale'>>;
type DateTimePropsBag = Partial<Pick<ArvoDateTimePickerProps, 'min' | 'max' | 'format' | 'placement' | 'calendarProps' | 'popoverProps' | 'locale'>>;
export type ArvoAdvanceSearchSize = 'sm' | 'md' | 'lg';
export interface ArvoAdvanceSearchProps {
    variant?: ArvoAdvanceSearchVariant;
    /**
     * Density. Affects the field row height + vertical padding only -- the
     * inner controls (search icon, input typography, trigger buttons,
     * badge, clear, separator) stay at their canonical sizes across all
     * three options. `md` is the default canonical field height.
     *
     * - `sm` -- 36px field (compact toolbars / dense filter rows)
     * - `md` -- 40px field (default)
     * - `lg` -- 44px field (relaxed surfaces / standalone page headers)
     */
    size?: ArvoAdvanceSearchSize;
    searchMode?: ArvoAdvanceSearchSearchMode;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    minChars?: number;
    debounceMs?: number;
    hasWildcardSupport?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isLoading?: boolean;
    isClearable?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    shortcut?: string | null;
    counter?: ArvoAdvanceSearchCounter | null;
    errorDisplay?: ArvoAdvanceSearchErrorDisplay;
    errorMessage?: string | null;
    triggerLabel?: string;
    triggerProps?: Record<string, unknown>;
    selectionMode?: ArvoAdvanceSearchSelectionMode;
    scopeOptions?: ArvoAdvanceSearchScopeOption[];
    selectedScope?: string | string[] | null;
    defaultSelectedScope?: string | string[] | null;
    onScopeChange?: (next: string | string[]) => void;
    hasPopoverHeader?: boolean;
    popoverTitle?: string;
    popoverFooter?: false | ArvoAdvanceSearchPopoverFooterConfig;
    customFilterContent?: ReactNode;
    popoverProps?: PopoverPropsBag;
    filterContentType?: ArvoAdvanceSearchFilterContentType;
    filterSelectionMode?: ArvoAdvanceSearchSelectionMode;
    selectedFilter?: unknown;
    defaultSelectedFilter?: unknown;
    onFilterChange?: (next: unknown) => void;
    onFilterApply?: (value: unknown) => void;
    onFilterReset?: () => void;
    hybridPopoverProps?: HybridPopoverPropsBag;
    optionListProps?: OptionListPropsBag;
    calendarProps?: DatePickerPropsBag;
    dateRangeProps?: DateRangePropsBag;
    timeProps?: TimePropsBag;
    dateTimeProps?: DateTimePropsBag;
    width?: string;
    isFullWidth?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    className?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
    onBack?: () => void;
    onClose?: () => void;
}
/**
 * Pure helper exposed for parity with the JS twin. Returns true when the
 * query string starts with the wildcard prefix and therefore should be
 * matched using wildcard semantics (consumer-side).
 */
export declare function isWildcardQuery(value: string): boolean;
declare const ArvoAdvanceSearch: import('react').ForwardRefExoticComponent<ArvoAdvanceSearchProps & import('react').RefAttributes<ArvoAdvanceSearchHandle>>;
export { ArvoAdvanceSearch };
export default ArvoAdvanceSearch;
//# sourceMappingURL=AdvanceSearch.d.ts.map