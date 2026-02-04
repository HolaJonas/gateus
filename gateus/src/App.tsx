import Header from "./components/header/Header";
import Canvas from "./components/canvas/Canvas";

function App() {
  return (
    <div className="h-screen flex flex-col" style={{background: "#DAE5E8"}}>
      <Header />
      <Canvas />
    </div>
  );
}

export default App;
