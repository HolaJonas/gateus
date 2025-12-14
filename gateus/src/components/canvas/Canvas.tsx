import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AndNode from "./AndNode";

const initialEdges: any = [];

export default function Canvas() {
  const [nodes, setNodes] = useState([
    {
      id: "node-1",
      type: "andNode",
      position: { x: 0, y: 0 },
      data: { value: 123 },
    },
    {
      id: "node-2",
      type: "andNode",
      position: { x: 100, y: 0 },
      data: { value: 1 },
    },
  ]);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot: any) =>
        applyEdgeChanges(changes, edgesSnapshot)
      ),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot: any) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="flex-1 w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={{ andNode: AndNode }}
        fitView
      />
    </div>
  );
}
