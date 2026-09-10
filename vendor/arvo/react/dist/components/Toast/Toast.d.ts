import { BasicInlineContent } from '../../../../core/src';
export type ArvoToastType = 'negative' | 'warning' | 'info' | 'positive' | 'block' | 'neutral';
/**
 * Toast container placement. Run 2 of the feedback refactor dropped
 * `top-left` and `bottom-left`; the design only supports right-anchored
 * stacking.
 */
export type ArvoToastPosition = 'top-right' | 'bottom-right';
export type ArvoToastCloseReason = 'click' | 'escape' | 'fade' | 'programmatic';
/**
 * Structured link action for a toast. The toast renders an internal
 * `ArvoLink` from this data so consumers never construct DOM or JSX
 * for the link themselves. Toast curates `size` and `variant` so the
 * link is visually consistent across all toasts; the long tail of
 * `ArvoLink` props is intentionally not exposed here.
 */
export interface ArvoToastLinkAction {
    label: string;
    href: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    icon?: string;
    isExternal?: boolean;
}
export interface ArvoToastOptions {
    type?: ArvoToastType;
    title?: string | null;
    /**
     * Body content. Accepts a plain string OR a `BasicInlineContent` array
     * (`InlineNode[]`) from `@arvo/core/inline-content`. The shared adapter
     * renders inline runs (text, em, strong, link, code, kbd) through
     * React. Raw HTML strings are not representable -- use the AST.
     */
    message: BasicInlineContent;
    fadeAway?: boolean;
    timeout?: number;
    pauseOnHover?: boolean;
    /**
     * Optional o9con icon name override (without the `o9con-` prefix). **Only
     * honored when `type='neutral'`** -- every other type renders its semantic
     * glyph via the SCSS pattern and ignores this prop. The neutral type itself
     * has no fixed semantic glyph, so consumers may pass any o9con name (e.g.
     * `'bell-o'`, `'star'`, `'rocket'`) and it renders as a child
     * `<i class="o9con o9con-{name}">` inside `__ico`, with the
     * `has-icon-override` state class on the root.
     */
    icon?: string | null;
    link?: ArvoToastLinkAction;
    className?: string;
    onClose?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
export interface ArvoToastProviderProps {
    position?: ArvoToastPosition;
    children: React.ReactNode;
}
interface ToastContextValue {
    show: (options: ArvoToastOptions) => string;
    close: (id: string) => void;
    closeAll: () => void;
}
export declare function useToast(): ToastContextValue;
declare function ArvoToastProvider({ position, children }: ArvoToastProviderProps): import("react/jsx-runtime").JSX.Element;
export { ArvoToastProvider };
export default ArvoToastProvider;
//# sourceMappingURL=Toast.d.ts.map