import { Handle, Position } from "@xyflow/react";

interface AlignedHandlesProps {
  numberOfHandles: number;
  type: "target" | "source";
}

/**
 * Component used in nodes to dynamically generate evenly spaced handles.
 *
 * @export
 * @param {AlignedHandlesProps} param0
 * @param {number} param0.numberOfHandles number of handles
 * @param {("target" | "source")} param0.type type of handles
 * @returns {*}
 */
export default function AlignedHandles({
  numberOfHandles,
  type,
}: AlignedHandlesProps) {
  return (
    <>
      {Array.from({ length: numberOfHandles }).map((_, i) => (
        <Handle
          key={i}
          type={type}
          id={`input-${i}`}
          position={type === "target" ? Position.Bottom : Position.Top}
          style={{
            left: `${((i + 1) * 100) / (numberOfHandles + 1)}%`,
          }}
        />
      ))}
    </>
  );
}
