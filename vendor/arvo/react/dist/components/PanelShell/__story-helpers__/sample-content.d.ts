import { CSSProperties, ReactNode } from 'react';
import { ArvoPanelHeaderAction, ArvoPanelStickyHeaderConfig, ArvoPanelAction } from '../../../../../utils/src';
import { ListItemBase } from '../../../../../core/src';
export interface SampleItem extends ListItemBase {
    /** Sub-label rendered as `{block}__item__secondary` (alias of `description`). */
    secondaryLabel?: string;
    /** Back-compat alias for `secondaryLabel`. */
    description?: string;
    /** o9con icon name (no `o9con-` prefix). Renders the leading icon slot. */
    icon?: string;
    /** Image URL. Renders the leading avatar slot; wins over `icon`. */
    avatarUrl?: string;
    /** Adds `.active` (selected) class to the row. */
    isActive?: boolean;
    /** Adds `.is-disabled` + aria-disabled to the row. */
    isDisabled?: boolean;
    category?: 'forecast' | 'demand' | 'supply' | 'commercial';
}
export declare const sampleItems: SampleItem[];
export declare function makeSampleHeaderActionsAllTypes(opts?: {
    onBtn?: () => void;
    onDropdownSelect?: (id: string) => void;
    onSplitAction?: () => void;
    onSplitSelect?: (id: string) => void;
    onSwitchChange?: (isChecked: boolean) => void;
    onCheckboxChange?: (isChecked: boolean) => void;
}): ArvoPanelHeaderAction[];
export declare const sampleStickyHeaderFull: ArvoPanelStickyHeaderConfig;
export declare const sampleStickySearchOnly: ArvoPanelStickyHeaderConfig;
export declare const sampleStickyTabsOnly: ArvoPanelStickyHeaderConfig;
export declare function makeSamplePrimarySecondaryActions(opts?: {
    onCancel?: () => void;
    onApply?: () => void;
}): ArvoPanelAction[];
export declare function makeSampleResetApplyActions(opts?: {
    onReset?: () => void;
    onApply?: () => void;
}): ArvoPanelAction[];
export declare function makeSampleSendActions(opts?: {
    onCancel?: () => void;
    onSend?: () => void;
}): ArvoPanelAction[];
export declare function makePrimaryFirstActions(): ArvoPanelAction[];
export interface FilterRow {
    id: string;
    label: string;
    badge?: string;
}
export declare const sampleFilterRows: FilterRow[];
export interface StoryShellProps {
    /** Width of the canvas. Defaults to 480px. */
    width?: number | string;
    /** Height of the canvas. Defaults to 720px. */
    height?: number | string;
    /**
     * Establish a positioned context so an overlay-variant SidePanel can pin
     * to top:0 / bottom:0 inside the canvas. Default true.
     */
    positioned?: boolean;
    /** Background color of the canvas. Defaults to a neutral surface. */
    background?: string;
    /** Optional overlay text describing what the story demonstrates. */
    caption?: string;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}
export declare function StoryShell({ width, height, positioned, background, caption, className, style, children, }: StoryShellProps): import("react/jsx-runtime").JSX.Element;
export declare function renderSampleItem(item: SampleItem, block?: string): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=sample-content.d.ts.map