import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from "react";
import { prefersReducedMotion } from "@arvo/core";
import { attachTitleTruncationTooltip } from "@arvo/utils";
import { ArvoIconButton } from "./index17.js";
import { ArvoButton } from "./index16.js";
import ArvoLink from "./index32.js";
import { renderInlineContentReact } from "./index89.js";
const ASSERTIVE_TYPES = /* @__PURE__ */ new Set([
  "negative",
  "block"
]);
function resolveRole(type, roleProp) {
  if (roleProp) return roleProp;
  return ASSERTIVE_TYPES.has(type) ? "alert" : "status";
}
const ArvoBannerAlert = forwardRef(
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
    const hostRef = useRef(null);
    const titleRef = useRef(null);
    const titleTooltipRef = useRef(null);
    useImperativeHandle(ref, () => hostRef.current, []);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dismissingRef = useRef(false);
    useEffect(() => {
      const titleEl = titleRef.current;
      if (!titleEl || !title || isCompact) return;
      const handle = attachTitleTruncationTooltip({
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
      if (!el || prefersReducedMotion()) {
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
    const closeButton = isDismissible ? /* @__PURE__ */ jsx(
      ArvoIconButton,
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
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: hostRef,
        className: rootClasses,
        role: resolvedRole,
        "aria-busy": isLoading || void 0,
        ...rest,
        children: [
          /* @__PURE__ */ jsx("span", { className: "arvo-bnr-alert__ico o9con", "aria-hidden": "true", children: hasIconOverride ? /* @__PURE__ */ jsx("i", { className: `o9con o9con-${icon}` }) : null }),
          /* @__PURE__ */ jsx("div", { className: "arvo-bnr-alert__content", children: isCompact ? /* @__PURE__ */ jsx("p", { className: "arvo-bnr-alert__msg", children: typeof message === "string" ? message : renderInlineContentReact(message, { profile: "basic-inline" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "arvo-bnr-alert__copy", children: [
              title != null && /* @__PURE__ */ jsx("p", { ref: titleRef, className: "arvo-bnr-alert__title", children: title }),
              /* @__PURE__ */ jsx("p", { className: "arvo-bnr-alert__msg", children: typeof message === "string" ? message : renderInlineContentReact(message, {
                profile: "basic-inline"
              }) })
            ] }),
            hasActions && /* @__PURE__ */ jsxs("div", { className: "arvo-bnr-alert__actions", children: [
              button && /* @__PURE__ */ jsx(
                ArvoButton,
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
              link && /* @__PURE__ */ jsx(
                ArvoLink,
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
export {
  ArvoBannerAlert,
  ArvoBannerAlert as default
};
//# sourceMappingURL=index48.js.map
