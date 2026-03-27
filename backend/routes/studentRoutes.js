const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]);
const studentController = require("../controllers/studentController");

router.get("/", studentController.getStudents);
router.post("/", uploadFields, studentController.createStudent);
router.put("/:id", uploadFields, studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
module.exports = router;