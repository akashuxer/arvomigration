export type ArvoAccordionSize = 'sm' | 'lg';
export type ArvoAccordionVariant = 'surface' | 'transparent';
export type ArvoAccordionAlign = 'start' | 'end';
export type ArvoAccordionExpandMode = 'single' | 'multiple';
export interface AccordionContextValue {
    size: ArvoAccordionSize;
    align: ArvoAccordionAlign;
    variant: ArvoAccordionVariant;
    expandMode: ArvoAccordionExpandMode;
    isCollapsible: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    /** Set of currently expanded item values. */
    expandedValues: ReadonlySet<string>;
    /**
     * Request a toggle for the given item. Returns true if the toggle was
     * applied, false if it was prevented (e.g. isCollapsible=false on the
     * last expanded item).
     */
    toggle: (itemValue: string) => boolean;
    /** Whether an enclosing ArvoAccordion is present. */
    hasProvider: boolean;
}
export declare const AccordionContext: import('react').Context<AccordionContextValue>;
export declare function useAccordionContext(): AccordionContextValue;
//# sourceMappingURL=AccordionContext.d.ts.map