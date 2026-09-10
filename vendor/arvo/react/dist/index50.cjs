"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const useOverlaySurface = require("./index92.cjs");
const useContextMenuController = require("./index96.cjs");
const MenuContent = require("./index103.cjs");
require("@arvo/utils");
const EmptyState = require("./index88.cjs");
function ArvoContextMenuInner(props, ref) {
  const {
    targetRef,
    items,
    contextSelector,
    resolveContext,
    placement = "bottom-start",
    closeOnSelect = true,
    isDisabled = false,
    longPressMs = 0,
    keyboard = true,
    closeOnEscape = true,
    closeOnOutside = true,
    ariaLabel = "Context menu",
    ariaLabelledBy,
    emptyConfig,
    className,
    onContextRequest,
    onOpen,
    onClose,
    onSelect,
    onOpenChange
  } = props;
  const emptyConfigRef = React.useRef(emptyConfig);
  emptyConfigRef.current = emptyConfig;
  const panelRef = React.useRef(null);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const [openState, setOpenState] = React.useState(null);
  const [disabledLocal, setDisabledLocal] = React.useState(isDisabled);
  React.useEffect(() => setDisabledLocal(isDisabled), [isDisabled]);
  const anchorRect = openState && openState.request.anchor.kind === "point" ? { x: openState.request.anchor.x, y: openState.request.anchor.y } : null;
  const triggerVirtualRef = React.useRef(null);
  triggerVirtualRef.current = openState && openState.request.anchor.kind === "element" ? openState.request.anchor.element : null;
  const surface = useOverlaySurface.useOverlaySurface({
    type: "action-menu",
    priority: 15,
    triggerRef: triggerVirtualRef,
    anchorRect,
    panelRef,
    isOpen: openState != null,
    onOpenChange: (next) => {
      if (!next && openState) {
        const target = openState.request.invoker;
        setOpenState(null);
        onOpenChange == null ? void 0 : onOpenChange(false);
        if (openState.request.anchor.kind === "point") {
          window.setTimeout(() => {
            try {
              target.focus({ preventScroll: true });
            } catch {
            }
          }, 0);
        }
      }
    },
    placement,
    gap: 0,
    focus: "trap",
    initialFocus: "first",
    closeOnEscape: false,
    // owned at the component level for submenu unwind
    closeOnOutside,
    transition: "fade",
    triggerAria: false,
    haspopup: "menu"
  });
  const resolveItems = React.useCallback(
    (context) => {
      const it = itemsRef.current;
      return typeof it === "function" ? it(context) : it;
    },
    []
  );
  const programmaticClose = React.useCallback(() => {
    if (!openState) return;
    if ((onClose == null ? void 0 : onClose()) === false) return;
    setOpenState(null);
    onOpenChange == null ? void 0 : onOpenChange(false);
  }, [openState, onClose, onOpenChange]);
  React.useEffect(() => {
    if (!openState || !closeOnEscape) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      programmaticClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openState, closeOnEscape, programmaticClose]);
  React.useEffect(() => {
    if (openState == null) return;
    const target = targetRef.current;
    if (!target) return;
    const onWindowDown = (e) => {
      if (e.button !== 2) return;
      const t = e.target;
      if (!t || !target.contains(t)) return;
      e.stopPropagation();
    };
    window.addEventListener("pointerdown", onWindowDown, true);
    window.addEventListener("mousedown", onWindowDown, true);
    return () => {
      window.removeEventListener("pointerdown", onWindowDown, true);
      window.removeEventListener("mousedown", onWindowDown, true);
    };
  }, [openState, targetRef]);
  useContextMenuController.useContextMenuController({
    targetRef,
    contextSelector,
    resolveContext,
    longPressMs,
    keyboard,
    disabled: disabledLocal,
    onRequest: (request, helpers) => {
      if ((onContextRequest == null ? void 0 : onContextRequest(request)) === false) return false;
      const resolved = resolveItems(request.context);
      if (Array.isArray(resolved) && resolved.length === 0 && !emptyConfigRef.current) {
        return false;
      }
      if ((onOpen == null ? void 0 : onOpen(request)) === false) return false;
      helpers.preventDefault();
      const wasOpen = openState != null;
      setOpenState({ request, items: resolved });
      if (!wasOpen) onOpenChange == null ? void 0 : onOpenChange(true);
      return true;
    }
  });
  const handleSelect = React.useCallback(
    (info) => {
      onSelect == null ? void 0 : onSelect(info);
      if (info.closeOnSelect && closeOnSelect) {
        setOpenState(null);
        onOpenChange == null ? void 0 : onOpenChange(false);
      }
    },
    [closeOnSelect, onOpenChange, onSelect]
  );
  const handleRequestClose = React.useCallback(() => {
    programmaticClose();
  }, [programmaticClose]);
  React.useImperativeHandle(
    ref,
    () => ({
      open(req) {
        if (disabledLocal) return;
        let request;
        if (req && "modality" in req && "context" in req && "originalEvent" in req) {
          request = req;
        } else {
          const invoker = (req == null ? void 0 : req.invoker) ?? targetRef.current ?? document.body;
          const anchor = (req == null ? void 0 : req.anchor) ?? { kind: "element", element: invoker };
          const context = (req == null ? void 0 : req.context) ?? (resolveContext ? resolveContext(invoker) : null);
          request = {
            invoker,
            anchor,
            context,
            modality: (req == null ? void 0 : req.modality) ?? "pointer",
            originalEvent: (req == null ? void 0 : req.originalEvent) ?? new MouseEvent("contextmenu")
          };
        }
        if ((onContextRequest == null ? void 0 : onContextRequest(request)) === false) return;
        const resolved = resolveItems(request.context);
        if (Array.isArray(resolved) && resolved.length === 0 && !emptyConfigRef.current) {
          return;
        }
        if ((onOpen == null ? void 0 : onOpen(request)) === false) return;
        setOpenState({ request, items: resolved });
        onOpenChange == null ? void 0 : onOpenChange(true);
      },
      close() {
        programmaticClose();
      },
      isOpen() {
        return openState != null;
      },
      updateItems(next) {
        itemsRef.current = next;
        if (openState) {
          setOpenState({
            request: openState.request,
            items: typeof next === "function" ? next(openState.request.context) : next
          });
        }
      },
      disabled(state) {
        if (state === void 0) return disabledLocal;
        setDisabledLocal(state);
        return state;
      },
      getPanelElement() {
        return panelRef.current;
      }
    }),
    [
      disabledLocal,
      openState,
      onContextRequest,
      onOpen,
      onOpenChange,
      programmaticClose,
      resolveContext,
      resolveItems,
      targetRef
    ]
  );
  if (!surface.isMounted || !openState) return null;
  const panelClasses = ["arvo-context-menu"];
  if (className) panelClasses.push(className);
  const itemsEmpty = Array.isArray(openState.items) && openState.items.length === 0;
  const showEmpty = itemsEmpty && !!emptyConfig;
  return require$$0.createPortal(
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: panelRef,
        id: surface.surfaceId,
        className: panelClasses.join(" "),
        role: "menu",
        "aria-label": ariaLabelledBy ? void 0 : ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "data-arvo-side": surface.panelSide,
        style: surface.panelStyle,
        "data-positioned": surface.positioned ? "true" : void 0,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-context-menu__scroll", children: showEmpty ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-context-menu__empty", children: /* @__PURE__ */ jsxRuntime.jsx(
          EmptyState.default,
          {
            illustration: "no-data",
            title: "No options available",
            message: "There are no actions to display for this item.",
            ...emptyConfig,
            size: "sm",
            orientation: "vertical"
          }
        ) }) : /* @__PURE__ */ jsxRuntime.jsx(
          MenuContent.MenuContent,
          {
            items: openState.items,
            context: openState.request.context,
            surfaceId: surface.surfaceId,
            parentSurfaceId: surface.surfaceId,
            onSelect: handleSelect,
            onRequestClose: handleRequestClose,
            autoFocusFirst: false
          }
        ) })
      }
    ),
    document.body
  );
}
const ForwardedArvoContextMenu = React.forwardRef(ArvoContextMenuInner);
const ArvoContextMenu = ForwardedArvoContextMenu;
exports.ArvoContextMenu = ArvoContextMenu;
//# sourceMappingURL=index50.cjs.map
