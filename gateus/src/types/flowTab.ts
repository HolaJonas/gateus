import type { Edge, Node } from "@xyflow/react";

export type FlowTab = {
  id: string;
  label: string;
  color: string;
  nodes: Node[];
  edges: Edge[];
};