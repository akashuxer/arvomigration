"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
function useControllableState(controlledValue, defaultValue) {
  const isControlledRef = React.useRef(controlledValue !== void 0);
  isControlledRef.current = controlledValue !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = controlledValue !== void 0 ? controlledValue : internal;
  const setValue = React.useCallback(
    (next) => {
      if (!isControlledRef.current) {
        setInternal(next);
      }
    },
    []
  );
  return [value, setValue];
}
exports.useControllableState = useControllableState;
//# sourceMappingURL=index90.cjs.map
