const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔹 Connect to MongoDB
const dbHost = process.env.DB_HOST || "localhost";
mongoose.connect(`mongodb://${dbHost}:27017/tasksdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔹 Schema
const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String,
});

const Task = mongoose.model("Task", taskSchema);

// 🔹 Seed data (لو الداتا فاضية)
const seedData = async () => {
  const count = await Task.countDocuments();
  if (count === 0) {
    await Task.insertMany([
      { id: 1, name: "Study", status: "pending" },
      { id: 2, name: "Workout", status: "done" },
      { id: 3, name: "Shopping", status: "pending" },
    ]);
    console.log("Seed data inserted");
  }
};

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  seedData();
});

// 🔹 Routes
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});