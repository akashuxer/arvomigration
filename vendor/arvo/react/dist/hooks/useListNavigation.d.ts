import { ListItemBase } from '../../../core/src';
export interface UseListNavigationOptions {
    items: ListItemBase[];
    onSelect: (item: ListItemBase, index: number) => void;
    onEscape?: () => void;
    wrap?: boolean;
    enabled?: boolean;
    scrollToIndex?: (index: number) => void;
    /** When false, printable-key type-ahead is disabled. Defaults to true. */
    typeAhead?: boolean;
}
export interface UseListNavigationReturn {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    handleKeyDown: (event: React.KeyboardEvent) => void;
}
/**
 * Thin React wrapper around `createArrowNav` for list/menu keyboard navigation.
 * Maps `ListItemBase.disabled` to `skipDisabled` and `ListItemBase.label` to
 * `typeAhead.getLabel` automatically.
 */
export declare function useListNavigation(options: UseListNavigationOptions): UseListNavigationReturn;
//# sourceMappingURL=useListNavigation.d.ts.map