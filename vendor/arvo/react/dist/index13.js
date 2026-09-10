import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useRef, useState, useCallback } from "react";
import { prefersReducedMotion } from "@arvo/core";
import { ArvoIconButton } from "./index17.js";
const ARVO_MSG_ALERT_DEFAULT_ERROR = "Form field value is invalid";
const TYPE_DEFAULT_LABEL = {
  negative: "Error",
  positive: "Success",
  warning: "Warning",
  info: "Information",
  neutral: "Notice",
  block: "Blocked"
};
function resolveRole(type) {
  return type === "negative" || type === "warning" || type === "block" ? "alert" : "status";
}
const ArvoMessageAlertBase = forwardRef(
  function ArvoMessageAlert2({
    type = "negative",
    isInline = false,
    message,
    icon,
    isDismissable = false,
    onDismiss,
    id,
    role,
    className,
    ...rest
  }, forwardedRef) {
    const internalRef = useRef(null);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dismissingRef = useRef(false);
    const setRef = useCallback(
      (node) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );
    const handleDismiss = useCallback(() => {
      if (dismissingRef.current) return;
      dismissingRef.current = true;
      const node = internalRef.current;
      if (node) {
        node.dispatchEvent(new CustomEvent("msg-alert:dismiss", { bubbles: true }));
      }
      onDismiss == null ? void 0 : onDismiss();
      if (!node || prefersReducedMotion()) {
        setIsDismissed(true);
        return;
      }
      node.style.maxHeight = `${node.offsetHeight}px`;
      void node.offsetHeight;
      setIsClosing(true);
      node.style.maxHeight = "0";
      const onEnd = (e) => {
        if (e.propertyName !== "opacity") return;
        node.removeEventListener("transitionend", onEnd);
        setIsDismissed(true);
      };
      node.addEventListener("transitionend", onEnd);
    }, [onDismiss]);
    const resolvedRole = role ?? resolveRole(type);
    const hasIconOverride = !!icon && type === "neutral";
    const showCloseButton = isDismissable && !isInline;
    const classes = [
      "arvo-msg-alert",
      `arvo-msg-alert--${type}`,
      isInline && "arvo-msg-alert--inline",
      showCloseButton && "arvo-msg-alert--dismissable",
      hasIconOverride && "has-icon-override",
      isClosing && "is-closing",
      className
    ].filter(Boolean).join(" ");
    if (isDismissed) return null;
    if (isInline) {
      const ariaLabel = typeof message === "string" && message.length > 0 ? message : TYPE_DEFAULT_LABEL[type];
      return /* @__PURE__ */ jsx(
        "div",
        {
          ref: setRef,
          className: classes,
          role: resolvedRole,
          id,
          "aria-label": ariaLabel,
          ...rest,
          children: /* @__PURE__ */ jsx("span", { className: "arvo-msg-alert__ico", "aria-hidden": "true", children: hasIconOverride ? /* @__PURE__ */ jsx("i", { className: `o9con o9con-${icon}` }) : null })
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: setRef,
        className: classes,
        role: resolvedRole,
        id,
        ...rest,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "arvo-msg-alert__body", children: [
            /* @__PURE__ */ jsx("span", { className: "arvo-msg-alert__ico", "aria-hidden": "true", children: hasIconOverride ? /* @__PURE__ */ jsx("i", { className: `o9con o9con-${icon}` }) : null }),
            /* @__PURE__ */ jsx("span", { className: "arvo-msg-alert__msg", children: message })
          ] }),
          showCloseButton ? /* @__PURE__ */ jsx(
            ArvoIconButton,
            {
              className: "arvo-msg-alert__close",
              variant: "tertiary",
              size: "xs",
              icon: "close",
              tooltip: "Dismiss",
              onClick: handleDismiss
            }
          ) : null
        ]
      }
    );
  }
);
ArvoMessageAlertBase.displayName = "ArvoMessageAlert";
const ArvoMessageAlert = ArvoMessageAlertBase;
ArvoMessageAlert.defaultErrorMessage = ARVO_MSG_ALERT_DEFAULT_ERROR;
export {
  ARVO_MSG_ALERT_DEFAULT_ERROR,
  ArvoMessageAlert,
  ArvoMessageAlert as default
};
//# sourceMappingURL=index13.js.map
