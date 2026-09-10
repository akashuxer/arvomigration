export interface ArvoLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'lg';
    label: string;
    href: string;
    icon?: string;
    isExternal?: boolean;
    isDisabled?: boolean;
    isVisited?: boolean;
    isLoading?: boolean;
}
declare const ArvoLink: import('react').ForwardRefExoticComponent<ArvoLinkProps & import('react').RefAttributes<HTMLAnchorElement>>;
export default ArvoLink;
//# sourceMappingURL=Link.d.ts.map