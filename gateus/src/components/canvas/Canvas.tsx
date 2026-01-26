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
  type NodeChange,
  type EdgeChange,
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
import TabContainers from "../header/TabContainers";
import { addFlowFromFlowTab } from "./CustomNodeHandler";
import ColorWheel from "./ColorWheel";
import useUndoRedoKeys from "../../hooks/useUndoRedoKeys";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  recordAction,
  undo as undoAction,
  redo as redoAction,
} from "./flowsSlice";

export type FlowTab = {
  id: string;
  label: string;
  color: string;
  nodes: Node[];
  edges: Edge[];
};

let id = 0;
export const getId = () => `node_${id++}`;

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
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [flows, setFlows] = useState<Record<string, FlowTab>>({
    tab0: {
      id: "0",
      label: "Flow 0",
      color: "#eab308",
      nodes: [],
      edges: [],
    },
  });

  const dispatch = useAppDispatch();
  const tabHistories = useAppSelector(
    (state) => state.tabHistorySlice.histories,
  );

  const undo = () => {
    const history = tabHistories[activeTabId];
    if (!history || history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    dispatch(undoAction(activeTabId));

    setFlows((prev) => ({
      ...prev,
      [activeTabId]: previous,
    }));
  };

  const redo = () => {
    const history = tabHistories[activeTabId];
    if (!history || history.future.length === 0) return;

    const next = history.future[0];
    dispatch(redoAction(activeTabId));

    setFlows((prev) => ({
      ...prev,
      [activeTabId]: next,
    }));
  };

  useUndoRedoKeys(undo, redo);

  const setUndoableFlowsState = (f: any) => {
    const newFlows = typeof f === "function" ? f(flows) : f;
    const newTab = newFlows[activeTabId];
    const currentTab = flows[activeTabId];

    dispatch(
      recordAction({
        tabId: activeTabId,
        flowTab: newTab,
        currentFlowTab: currentTab,
      }),
    );

    setFlows(newFlows);
  };

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
    [screenToFlowPosition, type, activeTabId, flows],
  );

  const activeFlow = flows[activeTabId];

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

  return (
    <>
      <TabContainers
        activeTabId={activeTabId}
        flows={flows}
        setActiveTabId={setActiveTabId}
        setFlows={setUndoableFlowsState}
        setShowColorWheel={setShowColorWheel}
      />
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <GateMenu flows={flows} activeTabId={activeTabId} />
        {showColorWheel && (
          <ColorWheel
            setShowColorWheel={setShowColorWheel}
            currentColor={activeFlow.color}
            onColorChange={(color) => {
              setUndoableFlowsState((prev: Record<string, FlowTab>) => ({
                ...prev,
                [activeTabId]: {
                  ...prev[activeTabId],
                  color: color,
                },
              }));
            }}
          />
        )}
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
