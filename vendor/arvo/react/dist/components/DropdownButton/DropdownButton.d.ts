import { ReactElement } from 'react';
import { ListGroup } from '../../../../core/src';
import { MenuItemData, ArvoActionMenuProps } from '../ActionMenu/ActionMenu';
import { MenuSearchProp } from '../../types/menu-search';
/**
 * Scoped escape-hatch bag for inner `ArvoActionMenu` config that the parent
 * does not curate as a flat prop. See `composition.mdx` (Scoped configuration
 * props) and `.claude/rules/arvo/react.md` (Hybrid prop surface).
 *
 * Excludes anything the parent owns (`items`, `trigger`, `isOpen`,
 * `defaultOpen`, `onSelect`, `onOpenChange`, `isDisabled`) and anything
 * already flat on the parent (`placement`, `maxHeight`, `search`,
 * `hasGroupDividers`, `closeOnSelect`, `onOpen`, `onClose`). On overlap,
 * the parent's flat prop wins.
 *
 * Key set kept identical to the JS `DropdownButtonMenuProps` -- drift
 * checker enforces parity.
 */
export type DropdownButtonMenuProps = Pick<ArvoActionMenuProps, 'actionsVisibility' | 'submenuTrigger' | 'menuWidth' | 'submenuWidth'>;
/**
 * External-overlay slot prop. Pass an `ArvoHybridPopover` / `ArvoPopover` /
 * `ArvoDropdownTree` / similar ReactElement that accepts the canonical
 * Arvo overlay trigger contract -- `triggerRef`, `isOpen`,
 * `onOpenChange` -- and ArvoDropdownButton will clone it to inject these
 * onto the rendered trigger.
 *
 * Any props you set on the cloned element take precedence over the
 * injected values: ArvoDropdownButton only injects keys you did NOT
 * supply yourself. This avoids clobbering a consumer-provided
 * `onOpenChange` -- but the wrapper still observes the trigger's
 * `aria-expanded` attribute through `useOpenStateSync`, so the chrome
 * still reflects the real overlay state.
 */
type OverlayElement = ReactElement<{
    triggerRef?: React.RefObject<HTMLElement | null>;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}>;
export interface ArvoDropdownButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type' | 'onSelect' | 'defaultValue' | 'value'> {
    label: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    mode?: 'action' | 'selection';
    displaySelected?: 'label' | 'value';
    value?: string | number | null;
    defaultValue?: string | number | null;
    isDisabled?: boolean;
    isLoading?: boolean;
    /**
     * Menu items passed through to the internal ArvoActionMenu. Required
     * when using the default internal-menu composition; OPTIONAL (and
     * ignored) when an external `overlay` slot is supplied or the wrapper
     * is rendered in pure headless mode (no `items` / no `overlay`).
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
    menuProps?: DropdownButtonMenuProps;
    /**
     * Optional external overlay slot. When supplied, the internal
     * ArvoActionMenu is NOT rendered; the trigger button instead anchors
     * the supplied overlay. The wrapper clones the slot to additively
     * inject `triggerRef`, `isOpen`, and a composed `onOpenChange` --
     * any of those keys you set on the element yourself win. Selection
     * mode is ActionMenu-shaped and falls back to action mode (with a dev
     * warning) when this prop is set.
     */
    overlay?: OverlayElement;
    /**
     * Optional external triggerRef for the trigger button. Forwarded onto
     * the same `<button>` element. Useful for headless mode -- the
     * consumer composes their own overlay externally and anchors it via
     * this ref. Coexists with `ref`, which still forwards to the same
     * button. NOT consulted when the default internal-ArvoActionMenu
     * composition is active.
     */
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
    /**
     * Controlled open state. When supplied, the wrapper's `.open` class
     * and `dd-btn:open` / `dd-btn:close` event dispatch follow this prop.
     * When omitted, the wrapper auto-syncs by observing the trigger's
     * `aria-expanded` attribute (every Arvo overlay sets it through the
     * OverlaySurface engine). In the default internal-ArvoActionMenu
     * composition the wrapper drives this itself; consumers do not need
     * to pass it.
     */
    isOpen?: boolean;
    onSelect?: (item: MenuItemData, index: number) => boolean | void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
}
declare const ArvoDropdownButton: import('react').ForwardRefExoticComponent<ArvoDropdownButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoDropdownButton;
//# sourceMappingURL=DropdownButton.d.ts.map