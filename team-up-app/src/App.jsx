import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [teams, setTeams] = useState([]);

  // --- EFFECT ---
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    axios.get('http://localhost:5000/api/teams')
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.error("Error connecting to server:", error);
      });
  };

  // --- LOGIC ---
  const handleLogin = () => {
    if (!emailInput) { alert("Please enter an email!"); return; }
    setUserEmail(emailInput);
    setIsLoggedIn(true);
  };

  const handleJoin = (teamId) => {
    const updatedTeams = teams.map(team => {
      // FIX: Use _id because MongoDB uses underscores!
      if (team._id === teamId) {
        return { ...team, members: team.members + 1, joined: true };
      }
      return team;
    });
    setTeams(updatedTeams);
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
          <p>Available Teams:</p>
          
          <div className="team-list">
            {teams.length === 0 ? <p>Loading teams...</p> : null}

            {teams.map((team) => (
              /* FIX: Use _id for the key here too */
              <div key={team._id} className="team-item">
                <h3>{team.name}</h3>
                <p>Status: <span style={{color: 'green'}}>{team.status}</span></p>
                <p>Members: {team.members}</p>
                
                {team.joined ? (
                  <button disabled style={{backgroundColor: 'grey'}}>Joined ✅</button>
                ) : (
                  /* FIX: Pass _id to the function */
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