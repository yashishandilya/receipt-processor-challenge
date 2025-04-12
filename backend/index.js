const express = require("express");
const app = express();

const receiptData = {}
const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
  return uuidv4();
}

function calcPoints() {
  console.log("calcPoints function was called!");
  return 5;
}

// tester functions to ensure smooth basic setup of express + docker container
app.get("/", (req, res) => {
  res.send("Hello from Docker, Is working ?");
});

app.listen(8080, () => {
  console.log("Server is running on Port 8080.");
});

app.post("/receipts/process", (req, res) => {
  const receipt = req.body;

  const receiptID = generateUniqueId();

  const points = calcPoints();

  receiptData[receiptID] = {
    receipt,
    points
  };

  res.json({receiptID});
});

app.get("/receipts/:id/points", (req, res) => {
  const receiptID = req.params.id;

  if (!receiptData[receiptID]) {
    return res.status(404).json({ error: "Receipt not found" });
  }

  const receiptPoints = receiptData[receiptID].points;
  res.json({"points": receiptPoints})
});