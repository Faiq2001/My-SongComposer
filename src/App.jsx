import { PillSelector } from "./components";

import "./App.css";
import ProgressBar from "./ProgressBar";
import Controls from "./Controls";

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