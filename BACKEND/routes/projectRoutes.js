const express = require("express");
const router  = express.Router();
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  try { res.json(await Project.find().lean()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const item = new Project(req.body);
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bulk replace
router.put("/", async (req, res) => {
  try {
    const items = req.body.map(({ _id, __v, ...rest }) => rest);
    await Project.deleteMany({});
    const saved = await Project.insertMany(items);
    res.json(saved);
  } catch (err) {
    console.error("Project PUT error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;