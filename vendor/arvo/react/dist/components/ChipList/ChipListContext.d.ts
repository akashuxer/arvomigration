export interface ChipListContextValue {
    variant?: 'general' | 'filter' | 'input';
    appearance?: 'primary' | 'outline' | 'utility';
    size?: 'sm' | 'md' | 'lg';
    colorMode?: 'default' | 'semantic' | 'custom';
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isLoading?: boolean;
}
export declare const ChipListContext: import('react').Context<ChipListContextValue | null>;
export declare function useChipList(): ChipListContextValue | null;
//# sourceMappingURL=ChipListContext.d.ts.map