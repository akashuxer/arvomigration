export interface ArvoButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    label: string;
    href: string;
    icon?: string;
    hasExternalLink?: boolean;
    isDisabled?: boolean;
    isFullWidth?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
}
declare const ArvoButtonLink: import('react').ForwardRefExoticComponent<ArvoButtonLinkProps & import('react').RefAttributes<HTMLAnchorElement>>;
export default ArvoButtonLink;
//# sourceMappingURL=ButtonLink.d.ts.map