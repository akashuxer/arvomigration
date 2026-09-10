import { ArvoAvatarProps } from '../Avatar/Avatar';
import { ArvoBadgeProps } from '../Badge/Badge';
import { ArvoIconButtonProps } from '../IconButton/IconButton';
export declare const LIST_MAX_ROW_ACTIONS = 4;
export type ArvoListVariant = 'standard' | 'rich';
export type ArvoListSelectionMode = 'none' | 'single' | 'multi';
export type ArvoListActionsVisibility = 'hover' | 'always';
/** Multi mode = string[]; single mode = string | null; none = unused. */
export type ArvoListSelectionChange = string[] | string | null;
export interface ArvoListItemAvatarConfig {
    variant?: 'image' | 'icon' | 'initials';
    name?: string;
    src?: string;
    icon?: string;
    colorMode?: string;
    semanticType?: string;
    customColor?: string;
    tooltip?: string;
}
export interface ArvoListItemBadgeConfig {
    message: string;
    semanticType?: string;
    variant?: 'label' | 'counter';
    appearance?: 'subtle' | 'filled';
    customColor?: string;
    colorMode?: string;
}
export interface ArvoListItemStatusConfig {
    type: string;
    icon?: string;
    tooltip?: string;
}
export interface ArvoListItemAction {
    id: string;
    icon: string;
    tooltip: string;
    onClick?: (detail: {
        itemId: string;
        actionId: string;
        item: ArvoListItemData;
        event: Event | React.MouseEvent | React.KeyboardEvent;
    }) => void;
    isDisabled?: boolean;
    isDanger?: boolean;
}
export interface ArvoListItemData {
    id: string;
    label: string;
    secondaryLabel?: string;
    icon?: string;
    avatar?: ArvoListItemAvatarConfig | null;
    badge?: ArvoListItemBadgeConfig | null;
    isSelected?: boolean;
    isChecked?: boolean;
    isIndeterminate?: boolean;
    isExcluded?: boolean;
    isDisabled?: boolean;
    isReorderable?: boolean;
    isLoading?: boolean;
    isSearchMatch?: boolean;
    matchFragment?: string;
    hasInlineNav?: boolean;
    hasContextMenu?: boolean;
    actions?: ArvoListItemAction[];
    status?: ArvoListItemStatusConfig | null;
    tooltip?: string;
    data?: unknown;
    avatarProps?: Partial<Pick<ArvoAvatarProps, 'appearance' | 'isInteractive' | 'alt'>>;
    badgeProps?: Partial<Pick<ArvoBadgeProps, 'tooltip' | 'customColor' | 'colorMode'>>;
    iconButtonProps?: Partial<Pick<ArvoIconButtonProps, 'tooltip'>>;
}
export interface ArvoListGroup {
    id: string;
    label?: string;
    items: ArvoListItemData[];
    hasSelectAll?: boolean;
    isCollapsed?: boolean;
}
export interface ArvoListEmptyState {
    illustration?: string;
    title: string;
    description?: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
}
export interface ArvoListReorderEvent {
    item: ArvoListItemData;
    fromIndex: number;
    toIndex: number;
    fromGroupId: string | null;
    toGroupId: string | null;
}
export interface ArvoListHandle {
    focus: () => void;
    selected: (ids?: ArvoListSelectionChange) => ArvoListSelectionChange;
    excluded: (ids?: string[]) => string[];
}
export interface ArvoListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    variant?: ArvoListVariant;
    selectionMode?: ArvoListSelectionMode;
    items?: ArvoListItemData[];
    groups?: ArvoListGroup[];
    selectedIds?: ArvoListSelectionChange;
    defaultSelectedIds?: ArvoListSelectionChange;
    excludedIds?: string[];
    defaultExcludedIds?: string[];
    isLoading?: boolean;
    skeletonRows?: number;
    isEmpty?: boolean;
    emptyState?: ArvoListEmptyState | null;
    hasGroupDividers?: boolean;
    hasGlobalSelectAll?: boolean;
    globalSelectAllLabel?: string;
    isReorderable?: boolean;
    /**
     * When `isReorderable` is true and the list is grouped, allow drag-reorder
     * across group boundaries. Defaults to `false` (drag is constrained to the
     * source group).
     */
    crossGroupReorder?: boolean;
    actionsVisibility?: ArvoListActionsVisibility;
    searchQuery?: string;
    isDisabled?: boolean;
    width?: string;
    ariaLabel?: string;
    onSelectionChange?: (detail: {
        selectedIds: ArvoListSelectionChange;
        items: ArvoListItemData[];
    }) => void;
    onExclusionChange?: (detail: {
        excludedIds: string[];
        items: ArvoListItemData[];
    }) => void;
    onItemClick?: (detail: {
        id: string;
        item: ArvoListItemData;
        event: React.MouseEvent | React.KeyboardEvent;
    }) => void;
    onItemActivate?: (detail: {
        id: string;
        item: ArvoListItemData;
        event: React.MouseEvent | React.KeyboardEvent;
    }) => void;
    onReorder?: (detail: ArvoListReorderEvent) => void;
    onReorderCancel?: (detail: {
        id: string;
        item: ArvoListItemData;
    }) => void;
    onItemContextMenu?: (detail: {
        id: string;
        item: ArvoListItemData;
        event: React.MouseEvent | React.KeyboardEvent;
        anchorElement: HTMLElement | null;
    }) => void;
}
declare const ArvoList: import('react').ForwardRefExoticComponent<ArvoListProps & import('react').RefAttributes<ArvoListHandle>>;
export default ArvoList;
export { ArvoList };
//# sourceMappingURL=List.d.ts.map