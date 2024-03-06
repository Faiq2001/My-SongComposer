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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const { audioPills, setAudioPills, totalDuration } = useAudio();

  // Define an array to store references to the active audio sources
  const activeAudioSources = [];

  const playHandler = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      
      // Check if the audio context is closed and create a new one if necessary
      if (!audioContext || audioContext.state === "closed") {
        try {
          // Initialize the audio context
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
          // Clear the array of active audio sources before starting playback
          await Promise.all(activeAudioSources.map((audioSource) => audioSource.stop()));
          activeAudioSources.length = 0;
        } catch (error) {
          console.error("Error initializing audio context:", error);
        }
      }
      
      //Check if the audio context is suspended
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      

      audioPills.forEach((file) => {
        const audioSource = audioContext.createBufferSource();
        activeAudioSources.push(audioSource); // Store the reference to the audio source

        // Load and decode the audio file
        fetch(file.path)
          .then((response) => response.arrayBuffer())
          .then((data) => audioContext.decodeAudioData(data))
          .then((decodedBuffer) => {
            audioSource.buffer = decodedBuffer;
            audioSource.connect(audioContext.destination);
            const startTime = progress; // Set the start time based on progress
            audioSource.start(0, startTime);
          })
          .catch((error) => console.error("Error loading audio file: ", error));
      });
    }
  };

  // pause audio
  const pauseHandler = () => {
    setIsPlaying(false);
    audioContext.suspend(); // Pause the audio context to pause playback
  };

  const resetHandler = async () => {
    setIsPlaying(false);
    setProgress(0);
  
    // Clear the array of active audio sources before starting playback
    await Promise.all(activeAudioSources.map((audioSource) => audioSource.stop()));
    activeAudioSources.length = 0;
  
    // Close the audio context to stop all audio playback
    audioContext.close();
  
    setAudioPills([]);
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
                <button className="audioBtn" id="pause-button" onClick={pauseHandler}>
                  Pause
                </button>
                <button className="audioBtn" onClick={resetHandler}>
                  Reset
                </button>
              </>
            ) : (
              <>
                <button className="audioBtn" id="play-button" onClick={playHandler}>
                  Play
                </button>
                <button className="audioBtn" onClick={resetHandler}>
                  Reset
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