import { HTMLAttributes, Ref } from 'react';
import { ArvoInitialFocusTarget } from '../../../../core/src';
import { PanelBaseHandle, ArvoPanelRichHeaderConfig as PanelBaseRichHeaderConfig } from '../PanelBase/PanelBase';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelAction, ArvoPanelCloseReason, ArvoPanelDisplayMode } from '../../../../utils/src';
import { ArvoNavProps, ArvoNavItemData, ArvoNavSize } from '../Nav/Nav';
import { ArvoStatusConfig } from '../Status/Status';
import { ArvoBadgeConfig } from '../Badge/Badge';
import { ArvoFabButtonProps } from '../FabButton/FabButton';
import { MenuItemData } from '../ActionMenu/ActionMenu';
/** Rich-header config (bare content or the full `{ content, hasClear, onClear }`). */
export type ArvoNavPanelRichHeaderConfig = PanelBaseRichHeaderConfig;
/** Narrowed placement enum -- ArvoNavPanel supports left / right only. */
export type ArvoNavPanelPlacement = 'left' | 'right';
/** Imperative handle exposed via `instanceRef`. */
export type ArvoNavPanelHandle = Omit<PanelBaseHandle, 'expanded' | 'size'>;
export interface ArvoNavPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose' | 'onSelect' | 'title' | 'onResize' | 'children'> {
    displayMode?: ArvoPanelDisplayMode;
    /** Narrowed to `'left' | 'right'`. Top / bottom are intentionally not
     *  supported for a nav rail. */
    placement?: ArvoNavPanelPlacement;
    isEdge?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: (reason: ArvoPanelCloseReason) => boolean | void;
    isModal?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    container?: HTMLElement | (() => HTMLElement) | null;
    initialFocus?: ArvoInitialFocusTarget | null;
    hasHeader?: boolean;
    title?: string | null;
    icon?: string;
    status?: Omit<ArvoStatusConfig, 'placement'>;
    badge?: Omit<ArvoBadgeConfig, 'placement'>;
    hasBackButton?: boolean;
    onBack?: () => void;
    headerActions?: ArvoPanelHeaderAction[];
    hasOverflowMenu?: boolean;
    overflowMenuItems?: MenuItemData[];
    isPinnable?: boolean;
    isPinned?: boolean;
    defaultPinned?: boolean;
    onPinChange?: (pinned: boolean) => void;
    isDismissible?: boolean;
    richHeader?: ArvoNavPanelRichHeaderConfig;
    stickyHeader?: ArvoPanelStickyHeaderConfig | false;
    actions?: ArvoPanelAction[] | false;
    fab?: ArvoFabButtonProps | false;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    className?: string;
    /**
     * Compact icon-only rail. When true, the panel width is derived from
     * `size` (sm=32px, md=40px, lg=48px) and every NavItem renders only
     * its leading icon; label + metadata are preserved as the accessible
     * name and native hover / focus tooltip. Inline banner / TabStrip /
     * full search input are suppressed by the panel's compact CSS.
     */
    isCompact?: boolean;
    /**
     * Nested Arvo Nav density. Cascades to every NavItem row height
     * (sm=32px, md=40px, lg=48px) and, when `isCompact=true`, drives the
     * compact rail width.
     */
    size?: ArvoNavSize;
    /** Nav destinations. Forwarded to the inner ArvoNav's `items` prop.
     *  Required unless `isLoading=true` (Pattern B skeleton hides the
     *  body). */
    items: ArvoNavItemData[];
    /** Controlled active nav destination id. */
    activeId?: string;
    /** Uncontrolled initial active destination id. */
    defaultActiveId?: string;
    /** Nav activation callback. Also emitted as `pnl:nav-activate`. */
    onActivate?: (detail: {
        id: string;
        item: ArvoNavItemData;
    }) => void;
    /** Escape-hatch bag for the inner ArvoNav (bag-first / flat-wins).
     *  `size` and `isCompact` are parent-owned and exposed as first-class
     *  flat props -- they are intentionally excluded from this bag. */
    navProps?: Pick<ArvoNavProps, 'hasPinning' | 'actionsVisibility' | 'menuProps' | 'onPinChange' | 'onAction'>;
    instanceRef?: Ref<ArvoNavPanelHandle>;
}
declare const ArvoNavPanel: import('react').ForwardRefExoticComponent<ArvoNavPanelProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoNavPanel;
//# sourceMappingURL=NavPanel.d.ts.map