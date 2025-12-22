import { useCallback } from "react";
import { useReactFlow, useNodesState } from "@xyflow/react";
import { useDnD } from "../components/canvas/DnDContext";

let id = 0;
const getId = () => `dndnode_${id++}`;

/**
 * A hook meant to be used in react flow Canvas components. Allows dynamic drag-and-drop of nodes.
 *
 * @export
 * @returns {{ nodes: any; setNodes: any; onNodesChange: any; onDragOver: any; onDrop: any; }}
 */
export function useCanvasDnD() {
  const [type] = useDnD();
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!type) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: any = {
        id: getId(),
        type,
        position,
        data: { value: false },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes]
  );

  return {
    nodes,
    setNodes,
    onNodesChange,
    onDragOver,
    onDrop,
  };
}
