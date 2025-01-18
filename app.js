const express = require("express");
const app = express();
const cors = require("cors");
const fileRoutes = require("./route/fileRoute");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

module.exports = app;
