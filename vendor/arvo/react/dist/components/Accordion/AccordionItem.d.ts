import { ArvoDropdownIconButtonProps } from '../DropdownIconButton/DropdownIconButton';
import { ArvoStatusProps, ArvoStatusType } from '../Status/Status';
import { ArvoBadgeProps, ArvoBadgeSemanticType } from '../Badge/Badge';
import { ArvoSwitchProps } from '../Switch/Switch';
import { ArvoSearchProps } from '../Search/Search';
import { ArvoEmptyStateProps } from '../EmptyState/EmptyState';
import { MenuItemData } from '../ActionMenu/ActionMenu';
export type { ArvoStatusType, ArvoBadgeSemanticType, MenuItemData };
export interface ArvoAccordionItemAction {
    id: string;
    /** o9con icon name (no prefix). */
    icon: string;
    /** Required accessible label / native tooltip. */
    tooltip: string;
    isDisabled?: boolean;
    onClick?: (event?: React.MouseEvent) => void;
}
export interface ArvoAccordionItemSearchConfig {
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    shortcut?: string;
    expandDirection?: 'start' | 'end';
    /** Controlled expanded state of the inner ArvoSearch (variant='expandable-filter'). */
    isExpanded?: boolean;
    defaultExpanded?: boolean;
    onChange?: (value: string) => void;
    onExpandedChange?: (expanded: boolean) => void;
}
export interface ArvoAccordionItemSwitchConfig {
    isChecked?: boolean;
    defaultChecked?: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
    onChange?: (isChecked: boolean) => void;
}
/**
 * Data shape consumed by the JS items[] API and re-used by the
 * React `items` prop on ArvoAccordion (when the JSX children pattern
 * is not used).
 */
export interface ArvoAccordionItemData {
    value: string;
    title: string;
    description?: string;
    icon?: string;
    status?: {
        type: ArvoStatusType;
        label?: string;
    } | null;
    badge?: {
        message: string;
        semanticType?: ArvoBadgeSemanticType;
    } | null;
    actions?: ArvoAccordionItemAction[];
    menuItems?: MenuItemData[];
    switch?: ArvoAccordionItemSwitchConfig | null;
    search?: ArvoAccordionItemSearchConfig | null;
    hasDivider?: boolean;
    panelPadding?: 'none' | 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyState?: Pick<ArvoEmptyStateProps, 'title' | 'message' | 'illustration'> | null;
    statusProps?: Pick<ArvoStatusProps, 'icon'>;
    badgeProps?: Pick<ArvoBadgeProps, 'colorMode' | 'customColor' | 'appearance'>;
    menuProps?: Pick<ArvoDropdownIconButtonProps, 'placement' | 'maxHeight' | 'hasGroupDividers' | 'search' | 'menuProps'>;
    switchProps?: Pick<ArvoSwitchProps, 'isReadOnly'>;
    searchProps?: Pick<ArvoSearchProps, 'width' | 'isFullWidth' | 'isLoading' | 'isDisabled'>;
    /** Panel content. Plain text in JS contexts; ReactNode in React. */
    content?: React.ReactNode;
}
export interface ArvoAccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onToggle' | 'title'> {
    value: string;
    title: string;
    description?: string;
    icon?: string;
    status?: {
        type: ArvoStatusType;
        label?: string;
    } | null;
    badge?: {
        message: string;
        semanticType?: ArvoBadgeSemanticType;
    } | null;
    actions?: ArvoAccordionItemAction[];
    menuItems?: MenuItemData[];
    switch?: ArvoAccordionItemSwitchConfig | null;
    search?: ArvoAccordionItemSearchConfig | null;
    hasDivider?: boolean;
    panelPadding?: 'none' | 'sm' | 'md' | 'lg';
    /** Density. Cascaded from parent ArvoAccordion when present. */
    size?: 'sm' | 'lg';
    /** Chevron position. Cascaded from parent ArvoAccordion when present. */
    align?: 'start' | 'end';
    /**
     * Controlled expanded state for standalone use. Inside an ArvoAccordion
     * the parent's value/defaultValue owns the expansion -- this prop is
     * ignored unless the item is rendered without a parent context.
     */
    isExpanded?: boolean;
    defaultExpanded?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyState?: Pick<ArvoEmptyStateProps, 'title' | 'message' | 'illustration'> | null;
    statusProps?: Pick<ArvoStatusProps, 'icon'>;
    badgeProps?: Pick<ArvoBadgeProps, 'colorMode' | 'customColor' | 'appearance'>;
    menuProps?: Pick<ArvoDropdownIconButtonProps, 'placement' | 'maxHeight' | 'hasGroupDividers' | 'search' | 'menuProps'>;
    switchProps?: Pick<ArvoSwitchProps, 'isReadOnly'>;
    searchProps?: Pick<ArvoSearchProps, 'width' | 'isFullWidth' | 'isLoading' | 'isDisabled'>;
    ariaLabel?: string;
    onExpand?: () => void;
    onCollapse?: () => void;
    onToggle?: (isExpanded: boolean) => void;
    children?: React.ReactNode;
}
declare const ArvoAccordionItem: import('react').ForwardRefExoticComponent<ArvoAccordionItemProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoAccordionItem;
export { ArvoAccordionItem };
//# sourceMappingURL=AccordionItem.d.ts.map