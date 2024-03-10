import { PillSelector, ProgressBar, Controls } from "./components";

import "./App.css";

function App() {
  return (
    <div className="appContainer">
      <h1 className="appTitle">Let's start the composition!!!</h1>
      <PillSelector />
      <Controls />
      <ProgressBar />
    </div>
  );
}

export default App;