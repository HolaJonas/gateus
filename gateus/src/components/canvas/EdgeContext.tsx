import { createContext, useContext, useState, type ReactNode } from "react";

const EdgeContext = createContext<[boolean, (value: boolean) => void]>([
  true,
  (_: boolean) => {},
]);

interface EdgeProviderProps {
  children: ReactNode;
}

export const EdgeProvider = ({ children }: EdgeProviderProps) => {
  const [showBitwidth, setShowBitwidth] = useState(true);

  return (
    <EdgeContext.Provider value={[showBitwidth, setShowBitwidth]}>
      {children}
    </EdgeContext.Provider>
  );
};

export default EdgeContext;

export const useEdgeVisibility = () => {
  return useContext(EdgeContext);
};
