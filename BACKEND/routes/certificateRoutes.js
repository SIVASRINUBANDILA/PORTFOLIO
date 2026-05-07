const express = require("express");
const router  = express.Router();
const Certificate = require("../models/Certificate");

// GET all (with PDF to show View Certificate button)
router.get("/", async (req, res) => {
  try {
    const data = await Certificate.find().lean();
    res.json(data);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// GET single certificate PDF only (lightweight - just the URL) — must come BEFORE /:id
router.get("/:id/pdf", async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id).select("pdfUrl").lean();
    res.json(cert || {});
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// GET single certificate with PDF
router.get("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id).lean();
    res.json(cert);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// POST single
router.post("/", async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.json(cert);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT / — bulk replace (used by admin dashboard)
router.put("/", async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    
    if (items.length === 0) {
      await Certificate.deleteMany({});
      res.json([]);
      return;
    }
    
    // Use replaceOne with upsert to preserve all fields including custom _id
    const bulkOps = items.map(item => ({
      replaceOne: {
        filter: item._id ? { _id: item._id } : { title: item.title, category: item.category },
        replacement: item,
        upsert: true
      }
    }));
    
    await Certificate.bulkWrite(bulkOps);
    
    // Get list of IDs that should exist
    const incomingIds = items.filter(i => i._id).map(i => i._id);
    
    // Delete items not in the new list
    if (incomingIds.length > 0) {
      await Certificate.deleteMany({ _id: { $nin: incomingIds } });
    }
    
    // Return all certificates
    const result = await Certificate.find().lean();
    res.json(result);
  } catch(err) { 
    console.error("Certificate PUT error:", err);
    res.status(500).json({ error: err.message }); 
  }
});

// PUT /:id — update single
router.put("/:id", async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(
      req.params.id, req.body, { returnDocument: 'after' }
    );
    res.json(updated);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;