"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
function useFocusTrap(containerRef, options) {
  const trapRef = React.useRef(null);
  const optionsRef = React.useRef(options);
  optionsRef.current = options;
  React.useEffect(() => {
    if (!trapRef.current) {
      trapRef.current = core.createFocusTrap();
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
exports.useFocusTrap = useFocusTrap;
//# sourceMappingURL=index7.cjs.map
