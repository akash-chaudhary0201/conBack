const express = require("express");
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, and PNG files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  const filePath = path.join(__dirname, "uploads", req.file.filename);

  if (req.file.mimetype === "application/pdf") {
    // Handle PDF file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).send({ message: "Error reading file" });
      }

      pdfParse(data)
        .then((pdfData) => {
          const text = pdfData.text;
          res.send({
            message: "PDF uploaded and text extracted successfully",
            file: req.file,
            extractedText: text,
          });
        })
        .catch((error) => {
          res.status(500).send({ message: "Error extracting text from PDF" });
        });
    });
  } else if (req.file.mimetype.startsWith("image")) {
    // Handle image file
    Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        res.send({
          message: "Image uploaded and text extracted successfully",
          file: req.file,
          extractedText: text,
        });
      })
      .catch((error) => {
        res.status(500).send({ message: "Error extracting text from image" });
      });
  } else {
    res.status(400).send({ message: "Unsupported file type" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
