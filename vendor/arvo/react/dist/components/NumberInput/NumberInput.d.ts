import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
export interface ArvoNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onInput' | 'prefix'> {
    value?: number | null;
    defaultValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    label?: string;
    contextHelp?: ArvoFormLabelContextHelp;
    isRequired?: boolean;
    isInvalid?: boolean;
    size?: 'sm' | 'lg';
    surface?: 'filled' | 'base';
    errorMsg?: string;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    isLoading?: boolean;
    isFullWidth?: boolean;
    width?: string;
    /**
     * Optional static text rendered inside the field at the leading edge
     * (e.g. `"Wk"`, `"Mo"`, `"px"`, `"$"`). Purely cosmetic -- never parsed,
     * never part of the numeric value, never emitted in events. When set, the
     * block gains the `--has-prefix` modifier and a vertical separator
     * (`__prefix-sep`) is rendered between the prefix and the input. Wired
     * through the shared `form-input-affix` pattern (inline flex sibling of
     * `__input`). `aria-hidden` on the prefix element; pointer clicks forward
     * focus to the inner input.
     */
    prefix?: string | null;
    /**
     * Optional tooltip text shown when hovering the prefix element
     * (e.g. show `"Weeks"` when prefix is `"Wk"`). No tooltip when null.
     * Only effective when the `prefix` prop is also set.
     */
    prefixTooltip?: string | null;
    /**
     * Optional static text rendered inside the field at the trailing edge
     * after the numeric value and before the stepper cluster (e.g. `"kg"`,
     * `"%"`, `"USD"`). Purely cosmetic -- never parsed, never part of the
     * numeric value, never emitted in events. `aria-hidden` on the suffix
     * element; pointer clicks forward focus to the inner input.
     */
    suffix?: string | null;
    /**
     * Optional tooltip text shown when hovering the suffix element. No
     * tooltip when null. Only effective when the `suffix` prop is also set.
     */
    suffixTooltip?: string | null;
    onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
declare const ArvoNumberInput: import('react').ForwardRefExoticComponent<ArvoNumberInputProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoNumberInput;
//# sourceMappingURL=NumberInput.d.ts.map