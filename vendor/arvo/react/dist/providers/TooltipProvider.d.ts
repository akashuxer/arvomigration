import { ReactNode } from 'react';
import { TooltipManagerConfig } from '../../../core/src';
export interface TooltipProviderProps {
    config?: Partial<TooltipManagerConfig>;
    children: ReactNode;
}
/**
 * Provides a shared `TooltipManager` instance to descendant tooltip components.
 *
 * **Note:** The manager is created once on mount. Subsequent `config` prop
 * changes are forwarded via `manager.configure`, but removing `config`
 * (setting it to `undefined`) does NOT reset previously applied values.
 * If you need to disable tooltips dynamically, pass `{ enabled: false }`
 * explicitly rather than removing the `config` prop entirely.
 */
export declare function TooltipProvider({ config, children, }: TooltipProviderProps): JSX.Element;
//# sourceMappingURL=TooltipProvider.d.ts.map