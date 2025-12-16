import { useEffect } from "react";
import Keybinds from "../assets/keybinds.json";

/**
 * A hook for interactive Nodes to execute interaction on keybind press.
 *
 * @export
 * @param {boolean} selected selected parameter of node props
 * @param {() => void} onInteract interaction function
 * @returns {void) => void}
 */
export default function useInteractKey(
  selected: boolean,
  onInteract: () => void
) {
  useEffect(() => {
    if (!selected) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === Keybinds.SingleNode.Interact) onInteract();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selected, onInteract]);
}
