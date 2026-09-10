import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
export type ArvoTextboxType = 'text' | 'url' | 'password' | 'email';
export interface ArvoTextboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'prefix'> {
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
    /**
     * HTML input type. Drives type-specific behavior beyond the native
     * `<input type>`:
     * - `text` (default): standard textbox.
     * - `url`: locks the leading icon to `desktop`; `prefix` is configurable.
     * - `email`: locks the leading icon to `envelope-o`.
     * - `password`: renders an eye visibility toggle in the trailing actions
     *   slot; `icon`, `prefix`, `prefixTooltip`, `suffix`, `suffixTooltip`,
     *   and `isClearable` are silently ignored (a dev-only warning fires
     *   when any are passed).
     */
    type?: ArvoTextboxType;
    maxLength?: number;
    hasCounter?: boolean;
    errorMsg?: string;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    isClearable?: boolean;
    isLoading?: boolean;
    isFullWidth?: boolean;
    width?: string;
    /**
     * Optional leading icon name (without the `o9con-` prefix) rendered inside
     * `__field` before the prefix / input. 16px square; recolored by parent
     * state through the shared `form-input-affix` pattern. Wired to the
     * `__ico` BEM slot.
     *
     * LOCKED when `type='url'` (forced to `desktop`) or `type='email'`
     * (forced to `envelope-o`), and IGNORED when `type='password'`.
     */
    icon?: string;
    /**
     * Optional static text rendered inside `__field` at the leading edge after
     * `__ico` (e.g. `"https://"`, `"@"`, `"Order #"`). Cosmetic only -- never
     * part of the input value, never parsed, never emitted in events. When set,
     * a vertical separator (`__prefix-sep`) is rendered between the prefix and
     * the input. The prefix element carries `aria-hidden="true"`; pointer
     * clicks forward focus to the inner input. Silently ignored when
     * `type='password'`.
     */
    prefix?: string;
    /**
     * Optional tooltip text shown when hovering the prefix element. No tooltip
     * when null. Only effective when `prefix` is also set. Routed through the
     * shared Arvo tooltip pipeline. Silently ignored when `type='password'`.
     */
    prefixTooltip?: string;
    /**
     * Optional static text rendered inside `__field` at the trailing edge after
     * the input (e.g. `".com"`, `"kg"`, `"days"`). Cosmetic only -- never part
     * of the input value, never parsed, never emitted in events. `aria-hidden`
     * on the suffix element; pointer clicks forward focus to the inner input.
     * Silently ignored when `type='password'`.
     */
    suffix?: string;
    /**
     * Optional tooltip text shown when hovering the suffix element. No tooltip
     * when null. Only effective when `suffix` is also set. Silently ignored
     * when `type='password'`.
     */
    suffixTooltip?: string;
    /**
     * Controlled visibility of the password value. Only effective when
     * `type='password'`. Provide together with `onPasswordVisibilityChange`
     * for a fully-controlled toggle; omit (or pass `undefined`) to let the
     * component manage its own visibility state via `defaultPasswordVisible`.
     */
    isPasswordVisible?: boolean;
    /**
     * Initial uncontrolled value for the password visibility toggle. Only
     * effective when `type='password'` and `isPasswordVisible` is not
     * provided. Defaults to `false` (value hidden).
     */
    defaultPasswordVisible?: boolean;
    /**
     * Called when the password visibility toggle is clicked. Receives the
     * next visibility boolean. Only fires when `type='password'`.
     */
    onPasswordVisibilityChange?: (visible: boolean) => void;
    onInput?: React.FormEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
declare const ArvoTextbox: import('react').ForwardRefExoticComponent<ArvoTextboxProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoTextbox;
//# sourceMappingURL=Textbox.d.ts.map