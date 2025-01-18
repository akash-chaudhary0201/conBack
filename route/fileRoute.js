const express = require("express");
const router = express.Router();
const { uploadPDF } = require("../controller/uploadController");
const { upload } = require("../middleware/fileUpload");

router.post("/upload", upload.single("pdf"), uploadPDF);

module.exports = router;
