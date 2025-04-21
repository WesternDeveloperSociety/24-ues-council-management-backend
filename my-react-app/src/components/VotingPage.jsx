import React, { useState } from 'react';
import axios from 'axios';
import useAutoFontSize from '../hooks/useAutoFontSize';
import '../styles/VotingPage.css';

const VotingPage = ({ voteType, motionName, motionID, userID, voteCounts, onVoteSubmit }) => {
  const [selectedVote, setSelectedVote] = useState(null);
  const [error, setError] = useState(null);

  // Use the hook with motionName as the dependency
  const [fontSize, titleRef] = useAutoFontSize(motionName, 2, 1.2);

  const handleVoteSelect = (vote) => {
    setSelectedVote(vote);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedVote) return;

    const voteID = Math.floor(1000 + Math.random() * 9000);
    const voteData = {
      voteID,
      motionID,
      userID,
      vote: selectedVote,
    };

    try {
      const response = await axios.post('/api/votes/create', voteData);
      onVoteSubmit(selectedVote);
      setSelectedVote(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="voting-page-container">
      <h2 
        className="motion-title" 
        ref={titleRef}
        style={{ fontSize: `${fontSize}rem` }}
      >
        <span className="vote-type">{voteType}:</span> {motionName}
      </h2>
      {error && <p className="error-message">{error}</p>}
      <div className="vote-options">
        {['For', 'Against', 'Abstain'].map((option) => (
          <div key={option} className="vote-option">
            <div
              className={`vote-button ${selectedVote === option ? 'selected' : ''}`}
              onClick={() => handleVoteSelect(option)}
              role="button"
              tabIndex={0}
              aria-label={`Vote ${option}, current count: ${voteCounts[option.toLowerCase()] || 0}`}
              onKeyPress={(e) => e.key === 'Enter' && handleVoteSelect(option)}
            >
              <div className="vote-label">{option}</div>
            </div>
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