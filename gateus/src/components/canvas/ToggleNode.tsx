import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useCallback, type ReactNode } from "react";
import BaseNode from "./BaseNode";

interface ToggleNodeProps extends NodeProps {
  design: ReactNode;
  rotatable: boolean;
}

export default function ToggleNode(props: ToggleNodeProps) {
  const { updateNodeData } = useReactFlow();

  const handleToggle = useCallback(() => {
    updateNodeData(props.id, { value: !props.data.value });
  }, [props.id, props.data.value, updateNodeData]);

  return (
    <BaseNode
      {...props}
      defaultOut={1}
      design={props.design}
      logicFunction={() => Boolean(props.data.value)}
      defaultIn={0}
      dynamicHandles={false}
      interactable={true}
      onInteract={handleToggle}
    />
  );
}
