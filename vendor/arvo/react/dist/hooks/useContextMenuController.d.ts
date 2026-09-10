import { RefObject } from 'react';
import { ContextMenuOnRequest, ContextMenuAnchor, ContextMenuModality } from '../../../core/src';
export interface UseContextMenuControllerOptions<TContext = unknown> {
    /** Target element ref that listens for contextmenu / keyboard gestures. */
    targetRef: RefObject<HTMLElement | null>;
    /** Optional CSS selector for event-delegated invocation. */
    contextSelector?: string;
    /** Convert the resolved invoker element into the consumer's entity context. */
    resolveContext?: (invoker: HTMLElement) => TContext;
    /** Called whenever the controller recognizes a context-menu gesture. */
    onRequest: ContextMenuOnRequest<TContext>;
    /** Touch long-press duration. `0` disables long-press handling. */
    longPressMs?: number;
    /** Disable keyboard handling (Shift+F10, ContextMenu key). Default true (enabled). */
    keyboard?: boolean;
    /** When true, the controller is not bound. Default false. */
    disabled?: boolean;
}
export interface UseContextMenuControllerReturn {
    /** Programmatic request -- bypasses event recognition. */
    request: (init: {
        anchor: ContextMenuAnchor;
        invoker?: HTMLElement;
        context?: unknown;
        modality?: ContextMenuModality;
        originalEvent?: MouseEvent | KeyboardEvent | TouchEvent;
    }) => void;
}
export declare function useContextMenuController<TContext = unknown>(options: UseContextMenuControllerOptions<TContext>): UseContextMenuControllerReturn;
//# sourceMappingURL=useContextMenuController.d.ts.map