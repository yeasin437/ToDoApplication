import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

//  backend URL
const API_URL = "https://todoapplication-backend-iz5j.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post(API_URL, { title: newTask });
        setTasks([...tasks, response.data]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        completed: !completed,
      });
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            <div
              className={`circle ${task.completed ? "completed" : ""}`}
              onClick={() => toggleTask(task._id, task.completed)}
            ></div>
            <span>{task.title}</span>
            <button
              className={`status-btn ${
                task.completed ? "completed" : "incomplete"
              }`}
              onClick={() => toggleTask(task._id, task.completed)}
            >
              {task.completed ? "Completed" : "Incomplete"}
            </button>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
