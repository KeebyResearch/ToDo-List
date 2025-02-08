import { Connection, Transaction, TransactionInstruction, PublicKey } from "@solana/web3.js";


const PROGRAM_ID = new PublicKey("FzPaC3CfaXQgwZBJgXpHWAHJXuzuaDQS6kghzH8fPHN3");

let connectionInstance: Connection | null = null;

export const getConnection = (): Connection => {
  if (!connectionInstance) {
    const RPC_URL = "https://api.devnet.solana.com";
    connectionInstance = new Connection(RPC_URL, "confirmed");
    console.log("New Solana connection initialized:", RPC_URL);
  }
  return connectionInstance;
};



const sendAndConfirmTransaction = async (
  transaction: Transaction,
  connection: Connection | null,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  payer: PublicKey,
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
): Promise<string> => {
  try {
    if (!connection) {
      throw new Error("Solana connection is not initialized.");
    }

    if (!payer) {
      throw new Error("Wallet not connected!");
    }

    transaction.feePayer = payer;

    // Fetch latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    console.log("Transaction prepared:", transaction);

    // Sign transaction 
    if (signTransaction) {
      transaction = await signTransaction(transaction);
    }

    const signature = await sendTransaction(transaction, connection);

    // Confirm transaction
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

    console.log("Transaction confirmed:", signature);
    return signature;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Transaction failed. Please try again.");
  }
};



// CREATE TASK
export const createTask = async (
  title: string,
  description: string,
  payer: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  connection: Connection
): Promise<string> => {
  try {
    if (!payer) {
      throw new Error("Wallet not connected! Please connect your wallet.");
    }

    console.log("Creating task with payer:", payer.toBase58());

    const instructionData = Buffer.from(JSON.stringify({ title, description }));

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: payer, isSigner: true, isWritable: true }],
        programId: PROGRAM_ID,
        data: instructionData
      })
    );

    return await sendAndConfirmTransaction(transaction, connection, sendTransaction, payer); // ✅ Ensure payer is passed
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task.");
  }
};

export const deleteTask = async (
  taskId: string,
  payer: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  connection: Connection
): Promise<string> => {
  try {
    if (!payer) throw new Error("Wallet not connected!");

    const instructionData = Buffer.from(JSON.stringify({ id: taskId, action: "delete" }));

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: new PublicKey(taskId), isSigner: false, isWritable: true }],
        programId: PROGRAM_ID,
        data: instructionData
      })
    );

    return await sendAndConfirmTransaction(transaction, connection, sendTransaction, payer);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task.");
  }
};



// UPDATE TASK
export const updateTask = async (
  taskId: string,
  title: string,
  description: string,
  payer: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  connection: Connection
): Promise<string> => {
  try {
    if (!payer) throw new Error("Wallet not connected!");

    const instructionData = Buffer.from(JSON.stringify({ id: taskId, title, description }));

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: new PublicKey(taskId), isSigner: false, isWritable: true }],
        programId: PROGRAM_ID,
        data: instructionData
      })
    );

    return await sendAndConfirmTransaction(transaction, connection, sendTransaction);
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task.");
  }
};

// FETCH ALL TASKS (Mocked for now)
export const getAllTasks = async (publicKey: PublicKey): Promise<any[]> => {
  if (!publicKey) {
    console.error("Wallet not connected!");
    return [];
  }

  console.log("Fetching tasks for:", publicKey.toBase58());


  return [
    { id: "task1", title: "Task 1", description: "Sample Task 1" },
    { id: "task2", title: "Task 2", description: "Sample Task 2" }
  ];
};

export const sendTransaction = async (
  transaction: Transaction,
  connection: Connection
): Promise<string> => {
  try {
    const rawTransaction = transaction.serialize();
    const { signature } = await connection.sendRawTransaction(rawTransaction);
    return signature;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw new Error("Failed to send transaction.");
  }
};
