import { useContext, createContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioPills, setAudioPills] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const totalDuration = 60;

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
    
    if (progress>=pill.startTime && progress <= pill.startTime + pill.duration) {
      if (audioContext.state === "suspended"){
        audioContext.resume();
      } else{
        if(!audioSource.state || audioSource.state === 'finished'){
          pill.source.disconnect();
          pill.source = audioContext.createBufferSource();
          pill.source.buffer = buffer;
          pill.source.connect(audioContext.destination);
          audioSource = pill.source;
        }
        const offset = Math.max(progress - pill.startTime, 0); // Calculate the offset for starting the audio
        audioSource.start(0, offset);
        pill.running = true;
      }

      // Listen for when the audio playback ends
      audioSource.onended = () => {
          audioSource.stop();
          pill.running=false;
      }
    }else if(pill.running){
        audioSource.stop();
        pill.running = false;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audioPills,
        setNewAudioPills,
        totalDuration,
        isPlaying,
        setIsPlaying,
        progress,
        setProgress,
        playbackSpeed,
        setPlaybackSpeed,
        playAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
