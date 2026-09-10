import { HTMLAttributes, Ref } from 'react';
import { ArvoInitialFocusTarget } from '../../../../core/src';
import { PanelBaseHandle, ArvoPanelRichHeaderConfig as PanelBaseRichHeaderConfig } from '../PanelBase/PanelBase';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelAction, ArvoPanelCloseReason, ArvoPanelDisplayMode } from '../../../../utils/src';
import { ArvoListProps, ArvoListItemData } from '../List/List';
import { ArvoAccordionProps } from '../Accordion/Accordion';
import { ArvoStatusConfig } from '../Status/Status';
import { ArvoBadgeConfig } from '../Badge/Badge';
import { ArvoFabButtonProps } from '../FabButton/FabButton';
import { MenuItemData } from '../ActionMenu/ActionMenu';
export type ArvoFilterPanelRichHeaderConfig = PanelBaseRichHeaderConfig;
export type ArvoFilterPanelPlacement = 'left' | 'right';
/** Filter body layout. */
export type ArvoPanelFilterView = 'flat' | 'grouped';
/**
 * Filter selection mode. `'single'` maps to inner ArvoList
 * `selectionMode='single'` (radio rows); `'multiple'` maps to inner
 * ArvoList `selectionMode='multi'` (checkbox rows). ArvoFilterPanel
 * exposes the human-friendly `'multiple'` and translates internally.
 */
export type ArvoPanelFilterSelectionMode = 'single' | 'multiple';
/** Grouped-view section descriptor. */
export interface ArvoPanelFilterGroup {
    id: string;
    title: string;
    icon?: string;
    items: ArvoListItemData[];
}
/** Imperative handle exposed via `instanceRef`. Includes `size()` for
 *  the optional resizable path (FilterPanel keeps `expanded` off but
 *  now exposes size once `isResizable=true`). */
export type ArvoFilterPanelHandle = Omit<PanelBaseHandle, 'expanded'>;
export interface ArvoFilterPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose' | 'onSelect' | 'title' | 'onResize' | 'children'> {
    displayMode?: ArvoPanelDisplayMode;
    placement?: ArvoFilterPanelPlacement;
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
    richHeader?: ArvoFilterPanelRichHeaderConfig;
    stickyHeader?: ArvoPanelStickyHeaderConfig | false;
    actions?: ArvoPanelAction[] | false;
    fab?: ArvoFabButtonProps | false;
    /**
     * When true, mounts an `ArvoSplitter` on the inner edge so users can
     * resize the panel width between `minSize` and `maxSize`.
     * Recommended defaults per guidelines: min 320px, default 400px,
     * overlay max `min(800px, 80vw)`, docked max `min(800px, 60vw)`.
     */
    isResizable?: boolean;
    defaultSize?: number | string;
    minSize?: number | string;
    maxSize?: number | string;
    onResize?: (size: number) => void;
    onResizeCommit?: (size: number) => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    className?: string;
    /** Filter body layout. Default `'flat'`. */
    filterView?: ArvoPanelFilterView;
    /** Selection mode. Default `'multiple'`. */
    selectionMode?: ArvoPanelFilterSelectionMode;
    /** Flat-view rows. */
    items?: ArvoListItemData[];
    /** Grouped-view sections. */
    groups?: ArvoPanelFilterGroup[];
    /** Controlled selected row ids across the flattened set. */
    selectedIds?: string[];
    /** Uncontrolled initial selection. */
    defaultSelectedIds?: string[];
    /** Selection-change callback. Also emitted as `pnl:filter-change`. */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** Escape-hatch bag applied to every inner ArvoList. */
    listProps?: Pick<ArvoListProps, 'variant' | 'hasGroupDividers' | 'actionsVisibility' | 'isReorderable' | 'onReorder' | 'onItemContextMenu' | 'emptyState'>;
    /** Escape-hatch bag applied to the wrapping ArvoAccordion (grouped
     *  view only). */
    accordionProps?: Pick<ArvoAccordionProps, 'expandMode' | 'isCollapsible' | 'size' | 'variant'>;
    instanceRef?: Ref<ArvoFilterPanelHandle>;
}
declare const ArvoFilterPanel: import('react').ForwardRefExoticComponent<ArvoFilterPanelProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoFilterPanel;
//# sourceMappingURL=FilterPanel.d.ts.map