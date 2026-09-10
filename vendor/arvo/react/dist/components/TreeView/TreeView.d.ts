import { default as React, CSSProperties, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { ArvoBadgeProps } from '../Badge';
import { MenuItemData } from '../ActionMenu';
/**
 * Per-row trailing meta indicator. Either a bare string (text-only shortcut,
 * e.g. `'EXT'`) or an object that supports an icon, text, or both. Rendered
 * between the label and any inline actions inside `__content`.
 */
export type TreeItemMeta = string | {
    icon?: string;
    text?: string;
};
export interface ArvoTreeItem {
    id: string;
    label: string;
    icon?: string;
    secondaryLabel?: string;
    badge?: ArvoBadgeProps | string | number;
    /** Optional trailing supporting indicator (1-3 char text and/or 12x12 icon). */
    meta?: TreeItemMeta;
    children?: ArvoTreeItem[] | null;
    isDisabled?: boolean;
    /**
     * Whether this row participates in selection. Defaults to `true`.
     * Set `false` on group / category parent rows whose only role is
     * to group their children:
     *   - in `multiSelect` / `navigationMultiSelect` the checkbox is
     *     suppressed and the row carries no `aria-checked`;
     *   - in `singleSelect` the row body + Enter + Space only expand /
     *     collapse (no selection occurs, no `aria-selected` is set);
     *   - in `expandOnly` the row already only expands (no change);
     *   - in `navigation` / `navigationMultiSelect` the row body + Enter
     *     still fire `onNavigate` (navigation is independent of
     *     selection).
     * The row is excluded from the multi-select cascade -- it is neither
     * toggled when an ancestor is checked nor counted toward an
     * ancestor's indeterminate state -- but its selectable descendants
     * are still cascaded. Unrelated to `isDisabled`, which blocks ALL
     * interaction including expansion / focus / navigation.
     */
    isSelectable?: boolean;
    isLoading?: boolean;
    isAsyncLoading?: boolean;
    isEmphasized?: boolean;
    /**
     * Per-item visual emphasis override. Falls back to the tree-level
     * `appearance` prop when omitted. `'strong'` bumps the label
     * typography one step (sm: 14px medium; lg: 16px medium) and is
     * intended for major hierarchy sections, important parent items,
     * group-style parents, or primary categories. It changes ONLY visual
     * emphasis -- selection, navigation, expansion, keyboard, and
     * accessibility semantics are unaffected.
     */
    appearance?: TreeAppearance;
    /**
     * Render the row in the 'currently open / active destination' treatment
     * (same chrome as `selected`). Independent from `isSelected` -- use to
     * compose the Figma `navigation` / `navigationMultiSelect` patterns.
     */
    isActive?: boolean;
    /**
     * Per-row override for the search-highlight modifier. When set, the row
     * uses this value instead of the auto-derived "label contains searchQuery"
     * check. Useful when consumers run their own match logic (fuzzy match,
     * scoring, etc.) and want full control over which rows visually
     * highlight while still leveraging the tree's substring highlight overlay
     * inside `__label-match`.
     */
    isSearchMatch?: boolean;
    ariaCurrent?: boolean | 'page' | 'location' | 'true';
    ariaLabel?: string;
    /** Per-row override of the tree-level `actions`. Replaces the default for this row only. */
    actions?: TreeRowAction[];
    /**
     * Per-row override for the drag handle (spec section 24). Defaults
     * to `true` when the tree-level `isReorderable` is true. Set `false`
     * to keep the row in place: it cannot be picked up via keyboard or
     * click, but it can still be the TARGET of a move from another row
     * unless `canMoveItem` rejects the move.
     */
    hasDragHandle?: boolean;
    /**
     * When true (and the tree-level `contextMenu` prop is configured),
     * render a trailing `more-vertical` overflow button in the
     * inline-actions zone that opens the same context menu (spec
     * section 23: context-menu actions must also be available through
     * keyboard-accessible UI). The overflow button is rendered AFTER
     * any per-row `actions`.
     */
    hasOverflowMenu?: boolean;
    /**
     * Decoupled "this row requires additional visual attention" flag
     * (spec section 33). Renders the row's label in bold italic.
     * Independent from `isSelected`, `isActive`, and `isEmphasized` --
     * compose freely. Use for any reason that does NOT have a
     * dedicated state (tenant, source, imported, recommended, recently
     * used, business-specific highlight).
     */
    isHighlighted?: boolean;
}
export interface TreeViewEmptyConfig {
    illustration?: string;
    title?: string;
    message?: string;
}
export type TreeSelectionMode = 'single' | 'multiple';
export type TreeSize = 'sm' | 'lg';
export type TreeAppearance = 'default' | 'strong';
/**
 * The five canonical TreeView interaction models (spec sections 6.1-6.5).
 * Choosing a `variant` defines what the chevron, label/row body,
 * checkbox (if any), Enter, and Space do for every row in the tree --
 * developers do not configure label vs checkbox vs chevron behavior
 * individually. Mapping:
 *
 * | variant                 | ARIA selection model      | row-body action  | Enter             | Space            |
 * | ----------------------- | ------------------------- | ---------------- | ----------------- | ---------------- |
 * | `expandOnly`            | none (parent rows only)   | expand / no-op   | expand            | no-op            |
 * | `singleSelect`          | aria-selected             | select           | select            | select           |
 * | `multiSelect`           | aria-checked + multisel.  | expand / no-op   | expand            | toggle checkbox  |
 * | `navigation`            | none                      | onNavigate       | onNavigate        | no-op            |
 * | `navigationMultiSelect` | aria-checked + multisel.  | onNavigate       | onNavigate        | toggle checkbox  |
 *
 * The chevron always controls expansion and the drag handle / inline
 * actions always carry their own responsibility per the "One target,
 * one responsibility" rule. Rows whose `isSelectable === false` route
 * the row body to `expand` (or `onNavigate` in navigation variants)
 * regardless of the tree variant.
 */
export type TreeVariant = 'expandOnly' | 'singleSelect' | 'multiSelect' | 'navigation' | 'navigationMultiSelect';
/**
 * Internal routing for the row body / Enter. Derived from `variant`
 * and never exposed as a public prop. The full mapping is documented
 * on {@link TreeVariant}. `Space` semantics are owned by the keyboard
 * handler and depend on the variant, not on this value.
 */
export type TreeRowInteraction = 'expand' | 'select' | 'navigate';
export interface TreeSelectionContext {
    item: ArvoTreeItem;
    isSelected: boolean;
}
export interface TreeExpandContext {
    item: ArvoTreeItem;
    isExpanded: boolean;
}
export interface TreeRowAction {
    id: string;
    icon: string;
    ariaLabel: string;
    isDisabled?: boolean;
    onClick?: (item: ArvoTreeItem, event: ReactMouseEvent<HTMLButtonElement>) => boolean | void;
}
/**
 * Drop position relative to the target row (spec section 24):
 *   - `'before'` -- place the moved row before the target (same parent).
 *   - `'after'`  -- place the moved row after the target (same parent).
 *   - `'inside'` -- place the moved row inside the target as its child.
 *
 * The keyboard reorder mode only emits `'before'` / `'after'` (siblings
 * only). The click-to-drop and pointer-drag modes can additionally
 * emit `'inside'` when the user drops on the body of a parent row.
 */
export type TreeDropPosition = 'before' | 'after' | 'inside';
export interface TreeReorderContext {
    item: ArvoTreeItem;
    fromParentId: string | null;
    fromIndex: number;
    toParentId: string | null;
    toIndex: number;
    /** Drop position relative to the target (spec section 24). */
    position: TreeDropPosition;
}
/**
 * Imperative handle exposed via `ref`. Mirrors the JS twin's public method
 * surface (`TreeView.ts:365,373,435,1086`) so React consumers can drive
 * focus, expansion, selection, and (via `move`) reorder programmatically
 * without round-tripping through controlled props.
 */
export interface ArvoTreeViewHandle {
    /** Returns the current selected ids (uncontrolled state included). */
    selected(): string[];
    /** Replaces the selected ids when the consumer is in uncontrolled mode. */
    selected(ids: string[]): void;
    /** Returns the current expanded ids. */
    expanded(): string[];
    /** Replaces the expanded ids when the consumer is in uncontrolled mode. */
    expanded(ids: string[]): void;
    /** Programmatic reorder. Mirrors the JS twin -- the dispatched
     * `tree:reorder` event remains cancellable. Optional `position`
     * defaults to `'before'` (insert at the given index under the given
     * parent; pass `'inside'` to move into a parent). */
    move(id: string, target: {
        parentId: string | null;
        index: number;
        position?: TreeDropPosition;
    }): void;
    /** Move keyboard focus + active descendant to the given row. */
    focusItem(id: string): void;
}
export type TreeMaxVisualLevel = 1 | 2 | 3 | 4;
export interface ArvoTreeViewProps {
    items: ArvoTreeItem[];
    /**
     * Selects one of the five UX interaction models (spec sections
     * 6.1-6.5). Defaults to `'expandOnly'`. See {@link TreeVariant} for
     * the per-variant mapping of row body, Enter, Space, checkbox, and
     * ARIA semantics. Rows whose `isSelectable === false` always route
     * the row body to expand (or `onNavigate` in navigation variants),
     * regardless of the tree variant.
     */
    variant?: TreeVariant;
    size?: TreeSize;
    /**
     * Tree-level default for per-row appearance. Per-row
     * `item.appearance` overrides this for individual rows. `'strong'`
     * applied at the tree level affects every row; use the per-row
     * override to mark only a subset of major rows as strong while
     * children stay default.
     */
    appearance?: TreeAppearance;
    /**
     * When `true`, render vertical + elbow connector lines that
     * communicate parent-child relationships. Default `false` -- depth is
     * communicated through indentation alone (spec section 13). The
     * connector slots are always rendered (they preserve indentation
     * width); only the paint is gated by this flag.
     */
    hasHierarchyLines?: boolean;
    selectedIds?: string[];
    defaultSelectedIds?: string[];
    expandedIds?: string[];
    defaultExpandedIds?: string[];
    searchQuery?: string;
    onLoadChildren?: (item: ArvoTreeItem) => Promise<ArvoTreeItem[]>;
    isDisabled?: boolean;
    isLoading?: boolean;
    emptyConfig?: TreeViewEmptyConfig;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    onSelectionChange?: (ids: string[], context: TreeSelectionContext) => void;
    onExpandedChange?: (ids: string[], context: TreeExpandContext) => void;
    /**
     * Called when the row body is clicked or `Enter` is pressed AND the
     * tree's `variant` is `'navigation'` or `'navigationMultiSelect'`.
     * Selection state is NOT mutated; pair with per-row `isActive` (and
     * optionally `ariaCurrent`) to drive the "currently open destination"
     * chrome.
     */
    onNavigate?: (item: ArvoTreeItem, event: ReactMouseEvent<HTMLDivElement> | ReactKeyboardEvent<HTMLDivElement>) => void;
    className?: string;
    style?: CSSProperties;
    id?: string;
    /** Default trailing action set rendered on every row. Per-row `item.actions` overrides this. */
    actions?: TreeRowAction[];
    /** When 'hover' (default) the action row is hidden until the row is hovered/focused. */
    actionsVisibility?: 'always' | 'hover';
    /**
     * Max number of indent slots rendered per row (1-4). Defaults to 4.
     * Deeper rows still receive accurate `aria-level`; only the visual
     * indent cluster caps so very deep trees do not exhaust horizontal space.
     */
    maxVisualLevel?: TreeMaxVisualLevel;
    /** Enable keyboard + click reorder. Renders a drag handle button and emits `onReorder` on commit. */
    isReorderable?: boolean;
    /** Called before a reorder commits. Return false to cancel. */
    onReorder?: (context: TreeReorderContext) => boolean | void;
    /**
     * Optional pre-commit validator. Called BEFORE `tree:reorder` is
     * dispatched and BEFORE `onReorder` runs. Return `false` to reject
     * the move; the live region announces "Move not allowed." and the
     * row stays in place. Useful for type-driven constraints
     * (e.g. "files cannot move into a non-folder parent") without
     * threading the same logic through every callback.
     */
    canMoveItem?: (context: TreeReorderContext) => boolean;
    /**
     * Per-row context menu configuration (spec section 23). Either a
     * static `MenuItemData[]` (same menu for every row) OR a function
     * `(item) => MenuItemData[]` (per-row menu). When set, the tree
     * wires four triggers: right-click on the row, `Shift+F10`,
     * `Ctrl+Shift+X`, and the Context Menu key. Right-click on an
     * unselected row sets the "context item" without mutating selection
     * or checkbox state. On menu close, focus returns to the originating
     * treeitem.
     *
     * Pairs with `item.hasOverflowMenu`: when set on a row, that row
     * renders a trailing overflow icon button that opens the same menu
     * (keyboard-accessible UI per spec).
     */
    contextMenu?: MenuItemData[] | ((item: ArvoTreeItem) => MenuItemData[]);
    /**
     * Optional callback fired when a context menu opens on a row. Useful
     * for analytics or telemetry. Receives the originating tree item
     * and the trigger source (`'mouse'` for right-click, `'keyboard'`
     * for Shift+F10 / Ctrl+Shift+X / ContextMenu, `'overflow'` for the
     * inline overflow button).
     */
    onContextMenu?: (item: ArvoTreeItem, trigger: 'mouse' | 'keyboard' | 'overflow') => void;
    /**
     * Read-only mode (spec section A14). Selection and expansion are
     * still possible (read concerns), but mutating affordances are
     * suppressed: inline action buttons, drag handles, the overflow
     * menu, and the context menu (right-click + Shift+F10 +
     * Ctrl+Shift+X + ContextMenu key) all become no-ops. The tree root
     * carries `aria-readonly='true'` for assistive technology.
     */
    isReadOnly?: boolean;
}
export declare const ArvoTreeView: React.ForwardRefExoticComponent<ArvoTreeViewProps & React.RefAttributes<ArvoTreeViewHandle>>;
export default ArvoTreeView;
//# sourceMappingURL=TreeView.d.ts.map