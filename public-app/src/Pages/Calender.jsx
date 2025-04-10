import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Logo from './logo.png';
import './Calender.css';

// Define base API URL - updated to match your actual running port (5000)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Calender = () => {
  // State management
  const [selectedMotion, setSelectedMotion] = useState(null);
  const [motions, setMotions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [votes, setVotes] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all meetings
  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/meetings/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      const data = await response.json();
      console.log('Meetings fetched:', data);
      setMeetings(data);
      return data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings');
      return [];
    }
  };

  // Function to fetch all motions
  const fetchMotions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/motions/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch motions');
      }
      const data = await response.json();
      console.log('Motions fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching motions:', error);
      setError('Failed to load motions');
      return [];
    }
  };

  // Function to fetch votes for a specific motion
  const fetchVotesForMotion = async (motionID) => {
    try {
      const response = await fetch(`${API_URL}/api/votes/motion/${motionID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch votes for motion ${motionID}`);
      }
      const data = await response.json();
      console.log(`Votes for motion ${motionID} fetched:`, data);
      
      // Update the votes state with the new data
      setVotes(prev => ({
        ...prev,
        [motionID]: data
      }));
      
      return data;
    } catch (error) {
      console.error(`Error fetching votes for motion ${motionID}:`, error);
      return [];
    }
  };

  // Function to fetch user details for votes
  const fetchUserMeetings = async (meetingID) => {
    try {
      const response = await fetch(`${API_URL}/api/usermeetings/attendance/list?meetingID=${meetingID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance for meeting ${meetingID}`);
      }
      const data = await response.json();
      console.log(`Attendance for meeting ${meetingID} fetched:`, data);
      return data.attendance || [];
    } catch (error) {
      console.error(`Error fetching attendance for meeting ${meetingID}:`, error);
      return [];
    }
  };

  // Function to handle motion selection and fetch related votes
  const handleMotionSelect = async (motion) => {
    setSelectedMotion(motion);
    
    // If we don't already have votes for this motion, fetch them
    if (!votes[motion.motionID]) {
      await fetchVotesForMotion(motion.motionID);
    }
  };

  useEffect(() => {
    // Update date/time every minute
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    // Fetch data on component mount
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch meetings first
        const meetingsData = await fetchMeetings();
        
        // Then fetch motions
        const motionsData = await fetchMotions();
        
        if (meetingsData.length === 0 || motionsData.length === 0) {
          setError("No data available. Please check if your backend server is running.");
          setLoading(false);
          return;
        }
        
        // Enrich motion data with meeting date info
        const enrichedMotions = motionsData.map(motion => {
          const meeting = meetingsData.find(m => m.meetingID === motion.meetingID);
          return {
            ...motion,
            id: motion.motionID, // Ensure we have an id field for React keys
            date: meeting ? new Date(meeting.date) : new Date(),
            title: motion.description || `Motion ${motion.motionID}`,
            description: `Meeting ID: ${motion.meetingID} - Required Votes: ${motion.requiredVotes}`,
            status: "PENDING" // Default status, can be updated with vote counts
          };
        });
        
        // Sort motions by date (most recent first)
        const sortedMotions = enrichedMotions.sort((a, b) => b.date - a.date);
        setMotions(sortedMotions);
        
        // Initialize first date as expanded
        if (sortedMotions.length > 0) {
          const firstDateString = sortedMotions[0].date.toDateString();
          setExpandedDates({ [firstDateString]: true });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please check if your backend server is running on port 5000.");
        setLoading(false);
      }
    };
    
    loadData();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Group motions by date
  const getGroupedMotions = () => {
    const groupedMotions = {};
    
    motions.forEach(motion => {
      // Make sure date is a Date object
      const motionDate = motion.date instanceof Date ? motion.date : new Date(motion.date);
      const dateString = motionDate.toDateString();
      
      if (!groupedMotions[dateString]) {
        groupedMotions[dateString] = [];
      }
      groupedMotions[dateString].push(motion);
    });
    
    // Convert to array, sort by date (newest first), and convert back to object
    return Object.fromEntries(
      Object.entries(groupedMotions)
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    );
  };

  // Toggle expanding/collapsing a date
  const toggleDateExpansion = (dateString) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateString]: !prev[dateString]
    }));
  };

  // Format date string for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format the current time
  const formatCurrentTime = () => {
    const time = currentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const date = currentDateTime.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
    
    return `${time} • ${date}`;
  };

  // Check the motion status based on votes
  const getMotionStatus = (motion) => {
    if (!votes[motion.motionID]) {
      return "PENDING";
    }
    
    const forVotes = votes[motion.motionID].filter(v => v.vote === "For").length;
    return forVotes >= motion.requiredVotes ? "PASSED" : "PENDING";
  };

  // Render vote results for selected motion
  const renderVoteResults = () => {
    if (!selectedMotion) return null;
    
    const motionVotes = votes[selectedMotion.motionID] || [];
    const status = getMotionStatus(selectedMotion);
    
    return (
      <div className="motion-result-card">
        <h2 className="motion-result-title">Motion Title: {selectedMotion.title}</h2>
        <div className="motion-result-status">
          Status: <span className={status === 'PASSED' ? 'status-passed' : 'status-pending'}>
            {status}
          </span>
        </div>
        
        <div className="motion-result-votes">
          {motionVotes.length > 0 ? (
            motionVotes.map(vote => (
              <div key={vote.userID} className="motion-result-vote-item">
                <div className="vote-person">
                  User {vote.userID}:
                </div>
                <div className={`vote-result ${vote.vote === 'For' ? 'vote-yes' : vote.vote === 'Against' ? 'vote-no' : 'vote-abstain'}`}>
                  {vote.vote}
                </div>
              </div>
            ))
          ) : (
            <div className="no-votes-message">No votes recorded for this motion yet.</div>
          )}
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading motions data...</p>
        <p>Connecting to backend at {API_URL}</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <p>Attempted to connect to: {API_URL}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header with title and time */}
      <div className="header">
        <div className="app-title">UES Motions:</div>
        <div className="header-time">
          {formatCurrentTime()}
          <div className="header-logo">UES</div>
        </div>
      </div>

      {/* Main content with split layout */}
      <div className="split-layout">
        {/* Left panel - Always shows the Date List */}
        <div className="left-panel">
          <h2 className="section-title">Motion Schedule</h2>
          
          {/* List of dates with motions - sorted newest first */}
          <div className="date-list">
            {Object.entries(getGroupedMotions()).length > 0 ? (
              Object.entries(getGroupedMotions()).map(([dateString, dateMotions]) => (
                <div key={dateString} className="date-card">
                  {/* Date header (clickable to expand) */}
                  <div 
                    className="date-header"
                    onClick={() => toggleDateExpansion(dateString)}
                  >
                    <h3 className="date-title">{formatDate(dateString)}</h3>
                    <div>
                      {expandedDates[dateString] ? 
                        <ChevronUp size={20} /> : 
                        <ChevronDown size={20} />
                      }
                    </div>
                  </div>
                  
                  {/* Motion list (expandable) */}
                  {expandedDates[dateString] && (
                    <div className="motion-list">
                      {dateMotions.map(motion => (
                        <div 
                          key={motion.id}
                          className="motion-item"
                          onClick={() => handleMotionSelect(motion)}
                        >
                          <div className="motion-content">
                            <div className="motion-title">{motion.title}</div>
                            <div className="motion-description">{motion.description}</div>
                          </div>
                          <div className={`status-badge ${
                            getMotionStatus(motion) === 'PASSED' ? 'status-passed' : 'status-pending'
                          }`}>
                            {getMotionStatus(motion)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-motions-message">
                No motions available. Please check if your database has motion data.
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Logo/Image that changes when motion is selected */}
        <div className="right-panel">
          {!selectedMotion ? (
            /* Use the imported logo image as the main display */
            <div className="featured-section">
              <div className="featured-image-container">
                <img src={Logo} alt="UES Logo" className="featured-image" />
              </div>
            </div>
          ) : (
            /* When a motion is selected, show voting results instead of the logo */
            <div className="featured-section">
              <div className="featured-image-container motion-result-display">
                {renderVoteResults()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calender;