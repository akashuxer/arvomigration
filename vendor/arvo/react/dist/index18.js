import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef } from "react";
import { useTooltip } from "./index10.js";
import { useControllableState } from "./index90.js";
import { ArvoBadge } from "./index45.js";
import { ArvoStatus } from "./index14.js";
function resolveToggleButtonBadge(cfg) {
  const placement = cfg.placement ?? "inline";
  const isPositioned = placement !== "inline";
  const variant = isPositioned ? "counter" : cfg.variant ?? "label";
  const counterMode = isPositioned ? "single" : cfg.counterMode;
  const semanticType = isPositioned ? cfg.semanticType ?? "neutral" : "neutral";
  return {
    ...cfg,
    placement,
    variant,
    counterMode,
    semanticType,
    size: "sm",
    appearance: isPositioned ? "filled" : "primary",
    colorMode: "semantic",
    hasBadgeIcon: false
  };
}
function resolveToggleButtonStatus(cfg, toggleSize) {
  const placement = cfg.placement ?? "top-right";
  return {
    ...cfg,
    size: toggleSize,
    placement
  };
}
const ArvoToggleButton = forwardRef(
  function ArvoToggleButton2({
    variant = "secondary",
    size = "md",
    type = "button",
    icon,
    selectedIcon,
    label,
    tooltip,
    isDisabled = false,
    isSelected: selectedProp,
    defaultSelected = false,
    isLoading: isLoadingProp = false,
    onSelectedChange,
    badge,
    status,
    className,
    onClick,
    onKeyDown,
    ...rest
  }, ref) {
    const internalRef = useRef(null);
    const isLoading = isLoadingProp === true;
    const [isSelected, setSelected] = useControllableState(
      selectedProp,
      defaultSelected
    );
    const hasLabel = typeof label === "string" && label.length > 0;
    const tooltipContent = typeof tooltip === "string" ? tooltip : (tooltip == null ? void 0 : tooltip.content) ?? null;
    useTooltip({ triggerRef: internalRef, tooltip });
    const classes = [
      "arvo-toggle-btn",
      `arvo-toggle-btn--${variant}`,
      `arvo-toggle-btn--${size}`,
      hasLabel ? "" : "arvo-toggle-btn--icon-only",
      isLoading ? "loading" : "",
      isSelected ? "active" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const blocked = isDisabled || isLoading;
    const handleClick = (e) => {
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const next = !isSelected;
      setSelected(next);
      onSelectedChange == null ? void 0 : onSelectedChange(next);
      onClick == null ? void 0 : onClick(e);
    };
    const handleKeyDown = (e) => {
      if (blocked && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onKeyDown == null ? void 0 : onKeyDown(e);
    };
    const mergeRefs = (node) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    const renderedIcon = isSelected && selectedIcon ? selectedIcon : icon;
    const resolvedBadge = badge ? resolveToggleButtonBadge(badge) : null;
    const resolvedStatus = status ? resolveToggleButtonStatus(status, size) : null;
    const accessibleNameProps = !hasLabel && tooltipContent ? { "aria-label": tooltipContent } : {};
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref: mergeRefs,
        type,
        disabled: isDisabled,
        ...rest,
        className: classes,
        "aria-pressed": isSelected,
        "aria-busy": isLoading ? true : void 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        ...accessibleNameProps,
        children: [
          /* @__PURE__ */ jsxs("span", { className: "arvo-toggle-btn__inner", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `arvo-toggle-btn__ico o9con o9con-${renderedIcon}`,
                "aria-hidden": "true"
              }
            ),
            hasLabel && /* @__PURE__ */ jsx("span", { className: "arvo-toggle-btn__lbl", children: label })
          ] }),
          resolvedBadge && /* @__PURE__ */ jsx(ArvoBadge, { ...resolvedBadge }),
          resolvedStatus && /* @__PURE__ */ jsx(ArvoStatus, { ...resolvedStatus })
        ]
      }
    );
  }
);
export {
  ArvoToggleButton,
  ArvoToggleButton as default,
  resolveToggleButtonBadge,
  resolveToggleButtonStatus
};
//# sourceMappingURL=index18.js.map
