const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Intentionally simple in-memory data store.
// This is not suitable for production.
let tasks = [
  { id: 1, title: "上司にCopilot Chatのデモを見せる", done: false },
  { id: 2, title: "リファクタリング前後を比較する", done: false }
];

let nextId = 3;

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  // Intentionally weak validation.
  const task = {
    id: nextId++,
    title: req.body.title,
    done: false
  };

  tasks.push(task);
  res.json(task);
});

app.patch("/api/tasks/:id/toggle", (req, res) => {
  const id = Number(req.params.id);

  // Intentionally no proper 404 handling structure.
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    res.status(404).send("task not found");
    return;
  }

  task.done = !task.done;
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  // Intentionally loose implementation.
  tasks = tasks.filter((t) => t.id !== id);

  res.json({ ok: true });
});

app.get("/api/search", (req, res) => {
  const keyword = req.query.q || "";

  // Intentionally simple and case-sensitive search.
  const result = tasks.filter((t) => t.title.includes(keyword));

  res.json(result);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Demo app listening at http://0.0.0.0:${port}`);
  console.log(`External access: http://182.169.51.138:${port}`);
});
