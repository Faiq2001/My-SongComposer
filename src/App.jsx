import React, { useEffect, useState } from "react";
import { PillSelector, Timeline } from "./components";
import { useAudio } from "./context";

import "./App.css";

// Check if the Web Audio API is supported in the current browser
let audioContext;
if ("AudioContext" in window || "webkitAudioContext" in window) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} else {
  console.error("Web Audio API is not supported in this browser.");
}

function App() {
  const {
    audioPills,
    totalDuration,
    setIsPlaying,
    isPlaying,
    progress,
    setProgress,
    addActiveAudioSource,
    activeAudioContexts,
    addActiveAudioContext,
    playAudio,
  } = useAudio();

  const playHandler = async () => {
    if (!isPlaying) {
      setIsPlaying(true);

      addActiveAudioContext(audioContext);

      //Check if the audio context is suspended
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      audioPills.forEach((file) => {
        // Load and decode the audio file
        fetch(file.path)
          .then((response) => response.arrayBuffer())
          .then((data) => audioContext.decodeAudioData(data))
          .then((decodedBuffer) => {
            const audioSource = audioContext.createBufferSource();
            audioSource.buffer = decodedBuffer;
            audioSource.startTime = file.startTime;
            audioSource.duration = decodedBuffer.duration;
            audioSource.path = file.path;

            playAudio(audioContext, audioSource);

            addActiveAudioSource(audioSource);
          })
          .catch((error) => console.error("Error loading audio file: ", error));
      });
    }
  };

  // Pause Audio
  const pauseHandler = () => {
    activeAudioContexts.forEach((audioContext) => {
      audioContext.suspend(); 
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

  useEffect(() => {
    if (progress > totalDuration) {
      setProgress(0);
      setIsPlaying(false);
    }
  }, [progress, totalDuration]);

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
