"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const utils = require("@arvo/utils");
const IconButton = require("./index17.cjs");
const Button = require("./index16.cjs");
const Link = require("./index32.cjs");
const inlineContent = require("./index89.cjs");
const ASSERTIVE_TYPES = /* @__PURE__ */ new Set([
  "negative",
  "block"
]);
function resolveRole(type, roleProp) {
  if (roleProp) return roleProp;
  return ASSERTIVE_TYPES.has(type) ? "alert" : "status";
}
const ArvoBannerAlert = React.forwardRef(
  function ArvoBannerAlert2({
    message,
    type = "info",
    title = null,
    isCompact = false,
    isDismissible = true,
    button,
    link,
    icon,
    isLoading: isLoadingProp = false,
    role: roleProp,
    onDismiss,
    className,
    ...rest
  }, ref) {
    var _a;
    const isLoading = isLoadingProp === true;
    const resolvedRole = resolveRole(type, roleProp);
    const hostRef = React.useRef(null);
    const titleRef = React.useRef(null);
    const titleTooltipRef = React.useRef(null);
    React.useImperativeHandle(ref, () => hostRef.current, []);
    const [isDismissed, setIsDismissed] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const dismissingRef = React.useRef(false);
    React.useEffect(() => {
      const titleEl = titleRef.current;
      if (!titleEl || !title || isCompact) return;
      const handle = utils.attachTitleTruncationTooltip({
        element: titleEl,
        content: title,
        placement: "bottom-center"
      });
      titleTooltipRef.current = handle;
      return () => {
        handle.destroy();
        titleTooltipRef.current = null;
      };
    }, [title, isCompact]);
    if (isCompact && title != null && typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a.NODE_ENV) !== "production" && typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn(
        "[ArvoBannerAlert] `title` is ignored when `isCompact` is true. The title will not be rendered in compact mode."
      );
    }
    const hasTitle = !isCompact && title != null;
    const hasIconOverride = type === "neutral" && !!icon;
    const rootClasses = [
      "arvo-bnr-alert",
      `arvo-bnr-alert--${type}`,
      isCompact ? "arvo-bnr-alert--compact" : "",
      !hasTitle ? "arvo-bnr-alert--no-title" : "",
      isLoading ? "loading" : "",
      isClosing ? "is-closing" : "",
      hasIconOverride ? "has-icon-override" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const handleDismiss = () => {
      var _a2;
      if (dismissingRef.current) return;
      dismissingRef.current = true;
      const event = new CustomEvent("bnr-alert:dismiss", {
        bubbles: false,
        cancelable: false
      });
      (_a2 = hostRef.current) == null ? void 0 : _a2.dispatchEvent(event);
      onDismiss == null ? void 0 : onDismiss();
      const el = hostRef.current;
      if (!el || core.prefersReducedMotion()) {
        setIsDismissed(true);
        return;
      }
      el.style.maxHeight = `${el.offsetHeight}px`;
      void el.offsetHeight;
      setIsClosing(true);
      el.style.maxHeight = "0";
      const onEnd = (e) => {
        if (e.propertyName !== "opacity") return;
        el.removeEventListener("transitionend", onEnd);
        setIsDismissed(true);
      };
      el.addEventListener("transitionend", onEnd);
    };
    const closeButton = isDismissible ? /* @__PURE__ */ jsxRuntime.jsx(
      IconButton.ArvoIconButton,
      {
        className: "arvo-bnr-alert__close",
        variant: "tertiary",
        size: "xs",
        icon: "close",
        tooltip: "Dismiss alert",
        onClick: handleDismiss
      }
    ) : null;
    const hasActions = !isCompact && (button != null || link != null);
    if (isDismissed) return null;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: hostRef,
        className: rootClasses,
        role: resolvedRole,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-bnr-alert__ico o9con", "aria-hidden": "true", children: hasIconOverride ? /* @__PURE__ */ jsxRuntime.jsx("i", { className: `o9con o9con-${icon}` }) : null }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-bnr-alert__content", children: isCompact ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "arvo-bnr-alert__msg", children: typeof message === "string" ? message : inlineContent.renderInlineContentReact(message, { profile: "basic-inline" }) }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-bnr-alert__copy", children: [
              title != null && /* @__PURE__ */ jsxRuntime.jsx("p", { ref: titleRef, className: "arvo-bnr-alert__title", children: title }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "arvo-bnr-alert__msg", children: typeof message === "string" ? message : inlineContent.renderInlineContentReact(message, {
                profile: "basic-inline"
              }) })
            ] }),
            hasActions && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "arvo-bnr-alert__actions", children: [
              button && /* @__PURE__ */ jsxRuntime.jsx(
                Button.ArvoButton,
                {
                  className: "arvo-bnr-alert__btn",
                  variant: "outline",
                  size: "sm",
                  label: button.label,
                  icon: button.icon,
                  isDisabled: button.isDisabled,
                  isLoading: button.isLoading,
                  "aria-label": button.ariaLabel,
                  onClick: button.onClick
                }
              ),
              link && /* @__PURE__ */ jsxRuntime.jsx(
                Link.default,
                {
                  className: "arvo-bnr-alert__link",
                  size: "sm",
                  variant: "primary",
                  label: link.label,
                  href: link.href,
                  target: link.target,
                  rel: link.rel,
                  icon: link.icon,
                  isExternal: link.isExternal,
                  "aria-label": link.ariaLabel,
                  onClick: link.onClick
                }
              )
            ] })
          ] }) }),
          closeButton
        ]
      }
    );
  }
);
ArvoBannerAlert.displayName = "ArvoBannerAlert";
exports.ArvoBannerAlert = ArvoBannerAlert;
exports.default = ArvoBannerAlert;
//# sourceMappingURL=index48.cjs.map
