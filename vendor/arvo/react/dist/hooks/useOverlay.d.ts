import { OverlayEntry } from '../../../core/src';
export interface UseOverlayReturn {
    open: (entry: OverlayEntry) => void;
    close: (id: string) => void;
    closeAll: (options?: {
        except?: string[];
    }) => void;
    isOpen: (id: string) => boolean;
    getContainer: () => HTMLElement;
    /** Hub-assigned z-index for an open overlay (base when unknown). */
    getZIndex: (id: string) => number;
    /**
     * Attach a component-owned wrapper element to an open entry so the hub
     * keeps the wrapper's z-index synced (`surface.z`, same layer as
     * `entry.element`) across subsequent stack changes. Pass `null` to
     * detach. Mirrors `OverlayHub.attachWrapperElement`.
     */
    attachWrapperElement: (id: string, element: HTMLElement | null) => void;
    /**
     * Returns true when the click target should be treated as "inside"
     * the given root element for outside-click dismissal purposes.
     * Considers DOM containment AND nested portaled overlays whose
     * trigger lives inside the root. See `OverlayHub.isOverlayClickInside`.
     */
    isOverlayClickInside: (root: HTMLElement | null | undefined, target: Node | null | undefined) => boolean;
}
export declare function useOverlay(): UseOverlayReturn;
//# sourceMappingURL=useOverlay.d.ts.map