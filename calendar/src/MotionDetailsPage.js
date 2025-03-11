// src/MotionDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MotionDetailsPage.css";

const MotionDetailsPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [motionData, setMotionData] = useState({
    title: "UES on Gun Control",
    status: "PASSED",
    votes: [
      { name: "Ethan", vote: "Yes" },
      { name: "Chris", vote: "No" },
      { name: "Bob", vote: "Yes" }
    ]
  });

  // In a real application, you would fetch the motion data based on the date
  useEffect(() => {
    // Example API call (replace with your actual data fetching logic)
    // fetchMotionData(date).then(data => setMotionData(data));
    
    // For demo purposes, we're using static data
    console.log(`Would fetch motion data for date: ${date}`);
  }, [date]);

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page (calendar)
  };

  return (
    <div className="motion-details-container">      
      <div className="motion-content">
        <h1 className="motion-title">Motion Title: {motionData.title}</h1>
        <h2 className="motion-status">Status: <span className={motionData.status.toLowerCase()}>{motionData.status}</span></h2>
        <h2 className="motion-votes-header">Votes:</h2>
        
        <div className="votes-container">
          {motionData.votes.map((voter, index) => (
            <div key={index} className="vote-row">
              <span className="voter-name">{voter.name}:</span>
              <span className="voter-vote">{voter.vote}</span>
            </div>
          ))}
        </div>
      </div>
      
      <button className="back-button" onClick={handleBackClick}>
        Back to Calendar
      </button>
    </div>
  );
};

export default MotionDetailsPage;