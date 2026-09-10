import { ReactElement } from 'react';
import { ListGroup } from '../../../../core/src';
import { MenuItemData, ArvoActionMenuProps } from '../ActionMenu/ActionMenu';
import { TooltipProp } from '../../hooks/useTooltip';
import { MenuSearchProp } from '../../types/menu-search';
/**
 * Scoped escape-hatch bag for inner `ArvoActionMenu` config the parent
 * does not curate as a flat prop. See `composition.mdx` and
 * `.claude/rules/arvo/react.md` (Hybrid prop surface). Key set
 * kept identical to the JS twin -- drift checker enforces parity.
 */
export type DropdownIconButtonMenuProps = Pick<ArvoActionMenuProps, 'actionsVisibility' | 'submenuTrigger' | 'menuWidth' | 'submenuWidth'>;
type OverlayElement = ReactElement<{
    triggerRef?: React.RefObject<HTMLElement | null>;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}>;
export interface ArvoDropdownIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type' | 'onSelect'> {
    icon: string;
    tooltip: TooltipProp;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isCompact?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    /**
     * Menu items passed through to the internal ArvoActionMenu. Required
     * when using the default internal-menu composition; OPTIONAL (and
     * ignored) when an external `overlay` slot is supplied or in pure
     * headless mode.
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
    menuProps?: DropdownIconButtonMenuProps;
    /**
     * Optional external overlay slot. When supplied, the internal
     * ArvoActionMenu is NOT rendered; the trigger button anchors the
     * supplied overlay instead. The wrapper clones the slot to additively
     * inject `triggerRef` (and `isOpen` when supplied on the wrapper).
     */
    overlay?: OverlayElement;
    /**
     * Optional external triggerRef forwarded onto the trigger button. In
     * headless mode the consumer can compose their own overlay externally
     * and anchor against this ref.
     */
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
    /**
     * Controlled open state. When supplied, drives the wrapper's `.open`
     * class and `dd-icon-btn:open` / `dd-icon-btn:close` dispatch. When
     * omitted, the wrapper auto-syncs by observing the trigger's
     * `aria-expanded` attribute.
     */
    isOpen?: boolean;
    onSelect?: (item: MenuItemData, index: number) => boolean | void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
}
declare const ArvoDropdownIconButton: import('react').ForwardRefExoticComponent<ArvoDropdownIconButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoDropdownIconButton;
//# sourceMappingURL=DropdownIconButton.d.ts.map