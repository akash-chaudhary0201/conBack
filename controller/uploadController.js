const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.uploadPDF = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error reading file." });
    }

    pdfParse(data)
      .then((pdfData) => {
        const text = pdfData.text;

        res.send({
          message: "File uploaded and text extracted successfully.",
          file: req.file,
          extractedText: text,
        });
      })
      .catch((error) => {
        res.status(500).send({ message: "Error extracting text from PDF." });
      });
  });
};
