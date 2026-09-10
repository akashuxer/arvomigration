import { default as React } from 'react';
export declare const ARVO_MSG_ALERT_DEFAULT_ERROR = "Form field value is invalid";
export type ArvoMessageAlertType = 'negative' | 'positive' | 'warning' | 'info' | 'neutral' | 'block';
export interface ArvoMessageAlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
    /** Semantic type. Drives icon glyph + color via the SCSS pattern. Defaults to `negative`. */
    type?: ArvoMessageAlertType;
    /** When true, renders ONLY the 16x16 icon (in-field tooltip-error icon mode). */
    isInline?: boolean;
    /**
     * Alert message. In full mode renders inside `__msg`. In inline mode the prop is
     * NOT rendered visually, but a string value is mirrored to `aria-label` on the
     * root. Non-string ReactNode values fall back to the type-default label.
     *
     * React accepts any ReactNode -- a plain string, the shared inline-content
     * forms (render with `renderInlineContentReact(content)` for `.arvo-inline__*`
     * styling parity with the JS layer), or richer JSX compositions. The vanilla
     * JS `ArvoMessageAlert` instead accepts the framework-agnostic
     * `BasicInlineContent` AST (string | InlineNode[]) -- both honor the same
     * `.arvo-inline__*` visual contract.
     */
    message?: React.ReactNode;
    /**
     * Optional o9con icon name override. Only honored when `type="neutral"` --
     * every other type renders its semantic glyph and ignores this prop. The
     * neutral type itself has no fixed semantic glyph (Figma label "Use any
     * icon"), so consumers may pass any o9con name (e.g. `'bell-o'`, `'star'`).
     */
    icon?: string | null;
    /**
     * When true AND `isInline=false`, renders a trailing close affordance
     * (`ArvoIconButton` size=`xs`, icon=`close`, tooltip=`Dismiss`). Ignored
     * when `isInline=true`.
     */
    isDismissable?: boolean;
    /** Callback fired when the close icon button is clicked. */
    onDismiss?: () => void;
    /** DOM id for `aria-describedby` wiring on the associated form control. */
    id?: string;
    /**
     * ARIA live-region role. When omitted, auto-resolves from `type`:
     * `negative|warning|block` -> `'alert'`, `info|positive|neutral` -> `'status'`.
     */
    role?: 'alert' | 'status';
    className?: string;
}
export interface ArvoMessageAlertComponent extends React.ForwardRefExoticComponent<ArvoMessageAlertProps & React.RefAttributes<HTMLDivElement>> {
    defaultErrorMessage: string;
}
export declare const ArvoMessageAlert: ArvoMessageAlertComponent;
export default ArvoMessageAlert;
//# sourceMappingURL=MessageAlert.d.ts.map