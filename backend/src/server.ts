import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Fordonskontroll API running");
});

app.get("/vehicles", (req, res) => {
  res.json([{ id: 1, name: "Släckbil 3010" }]);
});

app.post("/inspections/start", (req, res) => {
  res.json({ message: "Inspection started" });
});

app.post("/inspections/complete", (req, res) => {
  res.json({ message: "Inspection completed" });
});

app.post("/deviations", (req, res) => {
  res.json({ message: "Deviation created" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
