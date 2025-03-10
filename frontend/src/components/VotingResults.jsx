import React from 'react';
import './VotingResults.css';

const VotingResults = ({ motionTitle, status, votes }) => {
  return (
    <div className="voting-results-container">
      <h2 className="motion-title">Motion Title: {motionTitle}</h2>
      <p className="status">
        Status: <span className={status === 'passed' ? 'status-passed' : 'status-failed'}>
          {status.toUpperCase()}
        </span>
      </p>
      <div className="votes-section">
        <h3 className="votes-label">Votes:</h3>
        <div className="votes-list">
          {votes.length > 0 ? (
            votes.map((vote, index) => (
              <div key={index} className="vote-item">
                <span className="voter-name">{vote.name}:</span>
                <span className="voter-vote">{vote.vote}</span>
              </div>
            ))
          ) : (
            <p className="no-votes">No votes recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingResults;