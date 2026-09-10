"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const ActionMenu = require("./index49.cjs");
function hasItemMenu(item) {
  return Array.isArray(item.menuItems) && item.menuItems.length > 0;
}
function resolveItemType(item, index, total, hasExplicitCurrent) {
  if (item.type) return item.type;
  if (index === total - 1 && !hasExplicitCurrent) return "current";
  if (index === 0 && !item.label && !hasItemMenu(item)) return "home";
  return "link";
}
const DEFAULT_HOME_ICON = "home";
function buildTrail(items, maxVisibleItems, hasOverflow) {
  const total = items.length;
  if (total === 0) return [];
  const hasExplicitCurrent = items.some((it) => it.type === "current");
  const allEntries = items.map((item, index) => ({
    kind: "item",
    item,
    index,
    itemType: resolveItemType(item, index, total, hasExplicitCurrent)
  }));
  if (!hasOverflow || maxVisibleItems < 3 || total <= maxVisibleItems) {
    return allEntries;
  }
  const trailingCount = maxVisibleItems - 2;
  const head = allEntries[0];
  const tail = allEntries.slice(total - trailingCount);
  const collapsedSlice = allEntries.slice(1, total - trailingCount);
  if (collapsedSlice.length === 0) return allEntries;
  const overflow = {
    kind: "overflow",
    collapsed: collapsedSlice.map(({ item, index }) => ({
      item,
      index,
      label: item.label || `Item ${index + 1}`
    }))
  };
  return [head, overflow, ...tail];
}
const ArvoBreadcrumb = React.forwardRef(
  function ArvoBreadcrumb2({
    items,
    size = "sm",
    hasOverflow = true,
    maxVisibleItems = 4,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    ariaLabel = "Breadcrumb",
    overflowAriaLabel = "Options",
    menuProps,
    onNavigate,
    onOverflowOpen,
    onOverflowClose,
    onItemMenuOpen,
    onItemMenuClose,
    className
  }, ref) {
    const isLoading = isLoadingProp === true;
    const blocked = isDisabled || isLoading;
    const classes = [
      "arvo-bc",
      `arvo-bc--${size}`,
      isDisabled ? "is-disabled" : "",
      isLoading ? "loading" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const trail = React.useMemo(
      () => buildTrail(items, maxVisibleItems, hasOverflow),
      [items, maxVisibleItems, hasOverflow]
    );
    const handleClick = React.useCallback(
      (e, item, index) => {
        if (blocked) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (onNavigate && item.href) {
          onNavigate({ href: item.href, index, label: item.label });
        }
      },
      [blocked, onNavigate]
    );
    const handleOverflowSelect = React.useCallback(
      (menuItem) => {
        if (blocked) return;
        const index = Number(menuItem.id);
        const collapsed = items[index];
        if (!(collapsed == null ? void 0 : collapsed.href) || !onNavigate) return;
        onNavigate({
          href: collapsed.href,
          index,
          label: collapsed.label
        });
      },
      [blocked, items, onNavigate]
    );
    const handleOverflowOpenChange = React.useCallback(
      (open) => {
        if (open) onOverflowOpen == null ? void 0 : onOverflowOpen();
        else onOverflowClose == null ? void 0 : onOverflowClose();
      },
      [onOverflowOpen, onOverflowClose]
    );
    const handleItemMenuOpenChange = React.useCallback(
      (index, open) => {
        if (open) onItemMenuOpen == null ? void 0 : onItemMenuOpen({ index });
        else onItemMenuClose == null ? void 0 : onItemMenuClose({ index });
      },
      [onItemMenuOpen, onItemMenuClose]
    );
    return /* @__PURE__ */ jsxRuntime.jsx(
      "nav",
      {
        ref,
        "aria-label": ariaLabel,
        "aria-busy": isLoading ? true : void 0,
        className: classes,
        children: isLoading ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-bc__skl", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-bc__skl__icon" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-bc__skl__sep", children: "/" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-bc__skl__bar" })
        ] }) : /* @__PURE__ */ jsxRuntime.jsx("ol", { className: "arvo-bc__list", children: trail.map((entry) => {
          if (entry.kind === "overflow") {
            return /* @__PURE__ */ jsxRuntime.jsx("li", { className: "arvo-bc__item", children: /* @__PURE__ */ jsxRuntime.jsx(
              ActionMenu.ArvoActionMenu,
              {
                ...menuProps,
                placement: (menuProps == null ? void 0 : menuProps.placement) ?? "bottom-start",
                isDisabled: blocked,
                items: entry.collapsed.map((c) => ({
                  id: String(c.index),
                  label: c.label,
                  icon: c.item.icon
                })),
                trigger: /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    type: "button",
                    className: "arvo-bc__overflow",
                    "aria-label": overflowAriaLabel,
                    disabled: blocked,
                    children: /* @__PURE__ */ jsxRuntime.jsx(
                      "span",
                      {
                        className: "o9con o9con-ellipsis-h",
                        "aria-hidden": "true"
                      }
                    )
                  }
                ),
                onSelect: handleOverflowSelect,
                onOpenChange: handleOverflowOpenChange
              }
            ) }, "__overflow");
          }
          const { item, index, itemType } = entry;
          const isHome = itemType === "home";
          const isCurrent = itemType === "current";
          const effectiveIcon = isHome ? item.icon ?? DEFAULT_HOME_ICON : item.icon;
          const showIcon = !!effectiveIcon;
          const showLabel = !isHome && !!item.label;
          if (!isHome && hasItemMenu(item)) {
            const triggerClass = isCurrent ? "arvo-bc__lbl arvo-bc__lbl--dd" : "arvo-bc__lnk arvo-bc__lnk--dd";
            return /* @__PURE__ */ jsxRuntime.jsx("li", { className: "arvo-bc__item", children: /* @__PURE__ */ jsxRuntime.jsx(
              ActionMenu.ArvoActionMenu,
              {
                ...menuProps,
                placement: (menuProps == null ? void 0 : menuProps.placement) ?? "bottom-start",
                isDisabled: blocked,
                items: item.menuItems,
                trigger: /* @__PURE__ */ jsxRuntime.jsxs(
                  "button",
                  {
                    type: "button",
                    className: triggerClass,
                    disabled: blocked,
                    title: item.label,
                    "aria-current": isCurrent ? "page" : void 0,
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-bc__lnk-inner", children: [
                        showIcon && /* @__PURE__ */ jsxRuntime.jsx(
                          "span",
                          {
                            className: `arvo-bc__ico o9con o9con-${effectiveIcon}`,
                            "aria-hidden": "true"
                          }
                        ),
                        item.label
                      ] }),
                      /* @__PURE__ */ jsxRuntime.jsx(
                        "span",
                        {
                          className: "arvo-bc__chev o9con o9con-angle-down",
                          "aria-hidden": "true"
                        }
                      )
                    ]
                  }
                ),
                onOpenChange: (open) => handleItemMenuOpenChange(index, open)
              }
            ) }, `${item.label}-${index}`);
          }
          const homeClass = isHome ? " arvo-bc__lnk--home" : "";
          const filledIcon = isHome && effectiveIcon ? `${effectiveIcon}-filled` : null;
          return /* @__PURE__ */ jsxRuntime.jsx("li", { className: "arvo-bc__item", children: isCurrent ? /* @__PURE__ */ jsxRuntime.jsxs(
            "span",
            {
              className: "arvo-bc__lbl",
              "aria-current": "page",
              title: item.label,
              children: [
                showIcon && /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    className: `arvo-bc__ico o9con o9con-${effectiveIcon}`,
                    "aria-hidden": "true"
                  }
                ),
                item.label
              ]
            }
          ) : /* @__PURE__ */ jsxRuntime.jsxs(
            "a",
            {
              className: `arvo-bc__lnk${homeClass}`,
              href: isDisabled ? void 0 : item.href,
              "aria-disabled": isDisabled ? true : void 0,
              "aria-label": isHome ? item.label || "Home" : void 0,
              title: isHome ? void 0 : item.label,
              tabIndex: isDisabled ? 0 : void 0,
              onClick: (e) => handleClick(e, item, index),
              children: [
                showIcon && /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    className: `arvo-bc__ico o9con o9con-${effectiveIcon}`,
                    "aria-hidden": "true"
                  }
                ),
                filledIcon && /* @__PURE__ */ jsxRuntime.jsx(
                  "span",
                  {
                    className: `arvo-bc__ico--filled o9con o9con-${filledIcon}`,
                    "aria-hidden": "true"
                  }
                ),
                showLabel && item.label
              ]
            }
          ) }, `${item.label}-${index}`);
        }) })
      }
    );
  }
);
exports.default = ArvoBreadcrumb;
//# sourceMappingURL=index37.cjs.map
