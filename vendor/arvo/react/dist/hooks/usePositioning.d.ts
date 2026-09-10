import { RefObject } from 'react';
import { Placement, PlacementFlip, PositionResult } from '../../../core/src';
export interface UsePositioningOptions {
    anchorRef: RefObject<HTMLElement | null>;
    /**
     * Virtual point anchor in viewport coordinates. When set (and the
     * element anchor is null), positioning runs against this point. Used by
     * point-anchored surfaces such as `ArvoContextMenu`.
     *
     * The point anchor is static -- no `ResizeObserver` / scroll watcher is
     * installed. Consumers needing to re-anchor at a new point should either
     * change this value (the hook will re-measure) or call `update()`.
     */
    anchorRect?: {
        x: number;
        y: number;
    } | null;
    floatRef: RefObject<HTMLElement | null>;
    placement?: Placement;
    gap?: number;
    enabled?: boolean;
    width?: 'anchor' | number | string;
    observeContainerSelector?: string;
    /**
     * Placement-flip strategy when the requested placement does not fit.
     * Defaults to `'main-axis'` (anchored-panel safe). Pass `'any'` for
     * tooltip-style components that cascade to adjacent sides.
     */
    flip?: PlacementFlip;
    /**
     * When `true`, the hook pins the resolved placement on its first compute
     * so that subsequent reposition events triggered by the FLOAT's own size
     * changes (e.g. an action menu filter shrinking its item list) cannot
     * re-resolve to a different side. Reposition events from anchor /
     * container resizes, page scroll, and window resize still re-resolve
     * normally. Mirrors the same option on the JS `createOverlaySurface`
     * engine. Default `false`.
     */
    lockPlacementOnFloatResize?: boolean;
}
export interface UsePositioningReturn {
    position: PositionResult | null;
    update: () => void;
}
export declare function usePositioning(options: UsePositioningOptions): UsePositioningReturn;
//# sourceMappingURL=usePositioning.d.ts.map