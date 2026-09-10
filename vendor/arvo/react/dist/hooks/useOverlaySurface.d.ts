import { CSSProperties, RefObject } from 'react';
import { MaskOptions, OverlayType, Placement, PlacementFlip, PositionResult } from '../../../core/src';
export type OverlaySurfaceHaspopup = 'menu' | 'listbox' | 'dialog' | 'grid' | 'tree' | true;
export interface UseOverlaySurfaceOptions {
    /** Hub overlay type. */
    type: OverlayType;
    /** Hub stacking priority. */
    priority?: number;
    /**
     * Per-overlay z-index override forwarded to the hub. When set, the hub
     * uses this value INSTEAD of the computed `zIndexBase + stackIndex * 10`,
     * still clamped to `parent.z + 10` for nested overlays. Prefer the
     * `OverlayProvider`'s `zIndexBase` for app-wide tuning; reach for this
     * when a specific surface must escape a higher stacking context in the
     * consumer app.
     */
    zIndex?: number;
    /**
     * Hub parent id for nested surfaces (submenus, inline children). When set
     * with `relation: 'submenu'` the hub keeps the parent + child stack alive
     * together (a click in the parent does not close the child; outside-click
     * closes the contiguous chain).
     */
    parentId?: string;
    /** Hub relation when `parentId` is set. */
    relation?: 'submenu' | 'inline';
    /** Trigger/anchor element ref the consumer owns. */
    triggerRef: RefObject<HTMLElement | null>;
    /**
     * Optional element ref to receive the trigger-ARIA attributes
     * (`aria-haspopup`, `aria-controls`, `aria-expanded`) instead of
     * `triggerRef`. Defaults to `triggerRef`. Use when the user-perceived
     * trigger (a form field) anchors positioning + dismissal but a nested
     * element (e.g. a `<input role="combobox">`) is the canonical ARIA
     * target per the WAI-ARIA pattern. `ArvoCombobox` is the canonical
     * consumer: `triggerRef` is the field div (positioning anchor,
     * outside-click boundary, return-focus target) and `triggerAriaRef`
     * is the inner editable input (ARIA 1.2 combobox pattern). Has no
     * effect when `triggerAria` is `false`.
     */
    triggerAriaRef?: RefObject<HTMLElement | null>;
    /**
     * Virtual point anchor (viewport coordinates) used when there is no
     * trigger element to position against. Typical for context menus, where
     * the surface anchors to the pointer location captured from the
     * `contextmenu` event. When set together with `triggerRef.current`, the
     * trigger element wins (matches the JS engine behavior).
     */
    anchorRect?: {
        x: number;
        y: number;
    } | null;
    /** Panel element ref (the floating surface). */
    panelRef: RefObject<HTMLElement | null>;
    /**
     * Optional outer wrapper element ref. When provided, the hook attaches
     * the wrapper to the hub so its z-index stays pinned to the same value
     * the hub assigns to the panel (the surface) across stack changes.
     *
     * Use this for composing overlays whose panel is rendered inside a
     * viewport-spanning host (`ArvoWindow`, `ArvoAlertDialog`'s outer
     * `.arvo-{abbr}` root). Without it, the wrapper's SCSS-declared
     * fallback (`--arvo-z-popover: 1000`) establishes a stacking context
     * that traps the panel beneath any sibling overlay above the fallback.
     * Mirrors `createOverlaySurface({ surfaceRoot })` in `@arvo/core`.
     */
    wrapperRef?: RefObject<HTMLElement | null>;
    /** Controlled open state. */
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    /** Cancellable lifecycle: return false to prevent. */
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    /** Positioning. Pass `position: false` for non-anchored surfaces. */
    placement?: Placement;
    gap?: number;
    width?: 'anchor' | number | string;
    observeContainerSelector?: string;
    positioned?: boolean;
    /**
     * Placement-flip strategy. Defaults to `'main-axis'` so anchored panels
     * stay on the requested axis when overflowing (clamped by `maxHeight`
     * instead of jumping to the perpendicular axis). Tooltip components pass
     * `'any'` to keep their adjacent-side cascade.
     */
    flip?: PlacementFlip;
    /**
     * When `true`, the surface pins its resolved placement on first open so
     * that subsequent reposition events triggered by the FLOAT's own size
     * changes (e.g. an action menu filter shrinking the item list) cannot
     * re-resolve to a different side. Reposition events from anchor/container
     * resizes, page scroll, and window resize still re-resolve normally.
     *
     * Default `false`. `ArvoActionMenu` opts in to suppress the placement-
     * flip flicker users see while typing in a filter.
     */
    lockPlacementOnFloatResize?: boolean;
    /** Focus model. `'none'` keeps focus on the trigger (activedescendant). */
    focus?: 'trap' | 'none';
    initialFocus?: HTMLElement | (() => HTMLElement | null | undefined) | 'first' | 'none';
    getOrderedElements?: () => Array<HTMLElement | null | undefined>;
    /** Return focus to the trigger on close. Default true. */
    returnFocus?: boolean;
    /** Dismissal. */
    closeOnOutside?: boolean;
    closeOnEscape?: boolean;
    /** Transition. `null` disables. Default `'fade'`. */
    transition?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | null;
    transitionDuration?: number;
    /**
     * When `true` AND `focus === 'trap'`, the focus trap activates only AFTER
     * the `enter()` transition resolves, not immediately on open + positioned.
     * Matches the JS engine's `focus.activateAfterTransition` behavior for
     * slide-in panels (Drawer / SidePanel). Default `false`.
     */
    activateAfterTransition?: boolean;
    /** ARIA `aria-haspopup` written onto the trigger. */
    haspopup?: OverlaySurfaceHaspopup;
    /** `aria-controls` target id written onto the trigger. Defaults to the surface id. */
    controlsId?: string;
    /** Emit position styles via generic `--arvo-overlay-*` vars. Default true. */
    emitStyle?: boolean;
    /**
     * Mask/backdrop. `true` uses defaults; an object customizes it.
     * When set, the hook drives `createMask` lifecycle and auto-derives
     * `managesOwnBackdrop: true` for the hub (unless explicitly overridden).
     */
    mask?: boolean | MaskOptions;
    /** Lock page scroll while the surface is open (modal/drawer). */
    lockScroll?: boolean;
    /**
     * Override hub `managesOwnFocus`. Default: auto-derived from
     * `focus === 'trap'` (matching `createOverlaySurface` behavior).
     */
    managesOwnFocus?: boolean;
    /**
     * Override hub `managesOwnBackdrop`. Default: auto-derived from
     * `!!mask` (matching `createOverlaySurface` behavior).
     */
    managesOwnBackdrop?: boolean;
    /**
     * Disable trigger ARIA (`aria-haspopup`, `aria-controls`, `aria-expanded`).
     * Set `false` for programmatic overlays with no trigger element (modal/toast).
     */
    triggerAria?: false;
    /**
     * Visibility class toggled on the panel element while the surface is open.
     * Default `'open'`. Mirrors `createOverlaySurface`'s `openClass` option so
     * SCSS rules of the form `.arvo-{abbr}.open { display: flex; }` work
     * identically across React and JS twins. The class is added synchronously
     * when the surface opens (before the enter transition) and removed AFTER
     * the exit transition completes (matching the JS engine).
     */
    openClass?: string;
}
export interface OverlaySurfaceTriggerAriaProps {
    'aria-haspopup': OverlaySurfaceHaspopup;
    'aria-controls': string;
    'aria-expanded': boolean;
}
export interface UseOverlaySurfaceReturn {
    /** Logical open state (controlled or internal). */
    isOpen: boolean;
    /** Whether the panel should be in the DOM (true through the exit transition). */
    isMounted: boolean;
    /** Whether positioning has resolved (panel safe to show + focus). */
    positioned: boolean;
    /** Resolved position (null until measured). */
    position: PositionResult | null;
    /** Stable surface/panel id (for `aria-controls` / `id`). */
    surfaceId: string;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setOpen: (next: boolean) => void;
    reposition: () => void;
    /** Style to spread onto the panel element. */
    panelStyle: CSSProperties | undefined;
    /**
     * Primary side of the engine-selected placement (e.g. `bottom-start` ->
     * `bottom`). Spread onto the panel as `data-arvo-side={panelSide}` so
     * SCSS can apply direction-aware popup enter / exit animations. Returns
     * `undefined` before the first measurement settles (in which case SCSS
     * treats the surface as opening from the bottom by default).
     */
    panelSide: 'top' | 'bottom' | 'left' | 'right' | undefined;
    /** ARIA props for a `renderTrigger`-style trigger. */
    triggerAriaProps: OverlaySurfaceTriggerAriaProps;
}
export declare function useOverlaySurface(options: UseOverlaySurfaceOptions): UseOverlaySurfaceReturn;
//# sourceMappingURL=useOverlaySurface.d.ts.map