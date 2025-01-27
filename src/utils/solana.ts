import {
  Connection,
  PublicKey,
  Transaction,
  Keypair, TransactionInstruction
} from "@solana/web3.js";
import { serialize } from "borsh";

const PROGRAM_ID = new PublicKey(
  "program key dapat dito"
);
const NETWORK = "https://api.devnet.solana.com";
const connection = new Connection(NETWORK);

class CreateTaskInstruction {
    constructor(properties: { [x: string]: any; title?: string; description?: string; }) {
        Object.keys(properties).forEach((key) => {
            this[key] = properties[key];
        });
    }
}

const CreateTaskSchema = new Map([
    [CreateTaskInstruction, { kind: 'struct', fields: [['title', 'string'], ['description', 'string']] }]
]);

export const getAllTasks = async (): Promise<any[]> => {
  try {
    const accounts = await connection.getProgramAccounts(PROGRAM_ID);
    return accounts.map((account) => {
      const data = account.account.data; 
      const decodedData = data.toString(); 
      const task = JSON.parse(decodedData);
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
        const instructionData = serialize(CreateTaskSchema, new CreateTaskInstruction({ title, description }));
        const transaction = new Transaction().add(new TransactionInstruction({
            keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
            programId: PROGRAM_ID,
            data: Buffer.from(instructionData)
        }));

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
      data: Buffer.from("delete") 
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
