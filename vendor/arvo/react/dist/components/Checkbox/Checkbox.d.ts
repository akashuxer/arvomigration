import { ArvoFormLabelContextHelp } from '../FormLabel';
export interface ArvoCheckboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the inner caption. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned to
     * the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    isChecked?: boolean;
    defaultChecked?: boolean;
    isIndeterminate?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    isExcluded?: boolean;
    size?: 'sm' | 'lg';
    value?: string;
    name?: string;
    /**
     * When true, renders a secondary `__desc` line below the label (gated on a
     * non-empty `description` prop). Off by default so the standalone control
     * stays single-line; consumers opt into the two-line treatment per-checkbox.
     */
    hasDescription?: boolean;
    /** Description text rendered below the label when `hasDescription` is true. */
    description?: string | null;
    errorMsg?: string | null;
    errorDisplay?: 'inline' | 'none';
    isLoading?: boolean;
    onChange?: (detail: {
        isChecked: boolean;
        value: string;
    }) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}
declare const ArvoCheckbox: import('react').ForwardRefExoticComponent<ArvoCheckboxProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoCheckbox;
//# sourceMappingURL=Checkbox.d.ts.map