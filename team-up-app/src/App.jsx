import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { FiGrid, FiUsers, FiBriefcase, FiLogOut } from 'react-icons/fi'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  
  // --- MODAL STATE ---
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    gender: "Select gender"
  });

  const [teams, setTeams] = useState([]);

  // --- EFFECT ---
  useEffect(() => {
    if (isLoggedIn) {
      setShowProfileModal(true); 
      fetchTeams();
    }
  }, [isLoggedIn]);

  const fetchTeams = () => {
    axios.get(`https://teamup-project.onrender.com/api/teams?email=${userEmail}`)
      .then(response => setTeams(response.data))
      .catch(error => console.error("Error:", error));
  };

  const handleLogin = () => {
    if (!emailInput) { alert("Please enter an email!"); return; }
    setUserEmail(emailInput);
    setIsLoggedIn(true);
  };

  // --- HELPER: RENDER SIDEBAR ---
  const renderSidebar = () => (
    <div className="sidebar">
      <div>
        <div className="nav-label" style={{fontSize: '1.2rem', color:'#fff', marginBottom:'30px'}}>
           <span style={{color: 'var(--accent-color)'}}>⚡</span> TEAM UP
        </div>
        
        <div className="nav-section">
          <div className="nav-label">Main</div>
          <div className="nav-item active"><FiGrid /> Dashboard</div>
          <div className="nav-item"><FiUsers /> Network</div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Gigs</div>
          <div className="nav-item"><FiBriefcase /> Browse Gigs</div>
          <div className="nav-item"><FiBriefcase /> My Gigs</div>
        </div>
      </div>

      <div className="user-profile-mini">
        <div className="avatar-circle">{userEmail.charAt(0).toUpperCase()}</div>
        <div style={{fontSize: '0.85rem'}}>
          <div style={{color: '#fff', fontWeight: '600'}}>User</div>
          <div style={{color: '#666'}}>{userEmail}</div>
        </div>
        <FiLogOut style={{marginLeft: 'auto', cursor: 'pointer'}} onClick={() => setIsLoggedIn(false)} />
      </div>
    </div>
  );

  // --- HELPER: RENDER MODAL ---
  const renderProfileModal = () => (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* HEADER */}
        <div className="modal-header">
          <h2>Complete Your Profile</h2>
          
          <div className="stepper">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div>Profile</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div>Education</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div>Skills</div>
            </div>
          </div>
          <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
             <div className="step-line" style={{background: currentStep >= 1 ? 'var(--accent-color)' : '#333'}}></div>
             <div className="step-line" style={{background: currentStep >= 2 ? 'var(--accent-color)' : '#333'}}></div>
             <div className="step-line" style={{background: currentStep >= 3 ? 'var(--accent-color)' : '#333'}}></div>
          </div>
        </div>

        {/* BODY */}
        <div style={{padding: '30px'}}>
          {currentStep === 1 && (
            <>
              <div className="form-group">
                <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#ccc'}}>Username</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="Username"
                  value={profileData.username} 
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#ccc'}}>Bio</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Bio (minimum 10 characters)"
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#ccc'}}>Gender</label>
                <select className="form-select">
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </>
          )}

          {currentStep === 2 && <p style={{color:'#888'}}>Education details form goes here...</p>}
          {currentStep === 3 && <p style={{color:'#888'}}>Skills & Links form goes here...</p>}
        </div>

        {/* FOOTER */}
        <div style={{padding: '20px 30px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'flex-end'}}>
          <button className="next-btn" onClick={() => {
            if (currentStep < 3) setCurrentStep(currentStep + 1);
            else setShowProfileModal(false); // Close on finish
          }}>
            {currentStep === 3 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <>
      {!isLoggedIn ? (
        // 🌀 LANDING PAGE (RESTORED)
        <div className="landing-container">
          <div className="background-spiral"></div>
          
          <header className="landing-header">
            <div className="landing-logo">TeamUp.</div>
          </header>

          <div className="hero-section">
            <h1 className="hero-title">Find. Connect. Build.</h1>
            <p className="hero-subtitle">The platform for developers to find their perfect team.</p>
            
            <div className="login-card-landing">
              <input 
                className="login-input"
                type="text" 
                placeholder="Enter your email to start" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)} 
              />
              <button className="primary-btn" onClick={handleLogin}>Continue with Email</button>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <h3>🚀 Find Teammates</h3>
                <p style={{color:'#888', fontSize:'0.9rem'}}>Connect with builders and innovators.</p>
              </div>
              <div className="feature-card">
                <h3>💡 Showcase Skills</h3>
                <p style={{color:'#888', fontSize:'0.9rem'}}>Highlight your projects and attract collaborators.</p>
              </div>
              <div className="feature-card">
                <h3>🔥 Join Hackathons</h3>
                <p style={{color:'#888', fontSize:'0.9rem'}}>Team up for exciting competitions.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 📊 DASHBOARD (NEW DESIGN)
        <div className="dashboard-container">
          {renderSidebar()}
          
          <div className="main-content">
            <header style={{marginBottom: '40px'}}>
              <h1 style={{margin: 0}}>Good evening, 👋</h1>
              <p style={{color: '#666', marginTop: '5px'}}>Ready to create something amazing today?</p>
            </header>

            <div style={{display: 'flex', gap: '20px'}}>
              <div style={{background: '#111', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #222'}}>
                  <h3 style={{margin: 0, fontSize: '2rem'}}>0</h3>
                  <p style={{margin: 0, color: '#666'}}>Active Gigs</p>
              </div>
              <div style={{background: '#111', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #222'}}>
                  <h3 style={{margin: 0, fontSize: '2rem'}}>0%</h3>
                  <p style={{margin: 0, color: '#666'}}>Profile Match</p>
              </div>
            </div>
          </div>

          {showProfileModal && renderProfileModal()}
        </div>
      )}
    </>
  )
}

export default App