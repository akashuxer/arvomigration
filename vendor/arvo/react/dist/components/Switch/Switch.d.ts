import { ArvoFormLabelContextHelp } from '../FormLabel';
export interface ArvoSwitchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
    isReadOnly?: boolean;
    isRequired?: boolean;
    value?: string;
    name?: string;
    labelPosition?: 'end' | 'start';
    /**
     * Visual size. `lg` (default) is the canonical 28x16 track + 12px thumb;
     * `sm` is a denser 24x14 track + 10px thumb for compact rows.
     */
    size?: 'sm' | 'lg';
    isLoading?: boolean;
    onChange?: (detail: {
        isChecked: boolean;
        value: string;
    }) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}
declare const ArvoSwitch: import('react').ForwardRefExoticComponent<ArvoSwitchProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoSwitch;
//# sourceMappingURL=Switch.d.ts.map