import { FocusTrapOptions } from '../../../core/src';
export type UseFocusTrapOptions = Omit<FocusTrapOptions, 'container'> & {
    active: boolean;
    /** Bump to re-activate the trap when the container element changes in place. */
    revision?: number;
};
/**
 * NOTE: `returnFocusTo` is read via `optionsRef` (the same mechanism as
 * `getOrderedElements`) so callers can pass a function that resolves the
 * current trigger element at deactivation time, without forcing the trap
 * to re-activate every render.
 */
export declare function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, options: UseFocusTrapOptions): void;
//# sourceMappingURL=useFocusTrap.d.ts.map