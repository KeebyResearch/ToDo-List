import { useEffect, useState } from "react";
import { getConnection, createTask, updateTask, deleteTask, getAllTasks } from "../../utils/solana";
import { useWalletConnection } from "../Wallet/useWalletConnection";

export const useSolanaTask = () => {
  const [tasks, setTasks] = useState([]);
  const { publicKey, connected, sendTransaction } = useWalletConnection();
  const [connection, setConnection] = useState(null);

  useEffect(() => {
   
    const conn = getConnection();
    setConnection(conn);
    console.log("Solana connection initialized:", conn);
  }, []);

  useEffect(() => {
    if (publicKey && connection) fetchTasks();
  }, [publicKey, connection]);

  const fetchTasks = async () => {
    if (!publicKey || !connection) return;

    try {
      const fetchedTasks = await getAllTasks(publicKey);
      console.log("Fetched tasks:", fetchedTasks);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreate = async (title: string, description: string) => {
    if (!connected || !publicKey || !sendTransaction || !connection) {
      alert("Please connect your wallet first!");
      return;
    }
  
    try {
      console.log("Creating task with wallet:", publicKey.toBase58());
  
      const newTaskId = await createTask(title, description, publicKey, sendTransaction, connection);
      setTasks((prevTasks) => [...prevTasks, { id: newTaskId, title, description }]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  

  return { tasks, handleCreate, fetchTasks };
};
