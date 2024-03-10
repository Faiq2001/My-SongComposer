import { useState, useEffect, useRef } from "react";
import { useAudio } from "./context";
import "./ProgressBar.css";
import { Timeline } from "./components";

const ProgressBar = () => {
    const { audioPills,totalDuration,setIsPlaying,isPlaying,progress,setProgress,playAudio, playbackSpeed } = useAudio();
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const progressContainerRef = useRef(null);


    useEffect(() => {
        let startTime = Date.now();
        let animationFrameId;
    
        const updateProgress = () => {
          const elapsedTime = Date.now() - startTime;
          const newProgress = progress + (elapsedTime / 1000) * playbackSpeed; // Adjust progress with playback speed
    
          if (newProgress >= totalDuration) {
            setIsPlaying(false);
            setProgress(0); // Reset progress to 0 when it reaches the end
            audioPills.forEach((pill) => {
              pill.source.stop(); 
            });
          } else {
            setProgress(newProgress);
            animationFrameId = requestAnimationFrame(updateProgress);
            if(isPlaying && progress<=totalDuration){  audioPills.forEach((file) => { playAudio(file); });}
    
          }
        };
    
        if (isPlaying) {
          animationFrameId = requestAnimationFrame(updateProgress);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
    
        return () => {
          cancelAnimationFrame(animationFrameId);
        };
      }, [isPlaying, progress, totalDuration, setIsPlaying, setProgress, playbackSpeed]);

    const handleProgressMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (isDragging){
            const parentWidth = progressContainerRef.current.offsetWidth;
            const deltaX = e.clientX - startX;
            const newProgress = progress + ((deltaX / parentWidth) * totalDuration);
            const clampedProgress = Math.max(0, Math.min(newProgress, totalDuration));
            setProgress(clampedProgress);
        }
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    }
    
    useEffect(() => {
        const handleMouseMoveWindow = (e) => handleMouseMove(e);
        const handleMouseUpWindow = () => handleMouseUp();

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMoveWindow);
            window.addEventListener("mouseup", handleMouseUpWindow);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMoveWindow);
            window.removeEventListener("mouseup", handleMouseUpWindow);
        };
    }, [isDragging, startX]);


    return (
        <div className="progressContainer" ref={progressContainerRef}>
            <Timeline />
            <div
                className={`progressLine ${isDragging ? "dragging" : ""}`}
                style={{ left: `${(progress / totalDuration) * 100}%` }}
                onMouseDown={(e) => handleProgressMouseDown(e)}
                onTouchStart={(e) => handleProgressMouseDown(e)}
            > 
            </div>
        </div>
    );
};

export default ProgressBar;