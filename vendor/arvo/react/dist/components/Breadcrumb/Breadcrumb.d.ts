import { ListGroup } from '../../../../core/src';
import { MenuItemData, ArvoActionMenuProps } from '../ActionMenu/ActionMenu';
export type ArvoBreadcrumbSize = 'sm' | 'lg';
export type ArvoBreadcrumbItemType = 'home' | 'link' | 'current';
export interface ArvoBreadcrumbItem {
    /**
     * Visible label. Suppressed for `home` items (which are icon-only) but
     * still required for accessibility -- it is forwarded to `aria-label` on
     * the underlying anchor when no visible text is rendered.
     */
    label: string;
    /** Destination URL. Omit for non-navigable items. */
    href?: string;
    /**
     * Optional o9con icon name (without the `o9con-` prefix). For `home`
     * items the icon is shown alone; for `link` / `current` items it sits as
     * a leading icon before the label.
     */
    icon?: string;
    /**
     * Role of the item in the trail. When omitted, the breadcrumb infers it:
     * the last item becomes `current`, an icon-only first item without
     * `menuItems` becomes `home`, and any other item is a `link`.
     */
    type?: ArvoBreadcrumbItemType;
    /**
     * Optional dropdown menu attached to this item. When present and the
     * item is a `link` or `current` role, the wrapper renders that row as
     * an `ArvoActionMenu` trigger (chevron + button) instead of a plain
     * anchor / span. `menuItems` wins over `href` when both are set.
     * Ignored on `home` items.
     */
    menuItems?: MenuItemData[] | ListGroup<MenuItemData>[];
}
/**
 * Scoped escape-hatch bag for the inner overflow `ArvoActionMenu` config the
 * parent does not curate as a flat prop. See `composition.mdx` and
 * `.cursor/rules/react-components.mdc` (Hybrid prop surface). Key set kept
 * identical to the JS twin -- drift checker enforces parity.
 */
export type BreadcrumbMenuProps = Pick<ArvoActionMenuProps, 'placement' | 'maxHeight' | 'hasGroupDividers' | 'menuWidth' | 'submenuWidth'>;
export interface ArvoBreadcrumbProps {
    /** Ordered list of breadcrumb items, root -> current page. */
    items: ArvoBreadcrumbItem[];
    /** Visual size. `sm` (default) for dense layouts, `lg` for page headers. */
    size?: ArvoBreadcrumbSize;
    /**
     * Whether to collapse middle items into an overflow menu when the trail
     * exceeds `maxVisibleItems`. When false, every item is rendered.
     */
    hasOverflow?: boolean;
    /**
     * Maximum number of items rendered before middle items collapse into the
     * overflow menu. Counts the overflow trigger as one slot. Default: `4`.
     */
    maxVisibleItems?: number;
    isDisabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
    /** Accessible label for the overflow trigger button. */
    overflowAriaLabel?: string;
    /**
     * Escape hatch for the inner overflow `ArvoActionMenu` config the parent
     * doesn't expose flat. Bag-only keys (`placement`, `maxHeight`,
     * `hasGroupDividers`) flow through. On any conflict with a parent-owned
     * prop (items, isDisabled, onSelect, onOpenChange) the parent wins. Also
     * applied to every per-item dropdown that has `menuItems`.
     */
    menuProps?: BreadcrumbMenuProps;
    /** Fired when a breadcrumb link is activated (including overflow menu). */
    onNavigate?: (event: {
        href: string;
        index: number;
        label: string;
    }) => void;
    /** Fired when the overflow menu opens. */
    onOverflowOpen?: () => void;
    /** Fired when the overflow menu closes. */
    onOverflowClose?: () => void;
    /**
     * Fired when a per-item dropdown menu opens. `index` is the original
     * `items` array index of the breadcrumb item whose menu opened.
     */
    onItemMenuOpen?: (event: {
        index: number;
    }) => void;
    /** Fired when a per-item dropdown menu closes. */
    onItemMenuClose?: (event: {
        index: number;
    }) => void;
    className?: string;
}
declare const ArvoBreadcrumb: import('react').ForwardRefExoticComponent<ArvoBreadcrumbProps & import('react').RefAttributes<HTMLElement>>;
export default ArvoBreadcrumb;
//# sourceMappingURL=Breadcrumb.d.ts.map