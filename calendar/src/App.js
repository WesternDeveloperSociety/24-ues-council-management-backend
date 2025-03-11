// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import Calendar from "./Calendar";
import MotionDetailsPage from "./MotionDetailsPage";
import logo from "./logo.png"; // Adjust the path to your logo file
import "./App.css";
import "./Calendar.css";

// Wrapper component to handle navigation
function CalendarWrapper({ onMotionSelect }) {
  const navigate = useNavigate();
  
  const handleMotionSelect = (motionID) => {
    onMotionSelect(motionID);
    navigate(`/motion/${motionID}`);
  };
  
  return <Calendar onMotionSelect={handleMotionSelect} />;
}

// Wrapper component for MotionDetailsPage to handle params
function MotionDetailsWrapper({ goBackToCalendar }) {
  const { motionID } = useParams();
  const navigate = useNavigate();
  
  const handleBack = () => {
    goBackToCalendar();
    navigate('/');
  };
  
  return (
    <>
      <button 
        onClick={handleBack} 
        className="back-button"
        style={{ 
          margin: "10px 0", 
          padding: "5px 10px", 
          cursor: "pointer" 
        }}
      >
        ← Back to Calendar
      </button>
      <MotionDetailsPage motionID={motionID} />
    </>
  );
}

// Main App component
function AppContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMotionID, setSelectedMotionID] = useState(null);

  // Update the current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Format the timestamp
  const formatTimestamp = (date) => {
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const day = date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
    return `${time} • ${day}`;
  };

  // Function to go back to calendar view
  const goBackToCalendar = () => {
    setSelectedMotionID(null);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="timestamp">{formatTimestamp(currentTime)}</div>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <h1>UES Motions</h1>
              <CalendarWrapper onMotionSelect={setSelectedMotionID} />
            </>
          } 
        />
        <Route 
          path="/motion/:motionID" 
          element={<MotionDetailsWrapper goBackToCalendar={goBackToCalendar} />} 
        />
      </Routes>
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;