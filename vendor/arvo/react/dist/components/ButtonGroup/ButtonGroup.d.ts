import { ArvoActionMenuProps } from '../ActionMenu/ActionMenu';
export interface ButtonGroupItem {
    value: string;
    label?: string;
    icon?: string;
    isDisabled?: boolean;
    isExcluded?: boolean;
}
export interface ButtonGroupChangeDetail {
    value: string | string[] | null;
    previousValue: string | string[] | null;
    changedValue?: string;
    isSelected?: boolean;
}
/**
 * Scoped escape-hatch bag for the overflow `ArvoActionMenu` (the
 * "More actions" trigger). Bag-only knobs flow through; on any conflict
 * with a parent-owned prop (items, placement, isDisabled, isLoading,
 * trigger, onSelect, onOpenChange, closeOnSelect) the parent wins. Key
 * set kept identical to the JS twin so the drift checker can enforce
 * parity. `placement` is parent-owned (`bottom-end`) and intentionally
 * excluded.
 */
export type ButtonGroupOverflowMenuProps = Pick<ArvoActionMenuProps, 'maxHeight' | 'hasGroupDividers' | 'search' | 'actionsVisibility' | 'menuWidth' | 'submenuWidth'>;
export interface ArvoButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    items: ButtonGroupItem[];
    value?: string | string[] | null;
    defaultValue?: string | string[] | null;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'lg';
    isMultiSelect?: boolean;
    isIconOnly?: boolean;
    hasOverflow?: boolean;
    expandOnSelect?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel: string;
    /**
     * Escape hatch for the overflow `ArvoActionMenu` config the parent
     * doesn't expose flat. Bag-only knobs flow through; on conflict with a
     * parent-owned prop, the parent wins.
     */
    overflowMenuProps?: ButtonGroupOverflowMenuProps;
    onChange?: (detail: ButtonGroupChangeDetail) => void;
}
declare const ArvoButtonGroup: import('react').ForwardRefExoticComponent<ArvoButtonGroupProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoButtonGroup;
//# sourceMappingURL=ButtonGroup.d.ts.map