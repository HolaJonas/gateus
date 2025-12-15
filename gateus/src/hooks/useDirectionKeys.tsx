import { useEffect } from "react";
import Keybinds from "../assets/keybinds.json";

/**
 * A hook for Nodes to allow rotation using predefined keybinds from keybinds.json.
 *
 * @export
 * @param {boolean} selected
 * @param {(direction: number) => void} onDirectionChange
 */
export default function useDirectionKeys(
  selected: boolean,
  onDirectionChange: (direction: number) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selected) return;
      switch (event.key) {
        case Keybinds.SingleNode.Rotation.Bottom:
          onDirectionChange(180);
          break;
        case Keybinds.SingleNode.Rotation.Top:
          onDirectionChange(0);
          break;
        case Keybinds.SingleNode.Rotation.Right:
          onDirectionChange(90);
          break;
        case Keybinds.SingleNode.Rotation.Left:
          onDirectionChange(270);
          break;
        default:
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, onDirectionChange]);
}
