import { TooltipPlacement } from '../../../../core/src';
export interface ArvoContextHelpProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
    /** Help text displayed in the tooltip on hover/focus. Required. */
    content: string;
    /** Semantic role of the help icon. Drives glyph and hover rendering strategy. */
    variant?: 'info' | 'question';
    /** Icon size. sm = 14px (default); lg = 16px. */
    size?: 'sm' | 'lg';
    /** Preferred tooltip placement. Collision-aware; flips when the preferred side overflows. */
    placement?: TooltipPlacement;
    /** Override for the trigger's aria-label. Defaults to the content text when omitted. */
    ariaLabel?: string;
    /** Prevents interaction and suppresses tooltip activation. */
    isDisabled?: boolean;
    /** Shows Pattern A shimmer overlay and suppresses tooltip activation while loading. */
    isLoading?: boolean;
}
declare const ArvoContextHelp: import('react').ForwardRefExoticComponent<ArvoContextHelpProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoContextHelp;
export { ArvoContextHelp };
//# sourceMappingURL=ContextHelp.d.ts.map