import { ArvoListItemData, ArvoListSelectionMode, ArvoListVariant, ArvoListActionsVisibility } from './List';
/**
 * Internal row primitive consumed by ArvoList. Apps MUST NOT initialize
 * ArvoListItem directly -- pass row data through ArvoList.items / .groups.
 */
export interface ArvoListItemProps extends ArvoListItemData {
    /** Cascaded from ArvoList. */
    variant?: ArvoListVariant;
    /** Cascaded from ArvoList. */
    selectionMode?: ArvoListSelectionMode;
    /** Cascaded from ArvoList. */
    actionsVisibility?: ArvoListActionsVisibility;
    /**
     * Render the leading 16x16 invisible drag-spacer slot so this row stays
     * column-aligned with reorderable peers when this row is NOT itself
     * reorderable (because it opts out via item.isReorderable=false, or because
     * it is disabled, or because the parent list isn't reorderable but the
     * caller wants reserved column space).
     */
    hasDragSpacer?: boolean;
    /** Marks this row as the keyboard-focused row. Drives the .focused class. */
    isFocused?: boolean;
    /** Cascaded roving tabindex from ArvoList. */
    tabIndex?: number;
    /** Cascaded ARIA role from ArvoList. */
    role?: string;
    className?: string;
    /** Callback fired when the row body is activated. */
    onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    /** Callback fired when the inline-nav chevron is activated. */
    onActivate?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    /** Callback fired when any trailing action is invoked. */
    onActionClick?: (actionId: string, event: React.MouseEvent | React.KeyboardEvent) => void;
    /** Callback fired when Shift+F10 / Ctrl+Shift+X requests a context menu. */
    onContextMenuRequest?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}
declare const ArvoListItem: import('react').ForwardRefExoticComponent<ArvoListItemProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoListItem;
export { ArvoListItem };
//# sourceMappingURL=ListItem.d.ts.map