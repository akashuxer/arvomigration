export type FabButtonVariant = 'primary' | 'secondary';
export interface ArvoFabButtonProps {
    variant?: FabButtonVariant;
    /**
     * Icon name (without the `o9con-` prefix). Defaults to `'plus'` to match
     * the descriptor + JS twin -- the canonical FAB icon. Pass an explicit
     * icon name to override.
     */
    icon?: string;
    label?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    zIndex?: number;
    /**
     * Tooltip content for the icon-only FAB. Doubles as `aria-label` because
     * the icon-only FAB has no visible text. Honored only in icon-only mode
     * (when no `label` is passed). For an extended FAB with a visible label,
     * wrap the component with `<ArvoTooltip>` if a supplementary tooltip is
     * needed.
     */
    tooltip?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onFocus?: React.FocusEventHandler<HTMLButtonElement>;
    onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}
export interface ArvoFabButtonRef {
    focus: () => void;
    buttonElement: HTMLButtonElement | null;
}
declare const ArvoFabButton: import('react').ForwardRefExoticComponent<ArvoFabButtonProps & import('react').RefAttributes<ArvoFabButtonRef>>;
export default ArvoFabButton;
//# sourceMappingURL=FabButton.d.ts.map