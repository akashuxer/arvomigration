import { ReactNode } from 'react';
import { ListItemBase } from '../../../../core/src';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelInfoConfig, ArvoPanelAction } from '../../../../utils/src';
export interface PanelShellProps<T extends ListItemBase = ListItemBase> {
    parentBlock: string;
    pinSlot?: ReactNode;
    title?: string | null;
    hasHeader?: boolean;
    hasBackButton?: boolean;
    onBack?: () => void;
    headerActions?: ArvoPanelHeaderAction[];
    stickyHeader?: ArvoPanelStickyHeaderConfig | false;
    /**
     * Optional ReactNode rendered as the FIRST child of `__hdr-lft` (after
     * the back button when present, before `__title`). Used by `ArvoPanel`
     * to inject the leading title icon (`<i class="arvo-pnl__icon
     * o9con-{name}">`). Kept generic so consumers can render arbitrary
     * pre-title chrome without a schema baked into the shell.
     */
    titleLeading?: ReactNode;
    /**
     * Optional ReactNode rendered as the LAST child of `__hdr-lft` (after
     * `__title`). Used by `ArvoPanel` to inject the trailing
     * `ArvoStatus` + `ArvoBadge` cluster.
     */
    titleTrailing?: ReactNode;
    /**
     * Optional ReactNode rendered AFTER the standard 40px `__hdr` and
     * BEFORE the sticky region (`__sticky`) / body (`__body`). Used by
     * `ArvoPanel` to inject the `__rich-hdr` region so the DOM order
     * matches the descriptor: `__hdr -> __rich-hdr -> __sticky -> __body
     * -> __footer`. Passing it as an explicit slot (rather than a child of
     * PanelShell) is what keeps `__rich-hdr` OUTSIDE the scrolling body.
     */
    richHeader?: ReactNode;
    items?: T[];
    getItemId?: (item: T) => string;
    filterKeys?: Array<keyof T & string>;
    getItemSearchText?: (item: T) => string;
    renderItem?: (item: T) => ReactNode;
    itemsRole?: 'listbox' | 'list' | 'menu';
    actions?: ArvoPanelAction[] | false;
    hasFooter?: boolean;
    isClosable?: boolean;
    onClose?: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    isPinnableCount?: number;
    isClosableCount?: number;
    children?: ReactNode;
    className?: string;
    /** Controlled search query. */
    searchQuery?: string;
    /** Default search query for uncontrolled mode. */
    defaultSearchQuery?: string;
    onSearchChange?: (query: string, matchedCount: number | null) => void;
    onItemActivate?: (id: string, item: T) => void;
    onTabSelect?: (id: string) => void;
}
export interface PanelShellHandle {
    setItems(items: ListItemBase[]): void;
    setStickyHeader(config: ArvoPanelStickyHeaderConfig | false): void;
    setHeaderActions(actions: ArvoPanelHeaderAction[]): void;
    setActions(actions: ArvoPanelAction[] | false): void;
    setInfo(config: ArvoPanelInfoConfig | false): void;
    updateAction(id: string, patch: Partial<ArvoPanelHeaderAction | ArvoPanelAction>): void;
    search(query?: string): string | void;
    selectedTab(id?: string): string | null | void;
    setTitle(title: string | null): void;
    loading(state?: boolean): boolean | void;
    disabled(state?: boolean): boolean | void;
    focus(target?: 'first' | 'title' | 'search' | 'list'): void;
    /**
     * DOM id of the rendered title element when a header + title are present.
     * Returns `null` when there is no addressable title (no header, or empty
     * title) so the parent overlay can safely default `aria-labelledby` to it
     * and skip the attribute otherwise.
     */
    getTitleId(): string | null;
}
interface HeaderActionProps {
    action: ArvoPanelHeaderAction;
    block: string;
    isDisabled?: boolean;
}
export declare function HeaderAction({ action, block, isDisabled }: HeaderActionProps): import("react/jsx-runtime").JSX.Element | null;
export declare const PanelShell: <T extends ListItemBase = ListItemBase>(props: PanelShellProps<T> & {
    ref?: React.Ref<PanelShellHandle>;
}) => React.ReactElement | null;
export {};
//# sourceMappingURL=PanelShell.d.ts.map