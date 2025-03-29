import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MotionResults.css";

const MotionResults = ({ motionID, userID, onClose }) => {
  const [motion, setMotion] = useState(null);
  const [votes, setVotes] = useState({ for: 0, against: 0, abstain: 0, userVote: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMotionAndVotes = async () => {
      try {
        // Fetch motion details
        const motionRes = await axios.get(`/api/motions/id/${motionID}`);
        setMotion(motionRes.data);

        // Fetch votes for this motion
        const votesRes = await axios.get(`/api/votes/motion?motionID=${motionID}`);
        const votesData = votesRes.data;

        // Count votes and record the current user's vote
        let forVotes = 0,
          againstVotes = 0,
          abstainVotes = 0,
          userVote = "";
        votesData.forEach((vote) => {
          if (vote.vote === "For") forVotes++;
          else if (vote.vote === "Against") againstVotes++;
          else if (vote.vote === "Abstain") abstainVotes++;

          if (vote.userID === userID) {
            userVote = vote.vote;
          }
        });
        setVotes({ for: forVotes, against: againstVotes, abstain: abstainVotes, userVote });
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMotionAndVotes();
  }, [motionID, userID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!motion) return <div>No motion data found.</div>;

  // Calculate if the motion passed based on the threshold (requiredVotes is stored as a fraction)
  const totalVotes = votes.for + votes.against + votes.abstain;
  const requiredForPass = motion.requiredVotes * totalVotes;
  const passed = votes.for >= requiredForPass;

  return (
    <div className="motion-results">
      {onClose && (
        <button className="close-button" onClick={onClose} aria-label="Close">
          <img
            src="https://img.icons8.com/?size=100&id=7FSknHLAHdnP&format=png&color=000000"
            alt="X"
            className="close-icon"
          />
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
        <strong>Motion:</strong> {motion.description}
      </p>
      <p>
        <strong>Your Vote:</strong> {votes.userVote}
      </p>
      <p>
        <strong>Results:</strong> {votes.for}/{votes.against}/{votes.abstain}
      </p>
    </div>
  );
};

export default MotionResults;