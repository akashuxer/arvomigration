"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const utils = require("@arvo/utils");
const IconButton = require("./index17.cjs");
const Checkbox = require("./index23.cjs");
const Radio = require("./index22.cjs");
const Badge = require("./index45.cjs");
const Avatar = require("./index40.cjs");
const Status = require("./index14.cjs");
const DEFAULT_TRAILING_ACTIONS = 4;
function useCappedActions(actions) {
  return React.useMemo(() => {
    const list = actions ?? [];
    if (list.length <= DEFAULT_TRAILING_ACTIONS) return list;
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[ArvoListItem] More than ${DEFAULT_TRAILING_ACTIONS} actions provided (got ${list.length}). Extras are truncated. Move long-tail actions into a context menu or split-button.`
      );
    }
    return list.slice(0, DEFAULT_TRAILING_ACTIONS);
  }, [actions]);
}
function splitLabelForMatch(label, fragment) {
  if (!fragment) return null;
  const idx = label.toLowerCase().indexOf(fragment.toLowerCase());
  if (idx < 0) return null;
  return {
    before: label.slice(0, idx),
    match: label.slice(idx, idx + fragment.length),
    after: label.slice(idx + fragment.length)
  };
}
const ArvoListItem = React.forwardRef(function ArvoListItem2({
  id,
  label,
  secondaryLabel,
  icon,
  avatar,
  badge,
  isSelected = false,
  isChecked = false,
  isIndeterminate = false,
  isExcluded = false,
  isDisabled = false,
  isReorderable = false,
  isLoading: isLoadingProp = false,
  isSearchMatch = false,
  matchFragment,
  hasInlineNav = false,
  hasContextMenu = false,
  hasDragSpacer = false,
  actions,
  status,
  tooltip,
  avatarProps,
  badgeProps,
  iconButtonProps,
  variant = "standard",
  selectionMode = "none",
  actionsVisibility = "hover",
  isFocused = false,
  tabIndex,
  role,
  className,
  onClick,
  onActivate,
  onActionClick,
  onContextMenuRequest,
  data: _data
}, ref) {
  const isLoading = isLoadingProp === true;
  const cappedActions = useCappedActions(actions);
  const labelRef = React.useRef(null);
  const rootElRef = React.useRef(null);
  const setRootRef = React.useCallback(
    (node) => {
      rootElRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );
  const tooltipContent = tooltip ?? label;
  React.useEffect(() => {
    const labelEl = labelRef.current;
    const rowEl = rootElRef.current;
    if (!labelEl || !rowEl) return;
    const handle = utils.attachTitleTruncationTooltip({
      triggerElement: rowEl,
      element: labelEl,
      content: () => tooltipContent,
      placement: "top-center"
    });
    return () => handle.destroy();
  }, [tooltipContent]);
  React.useEffect(() => {
    const root = rootElRef.current;
    if (!root) return;
    const inputs = root.querySelectorAll(
      ".arvo-list-item__check input"
    );
    inputs.forEach((input) => input.setAttribute("tabindex", "-1"));
  });
  const showCheckbox = selectionMode === "multi" && !isLoading;
  const showRadio = selectionMode === "single" && !isLoading;
  const showLeadingIcon = selectionMode === "none" && !isLoading && !!icon;
  const showAvatar = variant === "rich" && !!avatar && !isLoading;
  const showDragHandle = isReorderable && !isLoading && !isDisabled;
  const showDragSpacer = hasDragSpacer && !showDragHandle && !isLoading;
  const showExclude = isExcluded && selectionMode === "multi" && !isLoading;
  const showBadge = !!badge && !isLoading;
  const showActions = cappedActions.length > 0 && !isLoading;
  const showInlineNav = hasInlineNav && !isLoading;
  const showStatus = !!status && !isLoading;
  const showActionsCluster = showActions || showStatus;
  const handleClick = React.useCallback(
    (e) => {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      onClick == null ? void 0 : onClick(e);
    },
    [isDisabled, isLoading, onClick]
  );
  const handleKeyDown = React.useCallback(
    (e) => {
      if (isDisabled || isLoading) return;
      if (hasContextMenu && (e.key === "F10" && e.shiftKey || e.shiftKey && e.ctrlKey && e.key.toUpperCase() === "X")) {
        e.preventDefault();
        onContextMenuRequest == null ? void 0 : onContextMenuRequest(e);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onClick == null ? void 0 : onClick(e);
      } else if (e.key === " ") {
        e.preventDefault();
        onClick == null ? void 0 : onClick(e);
      }
    },
    [isDisabled, isLoading, hasContextMenu, onContextMenuRequest, onClick]
  );
  const handleNativeContextMenu = React.useCallback(
    (e) => {
      if (isDisabled || isLoading || !hasContextMenu) return;
      e.preventDefault();
      onContextMenuRequest == null ? void 0 : onContextMenuRequest(e);
    },
    [isDisabled, isLoading, hasContextMenu, onContextMenuRequest]
  );
  const handleActionClick = React.useCallback(
    (action) => (e) => {
      var _a;
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled || isLoading || action.isDisabled) return;
      (_a = action.onClick) == null ? void 0 : _a.call(action, { itemId: id, actionId: action.id, item: { id, label }, event: e.nativeEvent });
      onActionClick == null ? void 0 : onActionClick(action.id, e);
    },
    [isDisabled, isLoading, id, label, onActionClick]
  );
  const handleInlineNavClick = React.useCallback(
    (e) => {
      e.stopPropagation();
      if (isDisabled || isLoading) return;
      onActivate == null ? void 0 : onActivate(e);
    },
    [isDisabled, isLoading, onActivate]
  );
  const resolvedRole = role ?? (selectionMode === "multi" ? "option" : selectionMode === "single" ? "radio" : "listitem");
  const ariaChecked = selectionMode === "single" ? isChecked : selectionMode === "multi" ? isIndeterminate ? "mixed" : isChecked : void 0;
  const ariaSelected = selectionMode === "multi" ? isChecked : void 0;
  const classes = [
    "arvo-list-item",
    `arvo-list-item--${variant}`,
    `arvo-list-item--${selectionMode}`,
    isSelected && "active",
    isFocused && "focused",
    isDisabled && "is-disabled",
    isLoading && "is-loading",
    isExcluded && "is-excluded",
    className
  ].filter(Boolean).join(" ");
  const matchSplit = isSearchMatch ? splitLabelForMatch(label, matchFragment) : null;
  const labelNode = matchSplit ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    matchSplit.before,
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__match", children: matchSplit.match }),
    matchSplit.after
  ] }) : label;
  const body = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    showDragHandle && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__drag", "data-arvo-drag-handle": "true", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-ico o9con o9con-drag-handle", "aria-hidden": "true" }) }),
    showDragSpacer && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__drag-spacer", "aria-hidden": "true" }),
    showCheckbox && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__check", children: /* @__PURE__ */ jsxRuntime.jsx(
      Checkbox.default,
      {
        isChecked: isChecked && !isIndeterminate,
        isIndeterminate,
        isDisabled,
        tabIndex: -1,
        "aria-hidden": "true",
        onChange: () => {
        }
      }
    ) }),
    showRadio && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__check", children: /* @__PURE__ */ jsxRuntime.jsx(
      Radio.default,
      {
        value: id,
        isChecked,
        isDisabled,
        tabIndex: -1,
        "aria-hidden": "true",
        onChange: () => {
        }
      }
    ) }),
    showLeadingIcon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: `arvo-list-item__ico o9con o9con-${icon}`, "aria-hidden": "true" }),
    showAvatar && avatar && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__avt", children: /* @__PURE__ */ jsxRuntime.jsx(
      Avatar.ArvoAvatar,
      {
        ...avatarProps ?? {},
        size: "sm",
        variant: avatar.variant,
        name: avatar.name,
        src: avatar.src,
        icon: avatar.icon,
        colorMode: avatar.colorMode,
        semanticType: avatar.semanticType,
        customColor: avatar.customColor,
        tooltip: avatar.tooltip
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-list-item__txt", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { ref: labelRef, className: "arvo-list-item__lbl", children: labelNode }),
      variant === "rich" && secondaryLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__secondary", children: secondaryLabel })
    ] }),
    showExclude && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__exclude", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "o9con o9con-exclude" }) }),
    showBadge && badge && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__badge", children: /* @__PURE__ */ jsxRuntime.jsx(
      Badge.ArvoBadge,
      {
        ...badgeProps ?? {},
        size: "sm",
        variant: badge.variant ?? "label",
        appearance: (badge.appearance ?? "subtle") === "filled" ? "filled" : "primary",
        semanticType: badge.semanticType ?? "neutral",
        message: badge.message,
        hasBadgeIcon: false,
        customColor: badge.customColor,
        colorMode: badge.colorMode
      }
    ) }),
    showActionsCluster && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-list-item__actions", "data-arvo-actions-visibility": actionsVisibility, children: [
      showStatus && status && /* @__PURE__ */ jsxRuntime.jsx(
        Status.ArvoStatus,
        {
          type: status.type,
          size: "sm",
          placement: "inline",
          icon: status.icon,
          tooltip: status.tooltip
        }
      ),
      cappedActions.map((action) => /* @__PURE__ */ jsxRuntime.jsx(
        IconButton.ArvoIconButton,
        {
          ...iconButtonProps ?? {},
          icon: action.icon,
          variant: action.isDanger ? "danger-tertiary" : "tertiary",
          size: "sm",
          tooltip: action.tooltip,
          isDisabled: isDisabled || action.isDisabled,
          tabIndex: -1,
          onClick: handleActionClick(action)
        },
        action.id
      ))
    ] }),
    showInlineNav && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__chev", children: /* @__PURE__ */ jsxRuntime.jsx(
      IconButton.ArvoIconButton,
      {
        icon: "angle-right",
        variant: "tertiary",
        size: "sm",
        tooltip: "Navigate",
        isDisabled,
        tabIndex: -1,
        onClick: handleInlineNavClick
      }
    ) }),
    isLoading && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-list-item__skel", "aria-hidden": "true" })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref: setRootRef,
      role: resolvedRole,
      tabIndex,
      "aria-disabled": isDisabled || void 0,
      "aria-busy": isLoading || void 0,
      "aria-selected": ariaSelected,
      "aria-checked": ariaChecked,
      "aria-current": isSelected ? "true" : void 0,
      "aria-label": tooltip ?? void 0,
      "data-arvo-list-item-id": id,
      className: classes,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onContextMenu: hasContextMenu ? handleNativeContextMenu : void 0,
      children: body
    }
  );
});
exports.ArvoListItem = ArvoListItem;
exports.default = ArvoListItem;
//# sourceMappingURL=index64.cjs.map
