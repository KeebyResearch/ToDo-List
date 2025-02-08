import React, { useState } from "react";

type TaskFormProps = {
  onSubmit: (title: string, description: string) => void;
  initialTitle?: string;
  initialDescription?: string;
};

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialTitle = "",
  initialDescription = ""
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title, description);
      setTitle(""); // Clear title after submit
      setDescription(""); // Clear description after submit
    } else {
      alert("Please fill in both title and description");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="taskTitle" className="form-label">
          Task Title
        </label>
        <input
          type="text"
          className="form-control"
          id="taskTitle"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="taskDescription" className="form-label">
          Task Description
        </label>
        <textarea
          className="form-control"
          id="taskDescription"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Save Task
      </button>
    </form>
  );
};

export default TaskForm;
