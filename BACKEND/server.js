// ── IMPORT PACKAGES ─────────────────────────────
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ── APP SETUP ───────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(__dirname)); // ← Serve static files from project root

// ── CONNECT TO MONGODB ──────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.log("❌ MongoDB connection error:", err.message)
  );

// ── ROUTES ──────────────────────────────────────
app.use("/api/messages", require("./routes/messages"));
app.use("/api/education", require("./routes/educationRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// ── IMPORT MODELS ───────────────────────────────
const Project = require("./models/Project");
const Education = require("./models/education");
const Experience = require("./models/Experience");
const Certificate = require("./models/Certificate");
const Profile = require("./models/Profile");

// ── PORTFOLIO API (Load all data) ───────────────
app.get("/api/portfolio", async (req, res) => {
  try {
    const [projects, education, experience, certificates, profile] =
      await Promise.all([
        Project.find().lean(),
        Education.find().lean(),
        Experience.find().lean(),
        Certificate.find().lean(),
        Profile.findOne().lean(),
      ]);

    res.json({
      projects: projects || [],
      education: education || [],
      experience: experience || [],
      certificates: certificates || [],
      profile: profile || {},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── HOMEPAGE API (Load only what's needed) ──────
app.get("/api/portfolio/home", async (req, res) => {
  try {
    const [projects, education, profile] = await Promise.all([
      Project.find().limit(3).lean(),
      Education.find().limit(3).lean(),
      Profile.findOne().lean(),
    ]);

    res.json({
      projects: projects || [],
      education: education || [],
      profile: profile || {},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ROOT ROUTE ──────────────────────────────────
app.get("/", (req, res) => {
  res.send("✅ Backend Running");
});

// ── SERVER START ────────────────────────────────
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});