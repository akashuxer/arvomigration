import { ReactNode } from 'react';
import { ArvoStatusConfig } from '../Status/Status';
export type ArvoChipVariant = 'general' | 'filter' | 'input';
export type ArvoChipSize = 'sm' | 'md' | 'lg';
export type ArvoChipAppearance = 'primary' | 'outline' | 'utility';
export type ArvoChipColorMode = 'default' | 'semantic' | 'custom';
export type ArvoChipSemanticType = 'none' | 'negative' | 'positive' | 'info' | 'warning' | 'block';
export type ArvoChipCustomColor = 'purple' | 'pink' | 'glacier' | 'amber' | 'greenish' | 'bluish';
/**
 * Opaque bag of attributes/handlers injected by a reorderable ArvoChipList onto
 * the chip's drag handle. Consumers do not author this manually. When present,
 * the chip renders the `__grip` ArvoIconButton and spreads the bag onto it.
 */
export type ArvoChipDragHandleProps = React.HTMLAttributes<HTMLButtonElement>;
export interface ArvoChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    variant?: ArvoChipVariant;
    size?: ArvoChipSize;
    appearance?: ArvoChipAppearance;
    colorMode?: ArvoChipColorMode;
    semanticType?: ArvoChipSemanticType;
    customColor?: ArvoChipCustomColor;
    /** Primary visible label. Required. */
    label: string;
    /** Optional secondary title shown before the label as "Title: Label". */
    title?: string;
    /** Optional leading o9con icon name (without the o9con- prefix). */
    icon?: string;
    /** Optional avatar slot (intended for ArvoAvatar). Ignored in semantic color mode. */
    avatar?: ReactNode;
    /** Optional inline ArvoStatus config rendered as a corner overlay. Ignored in semantic color mode. */
    status?: ArvoStatusConfig | null;
    /** Optional counter. A number maps to an internal ArvoBadge; a ReactNode is rendered as-is. */
    counter?: number | ReactNode;
    /**
     * Optional tooltip shown on hover/focus. Wins over the auto-generated
     * truncation and validation tooltips when set.
     */
    tooltip?: string;
    /**
     * Validation message exposed to assistive tech via aria-describedby AND
     * shown as a tooltip on hover/keyboard focus. Honored only when isInvalid
     * or isWarning is set (and not in semantic color mode). Makes a static
     * general chip focusable so keyboard users can read the message.
     */
    validationMessage?: string;
    /** Controlled selected state. Filter chips only. */
    isSelected?: boolean;
    /** Initial uncontrolled selected state. Filter chips only. */
    defaultSelected?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isWarning?: boolean;
    isExcluded?: boolean;
    isLoading?: boolean;
    /** Optional CSS max-width (truncates the label with ellipsis on overflow). */
    maxWidth?: string;
    /** Called with the next boolean when a filter chip's selected state changes. */
    onSelectedChange?: (selected: boolean) => void;
    /** Optional action handler for actionable general chips. */
    onPress?: () => void;
    /** Adds the dismiss/remove action. Primarily for input chips. */
    onDismiss?: () => void;
    /** Accessible label for the dismiss action. Defaults to `Remove {label}`. */
    dismissLabel?: string;
    /**
     * Render the `__grip` drag handle as part of the chip surface, independent
     * of any `dragHandleProps` injection. Use when the chip participates in an
     * externally-owned dnd surface that does not inject a bag -- the rendered
     * handle is a static drag-cursor ArvoIconButton with no dnd wiring, and the
     * consumer owns the actual drag pipeline. When `dragHandleProps` is ALSO
     * provided, the bag wins. Honored in every color mode; suppressed when
     * `isDisabled` / `isReadOnly` / `isLoading`.
     */
    hasDrag?: boolean;
    /** Injected by a reorderable ArvoChipList. Renders (and wires) the drag handle. */
    dragHandleProps?: ArvoChipDragHandleProps;
    className?: string;
}
declare const ArvoChip: import('react').ForwardRefExoticComponent<ArvoChipProps & import('react').RefAttributes<HTMLElement>>;
export default ArvoChip;
export { ArvoChip };
//# sourceMappingURL=Chip.d.ts.map