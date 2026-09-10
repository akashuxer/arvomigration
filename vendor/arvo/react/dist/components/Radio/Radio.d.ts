import { ArvoFormLabelContextHelp } from '../FormLabel';
export interface ArvoRadioProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: string;
    name?: string;
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the inner caption. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned to
     * the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    isChecked?: boolean;
    defaultChecked?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isLoading?: boolean;
    size?: 'sm' | 'lg';
    /**
     * When true, renders a secondary `__desc` line below the label (gated on a
     * non-empty `description` prop). Off by default so the standalone control
     * stays single-line; consumers opt into the two-line treatment per-radio.
     */
    hasDescription?: boolean;
    /** Description text rendered below the label when `hasDescription` is true. */
    description?: string | null;
    errorMsg?: string | null;
    onChange?: (detail: {
        value: string;
        name: string;
    }) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}
declare const ArvoRadio: import('react').ForwardRefExoticComponent<ArvoRadioProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoRadio;
//# sourceMappingURL=Radio.d.ts.map