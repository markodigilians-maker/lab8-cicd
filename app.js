const express = require('express');
const os = require('os');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// إعداد الاتصال بقاعدة البيانات باستخدام متغيرات البيئة
// سيتم تمرير هذه المتغيرات عبر docker-compose
const dbHost = process.env.DB_HOST || 'mongo'; // اسم خدمة MongoDB في Docker
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'tasksdb';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// بناء رابط الاتصال (Connection String)
let mongoUri = `mongodb://${dbHost}:${dbPort}`;
if (dbUser && dbPassword) {
  // في حال وجود اسم مستخدم وكلمة مرور
  mongoUri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/?authSource=admin`;
}

const client = new MongoClient(mongoUri);
let db;

// دالة للاتصال بقاعدة البيانات عند بدء التشغيل
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('✅ Connected successfully to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}
connectToDatabase();

// Route 1: basic info
app.get('/', (req, res) => {
  res.json({
    app:  'CISC 886 Lab 6',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

// Route 2: tasks grouped by status (جلب البيانات من MongoDB)
app.get('/tasks', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database connection not established yet' });
    }

    // جلب جميع المهام من مجموعة (collection) tasks
    const tasksCollection = db.collection('tasks');
    const tasks = await tasksCollection.find({}).toArray();
    
    // تجميع المهام بناءً على الحالة
    const grouped = Object.groupBy(tasks, task => task.status);
    res.json(grouped);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`  CISC 886 Lab 6 — App started`);
  console.log(`  Port:  ${PORT}`);
  console.log(`  Mode:  ${process.env.MODE || 'local'}`);
  console.log(`  Node:  ${process.version}`);
  console.log(`  Host:    ${os.hostname()}`);
  console.log('--------------------------------------------------');
});