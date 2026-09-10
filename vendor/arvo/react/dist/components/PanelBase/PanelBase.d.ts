import { HTMLAttributes, ReactNode, Ref } from 'react';
import { ArvoInitialFocusTarget } from '../../../../core/src';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelAction, ArvoPanelPlacement, ArvoPanelDisplayMode, ArvoPanelExpandMode, ArvoPanelCloseReason, ArvoPanelRichHeaderConfigShape } from '../../../../utils/src';
import { ArvoFabButtonProps } from '../FabButton/FabButton';
import { ArvoStatusConfig } from '../Status/Status';
import { ArvoBadgeConfig } from '../Badge/Badge';
import { MenuItemData } from '../ActionMenu/ActionMenu';
/**
 * Rich-header config for the React path. Content is any `ReactNode`.
 * `hasClear`/`onClear` render the top-right 24x24 close button that fires
 * `onClear` when activated; the consumer removes the region by clearing
 * the `richHeader` prop.
 */
export type ArvoPanelRichHeaderConfig = ReactNode | ArvoPanelRichHeaderConfigShape<ReactNode>;
/**
 * Context handed to the render-prop `body` form. Wrappers use this to
 * forward the current sticky search query into their inner Arvo
 * component's `searchQuery` prop.
 */
export interface PanelBaseBodyContext {
    /** Current sticky-area search query. Empty string when no search is
     *  configured or when the consumer cleared it. */
    searchQuery: string;
    /** Item fields to match against for built-in body filtering.
     *  Undefined when the consumer did not supply a config -- the wrapper
     *  falls back to its own per-panel default (typically `['label']`). */
    searchKeys?: string[];
    /** Custom search-text extractor. Wins over `searchKeys` when both are
     *  set. */
    getItemSearchText?: (item: unknown) => string;
}
export type PanelBaseBody = ReactNode | ((ctx: PanelBaseBodyContext) => ReactNode);
/** Component-identity marker. The wrapper writes this to the host as
 *  `arvo-pnl--type-{value}`. */
export type PanelBaseType = 'custom' | 'navigation' | 'browser' | 'filter' | 'tree';
export interface PanelBaseHandle {
    open(): void;
    close(reason?: ArvoPanelCloseReason): void;
    toggle(): void;
    isOpen(): boolean;
    pinned(value?: boolean): boolean | void;
    expanded(value?: boolean): boolean | void;
    size(value?: number): number | void;
    setDisplayMode(mode: ArvoPanelDisplayMode): void;
    setStickyHeader(config: ArvoPanelStickyHeaderConfig | false): void;
    setHeaderActions(actions: ArvoPanelHeaderAction[]): void;
    setActions(actions: ArvoPanelAction[] | false): void;
    setTitle(title: string | null): void;
    setIcon(icon: string | null): void;
    search(query?: string): string | void;
    selectedTab(id?: string): string | null | void;
    loading(state?: boolean): boolean | void;
    disabled(state?: boolean): boolean | void;
    focus(target?: 'first' | 'title' | 'search' | 'list'): void;
}
export interface PanelBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose' | 'onSelect' | 'title' | 'onResize'> {
    /** Written to the host as `arvo-pnl--type-{value}`. */
    panelType: PanelBaseType;
    /** Extra host modifiers appended after the base class list. Wrappers use
     *  this for filter/select modifiers (e.g. `filter-flat`, `select-multi`). */
    extraHostClasses?: string[];
    /** Override the computed pane `role`. When omitted PanelBase computes
     *  `dialog` for overlay, `navigation` for docked+navigation type, and
     *  `region` for every other docked type. */
    roleOverride?: 'dialog' | 'navigation' | 'region';
    displayMode?: ArvoPanelDisplayMode;
    placement?: ArvoPanelPlacement;
    isEdge?: boolean;
    /** Body content. Either a plain `ReactNode` or a render function that
     *  receives the current sticky-search context. */
    body: PanelBaseBody;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: (reason: ArvoPanelCloseReason) => boolean | void;
    isModal?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    container?: HTMLElement | (() => HTMLElement) | null;
    /**
     * Initial focus target for overlay/modal mode. `'auto'` prefers body,
     * then footer, then header. Pass an HTMLElement/resolver for a custom target.
     */
    initialFocus?: ArvoInitialFocusTarget | null;
    defaultSize?: number | string;
    minSize?: number | string;
    maxSize?: number | string;
    isResizable?: boolean;
    onResize?: (size: number) => void;
    onResizeCommit?: (size: number) => void;
    isExpandable?: boolean;
    isExpanded?: boolean;
    defaultExpanded?: boolean;
    expandMode?: ArvoPanelExpandMode;
    onExpandChange?: (expanded: boolean) => void;
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
    richHeader?: ArvoPanelRichHeaderConfig;
    stickyHeader?: ArvoPanelStickyHeaderConfig | false;
    actions?: ArvoPanelAction[] | false;
    fab?: ArvoFabButtonProps | false;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    className?: string;
    instanceRef?: Ref<PanelBaseHandle>;
}
declare const PanelBase: import('react').ForwardRefExoticComponent<PanelBaseProps & import('react').RefAttributes<HTMLDivElement>>;
export default PanelBase;
//# sourceMappingURL=PanelBase.d.ts.map