import type { FlowTab } from "./Canvas";
import TabContainer from "./TabContainer";

interface TabContainersProps {
  flows: Record<string, FlowTab>;
  setActiveTabId: (id: string) => void;
  activeTabId: string;
  setFlows: (flow: React.SetStateAction<Record<string, FlowTab>>) => void;
}

let tabId = 0;
const getTabId = () => `tab${++tabId}`;

export default function TabContainers(props: TabContainersProps) {
  return (
    <ul className="flex bg-slate-500 gap-2 p-2">
      {Object.entries(props.flows).map(([tabId, flow]) => (
        <TabContainer
          selected={tabId === props.activeTabId}
          key={tabId}
          onClick={() => {
            props.setActiveTabId(tabId);
          }}
          label={flow.label}
          setLabel={(label: string) =>
            props.setFlows((prev) => ({
              ...prev,
              [props.activeTabId]: {
                ...prev[props.activeTabId],
                label: label,
              },
            }))
          }
        />
      ))}
      <li
        className="bg-yellow-500 flex z-10 rounded-md p-1"
        onClick={() => {
          const flowId = getTabId();
          props.setFlows((prev) => ({
            ...prev,
            [flowId]: {
              id: String(tabId),
              label: String(tabId),
              nodes: [],
              edges: [],
            },
          }));
        }}
      >
        {"+"}
      </li>
    </ul>
  );
}
