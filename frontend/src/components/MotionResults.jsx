import React from 'react';
import './MotionResults.css';

const MotionResults = ({ motionName, userVote, forVotes, againstVotes, abstainVotes, threshold, onClose }) => {
  // Calculate total votes and determine if the motion passed
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const requiredForPass = threshold * totalVotes;
  const passed = forVotes >= requiredForPass;

  return (
    <div className="motion-results">
      {onClose && (
        <button className="close-button" onClick={onClose} aria-label="Close">
          X
        </button>
      )}
      <h1 className={passed ? 'passed' : 'failed'}>{passed ? 'PASSED' : 'FAILED'}</h1>
      <p>Motion: {motionName}</p>
      <p>Your Vote: {userVote}</p>
      <div className="results-breakdown">
        <p>For: {forVotes}</p>
        <p>Against: {againstVotes}</p>
        <p>Abstain: {abstainVotes}</p>
      </div>
    </div>
  );
};

export default MotionResults;