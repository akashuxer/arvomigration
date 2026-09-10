/**
 * Union of all supported semantic status types. The first 14 entries are
 * locked-icon types (the icon glyph is fixed and the `icon` prop is
 * ignored); `positive | negative | warning | info | neutral` are the
 * overridable generic semantic types.
 */
export type ArvoStatusType = 'available' | 'notAvailable' | 'partialComplete' | 'busy' | 'failed' | 'blocked' | 'attention' | 'loading' | 'paused' | 'critical' | 'high' | 'medium' | 'low' | 'unknown' | 'positive' | 'negative' | 'warning' | 'info' | 'neutral';
export type ArvoStatusSize = 'sm' | 'md' | 'lg';
/**
 * Single-axis placement model. Replaces the legacy `hasSeparator` +
 * `position` pair.
 *
 *   - `'inline'` (default): the status renders as a normal-flow
 *     inline-flex element with a transparent background. No absolute
 *     positioning. The container size, icon color, and border-radius are
 *     unchanged.
 *   - `'top-right'` / `'bottom-right'`: the status is absolutely
 *     positioned at the corresponding corner of a `corner-host` parent
 *     (`position: relative`) with a `layer-01` "separator" background so
 *     the icon stands out against busy host surfaces (avatar, button,
 *     card, image, node).
 */
export type ArvoStatusPlacement = 'inline' | 'top-right' | 'bottom-right';
/**
 * Standardized configuration object that consuming components (Avatar,
 * Button, Card, Image, Node, etc.) accept via a `status` slot prop to
 * expose ArvoStatus integration. Components that integrate ArvoStatus
 * re-export this type alongside their own props.
 *
 * The shape is intentionally smaller than `ArvoStatusProps`:
 *   - `placement` collapses the old `hasSeparator + position` pair.
 *   - `tooltip` is kept on the canonical config but consuming components
 *     MAY exclude it via `Pick<>` so the host's own accessible name wins.
 *
 * See the `corner-host` shared SCSS pattern for the host-side anchoring.
 */
export interface ArvoStatusConfig {
    /** Required. Status semantic type. */
    type: ArvoStatusType;
    /**
     * Layout placement. Defaults to `'inline'` on standalone ArvoStatus.
     * Consuming components MAY override the default per host (e.g. Button
     * defaults its embedded status to `'top-right'` and restricts the
     * union to the overlay corners).
     */
    placement?: ArvoStatusPlacement;
    /**
     * Optional size override. Components MAY enforce a size that matches
     * their visual scale and ignore this field; size enforcement is decided
     * per-component at integration time.
     */
    size?: ArvoStatusSize;
    /** Accessible label + native tooltip. Overrides the type default. */
    tooltip?: string;
    /**
     * o9con icon name (no `o9con-` prefix). Only honored for type =
     * positive | negative | warning | info | neutral.
     */
    icon?: string;
    /** Additional CSS classes merged with the base classes. */
    className?: string;
}
export interface ArvoStatusProps {
    /** Semantic type. Drives the icon color and (for locked-icon types) the icon glyph. Defaults to `'positive'`. */
    type?: ArvoStatusType;
    /** Visual size. Defaults to `'lg'`. */
    size?: ArvoStatusSize;
    /**
     * Layout placement. Defaults to `'inline'`.
     *
     *   - `'inline'`: transparent background, normal-flow inline-flex
     *     element. No absolute positioning. Use when the status sits next
     *     to text or other content.
     *   - `'top-right'` / `'bottom-right'`: layer-01 separator background,
     *     absolutely positioned at the matching corner of a parent that
     *     has `position: relative` (typically via the shared `corner-host`
     *     SCSS mixin). Use to overlay a host element.
     */
    placement?: ArvoStatusPlacement;
    /**
     * Accessible label and native tooltip. Defaults to the type's
     * human-readable label (e.g. `'Available'` for `type='available'`).
     */
    tooltip?: string;
    /**
     * Override the o9con icon name (without the `o9con-` prefix). Only
     * honored for `type='positive' | 'negative' | 'warning' | 'info' |
     * 'neutral'`. Ignored for the locked-icon types to preserve semantic
     * recognition.
     */
    icon?: string;
    /** Additional CSS classes merged with the base classes. */
    className?: string;
}
interface TypeMeta {
    /**
     * Default o9con icon for the type. Locked-icon types ignore the
     * `icon` prop; overridable types use this as the default.
     */
    icon: string | null;
    /** Human-readable label used as the default aria-label / title. */
    label: string;
    /** Whether the consumer may override the icon via the `icon` prop. */
    iconOverridable: boolean;
}
/**
 * Public registry export. Consumers (e.g. Storybook stories, integration
 * tests) may iterate it to enumerate types without hardcoding the union.
 */
export declare const ARVO_STATUS_TYPES: readonly ArvoStatusType[];
export declare const ARVO_STATUS_TYPE_REGISTRY: Record<ArvoStatusType, TypeMeta>;
export declare const ARVO_STATUS_PLACEMENTS: readonly ArvoStatusPlacement[];
/**
 * Resolve the icon name for a given type + override, honoring the
 * `iconOverridable` permission. Exported so the JS twin and tests can
 * share the same resolution rules.
 */
export declare function resolveStatusIcon(type: ArvoStatusType, override?: string | null): string;
/** Resolve the default label for a given type. */
export declare function resolveStatusLabel(type: ArvoStatusType): string;
declare const ArvoStatus: import('react').ForwardRefExoticComponent<ArvoStatusProps & import('react').RefAttributes<HTMLSpanElement>>;
export default ArvoStatus;
export { ArvoStatus };
//# sourceMappingURL=Status.d.ts.map