import { TooltipProp } from '../../hooks/useTooltip';
import { ArvoBadgeConfig, ArvoBadgeProps, ArvoBadgePlacement } from '../Badge/Badge';
import { ArvoStatusConfig, ArvoStatusProps, ArvoStatusType } from '../Status/Status';
/**
 * Visual style variant for `ArvoToggleButton`. The toggle intentionally
 * supports only the three variants that pair with a persistent toggled
 * visual (the destructive / nova / inline variants are Button-only).
 */
export type ArvoToggleButtonVariant = 'secondary' | 'tertiary' | 'outline';
export type ArvoToggleButtonSize = 'sm' | 'md' | 'lg';
/**
 * Badge placement allowed on a toggle's badge slot. With a label the full
 * three-placement matrix is available; without a label (icon-only) only
 * the overlay placements are meaningful. The TS type intentionally
 * allows all three -- runtime degrades gracefully (an inline badge on an
 * icon-only toggle is positioned but invisible because the host CSS
 * collapses inline-flex gap and font-size).
 */
export type ArvoToggleButtonBadgePlacement = ArvoBadgePlacement;
/**
 * Status placement allowed on a toggle's status slot. Overlay-only --
 * inline status is not a toggle surface.
 */
export type ArvoToggleButtonStatusPlacement = Exclude<ArvoStatusConfig['placement'], 'inline'>;
/**
 * Narrowed badge slot config for `ArvoToggleButton`. Mirrors
 * `ArvoButtonBadgeConfig` exactly:
 *   - `size` fixed to `'sm'`.
 *   - `appearance` fixed (`'primary'` inline / `'filled'` overlay).
 *   - `colorMode` fixed to `'semantic'`.
 *   - `customColor`, `hasBadgeIcon`, `icon`, `tooltip` excluded.
 *   - `semanticType` honored ONLY on overlay placements.
 */
export type ArvoToggleButtonBadgeConfig = Pick<ArvoBadgeConfig, 'placement' | 'variant' | 'counterMode' | 'message' | 'count' | 'total' | 'overflowCount' | 'hideWhenZero' | 'autoFormat' | 'localeAware' | 'semanticType' | 'className'>;
/**
 * Narrowed status slot config for `ArvoToggleButton`. Overlay-only.
 * Status `size` is derived from the toggle's `size` prop. `tooltip` is
 * excluded so the toggle's own accessible name wins.
 */
export type ArvoToggleButtonStatusConfig = Omit<Pick<ArvoStatusConfig, 'type' | 'placement' | 'icon' | 'className'>, 'placement'> & {
    placement?: ArvoToggleButtonStatusPlacement;
};
/**
 * Apply the toggle button matrix's fixed-value contract to a
 * consumer-supplied `ArvoToggleButtonBadgeConfig`. Output is a
 * fully-resolved `ArvoBadgeProps` ready to spread onto `<ArvoBadge />`.
 * Pure / side-effect free. Mirrored in the JS twin's
 * `resolveToggleButtonBadge`.
 */
export declare function resolveToggleButtonBadge(cfg: ArvoToggleButtonBadgeConfig): ArvoBadgeProps;
/**
 * Apply the toggle button matrix's fixed-value contract to a
 * consumer-supplied `ArvoToggleButtonStatusConfig`. The status size is
 * derived from the host toggle size (sm/md/lg map 1:1). The host fixes
 * the placement to one of the overlay corners.
 */
export declare function resolveToggleButtonStatus(cfg: ArvoToggleButtonStatusConfig, toggleSize: ArvoToggleButtonSize): ArvoStatusProps;
export interface ArvoToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
    variant?: ArvoToggleButtonVariant;
    size?: ArvoToggleButtonSize;
    type?: 'button' | 'submit' | 'reset';
    /** Icon name without the `o9con-` prefix. Required -- toggle always shows an icon. */
    icon: string;
    /**
     * Optional alternate icon shown when the toggle is selected. Use for
     * outline/filled icon pairs (e.g. `icon="bookmark-o"`,
     * `selectedIcon="bookmark"`). Falls back to `icon` when not provided.
     */
    selectedIcon?: string;
    /**
     * Optional visible label. When set the toggle renders icon + label
     * (Button shape). When omitted the toggle renders icon-only (Icon-Button
     * shape; square dimensions) and `tooltip` becomes the only source of the
     * accessible name.
     */
    label?: string;
    /**
     * Tooltip content + accessible-name source. REQUIRED when `label` is
     * omitted (icon-only toggle would otherwise have no accessible name);
     * optional when `label` is supplied. Drives `aria-label` only when no
     * label is provided.
     */
    tooltip?: TooltipProp;
    isDisabled?: boolean;
    /**
     * Controlled toggle state. Pass to make selection controlled; omit to
     * fall back to `defaultSelected` (uncontrolled).
     */
    isSelected?: boolean;
    /** Uncontrolled initial selected state. Defaults to `false`. */
    defaultSelected?: boolean;
    isLoading?: boolean;
    /**
     * Fired on every user-driven flip (click, Enter, Space). Receives the
     * next `isSelected` value.
     */
    onSelectedChange?: (isSelected: boolean) => void;
    /**
     * Embedded ArvoBadge slot. With a label the slot accepts the full
     * three-placement matrix (`inline | top-right | bottom-right`); when
     * `label` is omitted (icon-only) only the overlay placements are
     * meaningful. Host fixes `size=sm`, `appearance=primary|filled`,
     * `colorMode=semantic`, `hasBadgeIcon=false`.
     */
    badge?: ArvoToggleButtonBadgeConfig | null;
    /**
     * Embedded ArvoStatus slot. Overlay-only: `placement` is restricted to
     * `'top-right' | 'bottom-right'`. Status `size` is derived from the
     * toggle's `size` prop (sm/md/lg map 1:1).
     */
    status?: ArvoToggleButtonStatusConfig | null;
}
declare const ArvoToggleButton: import('react').ForwardRefExoticComponent<ArvoToggleButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoToggleButton;
export { ArvoToggleButton };
export type { ArvoBadgeConfig, ArvoStatusConfig, ArvoStatusType, };
//# sourceMappingURL=ToggleButton.d.ts.map