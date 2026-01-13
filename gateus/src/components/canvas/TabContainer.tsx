import { useRef, useState } from "react";
import { FaRegCircleXmark, FaPalette } from "react-icons/fa6";

interface TabContainerProps {
  onClick: () => void;
  label: string;
  selected: boolean;
  setLabel: (label: string) => void;
  onDelete: () => void;
  setShowColorWheel: (b: boolean) => void;
  tabColor: string;
}

export default function TabContainer(props: TabContainerProps) {
  const [readOnly, setReadOnly] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <li
      className="flex items-center z-10 rounded-md p-1 transition-transform flex-shrink-0"
      style={{
        background: props.tabColor,
        transform: props.selected ? "scale(1.1)" : "scale(1)",
        maxWidth: "200px",
      }}
    >
      {showPalette && (
        <div
          className="hover:bg-slate-300 hover:opacity-40 w-4 h-4 flex items-center justify-center rounded-xl"
          onClick={() => props.setShowColorWheel(true)}
        >
          <FaPalette />
        </div>
      )}
      <input
        value={props.label}
        id={props.label}
        onChange={(e) => props.setLabel(e.target.value.slice(0, 10))}
        onDoubleClick={() => {
          setReadOnly(false);
          setShowPalette(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        ref={inputRef}
        onClick={props.onClick}
        readOnly={readOnly}
        onFocus={(e) => readOnly && e.target.blur()}
        onBlur={() => {
          setReadOnly(true);
          setTimeout(() => setShowPalette(false), 3000);
        }}
        className="bg-transparent outline-none cursor-default truncate focus:bg-yellow-200 focus:bg-opacity-60 rounded px-1 transition-colors"
        style={{
          width: `${Math.min(Math.max(props.label.length + 1, 3), 20)}ch`,
          fontWeight: `${props.selected ? "bold" : "normal"}`,
        }}
      />
      <div
        className="hover:bg-slate-300 hover:opacity-40 w-4 h-4 flex items-center justify-center rounded-xl"
        onClick={props.onDelete}
      >
        <FaRegCircleXmark />
      </div>
    </li>
  );
}
