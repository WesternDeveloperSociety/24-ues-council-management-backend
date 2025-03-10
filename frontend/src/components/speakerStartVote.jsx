import React, { useState } from "react";
import "../styles/SpeakerStartVote.css";

const SpeakerStartVote = ({ onStart, onClose }) => {
  // State variables for form inputs
  const [voteType, setVoteType] = useState("Motion"); // Default to "Motion"
  const [motionName, setMotionName] = useState("");
  const [passOption, setPassOption] = useState("2/3"); // Default to "2/3"
  const [customNumerator, setCustomNumerator] = useState("");
  const [customDenominator, setCustomDenominator] = useState("");
  const [publish, setPublish] = useState(true); // Default to checked
  const [link, setLink] = useState("");

  // Available options
  const voteTypes = ["Motion", "Straw", "Action"];
  const passOptions = ["2/3", "1/2", "Custom"];

  // Handle the start button click
  const handleStart = () => {
    let threshold;
    if (passOption === "2/3") {
      threshold = 2 / 3; // Approx. 0.6667
    } else if (passOption === "1/2") {
      threshold = 0.5;
    } else if (passOption === "Custom") {
      const num = parseFloat(customNumerator);
      const den = parseFloat(customDenominator);
      if (isNaN(num) || isNaN(den) || den === 0) {
        alert("Please enter a valid custom threshold (non-zero denominator).");
        return;
      }
      threshold = num / den;
    }

    // Pass the vote configuration to the parent component
    onStart({
      voteType,
      motionName,
      threshold,
      publish,
      link,
    });
  };

  // Disable the start button if required fields are empty
  const isDisabled =
    !motionName.trim() ||
    (passOption === "Custom" &&
      (!customNumerator.trim() || !customDenominator.trim()));

  return (
    <div className="start-vote-modal">
      <div className="modal-header">
        {/* Close button */}
        {onClose && (
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            X
          </button>
        )}
      </div>

      {/* Vote type selection */}
      <div className="vote-type-group">
        {voteTypes.map((type) => (
          <button
            key={type}
            className={`vote-type-button ${
              voteType === type ? "selected" : ""
            }`}
            onClick={() => setVoteType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Motion name input */}
      <div className="input-group">
        <label htmlFor="motionName">Motion Name:</label>
        <input
          id="motionName"
          type="text"
          value={motionName}
          onChange={(e) => setMotionName(e.target.value)}
          placeholder="Enter motion name"
          required
        />
      </div>

      {/* Votes to pass selection */}
      <div className="pass-option-group">
        <span>Votes to Pass:</span>
        <div className="pass-option-buttons">
          {passOptions.map((option) => (
            <button
              key={option}
              className={`pass-option-button ${
                passOption === option ? "selected" : ""
              }`}
              onClick={() => setPassOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {passOption === "Custom" && (
          <div className="custom-threshold">
            <input
              type="text"
              value={customNumerator}
              onChange={(e) => setCustomNumerator(e.target.value)}
              placeholder="Num"
              aria-label="Custom threshold numerator"
            />
            <span>/</span>
            <input
              type="text"
              value={customDenominator}
              onChange={(e) => setCustomDenominator(e.target.value)}
              placeholder="Den"
              aria-label="Custom threshold denominator"
            />
          </div>
        )}
      </div>

      {/* Publish checkbox */}
      <div className="publish-group">
        <label>
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          To Publish?
        </label>
      </div>

      {/* Link input */}
      <div className="input-group">
        <label htmlFor="link">Link:</label>
        <input
          id="link"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Optional link"
        />
      </div>

      {/* Start button */}
      <button
        className="start-button"
        onClick={handleStart}
        disabled={isDisabled}
      >
        START
      </button>
    </div>
  );
};

export default SpeakerStartVote;
