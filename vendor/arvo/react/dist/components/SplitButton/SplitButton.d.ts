import { ReactElement } from 'react';
import { ListGroup } from '../../../../core/src';
import { MenuItemData, ArvoActionMenuProps } from '../ActionMenu/ActionMenu';
import { MenuSearchProp } from '../../types/menu-search';
/**
 * Scoped escape-hatch bag for inner `ArvoActionMenu` config the parent
 * does not curate as a flat prop. See `composition.mdx` and
 * `.claude/rules/arvo/react.md` (Hybrid prop surface). Key set
 * kept identical to the JS twin -- drift checker enforces parity.
 */
export type SplitButtonMenuProps = Pick<ArvoActionMenuProps, 'actionsVisibility' | 'submenuTrigger' | 'menuWidth' | 'submenuWidth'>;
type OverlayElement = ReactElement<{
    triggerRef?: React.RefObject<HTMLElement | null>;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}>;
export interface ArvoSplitButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type' | 'onSelect' | 'defaultValue' | 'value'> {
    label: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    mode?: 'action' | 'selection';
    displaySelected?: 'label' | 'value';
    value?: string | number | null;
    defaultValue?: string | number | null;
    isDisabled?: boolean;
    isActionDisabled?: boolean;
    isTriggerDisabled?: boolean;
    isLoading?: boolean;
    /**
     * Menu items passed through to the internal ArvoActionMenu. Required
     * for the default internal-menu composition; OPTIONAL (and ignored)
     * when an external `overlay` slot is supplied or in pure headless
     * mode.
     */
    items?: MenuItemData[] | ListGroup<MenuItemData>[];
    /** Enable search with defaults (`true`) or pass a config object. */
    search?: MenuSearchProp;
    placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
    maxHeight?: string;
    hasGroupDividers?: boolean;
    closeOnSelect?: boolean;
    /**
     * Escape hatch for `ArvoActionMenu` config the parent doesn't expose
     * flat. Bag-only knobs (`actionsVisibility`, `submenuTrigger`)
     * flow through. On any conflict with a flat prop, the flat prop wins.
     */
    menuProps?: SplitButtonMenuProps;
    /**
     * Optional external overlay slot for the CARET segment. When
     * supplied, the internal ArvoActionMenu is NOT rendered; the caret
     * segment anchors the supplied overlay instead. The wrapper clones
     * the slot to additively inject `triggerRef` (the caret segment) and
     * `isOpen` (when controlled at the wrapper). Selection mode is
     * ActionMenu-shaped and falls back to action mode (with a dev
     * warning) when this prop is set. The action segment is unaffected --
     * `onAction` and `split-btn:action` still fire as before.
     */
    overlay?: OverlayElement;
    /**
     * Optional external triggerRef for the CARET (trigger) segment.
     * Forwarded onto the caret `<button>`. Distinct from the
     * component's forwarded `ref`, which targets the ACTION segment.
     */
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
    /**
     * Controlled open state. When supplied, drives the wrapper's `.open`
     * class and `split-btn:open` / `split-btn:close` dispatch. When
     * omitted, the wrapper auto-syncs by observing the caret segment's
     * `aria-expanded` attribute.
     */
    isOpen?: boolean;
    /**
     * Accessible name for the trigger (caret) segment, exposed via aria-label.
     * Default: "Show options".
     */
    triggerLabel?: string;
    onAction?: (event: React.MouseEvent<HTMLButtonElement>, selectedItem: MenuItemData | null) => void;
    onSelect?: (item: MenuItemData, index: number) => boolean | void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
}
declare const ArvoSplitButton: import('react').ForwardRefExoticComponent<ArvoSplitButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoSplitButton;
export { ArvoSplitButton };
//# sourceMappingURL=SplitButton.d.ts.map