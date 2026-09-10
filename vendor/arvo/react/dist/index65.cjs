"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const useTooltip = require("./index10.cjs");
const ArvoTooltip = React.forwardRef(
  function ArvoTooltip2({ content, placement, shortcut, children }, forwardedRef) {
    const internalRef = React.useRef(null);
    const config = { content, placement, shortcut };
    useTooltip.useTooltip({
      triggerRef: internalRef,
      tooltip: config
    });
    if (!React.isValidElement(children)) return children;
    return React.cloneElement(children, {
      ref: (node) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
        const originalRef = children.ref;
        if (typeof originalRef === "function") {
          originalRef(node);
        } else if (originalRef && typeof originalRef === "object" && "current" in originalRef) {
          originalRef.current = node;
        }
      }
    });
  }
);
exports.ArvoTooltip = ArvoTooltip;
//# sourceMappingURL=index65.cjs.map
