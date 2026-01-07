interface TabContainerProps {
  onClick: () => void;
  label: string;
  selected: boolean;
  setLabel: (label: string) => void;
}

export default function TabContainer(props: TabContainerProps) {
  return (
    <li
      className="bg-yellow-500 flex z-10 rounded-md p-1 transition-transform"
      onClick={props.onClick}
      style={{
        transform: props.selected ? "scale(1.1)" : "scale(1)",
      }}
    >
      <input
        value={props.label}
        onChange={(e) => props.setLabel(e.target.value)}
        className="bg-transparent outline-none cursor-default"
        style={{
          width: `${Math.max(props.label.length, 1)}ch`,
          fontWeight: `${props.selected ? "bold" : "normal"}`,
        }}
      />
    </li>
  );
}
