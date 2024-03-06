import { useContext, createContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioPills, setAudioPills] = useState([]);
  const [activeAudioSources, setActiveAudioSources] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeAudioContexts, setActiveAudioContexts] = useState([]);
  const totalDuration = 50;

  const setNewAudioPills = async (newPills) => {
    return new Promise((resolve) => {
      setAudioPills(newPills);
      resolve();
    });
  };

  const playAudio = (audioContext, audioSource, path) => {
    audioSource.connect(audioContext.destination);
    const startTime = audioSource.startTime; // Set the start time from the audio file data
    if (progress <= startTime + audioSource.duration) {
      // Check if the current progress is within the duration of the audio file
      const offset = Math.max(progress - startTime, 0); // Calculate the offset for starting the audio
      audioSource.start(0, offset);
    }  
  };

  // Function to add an audio source to the list of active audio sources
  const addActiveAudioSource = (audioContext, audioSource) => {
    setActiveAudioSources((prevActiveAudioSources) => [
      ...prevActiveAudioSources,
      audioSource,
    ]);

    // If the player is already playing, start playback of the newly added audio source
    if (isPlaying) {
      playAudio(audioContext, audioSource);
    }
  };

  const addActiveAudioContext = (audioContext) => {
    setActiveAudioContexts((prevActiveAudioContexts) => [
      ...prevActiveAudioContexts,
      audioContext,
    ]);
  };


  // Function to remove an audio source from the list of active audio sources
  const removeActiveAudioSource = (audioSource) => {
    setActiveAudioSources((prevActiveAudioSources) =>
      prevActiveAudioSources.filter((source) => source !== audioSource)
    );
  };

  return (
    <AudioContext.Provider
      value={{
        audioPills,
        setNewAudioPills,
        activeAudioSources,
        addActiveAudioSource,
        activeAudioContexts,
        addActiveAudioContext,
        removeActiveAudioSource,
        totalDuration,
        isPlaying,
        setIsPlaying,
        progress,
        setProgress,
        playAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
