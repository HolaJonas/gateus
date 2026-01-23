import { useEffect } from "react";

export default function useUndoRedoKeys(undo: () => void, redo: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        console.log("undo");
        undo();
      }
      if (event.ctrlKey && event.key === "y") redo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);
}
