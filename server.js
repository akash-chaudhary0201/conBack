const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const Tesseract = require("tesseract.js");

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: "https://con-front.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

// Use memory storage for multer
const storage = multer.memoryStorage();

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  const fileBuffer = req.file.buffer;

  try {
    if (req.file.mimetype === "application/pdf") {
      // Handle PDF file
      const pdfData = await pdfParse(fileBuffer);
      res.send({
        message: "PDF uploaded and text extracted successfully",
        file: req.file,
        extractedText: pdfData.text,
      });
    } else if (req.file.mimetype.startsWith("image")) {
      // Handle image file
      const fileBase64 = `data:${
        req.file.mimetype
      };base64,${fileBuffer.toString("base64")}`;
      Tesseract.recognize(fileBase64, "eng", {
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
          console.error("Error processing image with Tesseract:", error);
          res.status(500).send({ message: "Error extracting text from image" });
        });
    } else {
      res.status(400).send({ message: "Unsupported file type" });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
