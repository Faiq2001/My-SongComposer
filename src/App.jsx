import { useEffect } from "react";
import { PillSelector, Timeline } from "./components";
import { useAudio } from "./context";

import "./App.css";
import ProgressBar from "./ProgressBar";
import Controls from "./Controls";

function App() {
  const { audioPills,totalDuration,setIsPlaying,isPlaying,progress,setProgress,playAudio, playbackSpeed } = useAudio();

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId;

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = progress + (elapsedTime / 1000) * playbackSpeed; // Adjust progress with playback speed

      if (newProgress >= totalDuration) {
        setIsPlaying(false);
        setProgress(0); // Reset progress to 0 when it reaches the end
        audioPills.forEach((pill) => {
          pill.source.stop(); 
        });
      } else {
        setProgress(newProgress);
        animationFrameId = requestAnimationFrame(updateProgress);
        if(isPlaying && progress<=totalDuration){  audioPills.forEach((file) => { playAudio(file); });}

      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateProgress);
    } else {
      cancelAnimationFrame(animationFrameId);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, progress, totalDuration, setIsPlaying, setProgress, playbackSpeed]);

  return (
    <div className="appContainer">
      <h1 className="appTitle">Common, Common start the compose now!!!</h1>
      <PillSelector />
      <Controls />
      {/* <div className="actionCenter">
        <div className="buttonContainer">
          {isPlaying ? (
            <>
              <button
                className="audioBtn"
                id="pause-button"
                onClick={pauseHandler}
              >
                Pause
              </button>
            </>
          ) : (
            <>
              <button
                className="audioBtn"
                id="play-button"
                onClick={playHandler}
              >
                Play
              </button>
            </>
          )}
        </div>
      </div> */}
      <ProgressBar />
    </div>
  );
}

export default App;