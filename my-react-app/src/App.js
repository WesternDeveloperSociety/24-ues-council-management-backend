import React, { useState } from "react";
import MotionResults from "./components/MotionResults";
import SpeakerStartVote from "./components/SpeakerStartVote";
import VotingPage from "./components/VotingPage";
import VotingResults from "./components/VotingResults";

const App = () => {
  // The activePage state controls which component is rendered.
  const [activePage, setActivePage] = useState("MotionResults");

  // Render a demo instance of the selected page with dummy props.
  const renderPage = () => {
    switch (activePage) {
      case "MotionResults":
        return (
          <MotionResults
            motionName="Raise the debt ceiling to $33.5 trillion, active until December 1st, 2025"
            userVote="For"
            forVotes={228}
            againstVotes={203}
            abstainVotes={3}
            threshold={0.5}
            onClose={() => console.log("MotionResults closed")}
          />
        );
      case "SpeakerStartVote":
        return (
          <SpeakerStartVote
            onStart={(data) => console.log("Vote started with:", data)}
            onClose={() => console.log("SpeakerStartVote closed")}
          />
        );
      case "VotingPage":
        return (
          <VotingPage
            voteType="Motion"
            motionName="Raise the debt ceiling to $33.5 trillion, active until December 1st, 2025"
            motionID={1}
            userID={1}
            voteCounts={{ for: 228, against: 203, abstain: 3 }}
            onVoteSubmit={(vote) => console.log("Vote submitted:", vote)}
          />
        );
      case "VotingResults":
        return (
          <VotingResults
            voteType="Motion"
            motionName="Raise the debt ceiling to $33.5 trillion, active until December 1st, 2025"
            status="passed"
            votes={[
  { name: "Alice", role: "Member", vote: "For" },
  { name: "Bob", role: "Member", vote: "For" },
  { name: "Charlie", role: "First Year Rep", vote: "For" },
  { name: "Diana", role: "Second Year Rep", vote: "Abstain" },
  { name: "Eve", role: "Speaker", vote: "For" },
  { name: "Frank", role: "Treasurer", vote: "Against" },
  { name: "Grace", role: "Secretary", vote: "For" },
  { name: "Hank", role: "Member", vote: "Against" },
  { name: "Ivy", role: "First Year Rep", vote: "For" },
  { name: "Jack", role: "Second Year Rep", vote: "Abstain" },
  { name: "Karen", role: "Speaker", vote: "For" },
  { name: "Leo", role: "Treasurer", vote: "For" },
  { name: "Mona", role: "Secretary", vote: "For" },
  { name: "Nina", role: "Member", vote: "For" },
  { name: "Oscar", role: "Member", vote: "Against" },
  { name: "Karen", role: "Speaker", vote: "For" },
  { name: "Leo", role: "Treasurer", vote: "For" },
  { name: "Mona", role: "Secretary", vote: "For" },
  { name: "Nina", role: "Member", vote: "For" },
  { name: "Oscar", role: "Member", vote: "Against" },
]}
          />
        );
      default:
        return <div>Select a page from the menu.</div>;
    }
  };

  return (
    <div>
      <nav
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <button onClick={() => setActivePage("MotionResults")}>
          Motion Results
        </button>{" "}
        |{" "}
        <button onClick={() => setActivePage("SpeakerStartVote")}>
          Start Vote
        </button>{" "}
        |{" "}
        <button onClick={() => setActivePage("VotingPage")}>
          Voting Page
        </button>{" "}
        |{" "}
        <button onClick={() => setActivePage("VotingResults")}>
          Voting Results
        </button>
      </nav>
      <div style={{ padding: "20px" }}>{renderPage()}</div>
    </div>
  );
};

export default App;
