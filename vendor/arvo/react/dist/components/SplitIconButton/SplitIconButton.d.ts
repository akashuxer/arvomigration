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
export type SplitIconButtonMenuProps = Pick<ArvoActionMenuProps, 'actionsVisibility' | 'submenuTrigger' | 'menuWidth' | 'submenuWidth'>;
type OverlayElement = ReactElement<{
    triggerRef?: React.RefObject<HTMLElement | null>;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}>;
export interface ArvoSplitIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type' | 'onSelect'> {
    icon: string;
    /**
     * Tooltip content for the action segment. Required because the action is
     * icon-only -- the value also drives `aria-label`.
     */
    tooltip: TooltipProp;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    isActionDisabled?: boolean;
    isTriggerDisabled?: boolean;
    isLoading?: boolean;
    /**
     * Menu items passed through to the internal ArvoActionMenu. Required
     * for the default internal-menu composition; OPTIONAL (and ignored)
     * when an external `overlay` slot is supplied or in pure headless mode.
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
    menuProps?: SplitIconButtonMenuProps;
    /**
     * Optional external overlay slot for the CARET segment. When supplied,
     * the internal ArvoActionMenu is NOT rendered; the caret anchors the
     * supplied overlay instead. The wrapper clones the slot to additively
     * inject `triggerRef` (caret) and `isOpen`. The action segment still
     * fires `onAction` / `split-icon-btn:action`.
     */
    overlay?: OverlayElement;
    /**
     * Optional external triggerRef for the CARET segment. Distinct from
     * the component's forwarded `ref`, which targets the ACTION segment.
     */
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
    /**
     * Controlled open state. When supplied, drives the wrapper's `.open`
     * class and `split-icon-btn:open` / `split-icon-btn:close` dispatch.
     * When omitted, auto-syncs by observing the caret segment's
     * `aria-expanded` attribute.
     */
    isOpen?: boolean;
    /**
     * Accessible name for the trigger (caret) segment, exposed via aria-label.
     * Default: "Show options". Consumers should pass something contextual like
     * "Filter options" or "Sort options".
     */
    triggerLabel?: string;
    onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSelect?: (item: MenuItemData, index: number) => boolean | void;
    onOpen?: () => boolean | void;
    onClose?: () => boolean | void;
    onOpenChange?: (isOpen: boolean) => void;
}
declare const ArvoSplitIconButton: import('react').ForwardRefExoticComponent<ArvoSplitIconButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoSplitIconButton;
//# sourceMappingURL=SplitIconButton.d.ts.map