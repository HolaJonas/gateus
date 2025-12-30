import { useState } from "react";

interface TabContainerProps {
  onClick: () => void;
  label: string;
  selected: boolean;
}

export default function TabContainer(props: TabContainerProps) {
  const [value, setValue] = useState(props.label);

  return (
    <li
      className="bg-yellow-500 flex z-10 rounded-md p-1 transition-transform"
      onClick={props.onClick}
      style={{
        transform: props.selected ? "scale(1.1)" : "scale(1)",
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent outline-none cursor-default"
        style={{
          width: `${Math.max(value.length, 1)}ch`,
          fontWeight: `${props.selected ? "bold" : "normal"}`,
        }}
      />
    </li>
  );
}
