import { useEffect, useRef } from "react";

/**
 * A hook for Nodes to be able to dynamically change the number of handles.
 * Select a node, type any number and confirm by ENTER to apply changes.
 *
 * @export
 * @param {boolean} selected 
 * @param {(numberOfHandles: number) => void} onHandleNumberChange 
 */
export default function useHandleNumberKeys(
  selected: boolean,
  onHandleNumberChange: (numberOfHandles: number) => void
) {
  const numberInputRef = useRef("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selected) {
        numberInputRef.current = "";
        return;
      }
      if (event.key === "Enter") {
        if (
          numberInputRef.current !== "" &&
          Number(numberInputRef.current) !== 0
        )
          onHandleNumberChange(Number(numberInputRef.current));
        numberInputRef.current = "";
      }
      if (!Number.isNaN(Number(event.key))) {
        numberInputRef.current += event.key;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, onHandleNumberChange]);
}
