// src/App.js
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import logo from "./logo.png"; // Adjust the path to your logo file
import "./App.css";
import "./Calendar.css";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="App">
      <div className="header">
        <div className="timestamp">{formatTimestamp(currentTime)}</div>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1>UES Motions</h1>
      <Calendar />
    </div>
  );
}

export default App;