import { useRef, useEffect } from "react";
import { createFocusTrap } from "@arvo/core";
function useFocusTrap(containerRef, options) {
  const trapRef = useRef(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => {
    if (!trapRef.current) {
      trapRef.current = createFocusTrap();
    }
    const trap = trapRef.current;
    if (options.active && containerRef.current) {
      const { active: _active, ...rest } = optionsRef.current;
      const wrapped = {
        ...rest,
        container: containerRef.current,
        getOrderedElements: rest.getOrderedElements ? () => optionsRef.current.getOrderedElements ? optionsRef.current.getOrderedElements() : [] : void 0,
        returnFocusTo: rest.returnFocusTo ? () => {
          const v = optionsRef.current.returnFocusTo;
          if (!v) return null;
          return typeof v === "function" ? v() : v;
        } : void 0
      };
      trap.activate(wrapped);
    } else {
      trap.deactivate();
    }
    return () => {
      trap.deactivate();
    };
  }, [
    options.active,
    options.revision,
    containerRef,
    options.initialFocus,
    options.returnFocusOnDeactivate,
    options.escapeDeactivates,
    options.allowOutsideClick
  ]);
}
export {
  useFocusTrap
};
//# sourceMappingURL=index7.js.map
