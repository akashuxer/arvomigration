import { jsxs, jsx } from "react/jsx-runtime";
import { createContext, useState, useRef, useEffect, useLayoutEffect, useCallback, useContext } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "@arvo/core";
import { attachTitleTruncationTooltip } from "@arvo/utils";
import { renderInlineContentReact } from "./index89.js";
import { useOverlaySurface } from "./index92.js";
import { ArvoIconButton } from "./index17.js";
import ArvoLink from "./index32.js";
const ToastContext = createContext(null);
function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within an ArvoToastProvider");
  }
  return ctx;
}
const NO_AUTO_DISMISS = /* @__PURE__ */ new Set(["block"]);
const ALERT_ROLES = /* @__PURE__ */ new Set(["negative", "block"]);
const DEFAULT_TIMEOUT_BY_TYPE = {
  positive: 4e3,
  neutral: 4e3,
  info: 5e3,
  warning: 6e3,
  negative: 8e3,
  block: null
};
const TYPE_SR_LABEL = {
  negative: "Error",
  block: "Blocked",
  warning: "Warning",
  info: "Info",
  positive: "Success",
  neutral: "Notification"
};
const LAYOUT_SHIFT_DURATION_MS = 220;
const LAYOUT_SHIFT_EASING = "cubic-bezier(0.2, 0, 0, 1)";
let toastCounter = 0;
function ToastItem({ entry, onRemove }) {
  const {
    id,
    type = "info",
    title,
    message,
    fadeAway: fadeAwayProp = true,
    timeout: timeoutProp,
    pauseOnHover = true,
    icon,
    link,
    className,
    onMouseEnter: onMouseEnterCb,
    onMouseLeave: onMouseLeaveCb
  } = entry;
  const resolvedTimeout = timeoutProp !== void 0 ? timeoutProp : DEFAULT_TIMEOUT_BY_TYPE[type];
  const shouldFade = !NO_AUTO_DISMISS.has(type) && fadeAwayProp && resolvedTimeout !== null && resolvedTimeout !== void 0;
  const timeout = resolvedTimeout ?? 0;
  const role = ALERT_ROLES.has(type) ? "alert" : "status";
  const elRef = useRef(null);
  const titleRef = useRef(null);
  const titleTooltipRef = useRef(null);
  const timerRef = useRef(null);
  const removedRef = useRef(false);
  const remove = useCallback((reason) => {
    if (removedRef.current) return;
    removedRef.current = true;
    onRemove(id, reason);
  }, [id, onRemove]);
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl || !title) return;
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
  }, [title]);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handle = requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });
    return () => cancelAnimationFrame(handle);
  }, []);
  const playExit = useCallback(() => {
    const el = elRef.current;
    if (!el) {
      remove("fade");
      return;
    }
    if (prefersReducedMotion()) {
      remove("fade");
      return;
    }
    el.classList.remove("is-paused");
    el.classList.remove("is-visible");
    el.classList.add("is-removing");
    const onEnd = (event) => {
      if (event.propertyName && event.propertyName !== "opacity") return;
      el.removeEventListener("transitionend", onEnd);
      remove("fade");
    };
    el.addEventListener("transitionend", onEnd);
  }, [remove]);
  useEffect(() => {
    if (!shouldFade) return;
    timerRef.current = setTimeout(() => {
      playExit();
    }, timeout);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const handleMouseEnter = useCallback(() => {
    onMouseEnterCb == null ? void 0 : onMouseEnterCb();
    if (!shouldFade || !pauseOnHover) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const el = elRef.current;
    if (el) {
      el.classList.add("is-paused");
    }
  }, [shouldFade, pauseOnHover, onMouseEnterCb]);
  const handleMouseLeave = useCallback(() => {
    onMouseLeaveCb == null ? void 0 : onMouseLeaveCb();
    if (!shouldFade || !pauseOnHover) return;
    const el = elRef.current;
    if (el) {
      el.classList.remove("is-paused");
    }
    timerRef.current = setTimeout(() => {
      playExit();
    }, timeout);
  }, [shouldFade, pauseOnHover, timeout, playExit, onMouseLeaveCb]);
  const handleCloseClick = useCallback(() => {
    remove("click");
  }, [remove]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      remove("escape");
    }
  }, [remove]);
  const hasIconOverride = type === "neutral" && !!icon;
  const rootClasses = [
    "arvo-toast",
    `arvo-toast--${type}`,
    hasIconOverride && "has-icon-override",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: elRef,
      className: rootClasses,
      "data-toast-id": id,
      role,
      "aria-atomic": "true",
      tabIndex: 0,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      children: [
        /* @__PURE__ */ jsxs("span", { className: "arvo-sr-only", children: [
          TYPE_SR_LABEL[type],
          ": "
        ] }),
        /* @__PURE__ */ jsx("span", { className: "arvo-toast__ico o9con", "aria-hidden": "true", children: hasIconOverride ? /* @__PURE__ */ jsx("i", { className: `o9con o9con-${icon}` }) : null }),
        /* @__PURE__ */ jsxs("div", { className: "arvo-toast__content", children: [
          /* @__PURE__ */ jsxs("div", { className: "arvo-toast__text", children: [
            title && /* @__PURE__ */ jsx("p", { ref: titleRef, className: "arvo-toast__title", children: title }),
            /* @__PURE__ */ jsx("p", { className: "arvo-toast__msg", children: typeof message === "string" ? message : renderInlineContentReact(message, { profile: "basic-inline" }) })
          ] }),
          link && /* @__PURE__ */ jsx(
            ArvoLink,
            {
              size: "sm",
              variant: "primary",
              label: link.label,
              href: link.href,
              icon: link.icon,
              isExternal: link.isExternal,
              onClick: link.onClick
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            icon: "close",
            size: "xs",
            variant: "tertiary",
            tooltip: "Close notification",
            onClick: handleCloseClick
          }
        )
      ]
    }
  );
}
function ArvoToastProvider({ position = "top-right", children }) {
  const [toasts, setToasts] = useState([]);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const toastsRef = useRef([]);
  const removingIdsRef = useRef(/* @__PURE__ */ new Set());
  if (!containerRef.current && typeof document !== "undefined") {
    const el = document.createElement("div");
    el.className = `arvo-toast-container arvo-toast-container--${position}`;
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Notifications");
    containerRef.current = el;
  }
  useOverlaySurface({
    type: "toast",
    priority: 0,
    triggerRef,
    panelRef: containerRef,
    isOpen: true,
    defaultOpen: true,
    positioned: false,
    focus: "none",
    closeOnEscape: false,
    closeOnOutside: false,
    transition: null,
    triggerAria: false,
    emitStyle: false
  });
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    document.body.appendChild(container);
    return () => {
      container.remove();
    };
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.className = `arvo-toast-container arvo-toast-container--${position}`;
  }, [position]);
  useEffect(() => {
    toastsRef.current = toasts;
    const currentIds = new Set(toasts.map((t) => t.id));
    for (const id of removingIdsRef.current) {
      if (!currentIds.has(id)) removingIdsRef.current.delete(id);
    }
  }, [toasts]);
  const positionsRef = useRef(/* @__PURE__ */ new Map());
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reducedMotion = prefersReducedMotion();
    const previous = positionsRef.current;
    const next = /* @__PURE__ */ new Map();
    const elements = container.querySelectorAll("[data-toast-id]");
    elements.forEach((el) => {
      const id = el.getAttribute("data-toast-id");
      if (!id) return;
      const lastRect = el.getBoundingClientRect();
      next.set(id, lastRect);
      if (reducedMotion) return;
      const firstRect = previous.get(id);
      if (!firstRect) return;
      const deltaY = firstRect.top - lastRect.top;
      if (deltaY === 0) return;
      if (typeof el.animate !== "function") return;
      el.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0)" }
        ],
        {
          duration: LAYOUT_SHIFT_DURATION_MS,
          easing: LAYOUT_SHIFT_EASING
        }
      );
    });
    positionsRef.current = next;
  }, [toasts]);
  const removeToast = useCallback((id, reason) => {
    var _a;
    if (removingIdsRef.current.has(id)) return;
    const target = toastsRef.current.find((t) => t.id === id);
    if (!target) return;
    removingIdsRef.current.add(id);
    try {
      (_a = target.onClose) == null ? void 0 : _a.call(target);
    } catch (err) {
      console.error(err);
    }
    const container = containerRef.current;
    if (container) {
      container.dispatchEvent(new CustomEvent("toast:close", {
        bubbles: true,
        cancelable: false,
        detail: { id, reason }
      }));
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const show = useCallback((options) => {
    const id = `arvo-toast-${++toastCounter}`;
    const entry = { ...options, id };
    setToasts((prev) => [entry, ...prev]);
    toastsRef.current = [entry, ...toastsRef.current];
    return id;
  }, []);
  const close = useCallback((id) => {
    removeToast(id, "programmatic");
  }, [removeToast]);
  const closeAll = useCallback(() => {
    const ids = toastsRef.current.map((t) => t.id);
    for (const id of ids) {
      removeToast(id, "programmatic");
    }
  }, [removeToast]);
  const contextValue = { show, close, closeAll };
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: contextValue, children: [
    children,
    containerRef.current && createPortal(
      toasts.map((entry) => /* @__PURE__ */ jsx(
        ToastItem,
        {
          entry,
          onRemove: removeToast
        },
        entry.id
      )),
      containerRef.current
    )
  ] });
}
export {
  ArvoToastProvider,
  useToast
};
//# sourceMappingURL=index54.js.map
