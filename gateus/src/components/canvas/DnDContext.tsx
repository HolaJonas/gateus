import { createContext, useContext, useState, type ReactNode } from "react";
import type { FlowTab } from "./Canvas";

type DnDState = {
  type: string | null;
  flow: FlowTab | null;
};

const DnDContext = createContext<[DnDState, (value: DnDState) => void]>([
  { type: null, flow: null },
  (_: DnDState) => {},
]);

interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider = ({ children }: DnDProviderProps) => {
  const [type, setType] = useState<DnDState>({ type: null, flow: null });

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
