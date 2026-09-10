export type ArvoAvatarVariant = 'image' | 'initials' | 'icon' | 'logo' | 'o9logo' | 'novai';
export type ArvoAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ArvoAvatarAppearance = 'filled' | 'outline' | 'primary';
export type ArvoAvatarColorMode = 'default' | 'semantic' | 'custom';
export type ArvoAvatarSemanticType = 'positive' | 'negative' | 'warning' | 'info';
export type ArvoAvatarCustomColor = 'purple' | 'pink' | 'glacier' | 'amber' | 'greenish' | 'bluish';
export interface ArvoAvatarProps {
    variant?: ArvoAvatarVariant;
    size?: ArvoAvatarSize;
    /**
     * Surface chrome.
     * - icon | initials | logo: standard chrome (filled / outline / primary). logo
     *   does NOT support filled; the implementation clamps to outline.
     * - novai: `outline` (default) renders the resting gradient ring;
     *   `filled` renders the active gradient surface. `primary` is treated as
     *   outline.
     * - image | o9logo: ignore this prop.
     */
    appearance?: ArvoAvatarAppearance;
    colorMode?: ArvoAvatarColorMode;
    semanticType?: ArvoAvatarSemanticType;
    customColor?: ArvoAvatarCustomColor;
    /** Display name -- drives initials and accessible label. */
    name?: string;
    /** Email -- fallback source for initials when `name` is missing or unusable. */
    email?: string;
    /** Image source URL for variant='image'. */
    src?: string;
    /** Image alt text. Defaults to `name`. */
    alt?: string;
    /** o9con glyph name (no prefix). Defaults to `'user'` for variant='icon'. */
    icon?: string;
    /**
     * Brand asset name for variant='logo' (e.g. "GitHub", "Slack",
     * "MicrosoftPowerBI"). When set, the logo variant renders an SVG sourced
     * from `${logoBaseUrl}/light/{logo}.svg` (and `/dark/{logo}.svg` when the
     * user-agent prefers a dark color scheme) instead of an o9con glyph.
     * Has no effect on variants other than 'logo'.
     */
    logo?: string;
    /**
     * URL prefix used to resolve `logo`. Defaults to `'/logos'`. Override per-
     * avatar to point at your own asset host (e.g. a CDN). The component
     * appends `/light/{logo}.svg` and `/dark/{logo}.svg`.
     */
    logoBaseUrl?: string;
    /** Accessible label + native tooltip. Auto-generated when omitted. */
    tooltip?: string;
    /** Renders as <button> (or <a> when `href` is set). */
    isInteractive?: boolean;
    /** Disables interaction; applies 40% opacity. */
    isDisabled?: boolean;
    /** Shows the Pattern A shimmer overlay. */
    isLoading?: boolean;
    /** When set, renders as <a> and is implicitly interactive. */
    href?: string;
    /** Anchor target. Passed through only when `href` is set. */
    target?: string;
    /** Anchor rel. Passed through only when `href` is set. */
    rel?: string;
    /** Click handler. Implicitly enables interactive mode. Suppressed when disabled/loading. */
    onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement>) => void;
    /** Additional CSS classes merged onto the root element. */
    className?: string;
    /** Additional inline styles merged onto the root element. */
    style?: React.CSSProperties;
    /** HTML id pass-through. */
    id?: string;
}
declare const ArvoAvatar: import('react').ForwardRefExoticComponent<ArvoAvatarProps & import('react').RefAttributes<HTMLElement>>;
export default ArvoAvatar;
export { ArvoAvatar };
//# sourceMappingURL=Avatar.d.ts.map