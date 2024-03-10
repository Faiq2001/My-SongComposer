import { useEffect } from "react";
import { PillSelector, Timeline } from "./components";
import { useAudio } from "./context";

import "./App.css";
import ProgressBar from "./ProgressBar";
import Controls from "./Controls";

function App() {
  const { audioPills,totalDuration,setIsPlaying,isPlaying,progress,setProgress,playAudio, playbackSpeed } = useAudio();

  //Play Audio
  const playHandler = async () => {
    setIsPlaying(true);
    audioPills.forEach((file) => { playAudio(file); });
  };

  // Pause Audio
  const pauseHandler = () => {
    audioPills.forEach((pill) => {
      pill.context.suspend(); 
    });
    setIsPlaying(false);
  };

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId;

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = progress + (elapsedTime / 1000) * playbackSpeed; // Adjust progress with playback speed

      if (newProgress >= totalDuration) {
        setIsPlaying(false);
        setProgress(0); // Reset progress to 0 when it reaches the end
      } else {
        setProgress(newProgress);
        animationFrameId = requestAnimationFrame(updateProgress);
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

  // Check for whether to start the audio or end the time
  useEffect(() => {

    if(isPlaying && progress<=totalDuration){  audioPills.forEach((file) => { playAudio(file); });}

    if (progress > totalDuration) {
      setProgress(0);
      setIsPlaying(false);
      audioPills.forEach((pill) => {
        pill.source.stop(); 
      });
    }
  }, [progress]);

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