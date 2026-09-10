import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
export interface ArvoTextareaChangeDetail {
    value: string;
    previousValue: string;
}
export interface ArvoTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
    value?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    label?: string;
    contextHelp?: ArvoFormLabelContextHelp;
    isRequired?: boolean;
    isInvalid?: boolean;
    size?: 'sm' | 'lg';
    surface?: 'filled' | 'base';
    icon?: string;
    rows?: number;
    maxLength?: number;
    hasCounter?: boolean;
    autoResize?: boolean;
    resizable?: 'none' | 'vertical' | 'both';
    errorMsg?: string;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    /**
     * Shows a clear button (ArvoIconButton, icon `close`) inside the top-right
     * actions overlay whenever the textarea has a value. Unlike the textbox
     * clear button which only appears on hover/focus, the textarea clear
     * button stays visible while a value is present so the text content never
     * shifts as the pointer enters or leaves the field. Suppressed in
     * disabled, readonly, and loading states, and replaced by the in-field
     * error icon when `errorDisplay='tooltip'` and `isInvalid` are both set.
     */
    isClearable?: boolean;
    isLoading?: boolean;
    width?: string;
    isFullWidth?: boolean;
    onInput?: React.FormEventHandler<HTMLTextAreaElement>;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}
declare const ArvoTextarea: import('react').ForwardRefExoticComponent<ArvoTextareaProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoTextarea;
//# sourceMappingURL=Textarea.d.ts.map