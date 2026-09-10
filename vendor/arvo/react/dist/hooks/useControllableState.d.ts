/**
 * Supports both controlled and uncontrolled component patterns.
 *
 * - **Controlled:** when `controlledValue` is not `undefined`, the returned
 *   value mirrors the prop and `setValue` is a no-op (parent owns state).
 * - **Uncontrolled:** when `controlledValue` is `undefined`, the hook manages
 *   internal state initialised to `defaultValue`.
 */
export declare function useControllableState<T>(controlledValue: T | undefined, defaultValue: T): [T, (next: T | ((prev: T) => T)) => void];
//# sourceMappingURL=useControllableState.d.ts.map