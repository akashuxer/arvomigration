import { ArvoInitialFocusTarget, BasicInlineContent } from '../../../../core/src';
import { ArvoBannerAlertProps } from '../BannerAlert/BannerAlert';
export interface ArvoAlertDialogAction {
    label: string;
    icon?: string;
    onClick?: (e: React.MouseEvent) => void | false;
    isDisabled?: boolean;
    isLoading?: boolean;
    closeOnClick?: boolean;
}
interface ConfirmInputBase<TValue> {
    label?: string;
    placeholder?: string;
    expectedValue?: TValue;
    /**
     * Inner-input size. Defaults to `'lg'` so the input matches the
     * comfortable form factor used inside the dialog body. Pass `'sm'`
     * for compact layouts. (All form inputs in @arvo/react / @arvo/js
     * expose only `'sm'` and `'lg'`; there is no `'md'` in the input
     * size scale.)
     */
    size?: 'sm' | 'lg';
    /**
     * Custom programmatic validation. Return `true` to allow the primary
     * action, `false` to silently block, or a `string` to display an inline
     * error and block. Runs alongside `expectedValue` matching.
     */
    validate?: (value: TValue) => true | false | string;
    onChange?: (value: TValue) => void;
}
export interface ArvoAlertDialogConfirmInputTextbox extends ConfirmInputBase<string> {
    type?: 'textbox';
    maxLength?: number;
}
export interface ArvoAlertDialogConfirmInputTextarea extends ConfirmInputBase<string> {
    type: 'textarea';
    maxLength?: number;
    rows?: number;
}
export interface ArvoAlertDialogConfirmInputOptionItem {
    id: string;
    label: string;
    value?: string;
}
export interface ArvoAlertDialogConfirmInputCombobox extends ConfirmInputBase<string> {
    type: 'combobox';
    options: ArvoAlertDialogConfirmInputOptionItem[];
}
export interface ArvoAlertDialogConfirmInputSelect extends ConfirmInputBase<string> {
    type: 'select';
    options: ArvoAlertDialogConfirmInputOptionItem[];
}
/**
 * Multi-select variant. The `ArvoMultiSelect` component is not yet
 * shipped; until then the alert dialog falls back to combobox semantics
 * with a single selection, and emits a one-shot dev console warning.
 * Once the multi-select component exists, the runtime path swaps in the
 * real component without an API change for consumers.
 */
export interface ArvoAlertDialogConfirmInputMultiSelect extends Omit<ConfirmInputBase<string[]>, 'expectedValue' | 'validate' | 'onChange'> {
    type: 'multi-select';
    options: ArvoAlertDialogConfirmInputOptionItem[];
    expectedValues?: string[];
    validate?: (value: string[]) => true | false | string;
    onChange?: (value: string[]) => void;
}
export type ArvoAlertDialogConfirmInput = ArvoAlertDialogConfirmInputTextbox | ArvoAlertDialogConfirmInputTextarea | ArvoAlertDialogConfirmInputCombobox | ArvoAlertDialogConfirmInputSelect | ArvoAlertDialogConfirmInputMultiSelect;
export interface ArvoAlertDialogDontShow {
    label?: string;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
}
export type ArvoAlertDialogVariant = 'warning' | 'info' | 'positive' | 'negative' | 'block';
export type ArvoAlertDialogCloseReason = 'primary' | 'secondary' | 'close-button' | 'escape' | 'backdrop' | 'programmatic';
export interface ArvoAlertDialogProps {
    variant?: ArvoAlertDialogVariant;
    title: string;
    /**
     * Body message. Plain string OR a `BasicInlineContent` array
     * (`InlineNode[]`) from `@arvo/core/inline-content`. Allowed inline runs:
     * text, em, strong, link, code, kbd. Ignored when `content` is set.
     */
    message?: BasicInlineContent;
    content?: React.ReactNode;
    /**
     * Optional `ArvoBannerAlert` rendered between the header and the body.
     * Pass an `ArvoBannerAlertProps` object; the dialog renders the banner
     * internally (consumers do not construct JSX).
     */
    bannerAlert?: ArvoBannerAlertProps;
    isOpen?: boolean;
    defaultOpen?: boolean;
    hasDangerAction?: boolean;
    primaryAction?: ArvoAlertDialogAction;
    secondaryAction?: ArvoAlertDialogAction | null;
    /**
     * Whether the secondary (cancel-style) button is rendered. Defaults to
     * `true`.
     */
    hasSecondaryBtn?: boolean;
    /**
     * Whether the primary (confirm) button is rendered. Defaults to `true`.
     * Only honored when `variant: 'warning'`; ignored for other variants
     * with a one-shot dev warning.
     */
    hasPrimaryBtn?: boolean;
    isClosable?: boolean;
    hasBackdrop?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    confirmInput?: ArvoAlertDialogConfirmInput | null;
    dontShowAgain?: ArvoAlertDialogDontShow | boolean | null;
    isLoading?: boolean;
    isDisabled?: boolean;
    container?: HTMLElement | string | null;
    initialFocus?: ArvoInitialFocusTarget | null;
    className?: string;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => void | false;
    onClose?: (detail: {
        reason: ArvoAlertDialogCloseReason;
    }) => void | false;
    onConfirmInputChange?: (value: string | string[]) => void;
    onDontShowAgainChange?: (checked: boolean) => void;
}
declare const ArvoAlertDialog: import('react').ForwardRefExoticComponent<ArvoAlertDialogProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoAlertDialog };
export default ArvoAlertDialog;
//# sourceMappingURL=AlertDialog.d.ts.map