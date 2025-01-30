import { useEffect, useState, useMemo } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { getAllTasks, createTask, updateTask, deleteTask } from "../utils/mockSolana";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

type Task = {
  id: string;
  title: string;
  description: string;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

 
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await getAllTasks();
    console.log("Fetched tasks:", fetchedTasks); 
    setTasks(fetchedTasks);
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

  // Define the wallet adapters
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="container mt-5">
            <h1 className="text-center mb-4">To-Do DApp</h1>

            {/* Connect Wallet Button */}
            <div className="d-flex justify-content-center mb-4">
              <WalletMultiButton />
            </div>

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
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Home;
