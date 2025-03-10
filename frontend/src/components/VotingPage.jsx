import React, { useState } from 'react';
import './VotingPage.css';

const VotingPage = ({ motionTitle, voteCounts, onVoteSubmit }) => {
  const [selectedVote, setSelectedVote] = useState(null);

  const handleVoteSelect = (vote) => {
    setSelectedVote(vote);
  };

  const handleSubmit = () => {
    if (selectedVote) {
      onVoteSubmit(selectedVote);
      setSelectedVote(null); // Reset selection after submission
    }
  };

  return (
    <div className="voting-page-container">
      <h2 className="motion-title">{motionTitle}</h2>
      <div className="vote-options">
        {['For', 'Against', 'Abstain'].map((option) => (
          <div
            key={option}
            className={`vote-option ${selectedVote === option ? 'selected' : ''}`}
            onClick={() => handleVoteSelect(option)}
            role="button"
            tabIndex={0}
            aria-label={`Vote ${option}, current count: ${voteCounts[option.toLowerCase()] || 0}`}
            onKeyPress={(e) => e.key === 'Enter' && handleVoteSelect(option)}
          >
            <div className="vote-label">{option}</div>
            <div className="vote-count">{voteCounts[option.toLowerCase()] || 0}</div>
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!selectedVote}
        aria-label="Submit your vote"
      >
        Submit
      </button>
    </div>
  );
};

export default VotingPage;