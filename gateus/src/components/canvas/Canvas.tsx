import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  AndNode,
  NotNode,
  SourceNode,
  XorNode,
  CustomNode,
} from "../../lib/NodeRegistry";
import GateMenu from "./GateMenu";
import { useCanvasDnD } from "../../hooks/useCanvasDnD";
import { DnDProvider, useDnD } from "./DnDContext";
import TabContainers from "./TabContainers";

export type FlowTab = {
  id: string;
  label: string;
  nodes: Node[];
  edges: Edge[];
};

let id = 0;
const getId = () => `dndnode_${id++}`;

/**
 * A component containing a ReactFlow component with Controls, a Menu and a grid-Background.
 * The Menu provides placable nodes of NodeRegistry in a movable container.
 * Drag-and-Drop can be used to place nodes from this menu in the react flow component.
 *
 * @returns {*}
 */
export function CanvasContent() {
  const reactFlowWrapper = useRef(null);
  const [activeTabId, setActiveTabId] = useState<string>("tab0");
  const [flows, setFlows] = useState<Record<string, FlowTab>>({
    tab0: {
      id: "0",
      label: "Flow 0",
      nodes: [
        {
          id: "1",
          position: { x: 0, y: 0 },
          type: "sourceNode",
          data: { label: "Node 1" },
        },
      ],
      edges: [],
    },
  });

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
      setFlows((prev) => ({
        ...prev,
        [activeTabId]: {
          ...prev[activeTabId],
          nodes: prev[activeTabId].nodes.concat(newNode),
        },
      }));
    },
    [screenToFlowPosition, type, activeTabId]
  );
  const activeFlow = flows[activeTabId];

  const onNodesChange = (tabId: string, changes: any) => {
    setFlows((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        nodes: applyNodeChanges(changes, prev[tabId].nodes),
      },
    }));
  };

  const onEdgesChange = (tabId: string, changes: any) => {
    setFlows((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        edges: applyEdgeChanges(changes, prev[tabId].edges),
      },
    }));
  };

  const onConnect = (tabId: string, params: any) => {
    setFlows((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        edges: addEdge(params, prev[tabId].edges),
      },
    }));
  };

  return (
    <>
      <TabContainers
        activeTabId={activeTabId}
        flows={flows}
        setActiveTabId={setActiveTabId}
        setFlows={setFlows}
      />
      <GateMenu />
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={activeFlow.nodes}
          edges={activeFlow.edges}
          onNodesChange={(changes) => onNodesChange(activeTabId, changes)}
          onEdgesChange={(changes) => onEdgesChange(activeTabId, changes)}
          onConnect={(params) => onConnect(activeTabId, params)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={{
            andNode: AndNode,
            notNode: NotNode,
            sourceNode: SourceNode,
            xorNode: XorNode,
            customNode: CustomNode,
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
