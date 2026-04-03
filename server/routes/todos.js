const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'todos.json');

function readTodos() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2));
}

// GET /api/todos
router.get('/', (req, res) => {
  let todos = readTodos();
  const { status, search, priority } = req.query;

  if (status === 'active') {
    todos = todos.filter(t => !t.completed);
  } else if (status === 'completed') {
    todos = todos.filter(t => t.completed);
  }

  if (search) {
    const term = search.toLowerCase();
    todos = todos.filter(t =>
      t.title.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term))
    );
  }

  if (priority) {
    todos = todos.filter(t => t.priority === priority);
  }

  todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ todos });
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : '',
    priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const todos = readTodos();
  todos.push(todo);
  writeTodos(todos);

  res.status(201).json({ todo });
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, description, priority, dueDate, completed } = req.body;
  const todo = todos[index];

  if (title !== undefined) todo.title = title.trim();
  if (description !== undefined) todo.description = description.trim();
  if (priority !== undefined && ['low', 'medium', 'high'].includes(priority)) {
    todo.priority = priority;
  }
  if (dueDate !== undefined) todo.dueDate = dueDate || null;
  if (completed !== undefined) todo.completed = Boolean(completed);

  todo.updatedAt = new Date().toISOString();
  todos[index] = todo;
  writeTodos(todos);

  res.json({ todo });
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  writeTodos(todos);

  res.json({ message: 'Todo deleted' });
});

module.exports = router;
