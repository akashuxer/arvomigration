import { TooltipProp } from '../../hooks/useTooltip';
import { ArvoBadgeConfig, ArvoBadgeProps } from '../Badge/Badge';
import { ArvoStatusConfig, ArvoStatusProps, ArvoStatusType } from '../Status/Status';
/**
 * Visual style variant for `ArvoIconButton`. Mirrors the Button union
 * minus `inline` (Button-only by design).
 *
 * - `danger` is a back-compat alias for `danger-primary`.
 */
export type ArvoIconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger-primary' | 'danger' | 'danger-tertiary' | 'danger-outline' | 'nova-primary';
export type ArvoIconButtonSize = 'xs' | 'sm' | 'md' | 'lg';
/**
 * Slot placement allowed on an IconButton's badge slot. IconButton
 * supports overlay placements ONLY -- inline badge has no label
 * sibling to sit beside on an icon-only button.
 */
export type ArvoIconButtonBadgePlacement = 'top-right';
/**
 * Slot placement allowed on an IconButton's status slot. IconButton
 * supports overlay placements ONLY -- inline status would overflow
 * the square icon hit area.
 */
export type ArvoIconButtonStatusPlacement = 'top-right' | 'bottom-right';
/**
 * Narrowed badge slot config for ArvoIconButton.
 *
 * Surface restrictions versus the canonical `ArvoBadgeConfig`:
 *   - `size` is fixed to `'sm'`.
 *   - `appearance` is fixed to `'filled'`.
 *   - `colorMode` is fixed to `'semantic'`.
 *   - `variant` is fixed to `'counter'` and `counterMode` to `'single'`.
 *   - `customColor`, `hasBadgeIcon`, `icon`, `tooltip` are excluded.
 *   - `message` / `total` are excluded (counter-single only).
 *   - `placement` accepts overlay corners only (no inline placement).
 *   - `semanticType` defaults to `'neutral'` and is fully configurable.
 */
export type ArvoIconButtonBadgeConfig = Omit<Pick<ArvoBadgeConfig, 'placement' | 'count' | 'overflowCount' | 'hideWhenZero' | 'autoFormat' | 'localeAware' | 'semanticType' | 'className'>, 'placement'> & {
    placement?: ArvoIconButtonBadgePlacement;
};
/**
 * Narrowed status slot config for ArvoIconButton.
 *
 * Surface restrictions versus the canonical `ArvoStatusConfig`:
 *   - `size` is derived from the icon button's `size` prop -- not
 *     exposed. `xs` maps to `'sm'`; `sm` / `md` / `lg` map 1:1.
 *   - `tooltip` is excluded -- the icon button's own accessible name
 *     wins.
 *   - `placement` accepts the overlay corners only.
 */
export type ArvoIconButtonStatusConfig = Omit<Pick<ArvoStatusConfig, 'type' | 'placement' | 'icon' | 'className'>, 'placement'> & {
    placement?: ArvoIconButtonStatusPlacement;
};
/**
 * Apply the IconButton matrix's fixed-value contract to a
 * consumer-supplied `ArvoIconButtonBadgeConfig`. Output is a
 * fully-resolved `ArvoBadgeProps` ready to spread onto `<ArvoBadge />`.
 *
 * Pure / side-effect free -- safe to call during render. Mirrored in
 * the JS twin's `resolveIconButtonBadge`.
 */
export declare function resolveIconButtonBadge(cfg: ArvoIconButtonBadgeConfig): ArvoBadgeProps;
/**
 * Apply the IconButton matrix's fixed-value contract to a
 * consumer-supplied `ArvoIconButtonStatusConfig`. The status size is
 * derived from the host icon button size via {@link iconButtonStatusSize}.
 * The host fixes the placement to one of the overlay corners.
 */
export declare function resolveIconButtonStatus(cfg: ArvoIconButtonStatusConfig, buttonSize: ArvoIconButtonSize): ArvoStatusProps;
export interface ArvoIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
    variant?: ArvoIconButtonVariant;
    size?: ArvoIconButtonSize;
    type?: 'button' | 'submit' | 'reset';
    icon: string;
    /** Tooltip content. Doubles as the button's `aria-label` because the button is icon-only. */
    tooltip: TooltipProp;
    isDisabled?: boolean;
    /**
     * Parent-controlled active/selected visual. Renders `aria-pressed` and the
     * `.active` class. Use for non-toggle "active trigger" visuals (e.g. an
     * overlay-trigger icon button showing it has opened a menu / popover).
     * Click does NOT toggle this value -- the parent owns it.
     *
     * For a user-driven toggle, use `ArvoToggleButton` with `label` omitted.
     */
    isSelected?: boolean;
    isLoading?: boolean;
    /**
     * Embedded ArvoBadge slot. Overlay-only on IconButton: `placement` is
     * restricted to `'top-right' | 'bottom-right'`. Renders an
     * absolutely positioned counter badge with fixed `size=sm`,
     * `appearance=filled`, `colorMode=semantic`, `hasBadgeIcon=false`,
     * and a configurable `semanticType`. Pass `null` / omit to render no
     * badge.
     */
    badge?: ArvoIconButtonBadgeConfig | null;
    /**
     * Embedded ArvoStatus slot. Overlay-only on IconButton: `placement`
     * is restricted to `'top-right' | 'bottom-right'`. Status `size` is
     * derived from the icon button's `size` prop (xs maps to sm; sm/md/lg
     * map 1:1). Pass `null` / omit to render no status.
     */
    status?: ArvoIconButtonStatusConfig | null;
}
declare const ArvoIconButton: import('react').ForwardRefExoticComponent<ArvoIconButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoIconButton;
export { ArvoIconButton };
export type { ArvoBadgeConfig, ArvoStatusConfig, ArvoStatusType, };
//# sourceMappingURL=IconButton.d.ts.map