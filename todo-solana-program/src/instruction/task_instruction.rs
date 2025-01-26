use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum TodoInstruction {
    CreateTask { title: String, description: String }, // Added description field
    UpdateTask { id: u64, title: Option<String>, description: Option<String> }, // Updated to include optional description
    DeleteTask { id: u64 },
    ToggleTask { id: u64 }, // Added toggle task instruction
}

impl TodoInstruction {
    pub fn get_id(&self) -> Option<u64> {
        match self {
            TodoInstruction::CreateTask { .. } => None,
            TodoInstruction::UpdateTask { id, .. } => Some(*id),
            TodoInstruction::DeleteTask { id } => Some(*id),
            TodoInstruction::ToggleTask { id } => Some(*id), // Added toggle task
        }
    }
}
