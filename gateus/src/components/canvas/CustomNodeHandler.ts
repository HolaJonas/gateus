import { type Node, type Edge, type XYPosition } from "@xyflow/react";
import { getId } from "./Canvas";
import type { FlowTab } from "../../types/flowTab";
import type { Dispatch, SetStateAction } from "react";

const position: XYPosition = { x: 0, y: 0 };

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
  hiddenOutputNodeIds: string[],
  position: XYPosition
): Node => {
  return {
    id: customNodeId,
    type: "customNode",
    position: position,
    data: {
      value: false,
      category: "custom",
      label: flow.label,
      color: flow.color || "#eab308",
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
  nodeIdMap: Map<string, string>,
  customNodeId: string
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
        parentCustomNodeId: customNodeId,
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

export const addFlowFromFlowTab = (
  flow: FlowTab,
  setFlows: Dispatch<SetStateAction<Record<string, FlowTab>>>,
  activeTabId: string,
  position: XYPosition
) => {
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
    hiddenOutputNodeIds,
    position
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

  const regularNodes = createRegularNodes(flow, nodeIdMap, customNodeId);
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
