#[cfg(test)]
mod tests {
    use crate::{state::{UserTasks, Task}, instruction::TodoInstruction, user::User}; 
    use borsh::{BorshSerialize, BorshDeserialize}; 
    use crate::processor::process; 
    use solana_program::pubkey::Pubkey;
    use solana_program::account_info::AccountInfo;
    use solana_program::program_error::ProgramError;
    use solana_program::clock::Clock;
    #[test]
    fn test_create_task() {
        let mut user_tasks: UserTasks = UserTasks {
            tasks: vec![],
        };

        let title = "Test Task".to_string();
        let description = "This is a test task.".to_string();
        let task_id = 1; // Provide a valid task_id
        let status = "Pending".to_string(); // Provide a valid status

        let accounts = vec![AccountInfo::new(
            &Pubkey::new_unique(), 
            false, 
            true, 
            &mut user_tasks.try_to_vec().unwrap(), 
            false, 
            &Pubkey::new_unique(), 
            false, 
            0
        )];

        let result = process( 
            &Pubkey::new_unique(), 
            &accounts,
            &TodoInstruction::CreateTask { title, description, task_id, status }.try_to_vec().unwrap(), 
        );

        assert!(result.is_ok());
        assert_eq!(user_tasks.tasks.len(), 1);
        assert_eq!(user_tasks.tasks[0].title, title);
    }

    #[test]
    fn test_update_task() {
        let mut user_tasks = UserTasks {
            tasks: vec![Task { id: 1, title: "Old Task".to_string(), description: "Old description".to_string(), status: TaskStatus::Pending }],
        };

        let new_title = Some("Updated Task".to_string());
        let new_description = Some("Updated description".to_string());

        let accounts = vec![AccountInfo::new(
            &Pubkey::new_unique(), 
            false, 
            true, 
            &mut user_tasks.try_to_vec().unwrap(), 
            false
        )];

        let result = process( 
            &Pubkey::new_unique(), 
            &accounts,
            &TodoInstruction::UpdateTask { task_id: 1, title: new_title, description: new_description, status: None }.try_to_vec().unwrap(), 
        );

        assert!(result.is_ok());
        assert_eq!(user_tasks.tasks[0].title, "Updated Task");
    }

    #[test]
    fn test_delete_task() {
        let mut user_tasks = UserTasks {
            tasks: vec![Task { id: 1, title: "Task to delete".to_string(), description: "Description".to_string(), status: TaskStatus::Pending }],
        };

        let accounts = vec![AccountInfo::new(
            &Pubkey::new_unique(), 
            false, 
            true, 
            &mut user_tasks.try_to_vec().unwrap(), 
            false
        )];

        let result = process( 
            &Pubkey::new_unique(), 
            &accounts,
            &TodoInstruction::DeleteTask { task_id: 1 }.try_to_vec().unwrap(), 
        );

        assert!(result.is_ok());
        assert!(user_tasks.tasks.is_empty());
    }

    #[test]
    fn test_task_not_found() {
        let mut user_tasks = UserTasks {
            tasks: vec![],
        };

        let accounts = vec![AccountInfo::new(
            &Pubkey::new_unique(), 
            false, 
            true, 
            &mut user_tasks.try_to_vec().unwrap(), 
            false
        )];

        let result = process( 
            &Pubkey::new_unique(), 
            &accounts,
            &TodoInstruction::UpdateTask { task_id: 1, title: None, description: None, status: None }.try_to_vec().unwrap(),
        );

        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), ProgramError::InvalidArgument);
    }

    #[test]
    fn test_task_already_exists() {
        let mut user_tasks = UserTasks {
            tasks: vec![Task { id: 1, title: "Existing Task".to_string(), description: "Description".to_string(), status: TaskStatus::Pending }],
        };

        let accounts = vec![AccountInfo::new(
            &Pubkey::new_unique(), 
            false, 
            true, 
            &mut user_tasks.try_to_vec().unwrap(), 
            false
        )];

        let result = process(
            &Pubkey::new_unique(), 
            &accounts,
            &TodoInstruction::CreateTask { title: "Existing Task".to_string(), description: "Another description".to_string(), task_id: 1, status: "Pending".to_string() }.try_to_vec().unwrap(),
        );

        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), ProgramError::InvalidArgument);
    }
}
