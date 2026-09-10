import { ReactNode, RefObject } from 'react';
import { BasicInlineContent } from '../../../../core/src';
import { ArvoStatusType } from '../Status/Status';
import { ArvoBadgeVariant, ArvoBadgeAppearance, ArvoBadgeColorMode, ArvoBadgeSemanticType, ArvoBadgeCustomColor, ArvoBadgeCounterMode } from '../Badge/Badge';
import { ArvoBannerAlertType, ArvoBannerAlertRole } from '../BannerAlert/BannerAlert';
export type ArvoRichTooltipPlacement = 'top-start' | 'top-center' | 'top-end' | 'right-start' | 'right-center' | 'right-end' | 'bottom-start' | 'bottom-center' | 'bottom-end' | 'left-start' | 'left-center' | 'left-end';
export type ArvoRichTooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';
export type ArvoRichTooltipCloseBehavior = 'escape' | 'outsideClick' | 'both' | 'manual';
export type ArvoRichTooltipActionKind = 'link' | 'buttonLink' | 'button';
export interface ArvoRichTooltipAction {
    id?: string;
    kind: ArvoRichTooltipActionKind;
    label: string;
    href?: string;
    onClick?: (event: React.MouseEvent) => void;
    icon?: string;
    isExternal?: boolean;
    isDisabled?: boolean;
}
/**
 * Header `status` slot. Component enforces `size: 'sm'` and
 * `placement: 'inline'` internally so the indicator balances the title row.
 */
export interface ArvoRichTooltipStatusConfig {
    type: ArvoStatusType;
    tooltip?: string;
    icon?: string;
    className?: string;
}
/**
 * Header `badge` slot. Component enforces `size: 'sm'` and
 * `placement: 'inline'` internally.
 */
export interface ArvoRichTooltipBadgeConfig {
    variant?: ArvoBadgeVariant;
    appearance?: ArvoBadgeAppearance;
    colorMode?: ArvoBadgeColorMode;
    semanticType?: ArvoBadgeSemanticType;
    customColor?: ArvoBadgeCustomColor;
    message?: string;
    counterMode?: ArvoBadgeCounterMode;
    count?: number;
    total?: number;
    overflowCount?: number;
    hasBadgeIcon?: boolean;
    icon?: string;
    tooltip?: string;
    className?: string;
}
/**
 * Body `banner` slot. Component enforces `isCompact: true` and stretches the
 * banner to fill the body width.
 */
export interface ArvoRichTooltipBannerConfig {
    message: BasicInlineContent;
    type?: ArvoBannerAlertType;
    isDismissible?: boolean;
    role?: ArvoBannerAlertRole;
    onDismiss?: () => void;
    className?: string;
}
export interface ArvoRichTooltipHandle {
    /** Panel DOM element (null when unmounted). */
    element: HTMLDivElement | null;
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
    reposition: () => void;
}
export interface ArvoRichTooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'content'> {
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    trigger?: ArvoRichTooltipTrigger;
    triggerRef?: RefObject<HTMLElement | null>;
    renderTrigger?: (props: {
        ref: RefObject<HTMLElement | null>;
        'aria-describedby': string;
    }) => ReactNode;
    placement?: ArvoRichTooltipPlacement;
    offset?: number;
    maxWidth?: number | string | null;
    hasPointer?: boolean;
    title?: ReactNode;
    status?: ArvoRichTooltipStatusConfig | null;
    badge?: ArvoRichTooltipBadgeConfig | null;
    banner?: ArvoRichTooltipBannerConfig | null;
    message?: BasicInlineContent;
    bodyContent?: ReactNode;
    actions?: ArvoRichTooltipAction[];
    closeBehavior?: ArvoRichTooltipCloseBehavior;
    ariaLabel?: string;
    id?: string;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
}
declare const ArvoRichTooltip: import('react').ForwardRefExoticComponent<ArvoRichTooltipProps & import('react').RefAttributes<ArvoRichTooltipHandle>>;
export { ArvoRichTooltip };
export default ArvoRichTooltip;
//# sourceMappingURL=RichTooltip.d.ts.map