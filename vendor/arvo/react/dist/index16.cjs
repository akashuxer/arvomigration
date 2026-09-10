"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const utils = require("@arvo/utils");
const Badge = require("./index45.cjs");
const Status = require("./index14.cjs");
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
const ArvoButton = React.forwardRef(
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
    const buttonRef = React.useRef(null);
    const labelRef = React.useRef(null);
    const truncationHandleRef = React.useRef(null);
    const setButtonRef = React.useCallback(
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
    React.useEffect(() => {
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
        truncationHandleRef.current = utils.attachTitleTruncationTooltip({
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
    return /* @__PURE__ */ jsxRuntime.jsxs(
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
          icon && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: `arvo-btn__ico o9con o9con-${icon}`,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-btn__lbl", ref: labelRef, children: label }),
          resolvedBadge && /* @__PURE__ */ jsxRuntime.jsx(Badge.ArvoBadge, { ...resolvedBadge }),
          resolvedStatus && /* @__PURE__ */ jsxRuntime.jsx(Status.ArvoStatus, { ...resolvedStatus })
        ]
      }
    );
  }
);
exports.ArvoButton = ArvoButton;
exports.default = ArvoButton;
exports.resolveButtonBadge = resolveButtonBadge;
exports.resolveButtonStatus = resolveButtonStatus;
//# sourceMappingURL=index16.cjs.map
