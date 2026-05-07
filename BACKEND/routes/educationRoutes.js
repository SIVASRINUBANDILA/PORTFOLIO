const express   = require("express");
const router    = express.Router();
const Education = require("../models/education");

// GET all
router.get("/", async (req, res) => {
  try {
    const data = await Education.find().sort({ _id: 1 }).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST single
router.post("/", async (req, res) => {
  try {
    const edu = new Education(req.body);
    await edu.save();
    res.json(edu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT bulk replace
router.put("/", async (req, res) => {
  try {
    const items = req.body.map(({ _id, __v, ...rest }) => rest);
    await Education.deleteMany({});
    const saved = await Education.insertMany(items);
    res.json(saved);
  } catch (err) {
    console.error("Education PUT error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT single by id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Education.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE single by id
router.delete("/:id", async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;