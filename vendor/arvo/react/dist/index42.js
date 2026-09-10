import { forwardRef, useRef, useEffect, useImperativeHandle } from "react";
forwardRef(
  function ArvoImageView2(props, ref) {
    const instanceRef = useRef(null);
    useEffect(() => {
      const ctor = window.ArvoImageView;
      if (!ctor) return void 0;
      const instance = ctor.initialize(props);
      instanceRef.current = instance;
      return () => {
        instance.destroy();
        instanceRef.current = null;
      };
    }, []);
    useEffect(() => {
      var _a;
      (_a = instanceRef.current) == null ? void 0 : _a.update(props);
    }, [props]);
    useImperativeHandle(ref, () => instanceRef.current, []);
    return null;
  }
);
//# sourceMappingURL=index42.js.map
