// components/TaskList.tsx
import React, { useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
};

type TaskListProps = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onUpdate }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [updatedDescription, setUpdatedDescription] = useState<string>("");

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
  };

  const handleSave = (id: string) => {
    onUpdate(id, updatedTitle, updatedDescription);
    setEditingTaskId(null); // Stop editing after saving
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Your Tasks</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                  />
                ) : (
                  task.title
                )}
              </td>
              <td>
                {editingTaskId === task.id ? (
                  <textarea
                    className="form-control"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />
                ) : (
                  task.description
                )}
              </td>
              <td>
                {editingTaskId === task.id ? (
                  <button
                    onClick={() => handleSave(task.id)}
                    className="btn btn-success me-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(task)}
                    className="btn btn-warning me-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onDelete(task.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
