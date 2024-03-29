import { useAudio } from "../../context";
import styles from "./Controls.module.css";
import { FaPlay, FaPause } from 'react-icons/fa';

const Controls = () => {
  const { isPlaying, setIsPlaying, audioPills, totalDuration, playbackSpeed, setPlaybackSpeed, playAudio, progress } = useAudio();

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPills.forEach((pill) => {
        pill.context.suspend();
      });
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
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
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInSeconds - totalSeconds) * 100);
  
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={styles.controlsContainer}>
        <div className={styles.Display}>
            <span>Time: </span>
            <span>{formatTime(progress)}</span>
            <span> / </span>
            <span>{formatTime(totalDuration)}</span>
        </div>
        <div className={styles.PlayPauseBtn} onClick={togglePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
        <div className={styles.SpeedBtn} onClick={handlePlaybackSpeedChange}>
            {playbackSpeed}x
        </div> 
    </div>
  );
};

export default Controls;