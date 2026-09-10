import { ReactNode } from 'react';
import { ListItemBase, ListGroup } from '../../../core/src';
export interface OptionRowItem extends ListItemBase {
    value: unknown;
}
export type OptionRowVariant = 'standard' | 'rich';
export type OptionRowSelectionMode = 'single' | 'multiple';
export declare function isGroupedOptions<T extends ListItemBase>(items: T[] | ListGroup<T>[]): items is ListGroup<T>[];
export declare function flattenOptions<T extends ListItemBase>(items: T[] | ListGroup<T>[]): T[];
export interface OptionRowConfig<T extends OptionRowItem> {
    /** BEM block, e.g. `arvo-listbox` or `arvo-opt-list`. */
    block: string;
    activeIndex: number;
    /** When false, the `highlighted` class is suppressed (keyboard-gated lists). */
    isHighlightActive?: boolean;
    isSelected: (value: unknown) => boolean;
    getOptionId: (flatIndex: number) => string;
    /** Visual layout variant. Defaults to `'standard'`. */
    variant?: OptionRowVariant;
    /** Selection mode. Drives the leading checkbox slot. Defaults to `'single'`. */
    selectionMode?: OptionRowSelectionMode;
    /** Emit a `data-index` attribute on each row (JS-parity click delegation). */
    emitDataIndex?: boolean;
    onItemClick?: (item: T, flatIndex: number) => void;
    onItemMouseEnter?: (item: T, flatIndex: number) => void;
    onItemMouseDown?: (e: React.MouseEvent, item: T, flatIndex: number) => void;
    renderLabel?: (item: T) => ReactNode;
}
export declare function renderOptionRow<T extends OptionRowItem>(item: T, flatIndex: number, cfg: OptionRowConfig<T>): ReactNode;
export interface OptionListBodyConfig<T extends OptionRowItem> extends OptionRowConfig<T> {
    /** The (already filtered) items to render. */
    filteredItems: T[] | ListGroup<T>[];
    /** Group header id prefix, e.g. `${listId}-grp`. */
    groupIdPrefix: string;
    hasGroupDividers?: boolean;
}
/**
 * Renders the flat-or-grouped option rows for a listbox surface. Returns
 * only the option content; the caller owns the `role="listbox"` container,
 * the search field, and the empty/loading states.
 */
export declare function renderOptionListBody<T extends OptionRowItem>(cfg: OptionListBodyConfig<T>): ReactNode;
//# sourceMappingURL=option-list-render.d.ts.map