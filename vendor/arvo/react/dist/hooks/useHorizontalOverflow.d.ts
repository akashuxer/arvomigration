import { RefObject } from 'react';
import { OverflowItem } from '../../../core/src';
export interface UseHorizontalOverflowOptions {
    /**
     * Ref to the element that holds the items in flow. The manager measures
     * each item's rect against the boundary's right edge. The container
     * itself is NOT observed for resize (that would create a feedback loop
     * when the container is `inline-flex` and shrinks as items are hidden).
     */
    containerRef: RefObject<HTMLElement | null>;
    /**
     * Ref to the element whose right edge represents the available width
     * (the clip line). Defaults to `containerRef`. Use a separate ref --
     * typically the container's parent -- when the container itself is
     * `inline-flex` and should size to its visible children (toolbar /
     * segmented-control layouts).
     *
     * Resolved lazily during the effect, so passing a ref whose `.current`
     * is `null` on first render (e.g. captured from `node.parentElement`
     * inside a ref callback) is supported.
     */
    boundaryRef?: RefObject<HTMLElement | null>;
    /**
     * Ref to the overflow trigger (typically an `ArvoIconButton`). May be
     * `null` if the trigger is rendered conditionally; the manager falls
     * back to `triggerWidthEstimate` until the ref resolves.
     */
    triggerRef?: RefObject<HTMLElement | null>;
    /**
     * Returns the items in display order. Called on every measurement so
     * consumers can use refs they update inside their render pass.
     */
    getItems: () => OverflowItem[];
    /**
     * Disable the manager (e.g. `hasOverflow=false`). Defaults to `true`.
     * When the value flips to `false`, the manager is torn down and any
     * inline styles applied to items are cleared.
     */
    enabled?: boolean;
    /** Inline-end reservation when the trigger isn't yet rendered. Default 32. */
    triggerWidthEstimate?: number;
    /** Predicate identifying items that should never be hidden. */
    isPinned?: (id: string) => boolean;
    /**
     * Currently selected item id to keep in view. When set and the selected
     * id would otherwise be hidden, the manager swaps it with the last
     * visible non-pinned item.
     */
    promotedId?: string | null;
    /**
     * Dependency array that triggers a re-measure when changed (e.g. the
     * items array, variant, size). The hook always re-measures after the
     * container ResizeObserver fires; this list covers shape changes the
     * observer can't see.
     */
    deps?: ReadonlyArray<unknown>;
}
export interface UseHorizontalOverflowReturn {
    /** Current set of hidden ids (display order). */
    hiddenIds: Set<string>;
    /** Imperatively re-measure (e.g. after a drag-and-drop reorder). */
    refresh: () => void;
}
/**
 * React adapter for `createOverflowManager` from `@arvo/core`. Mounts a
 * single overflow manager bound to the container ref, exposes the current
 * hidden set as React state, and tears down on unmount or when disabled.
 *
 * Consumers render the items + an overflow trigger themselves (typically
 * `ArvoIconButton` + `ArvoActionMenu`). The hook handles the detection
 * logic; consumers handle the menu and selection.
 */
export declare function useHorizontalOverflow(options: UseHorizontalOverflowOptions): UseHorizontalOverflowReturn;
//# sourceMappingURL=useHorizontalOverflow.d.ts.map