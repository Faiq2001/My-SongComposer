import { useEffect } from "react";
import { PillSelector, Timeline } from "./components";
import { useAudio } from "./context";

import "./App.css";

function App() {
  const { audioPills,totalDuration,setIsPlaying,isPlaying,progress,setProgress,playAudio } = useAudio();

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

  // progress bar update
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying]);

  // Check for whether to start the audio or end the time
  useEffect(() => {

    if(isPlaying)  audioPills.forEach((file) => { playAudio(file); });

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
      <Timeline />
      {audioPills.length > 0 && (
        <div className="actionCenter">
          <div className="progressContainer">
            <div
              className="progressBar"
              style={{
                width: `${Math.round((progress * 100) / totalDuration)}%`,
              }}
            ></div>
          </div>
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
        </div>
      )}
    </div>
  );
}

export default App;