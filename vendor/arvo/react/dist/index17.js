import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef } from "react";
import { useTooltip } from "./index10.js";
import { ArvoBadge } from "./index45.js";
import { ArvoStatus } from "./index14.js";
function resolveIconButtonBadge(cfg) {
  const placement = cfg.placement ?? "top-right";
  const semanticType = cfg.semanticType ?? "neutral";
  return {
    ...cfg,
    placement,
    semanticType,
    size: "sm",
    appearance: "filled",
    colorMode: "semantic",
    variant: "counter",
    counterMode: "single",
    hasBadgeIcon: false
  };
}
function iconButtonStatusSize(buttonSize) {
  if (buttonSize === "xs") return "sm";
  return buttonSize;
}
function resolveIconButtonStatus(cfg, buttonSize) {
  const placement = cfg.placement ?? "top-right";
  return {
    ...cfg,
    size: iconButtonStatusSize(buttonSize),
    placement
  };
}
const ArvoIconButton = forwardRef(
  function ArvoIconButton2({
    variant = "primary",
    size = "md",
    type = "button",
    icon,
    tooltip,
    isDisabled = false,
    isSelected,
    isLoading: isLoadingProp = false,
    badge,
    status,
    className,
    onClick,
    onKeyDown,
    ...rest
  }, ref) {
    const internalRef = useRef(null);
    const isLoading = isLoadingProp === true;
    const tooltipContent = typeof tooltip === "string" ? tooltip : tooltip.content;
    useTooltip({ triggerRef: internalRef, tooltip });
    const classes = [
      "arvo-icon-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`,
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
    const ariaPressedProp = isSelected !== void 0 ? { "aria-pressed": isSelected } : {};
    const mergeRefs = (node) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    const resolvedBadge = badge ? resolveIconButtonBadge(badge) : null;
    const resolvedStatus = status ? resolveIconButtonStatus(status, size) : null;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref: mergeRefs,
        type,
        disabled: isDisabled,
        ...rest,
        className: classes,
        "aria-label": tooltipContent,
        "aria-busy": isLoading ? true : void 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        ...ariaPressedProp,
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `arvo-btn__ico o9con o9con-${icon}`,
              "aria-hidden": "true"
            }
          ),
          resolvedBadge && /* @__PURE__ */ jsx(ArvoBadge, { ...resolvedBadge }),
          resolvedStatus && /* @__PURE__ */ jsx(ArvoStatus, { ...resolvedStatus })
        ]
      }
    );
  }
);
export {
  ArvoIconButton,
  ArvoIconButton as default,
  resolveIconButtonBadge,
  resolveIconButtonStatus
};
//# sourceMappingURL=index17.js.map
