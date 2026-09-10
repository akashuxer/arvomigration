import { ReactNode } from 'react';
import { OverlayConfig } from '../../../core/src';
export interface OverlayProviderProps {
    config?: Partial<OverlayConfig>;
    children: ReactNode;
}
export declare function OverlayProvider({ config, children, }: OverlayProviderProps): JSX.Element;
//# sourceMappingURL=OverlayProvider.d.ts.map