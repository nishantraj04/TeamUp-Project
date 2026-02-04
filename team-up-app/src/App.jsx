import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState(""); 

  // --- EFFECT ---
  // Only fetch teams AFTER the user has logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchTeams();
    }
  }, [isLoggedIn]); // This runs whenever 'isLoggedIn' changes

  const fetchTeams = () => {
    // 🆕 CHANGE 1: We send the email to the backend so it knows who is asking
    axios.get(`https://teamup-project.onrender.com/api/teams?email=${userEmail}`)
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => console.error("Error connecting to server:", error));
  };

  // --- LOGIC ---
  const handleLogin = () => {
    if (!emailInput) { alert("Please enter an email!"); return; }
    setUserEmail(emailInput);
    setIsLoggedIn(true);
  };

  const handleJoin = (teamId) => {
    const updatedTeams = teams.map(team => {
      if (team._id === teamId) {
        return { ...team, members: team.members + 1, joined: true };
      }
      return team;
    });
    setTeams(updatedTeams);
  };

  // 🆕 FUNCTION: Create a Team
  const handleCreateTeam = () => {
    if (!newTeamName) return; 

    const newTeamData = {
      name: newTeamName,
      status: "Recruiting",
      members: 1,           
      joined: true,
      owner: userEmail      // 🆕 CHANGE 2: We stamp the team with your email
    };

    // Send to Backend
    axios.post('https://teamup-project.onrender.com/api/teams', newTeamData)
      .then(response => {
        setTeams([...teams, response.data]); 
        setNewTeamName(""); 
      })
      .catch(error => console.error("Error creating team:", error));
  };

  return (
    <div className="container">
      <h1>Team Up</h1>

      {!isLoggedIn ? (
        <div className="card">
          <h2>Login</h2>
          <input 
            type="text" 
            placeholder="Enter your email" 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)} 
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="card">
          <h2>Welcome, {userEmail}!</h2>
          <p style={{fontSize: "0.9rem", color: "#666"}}>You are viewing your private dashboard.</p>
          
          {/* CREATE TEAM SECTION */}
          <div style={{marginBottom: '20px', padding: '15px', border: '1px dashed #666', borderRadius: '8px'}}>
            <h3>Create a New Team</h3>
            <input 
              type="text" 
              placeholder="Team Name (e.g. Python Project)" 
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <button onClick={handleCreateTeam} style={{backgroundColor: '#28a745'}}>+ Create</button>
          </div>

          <p>Your Teams:</p>
          <div className="team-list">
            {teams.length === 0 ? <p>No teams found. Create one!</p> : null}

            {teams.map((team) => (
              <div key={team._id} className="team-item">
                <h3>{team.name}</h3>
                <p>Status: <span style={{color: 'green'}}>{team.status}</span></p>
                <p>Members: {team.members}</p>
                
                {team.joined ? (
                  <button disabled style={{backgroundColor: 'grey'}}>Joined ✅</button>
                ) : (
                  <button onClick={() => handleJoin(team._id)}>Join Team</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App