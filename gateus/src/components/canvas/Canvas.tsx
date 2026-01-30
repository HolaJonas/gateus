import { useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
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
import TabContainers from "../header/TabContainers";
import ColorWheel from "./ColorWheel";
import useUndoRedoKeys from "../../hooks/useUndoRedoKeys";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  recordAction,
  undo as undoAction,
  redo as redoAction,
} from "./flowsSlice";
import { useDnDHandler } from "../../hooks/useDnDHandler";
import { useCanvasInteraction } from "../../hooks/useCanvasInteraction";
import type { FlowTab } from "../../types/flowTab";
import { BitTaggedEdge } from "./BitTaggedEdge";
import { CanvasContexts } from "./CanvasContexts";

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

  const activeFlow = flows[activeTabId];

  const { onDragOver, onDrop } = useDnDHandler(
    setUndoableFlowsState,
    activeTabId,
    flows,
  );

  const { onNodesChange, onEdgesChange, onConnect, onNodesDelete } =
    useCanvasInteraction(setUndoableFlowsState, setFlows, flows);

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
          edgeTypes={{ bitTaggedEdge: BitTaggedEdge }}
          defaultEdgeOptions={{ type: "straight" }}
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
    <CanvasContexts>
      <CanvasContent />
    </CanvasContexts>
  );
}
