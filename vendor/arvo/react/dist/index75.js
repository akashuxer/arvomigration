import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useCallback, useMemo, useImperativeHandle } from "react";
import PanelBase from "./index99.js";
import { ArvoList } from "./index63.js";
import { ArvoAccordion } from "./index69.js";
import { ArvoAccordionItem } from "./index70.js";
import { useControllableState } from "./index90.js";
function toArraySelection(next) {
  if (next == null) return [];
  return Array.isArray(next) ? next : [next];
}
const ArvoFilterPanel = forwardRef(
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
    const baseHandleRef = useRef(null);
    const dispatchHostRef = useRef(null);
    const [selectedIds, setSelectedIds] = useControllableState(
      selectedIdsProp,
      defaultSelectedIds ?? []
    );
    const dispatchFilterChange = useCallback(
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
    const handleSectionSelection = useCallback(
      (sectionIds, nextForSection) => {
        const preserved = selectedIds.filter((id) => !sectionIds.has(id));
        const next = [...preserved, ...nextForSection];
        setSelectedIds(next);
        dispatchFilterChange(next);
      },
      [selectedIds, setSelectedIds, dispatchFilterChange]
    );
    const handleFlatSelection = useCallback(
      (detail) => {
        const next = toArraySelection(detail.selectedIds);
        setSelectedIds(next);
        dispatchFilterChange(next);
      },
      [setSelectedIds, dispatchFilterChange]
    );
    const groupIdSets = useMemo(() => {
      if (filterView !== "grouped" || !groups) return null;
      const map = /* @__PURE__ */ new Map();
      for (const g of groups) {
        map.set(g.id, new Set(g.items.map((i) => i.id)));
      }
      return map;
    }, [filterView, groups]);
    const innerSelectionMode = selectionMode === "multiple" ? "multi" : "single";
    const body = useCallback(
      (ctx) => {
        const query = ctx.searchQuery ?? "";
        if (filterView === "grouped" && groups) {
          return /* @__PURE__ */ jsx(
            "div",
            {
              ref: dispatchHostRef,
              className: "arvo-pnl__filter-grouped",
              style: { display: "contents" },
              children: /* @__PURE__ */ jsx(
                ArvoAccordion,
                {
                  ...accordionProps,
                  children: groups.map((group) => {
                    const groupIdSet = (groupIdSets == null ? void 0 : groupIdSets.get(group.id)) ?? /* @__PURE__ */ new Set();
                    const groupSelected = selectedIds.filter(
                      (id) => groupIdSet.has(id)
                    );
                    return /* @__PURE__ */ jsx(
                      ArvoAccordionItem,
                      {
                        value: group.id,
                        title: group.title,
                        icon: group.icon,
                        children: /* @__PURE__ */ jsx(
                          ArvoList,
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
        return /* @__PURE__ */ jsx("div", { ref: dispatchHostRef, style: { display: "contents" }, children: /* @__PURE__ */ jsx(
          ArvoList,
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
    const extraHostClasses = useMemo(
      () => [
        `arvo-pnl--filter-${filterView}`,
        `arvo-pnl--select-${selectionMode}`
      ],
      [filterView, selectionMode]
    );
    useImperativeHandle(
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
    return /* @__PURE__ */ jsx(
      PanelBase,
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
export {
  ArvoFilterPanel as default
};
//# sourceMappingURL=index75.js.map
