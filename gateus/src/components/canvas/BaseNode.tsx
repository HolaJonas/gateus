import {
  useNodeConnections,
  useNodesData,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useState, type ReactNode } from "react";
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

  useEffect(() => {
    const inputValues = connectedNodesData.map(
      (node) => Boolean(node?.data?.value) ?? false
    );

    const result =
      connections.length === handleCount ? logicFunction(inputValues) : false;

    if (data.value !== result) {
      updateNodeData(id, { value: result });
    }
  }, [connectedNodesData, id, updateNodeData, data.value, connections.length]);

  if (dynamicHandles) useNumberKeys(selected, setHandleCount);
  if (rotatable) useDirectionKeys(selected, setDirection);
  if (interactable && onInteract) useInteractKey(selected, onInteract);

  return (
    <div
      style={{
        rotate: `${direction}deg`,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
      }}
      className={data.value ? "opacity-100" : "opacity-50"}
    >
      <AlignedHandles numberOfHandles={defaultOut} type="source" />
      <div className={data.value ? "brightness-125" : "brightness-75"}>
        {design}
      </div>
      <AlignedHandles numberOfHandles={handleCount} type="target" />
    </div>
  );
}
