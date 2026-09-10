import { ReactNode } from 'react';
export type ArvoChipListVariant = 'general' | 'filter' | 'input';
export type ArvoChipListAppearance = 'primary' | 'outline' | 'utility';
export type ArvoChipListSize = 'sm' | 'md' | 'lg';
export type ArvoChipListColorMode = 'default' | 'semantic' | 'custom';
export type ArvoChipListOverflowMode = 'none' | 'wrap' | 'single-line' | 'max-rows';
export type ArvoChipListSelectionMode = 'none' | 'single' | 'multiple';
export type ArvoChipListKey = string | number;
export interface ArvoChipListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Semantic purpose of the chip list. Drives default selectionMode and propagated to child chips. */
    variant?: ArvoChipListVariant;
    /** Visual treatment propagated to child chips as their appearance default. */
    appearance?: ArvoChipListAppearance;
    /** Size controlling inter-chip gap; propagated to child chips. */
    size?: ArvoChipListSize;
    /** Color assignment behavior propagated to child chips. */
    colorMode?: ArvoChipListColorMode;
    /** Filter selection behavior. Resolves from variant when unset. */
    selectionMode?: ArvoChipListSelectionMode;
    /** Controlled set of selected chip keys (filter). */
    selectedKeys?: Array<ArvoChipListKey>;
    /** Initial uncontrolled selected chip keys (filter). */
    defaultSelectedKeys?: Array<ArvoChipListKey>;
    /** Called when filter selection changes. Receives the next selected keys array. */
    onSelectionChange?: (keys: Array<ArvoChipListKey>) => void;
    /** How the list handles overflow. */
    overflowMode?: ArvoChipListOverflowMode;
    /** Maximum chips shown before collapsing into the overflow action. */
    maxVisibleChips?: number | 'auto';
    /** Maximum visible rows before overflow when overflowMode='max-rows'. */
    maxRows?: number;
    /** Returns the visible label for the overflow disclosure when collapsed. Default `(n) => '+${n} more'`. */
    overflowLabel?: (hiddenCount: number) => string;
    /** Returns the accessible label for the overflow disclosure given the hidden chip count. */
    overflowAriaLabel?: (hiddenCount: number) => string;
    /**
     * Returns the visible label for the __overflow disclosure when isExpanded=true.
     * Default `() => 'Show less'`.
     */
    expandedLabel?: () => string;
    /**
     * Legacy callback fired on overflow disclosure activation. Still fires for
     * backwards compatibility, but new consumers should use `onExpandedChange`
     * (which carries the next boolean) instead.
     */
    onOverflowPress?: () => void;
    /**
     * Controlled chip-overflow expanded state. When provided, the chip-list does
     * not manage its own expanded state. Pair with `onExpandedChange`. While
     * expanded, the chip-list internally treats its overflowMode as `'wrap'`
     * (no chips are hidden) and the persistent `__overflow` disclosure flips
     * its label + `aria-expanded` in place.
     */
    isExpanded?: boolean;
    /** Initial uncontrolled expanded state. Ignored when `isExpanded` is provided. */
    defaultExpanded?: boolean;
    /**
     * Called when the chip-overflow expanded state changes via the disclosure
     * (click / Enter / Space). Receives the next boolean.
     */
    onExpandedChange?: (isExpanded: boolean) => void;
    /**
     * Internal hint for parent token-field components (e.g. ArvoMultiSelect).
     * When true: (1) the overflow disclosure renders at size='md' instead of
     * 'sm' to match a 32px field row; (2) the disclosure renders with
     * tabIndex=-1 so the parent field's single tab stop is preserved; (3) the
     * Children.forEach filter skips non-ArvoChip children silently without a
     * console.warn (the parent may render slots as field-level siblings).
     * Should NOT be set by application code.
     */
    isWithinField?: boolean;
    /**
     * Forces the overflow indicator to be a STATIC, non-interactive label
     * (a `<span>` carrying the `arvo-chip-list__overflow` class with the
     * `--static` modifier). The chevron is suppressed, the click handler is
     * a no-op, the element is not focusable, and the chip-list never pivots
     * its internal overflow mode to `'wrap'` on expansion -- the chips stay
     * strictly within the configured overflow bounds. Used by ArvoMultiSelect
     * when `overflowMode='single-line'` to enforce a true single-row field
     * where surplus chips simply collapse behind an informational "+N more"
     * indicator. When this flag is set the expansion contract is fully
     * disabled (`isExpanded` / `onExpandedChange` / `expandedLabel` are
     * ignored) and the consumer-supplied `overflowButtonRef` is NOT populated
     * because there is no interactive button to capture.
     */
    isStaticOverflow?: boolean;
    /** Enables collection-level reorder via @arvo/core dnd. */
    isReorderable?: boolean;
    /** Called when chip order changes. Receives the reordered children keys. */
    onReorder?: (keys: Array<ArvoChipListKey>) => void;
    /** Disables list-level interaction and propagates to child chips. */
    isDisabled?: boolean;
    /** Prevents modification while keeping content readable. Propagated to child chips. */
    isReadOnly?: boolean;
    /** Pattern C loading state: blocks pointer-events, aria-busy; each chip shows Pattern A shimmer. */
    isLoading?: boolean;
    /** Accessible name for the chip-list group when no visible label is present. */
    ariaLabel?: string;
    /** References a visible label element naming the group (alternative to ariaLabel). */
    ariaLabelledBy?: string;
    /**
     * Optional ref captured for the __overflow disclosure button (the same DOM
     * node across collapse <-> expand transitions). Parent token-field
     * components use this to wire ARIA (e.g. aria-activedescendant) and to
     * programmatically activate the disclosure (Enter / Space when the
     * disclosure is in an active-descendant walk).
     */
    overflowButtonRef?: React.Ref<HTMLButtonElement>;
    /** ArvoChip children rendered inside the list. */
    children?: ReactNode;
    /** Additional CSS classes on the chip-list root. */
    className?: string;
}
/**
 * ArvoChipList -- collection container for ArvoChip children.
 *
 * Owns collection-level concerns only: layout, inter-chip gap, wrapping,
 * overflow (with an inline `+n more` action), collection accessibility, filter
 * single/multi selection coordination, reorder, and propagation of shared
 * variant/appearance/size/colorMode plus disabled/readonly/loading context to
 * its child chips. Per-chip internals (content, dismiss, selected styling,
 * icons, avatars, counters, statuses, validation) remain owned by each
 * ArvoChip.
 */
declare const ArvoChipList: import('react').ForwardRefExoticComponent<ArvoChipListProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoChipList;
export { ArvoChipList };
//# sourceMappingURL=ChipList.d.ts.map