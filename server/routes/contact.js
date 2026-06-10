const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  // In production, integrate nodemailer or a mail service here.
  console.log("📬 New contact message:", { name, email, message });

  // Simulate slight processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  res.json({
    success: true,
    message: "Message received! I'll get back to you within 24 hours.",
  });
});

module.exports = router;
