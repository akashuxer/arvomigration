import { ListItemBase, ListGroup } from '../../../../core/src';
import { ArvoPopoverAction } from '../Popover/Popover';
import { HybridPopoverGroup, HybridPopoverItem } from '../HybridPopover/HybridPopover';
import { ArvoEmptyStateProps } from '../EmptyState/EmptyState';
import { MenuSearchProp } from '../../types/menu-search';
export interface MenuItemAction {
    id: string;
    icon: string;
    ariaLabel?: string;
    isDisabled?: boolean;
    onClick?: (item: MenuItemData, event: React.MouseEvent) => boolean | void;
    inlinePopover?: MenuInlinePopoverConfig;
    inlineHybridPopover?: MenuInlineHybridPopoverConfig;
}
export interface MenuInlinePopoverConfig {
    title?: string;
    content: React.ReactNode;
    actions?: ArvoPopoverAction[];
    isClosable?: boolean;
    hasBackButton?: boolean;
    /**
     * Optional explicit width for the inline popover panel. CSS length string
     * (e.g. `"360px"`, `"50%"`) or a px number. Forwarded to the underlying
     * ArvoPopover instance; omitted by default (panel sizes to content).
     */
    width?: string | number;
    /**
     * Optional explicit height for the inline popover panel. CSS length string
     * or px number. Omitted by default (panel sizes to content).
     */
    height?: string | number;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onBack?: () => void;
}
export interface MenuInlineHybridPopoverConfig {
    title?: string;
    items?: HybridPopoverItem[] | HybridPopoverGroup[];
    variant?: 'multi' | 'single';
    hasBackButton?: boolean;
    /**
     * Optional explicit width (px) for the inline hybrid popover panel.
     * Forwarded to the underlying ArvoHybridPopover instance; omitted by
     * default (uses the hybrid popover's default width).
     */
    width?: number;
    /**
     * Optional explicit height (px) for the inline hybrid popover panel.
     * Omitted by default (panel sizes to content).
     */
    height?: number;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onBack?: () => void;
}
/**
 * Status indicator config for a menu item's trailing zone. A semantic key
 * maps to the matching `arvo-menu-item--status-*` modifier class; an explicit
 * `{ color }` object sets `--arvo-menu-item-status-color` inline so the dot
 * can take an arbitrary token-driven color.
 */
export type MenuItemStatus = 'success' | 'warning' | 'danger' | 'info' | {
    color: string;
};
export interface MenuItemData extends ListItemBase {
    shortcut?: string;
    /** Right-aligned meta value text rendered in the trailing zone before any actions / overflow / submenu chevron. */
    value?: string;
    /** Status indicator dot rendered in the trailing zone before meta / shortcut. */
    status?: MenuItemStatus;
    /**
     * When provided, the row is rendered as an `<a>` element (still
     * `role="menuitem"`). Standard navigation occurs after `onSelect`
     * resolves. Must not be combined with `inlinePopover` /
     * `inlineHybridPopover` (the inline panel wins; warned in dev).
     */
    href?: string;
    /**
     * Anchor target. When `'_blank'`, the row also renders the `__external`
     * icon and adds `rel="noopener noreferrer"` plus an `aria-label` suffix
     * announcing "opens in a new window". Ignored unless `href` is set.
     */
    target?: '_self' | '_blank';
    destructive?: boolean;
    active?: boolean;
    submenu?: MenuItemData[];
    actions?: MenuItemAction[];
    inlinePopover?: MenuInlinePopoverConfig;
    inlineHybridPopover?: MenuInlineHybridPopoverConfig;
    switch?: {
        checked: boolean;
        onChange?: (checked: boolean, item: MenuItemData) => void;
        ariaLabel?: string;
    };
}
export interface ArvoActionMenuProps {
    items: MenuItemData[] | ListGroup<MenuItemData>[];
    isLoading?: boolean;
    /** Enable search with defaults (`true`) or pass a config object. */
    search?: MenuSearchProp;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end' | 'auto';
    /** Optional CSS width for the parent menu panel. Omit/null for natural auto width. */
    menuWidth?: string | number | null;
    /** Optional CSS width for nested submenu panels only. Omit/null for natural auto width. */
    submenuWidth?: string | number | null;
    maxHeight?: string;
    hasGroupDividers?: boolean;
    actionsVisibility?: 'always' | 'hover';
    /**
     * Maximum number of trailing actions rendered inline per item. Any actions
     * beyond this cap are moved into an overflow `ArvoDropdownIconButton`
     * rendered inside the `__overflow` slot. Defaults to `4` per the spec.
     */
    actionsMaxVisible?: number;
    submenuTrigger?: 'hover' | 'click';
    closeOnSelect?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    /**
     * Canonical trigger contract: pass the ref of the element ActionMenu should
     * anchor against, write `aria-haspopup`/`aria-controls`/`aria-expanded` onto,
     * and return focus to on close. ActionMenu does NOT attach a click listener
     * on the trigger; drive open/close via the imperative ref handle's
     * `open()`/`close()`/`toggle()` methods OR the controlled `isOpen` prop.
     * Either `triggerRef` or `trigger` is required.
     */
    triggerRef?: React.RefObject<HTMLElement | null>;
    /**
     * Convenience trigger surface: a ReactElement that ActionMenu refs
     * internally (the consumer does not need to manage a ref). The consumer's
     * `onClick` is preserved -- ActionMenu does NOT overwrite it. When using
     * this form, drive open/close via the imperative ref handle or the
     * controlled `isOpen` prop. Either `triggerRef` or `trigger` is required.
     * If both are provided, `triggerRef` wins.
     */
    trigger?: React.ReactElement;
    /**
     * Configuration for the menu's empty state. Only a curated subset of the
     * EmptyState surface is reachable through overlays -- the wiring layer
     * always renders `size='sm' orientation='vertical'`, and only the
     * secondary action button is exposed (a "clear search" affordance).
     * primary action, link, and orientation/size are intentionally NOT
     * configurable here.
     */
    emptyConfig?: Partial<Pick<ArvoEmptyStateProps, 'illustration' | 'title' | 'message' | 'secondaryAction'>>;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onSelect?: (item: MenuItemData, index: number) => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
    className?: string;
}
/**
 * Imperative handle exposed via `forwardRef` on ArvoActionMenu. Consumers (and
 * the dropdown/split button wrappers) drive the menu programmatically through
 * this handle instead of simulating clicks on the trigger.
 */
export interface ArvoActionMenuHandle {
    /** Open the menu. Cancellable via `onOpen` and the `action-menu:open` event. */
    open: () => void;
    /**
     * Close the menu programmatically. Cancellable via `onClose` and the
     * `action-menu:close` event. Engine-driven dismissal (outside-click, Escape)
     * does NOT fire either of those.
     */
    close: () => void;
    /** Toggle. Optional `force` to set explicitly. */
    toggle: (force?: boolean) => void;
    /** Returns the current open state. */
    isOpen: () => boolean;
    /** Returns the panel root element when mounted, otherwise null. */
    getPanelElement: () => HTMLDivElement | null;
}
declare const ArvoActionMenu: import('react').ForwardRefExoticComponent<ArvoActionMenuProps & import('react').RefAttributes<ArvoActionMenuHandle>>;
export { ArvoActionMenu };
export default ArvoActionMenu;
//# sourceMappingURL=ActionMenu.d.ts.map