"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const useListNavigation = require("./index93.cjs");
const FormLabel = require("./index12.cjs");
const Search = require("./index51.cjs");
const menuSearch = require("./index100.cjs");
const optionListRender = require("./index106.cjs");
const isGrouped = optionListRender.isGroupedOptions;
const flattenItems = optionListRender.flattenOptions;
const ArvoListbox = React.forwardRef(
  function ArvoListbox2({
    items,
    value,
    defaultValue,
    label,
    contextHelp,
    isMultiple = false,
    search,
    isLoading: isLoadingProp = false,
    isDisabled = false,
    isRequired = false,
    emptyMessage = "No options",
    hasGroupDividers = true,
    onChange,
    onHighlight,
    onFilter,
    className
  }, ref) {
    const uid = React.useId();
    const listId = `arvo-listbox-${uid}`;
    const labelId = `${listId}-lbl`;
    const getOptionId = React.useCallback(
      (index) => `${listId}-opt-${index}`,
      [listId]
    );
    const searchCfg = React.useMemo(
      () => menuSearch.normalizeSearch(search, { shortcut: "/" }),
      [search]
    );
    const rootRef = React.useRef(null);
    const listRef = React.useRef(null);
    const searchWrapperRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const dispatch = React.useCallback(
      (name, detail) => {
        var _a;
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail
          })
        );
      },
      []
    );
    const isValueControlled = value !== void 0;
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? (isMultiple ? [] : void 0)
    );
    const currentValue = isValueControlled ? value : internalValue;
    const isSelected = React.useCallback(
      (optionValue) => {
        if (isMultiple) {
          const arr = Array.isArray(currentValue) ? currentValue : [];
          return arr.includes(optionValue);
        }
        return currentValue === optionValue;
      },
      [currentValue, isMultiple]
    );
    const [query, setQuery] = React.useState("");
    const filteredItems = React.useMemo(() => {
      if (!searchCfg || !query) return items;
      if (isGrouped(items)) {
        return core.filterGroups(items, { query });
      }
      return core.filterItems(items, { query });
    }, [items, searchCfg, query]);
    const flatOptions = React.useMemo(
      () => flattenItems(filteredItems),
      [filteredItems]
    );
    const totalOptionCount = React.useMemo(() => flattenItems(items).length, [items]);
    React.useEffect(() => {
      var _a;
      if (searchCfg && query) {
        (_a = searchCfg.onFilter) == null ? void 0 : _a.call(searchCfg, query, flatOptions.length);
        onFilter == null ? void 0 : onFilter(query, flatOptions.length);
        dispatch("listbox:filter", {
          query,
          matchCount: flatOptions.length
        });
      }
    }, [searchCfg, query, flatOptions.length, onFilter, dispatch]);
    const handleSelect = React.useCallback(
      (option) => {
        if (option.isDisabled) return;
        if (isMultiple) {
          const arr = Array.isArray(currentValue) ? [...currentValue] : [];
          const idx = arr.indexOf(option.value);
          const wasSelected = idx >= 0;
          if (wasSelected) {
            arr.splice(idx, 1);
          } else {
            arr.push(option.value);
          }
          if (!isValueControlled) setInternalValue(arr);
          onChange == null ? void 0 : onChange(arr, option);
          dispatch("listbox:change", {
            value: option.value,
            option,
            isSelected: !wasSelected
          });
        } else {
          if (!isValueControlled) setInternalValue(option.value);
          onChange == null ? void 0 : onChange(option.value, option);
          dispatch("listbox:change", {
            value: option.value,
            option,
            isSelected: true
          });
        }
      },
      [currentValue, isMultiple, isValueControlled, onChange, dispatch]
    );
    const scrollToIndex = React.useCallback(
      (index) => {
        var _a;
        const optionEl = (_a = listRef.current) == null ? void 0 : _a.querySelector(
          `[id="${getOptionId(index)}"]`
        );
        optionEl == null ? void 0 : optionEl.scrollIntoView({ block: "nearest" });
      },
      [getOptionId]
    );
    const handleItemSelect = React.useCallback(
      (item, _index) => {
        handleSelect(item);
      },
      [handleSelect]
    );
    const { activeIndex, setActiveIndex, handleKeyDown: navKeyDown } = useListNavigation.useListNavigation({
      items: flatOptions,
      onSelect: handleItemSelect,
      wrap: true,
      enabled: !isDisabled && !isLoading,
      scrollToIndex
    });
    React.useEffect(() => {
      if (activeIndex >= 0 && activeIndex < flatOptions.length) {
        const option = flatOptions[activeIndex];
        onHighlight == null ? void 0 : onHighlight(option.value, option);
        dispatch("listbox:highlight", {
          value: option.value,
          option
        });
      }
    }, [activeIndex, flatOptions, onHighlight, dispatch]);
    React.useEffect(() => {
      var _a;
      if (!searchCfg) return;
      const searchInput = (_a = searchWrapperRef.current) == null ? void 0 : _a.querySelector("input");
      if (!searchInput) return;
      if (activeIndex >= 0 && activeIndex < flatOptions.length) {
        searchInput.setAttribute("aria-activedescendant", getOptionId(activeIndex));
      } else {
        searchInput.removeAttribute("aria-activedescendant");
      }
    }, [searchCfg, activeIndex, flatOptions.length, getOptionId]);
    React.useEffect(() => {
      const firstEnabled = flatOptions.findIndex((item) => !item.isDisabled);
      setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
    }, [flatOptions, setActiveIndex]);
    const handleKeyDown = React.useCallback(
      (e) => {
        if (isDisabled || isLoading) return;
        navKeyDown(e);
      },
      [isDisabled, isLoading, navKeyDown]
    );
    const handleFilterSearch = React.useCallback(
      (value2) => {
        setQuery(value2);
        setActiveIndex(0);
      },
      [setActiveIndex]
    );
    const handleFilterClear = React.useCallback(() => {
      var _a;
      setQuery("");
      setActiveIndex(0);
      (_a = searchCfg == null ? void 0 : searchCfg.onClear) == null ? void 0 : _a.call(searchCfg);
    }, [setActiveIndex, searchCfg]);
    const handleSearchWrapperKeyDown = React.useCallback(
      (e) => {
        switch (e.key) {
          case "ArrowDown":
          case "ArrowUp":
          case "Home":
          case "End":
            e.preventDefault();
            navKeyDown(e);
            break;
          case "Enter":
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < flatOptions.length) {
              const item = flatOptions[activeIndex];
              if (!item.isDisabled) handleSelect(item);
            }
            break;
        }
      },
      [navKeyDown, activeIndex, flatOptions, handleSelect]
    );
    const handleItemClick = React.useCallback(
      (option, flatIndex) => {
        if (option.isDisabled || isLoading) return;
        setActiveIndex(flatIndex);
        handleSelect(option);
      },
      [isLoading, setActiveIndex, handleSelect]
    );
    const classes = [
      "arvo-listbox",
      isMultiple && "arvo-listbox--multiple",
      searchCfg && "arvo-listbox--searchable",
      isLoading && "loading",
      isDisabled && "is-disabled",
      className
    ].filter(Boolean).join(" ");
    const renderContent = () => {
      if (isLoading) {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-listbox__skeleton", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-listbox__skeleton-row", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-listbox__skeleton-icon" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: "arvo-listbox__skeleton-text",
              style: { width: `${60 + i * 7 % 30}%` }
            }
          )
        ] }, i)) });
      }
      if (flatOptions.length === 0) {
        return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-listbox__empty", role: "status", children: emptyMessage });
      }
      return optionListRender.renderOptionListBody({
        block: "arvo-listbox",
        filteredItems,
        activeIndex,
        isSelected,
        getOptionId,
        groupIdPrefix: `${listId}-grp`,
        hasGroupDividers,
        onItemClick: handleItemClick
      });
    };
    const highlightedOptionId = activeIndex >= 0 && activeIndex < flatOptions.length ? getOptionId(activeIndex) : void 0;
    function setRefs(node) {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: setRefs, className: classes, children: [
      label && /* @__PURE__ */ jsxRuntime.jsx(
        FormLabel.FormLabel,
        {
          htmlFor: listId,
          id: labelId,
          isRequired,
          isDisabled,
          contextHelp,
          className: "arvo-listbox__lbl",
          children: label
        }
      ),
      searchCfg && /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: searchWrapperRef,
          className: [
            "arvo-listbox__search",
            searchCfg.className
          ].filter(Boolean).join(" "),
          onKeyDown: handleSearchWrapperKeyDown,
          children: /* @__PURE__ */ jsxRuntime.jsx(
            Search.default,
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
              isDisabled,
              "aria-label": "Filter options"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: listRef,
          id: listId,
          className: "arvo-listbox__list",
          role: "listbox",
          tabIndex: isDisabled ? -1 : 0,
          "aria-multiselectable": isMultiple || void 0,
          "aria-activedescendant": highlightedOptionId,
          "aria-busy": isLoading || void 0,
          "aria-labelledby": label ? labelId : void 0,
          "aria-disabled": isDisabled || void 0,
          "aria-required": isRequired || void 0,
          onKeyDown: handleKeyDown,
          children: renderContent()
        }
      )
    ] });
  }
);
exports.ArvoListbox = ArvoListbox;
//# sourceMappingURL=index61.cjs.map
