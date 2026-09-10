import { HTMLAttributes, RefObject } from 'react';
export type ArvoSplitterOrientation = 'vertical' | 'horizontal';
export type ArvoSplitterResizeReason = 'pointer' | 'keyboard' | 'reset' | 'programmatic';
export type ArvoSplitterTarget = HTMLElement | string | RefObject<HTMLElement | null> | null;
export interface ArvoSplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onReset'> {
    /** Axis of the splitter rail. Vertical resizes width; horizontal resizes height. */
    orientation?: ArvoSplitterOrientation;
    /**
     * Enables drag and keyboard interaction. When `false`, the splitter renders
     * as a static visual separator with no indicator, no focus, and no event
     * handling. Defaults to `true`.
     */
    isResizable?: boolean;
    /**
     * Primary container the splitter resizes. Accepts an HTMLElement, a CSS
     * selector string, or a RefObject pointing at the element. When set, the
     * splitter automatically applies the current size to the target via inline
     * style (`width` for vertical, `height` for horizontal), auto-detects the
     * `inverse` direction by inspecting the target's DOM position relative to
     * the splitter, and (when `ariaControls` is omitted) auto-derives
     * `aria-controls` from `target.id`. When omitted, the splitter is purely
     * controlled -- the consumer applies the size to their own region in
     * response to `onResize`.
     */
    target?: ArvoSplitterTarget;
    /**
     * Pointer-direction inversion. When `true`, dragging the rail in the
     * positive axis direction DECREASES the reported value. Defaults to auto-
     * detection when `target` is set (target before splitter => `false`; target
     * after splitter => `true`), and to `false` when `target` is omitted.
     * Keyboard and `value()` setters are direction-agnostic.
     */
    inverse?: boolean;
    /** Controlled current size in pixels. Pair with `onResize` to update. */
    value?: number;
    /**
     * Uncontrolled initial size in pixels AND the snap-to value used by
     * double-click reset / `reset()`. When omitted but `target` is set, the
     * splitter measures the target's natural size on mount and uses that as
     * the reset target. When omitted with no target, falls back to `minSize`.
     */
    defaultValue?: number;
    /** Lower clamping bound in pixels. Defaults to 0. */
    minSize?: number;
    /** Upper clamping bound in pixels. Defaults to unbounded. */
    maxSize?: number;
    /** Arrow-key step in pixels. */
    step?: number;
    /** PageUp/PageDown step in pixels. */
    pageStep?: number;
    /** Disables interaction (only meaningful when `isResizable=true`). */
    isDisabled?: boolean;
    /**
     * Accessible name. Required when `isResizable=true` (the rail has no
     * visible label). Ignored when `isResizable=false`.
     */
    ariaLabel?: string;
    /**
     * Id of the region being resized. When omitted AND `target` is an element
     * with an `id`, the splitter auto-derives `aria-controls` from `target.id`.
     */
    ariaControls?: string;
    /** Fires when a pointer or keyboard resize interaction begins. */
    onResizeStart?: (value: number, reason: ArvoSplitterResizeReason) => void;
    /** Fires on every interim size change during drag / after each key step. */
    onResize?: (value: number, reason: ArvoSplitterResizeReason) => void;
    /** Fires once the resize interaction commits (pointer up / blur / reset). */
    onResizeEnd?: (value: number, reason: ArvoSplitterResizeReason) => void;
    /** Convenience alias of `onResize` that omits the reason field. */
    onChange?: (value: number) => void;
    /** Fires after a double-click or programmatic `reset()`. */
    onReset?: (value: number) => void;
}
export interface ArvoSplitterHandle {
    /** Returns the current size; pass a number to set it (clamped). */
    value: (next?: number) => number;
    /** Returns the disabled state; pass a boolean to set it. */
    disabled: (next?: boolean) => boolean;
    /** Programmatically focuses the rail (no-op when not resizable). */
    focus: () => void;
    /** Resets the splitter to defaultValue (or measured fallback). */
    reset: () => number;
}
declare const ArvoSplitter: import('react').ForwardRefExoticComponent<ArvoSplitterProps & import('react').RefAttributes<ArvoSplitterHandle>>;
export default ArvoSplitter;
//# sourceMappingURL=Splitter.d.ts.map