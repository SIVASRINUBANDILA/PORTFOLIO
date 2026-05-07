const express = require("express");
const router  = express.Router();
const Message = require("../models/Message");

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new message (from contact form)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const now  = new Date();
    const time = now.toLocaleDateString("en-GB") + ", " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const msg = new Message({ name, email, subject, message, time, read: false });
    await msg.save();
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── IMPORTANT: /read-all must come BEFORE /:id ────────────────────────────────

// PUT mark ALL messages as read
router.put("/read-all", async (req, res) => {
  try {
    await Message.updateMany({}, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark ONE message as read
router.put("/:id/read", async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all messages — must come BEFORE /:id too
router.delete("/all", async (req, res) => {
  try {
    await Message.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE one message
router.delete("/:id", async (req, res) => {
  try {
    const result = await Message.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;