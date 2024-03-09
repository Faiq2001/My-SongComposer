import { PillsData } from "../../common/constant";
import { useAudio } from "../../context";

import styles from "./PillSelector.module.css";

const PillSelector = () => {
  const { setNewAudioPills, playAudio, isPlaying, progress } = useAudio();


  const pillClickHandler = (soundSource, soundName, soundColor) => {

    let audioContext;
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } else {
      console.error("Web Audio API is not supported in this browser.");
    }

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
            audioSource.buffer = buffer;
            
            // Create a new pill object
            const newPill = {
              id: Math.random(),
              audioName: soundName,
              path: soundSource,
              source: audioSource,
              context: audioContext,
              duration: duration,
              startTime: 0,
              bgColor: soundColor,
              running: false,
            };
            
            // Add the new pill to the list of audio pills
            setNewAudioPills((prevPills) => [...prevPills, newPill])
            if(isPlaying && progress<=duration){ playAudio(newPill); }

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