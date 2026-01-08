import type { ReactNode } from "react";

export const nodeDesigns: Record<string, ReactNode> = {
  sourceNode: <div className="w-7 h-7 flex bg-orange-500 rounded-full" />,
  andNode: <div className="rounded-t-xl bg-red-600 w-10 h-7" />,
  notNode: <div className="w-5 h-5 flex bg-blue-600" />,
  xorNode: <div className="w-9 h-9 bg-cyan-600 flex" />,
  outputNode: <div className="w-9 h-9 bg-gray-500 flex" />,
};

export const getNodeDesign = (type: string): ReactNode => {
  return nodeDesigns[type] || null;
};
