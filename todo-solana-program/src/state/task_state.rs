use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Eq)]
pub struct UserTasks {
    pub tasks: Vec<Task>,
    pub next_task_id: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Eq)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub description: String, // Ensure description field is included
    pub status: TaskStatus,
    pub completed: bool,
    pub initializer: Pubkey,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Eq)]
pub enum TaskStatus {
    Pending,
    InProgress,
    Completed,
    Cancelled,
}

impl UserTasks {
    pub fn add_task(&mut self, task: Task) {
        self.tasks.push(task);
        self.next_task_id += 1;
    }

    pub fn get_task(&self, task_id: u64) -> Option<&Task> {
        self.tasks.iter().find(|task| task.id == task_id)
    }

    pub fn update_task(&mut self, task_id: u64, updated_task: Task) -> bool {
        if let Some(task) = self.get_task_mut(task_id) {
            *task = updated_task;
            true
        } else {
            false
        }
    }

    pub fn delete_task(&mut self, task_id: u64) -> bool {
        if let Some(pos) = self.tasks.iter().position(|task| task.id == task_id) {
            self.tasks.remove(pos);
            true
        } else {
            false
        }
    }

    fn get_task_mut(&mut self, task_id: u64) -> Option<&mut Task> {
        self.tasks.iter_mut().find(|task| task.id == task_id)
    }
}
