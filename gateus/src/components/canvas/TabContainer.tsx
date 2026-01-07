import { FaRegCircleXmark } from "react-icons/fa6";

interface TabContainerProps {
  onClick: () => void;
  label: string;
  selected: boolean;
  setLabel: (label: string) => void;
  onDelete: () => void;
}

export default function TabContainer(props: TabContainerProps) {
  return (
    <li
      className="bg-yellow-500 flex items-center z-10 rounded-md p-1 transition-transform flex-shrink-0"
      style={{
        transform: props.selected ? "scale(1.1)" : "scale(1)",
        maxWidth: "200px",
      }}
    >
      <input
        onClick={props.onClick}
        value={props.label}
        onChange={(e) => props.setLabel(e.target.value.slice(0, 10))}
        className="bg-transparent outline-none cursor-default truncate"
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
