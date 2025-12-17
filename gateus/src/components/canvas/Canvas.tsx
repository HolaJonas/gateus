import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import BaseNode from "./BaseNode";
import GateMenu from "./GateMenu";

const AndNode = (props: any) => (
  <BaseNode
    {...props}
    dynamicHandles={true}
    design={<div className="rounded-t-xl bg-red-600 w-10 h-7" />}
    logicFunction={(input) => input.every((value) => value === true)}
  />
);
const NotNode = (props: any) => (
  <BaseNode
    {...props}
    design={<div className="w-5 h-5 flex bg-blue-600" />}
    logicFunction={(input) => !input[0]}
    defaultIn={1}
    dynamicHandles={false}
  />
);

const SourceNode = (props: any) => (
  <BaseNode
    {...props}
    defaultOut={1}
    defaultIn={0}
    design={<div className="w-7 h-7 flex bg-orange-500 rounded-full" />}
    logicFunction={() => Boolean(props.data.value)}
    dynamicHandles={false}
    interactable={true}
    stateful={true}
  />
);

const TestNode = (props: any) => (
  <BaseNode
    {...props}
    design={<div className="w-9 h-9 bg-cyan-600 flex" />}
    logicFunction={(input) =>
      (!input[0] && input[1]) || (input[0] && !input[1])
    }
    defaultIn={3}
    dynamicHandles={false}
  />
);

const initialEdges: any = [];

export default function Canvas() {
  const [nodes, setNodes] = useState([
    {
      id: "node-1",
      type: "andNode",
      position: { x: 0, y: 0 },
      data: { value: false },
    },
    {
      id: "node-2",
      type: "sourceNode",
      position: { x: 100, y: 0 },
      data: { value: false },
    },
    {
      id: "node-3",
      type: "sourceNode",
      position: { x: 200, y: 0 },
      data: { value: false },
    },
    {
      id: "node-4",
      type: "sourceNode",
      position: { x: 300, y: 0 },
      data: { value: false },
    },
    {
      id: "node-5",
      type: "testNode",
      position: { x: 400, y: 0 },
      data: { value: false },
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
      <GateMenu />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
  );
}
