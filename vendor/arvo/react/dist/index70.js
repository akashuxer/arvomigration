import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useId, useCallback, useRef, useEffect, useMemo } from "react";
import { useControllableState } from "./index90.js";
import { attachTitleTruncationTooltip } from "@arvo/utils";
import { ArvoIconButton } from "./index17.js";
import ArvoDropdownIconButton from "./index60.js";
import { ArvoStatus } from "./index14.js";
import { ArvoBadge } from "./index45.js";
import ArvoSwitch from "./index26.js";
import ArvoSearch from "./index51.js";
import ArvoEmptyState from "./index88.js";
import { useAccordionContext } from "./index102.js";
function resolveEmptyState(override) {
  return {
    title: override == null ? void 0 : override.title,
    message: (override == null ? void 0 : override.message) ?? "No Items Available",
    illustration: (override == null ? void 0 : override.illustration) ?? "no-data"
  };
}
const ArvoAccordionItem = forwardRef(
  function ArvoAccordionItem2({
    value,
    title,
    description,
    icon,
    status = null,
    badge = null,
    actions,
    menuItems,
    switch: switchConfig = null,
    search = null,
    hasDivider = true,
    panelPadding = "md",
    size: sizeProp,
    align: alignProp,
    isExpanded: isExpandedProp,
    defaultExpanded,
    isDisabled: isDisabledProp,
    isLoading: isLoadingProp = false,
    isEmpty = false,
    emptyState,
    statusProps,
    badgeProps,
    menuProps,
    switchProps,
    searchProps,
    ariaLabel,
    id,
    className,
    children,
    onExpand,
    onCollapse,
    onToggle,
    ...rest
  }, ref) {
    const ctx = useAccordionContext();
    const size = sizeProp ?? ctx.size;
    const align = alignProp ?? ctx.align;
    const cascadedDisabled = ctx.hasProvider ? ctx.isDisabled : false;
    const isDisabled = isDisabledProp ?? cascadedDisabled;
    const cascadedLoading = ctx.hasProvider ? ctx.isLoading : false;
    const isLoading = (isLoadingProp || cascadedLoading) === true;
    const [standaloneExpanded, setStandaloneExpanded] = useControllableState(
      isExpandedProp,
      defaultExpanded ?? false
    );
    const isExpanded = isExpandedProp !== void 0 ? standaloneExpanded : ctx.hasProvider ? ctx.expandedValues.has(value) : standaloneExpanded;
    const [searchExpanded, setSearchExpanded] = useControllableState(
      search == null ? void 0 : search.isExpanded,
      (search == null ? void 0 : search.defaultExpanded) ?? false
    );
    const uid = useId();
    const triggerId = id ? `${id}-trg` : `arvo-acc-item-${uid}-trg`;
    const panelId = id ? `${id}-panel` : `arvo-acc-item-${uid}-panel`;
    const handleToggle = useCallback(
      (e) => {
        if (isDisabled || isLoading) {
          e.preventDefault();
          return;
        }
        if (ctx.hasProvider) {
          const ok = ctx.toggle(value);
          if (ok) {
            const nextExpanded = !ctx.expandedValues.has(value);
            onToggle == null ? void 0 : onToggle(nextExpanded);
            if (nextExpanded) onExpand == null ? void 0 : onExpand();
            else onCollapse == null ? void 0 : onCollapse();
          }
        } else {
          const next = !isExpanded;
          setStandaloneExpanded(next);
          onToggle == null ? void 0 : onToggle(next);
          if (next) onExpand == null ? void 0 : onExpand();
          else onCollapse == null ? void 0 : onCollapse();
        }
      },
      [
        isDisabled,
        isLoading,
        ctx,
        value,
        isExpanded,
        setStandaloneExpanded,
        onToggle,
        onExpand,
        onCollapse
      ]
    );
    const handleClick = useCallback(
      (e) => handleToggle(e),
      [handleToggle]
    );
    const handleKeyDown = useCallback(
      (e) => {
      },
      []
    );
    const titleRef = useRef(null);
    const truncationHandleRef = useRef(null);
    useEffect(() => {
      const el = titleRef.current;
      if (!el) return;
      if (isLoading) return;
      const handle = attachTitleTruncationTooltip({
        element: el,
        content: title,
        placement: "bottom-center"
      });
      truncationHandleRef.current = handle;
      return () => {
        handle.destroy();
        truncationHandleRef.current = null;
      };
    }, [isLoading]);
    useEffect(() => {
      var _a;
      (_a = truncationHandleRef.current) == null ? void 0 : _a.update(title);
    }, [title]);
    const handleActionClick = useCallback(
      (action) => (e) => {
        var _a;
        e.stopPropagation();
        if (isDisabled || isLoading || action.isDisabled) return;
        (_a = action.onClick) == null ? void 0 : _a.call(action, e);
      },
      [isDisabled, isLoading]
    );
    const handleSwitchChange = useCallback(
      (detail) => {
        var _a;
        (_a = switchConfig == null ? void 0 : switchConfig.onChange) == null ? void 0 : _a.call(switchConfig, detail.isChecked);
      },
      [switchConfig]
    );
    const handleSearchExpandedChange = useCallback(
      (expanded) => {
        var _a;
        setSearchExpanded(expanded);
        (_a = search == null ? void 0 : search.onExpandedChange) == null ? void 0 : _a.call(search, expanded);
      },
      [search, setSearchExpanded]
    );
    const handleSearchChange = useCallback(
      (next) => {
        var _a;
        (_a = search == null ? void 0 : search.onChange) == null ? void 0 : _a.call(search, next);
      },
      [search]
    );
    const hasSearch = !!search;
    const isSearching = hasSearch && searchExpanded;
    const hasInlineActions = !!actions && actions.length > 0;
    const hasMenu = !!menuItems && menuItems.length > 0;
    const hasSwitch = !!switchConfig;
    const hasBadge = !!badge;
    const hasStatus = !!status;
    const hasDesc = !!description;
    const hasIcon = !!icon;
    const chevronIcon = "angle-right";
    const classes = [
      "arvo-acc-item",
      `arvo-acc-item--${size}`,
      `arvo-acc-item--align-${align}`,
      `arvo-acc-item--pad-${panelPadding}`,
      isExpanded && "expanded",
      isDisabled && "is-disabled",
      isLoading && "loading",
      isEmpty && "is-empty",
      isSearching && "is-searching",
      !hasDivider && "no-divider",
      className
    ].filter(Boolean).join(" ");
    const lftCluster = /* @__PURE__ */ jsxs("span", { className: "arvo-acc-item__lft", children: [
      hasIcon && /* @__PURE__ */ jsx(
        "span",
        {
          className: `arvo-acc-item__ico o9con o9con-${icon}`,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsx("span", { ref: titleRef, className: "arvo-acc-item__title", children: title }),
      hasStatus && /* @__PURE__ */ jsx("span", { className: "arvo-acc-item__sts", children: /* @__PURE__ */ jsx(
        ArvoStatus,
        {
          ...statusProps,
          type: status.type,
          placement: "inline",
          size: "sm",
          tooltip: status.label
        }
      ) })
    ] });
    const trailing = /* @__PURE__ */ jsxs(Fragment, { children: [
      hasDesc && !isSearching && /* @__PURE__ */ jsx("span", { className: "arvo-acc-item__desc", children: description }),
      hasBadge && !isSearching && /* @__PURE__ */ jsx("span", { className: "arvo-acc-item__bdg", children: /* @__PURE__ */ jsx(
        ArvoBadge,
        {
          ...badgeProps,
          size: "sm",
          variant: "label",
          semanticType: badge.semanticType ?? "negative",
          appearance: (badgeProps == null ? void 0 : badgeProps.appearance) ?? "primary",
          message: badge.message,
          hasBadgeIcon: false
        }
      ) }),
      hasInlineActions && !isSearching && /* @__PURE__ */ jsx(
        "span",
        {
          className: "arvo-acc-item__actions",
          onClick: (e) => e.stopPropagation(),
          children: actions.map((action) => /* @__PURE__ */ jsx("span", { className: "arvo-acc-item__act", children: /* @__PURE__ */ jsx(
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
          ) }, action.id))
        }
      ),
      hasMenu && !isSearching && /* @__PURE__ */ jsx(
        "span",
        {
          className: "arvo-acc-item__menu",
          onClick: (e) => e.stopPropagation(),
          children: /* @__PURE__ */ jsx(
            ArvoDropdownIconButton,
            {
              ...menuProps,
              icon: "ellipsis-v",
              variant: "tertiary",
              size: "sm",
              isCompact: true,
              tooltip: "More actions",
              items: menuItems,
              isDisabled: isDisabled || isLoading,
              isLoading,
              tabIndex: -1,
              closeOnSelect: true
            }
          )
        }
      ),
      hasSwitch && /* @__PURE__ */ jsx(
        "span",
        {
          className: "arvo-acc-item__switch",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => {
            if (e.key === " " || e.key === "Enter") e.stopPropagation();
          },
          children: /* @__PURE__ */ jsx(
            ArvoSwitch,
            {
              ...switchProps,
              size,
              isChecked: switchConfig == null ? void 0 : switchConfig.isChecked,
              defaultChecked: switchConfig == null ? void 0 : switchConfig.defaultChecked,
              isDisabled: isDisabled || (switchConfig == null ? void 0 : switchConfig.isDisabled),
              "aria-label": switchConfig == null ? void 0 : switchConfig.ariaLabel,
              onChange: handleSwitchChange,
              label: null
            }
          )
        }
      ),
      hasSearch && /* @__PURE__ */ jsx(
        "span",
        {
          className: "arvo-acc-item__search",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => {
            if (e.key === " " || e.key === "Enter") e.stopPropagation();
          },
          children: /* @__PURE__ */ jsx(
            ArvoSearch,
            {
              ...searchProps,
              variant: "expandable-filter",
              placeholder: search.placeholder ?? "Search",
              value: search.value,
              defaultValue: search.defaultValue,
              shortcut: search.shortcut,
              expandDirection: search.expandDirection ?? "start",
              isExpanded: searchExpanded,
              isDisabled: isDisabled || (searchProps == null ? void 0 : searchProps.isDisabled),
              onChange: handleSearchChange,
              onExpandedChange: handleSearchExpandedChange
            }
          )
        }
      )
    ] });
    const chevron = /* @__PURE__ */ jsx(
      "span",
      {
        className: `arvo-acc-item__chev o9con o9con-${chevronIcon}`,
        "aria-hidden": "true"
      }
    );
    const skeleton = /* @__PURE__ */ jsxs("span", { className: "arvo-acc-item__skel", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("span", { className: "arvo-acc-item__skel-bar" }),
      /* @__PURE__ */ jsx("span", { className: "arvo-acc-item__skel-trail" })
    ] });
    const showEmpty = isEmpty && !isLoading && isExpanded;
    const resolvedEmpty = useMemo(
      () => resolveEmptyState(emptyState ?? null),
      [emptyState]
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ...rest,
        ref,
        className: classes,
        "data-arvo-acc-item-value": value,
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              id: triggerId,
              className: "arvo-acc-item__trg",
              "aria-expanded": isExpanded,
              "aria-controls": panelId,
              "aria-disabled": isDisabled || void 0,
              "aria-busy": isLoading || void 0,
              "aria-label": ariaLabel,
              disabled: isDisabled || void 0,
              onClick: handleClick,
              onKeyDown: handleKeyDown,
              children: [
                align === "start" && chevron,
                /* @__PURE__ */ jsxs("span", { className: "arvo-acc-item__hdr", children: [
                  lftCluster,
                  trailing
                ] }),
                align === "end" && chevron,
                isLoading && skeleton
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              id: panelId,
              role: "region",
              "aria-labelledby": triggerId,
              "aria-hidden": !isExpanded || void 0,
              className: "arvo-acc-item__panel",
              ...!isExpanded ? { inert: "" } : {},
              children: /* @__PURE__ */ jsx("div", { className: "arvo-acc-item__panel-inner", children: /* @__PURE__ */ jsx("div", { className: "arvo-acc-item__panel-pad", children: showEmpty ? /* @__PURE__ */ jsx("div", { className: "arvo-acc-item__empty", children: /* @__PURE__ */ jsx(
                ArvoEmptyState,
                {
                  size: "sm",
                  orientation: "horizontal",
                  title: resolvedEmpty.title,
                  message: resolvedEmpty.message,
                  illustration: resolvedEmpty.illustration
                }
              ) }) : !isLoading && children }) })
            }
          )
        ]
      }
    );
  }
);
export {
  ArvoAccordionItem,
  ArvoAccordionItem as default
};
//# sourceMappingURL=index70.js.map
