"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const PanelBase = require("./index99.cjs");
const List = require("./index63.cjs");
const Accordion = require("./index69.cjs");
const AccordionItem = require("./index70.cjs");
const useControllableState = require("./index90.cjs");
function toArraySelection(next) {
  if (next == null) return [];
  return Array.isArray(next) ? next : [next];
}
const ArvoFilterPanel = React.forwardRef(
  function ArvoFilterPanel2(props, ref) {
    const {
      filterView = "flat",
      selectionMode = "multiple",
      items,
      groups,
      selectedIds: selectedIdsProp,
      defaultSelectedIds,
      onSelectionChange,
      listProps,
      accordionProps,
      instanceRef,
      placement = "left",
      className,
      ...rest
    } = props;
    const baseHandleRef = React.useRef(null);
    const dispatchHostRef = React.useRef(null);
    const [selectedIds, setSelectedIds] = useControllableState.useControllableState(
      selectedIdsProp,
      defaultSelectedIds ?? []
    );
    const dispatchFilterChange = React.useCallback(
      (nextIds) => {
        var _a;
        (_a = dispatchHostRef.current) == null ? void 0 : _a.dispatchEvent(
          new CustomEvent("pnl:filter-change", {
            bubbles: true,
            detail: { selectedIds: nextIds }
          })
        );
        onSelectionChange == null ? void 0 : onSelectionChange(nextIds);
      },
      [onSelectionChange]
    );
    const handleSectionSelection = React.useCallback(
      (sectionIds, nextForSection) => {
        const preserved = selectedIds.filter((id) => !sectionIds.has(id));
        const next = [...preserved, ...nextForSection];
        setSelectedIds(next);
        dispatchFilterChange(next);
      },
      [selectedIds, setSelectedIds, dispatchFilterChange]
    );
    const handleFlatSelection = React.useCallback(
      (detail) => {
        const next = toArraySelection(detail.selectedIds);
        setSelectedIds(next);
        dispatchFilterChange(next);
      },
      [setSelectedIds, dispatchFilterChange]
    );
    const groupIdSets = React.useMemo(() => {
      if (filterView !== "grouped" || !groups) return null;
      const map = /* @__PURE__ */ new Map();
      for (const g of groups) {
        map.set(g.id, new Set(g.items.map((i) => i.id)));
      }
      return map;
    }, [filterView, groups]);
    const innerSelectionMode = selectionMode === "multiple" ? "multi" : "single";
    const body = React.useCallback(
      (ctx) => {
        const query = ctx.searchQuery ?? "";
        if (filterView === "grouped" && groups) {
          return /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              ref: dispatchHostRef,
              className: "arvo-pnl__filter-grouped",
              style: { display: "contents" },
              children: /* @__PURE__ */ jsxRuntime.jsx(
                Accordion.ArvoAccordion,
                {
                  ...accordionProps,
                  children: groups.map((group) => {
                    const groupIdSet = (groupIdSets == null ? void 0 : groupIdSets.get(group.id)) ?? /* @__PURE__ */ new Set();
                    const groupSelected = selectedIds.filter(
                      (id) => groupIdSet.has(id)
                    );
                    return /* @__PURE__ */ jsxRuntime.jsx(
                      AccordionItem.ArvoAccordionItem,
                      {
                        value: group.id,
                        title: group.title,
                        icon: group.icon,
                        children: /* @__PURE__ */ jsxRuntime.jsx(
                          List.ArvoList,
                          {
                            ...listProps,
                            selectionMode: innerSelectionMode,
                            items: group.items,
                            selectedIds: innerSelectionMode === "single" ? groupSelected[0] ?? null : groupSelected,
                            searchQuery: query || void 0,
                            onSelectionChange: (detail) => {
                              const nextForSection = toArraySelection(
                                detail.selectedIds
                              );
                              handleSectionSelection(groupIdSet, nextForSection);
                            }
                          }
                        )
                      },
                      group.id
                    );
                  })
                }
              )
            }
          );
        }
        return /* @__PURE__ */ jsxRuntime.jsx("div", { ref: dispatchHostRef, style: { display: "contents" }, children: /* @__PURE__ */ jsxRuntime.jsx(
          List.ArvoList,
          {
            ...listProps,
            selectionMode: innerSelectionMode,
            items,
            selectedIds: innerSelectionMode === "single" ? selectedIds[0] ?? null : selectedIds,
            searchQuery: query || void 0,
            onSelectionChange: handleFlatSelection
          }
        ) });
      },
      [
        filterView,
        groups,
        items,
        innerSelectionMode,
        selectedIds,
        listProps,
        accordionProps,
        groupIdSets,
        handleFlatSelection,
        handleSectionSelection
      ]
    );
    const extraHostClasses = React.useMemo(
      () => [
        `arvo-pnl--filter-${filterView}`,
        `arvo-pnl--select-${selectionMode}`
      ],
      [filterView, selectionMode]
    );
    React.useImperativeHandle(
      instanceRef,
      () => ({
        open: () => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.open();
        },
        close: (reason) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.close(reason);
        },
        toggle: () => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.toggle();
        },
        isOpen: () => {
          var _a;
          return ((_a = baseHandleRef.current) == null ? void 0 : _a.isOpen()) ?? false;
        },
        pinned(value) {
          var _a, _b;
          if (value === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.pinned();
          (_b = baseHandleRef.current) == null ? void 0 : _b.pinned(value);
        },
        setDisplayMode: (mode) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setDisplayMode(mode);
        },
        setStickyHeader: (config) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setStickyHeader(config);
        },
        setHeaderActions: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setHeaderActions(next);
        },
        setActions: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setActions(next);
        },
        setTitle: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setTitle(next);
        },
        setIcon: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setIcon(next);
        },
        search(query) {
          var _a, _b;
          if (query === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.search();
          (_b = baseHandleRef.current) == null ? void 0 : _b.search(query);
        },
        selectedTab(id) {
          var _a, _b;
          if (id === void 0)
            return ((_a = baseHandleRef.current) == null ? void 0 : _a.selectedTab()) ?? null;
          (_b = baseHandleRef.current) == null ? void 0 : _b.selectedTab(id);
        },
        size(next) {
          var _a, _b;
          if (next === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.size();
          (_b = baseHandleRef.current) == null ? void 0 : _b.size(next);
        },
        loading(state) {
          var _a, _b;
          if (state === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.loading();
          (_b = baseHandleRef.current) == null ? void 0 : _b.loading(state);
        },
        disabled(state) {
          var _a, _b;
          if (state === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.disabled();
          (_b = baseHandleRef.current) == null ? void 0 : _b.disabled(state);
        },
        focus: (target) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.focus(target);
        }
      }),
      []
    );
    return /* @__PURE__ */ jsxRuntime.jsx(
      PanelBase.default,
      {
        ...rest,
        ref,
        placement,
        panelType: "filter",
        extraHostClasses,
        className,
        body,
        instanceRef: baseHandleRef
      }
    );
  }
);
exports.default = ArvoFilterPanel;
//# sourceMappingURL=index75.cjs.map
