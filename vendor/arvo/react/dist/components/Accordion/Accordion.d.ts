import { ArvoAccordionItemProps, ArvoAccordionItemData, ArvoAccordionItemAction, ArvoAccordionItemSearchConfig, ArvoAccordionItemSwitchConfig } from './AccordionItem';
import { ArvoAccordionSize, ArvoAccordionVariant, ArvoAccordionAlign, ArvoAccordionExpandMode } from './AccordionContext';
export type { ArvoAccordionSize, ArvoAccordionVariant, ArvoAccordionAlign, ArvoAccordionExpandMode, ArvoAccordionItemProps, ArvoAccordionItemData, ArvoAccordionItemAction, ArvoAccordionItemSearchConfig, ArvoAccordionItemSwitchConfig, };
export interface ArvoAccordionValueChangeMeta {
    itemValue: string;
    isExpanded: boolean;
}
export interface ArvoAccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    /** Background treatment. */
    variant?: ArvoAccordionVariant;
    /** Density. Cascades to every item. */
    size?: ArvoAccordionSize;
    /** Chevron position. Cascades to every item. */
    align?: ArvoAccordionAlign;
    /** Expansion behavior. */
    expandMode?: ArvoAccordionExpandMode;
    /**
     * When false, the last expanded item cannot be collapsed by clicking its
     * trigger (both expandMode='single' and 'multiple'). Use when content
     * should never be fully hidden.
     */
    isCollapsible?: boolean;
    /**
     * Controlled expanded value(s). String (or null) for expandMode='single';
     * string[] for expandMode='multiple'. Pair with onValueChange.
     */
    value?: string | string[] | null;
    /** Uncontrolled initial expanded value(s). */
    defaultValue?: string | string[] | null;
    /**
     * Data-driven items array. React consumers should prefer JSX
     * <ArvoAccordionItem> children; items[] is consulted only when no
     * children are provided.
     */
    items?: ArvoAccordionItemData[];
    /** Disables interaction across every item. */
    isDisabled?: boolean;
    /** Pattern-B container loading. Renders skeleton rows. */
    isLoading?: boolean;
    /** Number of skeleton rows rendered while loading. */
    skeletonRowCount?: number;
    /** Accessible label. */
    ariaLabel?: string;
    /** id of a visible heading element that labels the accordion. */
    ariaLabelledBy?: string;
    /** Fires when expanded value(s) change. */
    onValueChange?: (value: string | string[], meta: ArvoAccordionValueChangeMeta) => void;
    /** Fires when an item expands. */
    onExpand?: (detail: {
        itemValue: string;
    }) => void;
    /** Fires when an item collapses. */
    onCollapse?: (detail: {
        itemValue: string;
    }) => void;
}
declare const ArvoAccordion: import('react').ForwardRefExoticComponent<ArvoAccordionProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoAccordion;
export { ArvoAccordion };
//# sourceMappingURL=Accordion.d.ts.map