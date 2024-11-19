import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TaskPage.css';

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: '', tags: '' });
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3001/tasks', { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
      })
      .then(data => setTasks(data.tasks))
      .catch(err => setError('Failed to fetch tasks'));
  };

  const fetchCategories = () => {
    fetch('http://localhost:3001/categories', { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
      })
      .then(data => setCategories(data.categories))
      .catch(err => setError('Failed to fetch categories'));
  };

  const handleDragStart = (e, taskId) => {
    setDraggedTask(taskId);
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const category = e.currentTarget;
    category.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    if (isNaN(taskId)) return;

    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, categoryId } : task
    );

    setTasks(updatedTasks);

    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ categoryId }),
    }).catch(err => {
      setError('Failed to update task');
      fetchTasks();
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    const defaultCategory = categories[0];
    if (!defaultCategory) {
      setError('No category available');
      return;
    }

    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...newTask, categoryId: defaultCategory.id }),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, { ...newTask, id: data.id, categoryId: defaultCategory.id }]);
        setNewTask({ title: '', description: '', status: '', tags: '' });
        setTaskMenuVisible(false);
      })
      .catch(err => setError('Failed to add task'));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('Category name is required');
      return;
    }

    fetch('http://localhost:3001/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newCategory }),
    })
      .then(response => response.json())
      .then(data => {
        setCategories([...categories, { name: newCategory, id: data.id }]);
        setNewCategory('');
        setCategoryMenuVisible(false);
      })
      .catch(err => setError('Failed to add category'));
  };

  return (
    <div className="task-container">
      <header className="header">
        <h1 className="task-title">Your Tasks</h1>
        <div className="header-buttons">
          <button className="action-button" onClick={() => setTaskMenuVisible(true)}>
            Add Task
          </button>
          <button className="action-button" onClick={() => setCategoryMenuVisible(true)}>
            Add Category
          </button>
        </div>
      </header>

      {error && <div className="task-error">{error}</div>}

      <div className="categories">
        {categories.map(category => (
          <div
            key={category.id}
            className="category"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            <h2>{category.name}</h2>
            <div className="task-list">
              {tasks
                .filter(task => task.categoryId === category.id)
                .map(task => (
                  <div
                    key={task.id}
                    className="task-item"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span>{task.status}</span>
                      <span>{task.tags}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {taskMenuVisible && (
        <div className="menu-overlay">
          <div className="menu-box">
            <h2>Create Task</h2>
            <input
              type="text"
              className="task-input"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="text"
              className="task-input"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="text"
              className="task-input"
              placeholder="Status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            />
            <input
              type="text"
              className="task-input"
              placeholder="Tags (comma separated)"
              value={newTask.tags}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
            />
            <button className="task-button" onClick={handleAddTask}>
              Add Task
            </button>
            <button className="task-button" onClick={() => setTaskMenuVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {categoryMenuVisible && (
        <div className="menu-overlay">
          <div className="menu-box">
            <h2>Create Category</h2>
            <input
              type="text"
              className="task-input"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="task-button" onClick={handleAddCategory}>
              Add Category
            </button>
            <button className="task-button" onClick={() => setCategoryMenuVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;