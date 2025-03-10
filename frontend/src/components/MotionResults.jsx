import React from "react";
import "../styles/MotionResults.css";

const MotionResults = ({
  motionName,
  userVote,
  forVotes,
  againstVotes,
  abstainVotes,
  threshold,
  onClose,
}) => {
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const requiredForPass = threshold * totalVotes;
  const passed = forVotes >= requiredForPass;

  return (
    <div className="motion-results">
      {onClose && (
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✖
        </button>
      )}
      <h1>
        {passed ? (
          <span className="passed-text">PASSED</span>
        ) : (
          <span className="failed-text">FAILED</span>
        )}
      </h1>
      <p>
        <strong>Motion:</strong> {motionName}
      </p>
      <p>
        <strong>Your Vote:</strong> {userVote}
      </p>
      <p>
        <strong>Results:</strong> {forVotes}/{againstVotes}/{abstainVotes}
      </p>
    </div>
  );
};

export default MotionResults;
