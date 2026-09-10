"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const require$$0 = require("react-dom");
const useOverlaySurface = require("./index92.cjs");
const MenuContent = require("./index103.cjs");
const PANEL_STYLE_BASE = {};
function Submenu(props) {
  const {
    items,
    context,
    parentId,
    anchorRef,
    ariaLabel,
    isOpen,
    onClose,
    onSelect
  } = props;
  const panelRef = React.useRef(null);
  const {
    isOpen: surfaceOpen,
    isMounted,
    positioned,
    panelStyle,
    surfaceId
  } = useOverlaySurface.useOverlaySurface({
    type: "action-menu",
    priority: 15,
    parentId,
    relation: "submenu",
    triggerRef: anchorRef,
    panelRef,
    isOpen,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
    placement: "right-start",
    gap: 0,
    focus: "trap",
    initialFocus: "first",
    closeOnEscape: false,
    closeOnOutside: true,
    transition: "fade",
    haspopup: "menu",
    triggerAria: false
  });
  React.useEffect(() => {
    if (!surfaceOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [surfaceOpen, onClose]);
  if (!isMounted) return null;
  return require$$0.createPortal(
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: panelRef,
        id: surfaceId,
        className: "arvo-context-menu",
        role: "menu",
        "aria-label": ariaLabel,
        style: { ...PANEL_STYLE_BASE, ...panelStyle },
        "data-positioned": positioned ? "true" : void 0,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "arvo-context-menu__scroll", children: /* @__PURE__ */ jsxRuntime.jsx(
          MenuContent.MenuContent,
          {
            items,
            context,
            surfaceId,
            parentSurfaceId: surfaceId,
            onSelect,
            onRequestClose: onClose
          }
        ) })
      }
    ),
    document.body
  );
}
exports.Submenu = Submenu;
//# sourceMappingURL=index110.cjs.map
