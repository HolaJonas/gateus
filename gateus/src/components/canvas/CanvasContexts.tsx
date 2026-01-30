import type { ReactNode } from "react";
import { DnDProvider } from "./DnDContext";
import { EdgeProvider } from "./EdgeContext";
import { ReactFlowProvider } from "@xyflow/react";

interface CanvasContextsProps {
  children: ReactNode;
}

export const CanvasContexts = ({ children }: CanvasContextsProps) => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <EdgeProvider>{children}</EdgeProvider>
      </DnDProvider>
    </ReactFlowProvider>
  );
};
