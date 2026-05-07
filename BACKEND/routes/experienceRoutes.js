const express    = require("express");
const router     = express.Router();
const Experience = require("../models/Experience");

router.get("/", async (req, res) => {
  try { res.json(await Experience.find().lean()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const item = new Experience(req.body);
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bulk replace
router.put("/", async (req, res) => {
  try {
    const items = req.body.map(({ _id, __v, ...rest }) => rest);
    await Experience.deleteMany({});
    const saved = await Experience.insertMany(items);
    res.json(saved);
  } catch (err) {
    console.error("Experience PUT error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;