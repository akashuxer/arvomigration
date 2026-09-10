import { ListItemBase, ListGroup } from '../../../../core/src';
import { ArvoFormLabelContextHelp } from '../FormLabel/FormLabel';
import { ArvoOptionListProps } from '../OptionList/OptionList';
import { MenuSearchProp } from '../../types/menu-search';
export interface SelectOptionData extends ListItemBase {
    value: unknown;
}
/**
 * Scoped escape-hatch bag for inner `ArvoOptionList` config the field does not
 * curate as a flat prop. Key set kept identical to the JS twin -- the drift
 * reviewer enforces parity.
 */
export type SelectOptionListProps = Pick<ArvoOptionListProps, 'emptyConfig' | 'variant' | 'isCreatable' | 'onCreate'>;
export interface ArvoSelectProps {
    items: SelectOptionData[] | ListGroup<SelectOptionData>[];
    value?: unknown;
    defaultValue?: unknown;
    placeholder?: string;
    /**
     * Optional leading icon name (without the `o9con-` prefix) rendered inside
     * the trigger before the value / placeholder display. 16px square;
     * recolored by parent state through the shared `form-input-affix` pattern.
     * The dropdown chevron is a separate slot (`__chevron`) and is unaffected
     * by this prop.
     */
    icon?: string;
    label?: string;
    contextHelp?: ArvoFormLabelContextHelp;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMsg?: string;
    errorDisplay?: 'inline' | 'tooltip' | 'none';
    size?: 'sm' | 'lg';
    surface?: 'filled' | 'base';
    /** Enable search with defaults (`true`) or pass a config object. */
    search?: MenuSearchProp;
    isLoading?: boolean;
    isReadOnly?: boolean;
    width?: string;
    isFullWidth?: boolean;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'auto';
    maxHeight?: string;
    hasGroupDividers?: boolean;
    closeOnSelect?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (item: SelectOptionData | null, index: number) => boolean | void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Scoped escape-hatch bag for inner `ArvoOptionList` props the field does
     * not curate flat (e.g. `emptyConfig`, `variant`, `isCreatable`,
     * `onCreate`). Spread first so the field's flat / computed props always
     * win on overlap.
     */
    optionListProps?: SelectOptionListProps;
    className?: string;
}
declare const ArvoSelect: import('react').ForwardRefExoticComponent<ArvoSelectProps & import('react').RefAttributes<HTMLDivElement>>;
export { ArvoSelect };
export default ArvoSelect;
//# sourceMappingURL=Select.d.ts.map