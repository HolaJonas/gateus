import {
  useNodeConnections,
  useNodesData,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useState, type ReactNode, useCallback } from "react";
import useNumberKeys from "../../hooks/useNumberKeys";
import useDirectionKeys from "../../hooks/useDirectionKeys";
import AlignedHandles from "./AlignedHandles";
import useInteractKey from "../../hooks/useInteractKey";

interface BaseNodeProps extends NodeProps {
  dynamicHandles: boolean;
  design: ReactNode;
  defaultIn: number;
  defaultOut: number;
  rotatable: boolean;
  interactable: boolean;
  category:
    | "input"
    | "output"
    | "gates"
    | "sequential"
    | "annotation"
    | "misc"
    | "custom";
  logicFunction: (inputs: boolean[]) => boolean;
  onInteract?: () => void;
}

/**
 * The basic logic gate node. Can be used to implement any boolean function as a node on the canvas.
 *
 * @export
 * @param {BaseNodeProps} param0
 * @param {*} param0.id id of the node
 * @param {*} param0.selected is the node selected?
 * @param {*} param0.data json data of the node
 * @param {boolean=true} param0.dynamicHandles allow dynamic handles using number keys?
 * @param {ReactNode} param0.design JSX design of the node
 * @param {number} [param0.defaultIn=2] default number of inputs
 * @param {number} [param0.defaultOut=1] default number of outputs
 * @param {"input"| "output" | "gates" | "sequential" | "annotation" | "misc" | "custom"} [param0.category] category of the gate
 * @param {boolean} [param0.rotatable=true] is the node rotatable?
 * @param {boolean} [param0.interactable=false] is the node an interaction-node?
 * @param {(inputs: {}) => boolean} param0.logicFunction boolean function of the node
 * @param {() => void} param0.onInteract interaction function of the node
 * @returns {*}
 */
export default function BaseNode({
  id,
  selected,
  data,
  dynamicHandles = true,
  design,
  category,
  defaultIn = 2,
  defaultOut = 1,
  rotatable = true,
  interactable = false,
  logicFunction,
  onInteract,
}: BaseNodeProps) {
  const [handleCount, setHandleCount] = useState(defaultIn);
  const [direction, setDirection] = useState(0);
  const connections = useNodeConnections({ handleType: "target" });
  const sourceNodeIds = connections.map((conn) => conn.source);
  const connectedNodesData = useNodesData(sourceNodeIds);
  const { updateNodeData } = useReactFlow();

  const handleToggle = useCallback(() => {
    updateNodeData(id, { value: !data.value });
  }, [id, data.value, updateNodeData]);

  useEffect(() => {
    if (data.category !== category) {
      updateNodeData(id, { ...data, category: category });
    }
  }, [id, category, data.category, updateNodeData]);

  useEffect(() => {
    const inputValues = connectedNodesData.map((node, index) => {
      if (!node) return false;

      if (node.type === "customNode") {
        const connection = connections[index];
        const sourceHandle = connection?.sourceHandle;

        if (sourceHandle && node.data?.outputValues) {
          const outputKey = sourceHandle.replace("source-", "output-");
          const outputValues = node.data.outputValues as Record<
            string,
            boolean
          >;
          return Boolean(outputValues[outputKey]) ?? false;
        }
      }
      return Boolean(node?.data?.value) ?? false;
    });

    const result =
      connections.length === handleCount ? logicFunction(inputValues) : false;

    if (data.value !== result) {
      updateNodeData(id, { value: result });
    }
  }, [
    connectedNodesData,
    id,
    updateNodeData,
    data.value,
    connections.length,
    connections,
    handleCount,
    logicFunction,
  ]);

  if (dynamicHandles) useNumberKeys(selected, setHandleCount);
  if (rotatable) useDirectionKeys(selected, setDirection);
  if (interactable) useInteractKey(selected, onInteract || handleToggle);

  return (
    <div
      style={{
        rotate: `${direction}deg`,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
      }}
      className={data.value ? "opacity-100" : "opacity-50"}
    >
      <div className={data.value ? "brightness-125" : "brightness-75"}>
        {design}
      </div>
      <AlignedHandles numberOfHandles={defaultOut} type="source" />
      <AlignedHandles numberOfHandles={handleCount} type="target" />
    </div>
  );
}
