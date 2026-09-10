/**
 * Per-row metadata describing a tree row's structural shape and state. The
 * order of the array is the *visible* row order (depth-first walk over the
 * currently-expanded subtree).
 */
export interface TreeNavRow {
    /** Stable id used by the consumer to drive selection / expansion state. */
    id: string;
    /** Row label used for type-ahead search. */
    label: string;
    /** Zero-based depth from the root. */
    level: number;
    /** True when the row currently has children (parent node). */
    hasChildren: boolean;
    /** True when the row is currently expanded. Ignored when `!hasChildren`. */
    isExpanded: boolean;
    /** True when the row is disabled. */
    isDisabled: boolean;
}
export interface UseTreeNavigationOptions {
    /** Visible rows in display order. Identity-stable references are not required. */
    rows: TreeNavRow[];
    /** Called on Enter/Space; receives the focused row + index. */
    onSelect?: (row: TreeNavRow, index: number) => void;
    /** Called on Right Arrow when row is a closed parent. */
    onExpand: (row: TreeNavRow, index: number) => void;
    /** Called on Left Arrow when row is an open parent. */
    onCollapse: (row: TreeNavRow, index: number) => void;
    /** Called on Escape. */
    onEscape?: () => void;
    /** Optional scroll-into-view hook called whenever the active index changes. */
    scrollToIndex?: (index: number) => void;
    /** When false, skip wiring the navigation state machine (e.g., disabled tree). */
    enabled?: boolean;
    /** When false, disable type-ahead. Defaults to true. */
    typeAhead?: boolean;
}
export interface UseTreeNavigationReturn {
    /** Index into `rows` of the currently focused row. */
    activeIndex: number;
    /** Imperative setter for the focused row index. */
    setActiveIndex: (index: number) => void;
    /** Spread onto the tree container's `onKeyDown`. */
    handleKeyDown: (event: React.KeyboardEvent) => void;
}
/**
 * Thin React wrapper around `createTreeNav`. Builds disposable placeholder
 * elements per visible row (the underlying state machine only uses them as
 * identity tokens passed back to callbacks) so consumers do not need to wire
 * up real DOM refs for navigation. Real focus management still lives on the
 * consumer's row elements via roving tabindex driven by `activeIndex`.
 */
export declare function useTreeNavigation(options: UseTreeNavigationOptions): UseTreeNavigationReturn;
//# sourceMappingURL=useTreeNavigation.d.ts.map