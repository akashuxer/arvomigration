import { ArvoStatusType } from '../Status/Status';
export type ArvoBadgeVariant = 'label' | 'counter';
export type ArvoBadgeSize = 'sm' | 'md' | 'lg';
export type ArvoBadgeAppearance = 'primary' | 'outline' | 'filled';
export type ArvoBadgeColorMode = 'semantic' | 'custom';
export type ArvoBadgeSemanticType = 'positive' | 'info' | 'neutral' | 'warning' | 'negative' | 'block' | 'none';
export type ArvoBadgeCustomColor = 'purple' | 'pink' | 'glacier' | 'amber' | 'greenish' | 'bluish';
export type ArvoBadgeCounterMode = 'single' | 'ratio';
/**
 * Single-axis layout selector. `'inline'` (default) renders the badge as
 * a normal-flow inline-flex element. `'top-right'` absolutely positions
 * the badge at the top-right corner of a `corner-host` parent (typically
 * the consuming component's BEM root) so it half-overhangs the host
 * edge. The visual treatment (size, color, appearance) is unchanged
 * across both placements. (Bottom-right is intentionally unsupported --
 * Status remains the bottom-anchored overlay primitive.)
 */
export type ArvoBadgePlacement = 'inline' | 'top-right';
/**
 * Canonical configuration object for embedding ArvoBadge inside other
 * Arvo components via a `badge` slot prop. Consuming components Pick<>
 * this surface to declare which keys they expose (see
 * `Arvo<Comp>BadgeConfig` per host). The slot intentionally omits the
 * nested-status props (`hasStatus` / `statusType` / `statusPosition`)
 * and the `role` prop -- consuming components own their own Status slot
 * and accessible name surface, so duplicating those here would be a
 * misuse.
 */
export interface ArvoBadgeConfig {
    /** Layout placement. Defaults to 'inline' on standalone ArvoBadge. */
    placement?: ArvoBadgePlacement;
    variant?: ArvoBadgeVariant;
    size?: ArvoBadgeSize;
    appearance?: ArvoBadgeAppearance;
    colorMode?: ArvoBadgeColorMode;
    semanticType?: ArvoBadgeSemanticType;
    customColor?: ArvoBadgeCustomColor;
    message?: string;
    counterMode?: ArvoBadgeCounterMode;
    count?: number;
    total?: number;
    overflowCount?: number;
    hideWhenZero?: boolean;
    autoFormat?: boolean;
    localeAware?: boolean;
    hasBadgeIcon?: boolean;
    icon?: string;
    /** Accessible label + native tooltip. Host MAY exclude via Pick<>. */
    tooltip?: string;
    className?: string;
}
export declare const ARVO_BADGE_PLACEMENTS: readonly ArvoBadgePlacement[];
export interface ArvoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: ArvoBadgeVariant;
    size?: ArvoBadgeSize;
    appearance?: ArvoBadgeAppearance;
    colorMode?: ArvoBadgeColorMode;
    semanticType?: ArvoBadgeSemanticType;
    customColor?: ArvoBadgeCustomColor;
    message?: string;
    counterMode?: ArvoBadgeCounterMode;
    count?: number;
    total?: number;
    overflowCount?: number;
    hideWhenZero?: boolean;
    autoFormat?: boolean;
    localeAware?: boolean;
    hasBadgeIcon?: boolean;
    icon?: string;
    /**
     * Layout placement. Defaults to `'inline'`. Set to `'top-right'` to
     * overlay the badge in the top-right corner of a `corner-host` parent.
     * The visual treatment (size, color, appearance) is unchanged across
     * both placements. (Bottom-right is intentionally unsupported -- Status
     * remains the bottom-anchored overlay primitive.)
     */
    placement?: ArvoBadgePlacement;
    hasStatus?: boolean;
    statusType?: ArvoStatusType;
    statusPosition?: 'top-right';
    tooltip?: string;
    role?: 'status' | 'alert';
    className?: string;
}
declare const ArvoBadge: import('react').ForwardRefExoticComponent<ArvoBadgeProps & import('react').RefAttributes<HTMLSpanElement>>;
export default ArvoBadge;
export { ArvoBadge };
//# sourceMappingURL=Badge.d.ts.map