import { ArvoAvatarProps, ArvoAvatarSize } from '../Avatar/Avatar';
import { ArvoPopoverProps } from '../Popover/Popover';
export type ArvoAvatarGroupSize = ArvoAvatarSize;
/**
 * A single item rendered by ArvoAvatarGroup. Extends the full ArvoAvatar
 * prop surface so consumers can drive every variant (image, initials, icon,
 * logo, o9logo, novai) and per-item props (name, src, href, onClick, etc.).
 *
 * The group owns `size` and `isLoading` -- consumers may NOT set these
 * per-item; the group cascades them from its own props.
 */
export interface AvatarGroupItem extends Omit<ArvoAvatarProps, 'size' | 'isLoading'> {
    /** Stable identifier; required for React keys and Popover row identity. */
    id: string;
}
/** Hybrid escape-hatch bag for the underlying ArvoPopover. */
export type ArvoAvatarGroupPopoverProps = Pick<ArvoPopoverProps, 'width' | 'isInline' | 'closeOnOutside' | 'offset' | 'onOpen' | 'onClose'>;
export interface ArvoAvatarGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'aria-label'> {
    /** Avatar configurations to render. */
    avatars: AvatarGroupItem[];
    /** Group size; cascades to every visible avatar AND the overflow tile. */
    size?: ArvoAvatarGroupSize;
    /**
     * Maximum visible tiles INCLUDING the overflow tile. When `total > maxCount`,
     * the last visible position becomes `+N`. Values below 1 are clamped to 1.
     */
    maxCount?: number;
    /**
     * When true (default), visible avatars surface their name on hover (via the
     * inherited ArvoAvatar tooltip) and the overflow tile lists the hidden
     * names. When false, individual avatar tooltips are suppressed and the
     * overflow tile tooltip falls back to the count phrase.
     */
    hasTooltip?: boolean;
    /** Placement for the overflow tile hover tooltip. */
    tooltipPosition?: 'top' | 'bottom';
    /** Accessible label for the root container. */
    label?: string;
    /** Custom accessible name + tooltip count phrase for the overflow tile. */
    moreIndicatorLabel?: string;
    /** Controlled open state of the overflow ArvoPopover. */
    isOpen?: boolean;
    /** Initial open state for uncontrolled mode. */
    defaultOpen?: boolean;
    /** Fires on every open/close transition of the overflow Popover. */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Fires when the overflow tile is activated. Call `event.preventDefault()`
     * to suppress the default open-Popover behavior.
     */
    onMoreClick?: (event: MouseEvent) => void;
    /** Where the overflow Popover anchors. */
    overflowPlacement?: 'top' | 'bottom';
    /** Escape-hatch bag for long-tail ArvoPopover options. */
    popoverProps?: ArvoAvatarGroupPopoverProps | null;
    /** Disables every avatar AND the overflow tile. */
    isDisabled?: boolean;
    /** Pattern C loading. */
    isLoading?: boolean;
    /** Additional CSS classes merged onto the root. */
    className?: string;
}
declare const ArvoAvatarGroup: import('react').ForwardRefExoticComponent<ArvoAvatarGroupProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoAvatarGroup;
export { ArvoAvatarGroup };
//# sourceMappingURL=AvatarGroup.d.ts.map