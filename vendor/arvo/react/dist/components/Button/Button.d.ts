import { ArvoBadgeConfig, ArvoBadgeProps, ArvoBadgePlacement } from '../Badge/Badge';
import { ArvoStatusConfig, ArvoStatusProps, ArvoStatusType } from '../Status/Status';
/**
 * Slot placement allowed on a Button's badge slot. The button supports
 * inline (label / counter) and top-right (overlay counter) placements.
 * Bottom-right is intentionally unsupported on ArvoBadge -- use
 * ArvoStatus for a bottom-anchored overlay indicator.
 */
export type ArvoButtonBadgePlacement = ArvoBadgePlacement;
/**
 * Slot placement allowed on a Button's status slot. The button supports
 * overlay placements ONLY -- inline status is not a Button surface.
 */
export type ArvoButtonStatusPlacement = Exclude<ArvoStatusConfig['placement'], 'inline'>;
/**
 * Narrowed badge slot config for ArvoButton.
 *
 * Surface restrictions versus the canonical `ArvoBadgeConfig`:
 *   - `size` is fixed to `'sm'` -- not exposed.
 *   - `appearance` is fixed (`'primary'` inline / `'filled'` overlay) -- not exposed.
 *   - `colorMode` is fixed to `'semantic'` -- not exposed.
 *   - `customColor` is excluded (only semantic color mode is supported).
 *   - `hasBadgeIcon` is fixed to `false` -- not exposed.
 *   - `icon` is excluded -- not exposed.
 *   - `tooltip` is excluded -- the button's own accessible name wins.
 *   - `semanticType` is honored ONLY on overlay placements; the host
 *     resolver pins it to `'neutral'` for inline placements.
 *
 * `placement` accepts the `'inline' | 'top-right'` union per the Button
 * matrix -- badge has no bottom-right placement; ArvoStatus retains both
 * top- and bottom-right corners and remains the bottom-anchored overlay
 * primitive.
 */
export type ArvoButtonBadgeConfig = Pick<ArvoBadgeConfig, 'placement' | 'variant' | 'counterMode' | 'message' | 'count' | 'total' | 'overflowCount' | 'hideWhenZero' | 'autoFormat' | 'localeAware' | 'semanticType' | 'className'>;
/**
 * Narrowed status slot config for ArvoButton.
 *
 * Surface restrictions versus the canonical `ArvoStatusConfig`:
 *   - `size` is derived from the button's `size` prop -- not exposed.
 *   - `tooltip` is excluded -- the button's own accessible name wins.
 *   - `placement` accepts ONLY the overlay corners (`'top-right'` /
 *     `'bottom-right'`); inline is not a Button surface.
 */
export type ArvoButtonStatusConfig = Omit<Pick<ArvoStatusConfig, 'type' | 'placement' | 'icon' | 'className'>, 'placement'> & {
    placement?: ArvoButtonStatusPlacement;
};
/**
 * Apply the Button matrix's fixed-value contract to a consumer-supplied
 * `ArvoButtonBadgeConfig`. The output is a fully-resolved
 * `ArvoBadgeProps` ready to spread onto `<ArvoBadge />`.
 *
 * Pure / side-effect free -- safe to call during render. Mirrored in the
 * JS twin's `resolveButtonBadge`.
 *
 * The host button `variant` is consulted only to flip the inline badge's
 * appearance to `'filled'` when the button is `'secondary'` (so the badge
 * reads against the lighter surface). All other placements use `'filled'`
 * unconditionally; inline on every other variant uses `'primary'`.
 */
export declare function resolveButtonBadge(cfg: ArvoButtonBadgeConfig, buttonVariant?: ArvoButtonVariant): ArvoBadgeProps;
/**
 * Apply the Button matrix's fixed-value contract to a consumer-supplied
 * `ArvoButtonStatusConfig`. The output is a fully-resolved
 * `ArvoStatusProps` ready to spread onto `<ArvoStatus />`.
 *
 * The status size is derived from the host button size (`sm`/`md`/`lg`
 * map 1:1). The host fixes the placement to one of the overlay corners
 * -- inline status is not a Button surface. `tooltip` is never exposed.
 */
export declare function resolveButtonStatus(cfg: ArvoButtonStatusConfig, buttonSize: 'sm' | 'md' | 'lg'): ArvoStatusProps;
/**
 * Visual style variant for `ArvoButton`.
 *
 * - `danger` is a back-compat alias for `danger-primary`; both render
 *   the same destructive primary visual. New code should prefer
 *   `danger-primary` so it reads naturally alongside `danger-tertiary`
 *   and `danger-outline`.
 * - `inline` is a Button-only text-link style with no padding and no
 *   fixed height. Size modifiers still drive icon size, font size, and
 *   gap. `ArvoIconButton` does NOT accept `inline`.
 */
export type ArvoButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger-primary' | 'danger' | 'danger-tertiary' | 'danger-outline' | 'nova-primary' | 'inline';
export interface ArvoButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
    variant?: ArvoButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    label: string;
    icon?: string;
    isDisabled?: boolean;
    /**
     * Parent-controlled active/selected visual. Renders `aria-pressed` and the
     * `.active` class. Use for non-toggle "active trigger" visuals (e.g. an
     * overlay-trigger button showing it has opened a menu / popover, a
     * tab-pinned indicator). Click does NOT toggle this value -- the parent
     * owns it.
     *
     * For a user-driven toggle button, use `ArvoToggleButton`.
     */
    isSelected?: boolean;
    isFullWidth?: boolean;
    isLoading?: boolean;
    /**
     * Embedded ArvoBadge slot. Set `placement: 'inline'` for an adjacent
     * badge (label or counter, fixed size sm + appearance primary +
     * semantic neutral + no icon) or `placement: 'top-right'` for an
     * absolutely positioned counter (filled appearance + configurable
     * `semanticType`). Pass `null` / omit to render no badge. Badge
     * bottom-right is intentionally unsupported -- use the `status` slot
     * for a bottom-anchored overlay.
     */
    badge?: ArvoButtonBadgeConfig | null;
    /**
     * Embedded ArvoStatus slot. Overlay-only on Button: placement is
     * restricted to `'top-right'` or `'bottom-right'`. Status size is
     * derived from the button's `size` prop. Pass `null` / omit to render
     * no status.
     */
    status?: ArvoButtonStatusConfig | null;
    /**
     * Show the full label in a tooltip on hover / focus when the visible
     * label is truncated. The tooltip is a recovery affordance only --
     * it appears ONLY when the `.arvo-btn__lbl` span is clipped at
     * runtime and no explicit `<ArvoTooltip>` wraps the button. Default
     * `true`.
     *
     * Precedence: an explicit `<ArvoTooltip>` wrapping the button always
     * wins. The truncation tooltip yields automatically and does NOT
     * announce the label via `aria-describedby` (the full text is
     * already part of the button's accessible name).
     */
    hasTruncationTooltip?: boolean;
}
declare const ArvoButton: import('react').ForwardRefExoticComponent<ArvoButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoButton;
export { ArvoButton };
export type { ArvoBadgeConfig, ArvoStatusConfig, ArvoStatusType, };
//# sourceMappingURL=Button.d.ts.map