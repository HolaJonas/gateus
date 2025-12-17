import WindowComponent from "react-flexi-window";

export default function GateMenu() {
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
    >
      <div style={{ padding: "20px" }}>
        <h2>My Window</h2>
        <p>This is a draggable and resizable window!</p>
      </div>
    </WindowComponent>
  );
}
