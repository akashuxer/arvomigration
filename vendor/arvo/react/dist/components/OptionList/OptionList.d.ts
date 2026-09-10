import { RefObject } from 'react';
import { ListItemBase, ListGroup, Placement } from '../../../../core/src';
import { ArvoEmptyStateProps } from '../EmptyState/EmptyState';
import { MenuSearchProp } from '../../types/menu-search';
export interface OptionListItemData extends ListItemBase {
    value: unknown;
}
/**
 * Partial ArvoEmptyState configuration applied to the embedded empty-state
 * figure. Merged over the built-in defaults for the derived dataState
 * (`noData` / `noResults` / `noResults` + creatable). The figure always
 * renders at `size='sm'` and `orientation='vertical'`.
 */
export type OptionListEmptyConfig = Partial<Pick<ArvoEmptyStateProps, 'illustration' | 'title' | 'message' | 'secondaryAction'>>;
export interface ArvoOptionListProps {
    items: OptionListItemData[] | ListGroup<OptionListItemData>[];
    /**
     * Visual layout for option rows. `standard` renders a 32px row with the
     * label (and optional leading icon). `rich` renders a 40px row with an
     * optional 24px avatar (or fallback icon) and a primary label stacked
     * over an optional secondary label. Defaults to `'standard'`.
     */
    variant?: 'standard' | 'rich';
    isMultiple?: boolean;
    value?: unknown | unknown[];
    defaultValue?: unknown | unknown[];
    search?: MenuSearchProp;
    hasGroupDividers?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    /**
     * When true and the active filter yields zero results, the noResults
     * empty state offers a `Create` action that fires `onCreate(query)` with
     * the current search value. Has no effect when there is no active query.
     */
    isCreatable?: boolean;
    /**
     * Override illustration, title, message, or secondaryAction on the
     * embedded ArvoEmptyState figure. Merged over the built-in defaults for
     * the derived dataState.
     */
    emptyConfig?: OptionListEmptyConfig;
    /** Accessible name for the floating listbox. Defaults to "Options". */
    ariaLabel?: string;
    triggerRef: RefObject<HTMLElement | null>;
    /**
     * Optional element to receive `aria-activedescendant` instead of the trigger.
     * Defaults to the trigger. Used by composed fields (e.g. MultiSelect) where
     * the trigger anchors positioning/ARIA but a nested editable input is the
     * focused element that must own `aria-activedescendant`.
     */
    activeDescendantRef?: RefObject<HTMLElement | null>;
    /**
     * Optional element to receive the trigger-ARIA attributes
     * (`aria-haspopup`, `aria-controls`, `aria-expanded`) instead of the
     * trigger. Defaults to the trigger. Use when a composed field anchors
     * positioning + dismissal to a wrapper element but a nested element
     * (e.g. an editable `<input role="combobox">`) is the canonical ARIA
     * target per the WAI-ARIA pattern. `ArvoCombobox` is the canonical
     * consumer.
     */
    triggerAriaRef?: RefObject<HTMLElement | null>;
    isOpen?: boolean;
    defaultOpen?: boolean;
    placement?: Placement;
    width?: 'anchor' | number | string;
    maxHeight?: string;
    /** Close the overlay after a selection. Default: true (single), false (multi). */
    closeOnSelect?: boolean;
    /**
     * Whether ArrowDown past the last option (or ArrowUp past the first) wraps
     * to the other end. Defaults to true. Composed parents that intentionally
     * bound option navigation (e.g. ArvoMultiSelect) pass false to clamp at the
     * boundaries instead.
     */
    wrapNavigation?: boolean;
    onChange?: (value: unknown | unknown[], item: OptionListItemData, isSelected: boolean) => void;
    /**
     * Called when the user activates the Create action in the noResults
     * empty state (only relevant when `isCreatable` is true and a search
     * query is active). Receives the current trimmed query value.
     */
    onCreate?: (value: string) => void;
    onOpenChange?: (isOpen: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    className?: string;
}
declare const ArvoOptionList: import('react').ForwardRefExoticComponent<ArvoOptionListProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoOptionList };
export default ArvoOptionList;
//# sourceMappingURL=OptionList.d.ts.map