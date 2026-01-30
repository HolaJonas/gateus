import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";
import { useEdgeVisibility } from "./EdgeContext";

interface BitTaggedEdgeData {
  bitwidth?: number;
  [key: string]: unknown;
}

interface BitTaggedEdgeProps extends EdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data?: BitTaggedEdgeData;
}

export const BitTaggedEdge = (props: BitTaggedEdgeProps) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
  });
  const [showBitwidth] = useEdgeVisibility();

  const bitwidth = props.data?.bitwidth ?? 1;

  return (
    <>
      <BaseEdge id={props.id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div
            className="px-1 text-xs font-mono"
            style={{
              fontSize: "10px",
              lineHeight: "14px",
            }}
          >
            {showBitwidth && bitwidth}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
