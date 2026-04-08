db = db.getSiblingDB('tasksdb');

db.tasks.insertMany([
  { id: 1, name: "Study", status: "pending" },
  { id: 2, name: "Workout", status: "done" },
  { id: 3, name: "Shopping", status: "pending" },
  { id: 7, name: 'Tea', status: 'pending' }
]);