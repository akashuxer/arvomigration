type DelimiterBehavior = 'none' | 'comma-to-new-row' | 'comma-and-linebreak' | 'shift+enter';
export interface ArvoSearchProps {
    variant?: 'filter' | 'expandable-filter' | 'find';
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    isDisabled?: boolean;
    /** Renders the field read-only: focusable for copy but not editable. */
    isReadOnly?: boolean;
    isInvalid?: boolean;
    errorMsg?: string;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    isClearable?: boolean;
    shortcut?: string;
    counter?: {
        current: number;
        total: number;
    } | null;
    searchMode?: 'input' | 'submit';
    minChars?: number;
    /**
     * Milliseconds to debounce `onSearch` in `input` mode.
     * `0` fires synchronously on every keystroke.
     * Does not apply in `submit` mode.
     *
     * Default is `0` (synchronous) for design-system stability: every Arvo
     * component that composes `ArvoSearch` internally for in-memory filtering
     * (Listbox, ActionMenu, OptionList, PanelShell, etc.) needs the filter to
     * apply on the same tick as the keystroke. Direct consumers driving a
     * backend search should opt into a positive value (the figma spec
     * recommends `150`-`300` ms; `200` is a sensible default).
     * @default 0
     */
    debounceMs?: number;
    isMultiLine?: boolean | {
        enabled: boolean;
        minRows?: number;
        maxRows?: number;
        collapseBehavior?: 'none' | 'summary';
        delimiterBehavior?: DelimiterBehavior;
        delimiter?: string;
        /** @deprecated Use delimiterBehavior instead */
        expandRows?: boolean;
    };
    isLoading?: boolean;
    width?: string;
    isFullWidth?: boolean;
    /** Controlled expanded state for `expandable-filter` variant. */
    isExpanded?: boolean;
    /** Uncontrolled initial expanded state for `expandable-filter` variant. */
    defaultExpanded?: boolean;
    /** Direction the field expands when trigger is clicked. @default 'end' */
    expandDirection?: 'start' | 'end';
    /** When false, the "Previous match" button is omitted in `find` variant. @default true */
    hasPreviousButton?: boolean;
    /** When false, the "Next match" button is omitted in `find` variant. @default true */
    hasNextButton?: boolean;
    onSearch?: (value: string, values?: string[]) => void;
    onInput?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onChange?: (value: string) => void;
    onClear?: () => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onNext?: () => void;
    onPrevious?: () => void;
    onExpandedChange?: (expanded: boolean) => void;
    className?: string;
    'aria-label'?: string;
}
declare const ArvoSearch: import('react').ForwardRefExoticComponent<ArvoSearchProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoSearch;
//# sourceMappingURL=Search.d.ts.map