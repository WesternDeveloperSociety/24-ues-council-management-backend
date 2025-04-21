import React, { useState } from "react";
import axios from "axios";
import "../styles/SpeakerStartVote.css";

const SpeakerStartVote = ({ meetingID, onStart, onClose }) => {
  // State variables for form inputs
  const [voteType, setVoteType] = useState("Motion"); // Default to "Motion"
  const [motionName, setMotionName] = useState("");
  const [passOption, setPassOption] = useState("2/3"); // Default to "2/3"
  const [customNumerator, setCustomNumerator] = useState("");
  const [customDenominator, setCustomDenominator] = useState("");
  const [publish, setPublish] = useState(true); // Default to checked
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);

  // Available options
  const voteTypes = ["Motion", "Straw", "Action"];
  const passOptions = ["2/3", "1/2", "Custom"];

  // Handle the start button click and call the API
  const handleStart = async () => {
    let threshold;
    if (passOption === "2/3") {
      threshold = 2 / 3;
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

    // Generate a random motionID (ensure uniqueness on production by more robust means)
    const motionID = Math.floor(1000 + Math.random() * 9000);

    // Prepare payload matching your API schema:
    const payload = {
      motionID,              // random unique motionID
      meetingID,             // provided from props
      description: motionName, // using motionName as the description/title
      resultLink: publish ? link : "",  // if publish is true, include the link
      requiredVotes: threshold,         // threshold fraction (e.g., 0.66 for 2/3)
    };

    try {
      const response = await axios.post("/api/motions/create", payload);
      // Optionally, notify the parent component with the new motion data:
      if (onStart) {
        onStart(response.data);
      }
    } catch (err) {
      console.error("Error creating motion:", err.response ? err.response.data : err.message);
      setError("Error creating motion. Please try again.");
    }
  };

  // Disable the start button if required fields are empty
  const isDisabled =
    !motionName.trim() ||
    (passOption === "Custom" &&
      (!customNumerator.trim() || !customDenominator.trim()));

  return (
    <div className="start-vote-modal">
      <div className="modal-header">
        {onClose && (
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <img
              src="https://img.icons8.com/?size=100&id=7FSknHLAHdnP&format=png&color=000000"
              alt="X"
              className="close-icon"
            />
          </button>
        )}
      </div>

      <div className="vote-type-group">
        {voteTypes.map((type) => (
          <button
            key={type}
            className={`vote-type-button ${voteType === type ? "selected" : ""}`}
            onClick={() => setVoteType(type)}
          >
            {type}
          </button>
        ))}
      </div>

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

      <div className="pass-option-group">
        <span>Votes to Pass:</span>
        <div className="pass-option-buttons">
          {passOptions.map((option) => (
            <button
              key={option}
              className={`pass-option-button ${passOption === option ? "selected" : ""}`}
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

      {error && <p className="error-message">{error}</p>}
      <button className="start-button" onClick={handleStart} disabled={isDisabled}>
        START
      </button>
    </div>
  );
};

export default SpeakerStartVote;