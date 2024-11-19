import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';
import './TaskPage.css';
import taskIcon from './icons/task-icon.svg';
import categoryIcon from './icons/category-icon.svg';
import optionsIcon from './icons/options-icon.svg';
function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: '', tags: '' });
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('default');
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    console.log('Fetching tasks');
    fetch('http://localhost:3001/tasks', {
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 401) {
          console.error('Not authenticated, redirecting to login');
          history.push('/login');
        } else if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        } else {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          console.log('Tasks fetched:', data.tasks);
          setTasks(data.tasks);
        }
      })
      .catch(err => {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to fetch tasks');
      });

    console.log('Fetching categories');
    fetch('http://localhost:3001/categories', {
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 401) {
          console.error('Not authenticated, redirecting to login');
          history.push('/login');
        } else if (!response.ok) {
          throw new Error('Failed to fetch categories');
        } else {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          console.log('Categories fetched:', data.categories);
          setCategories(data.categories);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setError('Failed to fetch categories');
      });
  }, [history]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    console.log('Adding task:', newTask.title);
    const defaultCategory = categories.find(category => category.name === 'Default Category');
    if (!defaultCategory) {
      console.error('Default Category not found');
      setError('Default Category not found');
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
        console.log('Task added:', data.id);
        setTasks([...tasks, { ...newTask, id: data.id, categoryId: defaultCategory.id }]);
        setNewTask({ title: '', description: '', status: '', tags: '' });
        setTaskMenuVisible(false);
      })
      .catch(err => {
        console.error('Failed to add task:', err);
        setError('Failed to add task');
      });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    console.log('Adding category:', newCategory);
    fetch('http://localhost:3001/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newCategory }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Category added:', data.id);
        setCategories([...categories, { name: newCategory, id: data.id }]);
        setNewCategory('');
        setCategoryMenuVisible(false);
      })
      .catch(err => {
        console.error('Failed to add category:', err);
        setError('Failed to add category');
      });
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === parseInt(draggableId)) {
        return {
          ...task,
          categoryId: parseInt(destination.droppableId)
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    const taskId = parseInt(draggableId);
    const newCategoryId = parseInt(destination.droppableId);

    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ categoryId: newCategoryId }),
    }).catch(err => {
      console.error('Failed to update task category:', err);
      setError('Failed to update task category');
      setTasks(tasks);
    });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const toggleTaskMenu = () => {
    setTaskMenuVisible(!taskMenuVisible);
  };

  const toggleCategoryMenu = () => {
    setCategoryMenuVisible(!categoryMenuVisible);
  };

  return (
    <motion.div 
      className={`task-container ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sidebar">
        <div className="sidebar-icon" onClick={toggleTaskMenu}>
          <span>Add Task</span>
        </div>
        <div className="sidebar-icon" onClick={toggleCategoryMenu}>
          <span>Add Category</span>
        </div>
      </div>

      {taskMenuVisible && (
        <div className="menu-overlay">
          <div className="menu-box">
            <h2>Create Task</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newTask.title}
              onChange={handleInputChange}
              className="task-input"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleInputChange}
              className="task-input"
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              value={newTask.status}
              onChange={handleInputChange}
              className="task-input"
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={newTask.tags}
              onChange={handleInputChange}
              className="task-input"
            />
            <motion.button 
              onClick={handleAddTask} 
              className="task-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Add Task
            </motion.button>
          </div>
        </div>
      )}

      {categoryMenuVisible && (
        <div className="menu-overlay">
          <div className="menu-box">
            <h2>Create Category</h2>
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="task-input"
            />
            <motion.button 
              onClick={handleAddCategory} 
              className="task-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Add Category
            </motion.button>
          </div>
        </div>
      )}

      <h1 className="task-title">Your Tasks</h1>
      {error && <div className="task-error">{error}</div>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="categories">
          {categories.map(category => (
            <Droppable key={category.id} droppableId={category.id.toString()}>
              {(provided) => (
                <div 
                  className="category"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{category.name}</h2>
                  <ul className="task-list">
                    {tasks
                      .filter(task => task.categoryId === category.id)
                      .map((task, index) => (
                        <Draggable 
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
                              initial={false}
                              layout
                            >
                              <h2>{task.title}</h2>
                              <p>{task.description}</p>
                              <p>Status: {task.status}</p>
                              <p>Tags: {task.tags}</p>
                              <img src={optionsIcon} alt="Options" className="task-options" />
                            </motion.li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </motion.div>
  );
}

export default TaskPage;