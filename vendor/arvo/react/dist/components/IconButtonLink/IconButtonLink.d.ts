import { TooltipProp } from '../../hooks/useTooltip';
export interface ArvoIconButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon: string;
    href: string;
    tooltip: TooltipProp;
    hasExternalLink?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
}
declare const ArvoIconButtonLink: import('react').ForwardRefExoticComponent<ArvoIconButtonLinkProps & import('react').RefAttributes<HTMLAnchorElement>>;
export default ArvoIconButtonLink;
//# sourceMappingURL=IconButtonLink.d.ts.map