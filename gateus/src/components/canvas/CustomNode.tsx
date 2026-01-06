import {
  useNodeConnections,
  useNodesData,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { useEffect } from "react";
import AlignedHandles from "./AlignedHandles";

// TODO: refactor to use existing logic.
export default function CustomNode(props: NodeProps) {
  const connections = useNodeConnections({ handleType: "target" });
  const sourceNodeIds = connections.map((conn) => conn.source);
  const connectedNodesData = useNodesData(sourceNodeIds);
  const { updateNodeData } = useReactFlow();

  const numberOfInputs = Number(props.data.numberOfInputs) || 0;
  const numberOfOutputs = Number(props.data.numberOfOutputs) || 0;
  const hiddenSourceNodeIds =
    (props.data.hiddenSourceNodeIds as string[]) || [];
  const hiddenOutputNodeIds =
    (props.data.hiddenOutputNodeIds as string[]) || [];

  const hiddenOutputNodesData = useNodesData(hiddenOutputNodeIds);

  useEffect(() => {
    hiddenSourceNodeIds.forEach((hiddenSourceId, index) => {
      const connection = connections.find(
        (conn) => conn.targetHandle === `target-${index}`
      );

      if (connection) {
        const sourceNode = connectedNodesData.find(
          (node) => node && node.id === connection.source
        );
        const inputValue = sourceNode?.data?.value ?? false;

        updateNodeData(hiddenSourceId, { value: inputValue });
      } else {
        updateNodeData(hiddenSourceId, { value: false });
      }
    });
  }, [connectedNodesData, connections, hiddenSourceNodeIds, updateNodeData]);

  useEffect(() => {
    const outputValues: Record<string, boolean> = {};

    hiddenOutputNodesData.forEach((outputNode, index) => {
      if (outputNode) {
        outputValues[`output-${index}`] =
          Boolean(outputNode.data?.value) ?? false;
      }
    });

    updateNodeData(props.id, {
      ...props.data,
      outputValues: outputValues,
      value: outputValues["output-0"] ?? false,
    });
  }, [hiddenOutputNodesData, props.id, updateNodeData]);

  return (
    <div
      style={{
        outline: props.selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
      }}
      className={props.data.value ? "opacity-100" : "opacity-50"}
    >
      <div className={props.data.value ? "brightness-125" : "brightness-75"}>
        <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold p-2">
          {String(props.data.label) || "Custom"}
        </div>
      </div>
      <AlignedHandles numberOfHandles={numberOfOutputs} type="source" />
      <AlignedHandles numberOfHandles={numberOfInputs} type="target" />
    </div>
  );
}
