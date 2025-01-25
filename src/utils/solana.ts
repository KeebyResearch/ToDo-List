import {
    Connection,
    PublicKey,
    Transaction, Keypair
} from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("Your_Smart_Contract_Address"); // Replace with your deployed Rust contract address
const NETWORK = "https://api.devnet.solana.com"; // Solana Devnet (or Mainnet if live)
const connection = new Connection(NETWORK);

export const getAllTasks = async (): Promise<any[]> => {
  try {
    const accounts = await connection.getProgramAccounts(PROGRAM_ID);
    return accounts.map((account) => {
      const data = account.account.data; // Raw data buffer
      const decodedData = data.toString(); // Assuming UTF-8 encoded string
      const task = JSON.parse(decodedData); // Assuming tasks are JSON-encoded
      return {
        id: account.pubkey.toBase58(),
        title: task.title,
        description: task.description
      };
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const createTask = async (
  title: string,
  description: string,
  payer: Keypair
): Promise<string> => {
  try {
    const instructionData = Buffer.from(JSON.stringify({ title, description })); // Encode data
    const transaction = new Transaction().add({
      keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
      programId: PROGRAM_ID,
      data: instructionData
    });

    const signature = await connection.sendTransaction(transaction, [payer]);
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const deleteTask = async (
  taskId: string,
  payer: Keypair
): Promise<string> => {
  try {
    const transaction = new Transaction().add({
      keys: [
        { pubkey: new PublicKey(taskId), isSigner: false, isWritable: true }
      ],
      programId: PROGRAM_ID,
      data: Buffer.from("delete") // Your smart contract must handle this instruction
    });

    const signature = await connection.sendTransaction(transaction, [payer]);
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  title: string,
  description: string,
  payer: Keypair
): Promise<string> => {
  try {
    const instructionData = Buffer.from(
      JSON.stringify({ id: taskId, title, description })
    ); // Encode data
    const transaction = new Transaction().add({
      keys: [
        { pubkey: new PublicKey(taskId), isSigner: false, isWritable: true }
      ],
      programId: PROGRAM_ID,
      data: instructionData
    });

    const signature = await connection.sendTransaction(transaction, [payer]);
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
