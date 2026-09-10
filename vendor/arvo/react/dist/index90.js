import { useRef, useState, useCallback } from "react";
function useControllableState(controlledValue, defaultValue) {
  const isControlledRef = useRef(controlledValue !== void 0);
  isControlledRef.current = controlledValue !== void 0;
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue !== void 0 ? controlledValue : internal;
  const setValue = useCallback(
    (next) => {
      if (!isControlledRef.current) {
        setInternal(next);
      }
    },
    []
  );
  return [value, setValue];
}
export {
  useControllableState
};
//# sourceMappingURL=index90.js.map
