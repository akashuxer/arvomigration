import { forwardRef, useRef, isValidElement, cloneElement } from "react";
import { useTooltip } from "./index10.js";
const ArvoTooltip = forwardRef(
  function ArvoTooltip2({ content, placement, shortcut, children }, forwardedRef) {
    const internalRef = useRef(null);
    const config = { content, placement, shortcut };
    useTooltip({
      triggerRef: internalRef,
      tooltip: config
    });
    if (!isValidElement(children)) return children;
    return cloneElement(children, {
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
export {
  ArvoTooltip
};
//# sourceMappingURL=index65.js.map
