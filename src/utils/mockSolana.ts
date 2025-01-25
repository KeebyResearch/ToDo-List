import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  title: string;
  description: string;
};

let tasks: Task[] = [
  {
    id: uuidv4(),
    title: "Sample Task 1",
    description: "This is a sample description"
  },
  {
    id: uuidv4(),
    title: "Sample Task 2",
    description: "Another sample description"
  }
];

export const getAllTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(tasks), 500)); // Simulates a network call
};

export const createTask = async (
  title: string,
  description: string
): Promise<string> => {
  return new Promise((resolve) => {
    const newTask = { id: uuidv4(), title, description };
    tasks.push(newTask);
    setTimeout(() => resolve(newTask.id), 500);
  });
};

export const updateTask = async (
  id: string,
  title: string,
  description: string
): Promise<void> => {
  return new Promise((resolve) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, title, description } : task
    );
    setTimeout(() => resolve(), 500);
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    tasks = tasks.filter((task) => task.id !== id);
    setTimeout(() => resolve(), 500);
  });
};
