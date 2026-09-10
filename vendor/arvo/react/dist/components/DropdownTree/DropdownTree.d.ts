import { CSSProperties, RefObject } from 'react';
import { Placement } from '../../../../core/src';
import { ArvoPopoverAction, ArvoPopoverHeaderAction, ArvoPopoverProps } from '../Popover/Popover';
import { ArvoTreeItem, ArvoTreeViewProps, TreeViewEmptyConfig } from '../TreeView/TreeView';
import { MenuItemData } from '../ActionMenu/ActionMenu';
export declare const DD_TREE_MIN_WIDTH = 270;
export declare const DD_TREE_DEFAULT_WIDTH = 362;
export declare const DD_TREE_MAX_WIDTH = 700;
export declare const DD_TREE_MIN_HEIGHT = 272;
export interface DropdownTreeSearchConfig {
    placeholder?: string;
    shortcut?: string;
}
export interface DropdownTreeFilterConfig {
    icon?: string;
    tooltip?: string;
    items?: MenuItemData[];
    onSelect?: (item: MenuItemData, index: number) => boolean | void;
}
/**
 * Shape of the noData empty-state override. Extends `TreeViewEmptyConfig`
 * with an optional `primaryAction` so consumers can wire a `Refresh`
 * button (spec B7). The noResults state is owned by DropdownTree and is
 * not affected by this config.
 */
export interface DropdownTreeEmptyConfig extends TreeViewEmptyConfig {
    /** Optional primary action (e.g. "Refresh") rendered below the empty state. */
    primaryAction?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
    };
}
/**
 * Multi-tree shape. RESERVED for follow-up: providing `sections` today logs a
 * one-time console.warn and falls back to rendering the flat `items` prop as a
 * single tree. The shape is declared so the follow-up that renders one
 * TreeView per section + dividers is purely additive.
 */
export interface DropdownTreeSection {
    id: string;
    label?: string;
    items: ArvoTreeItem[];
    selectionMode?: 'single' | 'multiple';
    size?: 'sm' | 'lg';
    appearance?: 'default' | 'strong';
    /** Per-section select-all row. RESERVED. */
    hasSelectAll?: boolean;
}
/**
 * Scoped escape-hatch bag for the inner `ArvoPopover` (the panel chrome) the
 * parent does not curate as a flat prop. See `composition.mdx` and
 * `.cursor/rules/react-components.mdc` (Hybrid prop surface). Key set kept
 * identical to the JS twin -- drift checker enforces parity.
 */
export type DropdownTreePopoverProps = Pick<ArvoPopoverProps, 'hasArrow' | 'isInteractive' | 'trigger'>;
/**
 * Scoped escape-hatch bag for the inner `ArvoTreeView` config the parent does
 * not curate as a flat prop. Key set kept identical to the JS twin.
 *
 * Note: `emptyConfig`, `searchQuery`, `isLoading`, and `rowInteraction` are
 * NOT in this bag -- the first three are parent-owned flat props (dropdown's
 * data-state branching is the single source of truth) and `rowInteraction`
 * is intentionally excluded per the spec: DropdownTree is a hierarchical
 * picker, NOT a navigation surface. Consumers who want a navigation tree
 * inside an overlay should compose `ArvoTreeView` inside `ArvoPopover`
 * directly.
 */
export type DropdownTreeTreeProps = Pick<ArvoTreeViewProps, 'actions' | 'actionsVisibility' | 'isReorderable' | 'onReorder' | 'onLoadChildren' | 'ariaLabelledBy'>;
export interface ArvoDropdownTreeHandle {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
    selected: (ids?: string[]) => string[] | void;
    expanded: (ids?: string[]) => string[] | void;
    setLoading: (loading: boolean) => void;
    updateItems: (items: ArvoTreeItem[]) => void;
    reposition: () => void;
}
export interface ArvoDropdownTreeProps {
    items?: ArvoTreeItem[];
    /** RESERVED for follow-up. Passing `sections` logs a console.warn today. */
    sections?: DropdownTreeSection[];
    selectionMode?: 'single' | 'multiple';
    size?: 'sm' | 'lg';
    appearance?: 'default' | 'strong';
    selectedIds?: string[];
    defaultSelectedIds?: string[];
    expandedIds?: string[];
    defaultExpandedIds?: string[];
    onSelectionChange?: ArvoTreeViewProps['onSelectionChange'];
    onExpandedChange?: ArvoTreeViewProps['onExpandedChange'];
    /** Controlled search query. When unset the dropdown tracks query internally. */
    searchQuery?: string;
    /** Called whenever the internal search query changes. Receives the new query string. */
    onSearchChange?: (query: string) => void;
    search?: false | DropdownTreeSearchConfig;
    filter?: false | DropdownTreeFilterConfig;
    /**
     * Override for the noData empty state copy and illustration shown when the
     * supplied `items` array is empty. The noResults state (rendered when the
     * search query yields zero matches) is owned by DropdownTree and is NOT
     * affected by this prop.
     */
    emptyConfig?: DropdownTreeEmptyConfig;
    /**
     * When true (and `selectionMode='multiple'`), renders a sticky select-all
     * checkbox row above the tree body. Toggles every eligible (non-disabled)
     * row; reflects an indeterminate state for partial selection. Hidden in
     * single-select mode or when `items` is empty.
     */
    hasGlobalSelectAll?: boolean;
    isResizable?: boolean;
    width?: number;
    height?: number | null;
    onResize?: (detail: {
        width: number;
        height: number;
    }) => void;
    onResizeCommit?: (detail: {
        width: number;
        height: number;
    }) => void;
    title?: string | null;
    hasHeader?: boolean;
    isClosable?: boolean;
    hasBackButton?: boolean;
    onBack?: () => void;
    headerActions?: ArvoPopoverHeaderAction[];
    placement?: Placement | 'auto';
    offset?: number;
    closeOnOutside?: boolean;
    actions?: ArvoPopoverAction[] | false;
    isLoading?: boolean;
    isOpen?: boolean | null;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    triggerRef?: RefObject<HTMLElement | null>;
    renderTrigger?: ArvoPopoverProps['renderTrigger'];
    /**
     * Escape hatch for the inner `ArvoPopover` (panel chrome) config the parent
     * doesn't expose flat. Bag-only keys (`hasArrow`, `isInteractive`,
     * `trigger`) flow through. On any conflict with a parent-owned prop the
     * parent wins.
     */
    popoverProps?: DropdownTreePopoverProps;
    /**
     * Escape hatch for the inner `ArvoTreeView` config the parent doesn't
     * expose flat. Bag-only keys (`actions`, `actionsVisibility`,
     * `isReorderable`, `onReorder`, `onLoadChildren`, `emptyConfig`,
     * `ariaLabelledBy`) flow through. On any conflict with a parent-owned
     * prop (items, selectionMode, size, appearance, selectedIds,
     * defaultSelectedIds, expandedIds, defaultExpandedIds,
     * onSelectionChange, onExpandedChange, ariaLabel, isDisabled) the
     * parent wins.
     */
    treeProps?: DropdownTreeTreeProps;
    /**
     * When selection changes should be committed. Defaults to `'apply'`
     * which buffers selection inside the panel until the user clicks
     * Apply (and dispatches `dd-tree:apply` with the committed ids).
     * `'change'` keeps the legacy behavior (every toggle fires
     * `onSelectionChange` and `dd-tree:change` immediately).
     *
     * In `'apply'` mode:
     *   - `selectedIds` (when controlled) is treated as the COMMITTED
     *     selection. The dropdown maintains its own draft state for the
     *     embedded TreeView and only updates the consumer on Apply.
     *   - Cancel reverts the draft back to the committed snapshot taken
     *     when the dropdown opened and fires `dd-tree:cancel`.
     *   - Reset clears the draft (empty array) and fires
     *     `dd-tree:reset`; the panel stays open.
     */
    commitOn?: 'change' | 'apply';
    onApply?: (ids: string[]) => boolean | void;
    onCancel?: () => void;
    onReset?: () => void;
    className?: string;
    style?: CSSProperties;
}
declare const ArvoDropdownTree: import('react').ForwardRefExoticComponent<ArvoDropdownTreeProps & import('react').RefAttributes<ArvoDropdownTreeHandle>>;
export { ArvoDropdownTree };
export default ArvoDropdownTree;
//# sourceMappingURL=DropdownTree.d.ts.map