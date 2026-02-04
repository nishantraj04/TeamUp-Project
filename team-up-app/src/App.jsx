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
  useEffect(() => {
    if (isLoggedIn) {
      fetchTeams();
    }
  }, [isLoggedIn]);

  const fetchTeams = () => {
    axios.get(`https://teamup-project.onrender.com/api/teams?email=${userEmail}`)
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => console.error("Error connecting to server:", error));
  };

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

  const handleCreateTeam = () => {
    if (!newTeamName) return; 
    const newTeamData = {
      name: newTeamName,
      status: "Recruiting",
      members: 1,           
      joined: true,
      owner: userEmail      
    };
    axios.post('https://teamup-project.onrender.com/api/teams', newTeamData)
      .then(response => {
        setTeams([...teams, response.data]); 
        setNewTeamName(""); 
      })
      .catch(error => console.error("Error creating team:", error));
  };

  return (
    <div className="container">
      {/* 🌀 SPIRAL ANIMATION BACKGROUND */}
      <div className="background-spiral"></div>

      <header>
        <div className="logo">TeamUp.</div>
        {isLoggedIn && <div style={{fontSize: '0.9rem', color: '#888'}}>{userEmail}</div>}
      </header>

      {!isLoggedIn ? (
        <div className="hero-section">
          <h1 className="hero-title">Find. Connect. Build.</h1>
          <p className="hero-subtitle">The platform for developers to find their perfect team.</p>
          
          <div className="login-card">
            <input 
              className="login-input"
              type="text" 
              placeholder="Enter your email to start" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)} 
            />
            <button className="primary-btn" onClick={handleLogin}>Continue with Email</button>
          </div>

          {/* RESPONSIVE FEATURE GRID */}
          <div className="features-grid">
            <div className="feature-card">
              <h3>🚀 Find Teammates</h3>
              <p>Connect with builders and innovators.</p>
            </div>
            <div className="feature-card">
              <h3>💡 Showcase Skills</h3>
              <p>Highlight your projects and attract collaborators.</p>
            </div>
            <div className="feature-card">
              <h3>🔥 Join Hackathons</h3>
              <p>Team up for exciting competitions.</p>
            </div>
            <div className="feature-card">
              <h3>🛠️ Build Together</h3>
              <p>Turn ideas into reality with the right team.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <h2>Your Dashboard</h2>
            <button className="primary-btn" style={{width: 'auto', background: '#333', color:'#fff', padding: '8px 16px'}} onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>

          <div className="create-team-box" style={{background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '8px', display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap'}}>
            <input 
              className="login-input"
              style={{marginBottom: 0, flex: 1, minWidth: '200px'}}
              type="text" 
              placeholder="Team Name (e.g. AI Project)" 
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <button className="primary-btn" style={{width: 'auto', minWidth: '100px'}} onClick={handleCreateTeam}>+ Create</button>
          </div>

          <div className="team-list">
            {teams.length === 0 ? <p style={{color: '#666'}}>No teams found. Start by creating one!</p> : null}

            {teams.map((team) => (
              <div key={team._id} className="team-card">
                <h3>{team.name}</h3>
                <span className="status-badge" style={{display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: 'rgba(50, 145, 255, 0.1)', color: 'var(--accent-color)', marginBottom: '10px'}}>{team.status}</span>
                <p style={{color: '#888', marginTop: '10px'}}>Members: {team.members}</p>
                <div style={{marginTop: '20px'}}>
                  {team.joined ? (
                    <button className="primary-btn" disabled style={{opacity: 0.5, cursor: 'default'}}>Joined</button>
                  ) : (
                    <button className="primary-btn" onClick={() => handleJoin(team._id)}>Join Team</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App