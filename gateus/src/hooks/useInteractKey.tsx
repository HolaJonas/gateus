import { useEffect } from "react";
import Keybinds from "../assets/keybinds.json";

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
