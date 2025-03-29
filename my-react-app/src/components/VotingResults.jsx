import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VotingResults.css';

const VotingResults = ({ motionID, voteType, onClose }) => {
  const [motion, setMotion] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch motion details
        const motionRes = await axios.get(`/api/motions/id/${motionID}`);
        const motionData = motionRes.data;
        setMotion(motionData);

        // Fetch votes for this motion
        const votesRes = await axios.get(`/api/votes/motion?motionID=${motionID}`);
        const votesData = votesRes.data;

        // Use meetingID from motionData to fetch attendance details
        const meetingID = motionData.meetingID;
        const attendanceRes = await axios.get(`/api/usermeetings/attendance/list?meetingID=${meetingID}`);
        const attendanceData = attendanceRes.data.attendance;

        // Merge votes with attendance info
        const mergedVotes = votesData.map((vote) => {
          const user = attendanceData.find((a) => a.userID === vote.userID);
          return {
            name: user ? user.name : `User ${vote.userID}`,
            role: user ? user.role : 'N/A',
            vote: vote.vote,
          };
        });

        setVotes(mergedVotes);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [motionID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!motion) return <div>No motion data found.</div>;

  const totalVotes = votes.length;
  const forVotes = votes.filter(v => v.vote === "For").length;
  const threshold = motion.requiredVotes;
  const requiredForPass = threshold * totalVotes;
  const passed = forVotes >= requiredForPass;
  const status = passed ? "passed" : "failed";

  return (
    <div className="voting-results-wrapper">
      <div className="title-status-wrapper">
        <h2 className="motion-title">
          <span className="vote-type">{voteType}:</span> {motion.description}
        </h2>
        <p className="status">
          Status: <span className={status === 'passed' ? 'status-passed' : 'status-failed'}>
            {status.toUpperCase()}
          </span>
        </p>
        {onClose && (
          <button onClick={onClose} aria-label="Close">Close</button>
        )}
      </div>
      <div className="voting-results-container">
        <div className="votes-section">
          <div className="votes-list">
            {votes.length > 0 ? (
              votes.map((vote, index) => (
                <div key={index} className="vote-item">
                  <span className="voter-name">{vote.name} ({vote.role}):</span>
                  <span className="voter-vote">{vote.vote}</span>
                </div>
              ))
            ) : (
              <p className="no-votes">No votes recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingResults;