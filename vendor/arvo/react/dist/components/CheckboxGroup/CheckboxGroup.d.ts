import { ArvoFormLabelContextHelp } from '../FormLabel';
export interface CheckboxGroupContextValue {
    size: 'sm' | 'lg';
    isDisabled: boolean;
    isReadOnly: boolean;
    isLoading: boolean;
    name?: string;
    registerCheckbox: (value: string, isChecked: boolean) => void;
    unregisterCheckbox: (value: string) => void;
    onChildChange: (value: string, isChecked: boolean) => void;
}
export declare const CheckboxGroupContext: import('react').Context<CheckboxGroupContextValue | null>;
export declare function useCheckboxGroup(): CheckboxGroupContextValue | null;
export interface ArvoCheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the group label. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned to
     * the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    hasSelectAll?: boolean;
    orientation?: 'vertical' | 'horizontal';
    labelPosition?: 'top' | 'start';
    size?: 'sm' | 'lg';
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMsg?: string | null;
    isLoading?: boolean;
    name?: string;
    onChange?: (detail: {
        values: string[];
        allChecked: boolean;
    }) => void;
    children?: React.ReactNode;
}
declare const ArvoCheckboxGroup: import('react').ForwardRefExoticComponent<ArvoCheckboxGroupProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoCheckboxGroup;
//# sourceMappingURL=CheckboxGroup.d.ts.map