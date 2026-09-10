import { RefObject } from 'react';
import { TooltipPlacement } from '../../../core/src';
export interface TooltipConfig {
    content: string;
    placement?: TooltipPlacement;
    shortcut?: string;
}
export type TooltipProp = string | TooltipConfig;
export interface UseTooltipOptions {
    triggerRef: RefObject<HTMLElement | null>;
    tooltip: TooltipProp | undefined;
    labelRef?: RefObject<HTMLElement | null>;
    autoOnTruncation?: boolean;
}
/**
 * Internal hook that wires a component's trigger element to the tooltip system.
 * Manages event listeners, content updates, and cleanup automatically.
 */
export declare function useTooltip(options: UseTooltipOptions): void;
//# sourceMappingURL=useTooltip.d.ts.map