import { ContextMenuItem } from './types';
/**
 * Single menu row -- renders the consolidated DOM for any of the supported
 * `kind` variants (item, checkbox, radio, separator) using the shared
 * `.arvo-menu-item` BEM block defined alongside `.arvo-action-menu`.
 *
 * Selection visual: per spec section 4.5 the 2 px left-border (`.active`
 * state) is the ONLY selection indicator. The row root carries the
 * `.active` class when `isSelected` (regular item) OR `checked` (checkbox
 * / radio) is true. There is NO trailing check / radio glyph; ARIA state
 * is conveyed via `role` + `aria-checked` for AT.
 *
 * Trailing zone slot order (matches ActionMenu):
 *  - `__status` (10x10 outer / 8x8 inner colored dot)
 *  - `__meta`   (right-aligned 12px value)
 *  - `__shortcut`
 *  - `__submenu` chevron (`o9con-angle-right`) when `hasSubmenu`
 *  - `__external` (`o9con-external-link`) when `href + target='_blank'`
 *
 * Leading zone: optional `__avatar` (24px image URL) renders before
 * `__ico`. Multi-line rows (rich variant) carry the
 * `arvo-menu-item--multi-line` modifier.
 *
 * Anchor rows: when `href` is set (and the row has no submenu) the row
 * renders as an `<a>` element. `target='_blank'` also adds the external
 * glyph, `rel="noopener noreferrer"`, and an `aria-label` suffix
 * announcing "opens in a new window".
 *
 * This component is presentational -- focus/keyboard wiring is the parent's
 * responsibility (it owns the roving tabindex + `focused` flag).
 */
export interface MenuItemRowProps<TContext = unknown> {
    item: ContextMenuItem<TContext>;
    /** Stable DOM id for the row (used by parent's aria-activedescendant). */
    id: string;
    /** Flat index in the menu (used for `data-index`). */
    index: number;
    /** Whether this row currently receives keyboard focus (roving tabindex). */
    isActive: boolean;
    /** Whether this row's submenu is open (drives `aria-expanded`). */
    isSubmenuOpen?: boolean;
    /** Whether this row hosts a nested submenu. */
    hasSubmenu?: boolean;
    /** Ref callback for the row element (parent collects refs for keyboard nav). */
    rowRef?: (node: HTMLElement | null) => void;
    /** Click handler. Parent decides what to do (select / open submenu / toggle). */
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
}
export declare function MenuItemRow<TContext = unknown>(props: MenuItemRowProps<TContext>): JSX.Element;
//# sourceMappingURL=MenuItemRow.d.ts.map