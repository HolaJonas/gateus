import { useEffect } from "react";
import Keybinds from "../assets/keybinds.json";

/**
 * A hook for Nodes to allow rotation using predefined keybinds from keybinds.json.
 *
 * @export
 * @param {boolean} selected selected parameter of node props
 * @param {(direction: number) => void} onDirectionChange function to manipulate node's direction state
 */
export default function useDirectionKeys(
  selected: boolean,
  onDirectionChange: (direction: number) => void,
  updateNodeInternals: any,
  id: string,
) {
  const updateDirection = (direction: number) => {
    onDirectionChange(direction);
    updateNodeInternals(id);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selected) return;
      switch (event.key) {
        case Keybinds.SingleNode.Rotation.Bottom:
          updateDirection(180);
          break;
        case Keybinds.SingleNode.Rotation.Top:
          updateDirection(0);
          break;
        case Keybinds.SingleNode.Rotation.Right:
          updateDirection(90);
          break;
        case Keybinds.SingleNode.Rotation.Left:
          updateDirection(270);
          break;
        default:
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, onDirectionChange, updateNodeInternals, id]);
}
