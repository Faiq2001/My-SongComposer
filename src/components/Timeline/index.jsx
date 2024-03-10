import { useEffect, useState } from "react";
import { useAudio } from "../../context";
import { calculateOffset, calculateWidth } from "../../common/utils";

import styles from "./Timeline.module.css";

import { FaTimes } from 'react-icons/fa';

const TimelineRow = ({ audioData, totalDuration }) => {
  const { audioName, duration, startTime, bgColor, id } = audioData;
  const { audioPills, setNewAudioPills, progress } = useAudio();

  const [isDragging, setIsDragging] = useState(false);
  const [leftMargin, setLeftMargin] = useState(
    calculateOffset(startTime, totalDuration)
  );
  const [startX, setStartX] = useState(0);
  const [selectedPill, setSelectedPill] = useState("");
  
  const removePill = (idToRemove) => {
    audioPills.forEach((pill) => {
      if(pill.id===idToRemove && pill.running){
        pill.context.suspend();
        pill.source.stop();
        pill.running = false;
        pill.source.disconnect();
      }
    });
    setNewAudioPills((prevPills) => {
      return prevPills.map((pill) => {
        if (pill.id === idToRemove) {
          return null;
        } else {
          return pill;
        }
      }).filter(Boolean); // Filter out null values (removed pills)
    });
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    const parentWidth = e.currentTarget.parentElement.offsetWidth;
    setIsDragging(true);

    setStartX(e.clientX - (leftMargin * parentWidth) / 100);
    setSelectedPill(id);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newLeftMargin = e.clientX - startX;
      const parentWidth = e.currentTarget.parentElement.offsetWidth;
      const componentWidth = e.currentTarget.offsetWidth;

      const minLeftMargin = 0;
      const maxLeftMargin = parentWidth - componentWidth;

      const clampedLeftMargin = Math.max(minLeftMargin,Math.min(newLeftMargin, maxLeftMargin));
      const percentMargin = (clampedLeftMargin / parentWidth) * 100;
      setLeftMargin(percentMargin);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setNewAudioPills((prevPills) => {
      return prevPills.map((pill) => {
        if (pill.id === selectedPill) {
          pill.startTime = (totalDuration * leftMargin) / 100;
        }
        return pill;
      });
    });
  };

  useEffect(() => {
    setLeftMargin(calculateOffset(startTime, totalDuration));
  }, [audioPills]);

  return (
    <div className={styles.timelineRow}>
      <div
        style={{
          width: `${calculateWidth(duration, totalDuration)}%`,
          marginLeft: `${leftMargin}%`,
          backgroundColor: bgColor,
        }}
        className={`${styles.rowPill} ${isDragging ? styles.dragging : ""}`}
        onMouseDown={(e) => handleMouseDown(e, id)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => handleMouseDown(e, id)}
        onTouchMoveCapture={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
      >
        <p>{audioName}</p>
        <button className={styles.closeBtn} onClick={() => removePill(id)}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { audioPills, totalDuration } = useAudio();

  return (
    <div className={styles.timelineContainer}>
      {audioPills.length > 0 ? audioPills.map((pill) => (
        <TimelineRow
          key={pill.id}
          audioData={pill}
          totalDuration={totalDuration}
        />
      )) : (
        <p>Select audio files to create your own audio timeline.</p>
      )}
    </div>
  );
};

export default Timeline;