import debounce from "lodash.debounce";
import { useMemo, useEffect, Dispatch, SetStateAction } from "react";

const useDebounceInput = <T>(setInput: Dispatch<SetStateAction<T>>) => {
  const debounceInputChange = useMemo(
    () =>
      debounce((event) => {
        event.preventDefault();
        setInput(event.target.value);
      }, 300),
    [setInput]
  );

  useEffect(() => debounceInputChange.cancel(), [debounceInputChange]);
  return debounceInputChange;
};

export default useDebounceInput;
