import { useState, useEffect, useRef } from "react";
import { useAudio } from "./context";
import "./ProgressBar.css";
import { Timeline } from "./components";

const ProgressBar = () => {
    const { totalDuration, progress, setProgress } = useAudio();
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const progressContainerRef = useRef(null);

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