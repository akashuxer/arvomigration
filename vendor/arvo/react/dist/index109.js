import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { attachTitleTruncationTooltip, formatShortcutDisplay } from "@arvo/utils";
import { isContextMenuSelected } from "./index111.js";
const ICON_PREFIX = "o9con o9con-";
function resolveStatus(status) {
  if (!status) return { modifier: null, style: null };
  if (typeof status === "string") {
    return { modifier: `arvo-menu-item--status-${status}`, style: null };
  }
  return {
    modifier: null,
    style: {
      ["--arvo-menu-item-status-color"]: status.color
    }
  };
}
function renderTrailing(item, hasSubmenu, isExternal) {
  if (item.kind === "separator") return null;
  const parts = [];
  if (item.status) {
    parts.push(
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "arvo-menu-item__status",
          "aria-hidden": "true"
        },
        "status"
      )
    );
  }
  if (item.value) {
    parts.push(
      /* @__PURE__ */ jsx("span", { className: "arvo-menu-item__meta", children: item.value }, "meta")
    );
  }
  if (item.shortcut) {
    parts.push(
      /* @__PURE__ */ jsx("span", { className: "arvo-menu-item__shortcut", children: formatShortcutDisplay(item.shortcut) }, "shortcut")
    );
  }
  if (hasSubmenu) {
    parts.push(
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `arvo-menu-item__submenu ${ICON_PREFIX}angle-right`,
          "aria-hidden": "true"
        },
        "submenu"
      )
    );
  }
  if (isExternal) {
    parts.push(
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `arvo-menu-item__external ${ICON_PREFIX}external-link`,
          "aria-hidden": "true"
        },
        "external"
      )
    );
  }
  if (parts.length === 0) return null;
  return /* @__PURE__ */ jsx("span", { className: "arvo-menu-item__trailing", children: parts });
}
const SEPARATOR_STYLE = {
  pointerEvents: "none"
};
function MenuItemRow(props) {
  var _a;
  const {
    item,
    id,
    index,
    isActive,
    isSubmenuOpen,
    hasSubmenu = item.kind !== "separator" && "submenu" in item && !!((_a = item.submenu) == null ? void 0 : _a.length),
    rowRef,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus
  } = props;
  const localRowRef = useRef(null);
  const labelRef = useRef(null);
  const itemLabel = "label" in item ? item.label : "";
  useEffect(() => {
    const rowEl = localRowRef.current;
    const labelEl = labelRef.current;
    if (!rowEl || !labelEl) return;
    const handle = attachTitleTruncationTooltip({
      triggerElement: rowEl,
      element: labelEl,
      content: itemLabel,
      placement: "top-center"
    });
    return () => handle.destroy();
  }, [itemLabel]);
  if (item.kind === "separator") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        id,
        ref: (node) => rowRef == null ? void 0 : rowRef(node),
        className: "arvo-menu-item__divider",
        role: "separator",
        "data-index": index,
        style: SEPARATOR_STYLE
      }
    );
  }
  const role = item.kind === "checkbox" ? "menuitemcheckbox" : item.kind === "radio" ? "menuitemradio" : "menuitem";
  const isSelected = isContextMenuSelected(item);
  const status = resolveStatus(item.status);
  const classes = ["arvo-menu-item"];
  if (item.secondaryLabel) classes.push("arvo-menu-item--multi-line");
  if ("destructive" in item && item.destructive) {
    classes.push("arvo-menu-item--destructive");
  }
  if (status.modifier) classes.push(status.modifier);
  if (item.isDisabled) classes.push("is-disabled");
  if (isSelected) classes.push("active");
  if (isActive) classes.push("focused");
  const ariaChecked = item.kind === "checkbox" || item.kind === "radio" ? item.checked : void 0;
  const useAnchor = !!item.href && !hasSubmenu;
  const isExternal = useAnchor && item.target === "_blank";
  const ariaLabel = isExternal ? `${item.label}, opens in a new window` : void 0;
  const setRowRef = (node) => {
    localRowRef.current = node;
    rowRef == null ? void 0 : rowRef(node);
  };
  const commonProps = {
    id,
    ref: setRowRef,
    className: classes.join(" "),
    role,
    "aria-disabled": item.isDisabled || void 0,
    "aria-checked": ariaChecked,
    "aria-haspopup": hasSubmenu ? "menu" : void 0,
    "aria-expanded": hasSubmenu ? !!isSubmenuOpen : void 0,
    "aria-label": ariaLabel,
    tabIndex: isActive ? 0 : -1,
    "data-index": index,
    style: status.style ?? void 0,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus
  };
  const innerContent = /* @__PURE__ */ jsxs(Fragment, { children: [
    item.avatar && /* @__PURE__ */ jsx(
      "img",
      {
        className: "arvo-menu-item__avatar",
        src: item.avatar,
        alt: "",
        "aria-hidden": "true"
      }
    ),
    item.icon && /* @__PURE__ */ jsx(
      "span",
      {
        className: `arvo-menu-item__ico ${ICON_PREFIX}${item.icon}`,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "arvo-menu-item__txt", children: [
      /* @__PURE__ */ jsx("span", { ref: labelRef, className: "arvo-menu-item__lbl", children: item.label }),
      item.secondaryLabel && /* @__PURE__ */ jsx("span", { className: "arvo-menu-item__secondary", children: item.secondaryLabel })
    ] }),
    renderTrailing(item, hasSubmenu, isExternal)
  ] });
  if (useAnchor) {
    return /* @__PURE__ */ jsx(
      "a",
      {
        ...commonProps,
        ref: commonProps.ref,
        href: item.href,
        target: item.target ?? "_self",
        rel: item.target === "_blank" ? "noopener noreferrer" : void 0,
        children: innerContent
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { ...commonProps, ref: commonProps.ref, children: innerContent });
}
export {
  MenuItemRow
};
//# sourceMappingURL=index109.js.map
