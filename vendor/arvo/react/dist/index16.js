import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useCallback, useEffect } from "react";
import { attachTitleTruncationTooltip } from "@arvo/utils";
import { ArvoBadge } from "./index45.js";
import { ArvoStatus } from "./index14.js";
function resolveButtonBadge(cfg, buttonVariant) {
  const placement = cfg.placement ?? "inline";
  const isPositioned = placement !== "inline";
  const variant = isPositioned ? "counter" : cfg.variant ?? "label";
  const counterMode = isPositioned ? "single" : cfg.counterMode;
  const semanticType = isPositioned ? cfg.semanticType ?? "neutral" : "neutral";
  const inlineAppearance = buttonVariant === "secondary" ? "filled" : "primary";
  return {
    ...cfg,
    placement,
    variant,
    counterMode,
    semanticType,
    size: "sm",
    appearance: isPositioned ? "filled" : inlineAppearance,
    colorMode: "semantic",
    hasBadgeIcon: false
  };
}
function resolveButtonStatus(cfg, buttonSize) {
  const placement = cfg.placement ?? "top-right";
  return {
    ...cfg,
    size: buttonSize,
    placement
  };
}
const ArvoButton = forwardRef(
  function ArvoButton2({
    variant = "primary",
    size = "md",
    type = "button",
    label,
    icon,
    isDisabled = false,
    isSelected,
    isFullWidth = false,
    isLoading: isLoadingProp = false,
    badge,
    status,
    hasTruncationTooltip = true,
    className,
    onClick,
    onKeyDown,
    ...rest
  }, ref) {
    const isLoading = isLoadingProp === true;
    const buttonRef = useRef(null);
    const labelRef = useRef(null);
    const truncationHandleRef = useRef(null);
    const setButtonRef = useCallback(
      (node) => {
        buttonRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    useEffect(() => {
      var _a;
      const btn = buttonRef.current;
      const lbl = labelRef.current;
      const enabled = hasTruncationTooltip && typeof label === "string" && label.length > 0;
      if (!btn || !lbl || !enabled) {
        (_a = truncationHandleRef.current) == null ? void 0 : _a.destroy();
        truncationHandleRef.current = null;
        return;
      }
      if (truncationHandleRef.current) {
        truncationHandleRef.current.update(label);
      } else {
        truncationHandleRef.current = attachTitleTruncationTooltip({
          triggerElement: btn,
          element: lbl,
          content: label,
          placement: "bottom-center"
        });
      }
      return () => {
        var _a2;
        (_a2 = truncationHandleRef.current) == null ? void 0 : _a2.destroy();
        truncationHandleRef.current = null;
      };
    }, [label, hasTruncationTooltip]);
    const classes = [
      "arvo-btn",
      `arvo-btn--${variant}`,
      `arvo-btn--${size}`,
      isFullWidth ? "arvo-btn--full-width" : "",
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
    const resolvedBadge = badge ? resolveButtonBadge(badge, variant) : null;
    const resolvedStatus = status ? resolveButtonStatus(status, size) : null;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref: setButtonRef,
        type,
        className: classes,
        disabled: isDisabled,
        "aria-busy": isLoading ? true : void 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        ...ariaPressedProp,
        ...rest,
        children: [
          icon && /* @__PURE__ */ jsx(
            "span",
            {
              className: `arvo-btn__ico o9con o9con-${icon}`,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "arvo-btn__lbl", ref: labelRef, children: label }),
          resolvedBadge && /* @__PURE__ */ jsx(ArvoBadge, { ...resolvedBadge }),
          resolvedStatus && /* @__PURE__ */ jsx(ArvoStatus, { ...resolvedStatus })
        ]
      }
    );
  }
);
export {
  ArvoButton,
  ArvoButton as default,
  resolveButtonBadge,
  resolveButtonStatus
};
//# sourceMappingURL=index16.js.map
