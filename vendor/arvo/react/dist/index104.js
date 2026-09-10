import { createContext, useContext } from "react";
const ChipListContext = createContext(null);
function useChipList() {
  return useContext(ChipListContext);
}
export {
  ChipListContext,
  useChipList
};
//# sourceMappingURL=index104.js.map
