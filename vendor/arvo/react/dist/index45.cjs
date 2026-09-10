"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const Status = require("./index14.cjs");
const ARVO_BADGE_PLACEMENTS = [
  "inline",
  "top-right"
];
const SEMANTIC_ICON_MAP = {
  positive: "check-circle",
  info: "info-circle-filled",
  neutral: "speaker",
  warning: "exclamation-triangle-filled",
  negative: "exclamation-circle-filled",
  block: "blocker-action-filled",
  none: null
};
function resolveIcon(colorMode, semanticType, iconProp) {
  if (iconProp) return iconProp;
  if (colorMode === "semantic" && semanticType !== "none") {
    return SEMANTIC_ICON_MAP[semanticType];
  }
  return null;
}
const ArvoBadge = React.forwardRef(
  function ArvoBadge2({
    variant = "label",
    size = "md",
    appearance = "primary",
    colorMode = "semantic",
    semanticType = "neutral",
    customColor = "purple",
    message = "Status Message",
    counterMode = "single",
    count = 0,
    total,
    overflowCount = 99,
    hideWhenZero = true,
    autoFormat = false,
    localeAware = false,
    hasBadgeIcon = true,
    icon,
    placement = "inline",
    hasStatus = false,
    statusType = "available",
    statusPosition = "top-right",
    tooltip,
    role = "status",
    className,
    ...rest
  }, ref) {
    const safePlacement = ARVO_BADGE_PLACEMENTS.includes(placement) ? placement : "inline";
    const [animClass, setAnimClass] = React.useState("");
    const prevCountRef = React.useRef(null);
    React.useEffect(() => {
      if (variant !== "counter") return;
      const prev = prevCountRef.current;
      if (prev !== null) {
        if (count > prev) {
          setAnimClass("is-increasing");
        } else if (count < prev) {
          setAnimClass("is-decreasing");
        }
      }
      prevCountRef.current = count;
    }, [count, variant]);
    if (variant === "counter" && counterMode === "single" && hideWhenZero && count === 0) {
      return null;
    }
    const colorClass = colorMode === "custom" || semanticType === "none" ? `arvo-bdg--${customColor}` : `arvo-bdg--${semanticType}`;
    const classes = [
      "arvo-bdg",
      `arvo-bdg--${variant}`,
      `arvo-bdg--${size}`,
      `arvo-bdg--${appearance}`,
      colorClass,
      variant === "counter" ? `arvo-bdg--${counterMode}` : "",
      `arvo-bdg--${safePlacement}`,
      className
    ].filter(Boolean).join(" ");
    const resolvedIcon = resolveIcon(colorMode, semanticType, icon);
    let accessibleName;
    if (tooltip) {
      accessibleName = tooltip;
    } else if (variant === "counter") {
      if (counterMode === "single") {
        accessibleName = count > overflowCount ? `${overflowCount} or more` : String(count);
      } else {
        accessibleName = `${count} out of ${total ?? 0}`;
      }
    }
    const labelProps = {};
    if (accessibleName) labelProps["aria-label"] = accessibleName;
    if (tooltip) labelProps.title = tooltip;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "span",
      {
        ...rest,
        ref,
        className: classes,
        role,
        ...labelProps,
        children: [
          hasBadgeIcon && resolvedIcon && /* @__PURE__ */ jsxRuntime.jsx(
            "i",
            {
              className: `arvo-bdg__ico o9con o9con-${resolvedIcon}`,
              "aria-hidden": "true"
            }
          ),
          variant === "label" && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-bdg__msg", children: message }),
          variant === "counter" && counterMode === "single" && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: ["arvo-bdg__count", animClass].filter(Boolean).join(" "),
              onAnimationEnd: () => setAnimClass(""),
              children: core.formatBadgeCount(count, { autoFormat, overflowCount, localeAware })
            }
          ),
          variant === "counter" && counterMode === "ratio" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                className: ["arvo-bdg__count", animClass].filter(Boolean).join(" "),
                onAnimationEnd: () => setAnimClass(""),
                children: core.formatBadgeCount(count, { autoFormat, localeAware, isRatioPart: true })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-bdg__sep", "aria-hidden": "true", children: "/" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-bdg__total", children: core.formatBadgeCount(total ?? 0, { autoFormat, localeAware, isRatioPart: true }) })
          ] }),
          hasStatus && /* @__PURE__ */ jsxRuntime.jsx(
            Status.ArvoStatus,
            {
              type: statusType,
              placement: statusPosition,
              size: "sm"
            }
          )
        ]
      }
    );
  }
);
exports.ARVO_BADGE_PLACEMENTS = ARVO_BADGE_PLACEMENTS;
exports.ArvoBadge = ArvoBadge;
exports.default = ArvoBadge;
//# sourceMappingURL=index45.cjs.map
