import { Handle, Position } from "@xyflow/react";

interface AlignedHandlesProps {
  numberOfHandles: number;
  type: "target" | "source";
}

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
