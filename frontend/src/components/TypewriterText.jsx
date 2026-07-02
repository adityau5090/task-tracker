import { useEffect, useState } from "react";

/**
 * Types out `text` one character at a time, pauses for `pauseMs`,
 * then erases it one character at a time, and repeats forever.
 */
const TypewriterText = ({
  text,
  typingSpeed = 90,
  erasingSpeed = 45,
  pauseMs = 4000,
  className = "",
}) => {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pausing | erasing

  useEffect(() => {
    if (!text) return;

    let timeoutId;

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeoutId = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      timeoutId = setTimeout(() => setPhase("erasing"), 0);
    } else if (phase === "erasing") {
      if (displayed.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, erasingSpeed);
      } else {
        timeoutId = setTimeout(() => setPhase("typing"), 400);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayed, phase, text, typingSpeed, erasingSpeed, pauseMs]);

  // Reset animation if the source text changes (e.g. switching users)
  useEffect(() => {
    setDisplayed("");
    setPhase("typing");
  }, [text]);

  return (
    <span className={`typewriter ${className}`}>
      {displayed}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default TypewriterText;
