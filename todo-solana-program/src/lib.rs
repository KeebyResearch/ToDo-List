use solana_program::{
    account_info::AccountInfo, 
    entrypoint, 
    entrypoint::ProgramResult, 
    pubkey::Pubkey,
    program_error::ProgramError,
    msg, // Import the msg! macro
};

// Import modules
pub mod processor;
pub mod instruction;
pub mod state;
pub mod error;

// Import the process function from the task_processor module
use crate::processor::task_processor::process;

// Define the entry point of the program
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Delegate processing to the processor module
    process(program_id, accounts, instruction_data)
        .map_err(|e| {
            msg!("Error processing instruction: {:?}", e); 
            e // Return the error directly
        }) // Ensure proper propagation of the error
}
