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

// 🔹 تأكيد الاتصال فقط (بدون seed)
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// 🔹 Routes
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});