import { ReactElement, ReactNode, Ref } from 'react';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelBannerConfig, ArvoPanelInfoConfig, ArvoPanelAction } from '../../../../utils/src';
/**
 * Drawer side. Only `left` and `right` are supported -- passing `top` or
 * `bottom` falls back to `right` with a one-shot dev warning.
 */
export type ArvoDrawerSide = 'left' | 'right';
export type ArvoDrawerCloseReason = 'escape' | 'mask-click' | 'close-button' | 'programmatic';
/**
 * Mask config for the Drawer scrim. The shared `@arvo/core/mask` overlay
 * primitive paints a single canonical scrim with a fixed background color
 * and `backdrop-filter: blur(4px)`. Pass `true` for defaults or an object
 * to control dismiss behavior.
 */
export interface ArvoDrawerMaskConfig {
    /**
     * When true, clicking the mask closes the drawer (default true). This is
     * an alias of the parent `closeOnOutsideClick` / `closeOnMaskClick` and
     * applies regardless of whether a mask is rendered.
     */
    closeOnClick?: boolean;
}
export interface ArvoDrawerHandle {
    open(): void;
    close(reason?: ArvoDrawerCloseReason): void;
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
 * @deprecated Use `ArvoPanelProps`. ArvoDrawer will be removed in the next
 * major release.
 */
export interface ArvoDrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClose' | 'onSelect' | 'title'> {
    side?: ArvoDrawerSide;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: (reason: ArvoDrawerCloseReason) => boolean | void;
    hasMask?: boolean | ArvoDrawerMaskConfig;
    closeOnEscape?: boolean;
    /**
     * Whether clicking outside the drawer pane closes it. Defaults to `true`
     * and applies in BOTH masked and mask-less configurations -- the prop
     * controls dismissal behavior, not whether a scrim is painted. The
     * legacy `closeOnMaskClick` name is preserved for source compatibility;
     * `closeOnOutsideClick` is the new canonical name.
     */
    closeOnOutsideClick?: boolean;
    /** @deprecated Use `closeOnOutsideClick`; both are honored, this is the older name. */
    closeOnMaskClick?: boolean;
    lockScroll?: boolean | 'auto';
    container?: HTMLElement | (() => HTMLElement) | null;
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    height?: string | number | null;
    animationDuration?: number;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    isClosable?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    className?: string;
    children?: ReactNode;
    /**
     * Forwarded to the imperative handle. The forwarded `ref` always points to
     * the host `.arvo-drw` element; use `instanceRef` for the imperative API.
     */
    instanceRef?: Ref<ArvoDrawerHandle>;
    title?: string | null;
    hasHeader?: boolean;
    hasBackButton?: boolean;
    onBack?: () => void;
    headerActions?: ArvoPanelHeaderAction[];
    stickyHeader?: ArvoPanelStickyHeaderConfig | false;
    actions?: ArvoPanelAction[] | false;
    hasFooter?: boolean;
    searchQuery?: string;
    defaultSearchQuery?: string;
    /**
     * Fired when the search query changes. `matchedCount` is `null` (the drawer
     * does not own the body content); compute and surface your own filtered
     * count via the `setInfo()` handle method or a reactive `stickyHeader`.
     */
    onSearchChange?: (query: string, matchedCount: number | null) => void;
    onTabSelect?: (id: string) => void;
}
export type { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelBannerConfig, ArvoPanelInfoConfig, ArvoPanelAction, };
export declare const ArvoDrawer: (props: ArvoDrawerProps & {
    ref?: Ref<HTMLDivElement>;
}) => ReactElement | null;
export default ArvoDrawer;
//# sourceMappingURL=Drawer.d.ts.map