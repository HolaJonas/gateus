import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import type { FlowTab } from "../types/flowTab";
import type React from "react";

/**
 * Exports onNodesChange, onEdgesChange, onConnect, onNodesDelete.
 * Handlers meant for React Flow components.
 *
 * @param {React.Dispatch<
 *     React.SetStateAction<Record<string, FlowTab>>
 *   >} setUndoableFlowsState - state-update function
 * @param {React.Dispatch<React.SetStateAction<Record<string, FlowTab>>>} setFlows - visual state-update function
 * @param {Record<string, FlowTab>} flows - visual flow state
 * @returns {{ onNodesChange: (tabId: string, changes: {}) => void; onEdgesChange: (tabId: string, changes: {}) => void; onConnect: (ta...}
 */
export const useCanvasInteraction = (
  setUndoableFlowsState: React.Dispatch<
    React.SetStateAction<Record<string, FlowTab>>
  >,
  setFlows: React.Dispatch<React.SetStateAction<Record<string, FlowTab>>>,
  flows: Record<string, FlowTab>,
) => {
  const onNodesChange = (tabId: string, changes: NodeChange[]) => {
    const change = changes[0];
    if (
      change.type === "position" &&
      "dragging" in change &&
      !change.dragging
    ) {
      setUndoableFlowsState((prev: Record<string, FlowTab>) => ({
        ...prev,
        [tabId]: {
          ...prev[tabId],
          nodes: applyNodeChanges(changes, prev[tabId].nodes),
        },
      }));
    } else
      setFlows((prev: Record<string, FlowTab>) => ({
        ...prev,
        [tabId]: {
          ...prev[tabId],
          nodes: applyNodeChanges(changes, prev[tabId].nodes),
        },
      }));
  };

  const onEdgesChange = (tabId: string, changes: EdgeChange[]) => {
    setUndoableFlowsState((prev: Record<string, FlowTab>) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        edges: applyEdgeChanges(changes, prev[tabId].edges),
      },
    }));
  };

  const onConnect = (tabId: string, params: any) => {
    setUndoableFlowsState((prev: Record<string, FlowTab>) => ({
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
          (x) => x.id === node.id || x.data.parentCustomNodeId === node.id,
        )
        .forEach((x) => toBeDeletedNodes.add(x.id));
    });
    const newNodes = tab.nodes.filter((x) => !toBeDeletedNodes.has(x.id));
    const newEdges = tab.edges.filter(
      (x) => !toBeDeletedNodes.has(x.source) && !toBeDeletedNodes.has(x.target),
    );
    setUndoableFlowsState((prev: Record<string, FlowTab>) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        nodes: newNodes,
        edges: newEdges,
      },
    }));
  };

  return { onNodesChange, onEdgesChange, onConnect, onNodesDelete };
};
