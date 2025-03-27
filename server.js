require("dotenv").config();
console.log("Email:", process.env.EMAIL_USER);
console.log("Password:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000; // Allow Render to assign a dynamic port

// ✅ Enable CORS
app.use(cors({ origin: "*" })); // Allows all origins (or specify frontend URL)
app.use(bodyParser.json());

console.log("Email:", process.env.EMAIL_USER);
console.log("Password:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Form Endpoint
app.post("/send-message", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "workwithgredmanstudio@gmail.com", // Your email
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// ✅ Start Server on Dynamic Port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
