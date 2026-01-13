import WindowComponent from "react-flexi-window";
import MenuSection from "./MenuSection";
import { useDnD } from "./DnDContext";
import type { DragEvent, MouseEvent } from "react";
import type { FlowTab } from "./Canvas";
import { nodeDesigns } from "../../lib/NodeDesigns";

interface GateMenuProps {
  flows: Record<string, FlowTab>;
  activeTabId: string;
}

export default function GateMenu(props: GateMenuProps) {
  const [_, setType] = useDnD();

  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    nodeType: string,
    flow?: FlowTab
  ) => {
    setType?.({ type: nodeType, flow: flow ?? null });
    event.dataTransfer.effectAllowed = "move";
  };

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <WindowComponent
      w={300}
      x={100}
      y={100}
      windowColor="blue-500/20"
      windowBorderColor="blue-600/50"
      windowBorderRadius="lg"
      windowBorder={1}
      windowShadow="lg"
      boundary={true}
      maxW={300}
      maxH={800}
    >
      <div className="p-5">
        <MenuSection sectionHeader="Test">
          <div className="flex flex-wrap p-1 gap-1">
            {Object.entries(nodeDesigns).map(([type, design]) => (
              <div key={type} className="flex flex-col items-center gap-1">
                <div
                  className="opacity-50 cursor-grab active:cursor-grabbing"
                  onDragStart={(event) => onDragStart(event, type)}
                  onMouseDown={onMouseDown}
                  draggable
                >
                  <div className="brightness-75">{design}</div>
                </div>
                <span className="text-xs text-center">
                  {type
                    .replaceAll("Node", "")
                    .replace(type[0], type[0].toLocaleUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </MenuSection>
        {Object.entries(props.flows).length > 1 ? (
          <MenuSection sectionHeader="Custom">
            <div className="flex flex-wrap p-1 gap-1">
              {Object.entries(props.flows)
                .filter(([tabId]) => tabId !== props.activeTabId)
                .map(([tabId, flow]) => (
                  <div
                    key={tabId}
                    className="opacity-50 cursor-grab active:cursor-grabbing"
                    onDragStart={(event) =>
                      onDragStart(event, "customNode", flow)
                    }
                    onMouseDown={onMouseDown}
                    draggable
                  >
                    <div className="brightness-75">
                      <div
                        className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-xs font-bold p-2"
                        style={{ backgroundColor: flow.color || "#eab308" }}
                      >
                        {flow.label}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </MenuSection>
        ) : (
          ""
        )}
      </div>
    </WindowComponent>
  );
}
