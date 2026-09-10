import { jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useOverlaySurface } from "./index92.js";
import { MenuContent } from "./index103.js";
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
  const panelRef = useRef(null);
  const {
    isOpen: surfaceOpen,
    isMounted,
    positioned,
    panelStyle,
    surfaceId
  } = useOverlaySurface({
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
  useEffect(() => {
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
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: panelRef,
        id: surfaceId,
        className: "arvo-context-menu",
        role: "menu",
        "aria-label": ariaLabel,
        style: { ...PANEL_STYLE_BASE, ...panelStyle },
        "data-positioned": positioned ? "true" : void 0,
        children: /* @__PURE__ */ jsx("div", { className: "arvo-context-menu__scroll", children: /* @__PURE__ */ jsx(
          MenuContent,
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
export {
  Submenu
};
//# sourceMappingURL=index110.js.map
