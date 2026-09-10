"use strict";
const React = require("react");
React.forwardRef(
  function ArvoImageView2(props, ref) {
    const instanceRef = React.useRef(null);
    React.useEffect(() => {
      const ctor = window.ArvoImageView;
      if (!ctor) return void 0;
      const instance = ctor.initialize(props);
      instanceRef.current = instance;
      return () => {
        instance.destroy();
        instanceRef.current = null;
      };
    }, []);
    React.useEffect(() => {
      var _a;
      (_a = instanceRef.current) == null ? void 0 : _a.update(props);
    }, [props]);
    React.useImperativeHandle(ref, () => instanceRef.current, []);
    return null;
  }
);
//# sourceMappingURL=index42.cjs.map
