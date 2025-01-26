use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

// Define the Task structure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub completed: bool,
}

// Define the account data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TaskList {
    pub owner: Pubkey,
    pub tasks: Vec<Task>,
}

pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> Result<(), ProgramError> {
    process_instruction(program_id, accounts, instruction_data)
}

// Existing process_instruction function
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> Result<(), ProgramError> {
    let account_info_iter = &mut accounts.iter();
    let task_list_account = next_account_info(account_info_iter)?;

    if task_list_account.owner != program_id {
        msg!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut task_list = TaskList::try_from_slice(&task_list_account.data.borrow())?;
    let instruction: TodoInstruction = TodoInstruction::try_from_slice(instruction_data)?;

    match instruction {
        TodoInstruction::CreateTask { title, description } => {
            let id = task_list.tasks.len() as u64 + 1;
            task_list.tasks.push(Task {
                id,
                title,
                description,
                completed: false,
            });
            msg!("Task {} created successfully", id);
        }
        TodoInstruction::UpdateTask {
            task_id,
            title,
            description,
        } => {
            if let Some(task) = task_list.tasks.iter_mut().find(|t| t.id == task_id) {
                if let Some(new_title) = title {
                    task.title = new_title;
                }
                if let Some(new_description) = description {
                    task.description = new_description;
                }
                msg!("Task {} updated successfully", task_id);
            } else {
                msg!("Task with ID {} not found", task_id);
                return Err(ProgramError::InvalidArgument);
            }
        }
        TodoInstruction::DeleteTask { task_id } => {
            if let Some(index) = task_list.tasks.iter().position(|t| t.id == task_id) {
                task_list.tasks.remove(index);
                msg!("Task {} deleted successfully", task_id);
            } else {
                msg!("Task with ID {} not found", task_id);
                return Err(ProgramError::InvalidArgument);
            }
        }
        TodoInstruction::ToggleTask { task_id } => {
            if let Some(task) = task_list.tasks.iter_mut().find(|t| t.id == task_id) {
                task.completed = !task.completed;
                msg!("Task {} toggled successfully", task_id);
            } else {
                msg!("Task with ID {} not found", task_id);
                return Err(ProgramError::InvalidArgument);
            }
        }
    }

    task_list.serialize(&mut &mut task_list_account.data.borrow_mut()[..])?;
    Ok(())
}

// Define the TodoInstruction enum
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TodoInstruction {
    CreateTask { title: String, description: String },
    UpdateTask { task_id: u64, title: Option<String>, description: Option<String> },
    DeleteTask { task_id: u64 },
    ToggleTask { task_id: u64 },
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_update_delete_task() {
        let mut task_list = TaskList {
            owner: Pubkey::new_unique(),
            tasks: vec![],
        };

        // Create Task
        let create_instruction = TodoInstruction::CreateTask {
            title: "New Task".to_string(),
            description: "Task description".to_string(),
        };

        if let TodoInstruction::CreateTask { title, description } = create_instruction {
            let id = task_list.tasks.len() as u64 + 1;
            task_list.tasks.push(Task {
                id,
                title,
                description,
                completed: false,
            });
        }
        assert_eq!(task_list.tasks.len(), 1);

        // Update Task
        let update_instruction = TodoInstruction::UpdateTask {
            task_id: 1,
            title: Some("Updated Task".to_string()),
            description: Some("Updated description".to_string()),
        };

        if let TodoInstruction::UpdateTask { task_id, title, description } = update_instruction {
            if let Some(task) = task_list.tasks.iter_mut().find(|t| t.id == task_id) {
                if let Some(new_title) = title {
                    task.title = new_title;
                }
                if let Some(new_description) = description {
                    task.description = new_description;
                }
            }
        }
        assert_eq!(task_list.tasks[0].title, "Updated Task");

        // Delete Task
        let delete_instruction = TodoInstruction::DeleteTask { task_id: 1 };

        if let TodoInstruction::DeleteTask { task_id } = delete_instruction {
            if let Some(index) = task_list.tasks.iter().position(|t| t.id == task_id) {
                task_list.tasks.remove(index);
            }
        }
        assert_eq!(task_list.tasks.len(), 0);
    }
}
