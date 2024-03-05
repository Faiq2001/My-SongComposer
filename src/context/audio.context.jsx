import { useContext, createContext, useState, useEffect } from "react";

const AudioContext = createContext();

export const AudioProvider = ({children}) => {

  const [audioPills, setAudioPills] = useState([])
  const totalDuration = audioPills.reduce(
      (acc, pill) => (acc += pill.duration),
      0
  );

  return (
    <AudioContext.Provider value={{audioPills, setAudioPills, totalDuration}}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext)