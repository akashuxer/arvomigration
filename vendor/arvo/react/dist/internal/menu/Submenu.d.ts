import { RefObject } from 'react';
import { MenuContentSelectInfo } from './MenuContent';
import { ContextMenuItem } from './types';
/**
 * Recursive submenu surface. Registers a nested overlay-surface as a
 * submenu of its parent (so the hub keeps the parent + child stack alive
 * together) and recursively renders `<MenuContent />` so each level
 * supports its own further-nested submenus.
 *
 * The parent row is the anchor (positioned `right-start` with no gap, with
 * collision flip handled by the position engine).
 */
export interface SubmenuProps<TContext = unknown> {
    items: ContextMenuItem<TContext>[];
    context: TContext;
    parentId: string;
    /** The parent menu item element that anchors this submenu. */
    anchorRef: RefObject<HTMLElement | null>;
    /** Stable label used for the submenu's accessible name. */
    ariaLabel?: string;
    /** Whether the submenu should be open. Parent owns this state. */
    isOpen: boolean;
    /** Submenu closed itself (Escape, outside-click, etc.). */
    onClose: () => void;
    /** A descendant invoked an item -- bubble to root menu. */
    onSelect: (info: MenuContentSelectInfo<TContext>) => void;
}
export declare function Submenu<TContext = unknown>(props: SubmenuProps<TContext>): JSX.Element | null;
//# sourceMappingURL=Submenu.d.ts.map