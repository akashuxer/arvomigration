import { ListItemBase, ListGroup } from '../../../../core/src';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
import { ArvoOptionListProps } from '../OptionList/OptionList';
export interface ComboboxOptionData extends ListItemBase {
    value: unknown;
}
/**
 * Scoped escape-hatch bag for inner `ArvoOptionList` config the field does not
 * curate as a flat prop. Key set kept identical to the JS twin -- the drift
 * reviewer enforces parity.
 */
export type ComboboxOptionListProps = Pick<ArvoOptionListProps, 'emptyConfig' | 'variant' | 'isCreatable' | 'onCreate'>;
export interface ArvoComboboxProps {
    items: ComboboxOptionData[] | ListGroup<ComboboxOptionData>[];
    value?: unknown;
    defaultValue?: unknown;
    inputValue?: string;
    placeholder?: string;
    /**
     * Optional leading icon name (without the `o9con-` prefix) rendered inside
     * `__field` before the prefix / input. 16px square; recolored by parent
     * state through the shared `form-input-affix` pattern. The dropdown
     * chevron is a separate slot (`__chevron`) and is unaffected by this prop.
     */
    icon?: string;
    /**
     * Optional static text rendered inside `__field` at the leading edge after
     * `__ico` (e.g. `"https://"`, `"@"`, `"Filter:"`). Cosmetic only -- never
     * part of the typed filter text, never echoed in events. When set, a
     * vertical separator (`__prefix-sep`) is rendered between the prefix and
     * the input. `aria-hidden` on the prefix element; pointer clicks forward
     * focus to the inner input.
     */
    prefix?: string;
    /**
     * Optional tooltip text shown when hovering the prefix element. No
     * tooltip when null. Only effective when `prefix` is also set.
     */
    prefixTooltip?: string;
    label?: string;
    contextHelp?: ArvoFormLabelContextHelp;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMsg?: string;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    size?: 'sm' | 'lg';
    surface?: 'filled' | 'base';
    isClearable?: boolean;
    isLoading?: boolean;
    isReadOnly?: boolean;
    isFullWidth?: boolean;
    width?: string;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    maxHeight?: string;
    hasGroupDividers?: boolean;
    filterFn?: (item: ComboboxOptionData, query: string) => boolean;
    closeOnSelect?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (item: ComboboxOptionData, index: number) => boolean | void;
    onInputChange?: (value: string) => void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onClear?: (detail: {
        previousValue: unknown;
    }) => void;
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Scoped escape-hatch bag for inner `ArvoOptionList` props the field does
     * not curate flat (e.g. `emptyConfig`, `variant`, `isCreatable`,
     * `onCreate`). Spread first so the field's flat / computed props always
     * win on overlap.
     */
    optionListProps?: ComboboxOptionListProps;
    className?: string;
}
declare const ArvoCombobox: import('react').ForwardRefExoticComponent<ArvoComboboxProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoCombobox };
export default ArvoCombobox;
//# sourceMappingURL=Combobox.d.ts.map