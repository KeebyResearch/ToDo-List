use borsh::{BorshDeserialize, BorshSerialize};
use crate::state::task_state::Task;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct User {
    pub id: u64,
    pub username: String,
    pub tasks: Vec<Task>,
}

impl User {
    pub fn add_task(&mut self, task: Task) -> Result<(), String> {
        if self.tasks.iter().any(|t| t.id == task.id) {
            Err("Task with the same ID already exists".to_string())
        } else {
            self.tasks.push(task);
            Ok(())
        }
    }

    pub fn remove_task(&mut self, task_id: u64) -> Result<(), String> {
        if self.tasks.iter().any(|t| t.id == task_id) {
            self.tasks.retain(|task| task.id != task_id);
            Ok(())
        } else {
            Err("Task with the given ID does not exist".to_string())
        }
    }

    pub fn update_task(&mut self, task_id: u64, updated_task: Task) -> Result<(), String> {
        if let Some(task) = self.tasks.iter_mut().find(|t| t.id == task_id) {
            *task = updated_task;
            Ok(())
        } else {
            Err("Task with the given ID does not exist".to_string())
        }
    }
}
