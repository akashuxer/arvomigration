import { MouseEvent as ReactMouseEvent, ReactNode, RefObject } from 'react';
import { ArvoInitialFocusTarget, Placement } from '../../../../core/src';
import { ArvoPopoverAction, ArvoPopoverHeaderAction } from '../Popover/Popover';
import { ArvoBannerAlertProps } from '../BannerAlert/BannerAlert';
import { ArvoMessageAlertType } from '../MessageAlert/MessageAlert';
import { PopoverInlineConfig } from './hpop-helpers';
export type { PopoverInlineConfig };
export declare const HPOP_MIN_WIDTH = 270;
export declare const HPOP_DEFAULT_WIDTH = 360;
export declare const HPOP_MAX_WIDTH = 700;
export declare const HPOP_MIN_HEIGHT = 272;
export interface HybridPopoverItem {
    id: string;
    label: string;
    icon?: string;
    value?: unknown;
    isDisabled?: boolean;
    isExcluded?: boolean;
    isDraggable?: boolean;
    /** @deprecated Use `inline` instead. */
    hasInline?: boolean | HybridPopoverItem[] | HybridPopoverInlineConfig;
    inline?: HybridPopoverInlineConfig | PopoverInlineConfig;
    isIndeterminate?: boolean;
}
export interface HybridPopoverGroup {
    id: string;
    label?: string;
    isDraggable?: boolean;
    hasSelectAll?: boolean;
    items: HybridPopoverItem[];
}
export interface HybridPopoverMessageAlertConfig {
    type?: ArvoMessageAlertType;
    message?: string | ((count: number, total: number) => string);
    icon?: string | null;
}
export interface HybridPopoverSearchConfig {
    variant?: 'default' | 'filter-search';
    placeholder?: string;
    shortcut?: string;
    counter?: boolean;
    messageAlert?: false | HybridPopoverMessageAlertConfig;
}
export interface HybridPopoverConditionalConfig {
    value: 'and' | 'or';
    onChange: (value: 'and' | 'or') => void;
}
export interface HybridPopoverEmptyConfig {
    noDataTitle?: string;
    noDataMessage?: string;
    noResultsTitle?: string;
    noResultsMessage?: string;
    noResultsClearLabel?: string;
    /** Informational message rendered when dataState='appliesToAll'. */
    appliesToAllMessage?: string;
}
export type HybridPopoverDataState = 'data' | 'appliesToAll' | 'noResults' | 'noData';
export interface HybridPopoverInlineConfig {
    title?: string;
    items?: HybridPopoverItem[] | HybridPopoverGroup[];
    variant?: 'multi' | 'single';
    hasBackButton?: boolean;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onBack?: () => void;
}
export interface HybridPopoverReorderDetail {
    fromIndex: number;
    toIndex: number;
    fromGroup: string | null;
    toGroup: string | null;
    items: HybridPopoverItem[] | HybridPopoverGroup[];
}
export interface HybridPopoverChangeMeta {
    item: HybridPopoverItem | null;
    action: 'toggle' | 'select-all' | 'group-select-all' | 'apply' | 'reset' | 'clear';
}
export interface ArvoHybridPopoverHandle {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
    value: (next?: string[] | string | null) => string[] | string | null | void;
    setLoading: (loading: boolean) => void;
    updateItems: (items: HybridPopoverItem[] | HybridPopoverGroup[]) => void;
    reposition: () => void;
}
export type HybridPopoverVariant = 'multi' | 'single' | 'boolean' | 'conditional' | 'custom';
export interface ArvoHybridPopoverProps {
    variant?: HybridPopoverVariant;
    selectionMode?: 'multi' | 'single' | 'none';
    /**
     * Controlled item ordering. When provided the consumer owns ordering and
     * must update via onReorder. Either `items` or `defaultItems` must be set.
     */
    items?: HybridPopoverItem[] | HybridPopoverGroup[];
    /**
     * Initial items for uncontrolled usage. When supplied (or when `items` is
     * omitted), the component manages drag-reorder internally and `onReorder`
     * is fired with the resulting array.
     */
    defaultItems?: HybridPopoverItem[] | HybridPopoverGroup[];
    value?: string[] | string | null;
    defaultValue?: string[] | string | null;
    onChange?: (value: string[] | string | null, meta: HybridPopoverChangeMeta) => void;
    commitOn?: 'apply' | 'change';
    search?: false | HybridPopoverSearchConfig;
    bannerAlert?: ArvoBannerAlertProps | false;
    conditional?: false | HybridPopoverConditionalConfig;
    hasGlobalSelectAll?: boolean;
    enableReorder?: boolean;
    crossGroupDrag?: boolean;
    onReorder?: (detail: HybridPopoverReorderDetail) => void;
    emptyConfig?: HybridPopoverEmptyConfig;
    /**
     * Escape-hatch bag forwarded to the embedded ArvoList instance using the
     * bag-first / flat-wins merge rule. Use for the long-tail ArvoList knobs
     * the HybridPopover does not curate (e.g. `actionsVisibility`,
     * `hasGroupDividers`, `skeletonRows`, `width`, `ariaLabel`). Parent-owned
     * props (selection, items, isLoading, isReorderable, search-derived
     * isEmpty / emptyState) cannot be overridden via this bag. Typed as a
     * `Pick<ArvoListProps,...>` so it stays additive across future ArvoList
     * surface growth.
     */
    listProps?: {
        variant?: 'standard' | 'rich';
        actionsVisibility?: 'hover' | 'always';
        hasGroupDividers?: boolean;
        skeletonRows?: number;
        width?: string;
        ariaLabel?: string;
    };
    actions?: ArvoPopoverAction[] | false;
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
    isLoading?: boolean;
    /**
     * Explicit data-state override. When 'data' (default) the component infers
     * state from items + filter query (totalCount === 0 -> noData,
     * filteredCount === 0 -> noResults). Set to 'appliesToAll' to render the
     * informational filter-applies-to-all message (header, search, and footer
     * remain). Setting 'noData' / 'noResults' forces those branches regardless
     * of items.
     * State precedence: isLoading > noResults > noData > appliesToAll > data.
     */
    dataState?: HybridPopoverDataState;
    isOpen?: boolean | null;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    triggerRef?: RefObject<HTMLElement | null>;
    renderTrigger?: (props: {
        ref: RefObject<HTMLElement | null>;
        onClick?: (event: ReactMouseEvent) => void;
        'aria-expanded': boolean;
        'aria-controls': string;
        'aria-haspopup': 'dialog';
    }) => ReactNode;
    isInline?: boolean;
    parent?: string | null;
    /**
     * Initial focus target for the composed popover. `'auto'` keeps the
     * searchable HybridPopover behavior: search receives focus when rendered,
     * otherwise the first focusable body item is used.
     */
    initialFocus?: ArvoInitialFocusTarget | null;
    onApply?: (value: string[] | string | null) => boolean | void;
    onCancel?: () => void;
    onReset?: () => void;
    className?: string;
}
declare const ArvoHybridPopover: import('react').ForwardRefExoticComponent<ArvoHybridPopoverProps & import('react').RefAttributes<ArvoHybridPopoverHandle>>;
export { ArvoHybridPopover };
export default ArvoHybridPopover;
//# sourceMappingURL=HybridPopover.d.ts.map