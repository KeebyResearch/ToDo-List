import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { WalletConnectionProvider, useWalletConnection } from "../hooks/Wallet/useWalletConnection";
import { useSolanaTask } from "../hooks/Task/useSolanaTasks";
import dynamic from "next/dynamic";

const Home = () => {
  const { tasks, handleCreate, handleDelete, handleUpdate } = useSolanaTask();
  const { connected } = useWalletConnection();
  const WalletMultiButtonDynamic = dynamic(
    () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
    { ssr: false }
  );

  return (
    <WalletConnectionProvider>
      <div className="container mt-5">
        <h1 className="text-center mb-4">To-Do DApp</h1>

        {/* Connect Wallet Button */}
        <div className="d-flex justify-content-center mb-4">
          <WalletMultiButtonDynamic />
        </div>

        {/* Task Form (Only show if wallet is connected) */}
        {connected && (
          <div className="mb-5">
            <TaskForm onSubmit={handleCreate} />
          </div>
        )}

        {/* Task List */}
        <div>
          <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
      </div>
    </WalletConnectionProvider>
  );
};

export default Home;
