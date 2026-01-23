import type { FlowTab } from "../canvas/Canvas";
import TabContainer from "./TabContainer";
import { ConfirmDialog, confirmDialog } from "primereact/confirmDialog";

interface TabContainersProps {
  flows: Record<string, FlowTab>;
  setActiveTabId: (id: string) => void;
  activeTabId: string;
  setFlows: (flow: React.SetStateAction<Record<string, FlowTab>>) => void;
  setShowColorWheel: (b: boolean) => void;
}

let tabId = 0;
const getTabId = () => `tab${++tabId}`;

export default function TabContainers(props: TabContainersProps) {
  const handleDelete = (tabId: string, flowLabel: string) => {
    if (Object.entries(props.flows).length > 1) {
      confirmDialog({
        message: `Are you sure you want to delete "${flowLabel}"?`,
        header: "Delete Confirmation",
        icon: "pi pi-exclamation-triangle",
        defaultFocus: "reject",

        accept: () => {
          if (tabId === props.activeTabId) {
            const allTabs = Object.entries(props.flows);
            props.setActiveTabId(
              allTabs[props.activeTabId === allTabs[0][0] ? 1 : 0][0],
            );
          }
          props.setFlows((prev) => {
            const newFlows = { ...prev };
            delete newFlows[tabId];
            return newFlows;
          });
        },
      });
    }
  };

  return (
    <>
      <ConfirmDialog
        className="!bg-slate-800 !border-2 !border-slate-600 !rounded-lg !shadow-xl"
        contentClassName="!bg-slate-800 !text-white"
        headerClassName="!bg-slate-700 !text-white !border-b !border-slate-600"
        acceptClassName="!bg-red-600 hover:!bg-red-700 !border-0 !text-white !px-4 !py-2 !rounded"
        rejectClassName="!bg-slate-600 hover:!bg-slate-500 !border-0 !text-white !px-4 !py-2 !rounded"
      />
      <ul className="flex bg-slate-500 gap-2 p-2">
        {Object.entries(props.flows).map(([tabId, flow]) => (
          <TabContainer
            selected={tabId === props.activeTabId}
            tabColor={flow.color}
            setShowColorWheel={props.setShowColorWheel}
            key={tabId}
            onClick={() => {
              props.setActiveTabId(tabId);
            }}
            onDelete={() => handleDelete(tabId, flow.label)}
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
          className="bg-yellow-500 flex z-10 rounded-md p-1 w-8 h-8 justify-center"
          onClick={() => {
            const flowId = getTabId();
            props.setFlows((prev) => ({
              ...prev,
              [flowId]: {
                id: String(tabId),
                label: String(tabId),
                color: "#eab308",
                nodes: [],
                edges: [],
              },
            }));
            props.setActiveTabId(flowId);
          }}
        >
          {"+"}
        </li>
      </ul>
    </>
  );
}
