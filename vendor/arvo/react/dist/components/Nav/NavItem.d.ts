import { ArvoDropdownIconButtonProps } from '../DropdownIconButton/DropdownIconButton';
import { ArvoAvatarProps, ArvoAvatarVariant, ArvoAvatarColorMode, ArvoAvatarSemanticType, ArvoAvatarCustomColor } from '../Avatar/Avatar';
import { ArvoStatusProps, ArvoStatusType } from '../Status/Status';
import { ArvoBadgeProps, ArvoBadgeSemanticType } from '../Badge/Badge';
import { MenuItemData } from '../ActionMenu/ActionMenu';
export type { ArvoAvatarVariant, ArvoAvatarColorMode, ArvoAvatarSemanticType, ArvoAvatarCustomColor, ArvoStatusType, ArvoBadgeSemanticType, MenuItemData, };
/**
 * Curated avatar config exposed on a NavItem. Always rendered at
 * size='xs' (16px) -- the row owns the visual scale.
 */
export interface ArvoNavItemAvatarConfig {
    variant?: ArvoAvatarVariant;
    name?: string;
    src?: string;
    icon?: string;
    colorMode?: ArvoAvatarColorMode;
    semanticType?: ArvoAvatarSemanticType;
    customColor?: ArvoAvatarCustomColor;
    tooltip?: string;
    alt?: string;
}
/**
 * Inline action descriptor. Up to 3 actions render inline as
 * tertiary/sm IconButtons; any 4th and beyond auto-fold into the
 * overflow ArvoActionMenu.
 */
export interface NavItemAction {
    id: string;
    /** o9con icon name (no prefix). */
    icon: string;
    /** Required: accessible label / native tooltip. */
    tooltip: string;
    isDisabled?: boolean;
    /**
     * Click handler. The `event` argument is undefined when the action is
     * auto-promoted into the overflow menu (the menu invokes the action by
     * id, without a synthetic event). Inline-rendered actions always
     * receive the underlying React mouse event. Most consumers can ignore
     * the event arg; if you rely on it, gate access with a guard.
     */
    onClick?: (event?: React.MouseEvent) => void;
}
/**
 * Per-row data shape consumed by ArvoNav. NavItem itself is internal --
 * application code passes these objects to ArvoNav.items.
 */
export interface ArvoNavItemData {
    id: string;
    label: string;
    /** When set, the row renders as <a href=...> with aria-current='page' on selection. */
    href?: string;
    target?: string;
    rel?: string;
    /** Leading 16px icon (o9con name, no prefix). */
    icon?: string;
    avatar?: ArvoNavItemAvatarConfig;
    status?: {
        type: ArvoStatusType;
        label?: string;
    };
    badge?: {
        message: string;
        semanticType?: ArvoBadgeSemanticType;
    };
    actions?: NavItemAction[];
    /** Items rendered in the overflow ArvoActionMenu. Auto-promoted actions append. */
    menuItems?: MenuItemData[];
    isPinned?: boolean;
    /**
     * Whether this row participates in pinning. Defaults to true; set false
     * to suppress the auto-injected pin button on system-level destinations.
     */
    isPinnable?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    tooltip?: string;
    /** Scoped escape-hatch bag for the inner ArvoAvatar. */
    avatarProps?: Pick<ArvoAvatarProps, 'appearance' | 'isInteractive' | 'alt'>;
    /** Scoped escape-hatch bag for the inner inline ArvoStatus. */
    statusProps?: Pick<ArvoStatusProps, 'icon'>;
    /**
     * Scoped escape-hatch bag for the inner ArvoBadge. The nav badge slot is
     * label-only by design -- `icon` and `hasBadgeIcon` are intentionally
     * excluded so the consumer cannot grow an icon glyph on a nav badge.
     * `variant`, `size`, `semanticType`, and `message` remain parent-owned.
     */
    badgeProps?: Pick<ArvoBadgeProps, 'colorMode' | 'customColor'>;
    /** Scoped escape-hatch bag for the per-row ArvoDropdownIconButton (overflow). */
    menuProps?: NavMenuProps;
}
/**
 * Scoped escape-hatch bag for the per-row overflow trigger
 * `ArvoDropdownIconButton`. `isCompact` is parent-owned (always true) and
 * intentionally excluded.
 */
export type NavMenuProps = Pick<ArvoDropdownIconButtonProps, 'placement' | 'maxHeight' | 'hasGroupDividers' | 'search' | 'menuProps'>;
export type ArvoNavSize = 'sm' | 'md' | 'lg';
/**
 * Maximum inline actions before excess actions fold into the overflow menu.
 * 3 inline + 1 overflow trigger = the spec's hard cap of 4 visible
 * trailing fixtures.
 */
export declare const NAV_ITEM_MAX_INLINE_ACTIONS = 3;
/**
 * Pin / unpin affordance config injected by ArvoNav when `hasPinning` is
 * enabled. NavItem renders this slot as an `ArvoToggleButton` (variant
 * tertiary, size sm) at the start of the trailing action cluster so the
 * icon swap (`push-pin` <-> `push-pinned`) and `aria-pressed` are driven
 * by the toggle's selected state.
 */
export interface ArvoNavItemPinToggle {
    isSelected: boolean;
    /** Tooltip + accessible name. Defaults to 'Pin' / 'Unpin' based on isSelected. */
    tooltip?: string;
    isDisabled?: boolean;
    /** Fires whenever the user flips the toggle. Receives the next pinned value. */
    onSelectedChange?: (next: boolean) => void;
}
export interface ArvoNavItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'onClick' | 'children'> {
    /** Stable id for selection / pinning / focus tracking. */
    id: string;
    label: string;
    size?: ArvoNavSize;
    /**
     * Compact icon-only rendering. When true, only the leading icon
     * remains visible; label / metadata / trailing actions are hidden
     * via CSS but the label is preserved as the polymorphic root's
     * accessible name (`aria-label`) and native hover / focus `title`
     * tooltip. Cascaded from `ArvoNav.isCompact`.
     */
    isCompact?: boolean;
    /** When set, renders as <a>; otherwise <button type='button'>. */
    href?: string;
    target?: string;
    rel?: string;
    icon?: string;
    avatar?: ArvoNavItemAvatarConfig;
    status?: {
        type: ArvoStatusType;
        label?: string;
    };
    badge?: {
        message: string;
        semanticType?: ArvoBadgeSemanticType;
    };
    actions?: NavItemAction[];
    menuItems?: MenuItemData[];
    isPinned?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    tooltip?: string;
    /** Cascaded from ArvoNav. */
    actionsVisibility?: 'hover' | 'always';
    avatarProps?: Pick<ArvoAvatarProps, 'appearance' | 'isInteractive' | 'alt'>;
    statusProps?: Pick<ArvoStatusProps, 'icon'>;
    badgeProps?: Pick<ArvoBadgeProps, 'colorMode' | 'customColor'>;
    menuProps?: NavMenuProps;
    /** Overflow menu: when actions exceed NAV_ITEM_MAX_INLINE_ACTIONS, the extras append to menuItems. */
    overflowExtras?: MenuItemData[];
    /**
     * Pin toggle slot. When defined, NavItem renders an `ArvoToggleButton`
     * at the start of the trailing action cluster. ArvoNav fills this in
     * whenever `hasPinning` is true and the row is pinnable + not disabled.
     */
    pinToggle?: ArvoNavItemPinToggle;
    /** Native tab stop -- driven by ArvoNav's roving tabindex. */
    tabIndex?: number;
    onSelect?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    /**
     * Fires when any per-row inline or overflow action is invoked. The
     * event arg is undefined for actions invoked from the overflow menu
     * (where no synthetic React event is available).
     */
    onAction?: (detail: {
        actionId: string;
        itemId: string;
    }, event?: React.MouseEvent) => void;
}
/**
 * INTERNAL composition primitive. Use `ArvoNav` and pass row data via
 * `items`; do not initialize `ArvoNavItem` directly.
 */
declare const ArvoNavItem: import('react').ForwardRefExoticComponent<ArvoNavItemProps & import('react').RefAttributes<HTMLElement>>;
export default ArvoNavItem;
export { ArvoNavItem };
export type { ArvoNavItemPinToggle as NavItemPinToggle };
//# sourceMappingURL=NavItem.d.ts.map