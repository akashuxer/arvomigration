import { RefObject } from 'react';
import { ContextMenuAnchor, ContextMenuModality, ContextMenuRequest, Placement } from '../../../../core/src';
import { ContextMenuItem, ContextMenuItemGroup, ContextMenuItems } from '../../internal/menu';
import { ArvoEmptyStateProps } from '../EmptyState/EmptyState';
export type ArvoContextMenuItem<TContext = unknown> = ContextMenuItem<TContext>;
export type ArvoContextMenuItemGroup<TContext = unknown> = ContextMenuItemGroup<TContext>;
export type ArvoContextMenuItems<TContext = unknown> = ContextMenuItems<TContext>;
export type ArvoContextMenuAnchor = ContextMenuAnchor;
export type ArvoContextMenuModality = ContextMenuModality;
export type ArvoContextMenuRequest<TContext = unknown> = ContextMenuRequest<TContext>;
/**
 * Curated empty-state surface for ArvoContextMenu. When provided AND the
 * resolved items list is empty, the menu opens with an `ArvoEmptyState`
 * block instead of declining the gesture. Without `emptyConfig`, an empty
 * items array preserves the browser's native context menu (per spec
 * section 6.3). The wiring layer always renders `size='sm'` /
 * `orientation='vertical'` and only the secondary action button is
 * exposed -- mirrors ActionMenu's policy. The prop site applies `Partial<>`
 * so every field is individually optional.
 */
export type ArvoContextMenuEmptyConfig = Pick<ArvoEmptyStateProps, 'illustration' | 'title' | 'message' | 'secondaryAction'>;
export interface ArvoContextMenuSelectInfo<TContext = unknown> {
    item: ArvoContextMenuItem<TContext>;
    index: number;
    context: TContext;
    closeOnSelect: boolean;
}
export interface ArvoContextMenuProps<TContext = unknown> {
    /** Element that receives the delegated `contextmenu` / keydown listeners. */
    targetRef: RefObject<HTMLElement | null>;
    /**
     * Menu items. Either a static array or a function of the request context.
     * Function form is recomputed on every open so disabled / checked state
     * always reflects fresh context. Return an empty array to decline the
     * gesture (the browser's native menu is preserved).
     */
    items: ArvoContextMenuItems<TContext> | ((context: TContext) => ArvoContextMenuItems<TContext>);
    /** CSS selector for event-delegated invocation. */
    contextSelector?: string;
    /** Convert the resolved invoker element into the consumer's entity context. */
    resolveContext?: (invoker: HTMLElement) => TContext;
    /** Preferred placement relative to the resolved anchor. */
    placement?: Placement;
    /** How submenus open. Default `'hover'`. */
    submenuTrigger?: 'hover' | 'click';
    /** Close after selection. Default true. Checkbox/radio always keep open. */
    closeOnSelect?: boolean;
    /** Disable the controller. No gestures are recognized. */
    isDisabled?: boolean;
    /** Touch long-press duration. `0` disables. */
    longPressMs?: number;
    /** Enable Shift+F10 / ContextMenu key handling. Default true. */
    keyboard?: boolean;
    /** Close on Escape. Default true. */
    closeOnEscape?: boolean;
    /** Close on outside pointer-down. Default true. */
    closeOnOutside?: boolean;
    /** Accessible name written onto the panel. Default `'Context menu'`. */
    ariaLabel?: string;
    /** DOM id of an element labelling the panel. Takes precedence over ariaLabel. */
    ariaLabelledBy?: string;
    /**
     * Curated empty-state config. When set AND the resolved items array is
     * empty, the menu opens with an `ArvoEmptyState` block instead of
     * declining the gesture (which would let the browser's native menu
     * surface). Defaults to no-data illustration + a "No options" title.
     */
    emptyConfig?: Partial<ArvoContextMenuEmptyConfig>;
    /** Additional class names on the panel. */
    className?: string;
    /** Veto hook called before items are resolved. Return false to ignore the gesture. */
    onContextRequest?: (request: ArvoContextMenuRequest<TContext>) => boolean | void;
    /** Called immediately before the menu opens. Return false to cancel. */
    onOpen?: (request: ArvoContextMenuRequest<TContext>) => boolean | void;
    /** Called before the menu closes via a programmatic path. */
    onClose?: () => boolean | void;
    /** Called after any descendant item is invoked. */
    onSelect?: (info: ArvoContextMenuSelectInfo<TContext>) => void;
    /** Called after the open state changes (programmatic OR engine-driven). */
    onOpenChange?: (open: boolean) => void;
}
export interface ArvoContextMenuHandle<TContext = unknown> {
    open(request?: ArvoContextMenuRequest<TContext> | {
        anchor: ArvoContextMenuAnchor;
        invoker?: HTMLElement;
        context?: TContext;
        modality?: ArvoContextMenuModality;
        originalEvent?: MouseEvent | KeyboardEvent | TouchEvent;
    }): void;
    close(): void;
    isOpen(): boolean;
    updateItems(items: ArvoContextMenuItems<TContext> | ((context: TContext) => ArvoContextMenuItems<TContext>)): void;
    disabled(state?: boolean): boolean;
    getPanelElement(): HTMLElement | null;
}
declare const ForwardedArvoContextMenu: <TContext = unknown>(props: ArvoContextMenuProps<TContext> & {
    ref?: React.Ref<ArvoContextMenuHandle<TContext>>;
}) => JSX.Element | null;
/** ArvoContextMenu -- pop-up menu opened by secondary gesture. */
export declare const ArvoContextMenu: <TContext = unknown>(props: ArvoContextMenuProps<TContext> & {
    ref?: React.Ref<ArvoContextMenuHandle<TContext>>;
}) => JSX.Element | null;
export default ForwardedArvoContextMenu;
//# sourceMappingURL=ContextMenu.d.ts.map