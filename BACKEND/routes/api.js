const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Route to handle Contact Form Submissions
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();
        res.status(200).json({ message: "✅ Message saved to MongoDB!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "❌ Failed to save message" });
    }
});

module.exports = router;