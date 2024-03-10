import { useState, useEffect } from "react";
import { useAudio } from "./context";

const Controls = () => {
  const { isPlaying, setIsPlaying, audioPills, totalDuration, playbackSpeed, setPlaybackSpeed, playAudio } = useAudio();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + (1 / playbackSpeed));
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPills.forEach((pill) => {
        pill.context.suspend();
      });
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentTime(0);
      audioPills.forEach((file) => {
        playAudio(file);
      });
    }
  };

  const handlePlaybackSpeedChange = () => {
    const newSpeed = playbackSpeed === 1 ? 2 : 1;
    setPlaybackSpeed(newSpeed);
  };

  const formatTime = (timeInSeconds) => {
    const totalSeconds = Math.floor(timeInSeconds);
    const milliseconds = Math.floor((timeInSeconds - totalSeconds) * 100);
    return `${totalSeconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="controlsContainer">
        <div className="Display">
            <span>Time: </span>
            <span>{formatTime(totalDuration * (currentTime / totalDuration))}</span>
            <span> / </span>
            <span>{formatTime(totalDuration)}</span>
        </div>
        <button className="PlayPauseBtn" onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="SpeedBtn" onClick={handlePlaybackSpeedChange}>
        {playbackSpeed}x
        </button>
    </div>
  );
};

export default Controls;