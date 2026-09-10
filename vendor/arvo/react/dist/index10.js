import { useRef, useEffect } from "react";
import { connectTooltip, tooltipManager } from "@arvo/core";
import { useTooltipManager } from "./index5.js";
function resolveConfig(tooltip) {
  return typeof tooltip === "string" ? { content: tooltip } : tooltip;
}
function useTooltip(options) {
  const { triggerRef, tooltip, labelRef, autoOnTruncation } = options;
  const ctxManager = useTooltipManager();
  const manager = ctxManager ?? tooltipManager;
  const connectorRef = useRef(null);
  useEffect(() => {
    var _a;
    const anchor = triggerRef.current;
    if (!anchor || !tooltip) {
      (_a = connectorRef.current) == null ? void 0 : _a.destroy();
      connectorRef.current = null;
      return;
    }
    const config = resolveConfig(tooltip);
    if (connectorRef.current) {
      connectorRef.current.update({
        anchor,
        content: config.content,
        placement: config.placement,
        shortcut: config.shortcut,
        labelElement: (labelRef == null ? void 0 : labelRef.current) ?? void 0,
        autoOnTruncation
      });
    } else {
      connectorRef.current = connectTooltip(manager, {
        anchor,
        content: config.content,
        placement: config.placement,
        shortcut: config.shortcut,
        labelElement: (labelRef == null ? void 0 : labelRef.current) ?? void 0,
        autoOnTruncation
      });
    }
    return () => {
      var _a2;
      (_a2 = connectorRef.current) == null ? void 0 : _a2.destroy();
      connectorRef.current = null;
    };
  }, [triggerRef, tooltip, labelRef, autoOnTruncation, manager]);
}
export {
  useTooltip
};
//# sourceMappingURL=index10.js.map
