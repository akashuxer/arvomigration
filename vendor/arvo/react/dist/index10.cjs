"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
const TooltipContext = require("./index5.cjs");
function resolveConfig(tooltip) {
  return typeof tooltip === "string" ? { content: tooltip } : tooltip;
}
function useTooltip(options) {
  const { triggerRef, tooltip, labelRef, autoOnTruncation } = options;
  const ctxManager = TooltipContext.useTooltipManager();
  const manager = ctxManager ?? core.tooltipManager;
  const connectorRef = React.useRef(null);
  React.useEffect(() => {
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
      connectorRef.current = core.connectTooltip(manager, {
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
exports.useTooltip = useTooltip;
//# sourceMappingURL=index10.cjs.map
