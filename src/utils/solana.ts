import { Connection, Transaction, TransactionInstruction, PublicKey } from "@solana/web3.js";
import { sha256 } from "js-sha256";

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

const findTaskPDA = async (payer: PublicKey, taskId?: string): Promise<PublicKey> => {
  let seed: Buffer;

  if (taskId) {
    seed = Buffer.from(sha256(taskId), "hex").slice(0, 32);
  } else {
    const timestampHash = Buffer.from(sha256(Date.now().toString()), "hex").slice(0, 16);
    seed = Buffer.concat([payer.toBuffer().slice(0, 16), timestampHash]);
  }

  const [pda] = await PublicKey.findProgramAddress([seed], PROGRAM_ID);
  return pda;
};

const sendAndConfirmTransaction = async (
  transaction: Transaction,
  connection: Connection | null,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  payer: PublicKey,
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
): Promise<string> => {
  try {
    if (!connection) throw new Error("Solana connection is not initialized.");
    if (!payer) throw new Error("Wallet not connected!");

    transaction.feePayer = payer;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    if (signTransaction) {
      transaction = await signTransaction(transaction);
    }

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

    return signature;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Transaction failed. Please try again.");
  }
};

export const createTask = async (
  title: string,
  description: string,
  payer: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  connection: Connection
): Promise<string> => {
  try {
    if (!payer) throw new Error("Wallet not connected!");

    const pda = await findTaskPDA(payer);
    const accountInfo = await connection.getAccountInfo(pda);
    if (accountInfo) throw new Error("Task already exists with this PDA.");

    const instructionData = Buffer.from(JSON.stringify({ title, description }));

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: pda, isSigner: false, isWritable: true }],
        programId: PROGRAM_ID,
        data: instructionData
      })
    );

    return await sendAndConfirmTransaction(transaction, connection, sendTransaction, payer);
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

    const pda = await findTaskPDA(payer, taskId);

    const instructionData = Buffer.from(JSON.stringify({ id: taskId, action: "delete" }));

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: pda, isSigner: false, isWritable: true }],
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

    const pda = await findTaskPDA(payer, taskId);

    const instructionData = Buffer.from(JSON.stringify({ id: taskId, title, description }));

    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: pda, isSigner: false, isWritable: true }],
        programId: PROGRAM_ID,
        data: instructionData
      })
    );

    return await sendAndConfirmTransaction(transaction, connection, sendTransaction, payer);
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task.");
  }
};

export const getAllTasks = async (publicKey: PublicKey): Promise<any[]> => {
  if (!publicKey) {
    console.error("Wallet not connected!");
    return [];
  }

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
