import React from "react";
import { PillsData } from "../../common/constant";
import { useAudio } from "../../context";

import styles from "./PillSelector.module.css";

let audioContext;
if ("AudioContext" in window || "webkitAudioContext" in window) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} else {
  console.error("Web Audio API is not supported in this browser.");
}

const PillSelector = () => {
  const { setNewAudioPills, addActiveAudioSource, addActiveAudioContext } = useAudio();


  const pillClickHandler = (soundSource, soundName, soundColor) => {
    addActiveAudioContext(audioContext);

    // Load and decode the audio file
    fetch(soundSource)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Decode the audio data
        audioContext
          .decodeAudioData(arrayBuffer, (buffer) => {
            // get duration of selected file
            const duration = buffer.duration;

            // Create a new audio source
            const audioSource = audioContext.createBufferSource();
            audioSource.id = Math.random();
            audioSource.buffer = buffer;
            audioSource.startTime = 0;
            audioSource.duration = duration;
            audioSource.path = soundSource;

            // Add the new pill to the list of audio pills
            setNewAudioPills((prevPills) => [
              ...prevPills,
              {
                id: audioSource.id,
                audioName: soundName,
                path: soundSource,
                duration,
                startTime: 0,
                bgColor: soundColor,
              },
            ]).then(() => {
              // Add the audio source to the list of active audio sources
              addActiveAudioSource(audioContext, audioSource);
            });
          })
          .catch((error) => {
            console.error("Error decoding audio data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching audio file:", error);
      });
  };

  return (
    <div className={styles.selectorContainer}>
      <p>Audio Samples</p>
      <div className={styles.pillsContainer}>
        {PillsData.map(({ src, bgColor, name }) => (
          <button
            key={name}
            className={styles.selectorBtn}
            style={{ backgroundColor: bgColor }}
            onClick={() => pillClickHandler(src, name, bgColor)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PillSelector;