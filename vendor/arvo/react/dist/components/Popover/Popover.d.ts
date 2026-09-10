import { ReactNode } from 'react';
import { ArvoInitialFocusTarget, ResizeRect } from '../../../../core/src';
import { ArvoStatusType } from '../Status/Status';
import { ArvoBadgeProps } from '../Badge/Badge';
import { MenuItemData } from '../ActionMenu/ActionMenu';
import { ArvoEmptyStateProps } from '../EmptyState/EmptyState';
export interface ArvoPopoverAction {
    id?: string;
    label?: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    action?: (event: React.MouseEvent) => boolean | void;
    /** Alias for {@link action}. */
    onClick?: (event: React.MouseEvent) => boolean | void;
    isDisabled?: boolean;
}
interface ArvoPopoverHeaderActionBase {
    id: string;
    isDisabled?: boolean;
}
export interface ArvoPopoverHeaderActionBtn extends ArvoPopoverHeaderActionBase {
    type: 'btn';
    icon: string;
    label?: string;
    onClick?: () => void;
}
/**
 * Inline header action -- rendered as ArvoButton variant='inline', size='sm'.
 * Use for header CTAs like "Apply" or "More" where a text label is desired
 * instead of an icon-only tertiary button. The optional `icon` renders as a
 * leading glyph before the label.
 */
export interface ArvoPopoverHeaderActionInline extends ArvoPopoverHeaderActionBase {
    type: 'inline';
    label: string;
    icon?: string;
    onClick?: () => void;
}
export interface ArvoPopoverHeaderActionDropdown extends ArvoPopoverHeaderActionBase {
    type: 'dropdown';
    icon: string;
    items: MenuItemData[];
    /** Tooltip and accessible name for the trigger. Falls back to label or id. */
    ariaLabel?: string;
    label?: string;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
    onSelect?: (id: string) => void;
}
export interface ArvoPopoverHeaderActionSwitch extends ArvoPopoverHeaderActionBase {
    type: 'switch';
    label?: string;
    isChecked?: boolean;
    defaultChecked?: boolean;
    onChange?: (isChecked: boolean) => void;
}
export type ArvoPopoverHeaderAction = ArvoPopoverHeaderActionBtn | ArvoPopoverHeaderActionInline | ArvoPopoverHeaderActionDropdown | ArvoPopoverHeaderActionSwitch;
/**
 * Alert glyph + color set rendered in the header-left when `hasAlert=true`.
 * The component maps each value to the appropriate o9con glyph and CSS
 * variable color class (see _arvo-popover.scss `__alert-ico--*`).
 */
export type ArvoPopoverAlertType = 'positive' | 'warning' | 'negative' | 'block' | 'info';
/**
 * Curated subset of ArvoBadgeProps exposed via the Popover's header `badge`
 * slot. The wiring layer forces `variant='label'`, `size='sm'`, and
 * `placement='inline'`; everything else (semantics, color mode, icon) is
 * consumer-controlled. Pass `null` (default) to hide the badge.
 */
export type ArvoPopoverBadgeConfig = Pick<ArvoBadgeProps, 'message' | 'semanticType' | 'icon' | 'hasBadgeIcon' | 'appearance' | 'colorMode' | 'customColor' | 'tooltip'>;
export type ArvoPopoverEmptyContent = Pick<ArvoEmptyStateProps, 'illustration' | 'title' | 'message' | 'secondaryAction'>;
export interface ArvoPopoverHandle {
    /** Panel DOM element (null when unmounted). */
    element: HTMLDivElement | null;
    renderBody: (content: ReactNode) => void;
    setLoading: (loading: boolean) => void;
    setFooterVisible: (visible: boolean) => void;
    updateFooterAction: (actionId: string, props: {
        isDisabled?: boolean;
        icon?: string;
        label?: string;
    }) => void;
    reposition: () => void;
}
export interface ArvoPopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content' | 'title'> {
    variant?: 'space' | 'edge';
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' | 'auto';
    title?: string;
    hasHeader?: boolean;
    isClosable?: boolean;
    hasBackButton?: boolean;
    /** Optional leading icon in the header-left (slot 3). 20x20 glyph. */
    hasIcon?: boolean;
    /** Glyph name for the leading icon (without o9con- prefix). Required when hasIcon=true. */
    icon?: string;
    /** Optional decorative alert icon in the header-left (slot 2). aria-hidden. */
    hasAlert?: boolean;
    /** Semantic for the alert icon -- drives glyph + color. Defaults to 'warning'. */
    alertType?: ArvoPopoverAlertType;
    /** Optional inline ArvoStatus indicator after the title. */
    hasStatusIndicator?: boolean;
    /** Semantic for the status indicator. Forwarded to ArvoStatus. Defaults to 'available'. */
    statusType?: ArvoStatusType;
    /** Optional inline ArvoBadge slot after the status indicator. null hides it. */
    badge?: ArvoPopoverBadgeConfig | null;
    headerActions?: ArvoPopoverHeaderAction[];
    stickyHeader?: React.ReactNode;
    /** Alias for {@link stickyHeader}. */
    stickyBody?: React.ReactNode;
    emptyContent?: ArvoPopoverEmptyContent;
    children?: React.ReactNode;
    actions?: ArvoPopoverAction[];
    /** Optional consumer-owned slot rendered on the left of the footer. */
    footerLeftSlot?: React.ReactNode;
    hasFooter?: boolean;
    width?: string | number | 'anchor' | null;
    offset?: number;
    trigger?: 'click' | 'hover' | 'focus';
    closeOnOutside?: boolean;
    hasArrow?: boolean;
    isLoading?: boolean;
    isInteractive?: boolean;
    /**
     * Initial focus target when the interactive popover opens. `'auto'` prefers
     * the first focusable body element, then footer, then header.
     */
    initialFocus?: ArvoInitialFocusTarget | null;
    isOpen?: boolean;
    defaultOpen?: boolean;
    /** When true, renders a corner resize handle (same affordance as HybridPopover). Ignored when isInline=true. */
    isResizable?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onBack?: () => void;
    /** Fired continuously while the resize handle is dragged. */
    onResize?: (rect: ResizeRect) => void;
    /** Fired once when the resize drag ends. */
    onResizeCommit?: (rect: ResizeRect) => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
    renderTrigger?: (props: {
        ref: React.RefObject<HTMLElement | null>;
        'aria-expanded': boolean;
        'aria-controls': string;
        'aria-haspopup': 'dialog';
    }) => React.ReactNode;
    isInline?: boolean;
}
declare const ArvoPopover: import('react').ForwardRefExoticComponent<ArvoPopoverProps & import('react').RefAttributes<ArvoPopoverHandle>>;
export { ArvoPopover };
export default ArvoPopover;
//# sourceMappingURL=Popover.d.ts.map