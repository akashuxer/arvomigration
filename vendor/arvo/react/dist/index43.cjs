"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const useControllableState = require("./index90.cjs");
const Avatar = require("./index40.cjs");
const Popover = require("./index27.cjs");
const Tooltip = require("./index65.cjs");
const VALID_SIZES = ["xs", "sm", "md", "lg", "xl"];
function clampMaxCount(input) {
  if (!Number.isFinite(input)) return 5;
  const n = Math.floor(input);
  return n < 1 ? 1 : n;
}
function defaultMoreLabel(hiddenCount) {
  return `${hiddenCount} additional collaborators`;
}
function hiddenNamesPhrase(hidden, cap = 8) {
  const names = hidden.map((h) => h.name ?? h.alt ?? h.id).filter(Boolean);
  if (names.length === 0) return "";
  if (names.length <= cap) return names.join(", ");
  return `${names.slice(0, cap).join(", ")}, and ${names.length - cap} more`;
}
function rowLabel(item) {
  return item.name ?? item.alt ?? item.id;
}
const ArvoAvatarGroup = React.forwardRef(
  function ArvoAvatarGroup2(props, ref) {
    const {
      avatars,
      size: sizeProp = "md",
      maxCount: maxCountProp,
      hasTooltip = true,
      tooltipPosition = "bottom",
      label = "avatar group",
      moreIndicatorLabel,
      isOpen: openProp,
      defaultOpen = false,
      onOpenChange,
      onMoreClick,
      overflowPlacement = "bottom",
      popoverProps,
      isDisabled = false,
      isLoading: isLoadingProp = false,
      className,
      ...rest
    } = props;
    const size = VALID_SIZES.includes(sizeProp) ? sizeProp : "md";
    const maxCount = clampMaxCount(maxCountProp);
    const isLoading = isLoadingProp === true;
    const { visible, hidden } = React.useMemo(() => {
      const total = avatars.length;
      if (total <= maxCount) {
        return { visible: avatars, hidden: [] };
      }
      const visibleCount = Math.max(0, maxCount - 1);
      return {
        visible: avatars.slice(0, visibleCount),
        hidden: avatars.slice(visibleCount)
      };
    }, [avatars, maxCount]);
    const [open, setOpenInternal] = useControllableState.useControllableState(
      openProp,
      defaultOpen
    );
    const setOpen = React.useCallback(
      (next) => {
        setOpenInternal(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [setOpenInternal, onOpenChange]
    );
    const blocked = isDisabled || isLoading;
    const effectiveOpen = open && !blocked && hidden.length > 0;
    const resolvedMoreLabel = moreIndicatorLabel ?? defaultMoreLabel(hidden.length);
    const overflowHoverText = hasTooltip && hidden.length > 0 ? hiddenNamesPhrase(hidden) : resolvedMoreLabel;
    const rootRef = React.useRef(null);
    const overflowBtnRef = React.useRef(null);
    const blockedRef = React.useRef(blocked);
    const onMoreClickRef = React.useRef(onMoreClick);
    React.useEffect(() => {
      blockedRef.current = blocked;
    }, [blocked]);
    React.useEffect(() => {
      onMoreClickRef.current = onMoreClick;
    }, [onMoreClick]);
    const setRootRef = React.useCallback(
      (node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    React.useLayoutEffect(() => {
      const btn = overflowBtnRef.current;
      if (!btn) return;
      const handler = (event) => {
        var _a;
        if (blockedRef.current) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        (_a = onMoreClickRef.current) == null ? void 0 : _a.call(onMoreClickRef, event);
        if (event.defaultPrevented) {
          event.stopImmediatePropagation();
        }
      };
      btn.addEventListener("click", handler, { capture: true });
      return () => btn.removeEventListener("click", handler, { capture: true });
    }, [hidden.length]);
    React.useEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const items = [];
      root.querySelectorAll(".arvo-avt-grp__item").forEach((wrap) => {
        if (wrap.classList.contains("arvo-avt-grp__item--overflow")) {
          if (overflowBtnRef.current) items.push(overflowBtnRef.current);
          return;
        }
        const inner = wrap.querySelector(".arvo-avt");
        if (inner) items.push(inner);
      });
      if (items.length === 0) return;
      const roving = core.createTabRoving();
      roving.activate({
        container: root,
        items,
        orientation: "horizontal",
        wrap: true
      });
      return () => roving.deactivate();
    }, [visible.length, hidden.length, avatars]);
    const handlePopoverOpenChange = React.useCallback(
      (next) => {
        if (blockedRef.current && next === true) return;
        if (next === open) return;
        setOpen(next);
      },
      [open, setOpen]
    );
    const classes = [
      "arvo-avt-grp",
      `arvo-avt-grp--${size}`,
      isLoading ? "loading" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const resolvedPlacement = overflowPlacement === "top" ? "top-end" : "bottom-end";
    const mergedPopoverProps = {
      ...popoverProps ?? {},
      triggerRef: overflowBtnRef,
      placement: resolvedPlacement,
      offset: (popoverProps == null ? void 0 : popoverProps.offset) ?? 4,
      isOpen: effectiveOpen,
      onOpenChange: handlePopoverOpenChange,
      // Suppress all unnecessary Popover chrome per spec.
      hasHeader: false,
      hasFooter: false,
      hasArrow: false,
      isClosable: false,
      hasBackButton: false,
      title: void 0,
      headerActions: void 0,
      actions: void 0
      // Default popover width = anchor-natural; consumers can override
      // via popoverProps.width.
    };
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ...rest,
        ref: setRootRef,
        role: "group",
        "aria-label": label,
        "aria-busy": isLoading || void 0,
        "aria-disabled": isDisabled || void 0,
        "data-arvo-loading": isLoading ? "true" : void 0,
        className: classes,
        children: [
          visible.map((item) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-avt-grp__item", children: /* @__PURE__ */ jsxRuntime.jsx(
            Avatar.ArvoAvatar,
            {
              ...item,
              size,
              isDisabled: isDisabled || item.isDisabled,
              isLoading,
              tooltip: hasTooltip ? item.tooltip ?? item.name ?? item.alt : void 0
            }
          ) }, item.id)),
          hidden.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "arvo-avt-grp__item arvo-avt-grp__item--overflow", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Tooltip.ArvoTooltip,
              {
                content: effectiveOpen ? "" : overflowHoverText,
                placement: tooltipPosition === "top" ? "top-center" : "bottom-center",
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    ref: overflowBtnRef,
                    type: "button",
                    className: `arvo-avt-grp__overflow${effectiveOpen ? " is-open" : ""}`,
                    "aria-label": resolvedMoreLabel,
                    "aria-haspopup": "dialog",
                    "aria-expanded": effectiveOpen,
                    "aria-disabled": blocked || void 0,
                    disabled: blocked || void 0,
                    "data-arvo-loading-ignore": "true",
                    children: `+${hidden.length}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(Popover.ArvoPopover, { ...mergedPopoverProps, children: /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "arvo-avt-grp__list", role: "list", children: hidden.map((item) => /* @__PURE__ */ jsxRuntime.jsxs("li", { className: "arvo-avt-grp__list-item", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                Avatar.ArvoAvatar,
                {
                  ...item,
                  size: "sm",
                  isInteractive: false,
                  isLoading: false
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-avt-grp__list-lbl", children: rowLabel(item) })
            ] }, item.id)) }) })
          ] })
        ]
      }
    );
  }
);
exports.ArvoAvatarGroup = ArvoAvatarGroup;
//# sourceMappingURL=index43.cjs.map
