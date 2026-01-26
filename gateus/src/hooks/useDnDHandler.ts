import { useReactFlow, type Node } from "@xyflow/react";
import { useDnD } from "../components/canvas/DnDContext";
import { useCallback } from "react";
import { addFlowFromFlowTab } from "../components/canvas/CustomNodeHandler";
import { getId } from "../components/canvas/Canvas";
import type { FlowTab } from "../types/flowTab";

/**
 * A hook providing onDragOver and onDrop.
 * These handlers are used to implement drag-and-drop of nodes.
 *
 * @param {React.Dispatch<
 *     React.SetStateAction<Record<string, FlowTab>>
 *   >} setUndoableFlowsState - state-update function
 * @param {string} activeTabId - current tab id
 * @param {Record<string, FlowTab>} flows - visual flow storage
 * @returns {{ onDragOver: any; onDrop: any; }}
 */
export const useDnDHandler = (
  setUndoableFlowsState: React.Dispatch<
    React.SetStateAction<Record<string, FlowTab>>
  >,
  activeTabId: string,
  flows: Record<string, FlowTab>,
) => {
  const [type] = useDnD();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!type.type) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      if (type.type === "customNode" && type.flow) {
        addFlowFromFlowTab(
          type.flow,
          setUndoableFlowsState,
          activeTabId,
          position,
        );
        return;
      }
      const newNode: Node = {
        id: getId(),
        type: type.type,
        position: position,
        data: { value: false },
      };
      setUndoableFlowsState((prev: Record<string, FlowTab>) => ({
        ...prev,
        [activeTabId]: {
          ...prev[activeTabId],
          nodes: prev[activeTabId].nodes.concat(newNode),
        },
      }));
    },
    [screenToFlowPosition, type, activeTabId, flows, setUndoableFlowsState],
  );

  return { onDragOver, onDrop };
};
