import { ContextMenuItem, ContextMenuItems } from './types';
/**
 * Internal menu-content renderer.
 *
 * Renders the rows / groups / dividers / submenus for the lean menu surface
 * shared by `ArvoContextMenu` (today) and slated for `ArvoActionMenu`
 * adoption in a follow-up pass. Owns the keyboard navigation (via
 * `createArrowNav`), submenu open/close state, item invocation, and
 * checkbox/radio toggling.
 *
 * The parent component (e.g. `ArvoContextMenu`) owns the surface
 * (positioning, focus trap, mounting, ARIA on the panel element). Items are
 * passed in as data; the parent provides the request `context` so per-item
 * `onSelect` callbacks can receive it.
 */
export interface MenuContentSelectInfo<TContext = unknown> {
    item: ContextMenuItem<TContext>;
    index: number;
    context: TContext;
    /**
     * `false` when the parent should keep the menu open. `true` when the
     * row's invocation requests close-on-select (the normal default for
     * regular items; suppressed for checkbox/radio toggles).
     */
    closeOnSelect: boolean;
}
export interface MenuContentProps<TContext = unknown> {
    items: ContextMenuItems<TContext>;
    /** Request context passed to per-item callbacks (and to submenus). */
    context: TContext;
    /** The owning surface id (used to namespace row ids). */
    surfaceId: string;
    /** Parent overlay id for submenu hub registration. */
    parentSurfaceId: string;
    /** Submenu open-on-hover delay in ms. Default 200. `0` opens immediately. */
    submenuHoverDelayMs?: number;
    /** Render group dividers between non-first groups. Default true. */
    hasGroupDividers?: boolean;
    /**
     * Called when an item is invoked (clicked or activated via keyboard).
     * Checkbox/radio toggles call this with `closeOnSelect: false` after the
     * item's own `onChange` has fired.
     */
    onSelect: (info: MenuContentSelectInfo<TContext>) => void;
    /** Called when an item requests menu close (Escape pass-through). */
    onRequestClose: () => void;
    /**
     * Hint for the parent to position keyboard focus on the first focusable
     * row when the menu opens. Default true. Set `false` when the parent
     * handles initial focus itself (e.g. focus-trap with `initialFocus`).
     */
    autoFocusFirst?: boolean;
}
export declare function MenuContent<TContext = unknown>(props: MenuContentProps<TContext>): JSX.Element;
//# sourceMappingURL=MenuContent.d.ts.map