import { ListGroup } from '../../../../core/src';
/**
 * Status indicator config shared with ArvoActionMenu. A semantic key maps
 * to the matching `arvo-menu-item--status-*` modifier class; an explicit
 * `{ color }` object sets `--arvo-menu-item-status-color` inline so the
 * dot can take an arbitrary token-driven color.
 */
export type MenuItemStatus = 'success' | 'warning' | 'danger' | 'info' | {
    color: string;
};
/**
 * Fields shared by every non-separator menu row. Keeps the React + JS
 * twins (and the three `kind` variants) structurally aligned for the
 * shared trailing-zone slots (status / meta / shortcut / external) and
 * leading slots (avatar / icon).
 */
interface ContextMenuRowBase {
    id: string;
    label: string;
    /** Secondary text rendered on a second line under the label (rich variant). */
    secondaryLabel?: string;
    /** Optional leading icon (o9con glyph name). */
    icon?: string;
    /** Optional leading 24px avatar image URL. Renders before the icon slot. */
    avatar?: string;
    /** Optional right-aligned shortcut hint (e.g. `'Ctrl+D'`, `'D'`). */
    shortcut?: string;
    /** Optional right-aligned meta value text rendered before the shortcut. */
    value?: string;
    /** Status indicator dot in the trailing zone. */
    status?: MenuItemStatus;
    /** Render the row as an `<a href>`. Ignored when the row has a submenu. */
    href?: string;
    /**
     * Anchor target. `'_blank'` also renders the `__external` glyph,
     * `rel="noopener noreferrer"`, and an `aria-label` suffix announcing
     * "opens in a new window". Ignored unless `href` is set.
     */
    target?: '_self' | '_blank';
    /** Item is non-interactive and skipped by keyboard navigation. */
    isDisabled?: boolean;
}
/** A regular invokable menu item. */
export interface ContextMenuItemNode<TContext = unknown> extends ContextMenuRowBase {
    kind?: 'item';
    /** Apply destructive (negative) styling. */
    destructive?: boolean;
    /**
     * When true, applies the `.active` selection state (2 px left-border at
     * `--arvo-color-b-theme-active` + active background). Independent of the
     * checkbox / radio checked state.
     */
    isSelected?: boolean;
    /** Child items rendered in a nested submenu surface. Takes precedence over `href`. */
    submenu?: ContextMenuItem<TContext>[];
    /**
     * Per-item execute callback invoked on selection. Receives the request
     * context the menu was opened with. Return `false` to prevent the menu
     * from auto-closing on select.
     */
    onSelect?: (context: TContext) => void | boolean;
}
/** A two-state checkbox item (role=menuitemcheckbox). */
export interface ContextMenuCheckboxItem<TContext = unknown> extends ContextMenuRowBase {
    kind: 'checkbox';
    /** Drives aria-checked AND, when true, applies the `.active` state. */
    checked: boolean;
    /** Called with the proposed next checked state and the current context. */
    onChange?: (checked: boolean, context: TContext) => void;
}
/** A radio item (role=menuitemradio). `radioGroup` ids tie peers together. */
export interface ContextMenuRadioItem<TContext = unknown> extends ContextMenuRowBase {
    kind: 'radio';
    /** Drives aria-checked AND, when true, applies the `.active` state. */
    checked: boolean;
    /** Logical radio-group identifier. Items sharing it are mutually exclusive. */
    radioGroup: string;
    onChange?: (context: TContext) => void;
}
/** A visual divider between groups of items (role=separator). */
export interface ContextMenuSeparator {
    kind: 'separator';
    id: string;
}
export type ContextMenuItem<TContext = unknown> = ContextMenuItemNode<TContext> | ContextMenuCheckboxItem<TContext> | ContextMenuRadioItem<TContext> | ContextMenuSeparator;
/**
 * A named group of items. When `label` is omitted no header row is rendered
 * for the group (useful for divider-only separation). Reuses the same shape
 * as `@arvo/core`'s `ListGroup` so consumers can share grouping helpers.
 */
export type ContextMenuItemGroup<TContext = unknown> = ListGroup<ContextMenuItem<TContext> & {
    label: string;
}> & {
    items: ContextMenuItem<TContext>[];
};
export type ContextMenuItems<TContext = unknown> = ContextMenuItem<TContext>[] | ContextMenuItemGroup<TContext>[];
/** True when the items input is grouped. */
export declare function isContextMenuGrouped<TContext>(items: ContextMenuItems<TContext>): items is ContextMenuItemGroup<TContext>[];
/** Walk a (possibly grouped) item set and return the flat invokable rows. */
export declare function flattenContextMenuItems<TContext>(items: ContextMenuItems<TContext>): ContextMenuItem<TContext>[];
/** True for rows the keyboard navigation should land on. */
export declare function isContextMenuFocusable<TContext>(item: ContextMenuItem<TContext>): boolean;
/**
 * True when the row should display the `.active` selection visual:
 * regular item with `isSelected: true`, OR checkbox / radio with
 * `checked: true`. Per spec section 4.5 the 2 px left-border is the
 * ONLY selection indicator.
 */
export declare function isContextMenuSelected<TContext>(item: ContextMenuItem<TContext>): boolean;
export {};
//# sourceMappingURL=types.d.ts.map