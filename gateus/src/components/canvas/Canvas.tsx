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
  OutputNode,
  SourceNode,
  XorNode,
  CustomNode,
} from "../../lib/NodeRegistry";
import GateMenu from "./GateMenu";
import { DnDProvider, useDnD } from "./DnDContext";
import TabContainers from "./TabContainers";
import { addFlowFromFlowTab } from "./CustomNodeHandler";

export type FlowTab = {
  id: string;
  label: string;
  nodes: Node[];
  edges: Edge[];
};

let id = 0;
export const getId = () => `dndnode_${id++}`;

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
      if (!type.type) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      if (type.type === "customNode" && type.flow) {
        addFlowFromFlowTab(type.flow, setFlows, activeTabId, position);
        return;
      }
      const newNode: any = {
        id: getId(),
        type: type.type,
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

  const onNodesDelete = (tabId: string, params: Node[]) => {
    const tab = flows[tabId];
    const toBeDeletedNodes = new Set<String>();
    params.forEach((node: Node) => {
      tab.nodes
        .filter(
          (x) => x.id === node.id || x.data.parentCustomNodeId === node.id
        )
        .forEach((x) => toBeDeletedNodes.add(x.id));
    });
    const newNodes = tab.nodes.filter((x) => !toBeDeletedNodes.has(x.id));
    const newEdges = tab.edges.filter(
      (x) => !toBeDeletedNodes.has(x.source) && !toBeDeletedNodes.has(x.target)
    );
    setFlows((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        nodes: newNodes,
        edges: newEdges,
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
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <GateMenu flows={flows} activeTabId={activeTabId} />
        <ReactFlow
          nodes={activeFlow.nodes}
          edges={activeFlow.edges}
          onNodesChange={(changes) => onNodesChange(activeTabId, changes)}
          onEdgesChange={(changes) => onEdgesChange(activeTabId, changes)}
          onNodesDelete={(changes) => onNodesDelete(activeTabId, changes)}
          onConnect={(params) => onConnect(activeTabId, params)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={{
            andNode: AndNode,
            notNode: NotNode,
            sourceNode: SourceNode,
            xorNode: XorNode,
            outputNode: OutputNode,
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
