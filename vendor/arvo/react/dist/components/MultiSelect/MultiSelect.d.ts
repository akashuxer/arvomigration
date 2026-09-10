import { ListItemBase, ListGroup } from '../../../../core/src';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
import { ArvoChipListProps } from '../ChipList/ChipList';
import { ArvoOptionListProps } from '../OptionList/OptionList';
/** Extension of ListItemBase for multi-select options. Adds `value` for the
 * selected value set, onChange payloads, and chip identity. The matching
 * option's label (+ optional avatar/icon) drives the rendered chip content. */
export interface MultiSelectOptionData extends ListItemBase {
    value: unknown;
}
/** How selected chips overflow inside the field.
 * - `expandable` (default): chips wrap up to `maxRows`, surplus collapses into '+N more'.
 * - `single-line`: one row, surplus collapses into '+N more'.
 * - `wrap`: chips wrap freely with no cap and no overflow action. */
export type MultiSelectOverflowMode = 'expandable' | 'single-line' | 'wrap';
/**
 * Scoped escape-hatch bag for inner `ArvoChipList` config the field does not
 * curate as a flat prop. Key set kept identical to the JS twin -- the drift
 * reviewer enforces parity.
 */
export type MultiSelectChipListProps = Pick<ArvoChipListProps, 'overflowLabel' | 'overflowAriaLabel' | 'isReorderable' | 'onReorder'>;
/**
 * Scoped escape-hatch bag for inner `ArvoOptionList` config the field does not
 * curate as a flat prop. Key set kept identical to the JS twin -- the drift
 * reviewer enforces parity.
 */
export type MultiSelectOptionListProps = Pick<ArvoOptionListProps, 'emptyConfig' | 'variant' | 'isCreatable' | 'onCreate'>;
export interface ArvoMultiSelectProps {
    /** Options as a flat array or grouped array. Forwarded (filtered) to ArvoOptionList. */
    items: MultiSelectOptionData[] | ListGroup<MultiSelectOptionData>[];
    /** Controlled selected value set. Pair with onChange. */
    value?: unknown[];
    /** Initial selected value set for uncontrolled mode. */
    defaultValue?: unknown[];
    /** Controlled filter text. Pair with onInputChange. */
    inputValue?: string;
    /** Placeholder text shown when no chips are selected. */
    placeholder?: string;
    /** Label text rendered above the field via ArvoFormLabel. */
    label?: string;
    /**
     * Optional contextual-help icon attached to the field label. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned
     * to the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    /** Prevents all interaction. Propagates to inner chips and dropdown. */
    isDisabled?: boolean;
    /** Marks the field as required; shows the required indicator on the label. */
    isRequired?: boolean;
    /** Shows error/invalid styling -- bottom border uses the negative color. */
    isInvalid?: boolean;
    /** Error message shown via msg-alert pattern when isInvalid is true. */
    errorMsg?: string;
    /**
     * Controls how validation error feedback is presented.
     * - `inline` (default): inline alert below the field.
     * - `tooltip`: compact error icon inside the field with tooltip on hover.
     * - `none`: no error UI (has-error border still applies via isInvalid).
     */
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    /** Shows a clear-all button when the value set is non-empty and interactive. */
    isClearable?: boolean;
    /** Pattern C loading: spinner replaces chevron, panel blocked, typing disabled. */
    isLoading?: boolean;
    /** Read-only: chips visible but not removable, no typing, panel does not open. */
    isReadOnly?: boolean;
    /** CSS width value (e.g. '200px', '50%'). Defaults to 300px. Overridden by isFullWidth. */
    width?: string;
    /** Shorthand for width='100%'. Takes precedence over width. */
    isFullWidth?: boolean;
    /**
     * Visual fill of the token field. `'filled'` (default) renders the tinted
     * field background. `'base'` swaps to the host surface color so the field
     * reads as a flat extension of its parent (toolbars, side panels, table
     * cells, inline-edit rows). Only the at-rest field background changes;
     * hover, focus, disabled, readonly, error, text, border, and icon colors
     * are identical across both surfaces.
     */
    surface?: 'filled' | 'base';
    /**
     * How selected chips overflow inside the field.
     * - `expandable` (default): wrap up to maxRows, surplus collapses into '+N more'.
     * - `single-line`: one row, '+N more' expands.
     * - `wrap`: free unbounded wrap, no action.
     */
    overflowMode?: MultiSelectOverflowMode;
    /** Max chip rows shown when collapsed (overflowMode='expandable'). Default: 3. */
    maxRows?: number;
    /** Max chip rows shown when expanded before scrolling. Default: 5. */
    expandedMaxRows?: number;
    /** Controlled chip-overflow expanded state. Pair with onExpandedChange. */
    isExpanded?: boolean;
    /** Initial uncontrolled expanded state. */
    defaultExpanded?: boolean;
    /** Visual appearance of the selected-value ArvoChips. Default: 'outline'. */
    chipAppearance?: 'primary' | 'outline' | 'utility';
    /** Cap on the number of selected values. null = unlimited. */
    maxSelections?: number;
    /** Preferred placement of the dropdown. Default: 'bottom-start'. */
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    /** Maximum height of the dropdown panel (CSS length). */
    maxHeight?: string;
    /** When true and items are grouped, renders dividers between consecutive groups. */
    hasGroupDividers?: boolean;
    /** Custom filter function: (item, query) => boolean. Defaults to filterItems. */
    filterFn?: (item: MultiSelectOptionData, query: string) => boolean;
    /** Whether selecting an option closes the panel. Default: false. */
    closeOnSelect?: boolean;
    /** Controlled open state. Pair with onOpenChange. */
    isOpen?: boolean;
    /** Initial open state for uncontrolled mode. */
    defaultOpen?: boolean;
    /** Called when the selected value set changes. */
    onChange?: (value: unknown[], item: MultiSelectOptionData | null, isSelected: boolean) => void;
    /** Called on each keystroke in the filter input. */
    onInputChange?: (value: string) => void;
    /** Called when a single chip is dismissed (in addition to onChange). */
    onRemove?: (value: unknown, item: MultiSelectOptionData) => void;
    /** Called when all values are cleared. */
    onClear?: (payload: {
        previousValue: unknown[];
    }) => void;
    /** Called before the panel opens. Return false to cancel. */
    onOpen?: () => boolean | void;
    /** Called before the panel closes. Return false to cancel. */
    onClose?: () => boolean | void;
    /** Called after the open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** Called after the chip-overflow expanded state changes. */
    onExpandedChange?: (expanded: boolean) => void;
    /**
     * Scoped escape-hatch bag for inner `ArvoChipList` props the field does not
     * curate flat. Spread first so the field's flat/computed props always win on overlap.
     */
    chipListProps?: MultiSelectChipListProps;
    /**
     * Scoped escape-hatch bag for inner `ArvoOptionList` props the field does not
     * curate flat. Spread first so the field's flat/computed props always win on overlap.
     */
    optionListProps?: MultiSelectOptionListProps;
    /** Additional CSS classes on the component root. */
    className?: string;
}
declare const ArvoMultiSelect: import('react').ForwardRefExoticComponent<ArvoMultiSelectProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoMultiSelect };
export default ArvoMultiSelect;
//# sourceMappingURL=MultiSelect.d.ts.map