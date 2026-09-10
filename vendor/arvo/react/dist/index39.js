import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { forwardRef, useMemo, useCallback } from "react";
import { ArvoIconButton } from "./index17.js";
import { ArvoToggleButton } from "./index18.js";
import ArvoDropdownIconButton from "./index60.js";
import { ArvoAvatar } from "./index40.js";
import { ArvoStatus } from "./index14.js";
import { ArvoBadge } from "./index45.js";
const NAV_ITEM_MAX_INLINE_ACTIONS = 3;
function resolveBadgeAppearance(isSelected, isDisabled) {
  if (isSelected && !isDisabled) return "filled";
  return "primary";
}
function isBadgeSuppressed(isSelected, isDisabled) {
  return isDisabled;
}
const ArvoNavItem = forwardRef(function ArvoNavItem2({
  id,
  label,
  size = "md",
  isCompact = false,
  href,
  target,
  rel,
  icon,
  avatar,
  status,
  badge,
  actions,
  menuItems,
  isPinned = false,
  isSelected = false,
  isDisabled = false,
  isLoading: isLoadingProp = false,
  tooltip,
  // `actionsVisibility` is currently a parent-level setting only -- the
  // `.arvo-nav--actions-always` modifier on the wrapper drives the inline
  // reveal styling. The prop is accepted on the item for API symmetry
  // but has no per-row effect today; suppress the unused-vars warning
  // by prefixing with `_`.
  actionsVisibility: _actionsVisibility = "hover",
  avatarProps,
  statusProps,
  badgeProps,
  menuProps,
  overflowExtras,
  pinToggle,
  tabIndex,
  className,
  onSelect,
  onAction,
  ...rest
}, ref) {
  const isLoading = isLoadingProp === true;
  const { inlineActions, overflowMenuItems, hasOverflowMenu } = useMemo(() => {
    const allActions = actions ?? [];
    const inline = allActions.slice(0, NAV_ITEM_MAX_INLINE_ACTIONS);
    const promoted = allActions.slice(NAV_ITEM_MAX_INLINE_ACTIONS);
    const promotedAsMenuItems = promoted.map((a) => ({
      id: a.id,
      label: a.tooltip,
      icon: a.icon,
      isDisabled: a.isDisabled
    }));
    const merged = [
      ...menuItems ?? [],
      ...overflowExtras ?? [],
      ...promotedAsMenuItems
    ];
    return {
      inlineActions: inline,
      overflowMenuItems: merged,
      hasOverflowMenu: merged.length > 0
    };
  }, [actions, menuItems, overflowExtras]);
  const promotedActionIds = useMemo(() => {
    const ids = /* @__PURE__ */ new Set();
    (actions ?? []).slice(NAV_ITEM_MAX_INLINE_ACTIONS).forEach((a) => {
      ids.add(a.id);
    });
    return ids;
  }, [actions]);
  const handleClick = useCallback(
    (e) => {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      onSelect == null ? void 0 : onSelect(e);
    },
    [isDisabled, isLoading, onSelect]
  );
  const handleKeyDown = useCallback(
    (e) => {
      if (isDisabled || isLoading) return;
      if (e.key === "Enter") {
        if (!href) {
          e.preventDefault();
          onSelect == null ? void 0 : onSelect(e);
        } else {
          onSelect == null ? void 0 : onSelect(e);
        }
      } else if (e.key === " " && !href) {
        e.preventDefault();
        onSelect == null ? void 0 : onSelect(e);
      }
    },
    [href, isDisabled, isLoading, onSelect]
  );
  const handleActionClick = useCallback(
    (action) => (e) => {
      var _a;
      e.stopPropagation();
      e.preventDefault();
      if (isDisabled || isLoading || action.isDisabled) return;
      (_a = action.onClick) == null ? void 0 : _a.call(action, e);
      onAction == null ? void 0 : onAction({ actionId: action.id, itemId: id }, e);
    },
    [isDisabled, isLoading, onAction, id]
  );
  const rowClasses = [
    "arvo-nav-item",
    `arvo-nav-item--${size}`,
    isCompact && "arvo-nav-item--compact",
    isSelected && "active",
    isDisabled && "is-disabled",
    isLoading && "is-loading",
    isPinned && "is-pinned",
    className
  ].filter(Boolean).join(" ");
  const accessibleName = tooltip ?? label;
  const rootAriaLabel = isCompact ? accessibleName : tooltip ? accessibleName : void 0;
  const rootTitle = isCompact ? accessibleName : tooltip;
  const showLft = !isLoading;
  const showActions = !isLoading && (inlineActions.length > 0 || hasOverflowMenu || !!status || !!badge || !!pinToggle);
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    showLft && /* @__PURE__ */ jsxs("span", { className: "arvo-nav-item__lft", children: [
      icon && /* @__PURE__ */ jsx(
        "span",
        {
          className: `arvo-nav-item__ico o9con o9con-${icon}`,
          "aria-hidden": "true"
        }
      ),
      avatar && /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__avt", children: /* @__PURE__ */ jsx(
        ArvoAvatar,
        {
          ...avatarProps,
          size: "xs",
          variant: avatar.variant,
          name: avatar.name,
          src: avatar.src,
          icon: avatar.icon,
          colorMode: avatar.colorMode,
          semanticType: avatar.semanticType,
          customColor: avatar.customColor,
          tooltip: avatar.tooltip,
          alt: avatar.alt
        }
      ) }),
      /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__lbl", title: tooltip, children: label })
    ] }),
    showActions && /* @__PURE__ */ jsxs("span", { className: "arvo-nav-item__actions", children: [
      status && /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__sts", children: /* @__PURE__ */ jsx(
        ArvoStatus,
        {
          ...statusProps,
          type: status.type,
          placement: "inline",
          size: "sm",
          tooltip: status.label
        }
      ) }),
      pinToggle && // Pin / unpin uses ArvoToggleButton so the icon pair
      // (`push-pin` / `push-pinned`) drives `aria-pressed` and the
      // visual flip natively via `selectedIcon`. We stop propagation
      // on click so the surrounding anchor (when href is set) does
      // not navigate when the user toggles the pin -- the inline
      // IconButton actions and the overflow trigger do the same.
      /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__pin", children: /* @__PURE__ */ jsx(
        ArvoToggleButton,
        {
          icon: "push-pin",
          selectedIcon: "push-pinned",
          variant: "tertiary",
          size: "sm",
          tooltip: pinToggle.tooltip ?? (pinToggle.isSelected ? "Unpin" : "Pin"),
          isSelected: pinToggle.isSelected,
          isDisabled: isDisabled || isLoading || pinToggle.isDisabled,
          isLoading,
          tabIndex: -1,
          onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          onSelectedChange: (next) => {
            var _a;
            return (_a = pinToggle.onSelectedChange) == null ? void 0 : _a.call(pinToggle, next);
          }
        }
      ) }),
      inlineActions.map((action) => /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__act", children: /* @__PURE__ */ jsx(
        ArvoIconButton,
        {
          icon: action.icon,
          variant: "tertiary",
          size: "sm",
          tooltip: action.tooltip,
          isDisabled: isDisabled || action.isDisabled,
          isLoading,
          tabIndex: -1,
          onClick: handleActionClick(action)
        }
      ) }, action.id)),
      hasOverflowMenu && /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__overflow", children: /* @__PURE__ */ jsx(
        ArvoDropdownIconButton,
        {
          ...menuProps,
          icon: "ellipsis-v",
          variant: "tertiary",
          size: "sm",
          isCompact: true,
          tooltip: "More actions",
          items: overflowMenuItems,
          isDisabled: isDisabled || isLoading,
          isLoading,
          tabIndex: -1,
          closeOnSelect: true,
          onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          onSelect: (item) => {
            var _a;
            if (promotedActionIds.has(item.id)) {
              const original = (actions ?? []).find((a) => a.id === item.id);
              if (original && !original.isDisabled && !isDisabled && !isLoading) {
                (_a = original.onClick) == null ? void 0 : _a.call(original);
                onAction == null ? void 0 : onAction({ actionId: item.id, itemId: id });
              }
            }
            return void 0;
          }
        }
      ) }),
      badge && !isBadgeSuppressed(isSelected, isDisabled) && /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__bdg", children: /* @__PURE__ */ jsx(
        ArvoBadge,
        {
          ...badgeProps,
          size: "sm",
          variant: "label",
          semanticType: badge.semanticType ?? "positive",
          appearance: resolveBadgeAppearance(isSelected, isDisabled),
          message: badge.message,
          hasBadgeIcon: false
        }
      ) })
    ] }),
    isLoading && /* @__PURE__ */ jsx("span", { className: "arvo-nav-item__skel", "aria-hidden": "true" })
  ] });
  const commonProps = {
    ref,
    className: rowClasses,
    "data-nav-item-id": id,
    "data-arvo-nav-item-id": id,
    "aria-disabled": isDisabled || void 0,
    "aria-busy": isLoading || void 0,
    tabIndex,
    title: rootTitle,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...rest
  };
  if (href) {
    return /* @__PURE__ */ jsx(
      "a",
      {
        ...commonProps,
        href: isDisabled || isLoading ? void 0 : href,
        target,
        rel,
        "aria-current": isSelected ? "page" : void 0,
        "aria-label": rootAriaLabel,
        children: inner
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...commonProps,
      type: "button",
      disabled: isDisabled || isLoading || void 0,
      "aria-pressed": isSelected || void 0,
      "aria-label": rootAriaLabel,
      children: inner
    }
  );
});
export {
  ArvoNavItem,
  NAV_ITEM_MAX_INLINE_ACTIONS,
  ArvoNavItem as default
};
//# sourceMappingURL=index39.js.map
