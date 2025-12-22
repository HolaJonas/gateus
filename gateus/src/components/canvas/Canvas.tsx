import { useCallback, useRef } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  type Edge,
  useEdgesState,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AndNode, NotNode, SourceNode, TestNode } from "../../lib/NodeRegistry";
import GateMenu from "./GateMenu";
import { useCanvasDnD } from "../../hooks/useCanvasDnD";
import { DnDProvider } from "./DnDContext";

/**
 * A component containing a ReactFlow component with Controls, a Menu and a grid-Background.
 * The Menu provides placable nodes of NodeRegistry in a movable container.
 * Drag-and-Drop can be used to place nodes from this menu in the react flow component.
 *
 * @returns {*}
 */
function CanvasContent() {
  const reactFlowWrapper = useRef(null);
  const { nodes, onNodesChange, onDragOver, onDrop } = useCanvasDnD();
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <>
      <GateMenu />
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={{
            andNode: AndNode,
            notNode: NotNode,
            sourceNode: SourceNode,
            testNode: TestNode,
          }}
          defaultEdgeOptions={{ type: "smoothstep" }}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap />
          <Controls />
          <Background gap={20} color="#ccc" variant={BackgroundVariant.Lines} />
        </ReactFlow>
      </div>
    </>
  );
}


/**
 * The main Canvas component containing the whole react flow component with according drag-and-drop menu placement, background and controls.
 *
 * @export
 * @returns {*}
 */
export default function Canvas() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <CanvasContent />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
