export interface UseOpenStateSyncOptions {
    /**
     * Controlled open state. When `boolean`, the hook mirrors this prop and
     * `onOpenChange` is only invoked if the consumer changes it externally.
     * When `undefined`, the hook falls back to observing the trigger element's
     * `aria-expanded` attribute (auto-sync path).
     */
    isOpen?: boolean;
    /** Trigger element to observe in the uncontrolled path. */
    triggerRef: React.RefObject<HTMLElement | null>;
    /**
     * Called when the resolved open state changes. In the controlled path this
     * fires only when the parent flips `isOpen`. In the uncontrolled path this
     * fires when a `MutationRecord` reports that `aria-expanded` changed.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Default uncontrolled value used before the first mutation arrives.
     * Defaults to false.
     */
    defaultOpen?: boolean;
    /**
     * When `false`, the hook short-circuits: it returns `defaultOpen`
     * unconditionally, installs no MutationObserver, and never fires
     * `onOpenChange`. Use this when the caller knows the returned value
     * will be ignored (e.g. the ArvoSplitButton / ArvoDropdownButton family
     * skips the external-overlay observer when running in their default
     * internal-ArvoActionMenu mode and drives open state from the menu's
     * `onOpenChange` callback instead). Defaults to `true`.
     */
    enabled?: boolean;
}
/**
 * Resolves the effective open state for a wrapper that hosts an external
 * overlay. See the module header for the full contract.
 *
 * @returns The current open state (boolean).
 */
export declare function useOpenStateSync(options: UseOpenStateSyncOptions): boolean;
//# sourceMappingURL=useOpenStateSync.d.ts.map