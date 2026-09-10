import { ArvoFormLabelContextHelp } from '../FormLabel';
export interface RadioGroupContextValue {
    name: string;
    size: 'sm' | 'lg';
    isDisabled: boolean;
    isReadOnly: boolean;
    isLoading: boolean;
    selectedValue: string | null;
    onChildChange: (value: string) => void;
    /**
     * The value that currently owns `tabindex=0` per the WAI-ARIA radio-group
     * roving-tabindex pattern: the selected radio when one exists, otherwise
     * the first registered, enabled radio. `null` only while no radios have
     * registered yet. Mirrors JS `_syncRovingTabindex` (RadioGroup.ts:287-310).
     */
    tabbableValue: string | null;
    /**
     * Called by child `<ArvoRadio>` on mount / when its disabled state changes;
     * returns an unregister cleanup to call on unmount.
     */
    registerRadio: (value: string, isDisabled: boolean) => () => void;
}
export declare const RadioGroupContext: import('react').Context<RadioGroupContextValue | null>;
export declare function useRadioGroup(): RadioGroupContextValue | null;
export interface ArvoRadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    name: string;
    label?: string | null;
    /**
     * Optional contextual-help icon attached to the group label. When provided,
     * embeds an `ArvoContextHelp` at `size='sm'` (14px) absolutely positioned to
     * the right of the label. Has no effect when `label` is omitted.
     */
    contextHelp?: ArvoFormLabelContextHelp;
    orientation?: 'vertical' | 'horizontal';
    labelPosition?: 'top' | 'start';
    size?: 'sm' | 'lg';
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMsg?: string | null;
    isLoading?: boolean;
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (detail: {
        value: string;
        previousValue: string | null;
    }) => void;
    children?: React.ReactNode;
}
declare const ArvoRadioGroup: import('react').ForwardRefExoticComponent<ArvoRadioGroupProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoRadioGroup;
//# sourceMappingURL=RadioGroup.d.ts.map