const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
// (Your password is safe here now)
const MONGO_URI = "mongodb+srv://nishantraj04:Rudransh0108@cluster0.1h3nhdc.mongodb.net/?appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully! 🍃");
        seedDatabase(); // Check if we need to add starter data
    })
    .catch(err => console.error("MongoDB Connection Failed:", err));

// --- 2. DATA MODEL ---
const TeamSchema = new mongoose.Schema({
    name: String,
    status: String,
    members: Number,
    joined: Boolean
});
const TeamModel = mongoose.model("Team", TeamSchema);

// --- 3. SEED FUNCTION (The Auto-Filler) ---
const seedDatabase = async () => {
    try {
        const count = await TeamModel.countDocuments();
        if (count === 0) {
            const initialTeams = [
                { name: "Hackathon Warriors", status: "Active", members: 3, joined: false },
                { name: "Startup Idea: AI Chef", status: "Looking for Devs", members: 1, joined: false },
                { name: "React Study Group", status: "Closed", members: 5, joined: false }
            ];
            await TeamModel.insertMany(initialTeams);
            console.log("🌱 Database was empty, so I added starter teams!");
        } else {
            console.log("Database already has data. No changes made.");
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
};

// --- 4. API ROUTES ---

// GET all teams
app.get('/api/teams', async (req, res) => {
    const teams = await TeamModel.find();
    res.json(teams);
});

// CREATE A TEAM (Add this part!)
app.post('/api/teams', async (req, res) => {
    try {
        const newTeam = new TeamModel(req.body);
        await newTeam.save(); // Save to MongoDB
        res.json(newTeam);    // Send back the saved team
    } catch (err) {
        res.status(500).json({ error: "Failed to save team" });
    }
});
// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});