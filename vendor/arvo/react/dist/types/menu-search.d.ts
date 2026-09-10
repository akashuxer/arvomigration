export interface MenuSearchConfig {
    /** Placeholder text. Default: "Search" */
    placeholder?: string;
    /** Inline error message shown below the search field */
    errorMsg?: string;
    /** Minimum characters before filtering fires. Default: 0 */
    minChars?: number;
    /** 'input' = filter-as-you-type; 'submit' = filter on Enter. Default: 'input' */
    searchMode?: 'input' | 'submit';
    /** Show clear button. Default: true */
    isClearable?: boolean;
    /** Show "N/M" match counter when filtering. Default: false */
    counter?: boolean;
    /** Keyboard shortcut to focus search (e.g. "/"). Default: undefined for popups, "/" for Listbox */
    shortcut?: string;
    /** Additional CSS class on the search wrapper */
    className?: string;
    /** Fires when the filtered list changes */
    onFilter?: (query: string, matchCount: number) => void;
    /** Fires when search is cleared */
    onClear?: () => void;
}
export type MenuSearchProp = boolean | MenuSearchConfig;
/**
 * Normalizes a `search` prop (boolean or config object) into a resolved
 * MenuSearchConfig, or null when search is disabled.
 */
export declare function normalizeSearch(prop: MenuSearchProp | undefined, defaults?: Partial<MenuSearchConfig>): MenuSearchConfig | null;
//# sourceMappingURL=menu-search.d.ts.map