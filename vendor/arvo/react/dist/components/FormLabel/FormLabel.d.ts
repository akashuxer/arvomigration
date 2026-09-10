import { default as React } from 'react';
import { TooltipPlacement } from '../../../../core/src';
export interface ArvoFormLabelContextHelp {
    content: string;
    variant?: 'info' | 'question';
    ariaLabel?: string;
    placement?: TooltipPlacement;
}
interface BaseFormLabelProps {
    children: React.ReactNode;
    /**
     * Label size. Defaults to `'sm'` (12px). The `'lg'` (14px) variant is
     * reserved for selection controls (Checkbox / Radio and their groups) where
     * the label scales with the control size. All other form controls render
     * labels at 12px regardless of field size.
     */
    size?: 'sm' | 'lg';
    isRequired?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    /** Custom node rendered in place of the default `*` required indicator. */
    requiredIndicator?: React.ReactNode;
    /**
     * Optional contextual-help icon rendered after the label. When set, an
     * `ArvoContextHelp` is embedded inside an absolutely-positioned wrapper.
     * The inner icon is always rendered at `size='sm'` (14px) regardless of
     * the FormLabel's own size, per the Figma spec.
     */
    contextHelp?: ArvoFormLabelContextHelp;
}
export interface ArvoFormLabelProps extends BaseFormLabelProps, Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
}
export declare const ArvoFormLabel: React.ForwardRefExoticComponent<ArvoFormLabelProps & React.RefAttributes<HTMLLabelElement>>;
export interface ArvoFormLabelTextProps extends BaseFormLabelProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
}
export declare const ArvoFormLabelText: React.ForwardRefExoticComponent<ArvoFormLabelTextProps & React.RefAttributes<HTMLSpanElement>>;
export declare const FormLabel: React.ForwardRefExoticComponent<ArvoFormLabelProps & React.RefAttributes<HTMLLabelElement>>;
export declare const FormLabelText: React.ForwardRefExoticComponent<ArvoFormLabelTextProps & React.RefAttributes<HTMLSpanElement>>;
export {};
//# sourceMappingURL=FormLabel.d.ts.map