import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { attachTitleTruncationTooltip } from "@arvo/utils";
import ArvoCheckbox from "./index23.js";
function isGroupedOptions(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenOptions(items) {
  if (isGroupedOptions(items)) return items.flatMap((g) => g.items);
  return items;
}
function OptionRow({
  item,
  flatIndex,
  cfg
}) {
  const { block } = cfg;
  const variant = cfg.variant ?? "standard";
  const selectionMode = cfg.selectionMode ?? "single";
  const isMultiple = selectionMode === "multiple";
  const isRich = variant === "rich";
  const selected = cfg.isSelected(item.value);
  const highlighted = flatIndex === cfg.activeIndex && cfg.isHighlightActive !== false;
  const optClasses = [
    `${block}__opt`,
    item.isDisabled && "is-disabled",
    highlighted && "highlighted",
    selected && !isMultiple && "active"
  ].filter(Boolean).join(" ");
  const showAvatar = isRich && !!item.avatar;
  const showIcon = !!item.icon && !showAvatar;
  const showSecondary = isRich && !!item.secondaryLabel;
  const labelNode = cfg.renderLabel ? cfg.renderLabel(item) : item.label;
  const rowRef = useRef(null);
  const labelRef = useRef(null);
  useEffect(() => {
    const rowEl = rowRef.current;
    const labelEl = labelRef.current;
    if (!rowEl || !labelEl) return;
    const handle = attachTitleTruncationTooltip({
      triggerElement: rowEl,
      element: labelEl,
      content: item.label,
      placement: "top-center"
    });
    return () => handle.destroy();
  }, [item.label]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: rowRef,
      id: cfg.getOptionId(flatIndex),
      className: optClasses,
      role: "option",
      "aria-selected": selected,
      "aria-disabled": item.isDisabled || void 0,
      "data-index": cfg.emitDataIndex ? flatIndex : void 0,
      onClick: cfg.onItemClick ? () => cfg.onItemClick(item, flatIndex) : void 0,
      onMouseEnter: cfg.onItemMouseEnter ? () => cfg.onItemMouseEnter(item, flatIndex) : void 0,
      onMouseDown: cfg.onItemMouseDown ? (e) => cfg.onItemMouseDown(e, item, flatIndex) : void 0,
      children: [
        isMultiple && /* @__PURE__ */ jsx("span", { className: `${block}__opt__check`, "aria-hidden": "true", children: /* @__PURE__ */ jsx(
          ArvoCheckbox,
          {
            size: "sm",
            isChecked: selected,
            isDisabled: item.isDisabled
          }
        ) }),
        showAvatar && /* @__PURE__ */ jsx(
          "img",
          {
            className: `${block}__opt__avatar`,
            src: item.avatar,
            alt: "",
            "aria-hidden": "true"
          }
        ),
        showIcon && /* @__PURE__ */ jsx(
          "span",
          {
            className: `${block}__opt__ico o9con o9con-${item.icon}`,
            "aria-hidden": "true"
          }
        ),
        isRich ? /* @__PURE__ */ jsxs("span", { className: `${block}__opt__txt`, children: [
          /* @__PURE__ */ jsx("span", { ref: labelRef, className: `${block}__opt__lbl`, children: labelNode }),
          showSecondary && /* @__PURE__ */ jsx("span", { className: `${block}__opt__secondary`, children: item.secondaryLabel })
        ] }) : /* @__PURE__ */ jsx("span", { ref: labelRef, className: `${block}__opt__lbl`, children: labelNode })
      ]
    }
  );
}
function renderOptionRow(item, flatIndex, cfg) {
  return /* @__PURE__ */ jsx(OptionRow, { item, flatIndex, cfg }, item.id);
}
function renderOptionListBody(cfg) {
  const { block, filteredItems, groupIdPrefix, hasGroupDividers = true } = cfg;
  if (isGroupedOptions(filteredItems)) {
    let flatIndex = 0;
    return filteredItems.map((group, groupIdx) => {
      const groupHdrId = `${groupIdPrefix}-${groupIdx}`;
      return /* @__PURE__ */ jsxs("div", { children: [
        groupIdx > 0 && hasGroupDividers && /* @__PURE__ */ jsx("hr", { className: `${block}__divider`, role: "separator" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            role: "group",
            "aria-labelledby": group.label ? groupHdrId : void 0,
            className: `${block}__grp`,
            children: [
              group.label && /* @__PURE__ */ jsx("div", { id: groupHdrId, className: `${block}__grp-hdr`, children: group.label }),
              group.items.map((item) => {
                const node = renderOptionRow(item, flatIndex, cfg);
                flatIndex++;
                return node;
              })
            ]
          }
        )
      ] }, group.id);
    });
  }
  return filteredItems.map((item, i) => renderOptionRow(item, i, cfg));
}
export {
  flattenOptions,
  isGroupedOptions,
  renderOptionListBody,
  renderOptionRow
};
//# sourceMappingURL=index106.js.map
