"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const IconButton = require("./index17.cjs");
const Checkbox = require("./index23.cjs");
const Badge = require("./index45.cjs");
const EmptyState = require("./index88.cjs");
const Loader = require("./index15.cjs");
const ActionMenu = require("./index49.cjs");
const useControllableState = require("./index90.cjs");
const useTreeNavigation = require("./index94.cjs");
function hasChildrenShape(item) {
  return item.children !== void 0;
}
function buildVisibleRows(items, expandedSet) {
  const rows = [];
  function walk(nodes, level, ancestorIsLastFlags, parentId) {
    const setSize = nodes.length;
    nodes.forEach((node, idx) => {
      const isLastChild = idx === nodes.length - 1;
      const hasChildren = hasChildrenShape(node);
      const isExpanded = hasChildren && expandedSet.has(node.id);
      rows.push({
        item: node,
        level,
        ancestorIsLastFlags,
        isLastChild,
        hasChildren,
        isExpanded,
        parentId,
        setSize,
        posInSet: idx + 1
      });
      if (hasChildren && isExpanded && Array.isArray(node.children) && node.children.length > 0) {
        walk(
          node.children,
          level + 1,
          [...ancestorIsLastFlags, isLastChild],
          node.id
        );
      }
    });
  }
  walk(items, 0, [], null);
  return rows;
}
function findItemById(items, id) {
  for (const item of items) {
    if (item.id === id) return item;
    if (Array.isArray(item.children)) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
function findItemLocation(items, id) {
  function walk(siblings, parent) {
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].id === id) {
        return { parent, parentChildren: siblings, index: i };
      }
      if (Array.isArray(siblings[i].children)) {
        const found = walk(siblings[i].children, siblings[i]);
        if (found) return found;
      }
    }
    return null;
  }
  return walk(items, null);
}
function isItemSelectable(item) {
  return item.isSelectable !== false;
}
function variantToModes(variant) {
  switch (variant) {
    case "expandOnly":
      return { selectionMode: "single", rowInteraction: "expand" };
    case "singleSelect":
      return { selectionMode: "single", rowInteraction: "select" };
    case "multiSelect":
      return { selectionMode: "multiple", rowInteraction: "expand" };
    case "navigation":
      return { selectionMode: "single", rowInteraction: "navigate" };
    case "navigationMultiSelect":
      return { selectionMode: "multiple", rowInteraction: "navigate" };
  }
}
function collectEligibleDescendantIds(item) {
  const ids = [];
  function walk(node) {
    if (!Array.isArray(node.children)) return;
    for (const child of node.children) {
      if (child.isDisabled) continue;
      if (isItemSelectable(child)) ids.push(child.id);
      walk(child);
    }
  }
  walk(item);
  return ids;
}
function computeMultiAriaChecked(item, isRowSelected, selectedSet) {
  if (!Array.isArray(item.children) || item.children.length === 0) {
    return isRowSelected;
  }
  const descendants = collectEligibleDescendantIds(item);
  if (descendants.length === 0) return isRowSelected;
  let selectedCount = 0;
  for (const id of descendants) {
    if (selectedSet.has(id)) selectedCount += 1;
  }
  if (selectedCount === 0) return false;
  if (selectedCount === descendants.length) return true;
  return "mixed";
}
function formatBadge(b) {
  if (b == null) return null;
  if (typeof b === "string" || typeof b === "number") {
    return { variant: "counter", counterMode: "single", count: Number(b) };
  }
  return b;
}
function normalizeMeta(meta) {
  if (meta == null) return null;
  if (typeof meta === "string") {
    return meta.length > 0 ? { icon: null, text: meta } : null;
  }
  const icon = typeof meta.icon === "string" && meta.icon.length > 0 ? meta.icon : null;
  const text = typeof meta.text === "string" && meta.text.length > 0 ? meta.text : null;
  if (icon == null && text == null) return null;
  return { icon, text };
}
function labelMatchesQuery(label, query) {
  if (!query) return false;
  return label.toLowerCase().includes(query.toLowerCase());
}
function buildMatchParts(label, query) {
  if (!query) return [{ text: label, isMatch: false }];
  const haystack = label.toLowerCase();
  const needle = query.toLowerCase();
  const parts = [];
  let i = 0;
  while (i < label.length) {
    const idx = haystack.indexOf(needle, i);
    if (idx === -1) {
      parts.push({ text: label.slice(i), isMatch: false });
      break;
    }
    if (idx > i) parts.push({ text: label.slice(i, idx), isMatch: false });
    parts.push({
      text: label.slice(idx, idx + needle.length),
      isMatch: true
    });
    i = idx + needle.length;
  }
  return parts;
}
function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}
const ArvoTreeView = React.forwardRef(
  function ArvoTreeView2(props, ref) {
    const {
      items,
      variant = "expandOnly",
      size = "sm",
      appearance = "default",
      hasHierarchyLines = false,
      selectedIds: selectedIdsProp,
      defaultSelectedIds = [],
      expandedIds: expandedIdsProp,
      defaultExpandedIds = [],
      searchQuery = "",
      onLoadChildren,
      isDisabled = false,
      isLoading = false,
      emptyConfig,
      ariaLabel,
      ariaLabelledBy,
      onSelectionChange,
      onExpandedChange,
      onNavigate,
      className,
      style,
      id: idProp,
      actions: actionsProp,
      actionsVisibility = "hover",
      maxVisualLevel = 4,
      isReorderable = false,
      onReorder,
      canMoveItem,
      contextMenu,
      onContextMenu,
      isReadOnly = false
    } = props;
    const { selectionMode, rowInteraction } = React.useMemo(
      () => variantToModes(variant),
      [variant]
    );
    const uid = React.useId();
    const treeId = idProp ?? `arvo-tree-${uid}`;
    const rowId = React.useCallback(
      (itemId) => `${treeId}-row-${itemId}`,
      [treeId]
    );
    const [selectedIds, setSelectedIds] = useControllableState.useControllableState(
      selectedIdsProp,
      defaultSelectedIds
    );
    const [expandedIds, setExpandedIds] = useControllableState.useControllableState(
      expandedIdsProp,
      defaultExpandedIds
    );
    const [asyncLoadingIds, setAsyncLoadingIds] = React.useState(
      () => /* @__PURE__ */ new Set()
    );
    const prevVisibleRef = React.useRef(null);
    const prevItemsRef = React.useRef(items);
    const [reorderingId, setReorderingId] = React.useState(null);
    const [liveMessage, setLiveMessage] = React.useState("");
    const [contextItemId, setContextItemId] = React.useState(null);
    const contextRowRef = React.useRef(null);
    const contextMenuRef = React.useRef(null);
    const contextItem = React.useMemo(() => {
      if (!contextItemId) return null;
      return findItemById(items, contextItemId);
    }, [contextItemId, items]);
    const resolvedContextItems = React.useMemo(() => {
      if (!contextMenu || !contextItem) return [];
      return typeof contextMenu === "function" ? contextMenu(contextItem) : contextMenu;
    }, [contextMenu, contextItem]);
    const openContextMenu = React.useCallback(
      (item, rowEl, trigger) => {
        if (!contextMenu || item.isDisabled || isDisabled || isReadOnly) return;
        contextRowRef.current = rowEl;
        setContextItemId(item.id);
        onContextMenu == null ? void 0 : onContextMenu(item, trigger);
        requestAnimationFrame(() => {
          var _a;
          (_a = contextMenuRef.current) == null ? void 0 : _a.open();
        });
      },
      [contextMenu, isDisabled, isReadOnly, onContextMenu]
    );
    const handleContextMenuClose = React.useCallback(() => {
      const rowEl = contextRowRef.current;
      setContextItemId(null);
      if (rowEl) rowEl.focus();
    }, []);
    const expandedSet = React.useMemo(() => new Set(expandedIds), [expandedIds]);
    const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
    const visibleRows = React.useMemo(
      () => buildVisibleRows(items, expandedSet),
      [items, expandedSet]
    );
    const navRows = React.useMemo(
      () => visibleRows.map((r) => ({
        id: r.item.id,
        label: r.item.label,
        level: r.level,
        hasChildren: r.hasChildren,
        isExpanded: r.isExpanded,
        isDisabled: !!r.item.isDisabled || !!isDisabled
      })),
      [visibleRows, isDisabled]
    );
    const containerRef = React.useRef(null);
    const dispatchCancellable = React.useCallback(
      (name, detail) => {
        const el = containerRef.current;
        if (!el) return true;
        const ev = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail
        });
        return el.dispatchEvent(ev);
      },
      []
    );
    const setForwardedRef = React.useCallback(
      (node) => {
        containerRef.current = node;
      },
      []
    );
    const focusRow = React.useCallback(
      (itemId) => {
        var _a;
        const el = (_a = containerRef.current) == null ? void 0 : _a.querySelector(
          `#${CSS.escape(rowId(itemId))}`
        );
        el == null ? void 0 : el.focus();
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ block: "nearest" });
        }
      },
      [rowId]
    );
    const toggleSelection = React.useCallback(
      (item) => {
        if (isDisabled || item.isDisabled) return;
        if (!isItemSelectable(item)) return;
        let next;
        const isCurrentlySelected = selectedSet.has(item.id);
        if (selectionMode === "single") {
          next = isCurrentlySelected ? [] : [item.id];
        } else {
          const newSet = new Set(selectedSet);
          const targets = [item.id, ...collectEligibleDescendantIds(item)];
          if (isCurrentlySelected) {
            for (const t of targets) newSet.delete(t);
          } else {
            for (const t of targets) newSet.add(t);
          }
          next = Array.from(newSet);
        }
        const proceed = dispatchCancellable("tree:select", {
          ids: next,
          item,
          isSelected: !isCurrentlySelected
        });
        if (!proceed) return;
        setSelectedIds(next);
        onSelectionChange == null ? void 0 : onSelectionChange(next, {
          item,
          isSelected: !isCurrentlySelected
        });
      },
      [
        dispatchCancellable,
        isDisabled,
        onSelectionChange,
        selectedSet,
        selectionMode,
        setSelectedIds
      ]
    );
    const setExpansion = React.useCallback(
      (item, willExpand) => {
        if (isDisabled || item.isDisabled || !hasChildrenShape(item)) return;
        const newSet = new Set(expandedSet);
        if (willExpand) newSet.add(item.id);
        else newSet.delete(item.id);
        const next = Array.from(newSet);
        const proceed = dispatchCancellable("tree:expand", {
          ids: next,
          item,
          isExpanded: willExpand
        });
        if (!proceed) return;
        setExpandedIds(next);
        onExpandedChange == null ? void 0 : onExpandedChange(next, { item, isExpanded: willExpand });
        if (willExpand && item.children === null && onLoadChildren && !asyncLoadingIds.has(item.id)) {
          const proceedLoad = dispatchCancellable("tree:loadchildren", { item });
          if (!proceedLoad) {
            setExpandedIds(Array.from(expandedSet));
            return;
          }
          setAsyncLoadingIds((prev) => {
            const s = new Set(prev);
            s.add(item.id);
            return s;
          });
          Promise.resolve(onLoadChildren(item)).catch(() => {
          }).finally(() => {
            setAsyncLoadingIds((prev) => {
              const s = new Set(prev);
              s.delete(item.id);
              return s;
            });
          });
        }
      },
      [
        asyncLoadingIds,
        dispatchCancellable,
        expandedSet,
        isDisabled,
        onExpandedChange,
        onLoadChildren,
        setExpandedIds
      ]
    );
    const { activeIndex, setActiveIndex, handleKeyDown } = useTreeNavigation.useTreeNavigation({
      rows: navRows,
      onSelect(row) {
        const item = findItemById(items, row.id);
        if (!item) return;
        if (!isItemSelectable(item)) return;
        if (selectionMode === "multiple" || rowInteraction === "select") {
          toggleSelection(item);
        }
      },
      onExpand(row) {
        const item = findItemById(items, row.id);
        if (item) setExpansion(item, true);
      },
      onCollapse(row) {
        const item = findItemById(items, row.id);
        if (item) setExpansion(item, false);
      },
      enabled: !isDisabled && !isLoading
    });
    React.useEffect(() => {
      const treeEl = containerRef.current;
      if (!treeEl) return;
      if (!treeEl.contains(document.activeElement)) return;
      const row = navRows[activeIndex];
      if (row) focusRow(row.id);
    }, [activeIndex, focusRow, navRows]);
    React.useEffect(() => {
      const treeEl = containerRef.current;
      if (!treeEl) return;
      const prev = prevVisibleRef.current;
      const currentRow = visibleRows[activeIndex];
      if (currentRow) {
        prevVisibleRef.current = {
          id: currentRow.item.id,
          parentId: currentRow.parentId,
          index: activeIndex
        };
      }
      if (!prev) return;
      if (!treeEl.contains(document.activeElement)) return;
      const stillVisible = visibleRows.some((r) => r.item.id === prev.id);
      if (stillVisible) return;
      const sameParentRows = visibleRows.filter((r) => r.parentId === prev.parentId);
      if (sameParentRows.length > 0) {
        const targetSibling = sameParentRows[Math.min(prev.index, sameParentRows.length - 1)] ?? sameParentRows[sameParentRows.length - 1];
        if (targetSibling) {
          const next = visibleRows.findIndex((r) => r.item.id === targetSibling.item.id);
          if (next !== -1) {
            setActiveIndex(next);
            return;
          }
        }
      }
      if (prev.parentId) {
        const parentIdx = visibleRows.findIndex((r) => r.item.id === prev.parentId);
        if (parentIdx !== -1) {
          setActiveIndex(parentIdx);
          return;
        }
      }
      const firstEnabled = visibleRows.findIndex(
        (r) => !r.item.isDisabled && !isDisabled
      );
      if (firstEnabled !== -1) {
        setActiveIndex(firstEnabled);
      }
    }, [activeIndex, isDisabled, setActiveIndex, visibleRows]);
    React.useEffect(() => {
      const prevItems = prevItemsRef.current;
      prevItemsRef.current = items;
      if (selectionMode !== "multiple") return;
      if (selectedSet.size === 0) return;
      const additions = [];
      function walk(nodes) {
        for (const node of nodes) {
          if (selectedSet.has(node.id) && Array.isArray(node.children) && node.children.length > 0) {
            const prevNode = findItemById(prevItems, node.id);
            const prevEligible = prevNode ? new Set(collectEligibleDescendantIds(prevNode)) : /* @__PURE__ */ new Set();
            const wasFullySelected = prevNode == null || Array.from(prevEligible).every((id) => selectedSet.has(id));
            if (!wasFullySelected) {
              walk(node.children);
              continue;
            }
            const nowEligible = collectEligibleDescendantIds(node);
            for (const id of nowEligible) {
              if (!prevEligible.has(id) && !selectedSet.has(id)) {
                additions.push(id);
              }
            }
          }
          if (Array.isArray(node.children)) {
            walk(node.children);
          }
        }
      }
      walk(items);
      if (additions.length === 0) return;
      const next = Array.from(/* @__PURE__ */ new Set([...selectedSet, ...additions]));
      setSelectedIds(next);
      onSelectionChange == null ? void 0 : onSelectionChange(next, {
        item: items[0],
        isSelected: true
      });
    }, [items, onSelectionChange, selectedSet, selectionMode, setSelectedIds]);
    const handleRowClick = React.useCallback(
      (item, index) => (event) => {
        if (isDisabled || item.isDisabled || isLoading) return;
        const target = event.target;
        if (target.closest("[data-tree-stop]")) return;
        setActiveIndex(index);
        if (rowInteraction === "navigate") {
          onNavigate == null ? void 0 : onNavigate(item, event);
          return;
        }
        const effectiveInteraction = rowInteraction === "select" && !isItemSelectable(item) ? "expand" : rowInteraction;
        if (effectiveInteraction === "expand") {
          if (hasChildrenShape(item)) {
            setExpansion(item, !expandedSet.has(item.id));
          }
          return;
        }
        toggleSelection(item);
      },
      [
        expandedSet,
        isDisabled,
        isLoading,
        onNavigate,
        rowInteraction,
        setActiveIndex,
        setExpansion,
        toggleSelection
      ]
    );
    const handleChevronClick = React.useCallback(
      (item) => (event) => {
        event.stopPropagation();
        setExpansion(item, !expandedSet.has(item.id));
      },
      [expandedSet, setExpansion]
    );
    const handleCheckboxChange = React.useCallback(
      (item) => () => {
        toggleSelection(item);
      },
      [toggleSelection]
    );
    const announce = React.useCallback((msg) => {
      setLiveMessage(msg);
    }, []);
    const enterReorderMode = React.useCallback(
      (item) => {
        if (!isReorderable || item.isDisabled || isDisabled) return;
        setReorderingId(item.id);
        announce(`Picked up ${item.label}. Use Up and Down to move, Enter to drop, Escape to cancel.`);
      },
      [announce, isDisabled, isReorderable]
    );
    const cancelReorderMode = React.useCallback(() => {
      if (reorderingId == null) return;
      setReorderingId(null);
      announce("Move cancelled.");
    }, [announce, reorderingId]);
    const commitReorderMove = React.useCallback(
      (item, from, toParentChildren, toIndex, toParent, position = "before") => {
        var _a;
        const ctx = {
          item,
          fromParentId: ((_a = from.parent) == null ? void 0 : _a.id) ?? null,
          fromIndex: from.index,
          toParentId: (toParent == null ? void 0 : toParent.id) ?? null,
          toIndex,
          position
        };
        if (canMoveItem && canMoveItem(ctx) === false) {
          announce("Move not allowed.");
          return;
        }
        const proceed = dispatchCancellable(
          "tree:reorder",
          ctx
        );
        if (!proceed) return;
        const result = onReorder == null ? void 0 : onReorder(ctx);
        if (result === false) return;
        announce(
          `Moved ${item.label} to position ${toIndex + 1} of ${toParentChildren.length}.`
        );
      },
      [announce, canMoveItem, dispatchCancellable, onReorder]
    );
    const moveReorderingRow = React.useCallback(
      (direction) => {
        if (reorderingId == null) return;
        const loc = findItemLocation(items, reorderingId);
        if (!loc) return;
        const targetIndex = loc.index + direction;
        if (targetIndex < 0 || targetIndex >= loc.parentChildren.length) return;
        const item = loc.parentChildren[loc.index];
        commitReorderMove(
          item,
          loc,
          loc.parentChildren,
          targetIndex,
          loc.parent,
          direction === 1 ? "after" : "before"
        );
      },
      [commitReorderMove, items, reorderingId]
    );
    React.useImperativeHandle(
      ref,
      () => ({
        selected(ids) {
          if (ids === void 0) {
            return [...selectedIds];
          }
          setSelectedIds(ids);
          return void 0;
        },
        expanded(ids) {
          if (ids === void 0) {
            return [...expandedIds];
          }
          setExpandedIds(ids);
          return void 0;
        },
        move(id, target) {
          const from = findItemLocation(items, id);
          if (!from) return;
          const movingItem = from.parentChildren[from.index];
          let toParent = null;
          let toParentChildren;
          if (target.parentId == null) {
            toParentChildren = items;
          } else {
            const tp = findItemById(items, target.parentId);
            if (!tp || !Array.isArray(tp.children)) return;
            toParent = tp;
            toParentChildren = tp.children;
          }
          commitReorderMove(
            movingItem,
            from,
            toParentChildren,
            target.index,
            toParent,
            target.position ?? "before"
          );
        },
        focusItem(id) {
          focusRow(id);
        }
      }),
      [
        selectedIds,
        expandedIds,
        setSelectedIds,
        setExpandedIds,
        items,
        commitReorderMove,
        focusRow
      ]
    );
    const handleContainerKeyDown = React.useCallback(
      (event) => {
        var _a, _b, _c;
        if (isDisabled || isLoading) return;
        const focusedEl = document.activeElement;
        const focusedRowEl = (focusedEl == null ? void 0 : focusedEl.closest('[role="treeitem"]')) ?? null;
        const isFocusOnRow = focusedEl != null && focusedEl === focusedRowEl;
        const isFocusInActions = (focusedEl == null ? void 0 : focusedEl.closest(".arvo-tree__actions")) != null;
        if (isFocusOnRow && event.key === "Tab" && !event.shiftKey) {
          const actionsEl = focusedRowEl == null ? void 0 : focusedRowEl.querySelector(
            ".arvo-tree__actions"
          );
          const firstAction = actionsEl == null ? void 0 : actionsEl.querySelector(
            "button:not([disabled])"
          );
          if (firstAction) {
            event.preventDefault();
            firstAction.focus();
            return;
          }
        }
        if (isFocusInActions) {
          if (event.key === "Escape" || event.key === "Tab" && event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            focusedRowEl == null ? void 0 : focusedRowEl.focus();
            return;
          }
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            const actionsEl = focusedRowEl == null ? void 0 : focusedRowEl.querySelector(
              ".arvo-tree__actions"
            );
            const actionButtons = actionsEl ? Array.from(
              actionsEl.querySelectorAll(
                "button:not([disabled])"
              )
            ) : [];
            const currentIdx = actionButtons.findIndex(
              (btn) => btn === focusedEl
            );
            if (currentIdx !== -1) {
              event.preventDefault();
              const direction = event.key === "ArrowRight" ? 1 : -1;
              const nextIdx = (currentIdx + direction + actionButtons.length) % actionButtons.length;
              (_a = actionButtons[nextIdx]) == null ? void 0 : _a.focus();
              return;
            }
          }
          if (event.key === "Tab" && !event.shiftKey) {
            const actionsEl = focusedRowEl == null ? void 0 : focusedRowEl.querySelector(
              ".arvo-tree__actions"
            );
            const actionButtons = actionsEl ? Array.from(
              actionsEl.querySelectorAll(
                "button:not([disabled])"
              )
            ) : [];
            const currentIdx = actionButtons.findIndex(
              (btn) => btn === focusedEl
            );
            if (currentIdx !== -1 && currentIdx === actionButtons.length - 1) {
              return;
            }
            if (currentIdx !== -1 && currentIdx < actionButtons.length - 1) {
              event.preventDefault();
              (_b = actionButtons[currentIdx + 1]) == null ? void 0 : _b.focus();
              return;
            }
          }
          return;
        }
        const isContextMenuKey = event.key === "ContextMenu" || event.key === "F10" && event.shiftKey && !event.ctrlKey && !event.altKey || event.key.toLowerCase() === "x" && event.shiftKey && event.ctrlKey && !event.altKey;
        if (isContextMenuKey && contextMenu && focusedRowEl) {
          const itemId = (_c = focusedRowEl.id.match(/-row-(.+)$/)) == null ? void 0 : _c[1];
          const focusItem = itemId ? findItemById(items, itemId) : null;
          if (focusItem && !focusItem.isDisabled) {
            event.preventDefault();
            openContextMenu(focusItem, focusedRowEl, "keyboard");
            return;
          }
        }
        if (event.key === "*") {
          const focusRow2 = visibleRows[activeIndex];
          if (focusRow2) {
            const targetLevel = focusRow2.level;
            event.preventDefault();
            const newSet = new Set(expandedSet);
            for (const r of visibleRows) {
              if (r.level === targetLevel && r.hasChildren && !r.isExpanded && !r.item.isDisabled) {
                newSet.add(r.item.id);
              }
            }
            if (newSet.size !== expandedSet.size) {
              setExpandedIds(Array.from(newSet));
            }
            return;
          }
        }
        if (event.key === "Enter") {
          const row = visibleRows[activeIndex];
          if (row && !row.item.isDisabled) {
            if (rowInteraction === "navigate") {
              event.preventDefault();
              onNavigate == null ? void 0 : onNavigate(row.item, event);
              return;
            }
            const effectiveInteraction = rowInteraction === "select" && !isItemSelectable(row.item) ? "expand" : rowInteraction;
            if (effectiveInteraction === "expand") {
              event.preventDefault();
              if (row.hasChildren) {
                setExpansion(row.item, !expandedSet.has(row.item.id));
              }
              return;
            }
          }
        }
        if (reorderingId != null) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveReorderingRow(1);
            return;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveReorderingRow(-1);
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const item = findItemById(items, reorderingId);
            if (item) announce(`${item.label} dropped.`);
            setReorderingId(null);
            return;
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancelReorderMode();
            return;
          }
          return;
        }
        handleKeyDown(event);
      },
      [
        activeIndex,
        announce,
        cancelReorderMode,
        contextMenu,
        expandedSet,
        handleKeyDown,
        isDisabled,
        isLoading,
        items,
        moveReorderingRow,
        onNavigate,
        openContextMenu,
        reorderingId,
        rowId,
        rowInteraction,
        setExpandedIds,
        setExpansion,
        visibleRows
      ]
    );
    const handleDragHandleClick = React.useCallback(
      (item) => (event) => {
        var _a;
        event.stopPropagation();
        if (reorderingId === item.id) {
          announce(`${item.label} dropped.`);
          setReorderingId(null);
        } else if (reorderingId != null) {
          const dragged = findItemById(items, reorderingId);
          const target = findItemLocation(items, item.id);
          const draggedLoc = findItemLocation(items, reorderingId);
          if (dragged && target && draggedLoc) {
            const targetRow = (_a = event.currentTarget) == null ? void 0 : _a.closest('[role="treeitem"]');
            const rect = targetRow == null ? void 0 : targetRow.getBoundingClientRect();
            let position = "after";
            let toParentChildren = target.parentChildren;
            let toIndex = target.index + 1;
            let toParent = target.parent;
            if (rect) {
              const localY = event.clientY - rect.top;
              const third = rect.height / 3;
              const targetItem = target.parentChildren[target.index];
              const targetIsParent = Array.isArray(targetItem.children) && targetItem.children;
              if (localY < third) {
                position = "before";
                toIndex = target.index;
              } else if (localY > rect.height - third) {
                position = "after";
                toIndex = target.index + 1;
              } else if (targetIsParent) {
                position = "inside";
                toParentChildren = targetItem.children;
                toIndex = toParentChildren.length;
                toParent = targetItem;
              } else {
                position = "after";
                toIndex = target.index + 1;
              }
            }
            commitReorderMove(
              dragged,
              draggedLoc,
              toParentChildren,
              toIndex,
              toParent,
              position
            );
          }
          setReorderingId(null);
        } else {
          enterReorderMode(item);
        }
      },
      [announce, commitReorderMove, enterReorderMode, items, reorderingId]
    );
    if (isLoading) {
      const rowCount = 5;
      return /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: setForwardedRef,
          className: classNames(
            "arvo-tree",
            `arvo-tree--${size}`,
            // Keep variant + selection-mode + appearance + actions-on-
            // hover modifiers and `is-disabled` even while loading so
            // the skeleton-state root presents the same modifier
            // surface as the JS twin (TreeView.ts:425-451).
            `arvo-tree--${variant}`,
            selectionMode === "multiple" && "arvo-tree--multiple",
            appearance === "strong" && "arvo-tree--strong",
            hasHierarchyLines && "arvo-tree--lines",
            isReadOnly && "arvo-tree--readonly",
            isDisabled && "is-disabled",
            actionsVisibility === "hover" && "arvo-tree--actions-on-hover",
            "loading",
            className
          ),
          role: "tree",
          id: treeId,
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy,
          "aria-multiselectable": selectionMode === "multiple" ? true : void 0,
          "aria-busy": "true",
          "aria-disabled": isDisabled || void 0,
          "aria-readonly": isReadOnly || void 0,
          style,
          children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-tree__skeleton", children: Array.from({ length: rowCount }, (_, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-tree__skeleton-row", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__skeleton-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__skeleton-text", "aria-hidden": "true" })
          ] }, i)) })
        }
      );
    }
    if (items.length === 0) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: setForwardedRef,
          className: classNames(
            "arvo-tree",
            `arvo-tree--${size}`,
            // Same modifier-surface parity as the loading branch above.
            `arvo-tree--${variant}`,
            selectionMode === "multiple" && "arvo-tree--multiple",
            appearance === "strong" && "arvo-tree--strong",
            hasHierarchyLines && "arvo-tree--lines",
            isReadOnly && "arvo-tree--readonly",
            isDisabled && "is-disabled",
            actionsVisibility === "hover" && "arvo-tree--actions-on-hover",
            className
          ),
          role: "tree",
          id: treeId,
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy,
          "aria-multiselectable": selectionMode === "multiple" ? true : void 0,
          "aria-disabled": isDisabled || void 0,
          "aria-readonly": isReadOnly || void 0,
          style,
          children: /* @__PURE__ */ jsxRuntime.jsx(
            EmptyState.default,
            {
              illustration: (emptyConfig == null ? void 0 : emptyConfig.illustration) ?? "no-data",
              title: emptyConfig == null ? void 0 : emptyConfig.title,
              message: (emptyConfig == null ? void 0 : emptyConfig.message) ?? "No Items Available",
              size: "sm",
              orientation: "vertical"
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: setForwardedRef,
        className: classNames(
          "arvo-tree",
          `arvo-tree--${size}`,
          `arvo-tree--${variant}`,
          selectionMode === "multiple" && "arvo-tree--multiple",
          appearance === "strong" && "arvo-tree--strong",
          hasHierarchyLines && "arvo-tree--lines",
          isReadOnly && "arvo-tree--readonly",
          isDisabled && "is-disabled",
          actionsVisibility === "hover" && "arvo-tree--actions-on-hover",
          className
        ),
        role: "tree",
        id: treeId,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-multiselectable": selectionMode === "multiple" ? true : void 0,
        "aria-disabled": isDisabled || void 0,
        "aria-readonly": isReadOnly || void 0,
        style,
        onKeyDown: handleContainerKeyDown,
        children: [
          isReorderable && /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: "arvo-tree__live",
              "aria-live": "polite",
              "aria-atomic": "true",
              children: liveMessage
            }
          ),
          contextMenu && resolvedContextItems.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(
            ActionMenu.ArvoActionMenu,
            {
              ref: contextMenuRef,
              triggerRef: contextRowRef,
              items: resolvedContextItems,
              placement: "bottom-start",
              onOpenChange: (open) => {
                if (!open) handleContextMenuClose();
              }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-tree__group", role: "group", children: visibleRows.map((row, index) => {
            const isAsync = asyncLoadingIds.has(row.item.id) || !!row.item.isAsyncLoading;
            const isEmptyParent = row.isExpanded && Array.isArray(row.item.children) && row.item.children.length === 0 && !isAsync;
            const isRowDisabled = !!row.item.isDisabled || !!isDisabled;
            const rowSelectable = isItemSelectable(row.item);
            const isRowSelected = rowSelectable && selectedSet.has(row.item.id);
            const isRowFocused = activeIndex === index;
            const ariaSelected = rowInteraction === "select" && rowSelectable && !isRowDisabled ? isRowSelected : void 0;
            const ariaChecked = selectionMode === "multiple" && rowSelectable ? computeMultiAriaChecked(row.item, isRowSelected, selectedSet) : void 0;
            const ariaExpanded = row.hasChildren ? row.isExpanded : void 0;
            const hasSearchMatch = row.item.isSearchMatch !== void 0 ? row.item.isSearchMatch : labelMatchesQuery(row.item.label, searchQuery);
            return /* @__PURE__ */ jsxRuntime.jsx(
              TreeRow,
              {
                row,
                index,
                rowId: rowId(row.item.id),
                size,
                searchQuery,
                hasSearchMatch,
                isFocused: isRowFocused,
                isSelected: isRowSelected,
                isAsync,
                isEmptyParent,
                selectionMode,
                rowInteraction,
                isRowDisabled,
                rowSelectable,
                ariaSelected,
                ariaChecked,
                ariaExpanded,
                emptyMessage: (emptyConfig == null ? void 0 : emptyConfig.message) ?? "No Items Available",
                emptyIllustration: (emptyConfig == null ? void 0 : emptyConfig.illustration) ?? "no-data",
                isReorderable: isReorderable && row.item.hasDragHandle !== false && !isReadOnly,
                isReordering: reorderingId === row.item.id,
                rowActions: isReadOnly ? null : row.item.actions ?? actionsProp ?? null,
                maxVisualLevel,
                onClick: handleRowClick(row.item, index),
                onChevronClick: handleChevronClick(row.item),
                onCheckboxChange: handleCheckboxChange(row.item),
                onRowFocus: () => setActiveIndex(index),
                onDragHandleClick: handleDragHandleClick(row.item),
                hasContextMenu: !!contextMenu && !isReadOnly,
                onRowContextMenu: contextMenu && !isReadOnly ? (event) => {
                  event.preventDefault();
                  const rowEl = event.currentTarget;
                  openContextMenu(row.item, rowEl, "mouse");
                } : void 0,
                onOverflowClick: contextMenu && row.item.hasOverflowMenu && !isReadOnly ? (event) => {
                  var _a;
                  event.stopPropagation();
                  const rowEl = ((_a = event.currentTarget) == null ? void 0 : _a.closest(
                    '[role="treeitem"]'
                  )) ?? null;
                  if (rowEl) openContextMenu(row.item, rowEl, "overflow");
                } : void 0
              },
              row.item.id
            );
          }) })
        ]
      }
    );
  }
);
function TreeRowInner(props) {
  const {
    row,
    rowId,
    selectionMode,
    rowInteraction,
    isRowDisabled,
    rowSelectable,
    isFocused,
    isSelected,
    isAsync,
    isEmptyParent,
    ariaSelected,
    ariaChecked,
    ariaExpanded,
    searchQuery,
    hasSearchMatch,
    emptyMessage,
    emptyIllustration,
    isReorderable,
    isReordering,
    rowActions,
    maxVisualLevel,
    onClick,
    onChevronClick,
    onCheckboxChange,
    onRowFocus,
    onDragHandleClick,
    onRowContextMenu,
    onOverflowClick
  } = props;
  const item = row.item;
  const isActive = !!item.isActive;
  const isStrongRow = item.appearance === "strong";
  const itemClass = classNames(
    "arvo-tree__item",
    isSelected && "selected",
    isActive && "arvo-tree__item--active",
    isRowDisabled && "is-disabled",
    item.isLoading && "loading",
    item.isEmphasized && "arvo-tree__item--emphasized",
    isStrongRow && "arvo-tree__item--strong",
    item.isHighlighted && "arvo-tree__item--highlighted",
    hasSearchMatch && "arvo-tree__item--search-highlight",
    row.isExpanded && "arvo-tree__item--expanded",
    isAsync && "arvo-tree__item--async-loading",
    isEmptyParent && "arvo-tree__item--empty",
    isReordering && "is-grab-active"
  );
  const labelParts = React.useMemo(
    () => buildMatchParts(item.label, searchQuery),
    [item.label, searchQuery]
  );
  const badge = formatBadge(item.badge);
  const meta = normalizeMeta(item.meta);
  const visualLevel = Math.min(row.level, maxVisualLevel - 1);
  const resolvedAriaCurrent = item.ariaCurrent != null ? item.ariaCurrent : isActive ? rowInteraction === "navigate" ? "page" : "true" : void 0;
  const rowEl = /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      id: rowId,
      className: itemClass,
      role: "treeitem",
      tabIndex: isFocused ? 0 : -1,
      "aria-level": row.level + 1,
      "aria-setsize": row.setSize,
      "aria-posinset": row.posInSet,
      "aria-expanded": ariaExpanded,
      "aria-selected": ariaSelected,
      "aria-checked": ariaChecked,
      "aria-disabled": isRowDisabled || void 0,
      "aria-busy": isAsync || item.isLoading || void 0,
      "aria-current": resolvedAriaCurrent || void 0,
      "aria-label": item.ariaLabel,
      onClick,
      onFocus: onRowFocus,
      onContextMenu: onRowContextMenu,
      children: [
        Array.from({ length: visualLevel }, (_, i) => {
          const isLastVisibleSlot = i === visualLevel - 1;
          const ancestorLast = row.ancestorIsLastFlags[i];
          return /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: classNames(
                "arvo-tree__connector",
                isLastVisibleSlot ? row.isLastChild ? "arvo-tree__connector--end" : "arvo-tree__connector--elbow" : ancestorLast && "arvo-tree__connector--empty"
              ),
              "aria-hidden": "true"
            },
            `conn-${i}`
          );
        }),
        isReorderable && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__drag", "data-tree-stop": true, children: /* @__PURE__ */ jsxRuntime.jsx(
          IconButton.ArvoIconButton,
          {
            icon: "drag-handle",
            size: "xs",
            variant: "tertiary",
            tooltip: isReordering ? `Drop ${item.label}` : `Reorder ${item.label}`,
            isDisabled: isRowDisabled,
            tabIndex: -1,
            onClick: onDragHandleClick,
            "aria-pressed": isReordering
          }
        ) }),
        row.hasChildren ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__chevron", "data-tree-stop": true, children: /* @__PURE__ */ jsxRuntime.jsx(
          IconButton.ArvoIconButton,
          {
            icon: "angle-right",
            size: "xs",
            variant: "tertiary",
            tooltip: row.isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`,
            isDisabled: isRowDisabled,
            tabIndex: -1,
            onClick: onChevronClick
          }
        ) }) : /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: "arvo-tree__connector arvo-tree__connector--elbow",
            "aria-hidden": "true"
          }
        ),
        selectionMode === "multiple" && rowSelectable && /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: "arvo-tree__check",
            "data-tree-stop": true,
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Checkbox.default,
              {
                isChecked: isSelected,
                isIndeterminate: ariaChecked === "mixed",
                isDisabled: isRowDisabled,
                label: null,
                onChange: onCheckboxChange
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-tree__content", children: [
          item.icon && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: `arvo-tree__icon o9con o9con-${item.icon}`,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__label", children: labelParts.map(
            (part, i) => part.isMatch ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__label-match", children: part.text }, i) : /* @__PURE__ */ jsxRuntime.jsx("span", { children: part.text }, i)
          ) }),
          meta && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-tree__meta", "aria-hidden": "true", children: [
            meta.icon && /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: `arvo-tree__meta-icon o9con o9con-${meta.icon}`
              }
            ),
            meta.text && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__meta-text", children: meta.text })
          ] }),
          (rowActions && rowActions.length > 0 || onOverflowClick != null && !isRowDisabled) && !isRowDisabled && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-tree__actions", "data-tree-stop": true, children: [
            rowActions == null ? void 0 : rowActions.map((action) => /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                icon: action.icon,
                size: "xs",
                variant: "tertiary",
                tooltip: action.ariaLabel,
                isDisabled: action.isDisabled,
                tabIndex: -1,
                onClick: (event) => {
                  var _a;
                  event.stopPropagation();
                  (_a = action.onClick) == null ? void 0 : _a.call(action, item, event);
                }
              },
              action.id
            )),
            onOverflowClick && /* @__PURE__ */ jsxRuntime.jsx(
              IconButton.ArvoIconButton,
              {
                icon: "more-vertical",
                size: "xs",
                variant: "tertiary",
                tooltip: "More actions",
                tabIndex: -1,
                onClick: onOverflowClick
              }
            )
          ] })
        ] }),
        badge && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__badge", "data-tree-stop": true, children: /* @__PURE__ */ jsxRuntime.jsx(Badge.ArvoBadge, { ...badge }) }),
        item.isLoading && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-tree__skeleton-row", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__skeleton-icon" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-tree__skeleton-text" })
        ] })
      ]
    },
    "row"
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    rowEl,
    isAsync && /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "arvo-tree__loader",
        "data-arvo-loader-for": item.id,
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsxRuntime.jsx(Loader.ArvoLoader, { variant: "dot", size: "sm", orientation: "horizontal" })
      },
      "body"
    ),
    isEmptyParent && /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "arvo-tree__empty",
        "data-arvo-empty-for": item.id,
        "aria-hidden": "true",
        children: /* @__PURE__ */ jsxRuntime.jsx(
          EmptyState.default,
          {
            illustration: emptyIllustration,
            message: emptyMessage,
            size: "xs",
            orientation: "horizontal"
          }
        )
      },
      "body"
    )
  ] });
}
const TreeRow = React.memo(TreeRowInner);
exports.ArvoTreeView = ArvoTreeView;
//# sourceMappingURL=index68.cjs.map
