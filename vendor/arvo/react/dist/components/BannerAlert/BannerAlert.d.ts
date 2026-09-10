import { HTMLAttributes, MouseEvent } from 'react';
import { BasicInlineContent } from '../../../../core/src';
export type ArvoBannerAlertType = 'positive' | 'info' | 'neutral' | 'warning' | 'negative' | 'block';
export type ArvoBannerAlertRole = 'status' | 'alert';
/**
 * Structured config for the optional outline action button. Banner Alert
 * curates `variant: 'outline'` and `size: 'sm'` so the visual stays
 * consistent across all banners; the long tail of `ArvoButton` props is
 * intentionally not exposed here.
 */
export interface ArvoBannerAlertButton {
    label: string;
    icon?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}
/**
 * Structured config for the optional inline link action. Renders an
 * `ArvoLink`; `target='_blank'` automatically receives
 * `rel='noopener noreferrer'`.
 */
export interface ArvoBannerAlertLink {
    label: string;
    href: string;
    target?: '_self' | '_blank';
    rel?: string;
    icon?: string;
    isExternal?: boolean;
    ariaLabel?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}
export interface ArvoBannerAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'title'> {
    /**
     * Body content. Accepts a plain string OR a `BasicInlineContent` array
     * from `@arvo/core/inline-content`. Allowed inline runs: text, em, strong,
     * link, code, kbd. Raw HTML strings are not representable.
     */
    message: BasicInlineContent;
    /** Semantic alert type. Defaults to "info". */
    type?: ArvoBannerAlertType;
    /** Optional title rendered above the message. Ignored in compact mode. Clamped to 2 lines with tooltip on truncation. */
    title?: string | null;
    /** Layout mode. When true, renders only the message with tighter padding. */
    isCompact?: boolean;
    /** Whether to render the close button on the right. Defaults to true. */
    isDismissible?: boolean;
    /** Optional outline action button rendered in the action row below the message. Ignored in compact mode. */
    button?: ArvoBannerAlertButton;
    /** Optional inline link rendered in the action row below the message. Ignored in compact mode. */
    link?: ArvoBannerAlertLink;
    /**
     * Optional o9con icon name override (without the `o9con-` prefix). **Only
     * honored when `type="neutral"`** -- every other type (`positive`, `info`,
     * `warning`, `negative`, `block`) renders its semantic glyph via the SCSS
     * pattern and ignores this prop. The neutral type itself has no fixed
     * semantic glyph, so consumers may pass any o9con name (e.g. `'bell-o'`,
     * `'star'`) and it renders as a child `<i class="o9con o9con-{name}">`
     * inside `__ico`, with the `has-icon-override` state class on the root.
     */
    icon?: string | null;
    /** Pattern A shimmer loading state. */
    isLoading?: boolean;
    /**
     * Explicit ARIA role override. Defaults to "alert" for negative/block types
     * and "status" for all others.
     */
    role?: ArvoBannerAlertRole;
    /** Fired when the close button is clicked. */
    onDismiss?: () => void;
    /** Additional CSS classes appended to the root element. */
    className?: string;
}
export declare const ArvoBannerAlert: import('react').ForwardRefExoticComponent<ArvoBannerAlertProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoBannerAlert;
//# sourceMappingURL=BannerAlert.d.ts.map