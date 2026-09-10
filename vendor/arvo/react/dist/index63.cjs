"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const useControllableState = require("./index90.cjs");
const Checkbox = require("./index23.cjs");
const EmptyState = require("./index88.cjs");
const ListItem = require("./index64.cjs");
const LIST_MAX_ROW_ACTIONS = 4;
function useNormalizedGroups(items, groups) {
  return React.useMemo(() => {
    if (groups && groups.length > 0) {
      if (items && items.length > 0 && process.env.NODE_ENV !== "production") {
        console.warn(
          "[ArvoList] Both `items` and `groups` were provided. `groups` takes precedence."
        );
      }
      return groups.map((g) => ({
        id: g.id,
        label: g.label,
        hasSelectAll: g.hasSelectAll,
        items: g.items
      }));
    }
    return [{ id: "__default", items: items ?? [] }];
  }, [items, groups]);
}
function selectionToArray(selected) {
  if (Array.isArray(selected)) return selected;
  if (typeof selected === "string") return [selected];
  return [];
}
function arrayToSelection(arr, selectionMode) {
  if (selectionMode === "single") return arr[0] ?? null;
  if (selectionMode === "multi") return [...arr];
  return null;
}
function resolveInitialSelection(controlled, uncontrolledDefault, selectionMode) {
  if (uncontrolledDefault !== void 0) return selectionToArray(uncontrolledDefault);
  return selectionMode === "multi" ? [] : [];
}
const ArvoList = React.forwardRef(function ArvoList2({
  variant = "standard",
  selectionMode = "none",
  items,
  groups,
  selectedIds: selectedIdsProp,
  defaultSelectedIds,
  excludedIds: excludedIdsProp,
  defaultExcludedIds,
  isLoading: isLoadingProp = false,
  skeletonRows = 6,
  isEmpty: isEmptyProp = false,
  emptyState,
  hasGroupDividers = true,
  hasGlobalSelectAll = false,
  globalSelectAllLabel = "Select all",
  isReorderable = false,
  crossGroupReorder = false,
  actionsVisibility = "hover",
  searchQuery,
  isDisabled = false,
  width,
  ariaLabel,
  className,
  onSelectionChange,
  onExclusionChange,
  onItemClick,
  onItemActivate,
  onReorder,
  onReorderCancel,
  onItemContextMenu,
  style,
  ...rest
}, ref) {
  const isLoading = isLoadingProp === true;
  const rootRef = React.useRef(null);
  const itemRefs = React.useRef(/* @__PURE__ */ new Map());
  const liveRef = React.useRef(null);
  const lastSelectionAnchorRef = React.useRef(null);
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const live = document.createElement("div");
    live.className = "arvo-list__live";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    live.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";
    document.body.appendChild(live);
    liveRef.current = live;
    return () => {
      live.remove();
      liveRef.current = null;
    };
  }, []);
  const normalizedGroups = useNormalizedGroups(items, groups);
  const flatItems = React.useMemo(
    () => normalizedGroups.flatMap((g) => g.items),
    [normalizedGroups]
  );
  const internalControlledSelected = selectedIdsProp !== void 0 ? selectionToArray(selectedIdsProp) : void 0;
  const [resolvedSelectedArray, setResolvedSelectedArray] = useControllableState.useControllableState(
    internalControlledSelected,
    resolveInitialSelection(void 0, defaultSelectedIds, selectionMode)
  );
  const internalControlledExcluded = excludedIdsProp;
  const [resolvedExcludedArray, setResolvedExcludedArray] = useControllableState.useControllableState(
    internalControlledExcluded,
    defaultExcludedIds ?? []
  );
  const [activeId, setActiveId] = React.useState(null);
  const draggingIdRef = React.useRef(null);
  const onReorderRef = React.useRef(onReorder);
  const onReorderCancelRef = React.useRef(onReorderCancel);
  React.useEffect(() => {
    onReorderRef.current = onReorder;
    onReorderCancelRef.current = onReorderCancel;
  });
  const enabledIds = React.useMemo(
    () => flatItems.filter((i) => !i.isDisabled).map((i) => i.id),
    [flatItems]
  );
  const tabStopId = React.useMemo(() => {
    if (activeId && enabledIds.includes(activeId)) return activeId;
    if (resolvedSelectedArray.length > 0) {
      for (const id of resolvedSelectedArray) {
        if (enabledIds.includes(id)) return id;
      }
    }
    return enabledIds[0] ?? null;
  }, [activeId, resolvedSelectedArray, enabledIds]);
  const globalAggregate = React.useMemo(
    () => core.aggregateSelectionState(resolvedSelectedArray, enabledIds),
    [resolvedSelectedArray, enabledIds]
  );
  React.useEffect(() => {
    const visibleIds = new Set(flatItems.map((i) => i.id));
    const filtered = resolvedSelectedArray.filter((id) => visibleIds.has(id));
    if (filtered.length !== resolvedSelectedArray.length) {
      setResolvedSelectedArray(filtered);
    }
  }, [flatItems, resolvedSelectedArray, setResolvedSelectedArray]);
  const announce = React.useCallback((msg) => {
    const live = liveRef.current;
    if (!live) return;
    live.textContent = "";
    requestAnimationFrame(() => {
      if (liveRef.current) liveRef.current.textContent = msg;
    });
  }, []);
  const itemById = React.useCallback(
    (idToFind) => flatItems.find((i) => i.id === idToFind),
    [flatItems]
  );
  const emitSelectionChange = React.useCallback(
    (nextArray) => {
      setResolvedSelectedArray(nextArray);
      onSelectionChange == null ? void 0 : onSelectionChange({
        selectedIds: arrayToSelection(nextArray, selectionMode),
        items: flatItems
      });
    },
    [setResolvedSelectedArray, onSelectionChange, selectionMode, flatItems]
  );
  const emitExclusionChange = React.useCallback(
    (nextArray) => {
      setResolvedExcludedArray(nextArray);
      onExclusionChange == null ? void 0 : onExclusionChange({ excludedIds: nextArray, items: flatItems });
    },
    [setResolvedExcludedArray, onExclusionChange, flatItems]
  );
  const toggleSelection = React.useCallback(
    (targetId, options) => {
      const target = itemById(targetId);
      if (!target || target.isDisabled) return;
      const current = resolvedSelectedArray;
      if (options == null ? void 0 : options.selectAll) {
        const next = options.selectAllForce ? [...enabledIds] : [];
        emitSelectionChange(next);
        announce(options.selectAllForce ? "All items selected" : "Selection cleared");
        return;
      }
      if ((options == null ? void 0 : options.rangeShift) && selectionMode === "multi") {
        const next = core.nextSelectionForRangeShift({
          selectedIds: current,
          orderedIds: flatItems.map((i) => i.id),
          anchorId: lastSelectionAnchorRef.current,
          targetId,
          disabledIds: flatItems.filter((i) => i.isDisabled).map((i) => i.id)
        });
        emitSelectionChange(next);
        lastSelectionAnchorRef.current = targetId;
        return;
      }
      if (selectionMode === "multi") {
        const set = new Set(current);
        if (set.has(targetId)) set.delete(targetId);
        else set.add(targetId);
        const next = [...set];
        emitSelectionChange(next);
        lastSelectionAnchorRef.current = targetId;
        announce(
          set.has(targetId) ? `${target.label}, selected` : `${target.label}, not selected`
        );
      } else if (selectionMode === "single") {
        emitSelectionChange([targetId]);
        lastSelectionAnchorRef.current = targetId;
        announce(`${target.label}, selected`);
      }
    },
    [
      itemById,
      resolvedSelectedArray,
      enabledIds,
      emitSelectionChange,
      selectionMode,
      flatItems,
      announce
    ]
  );
  const handleRowClick = React.useCallback(
    (item) => (e) => {
      if (item.isDisabled || isDisabled || isLoading) return;
      if (selectionMode !== "none") {
        toggleSelection(item.id);
      }
      onItemClick == null ? void 0 : onItemClick({ id: item.id, item, event: e });
    },
    [isDisabled, isLoading, selectionMode, toggleSelection, onItemClick]
  );
  const handleRowActivate = React.useCallback(
    (item) => (e) => {
      onItemActivate == null ? void 0 : onItemActivate({ id: item.id, item, event: e });
    },
    [onItemActivate]
  );
  const handleRowContextMenu = React.useCallback(
    (item) => (e) => {
      onItemContextMenu == null ? void 0 : onItemContextMenu({
        id: item.id,
        item,
        event: e,
        anchorElement: itemRefs.current.get(item.id) ?? null
      });
    },
    [onItemContextMenu]
  );
  const focusRow = React.useCallback((rowId) => {
    setActiveId(rowId);
    const el = itemRefs.current.get(rowId);
    el == null ? void 0 : el.focus();
  }, []);
  const handleKeyDown = React.useCallback(
    (e) => {
      if (isDisabled || isLoading || enabledIds.length === 0) return;
      if (selectionMode === "multi" && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a" && !e.shiftKey) {
        e.preventDefault();
        emitSelectionChange([...enabledIds]);
        announce("All items selected");
        return;
      }
      const activeRowId = activeId ?? tabStopId;
      const currentIdx = activeRowId ? enabledIds.indexOf(activeRowId) : -1;
      let nextIdx = null;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % enabledIds.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIdx = currentIdx < 0 ? enabledIds.length - 1 : (currentIdx - 1 + enabledIds.length) % enabledIds.length;
          break;
        case "Home":
          e.preventDefault();
          nextIdx = 0;
          break;
        case "End":
          e.preventDefault();
          nextIdx = enabledIds.length - 1;
          break;
        case " ":
          if (e.shiftKey && selectionMode === "multi" && activeRowId) {
            e.preventDefault();
            toggleSelection(activeRowId, { rangeShift: true });
          }
          return;
        case "Escape":
          return;
        default:
          return;
      }
      if (nextIdx !== null) {
        focusRow(enabledIds[nextIdx]);
      }
    },
    [
      isDisabled,
      isLoading,
      enabledIds,
      selectionMode,
      activeId,
      tabStopId,
      emitSelectionChange,
      announce,
      toggleSelection,
      focusRow
    ]
  );
  const handleGlobalSelectAllToggle = React.useCallback(() => {
    if (isDisabled || isLoading || selectionMode !== "multi") return;
    if (globalAggregate === "all") {
      emitSelectionChange([]);
      announce("All items deselected");
    } else {
      emitSelectionChange([...enabledIds]);
      announce("All items selected");
    }
  }, [
    isDisabled,
    isLoading,
    selectionMode,
    globalAggregate,
    emitSelectionChange,
    enabledIds,
    announce
  ]);
  const handleGroupSelectAllToggle = React.useCallback(
    (groupId) => {
      if (isDisabled || isLoading || selectionMode !== "multi") return;
      const group = normalizedGroups.find((g) => g.id === groupId);
      if (!group) return;
      const groupEnabledIds = group.items.filter((i) => !i.isDisabled).map((i) => i.id);
      const groupAggregate = core.aggregateSelectionState(resolvedSelectedArray, groupEnabledIds);
      const current = new Set(resolvedSelectedArray);
      if (groupAggregate === "all") {
        groupEnabledIds.forEach((id) => current.delete(id));
      } else {
        groupEnabledIds.forEach((id) => current.add(id));
      }
      emitSelectionChange([...current]);
    },
    [isDisabled, isLoading, selectionMode, normalizedGroups, resolvedSelectedArray, emitSelectionChange]
  );
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !isReorderable || isLoading || isDisabled) return;
    const orderedIds = flatItems.map((i) => i.id);
    const controller = core.createSortableList(root, {
      itemSelector: ".arvo-list-item",
      handleSelector: '[data-arvo-drag-handle="true"]',
      getGroupOf: (el) => {
        var _a;
        return ((_a = el.closest("[data-arvo-list-group-id]")) == null ? void 0 : _a.dataset.arvoListGroupId) ?? null;
      },
      allowCrossGroup: crossGroupReorder,
      onPreview: (fromIndex) => {
        const movedId = orderedIds[fromIndex] ?? null;
        draggingIdRef.current = movedId;
      },
      onCommit: (fromIndex, toIndex, fromGroup, toGroup) => {
        var _a;
        draggingIdRef.current = null;
        const movedId = orderedIds[fromIndex];
        const item = movedId ? itemById(movedId) : null;
        if (movedId && item) {
          (_a = onReorderRef.current) == null ? void 0 : _a.call(onReorderRef, {
            item,
            fromIndex,
            toIndex,
            fromGroupId: fromGroup,
            toGroupId: toGroup
          });
          announce(`Dropped ${item.label} at position ${toIndex + 1}`);
        }
      },
      onCancel: () => {
        var _a;
        const cancelledId = draggingIdRef.current;
        const item = cancelledId ? itemById(cancelledId) : null;
        draggingIdRef.current = null;
        if (cancelledId && item) {
          (_a = onReorderCancelRef.current) == null ? void 0 : _a.call(onReorderCancelRef, { id: cancelledId, item });
          announce(`Drag cancelled, ${item.label} returned to original position`);
        }
      }
    });
    return () => controller.destroy();
  }, [
    isReorderable,
    crossGroupReorder,
    isLoading,
    isDisabled,
    itemById,
    flatItems,
    announce
  ]);
  React.useLayoutEffect(() => {
    if (actionsVisibility !== "hover") return;
    const root = rootRef.current;
    if (!root) return;
    const handle = requestAnimationFrame(() => {
      const clusters = root.querySelectorAll(".arvo-list-item__actions");
      let max = 0;
      clusters.forEach((c) => {
        const w = c.offsetWidth;
        if (w > max) max = w;
      });
      root.style.setProperty("--arvo-list-item-actions-w", `${max + 8}px`);
    });
    return () => cancelAnimationFrame(handle);
  }, [actionsVisibility, flatItems.length]);
  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (tabStopId) focusRow(tabStopId);
      },
      selected: (next) => {
        if (next === void 0) return arrayToSelection(resolvedSelectedArray, selectionMode);
        const arr = selectionToArray(next);
        emitSelectionChange(arr);
        return arrayToSelection(arr, selectionMode);
      },
      excluded: (next) => {
        if (next === void 0) return resolvedExcludedArray;
        emitExclusionChange(next);
        return next;
      }
    }),
    [
      tabStopId,
      focusRow,
      resolvedSelectedArray,
      selectionMode,
      emitSelectionChange,
      resolvedExcludedArray,
      emitExclusionChange
    ]
  );
  const showSkeleton = isLoading;
  const totalItemCount = flatItems.length;
  const showEmpty = !showSkeleton && (isEmptyProp || totalItemCount === 0) && !!emptyState;
  const showGlobalSelectAll = hasGlobalSelectAll && selectionMode === "multi" && !showSkeleton && !showEmpty;
  const rootRole = selectionMode === "multi" ? "listbox" : selectionMode === "single" ? "radiogroup" : "list";
  const classes = [
    "arvo-list",
    `arvo-list--${variant}`,
    `arvo-list--${selectionMode}`,
    isReorderable && "arvo-list--reorderable",
    actionsVisibility === "always" && "arvo-list--actions-always",
    isDisabled && "is-disabled",
    showSkeleton && "loading",
    showEmpty && "is-empty",
    className
  ].filter(Boolean).join(" ");
  const mergedStyle = {
    ...width ? { ["--arvo-list-width"]: width } : {},
    ...style ?? {}
  };
  if (showSkeleton) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: (node) => {
          rootRef.current = node;
        },
        ...rest,
        className: classes,
        style: mergedStyle,
        role: rootRole,
        "aria-busy": "true",
        "aria-disabled": isDisabled || void 0,
        "aria-label": ariaLabel,
        "aria-multiselectable": selectionMode === "multi" ? true : void 0,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-list__skeleton", "aria-hidden": "true", children: Array.from({ length: skeletonRows }).map((_, i) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-list__skeleton-row" }, i)) })
      }
    );
  }
  if (showEmpty && emptyState) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: (node) => {
          rootRef.current = node;
        },
        ...rest,
        className: classes,
        style: mergedStyle,
        "aria-disabled": isDisabled || void 0,
        "aria-label": ariaLabel,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-list__empty", children: /* @__PURE__ */ jsxRuntime.jsx(
          EmptyState.default,
          {
            size: "md",
            illustration: emptyState.illustration ?? "no-results-found",
            title: emptyState.title,
            message: emptyState.description,
            primaryAction: emptyState.ctaLabel ? {
              label: emptyState.ctaLabel,
              variant: "outline",
              onClick: () => {
                var _a;
                return (_a = emptyState.onCtaClick) == null ? void 0 : _a.call(emptyState);
              }
            } : void 0
          }
        ) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref: (node) => {
        rootRef.current = node;
      },
      ...rest,
      className: classes,
      style: mergedStyle,
      role: rootRole,
      "aria-disabled": isDisabled || void 0,
      "aria-label": ariaLabel,
      "aria-multiselectable": selectionMode === "multi" ? true : void 0,
      onKeyDown: handleKeyDown,
      "data-arvo-actions-visibility": actionsVisibility,
      children: [
        showGlobalSelectAll && /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: "arvo-list__sa",
            role: "option",
            "aria-checked": globalAggregate === "all" ? true : globalAggregate === "some" ? "mixed" : false,
            tabIndex: -1,
            onClick: handleGlobalSelectAllToggle,
            onKeyDown: (e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleGlobalSelectAllToggle();
              }
            },
            children: [
              isReorderable && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__drag-spacer", "aria-hidden": "true" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__check", children: /* @__PURE__ */ jsxRuntime.jsx(
                Checkbox.default,
                {
                  isChecked: globalAggregate === "all",
                  isIndeterminate: globalAggregate === "some",
                  isDisabled: isDisabled || enabledIds.length === 0,
                  tabIndex: -1,
                  "aria-hidden": "true",
                  onChange: () => {
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list__sa__lbl", children: globalSelectAllLabel })
            ]
          }
        ),
        normalizedGroups.map((group, groupIndex) => {
          const isLastGroup = groupIndex === normalizedGroups.length - 1;
          const isFirstGroup = groupIndex === 0;
          const groupEnabledIds = group.items.filter((i) => !i.isDisabled).map((i) => i.id);
          const groupAggregate = core.aggregateSelectionState(
            resolvedSelectedArray,
            groupEnabledIds
          );
          const showGroupSelectAll = group.hasSelectAll === true && selectionMode === "multi";
          return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-list__group", "data-arvo-list-group-id": group.id, children: [
            !isFirstGroup && hasGroupDividers && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-list__divider", role: "presentation", "aria-hidden": "true" }),
            group.label && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-list__group-hdr", role: "presentation", children: group.label }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-list__group-body", children: [
              showGroupSelectAll && /* @__PURE__ */ jsxRuntime.jsxs(
                "div",
                {
                  className: "arvo-list__sa",
                  role: "option",
                  "aria-checked": groupAggregate === "all" ? true : groupAggregate === "some" ? "mixed" : false,
                  tabIndex: -1,
                  onClick: () => handleGroupSelectAllToggle(group.id),
                  onKeyDown: (e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      handleGroupSelectAllToggle(group.id);
                    }
                  },
                  children: [
                    isReorderable && /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: "arvo-list-item__drag-spacer",
                        "aria-hidden": "true"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__check", children: /* @__PURE__ */ jsxRuntime.jsx(
                      Checkbox.default,
                      {
                        isChecked: groupAggregate === "all",
                        isIndeterminate: groupAggregate === "some",
                        isDisabled: isDisabled || groupEnabledIds.length === 0,
                        tabIndex: -1,
                        "aria-hidden": "true",
                        onChange: () => {
                        }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list__sa__lbl", children: globalSelectAllLabel })
                  ]
                }
              ),
              group.items.map((item) => {
                const itemIsChecked = item.isChecked ?? (selectionMode === "multi" || selectionMode === "single" ? resolvedSelectedArray.includes(item.id) : false);
                const itemIsExcluded = item.isExcluded ?? resolvedExcludedArray.includes(item.id);
                const isItemTabStop = item.id === tabStopId;
                const itemDisabled = isDisabled || item.isDisabled;
                const itemMatchFragment = item.matchFragment ?? searchQuery;
                const itemIsSearchMatch = item.isSearchMatch ?? (searchQuery ? item.label.toLowerCase().includes(searchQuery.toLowerCase()) : false);
                const itemHasDragHandle = isReorderable && (item.isReorderable ?? true) && !itemDisabled;
                const itemHasDragSpacer = isReorderable && !itemHasDragHandle;
                return /* @__PURE__ */ jsxRuntime.jsx(
                  ListItem.ArvoListItem,
                  {
                    ref: (el) => {
                      if (el) itemRefs.current.set(item.id, el);
                      else itemRefs.current.delete(item.id);
                    },
                    ...item,
                    isChecked: itemIsChecked,
                    isExcluded: itemIsExcluded,
                    isDisabled: itemDisabled,
                    isReorderable: itemHasDragHandle,
                    isLoading: isLoading || item.isLoading,
                    isSearchMatch: itemIsSearchMatch,
                    matchFragment: itemMatchFragment,
                    hasDragSpacer: itemHasDragSpacer,
                    variant,
                    selectionMode,
                    actionsVisibility,
                    isFocused: item.id === activeId && item.id !== tabStopId,
                    tabIndex: isItemTabStop ? 0 : -1,
                    onClick: handleRowClick(item),
                    onActivate: handleRowActivate(item),
                    onContextMenuRequest: handleRowContextMenu(item)
                  },
                  item.id
                );
              })
            ] }),
            isLastGroup ? null : null
          ] }, group.id);
        })
      ]
    }
  );
});
exports.ArvoList = ArvoList;
exports.LIST_MAX_ROW_ACTIONS = LIST_MAX_ROW_ACTIONS;
exports.default = ArvoList;
//# sourceMappingURL=index63.cjs.map
