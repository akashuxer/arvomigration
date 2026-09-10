import { HTMLAttributes, ReactNode, Ref } from 'react';
import { ArvoInitialFocusTarget } from '../../../../core/src';
import { PanelBaseHandle, ArvoPanelRichHeaderConfig as PanelBaseRichHeaderConfig } from '../PanelBase/PanelBase';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelAction, ArvoPanelPlacement, ArvoPanelDisplayMode, ArvoPanelExpandMode, ArvoPanelCloseReason, ArvoPanelSearchConfig, ArvoPanelSearchVariant } from '../../../../utils/src';
import { ArvoStatusConfig } from '../Status/Status';
import { ArvoBadgeConfig } from '../Badge/Badge';
import { ArvoFabButtonProps } from '../FabButton/FabButton';
import { MenuItemData } from '../ActionMenu/ActionMenu';
/** Public rich-header config type -- consumer-supplied content plus an
 *  optional single clear action. Bare `ReactNode` shorthand still works. */
export type ArvoPanelRichHeaderConfig = PanelBaseRichHeaderConfig;
/** Public rich-header shape (React content type). */
export type ArvoPanelRichHeaderConfigShape = Extract<ArvoPanelRichHeaderConfig, {
    content: unknown;
}>;
/** Imperative handle exposed via `instanceRef`. */
export type ArvoPanelHandle = PanelBaseHandle;
/** Render-prop context handed to `<ArvoPanel>{(ctx) => ...}</ArvoPanel>`.
 *  Carries the current sticky-search query so the consumer can filter
 *  their own body content. Only `searchQuery` is documented as the public
 *  contract; the additional `searchKeys` / `getItemSearchText` fields flow
 *  through from the sticky-search config but consumers of `ArvoPanel`
 *  typically ignore them because the custom body owns its own filter
 *  pipeline. */
export type ArvoPanelChildrenContext = {
    searchQuery: string;
};
/** `ArvoPanel.children` accepts either a plain `ReactNode` or a render
 *  function that receives the current sticky-search context. */
export type ArvoPanelChildren = ReactNode | ((ctx: ArvoPanelChildrenContext) => ReactNode);
export interface ArvoPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClose' | 'onSelect' | 'title' | 'onResize' | 'children'> {
    displayMode?: ArvoPanelDisplayMode;
    /** Full 4-way placement. The specialized panels narrow this to
     *  `'left' | 'right'`. */
    placement?: ArvoPanelPlacement;
    /**
     * When true, removes the body's inline (left/right) padding so custom
     * content runs flush to the inline pane edges. Header, rich header,
     * sticky area, and footer keep their padding.
     */
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
    /** Leading 20x20 o9con icon glyph rendered before the title. */
    icon?: string;
    /** Optional inline ArvoStatus rendered after the title. */
    status?: Omit<ArvoStatusConfig, 'placement'>;
    /** Optional inline ArvoBadge rendered after the title (and status). */
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
    /**
     * Body content. Either a plain `ReactNode` OR a render function that
     * receives the current sticky-search context so consumers can filter
     * their body content in step with `stickyHeader.search`.
     */
    children?: ArvoPanelChildren;
    instanceRef?: Ref<ArvoPanelHandle>;
}
export type { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelAction, ArvoPanelPlacement, ArvoPanelDisplayMode, ArvoPanelExpandMode, ArvoPanelCloseReason, ArvoPanelSearchConfig, ArvoPanelSearchVariant, };
declare const ArvoPanel: import('react').ForwardRefExoticComponent<ArvoPanelProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoPanel;
//# sourceMappingURL=Panel.d.ts.map