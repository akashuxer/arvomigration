import { ArvoIconButtonStatusConfig } from '../IconButton/IconButton';
import { ArvoDropdownIconButtonProps } from '../DropdownIconButton/DropdownIconButton';
import { ArvoBadgeSemanticType } from '../Badge/Badge';
import { ArvoStatusType } from '../Status/Status';
import { ArvoMessageAlertType } from '../MessageAlert/MessageAlert';
import { ArvoActionMenuProps, MenuItemData } from '../ActionMenu/ActionMenu';
export type { ArvoBadgeSemanticType, ArvoStatusType, ArvoMessageAlertType, MenuItemData, ArvoIconButtonStatusConfig, };
export interface TabItem {
    id: string;
    label: string;
    panelId?: string;
    icon?: string;
    isDisabled?: boolean;
    pinned?: boolean;
    isClosable?: boolean;
    order?: number;
    tooltip?: string;
    /**
     * Explicit override for the tab's accessible name. When omitted, the
     * Tabstrip composes a name of the form
     * `"<label> tab[, selected][, <badge>][, <alertLabel>][, status: <statusLabel>][, pinned]"`
     * so screen-reader users hear inline-slot state alongside the label
     * (per WAI-ARIA Tabs guidance).
     */
    ariaLabel?: string;
    /**
     * Inline badge slot. Renders `ArvoBadge size="sm"` with `hasBadgeIcon`
     * forced to `false` -- tab badges are label-only by design. When
     * `tooltip` is provided it is forwarded to the inner ArvoBadge as a
     * hover tooltip; the badge label is still folded into the tab's
     * composed accessible name.
     */
    badge?: {
        label: string;
        semanticType?: ArvoBadgeSemanticType;
        tooltip?: string;
    };
    alert?: {
        label?: string;
        type?: ArvoMessageAlertType;
    };
    /**
     * Inline status slot. Renders `ArvoStatus size="sm" placement="inline"`.
     * When `tooltip` is provided it replaces `label` as the ArvoStatus
     * hover tooltip; `label` is still used for the composed accessible
     * name.
     */
    status?: {
        label: string;
        type?: ArvoStatusType;
        tooltip?: string;
    };
    menuItems?: MenuItemData[];
    /**
     * Status overlay rendered on the per-tab pin action button. Uses the
     * canonical `ArvoIconButtonStatusConfig` "config slot" surface (overlay
     * placement only; size derived from the host icon button). Pass `null`
     * or omit to render no status. A future release will add the matching
     * `menuActionStatus` once `ArvoDropdownIconButton` exposes its own
     * status slot.
     */
    pinActionStatus?: ArvoIconButtonStatusConfig | null;
    /**
     * Status overlay rendered on the per-tab close action button. Same
     * shape and rules as `pinActionStatus`.
     */
    closeActionStatus?: ArvoIconButtonStatusConfig | null;
}
/**
 * Scoped escape-hatch bag for the per-tab `ArvoDropdownIconButton`. The
 * per-tab menu button is always rendered with `isCompact: true` (no
 * trailing caret); the bag intentionally excludes `isCompact` so the
 * parent always wins. Key set kept identical to the JS twin.
 */
export type TabstripMenuProps = Pick<ArvoDropdownIconButtonProps, 'placement' | 'maxHeight' | 'hasGroupDividers' | 'search' | 'menuProps'>;
/**
 * Scoped escape-hatch bag for the overflow `ArvoActionMenu` (the
 * tabstrip-level "More tabs" trigger). Bag-only knobs flow through; on
 * any conflict with a parent-owned prop the parent wins.
 */
export type TabstripOverflowMenuProps = Pick<ArvoActionMenuProps, 'maxHeight' | 'hasGroupDividers' | 'search' | 'actionsVisibility' | 'menuWidth' | 'submenuWidth'>;
export interface ArvoTabstripProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'lg';
    /** Default `'horizontal'`. */
    orientation?: 'horizontal' | 'vertical';
    tabs: TabItem[];
    selectedId?: string | null;
    defaultSelectedId?: string | null;
    /** Default `'automatic'` -- arrow keys also activate. `'manual'` -- only Enter/Space activate. */
    activationMode?: 'manual' | 'automatic';
    isFullWidth?: boolean;
    isClosable?: boolean;
    isPinnable?: boolean;
    isReorderable?: boolean;
    /** Show the bottom border rule. Default `true`. Horizontal only. */
    hasTabstripBorder?: boolean;
    /** Enable overflow detection and overflow dropdown. Default `true`. Horizontal only. */
    hasOverflow?: boolean;
    /** Show the Add-New button. Default `false`. Horizontal only. */
    hasAddButton?: boolean;
    /** Label for the Add-New button. Default `'Add New'`. */
    addButtonLabel?: string;
    isAddDisabled?: boolean;
    /** When tabs.length >= maxTabs the Add-New button is automatically disabled. */
    maxTabs?: number;
    /** Which tab to auto-select when the selected tab is removed from the array. Default `'select-nearest'`. */
    closeBehavior?: 'select-previous' | 'select-next' | 'select-nearest';
    isDisabled?: boolean;
    isLoading?: boolean;
    /** Per-tab dropdown menu config (the per-tab menu is always compact). */
    menuProps?: TabstripMenuProps;
    /** Overflow `ArvoActionMenu` config. */
    overflowMenuProps?: TabstripOverflowMenuProps;
    onSelect?: (detail: {
        id: string;
        index: number;
    }) => void;
    /**
     * Fires when a tab is closed via the close button, the Delete/Backspace
     * shortcut on a focused closable tab, or one of the `Close tab` /
     * `Close other tabs` / `Close tabs to the right` items in the per-tab
     * action menu. In React the `tabs` array is consumer-owned -- the
     * callback is purely informational and the consumer is responsible for
     * removing the tab from `tabs` in response. To "cancel" a close, simply
     * do nothing in the handler. The JS twin additionally honours a
     * `false` return value (or `event.preventDefault()` on the cancelable
     * `tabs:close` event) to suppress its INTERNAL default removal; the
     * React component never removes a tab on its own so the signature is
     * `void`.
     */
    onClose?: (detail: {
        id: string;
        index: number;
    }) => void;
    onPin?: (detail: {
        id: string;
        pinned: boolean;
        tabOrder: string[];
    }) => void;
    onTabAdd?: () => void;
    onTabReorder?: (tabs: TabItem[]) => void;
    onOverflowOpen?: () => void;
}
declare const ArvoTabstrip: import('react').ForwardRefExoticComponent<ArvoTabstripProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoTabstrip;
//# sourceMappingURL=Tabstrip.d.ts.map