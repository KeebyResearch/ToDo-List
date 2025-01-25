import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from "../utils/mockSolana";

type Task = {
  id: string;
  title: string;
  description: string;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch all tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await getAllTasks();
    console.log("Fetched tasks:", fetchedTasks); // Check if tasks are fetched correctly
    setTasks(fetchedTasks); // Update state
  };

  const handleCreate = async (title: string, description: string) => {
    const newTaskId = await createTask(title, description); // Create task
    const newTask = { id: newTaskId, title, description };
    setTasks((prevTasks) => [...prevTasks, newTask]); // Directly update state with the new task
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    await fetchTasks(); // Refresh tasks list after deletion
  };

  const handleUpdate = async (
    id: string,
    title: string,
    description: string
  ) => {
    await updateTask(id, title, description);
    await fetchTasks(); // Refresh tasks list after update
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do DApp</h1>

      {/* Task Form */}
      <div className="mb-5">
        <TaskForm onSubmit={handleCreate} />
      </div>

      {/* Task List */}
      <div>
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default Home;
