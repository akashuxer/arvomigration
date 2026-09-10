import { ReactElement } from 'react';
import { TooltipPlacement } from '../../../../core/src';
export interface ArvoTooltipProps {
    /** Text content displayed in the tooltip */
    content: string;
    /** Preferred placement relative to the trigger element */
    placement?: TooltipPlacement;
    /** Keyboard shortcut hint displayed alongside the content */
    shortcut?: string;
    /** Single interactive child element that serves as the tooltip trigger */
    children: ReactElement;
}
/**
 * Standalone tooltip wrapper component. Wraps a single interactive child
 * and attaches tooltip behavior (hover/focus display, ARIA, positioning).
 *
 * ```tsx
 * <ArvoTooltip content="Save document" shortcut="Ctrl+S">
 *   <button>Save</button>
 * </ArvoTooltip>
 * ```
 *
 * **Tooltips are disabled by default.** The shared `tooltipManager` ships
 * with `enabled: false`, so this component is a no-op until the host app
 * calls `tooltipManager.configure({ enabled: true })` (typically once at
 * boot). The same gate applies to the `tooltip` prop on `ArvoButton`,
 * `ArvoIconButton`, `ArvoLink`, etc. See the **Overlays/Tooltip/JS API**
 * docs page for the full configuration surface.
 */
export declare const ArvoTooltip: import('react').ForwardRefExoticComponent<ArvoTooltipProps & import('react').RefAttributes<HTMLElement>>;
//# sourceMappingURL=Tooltip.d.ts.map