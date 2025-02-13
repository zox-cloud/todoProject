import React, { useState, useEffect } from "react";
import {
  GetTasks,
  CreateTask,
  UpdateTask,
  DeleteTask,
} from "../wailsjs/go/backend/API";


const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return { color: "#e74c3c", fontWeight: "bold" }; // Red
    case "Medium":
      return { color: "#f39c12", fontWeight: "bold" }; // Orange
    case "Low":
      return { color: "#27ae60", fontWeight: "bold" }; // Green
    default:
      return { color: "#000" };
  }
};


function formatDisplayDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",  
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false     
  });
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("High");


  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [editingPriority, setEditingPriority] = useState("High");

  const [taskToDelete, setTaskToDelete] = useState(null);

  const formatDateToISO = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
  };

  
  const loadTasks = async () => {
    try {
      const result = await GetTasks();
      console.log("Loaded tasks:", result);
      setTasks(result);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);


  const addTask = async () => {
    if (!description.trim()) return;
    try {
      await CreateTask(description, formatDateToISO(dueDate), priority);
      setDescription("");
      setDueDate("");
      setPriority("High");
      loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

 
  const confirmDeleteTask = async () => {
    try {
      await DeleteTask(taskToDelete.ID);
      setTaskToDelete(null);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  
  const toggleTask = async (task) => {
    try {
      await UpdateTask(
        task.ID,
        task.description,
        !task.completed,
        task.due_date,
        task.priority
      );
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

 
  const startEditing = (task) => {
    setEditingTaskId(task.ID);
    setEditingDescription(task.description || "");
    setEditingDueDate(task.due_date || "");
    setEditingPriority(task.priority || "High");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingDescription("");
    setEditingDueDate("");
    setEditingPriority("High");
  };

  
  const saveTaskUpdate = async (task) => {
    try {
      await UpdateTask(
        task.ID,
        editingDescription,
        task.completed,
        formatDateToISO(editingDueDate),
        editingPriority
      );
      setEditingTaskId(null);
      setEditingDescription("");
      setEditingDueDate("");
      setEditingPriority("High");
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

 
  const openDeleteModal = (task) => {
    setTaskToDelete(task);
  };

  
  const closeDeleteModal = () => {
    setTaskToDelete(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>To-Do List</h1>

      
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter new task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button style={styles.button} onClick={addTask}>
          Add Task
        </button>
      </div>

      
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Task Description</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Due Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            
            const displayDate = formatDisplayDate(task.due_date || task.created_at);

            return (
              <tr key={task.ID} style={styles.tr}>
               
                <td style={styles.td}>
                  {editingTaskId === task.ID ? (
                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      style={{ ...styles.input, marginRight: "10px" }}
                    />
                  ) : (
                    <span
                      style={{
                        textDecoration: task.completed ? "line-through black" : "none",
                      }}
                    >
                      {task.description}
                    </span>
                  )}
                </td>

                
                <td style={styles.td}>
                  {editingTaskId === task.ID ? (
                    <>
                      <input
                        type="datetime-local"
                        value={editingDueDate}
                        onChange={(e) => setEditingDueDate(e.target.value)}
                        style={{ ...styles.input, marginRight: "10px" }}
                      />
                      <select
                        value={editingPriority}
                        onChange={(e) => setEditingPriority(e.target.value)}
                        style={{ ...styles.select, marginRight: "10px" }}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </>
                  ) : (
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                      style={styles.checkbox}
                    />
                  )}
                </td>

              
                <td style={styles.td}>
                  <em>{displayDate}</em>
                  <br />
                  <em style={getPriorityColor(task.priority)}>
                    Priority: {task.priority}
                  </em>
                </td>

              
                <td style={styles.td}>
                  {editingTaskId === task.ID ? (
                    <>
                      <button
                        style={styles.button}
                        onClick={() => saveTaskUpdate(task)}
                      >
                        Save
                      </button>
                      <button
                        style={{ ...styles.button, backgroundColor: "#7f8c8d", marginLeft: "5px" }}
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        style={styles.editBtn}
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => openDeleteModal(task)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

     
      {taskToDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ color: "black" }}>Confirm Deletion</h2>
            <p style={{ color: "black" }}>
              Are you sure you want to delete the task:
            </p>
            <p style={{ fontWeight: "bold", color: "black" }}>
              {taskToDelete.description}
            </p>
            <div style={styles.modalButtons}>
              <button style={styles.button} onClick={confirmDeleteTask}>
                Yes, Delete
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#7f8c8d" }}
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    backgroundColor: "#2c3e50",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    marginBottom: "20px",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    minWidth: "180px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    minWidth: "120px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  tableHeader: {
    background: "linear-gradient(to right, #7bed9f, #4834d4)",
    color: "#fff",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "normal",
    position: "relative",
  },
  tr: {
    borderBottom: "1px solid #ccc",
  },
  td: {
    padding: "12px",
    verticalAlign: "middle",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  editBtn: {
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
    marginRight: "5px",
    transition: "background-color 0.3s ease",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  },
  modalButtons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
  },
};

export default App;
