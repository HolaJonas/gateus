import WindowComponent from "react-flexi-window";
import MenuSection from "./MenuSection";
import { useDnD } from "./DnDContext";
import type { DragEvent, MouseEvent } from "react";

export default function GateMenu() {
  const [_, setType] = useDnD();

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    setType?.(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <WindowComponent
      w={400}
      h={300}
      x={100}
      y={100}
      windowColor="blue-500/20"
      windowBorderColor="blue-600/50"
      windowBorderRadius="lg"
      windowBorder={1}
      windowShadow="lg"
      boundary={true}
      maxW={200}
      maxH={300}
    >
      <div className="p-5">
        <MenuSection sectionHeader="Test">
          <div className="flex p-1 gap-1">
            <div
              className="w-10 h-10 bg-green-600 cursor-grab active:cursor-grabbing"
              onDragStart={(event) => onDragStart(event, "sourceNode")}
              onMouseDown={onMouseDown}
              draggable
            />
            <div
              className="w-10 h-10 bg-yellow-600 cursor-grab active:cursor-grabbing"
              onDragStart={(event) => onDragStart(event, "andNode")}
              onMouseDown={onMouseDown}
              draggable
            />
            <div
              className="w-10 h-10 bg-green-600 cursor-grab active:cursor-grabbing"
              onDragStart={(event) => onDragStart(event, "notNode")}
              onMouseDown={onMouseDown}
              draggable
            />
            <div
              className="w-10 h-10 bg-yellow-600 cursor-grab active:cursor-grabbing"
              onDragStart={(event) => onDragStart(event, "testNode")}
              onMouseDown={onMouseDown}
              draggable
            />
          </div>
        </MenuSection>
      </div>
    </WindowComponent>
  );
}
