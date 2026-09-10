import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useId, useCallback, useRef, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { filterGroups, filterItems } from "@arvo/core";
import ArvoSearch from "./index51.js";
import ArvoEmptyState from "./index88.js";
import { normalizeSearch } from "./index100.js";
import { useOverlaySurface } from "./index92.js";
import { isGroupedOptions, flattenOptions, renderOptionListBody } from "./index106.js";
const ArvoOptionList = forwardRef(
  function ArvoOptionList2({
    items,
    variant = "standard",
    isMultiple = false,
    value,
    defaultValue,
    search,
    hasGroupDividers = true,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    isCreatable = false,
    emptyConfig,
    ariaLabel = "Options",
    triggerRef,
    activeDescendantRef,
    triggerAriaRef,
    isOpen: openProp,
    defaultOpen = false,
    placement = "bottom-start",
    width = "anchor",
    maxHeight,
    closeOnSelect,
    wrapNavigation = true,
    onChange,
    onCreate,
    onOpenChange,
    onOpen,
    onClose,
    className
  }, ref) {
    const uid = useId();
    const baseId = `arvo-opt-list-${uid.replace(/[:]/g, "")}`;
    const listboxId = `${baseId}-listbox`;
    const getOptionId = useCallback(
      (index) => `${baseId}-opt-${index}`,
      [baseId]
    );
    const panelRef = useRef(null);
    const isLoading = isLoadingProp === true;
    const shouldCloseOnSelect = closeOnSelect ?? !isMultiple;
    const searchCfg = useMemo(
      () => normalizeSearch(search, { shortcut: "/" }),
      [search]
    );
    const isValueControlled = value !== void 0;
    const [internalValue, setInternalValue] = useState(
      () => defaultValue ?? (isMultiple ? [] : void 0)
    );
    const currentValue = isValueControlled ? value : internalValue;
    const isSelected = useCallback(
      (optionValue) => {
        if (isMultiple) {
          const arr = Array.isArray(currentValue) ? currentValue : [];
          return arr.includes(optionValue);
        }
        return currentValue === optionValue;
      },
      [currentValue, isMultiple]
    );
    const [query, setQuery] = useState("");
    const filteredItems = useMemo(() => {
      if (!searchCfg || !query) return items;
      if (isGroupedOptions(items)) return filterGroups(items, { query });
      return filterItems(items, { query });
    }, [items, searchCfg, query]);
    const flatOptions = useMemo(
      () => flattenOptions(filteredItems),
      [filteredItems]
    );
    const totalOptionCount = useMemo(() => flattenOptions(items).length, [items]);
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
      const firstEnabled = flatOptions.findIndex((o) => !o.isDisabled);
      setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
    }, [flatOptions]);
    const surface = useOverlaySurface({
      type: "dropdown",
      priority: 20,
      triggerRef,
      triggerAriaRef,
      panelRef,
      isOpen: openProp,
      defaultOpen,
      onOpenChange,
      onOpen,
      onClose,
      placement,
      width: width === "anchor" ? "anchor" : width,
      focus: "none",
      haspopup: "listbox",
      controlsId: listboxId,
      closeOnOutside: true,
      closeOnEscape: true
    });
    const { isOpen, isMounted, surfaceId, panelStyle, panelSide, close } = surface;
    const handleSelect = useCallback(
      (option) => {
        if (option.isDisabled) return;
        let nextSelected;
        if (isMultiple) {
          const arr = Array.isArray(currentValue) ? [...currentValue] : [];
          const idx = arr.indexOf(option.value);
          if (idx >= 0) {
            arr.splice(idx, 1);
            nextSelected = false;
          } else {
            arr.push(option.value);
            nextSelected = true;
          }
          if (!isValueControlled) setInternalValue(arr);
          onChange == null ? void 0 : onChange(arr, option, nextSelected);
        } else {
          nextSelected = true;
          if (!isValueControlled) setInternalValue(option.value);
          onChange == null ? void 0 : onChange(option.value, option, nextSelected);
        }
        if (shouldCloseOnSelect) close();
      },
      [
        currentValue,
        isMultiple,
        isValueControlled,
        onChange,
        shouldCloseOnSelect,
        close
      ]
    );
    const handleItemClick = useCallback(
      (option, flatIndex) => {
        if (option.isDisabled || isLoading) return;
        setActiveIndex(flatIndex);
        handleSelect(option);
      },
      [isLoading, handleSelect]
    );
    const activeOptionId = flatOptions.length > 0 && activeIndex >= 0 && activeIndex < flatOptions.length ? getOptionId(activeIndex) : void 0;
    const moveActive = useCallback(
      (dir) => {
        var _a;
        if (flatOptions.length === 0) return;
        const len = flatOptions.length;
        let next = activeIndex;
        if (wrapNavigation) {
          for (let i = 0; i < len; i++) {
            next = (next + dir + len) % len;
            if (!flatOptions[next].isDisabled) break;
          }
        } else {
          let candidate = next + dir;
          while (candidate >= 0 && candidate < len && flatOptions[candidate].isDisabled) {
            candidate += dir;
          }
          if (candidate < 0 || candidate >= len) return;
          next = candidate;
        }
        setActiveIndex(next);
        const optEl = (_a = panelRef.current) == null ? void 0 : _a.querySelector(`[id="${getOptionId(next)}"]`);
        if (optEl && typeof optEl.scrollIntoView === "function") {
          optEl.scrollIntoView({ block: "nearest" });
        }
      },
      [activeIndex, flatOptions, getOptionId, wrapNavigation]
    );
    useEffect(() => {
      const el = triggerRef.current;
      if (!el || !isOpen || isDisabled || isLoading) return;
      const onKeyDown = (e) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            moveActive(1);
            break;
          case "ArrowUp":
            e.preventDefault();
            moveActive(-1);
            break;
          case "Home":
            e.preventDefault();
            setActiveIndex(flatOptions.findIndex((o) => !o.isDisabled));
            break;
          case "End":
            e.preventDefault();
            for (let i = flatOptions.length - 1; i >= 0; i--) {
              if (!flatOptions[i].isDisabled) {
                setActiveIndex(i);
                break;
              }
            }
            break;
          case "Enter":
          case " ":
            if (activeIndex >= 0 && activeIndex < flatOptions.length) {
              e.preventDefault();
              handleSelect(flatOptions[activeIndex]);
            }
            break;
        }
      };
      el.addEventListener("keydown", onKeyDown);
      return () => el.removeEventListener("keydown", onKeyDown);
    }, [
      isOpen,
      isDisabled,
      isLoading,
      moveActive,
      flatOptions,
      activeIndex,
      handleSelect,
      triggerRef
    ]);
    useEffect(() => {
      const el = (activeDescendantRef == null ? void 0 : activeDescendantRef.current) ?? triggerRef.current;
      if (!el) return;
      if (isOpen && activeOptionId) {
        el.setAttribute("aria-activedescendant", activeOptionId);
      } else {
        el.removeAttribute("aria-activedescendant");
      }
      return () => {
        el.removeAttribute("aria-activedescendant");
      };
    }, [isOpen, activeOptionId, triggerRef, activeDescendantRef]);
    const handleFilterSearch = useCallback((q) => {
      setQuery(q);
      setActiveIndex(0);
    }, []);
    const handleFilterClear = useCallback(() => {
      var _a;
      setQuery("");
      setActiveIndex(0);
      (_a = searchCfg == null ? void 0 : searchCfg.onClear) == null ? void 0 : _a.call(searchCfg);
    }, [searchCfg]);
    useEffect(() => {
      var _a;
      if (searchCfg && query) {
        (_a = searchCfg.onFilter) == null ? void 0 : _a.call(searchCfg, query, flatOptions.length);
      }
    }, [searchCfg, query, flatOptions.length]);
    const panelClasses = [
      "arvo-opt-list",
      variant === "rich" && "arvo-opt-list--rich",
      isMultiple && "arvo-opt-list--multiple",
      searchCfg && "arvo-opt-list--searchable",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const mergedStyle = {
      ...panelStyle,
      ...maxHeight ? { "--arvo-overlay-max-height": maxHeight } : {}
    };
    const trimmedQuery = query.trim();
    const isFilterActive = Boolean(searchCfg && trimmedQuery);
    const hasAnyItems = totalOptionCount > 0;
    const handleCreate = useCallback(() => {
      if (!isCreatable || !trimmedQuery) return;
      onCreate == null ? void 0 : onCreate(trimmedQuery);
    }, [isCreatable, trimmedQuery, onCreate]);
    const renderEmptyState = () => {
      let baseProps;
      if (isFilterActive && isCreatable) {
        baseProps = {
          illustration: "no-tasks",
          title: "No results found",
          message: `Do you want to add new item "${trimmedQuery}"`,
          secondaryAction: {
            label: "Create",
            icon: "plus",
            onClick: handleCreate
          }
        };
      } else if (isFilterActive) {
        baseProps = {
          illustration: "no-results",
          title: "No results found",
          message: "Adjust your search query",
          secondaryAction: {
            label: "Clear search",
            onClick: handleFilterClear
          }
        };
      } else if (!hasAnyItems) {
        baseProps = {
          illustration: "help",
          title: "No data available yet",
          message: "There are no values to display"
        };
      } else {
        baseProps = {
          illustration: "help",
          title: "No data available yet",
          message: "There are no values to display"
        };
      }
      return /* @__PURE__ */ jsx("div", { className: "arvo-opt-list__empty", children: /* @__PURE__ */ jsx(
        ArvoEmptyState,
        {
          ...baseProps,
          ...emptyConfig,
          size: "sm",
          orientation: "vertical"
        }
      ) });
    };
    const renderBody = () => {
      if (isLoading) {
        return /* @__PURE__ */ jsx("div", { className: "arvo-opt-list__skeleton", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxs("div", { className: "arvo-opt-list__skeleton-row", children: [
          /* @__PURE__ */ jsx("div", { className: "arvo-opt-list__skeleton-icon" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "arvo-opt-list__skeleton-text",
              style: { width: `${60 + i * 7 % 30}%` }
            }
          )
        ] }, i)) });
      }
      if (flatOptions.length === 0) {
        return renderEmptyState();
      }
      return renderOptionListBody({
        block: "arvo-opt-list",
        filteredItems,
        activeIndex,
        isSelected,
        getOptionId,
        groupIdPrefix: `${baseId}-grp`,
        hasGroupDividers,
        variant,
        selectionMode: isMultiple ? "multiple" : "single",
        emitDataIndex: true,
        onItemClick: handleItemClick,
        onItemMouseEnter: (_item, flatIndex) => setActiveIndex(flatIndex),
        onItemMouseDown: (e) => e.preventDefault()
      });
    };
    if (!isMounted) return null;
    const panel = /* @__PURE__ */ jsxs(
      "div",
      {
        ref: (node) => {
          panelRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        },
        id: surfaceId,
        className: panelClasses,
        "data-arvo-side": panelSide,
        style: Object.keys(mergedStyle).length > 0 ? mergedStyle : void 0,
        children: [
          searchCfg && /* @__PURE__ */ jsx("div", { className: "arvo-opt-list__search", children: /* @__PURE__ */ jsx(
            ArvoSearch,
            {
              variant: "filter",
              value: query,
              placeholder: searchCfg.placeholder,
              searchMode: searchCfg.searchMode,
              minChars: searchCfg.minChars,
              isClearable: searchCfg.isClearable,
              shortcut: searchCfg.shortcut,
              errorMsg: searchCfg.errorMsg,
              errorDisplay: "tooltip",
              counter: searchCfg.counter && query ? { current: flatOptions.length, total: totalOptionCount } : null,
              onSearch: handleFilterSearch,
              onClear: handleFilterClear,
              "aria-label": "Filter options"
            }
          ) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              id: listboxId,
              className: "arvo-opt-list__scroll",
              role: "listbox",
              "aria-label": ariaLabel,
              "aria-multiselectable": isMultiple || void 0,
              "aria-busy": isLoading || void 0,
              children: renderBody()
            }
          )
        ]
      }
    );
    return createPortal(panel, document.body);
  }
);
export {
  ArvoOptionList,
  ArvoOptionList as default
};
//# sourceMappingURL=index62.js.map
