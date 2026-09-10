import { ReactElement, ReactNode, Ref } from 'react';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelBannerConfig, ArvoPanelInfoConfig, ArvoPanelAction } from '../../../../utils/src';
export type ArvoSidePanelVariant = 'layout' | 'overlay';
export type ArvoSidePanelSide = 'left' | 'right';
export interface ArvoSidePanelHandle {
    pinned(value?: boolean): boolean | void;
    setVariant(variant: ArvoSidePanelVariant): void;
    open(): void;
    close(): void;
    toggle(): void;
    isOpen(): boolean;
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
}
/**
 * @deprecated Use `ArvoPanelProps`. ArvoSidePanel will be removed in the next
 * major release.
 */
export interface ArvoSidePanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClose' | 'onSelect' | 'title'> {
    variant?: ArvoSidePanelVariant;
    side?: ArvoSidePanelSide;
    isPinnable?: boolean;
    isPinned?: boolean;
    defaultPinned?: boolean;
    onPinChange?: (pinned: boolean) => void;
    hasSplitter?: boolean | 'auto';
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number | null;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    closeOnEscape?: boolean;
    closeOnOutside?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
    className?: string;
    children?: ReactNode;
    /**
     * Forwarded to the imperative handle. The forwarded `ref` always points to
     * the host `.arvo-sp` element; use `instanceRef` for the imperative API.
     */
    instanceRef?: Ref<ArvoSidePanelHandle>;
    title?: string | null;
    hasHeader?: boolean;
    hasBackButton?: boolean;
    onBack?: () => void;
    headerActions?: ArvoPanelHeaderAction[];
    stickyHeader?: ArvoPanelStickyHeaderConfig | false;
    actions?: ArvoPanelAction[] | false;
    hasFooter?: boolean;
    isClosable?: boolean;
    searchQuery?: string;
    defaultSearchQuery?: string;
    /**
     * Fired when the search query changes. `matchedCount` is `null` (the panel
     * does not own the body content); compute and surface your own filtered
     * count via the `setInfo()` handle method or a reactive `stickyHeader`.
     */
    onSearchChange?: (query: string, matchedCount: number | null) => void;
    onTabSelect?: (id: string) => void;
}
export type { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelBannerConfig, ArvoPanelInfoConfig, ArvoPanelAction, };
export type ArvoSidePanelHeaderAction = ArvoPanelHeaderAction;
export type ArvoSidePanelStickyHeaderConfig = ArvoPanelStickyHeaderConfig;
export type ArvoSidePanelBannerConfig = ArvoPanelBannerConfig;
export type ArvoSidePanelInfoConfig = ArvoPanelInfoConfig;
export type ArvoSidePanelAction = ArvoPanelAction;
export declare const ArvoSidePanel: (props: ArvoSidePanelProps & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement | null;
export default ArvoSidePanel;
//# sourceMappingURL=SidePanel.d.ts.map