import { ArvoNavItemData, NavItemAction, ArvoNavSize, NavMenuProps, ArvoNavItemAvatarConfig, NAV_ITEM_MAX_INLINE_ACTIONS } from './NavItem';
import { MenuItemData } from '../ActionMenu/ActionMenu';
export type { ArvoNavItemData, NavItemAction, ArvoNavSize, NavMenuProps, ArvoNavItemAvatarConfig, MenuItemData, };
export { NAV_ITEM_MAX_INLINE_ACTIONS };
export interface ArvoNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
    /**
     * Density. sm = 32px row, md (default) = 40px row, lg = 48px row.
     * Cascades to every item.
     */
    size?: ArvoNavSize;
    /**
     * Compact icon-only rail. When true, every NavItem renders only its
     * leading icon; label + metadata + trailing actions are hidden from
     * view but preserved as the accessible name (`aria-label`) and native
     * hover / focus `title` tooltip on the row's polymorphic root. The
     * row height still follows `size` (sm=32 / md=40 / lg=48).
     *
     * This is the explicit compact state consumed by `ArvoNavPanel` when
     * the panel is in compact mode. Cascades to every NavItem; the parent
     * always wins over any bag-only value.
     */
    isCompact?: boolean;
    /** Item data array. */
    items: ArvoNavItemData[];
    /** Controlled selected item id. Pair with onSelect. */
    selectedId?: string | null;
    /**
     * Uncontrolled initial selected item id. Only consulted when selectedId
     * is omitted. When both are omitted the nav has no initial selection.
     */
    defaultSelectedId?: string | null;
    /**
     * Enable pinning. Pinned items lift to the top of the list and gain an
     * auto-injected pin/unpin inline action. Per-item `isPinnable: false`
     * suppresses the pin button on a specific row.
     */
    hasPinning?: boolean;
    /**
     * 'hover' (default) reveals trailing actions on row hover/focus/select.
     * 'always' keeps them visible.
     */
    actionsVisibility?: 'hover' | 'always';
    isDisabled?: boolean;
    isLoading?: boolean;
    /** Accessible label for the <nav> landmark. Defaults to 'Navigation'. */
    ariaLabel?: string;
    /**
     * Scoped escape-hatch bag applied uniformly to every per-item overflow
     * `ArvoDropdownIconButton`. Bag-only keys flow through; on conflict
     * the parent wins. `isCompact` is parent-owned and excluded.
     */
    menuProps?: NavMenuProps;
    /**
     * Fires when an item is activated via click or keyboard. The native
     * navigation event still fires for anchor items unless preventDefault
     * is called.
     */
    onSelect?: (detail: {
        id: string;
        item: ArvoNavItemData;
        index: number;
    }) => void;
    /**
     * Fires when a pin/unpin action is invoked. Receives the new pinned
     * state and the item ids in the new display order.
     */
    onPinChange?: (detail: {
        id: string;
        pinned: boolean;
        itemOrder: string[];
    }) => void;
    /**
     * Fires when any per-item inline or overflow action is invoked.
     * Centralized listener for analytics, etc.
     */
    onAction?: (detail: {
        actionId: string;
        itemId: string;
        item: ArvoNavItemData;
    }) => void;
}
declare const ArvoNav: import('react').ForwardRefExoticComponent<ArvoNavProps & import('react').RefAttributes<HTMLElement>>;
export default ArvoNav;
export { ArvoNav };
//# sourceMappingURL=Nav.d.ts.map