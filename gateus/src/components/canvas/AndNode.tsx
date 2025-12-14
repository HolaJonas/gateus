import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useState } from "react";

export default function AndNode({ id }: NodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [handleCount, setHandleCount] = useState(3);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleCount, updateNodeInternals]);

  switch (direction) {
    case 0: {
      return (
        <>
          <div className="w-10 h-5 flex bg-green-500 rounded-t-full">
            <Handle type="source" position={Position.Top} />
          </div>
          <div className="bg-green-500 w-10 h-3 flex justify-between relative">
            {Array.from({ length: handleCount }).map((_, i) => (
              <Handle
                key={i}
                type="target"
                id={`input-${i}`}
                position={Position.Bottom}
                style={{
                  left: `${((i + 1) * 100) / (handleCount + 1)}%`,
                }}
              />
            ))}
          </div>
        </>
      );
    }
    case 1: {
      return (
        <div className="flex flex-row">
          <div className="bg-green-500 w-3 h-10 flex justify-between relative">
            {Array.from({ length: handleCount }).map((_, i) => (
              <Handle
                key={i}
                type="target"
                id={`input-${i}`}
                position={Position.Left}
                style={{
                  top: `${((i + 1) * 100) / (handleCount + 1)}%`,
                }}
              />
            ))}
          </div>
          <div className="w-5 h-10 flex bg-green-500 rounded-r-full">
            <Handle type="source" position={Position.Right} />
          </div>
        </div>
      );
    }
    case 2: {
      return (
        <>
          <div className="bg-green-500 w-10 h-3 flex justify-between relative">
            {Array.from({ length: handleCount }).map((_, i) => (
              <Handle
                key={i}
                type="target"
                id={`input-${i}`}
                position={Position.Top}
                style={{
                  left: `${((i + 1) * 100) / (handleCount + 1)}%`,
                }}
              />
            ))}
          </div>
          <div className="w-10 h-5 flex bg-green-500 rounded-b-full">
            <Handle type="source" position={Position.Bottom} />
          </div>
        </>
      );
    }
    case 3: {
      return (
        <div className="flex flex-row">
          <div className="w-5 h-10 flex bg-green-500 rounded-l-full">
            <Handle type="source" position={Position.Left} />
          </div>
          <div className="bg-green-500 w-3 h-10 flex justify-between relative">
            {Array.from({ length: handleCount }).map((_, i) => (
              <Handle
                key={i}
                type="target"
                id={`input-${i}`}
                position={Position.Right}
                style={{
                  top: `${((i + 1) * 100) / (handleCount + 1)}%`,
                }}
              />
            ))}
          </div>
        </div>
      );
    }
  }
}
