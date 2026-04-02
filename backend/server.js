require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const studentRoutes = require("./routes/studentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const examRoutes = require("./routes/examRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Security - Base Helmet
app.use(helmet({
  crossOriginResourcePolicy: false, // Required for displaying local/cloud images
}));

// Middleware
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? allowedOrigin : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/syllabuses", express.static(path.join(__dirname, "uploads/syllabuses")));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/academic", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});