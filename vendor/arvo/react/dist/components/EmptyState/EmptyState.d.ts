export type EmptyStateIllustration = 'no-results' | 'no-data' | string;
export type EmptyStateSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type EmptyStateOrientation = 'vertical' | 'horizontal';
/** Map of "known" semantic illustrations to o9illus utility classes. */
export declare const KNOWN_ILLUSTRATIONS: {
    readonly 'no-results': "o9illus-no-results-found";
    readonly 'no-data': "o9illus-no-filters-found";
};
export interface EmptyStateButtonAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger';
    icon?: string;
    isDisabled?: boolean;
}
export interface EmptyStateLinkAction {
    label: string;
    /** Anchor target. Use `'#'` and `onClick` if the link is a programmatic CTA. */
    href: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /** Leading icon glyph (o9con name, no prefix). */
    icon?: string;
    /** When true, opens in a new tab and adds an external-link icon. */
    isExternal?: boolean;
}
export interface ArvoEmptyStateProps {
    /** Visual scale; controls illustration cap, typography, and gaps. */
    size?: EmptyStateSize;
    /** Layout direction. */
    orientation?: EmptyStateOrientation;
    /** Illustration token (`no-results`, `no-data`, or any `o9illus-*` name). */
    illustration?: EmptyStateIllustration;
    title?: string;
    message?: string;
    /** Primary action button (right-most in a button row). */
    primaryAction?: EmptyStateButtonAction;
    /** Secondary action button (left of primary). */
    secondaryAction?: EmptyStateButtonAction;
    /** Optional below-buttons link. */
    link?: EmptyStateLinkAction;
    /** Optional id for the host. */
    id?: string;
    className?: string;
    /** Disables the float animation on the illustration. */
    isAnimated?: boolean;
}
declare const ArvoEmptyState: import('react').ForwardRefExoticComponent<ArvoEmptyStateProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoEmptyState;
//# sourceMappingURL=EmptyState.d.ts.map