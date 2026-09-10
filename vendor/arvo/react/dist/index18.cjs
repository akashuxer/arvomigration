"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useTooltip = require("./index10.cjs");
const useControllableState = require("./index90.cjs");
const Badge = require("./index45.cjs");
const Status = require("./index14.cjs");
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
const ArvoToggleButton = React.forwardRef(
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
    const internalRef = React.useRef(null);
    const isLoading = isLoadingProp === true;
    const [isSelected, setSelected] = useControllableState.useControllableState(
      selectedProp,
      defaultSelected
    );
    const hasLabel = typeof label === "string" && label.length > 0;
    const tooltipContent = typeof tooltip === "string" ? tooltip : (tooltip == null ? void 0 : tooltip.content) ?? null;
    useTooltip.useTooltip({ triggerRef: internalRef, tooltip });
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
    return /* @__PURE__ */ jsxRuntime.jsxs(
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
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-toggle-btn__inner", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: `arvo-toggle-btn__ico o9con o9con-${renderedIcon}`,
                "aria-hidden": "true"
              }
            ),
            hasLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-toggle-btn__lbl", children: label })
          ] }),
          resolvedBadge && /* @__PURE__ */ jsxRuntime.jsx(Badge.ArvoBadge, { ...resolvedBadge }),
          resolvedStatus && /* @__PURE__ */ jsxRuntime.jsx(Status.ArvoStatus, { ...resolvedStatus })
        ]
      }
    );
  }
);
exports.ArvoToggleButton = ArvoToggleButton;
exports.default = ArvoToggleButton;
exports.resolveToggleButtonBadge = resolveToggleButtonBadge;
exports.resolveToggleButtonStatus = resolveToggleButtonStatus;
//# sourceMappingURL=index18.cjs.map
