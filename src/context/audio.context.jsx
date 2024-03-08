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

  const playAudio = (pill) => {
    let audioSource = pill.source;
    const buffer = pill.source.buffer;
    const audioContext = pill.context;

    audioSource.connect(audioContext.destination);

    // Check if the current progress is within the duration of the audio file
    if (progress>=pill.startTime && progress <= pill.startTime + pill.duration) {
      if (audioContext.state === "suspended"){//Check if the audio context is suspended
        audioContext.resume();
      }
      else{
        if(!audioSource.state || audioSource.state === 'finished'){
          pill.source.disconnect();
          pill.source = audioContext.createBufferSource();
          pill.source.buffer = buffer;
          pill.source.connect(audioContext.destination);
          audioSource = pill.source;
        }
        const offset = Math.max(progress - pill.startTime, 0); // Calculate the offset for starting the audio
        audioSource.start(0, offset);
      }
      // Listen for when the audio playback ends
      audioSource.onended = () => {
        audioSource.stop();
      }
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
