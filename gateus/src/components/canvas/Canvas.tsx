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
  const position = screenToFlowPosition({ x: 100, y: 100 });

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

  const countNodeTypes = (flow: FlowTab) => {
    let numberOfInputs = 0;
    let numberOfOutputs = 0;
    flow.nodes.forEach((element) => {
      if (element.type === "sourceNode") numberOfInputs++;
      if (element.type === "outputNode") numberOfOutputs++;
    });
    return { numberOfInputs: numberOfInputs, numberOfOutputs: numberOfOutputs };
  };

  const createHiddenSourceNodes = (
    flow: FlowTab,
    customNodeId: string,
    nodeIdMap: Map<string, string>,
    hiddenSourceNodeIds: string[]
  ) => {
    const sourceNodeInputMap = new Map<string, number>();
    const newNodes: Node[] = [];

    let inputHandleIndex = 0;
    flow.nodes.forEach((node) => {
      if (node.type === "sourceNode") {
        const hiddenSourceId = getId();
        hiddenSourceNodeIds.push(hiddenSourceId);
        nodeIdMap.set(node.id, hiddenSourceId);
        sourceNodeInputMap.set(node.id, inputHandleIndex++);

        newNodes.push({
          id: hiddenSourceId,
          type: "sourceNode",
          position: position,
          data: {
            value: false,
            label: `${flow.label}_input_${inputHandleIndex}`,
            category: "input",
            isHiddenNode: true,
            parentCustomNodeId: customNodeId,
          },
          style: { opacity: 0, pointerEvents: "none" },
          selectable: false,
          draggable: false,
          connectable: false,
          focusable: false,
        });
      }
    });
    return { sourceNodeInputMap, newNodes };
  };

  const createCustomNode = (
    flow: FlowTab,
    customNodeId: string,
    numberOfInputs: number,
    numberOfOutputs: number,
    hiddenSourceNodeIds: string[],
    hiddenOutputNodeIds: string[]
  ): Node => {
    return {
      id: customNodeId,
      type: "customNode",
      position: position,
      data: {
        value: false,
        category: "custom",
        label: flow.label,
        numberOfInputs: numberOfInputs,
        numberOfOutputs: numberOfOutputs,
        hiddenSourceNodeIds: hiddenSourceNodeIds,
        hiddenOutputNodeIds: hiddenOutputNodeIds,
      },
    };
  };

  const createHiddenOutputNodes = (
    flow: FlowTab,
    customNodeId: string,
    nodeIdMap: Map<string, string>,
    hiddenOutputNodeIds: string[]
  ) => {
    const newNodes: Node[] = [];
    const outputNodeOutputMap = new Map<string, number>();
    let outputHandleIndex = 0;

    flow.nodes.forEach((node) => {
      if (node.type === "outputNode") {
        const hiddenOutputId = getId();
        hiddenOutputNodeIds.push(hiddenOutputId);
        nodeIdMap.set(node.id, hiddenOutputId);
        outputNodeOutputMap.set(node.id, outputHandleIndex++);

        newNodes.push({
          id: hiddenOutputId,
          type: "outputNode",
          position: position,
          data: {
            value: false,
            label: `${flow.label}_output_${outputHandleIndex}`,
            category: "output",
            isHiddenNode: true,
            parentCustomNodeId: customNodeId,
            outputHandleIndex: outputHandleIndex - 1,
          },
          style: { opacity: 0, pointerEvents: "none" },
          selectable: false,
          draggable: false,
          connectable: false,
          focusable: false,
        });
      }
    });

    return { newNodes, outputNodeOutputMap };
  };

  const createRegularNodes = (
    flow: FlowTab,
    nodeIdMap: Map<string, string>
  ): Node[] => {
    const newNodes: Node[] = [];

    flow.nodes.forEach((node) => {
      if (node.type === "sourceNode" || node.type === "outputNode") return;

      const uniqueId = getId();
      nodeIdMap.set(node.id, uniqueId);
      newNodes.push({
        ...node,
        id: uniqueId,
        data: {
          ...node.data,
          label: `${flow.label}_${node.data.label || node.id}`,
        },
        style: { opacity: 0, pointerEvents: "none" },
        selectable: false,
        draggable: false,
        connectable: false,
        focusable: false,
      });
    });

    return newNodes;
  };

  const createFlowEdges = (
    flow: FlowTab,
    nodeIdMap: Map<string, string>
  ): Edge[] => {
    const newEdges: Edge[] = [];

    flow.edges.forEach((edge) => {
      const sourceId = nodeIdMap.get(edge.source);
      const targetId = nodeIdMap.get(edge.target);

      if (sourceId && targetId) {
        newEdges.push({
          id: getId(),
          source: sourceId,
          sourceHandle: edge.sourceHandle,
          target: targetId,
          targetHandle: edge.targetHandle,
          style: { opacity: 0, pointerEvents: "none" },
          selectable: false,
          focusable: false,
        });
      }
    });

    return newEdges;
  };

  const addFlowFromFlowTab = (flow: FlowTab) => {
    const { numberOfInputs, numberOfOutputs } = countNodeTypes(flow);
    const nodeIdMap = new Map<string, string>();
    const hiddenSourceNodeIds: string[] = [];
    const hiddenOutputNodeIds: string[] = [];
    const customNodeId = getId();

    const customNode = createCustomNode(
      flow,
      customNodeId,
      numberOfInputs,
      numberOfOutputs,
      hiddenSourceNodeIds,
      hiddenOutputNodeIds
    );

    const { newNodes: hiddenSourceNodes } = createHiddenSourceNodes(
      flow,
      customNodeId,
      nodeIdMap,
      hiddenSourceNodeIds
    );

    const { newNodes: hiddenOutputNodes } = createHiddenOutputNodes(
      flow,
      customNodeId,
      nodeIdMap,
      hiddenOutputNodeIds
    );

    const regularNodes = createRegularNodes(flow, nodeIdMap);
    const newEdges = createFlowEdges(flow, nodeIdMap);

    const allNodes = [
      customNode,
      ...hiddenSourceNodes,
      ...hiddenOutputNodes,
      ...regularNodes,
    ];

    setFlows((prev) => ({
      ...prev,
      [activeTabId]: {
        ...prev[activeTabId],
        nodes: prev[activeTabId].nodes.concat(allNodes),
        edges: prev[activeTabId].edges.concat(newEdges),
      },
    }));
  };

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
      <button
        onClick={() => addFlowFromFlowTab(flows["tab0"])}
        className="bg-orange-600 w-10 h-10 flex"
      />
      <TabContainers
        activeTabId={activeTabId}
        flows={flows}
        setActiveTabId={setActiveTabId}
        setFlows={setFlows}
      />
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <GateMenu />
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
