import { ArvoInitialFocusTarget, DragOffset } from '../../../../core/src';
import { ArvoDropdownButtonProps } from '../DropdownButton/DropdownButton';
import { ArvoSplitButtonProps } from '../SplitButton/SplitButton';
import { ArvoDropdownIconButtonProps } from '../DropdownIconButton/DropdownIconButton';
import { ArvoSplitIconButtonProps } from '../SplitIconButton/SplitIconButton';
import { ArvoSwitchProps } from '../Switch/Switch';
import { ArvoBadgeProps } from '../Badge/Badge';
import { ArvoStatusType } from '../Status/Status';
import { ArvoEmptyStateProps } from '../EmptyState/EmptyState';
export type ArvoWindowSize = 'sm' | 'md' | 'lg' | 'xl';
export type ArvoWindowCloseReason = 'close-button' | 'primary' | 'secondary' | 'back' | 'programmatic';
export type ArvoWindowHeaderActionType = 'icon-button' | 'button' | 'dropdown-button' | 'dropdown-icon-button' | 'split-button' | 'split-icon-button' | 'switch';
export type ArvoWindowHeaderActionVariant = 'tertiary' | 'outline' | 'inline';
interface HeaderActionBase {
    id?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    tooltip?: string;
}
export interface ArvoWindowHeaderIconButtonAction extends HeaderActionBase {
    type: 'icon-button';
    icon: string;
    /** Defaults to 'tertiary'. Restricted to tertiary/outline. */
    variant?: 'tertiary' | 'outline';
    onClick?: (e: React.MouseEvent) => void;
}
export interface ArvoWindowHeaderButtonAction extends HeaderActionBase {
    type: 'button';
    label: string;
    icon?: string;
    /** Defaults to 'inline'. Restricted to tertiary/outline/inline. */
    variant?: ArvoWindowHeaderActionVariant;
    onClick?: (e: React.MouseEvent) => void;
}
export interface ArvoWindowHeaderDropdownButtonAction extends HeaderActionBase {
    type: 'dropdown-button';
    label: string;
    icon?: string;
    /** Defaults to 'tertiary'. Restricted to tertiary/outline. */
    variant?: 'tertiary' | 'outline';
    items: ArvoDropdownButtonProps['items'];
    onSelect?: ArvoDropdownButtonProps['onSelect'];
}
export interface ArvoWindowHeaderDropdownIconButtonAction extends HeaderActionBase {
    type: 'dropdown-icon-button';
    icon?: string;
    /** Defaults to 'tertiary'. Restricted to tertiary/outline. */
    variant?: 'tertiary' | 'outline';
    items: ArvoDropdownIconButtonProps['items'];
    onSelect?: ArvoDropdownIconButtonProps['onSelect'];
}
export interface ArvoWindowHeaderSplitButtonAction extends HeaderActionBase {
    type: 'split-button';
    label: string;
    icon?: string;
    /**
     * Defaults to 'tertiary'. The spec allows tertiary/outline; SplitButton
     * itself does not support 'outline', so 'outline' is silently coerced to
     * 'tertiary' (a dev warning is logged).
     */
    variant?: 'tertiary' | 'outline';
    items: ArvoSplitButtonProps['items'];
    onPrimaryClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSelect?: ArvoSplitButtonProps['onSelect'];
}
export interface ArvoWindowHeaderSplitIconButtonAction extends HeaderActionBase {
    type: 'split-icon-button';
    icon: string;
    /**
     * Defaults to 'tertiary'. SplitIconButton does not support 'outline'; see
     * SplitButton note above.
     */
    variant?: 'tertiary' | 'outline';
    items: ArvoSplitIconButtonProps['items'];
    onPrimaryClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSelect?: ArvoSplitIconButtonProps['onSelect'];
}
export interface ArvoWindowHeaderSwitchAction extends HeaderActionBase {
    type: 'switch';
    label?: string;
    isChecked?: boolean;
    defaultChecked?: boolean;
    onChange?: ArvoSwitchProps['onChange'];
}
export type ArvoWindowHeaderAction = ArvoWindowHeaderIconButtonAction | ArvoWindowHeaderButtonAction | ArvoWindowHeaderDropdownButtonAction | ArvoWindowHeaderDropdownIconButtonAction | ArvoWindowHeaderSplitButtonAction | ArvoWindowHeaderSplitIconButtonAction | ArvoWindowHeaderSwitchAction;
export type ArvoWindowFooterActionType = 'button' | 'dropdown-button' | 'split-button';
export type ArvoWindowFooterActionSemantic = 'primary' | 'danger-primary';
export interface ArvoWindowFooterAction {
    id?: string;
    /** Footer action shape. Defaults to `'button'`. */
    type?: ArvoWindowFooterActionType;
    /** Semantic. Defaults to `'primary'` for primaryAction, ignored for secondaryActions. */
    semantic?: ArvoWindowFooterActionSemantic;
    label: string;
    icon?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    /** Default `true`; return `false` from `onClick` to veto the close. */
    closeOnClick?: boolean;
    /** Required when `type` is 'dropdown-button' or 'split-button'. */
    items?: ArvoDropdownButtonProps['items'];
    /** Split-button only: called when the primary half is clicked. */
    onPrimaryClick?: (e: React.MouseEvent) => void | false;
    onClick?: (e: React.MouseEvent) => void | false;
    /** Dropdown/split selection callback. */
    onSelect?: ArvoDropdownButtonProps['onSelect'];
}
export type ArvoWindowEmptyContent = Pick<ArvoEmptyStateProps, 'illustration' | 'title' | 'message' | 'primaryAction' | 'secondaryAction' | 'link' | 'isAnimated'>;
export type ArvoWindowBadgeConfig = Pick<ArvoBadgeProps, 'message' | 'semanticType' | 'icon' | 'hasBadgeIcon' | 'appearance' | 'tooltip'>;
export interface ArvoWindowProps {
    /** Size variant. Defaults to 'md'. */
    size?: ArvoWindowSize;
    /** Controlled open state. */
    isOpen?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onOpen?: () => boolean | void;
    /**
     * Programmatic close callback. NOT invoked on engine-driven Escape or
     * backdrop-click (picker-silent). Return `false` to veto.
     */
    onClose?: (detail: {
        reason: ArvoWindowCloseReason;
    }) => boolean | void;
    /** Title text. Drives aria-labelledby when rendered. */
    title?: string;
    /** Hide the title element even when `title` is set. */
    hasTitle?: boolean;
    hasHeader?: boolean;
    hasFooter?: boolean;
    hasIcon?: boolean;
    /** Leading icon glyph name (without the `o9con-` prefix). */
    icon?: string;
    hasStatusIndicator?: boolean;
    statusType?: ArvoStatusType;
    /** Optional badge slot beside the title. Pass `null` to hide. */
    badge?: ArvoWindowBadgeConfig | null;
    hasBackBtn?: boolean;
    backLabel?: string;
    onBack?: (e: React.MouseEvent) => void;
    closeLabel?: string;
    hasMaximize?: boolean;
    /** Controlled maximized state. */
    isMaximized?: boolean;
    defaultMaximized?: boolean;
    onMaximizeChange?: (maximized: boolean) => void;
    /** Whether the header acts as a drag handle. Ignored when maximized or hasHeader=false. */
    isDraggable?: boolean;
    onDragStart?: (e: PointerEvent) => void;
    onDragEnd?: (offset: DragOffset) => void;
    hasBackdrop?: boolean;
    /** Whether clicking the backdrop closes the window. Picker-silent. Default false. */
    closeOnBackdrop?: boolean;
    /** Whether pressing Escape closes the window. Picker-silent. Default true. */
    closeOnEscape?: boolean;
    /** Up to 3 consumer-provided header actions. Maximize + Close are system-controlled. */
    headerActions?: ArvoWindowHeaderAction[];
    /** Footer primary (right-most) action. */
    primaryAction?: ArvoWindowFooterAction | null;
    /** Footer secondary actions (max 2). All rendered to the LEFT of primary. */
    secondaryActions?: ArvoWindowFooterAction[];
    /** Optional left footer slot content. */
    footerLeft?: React.ReactNode;
    /** Pinned content region between header and scrollable body. */
    stickyHeader?: React.ReactNode;
    isEmptyState?: boolean;
    emptyContent?: ArvoWindowEmptyContent;
    isLoading?: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    container?: HTMLElement | string | null;
    /**
     * Initial focus target when the window opens. `'auto'` focuses the first
     * focusable body element, then footer, then header. Pass an HTMLElement or
     * resolver for app-specific focus needs.
     */
    initialFocus?: ArvoInitialFocusTarget | null;
    className?: string;
    children?: React.ReactNode;
}
declare const ArvoWindow: import('react').ForwardRefExoticComponent<ArvoWindowProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoWindow };
export default ArvoWindow;
//# sourceMappingURL=Window.d.ts.map