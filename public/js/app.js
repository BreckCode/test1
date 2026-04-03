(function () {
  let todos = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let editingId = null;

  // DOM elements
  const todoForm = document.getElementById('todo-form');
  const todoTitle = document.getElementById('todo-title');
  const todoDescription = document.getElementById('todo-description');
  const todoPriority = document.getElementById('todo-priority');
  const todoDueDate = document.getElementById('todo-due-date');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const todoList = document.getElementById('todo-list');
  const todoFooter = document.getElementById('todo-footer');

  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const editId = document.getElementById('edit-id');
  const editTitle = document.getElementById('edit-title');
  const editDescription = document.getElementById('edit-description');
  const editPriority = document.getElementById('edit-priority');
  const editDueDate = document.getElementById('edit-due-date');
  const editCancel = document.getElementById('edit-cancel');
  const modalOverlay = editModal.querySelector('.modal-overlay');

  // API
  async function fetchTodos() {
    const params = new URLSearchParams();
    if (currentFilter !== 'all') params.set('status', currentFilter);
    if (searchQuery) params.set('search', searchQuery);

    const res = await fetch(`/api/todos?${params}`);
    const data = await res.json();
    todos = data.todos;
    renderTodos();
  }

  async function createTodo(todoData) {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    await fetchTodos();
  }

  async function updateTodo(id, todoData) {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    await fetchTodos();
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    await fetchTodos();
  }

  async function toggleTodo(id, completed) {
    await updateTodo(id, { completed });
  }

  // Render
  function renderTodos() {
    if (todos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
          <p>No todos found</p>
          <small>${currentFilter !== 'all' || searchQuery ? 'Try changing your filters' : 'Add one above to get started'}</small>
        </div>`;
    } else {
      todoList.innerHTML = todos.map(todo => {
        const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString());
        return `
          <div class="todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
            <div class="todo-content">
              <div class="todo-title">${escapeHtml(todo.title)}</div>
              ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
              <div class="todo-meta">
                <span class="priority-badge ${todo.priority}">${todo.priority}</span>
                ${todo.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">${isOverdue ? 'Overdue: ' : 'Due: '}${formatDate(todo.dueDate)}</span>` : ''}
              </div>
            </div>
            <div class="todo-actions">
              <button class="btn-edit" data-id="${todo.id}">Edit</button>
              <button class="btn-delete" data-id="${todo.id}">Delete</button>
            </div>
          </div>`;
      }).join('');
    }

    const activeCount = todos.filter(t => !t.completed).length;
    const totalCount = todos.length;
    todoFooter.textContent = totalCount > 0
      ? `${activeCount} item${activeCount !== 1 ? 's' : ''} remaining out of ${totalCount}`
      : '';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Edit modal
  function openEditModal(todo) {
    editingId = todo.id;
    editId.value = todo.id;
    editTitle.value = todo.title;
    editDescription.value = todo.description || '';
    editPriority.value = todo.priority;
    editDueDate.value = todo.dueDate || '';
    editModal.classList.remove('hidden');
  }

  function closeEditModal() {
    editingId = null;
    editModal.classList.add('hidden');
  }

  // Debounce
  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // Event listeners
  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      title: todoTitle.value,
      description: todoDescription.value,
      priority: todoPriority.value,
      dueDate: todoDueDate.value || null
    };
    formSubmitBtn.disabled = true;
    await createTodo(data);
    todoForm.reset();
    todoPriority.value = 'medium';
    formSubmitBtn.disabled = false;
    todoTitle.focus();
  });

  searchInput.addEventListener('input', debounce(() => {
    searchQuery = searchInput.value.trim();
    fetchTodos();
  }, 300));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      fetchTodos();
    });
  });

  todoList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('btn-delete')) {
      if (confirm('Delete this todo?')) {
        deleteTodo(id);
      }
    } else if (e.target.classList.contains('btn-edit')) {
      const todo = todos.find(t => t.id === id);
      if (todo) openEditModal(todo);
    }
  });

  todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
      toggleTodo(e.target.dataset.id, e.target.checked);
    }
  });

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!editingId) return;
    await updateTodo(editingId, {
      title: editTitle.value,
      description: editDescription.value,
      priority: editPriority.value,
      dueDate: editDueDate.value || null
    });
    closeEditModal();
  });

  editCancel.addEventListener('click', closeEditModal);
  modalOverlay.addEventListener('click', closeEditModal);

  // Init
  fetchTodos();
})();
