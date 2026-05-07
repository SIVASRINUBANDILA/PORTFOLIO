const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// POST message
router.post("/", async (req, res) => {
    try {

        const { name, email, subject, message } = req.body;

        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        res.status(200).json({ success: true });

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Server error" });

    }
});

// GET messages
router.get("/", async (req, res) => {

    try {

        const messages = await Message.find().sort({ _id: -1 }).lean();

        res.json(messages);

    } catch (err) {

        res.status(500).json(err);

    }

});

module.exports = router;