import { ArrowNavOptions } from '../../../core/src';
export interface UseKeyboardNavReturn {
    handleKeyDown: (event: React.KeyboardEvent) => void;
    activeIndex: number;
}
export declare function useKeyboardNav(containerRef: React.RefObject<HTMLElement | null>, options: ArrowNavOptions): UseKeyboardNavReturn;
//# sourceMappingURL=useKeyboardNav.d.ts.map