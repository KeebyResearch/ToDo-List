#[cfg(test)]
mod tests {
    use crate::{state::task_state::{UserTasks, Task}, instruction::TodoInstruction}; 
    use borsh::{BorshSerialize, BorshDeserialize}; 
    use crate::processor::process_instruction; 
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_create_update_delete_task() {
        let mut task_list = UserTasks {
            tasks: vec![],
            next_task_id: 1,
        };

        // Create Task
        let create_instruction = TodoInstruction::CreateTask {
            title: "New Task".to_string(),
            description: "Task description".to_string(),
        };

        task_list.add_task(Task {
            id: task_list.next_task_id,
            title: create_instruction.title,
            description: create_instruction.description,
            completed: false,
            status: TaskStatus::Pending,
            initializer: Pubkey::new_unique(),
        });
        assert_eq!(task_list.tasks.len(), 1);

        // Update Task
        let update_instruction = TodoInstruction::UpdateTask {
            id: 1,
            title: Some("Updated Task".to_string()),
            description: None,
        };

        if let TodoInstruction::UpdateTask { id, title, description } = update_instruction {
            let task = Task {
                id,
                title: title.unwrap_or_else(|| task_list.get_task(id).unwrap().title.clone()),
                description: description.unwrap_or_else(|| task_list.get_task(id).unwrap().description.clone()),
                completed: false,
                status: TaskStatus::Pending,
                initializer: Pubkey::new_unique(),
            };
            task_list.update_task(id, task);
        }
        assert_eq!(task_list.tasks[0].title, "Updated Task");

        // Delete Task
        let delete_instruction = TodoInstruction::DeleteTask { id: 1 };

        if let TodoInstruction::DeleteTask { id } = delete_instruction {
            task_list.delete_task(id);
        }
        assert_eq!(task_list.tasks.len(), 0);
    }
}
